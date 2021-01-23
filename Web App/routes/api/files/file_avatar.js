const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const FileAvatar = require("../../../models/lampiran/File_Avatar");
const User = require("../../../models/user_model/User");

const multer = require("multer");
var AWS = require("aws-sdk");
var fs = require("fs");
const { ObjectId } = require("mongodb");
const { v4: uuidv4 } = require("uuid");

var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Get all Documents Routes
router.get("/", (req, res, next) => {
  FileAvatar.find(
    {},
    null,
    {
      sort: { createdAt: 1 },
    },
    (err, docs) => {
      if (err) {
        return next(err);
      }
      res.status(200).send(docs);
    }
  );
});

// route to upload a pdf document file
// In upload.single("file") - the name inside the single-quote is the name of the field that is going to be uploaded.
router.post("/upload/:id", upload.single("avatar"), (req, res) => {
  const { file } = req;
  const { id } = req.params;

  let s3bucket = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });
  //Where you want to store your file
  var params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: "avatar/" + uuidv4() + "_" + file.originalname,
    Body: file.buffer,
    ContentType: file.mimetype,
    ContentDisposition: `inline;filename=${file.originalname}`,
  };
  s3bucket.upload(params, function (err, data) {
    if (err) {
      return res.status(500).json({ error: true, Message: err });
    }

    FileAvatar.findOneAndDelete(
      { user_id: id },
      function (error, file, result) {
        console.log(file);
        if (!file) {
          return "No avatar uplaoded";
        }
        let params = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: file.s3_key,
        };
        s3bucket.deleteObject(params, (error, data) => {
          if (error) return res.status(404).json(error);
        });
      }
    );

    var newFileUploaded = {
      filename: file.originalname,
      s3_key: params.Key,
      s3_directory: "avatar/",
      user_id: ObjectId(id),
    };

    var document = new FileAvatar(newFileUploaded);
    document.save(function (error, newFile) {
      if (error) {
        return res.status(404).json(error);
      }
      console.log("USER ID:", id);
      console.log("New file: ", newFile._id);
      User.findOneAndUpdate(
        { _id: id },
        { $set: { avatar: newFile._id } },
        { new: true },
        (error, user) => {
          if (error) {
            return res.status(404).json(error);
          }

          var payload = {
            _id: user._id,
            role: user.role,
            avatar: user.avatar,

            //Informasi Pribadi
            name: user.name,
            tanggal_lahir: user.tanggal_lahir,
            jenis_kelamin: user.jenis_kelamin,
            sekolah: user.sekolah,

            //Kontak
            email: user.email,
            phone: user.phone,
            emergency_phone: user.emergency_phone,
            address: user.address,

            //Kontak
            hobi_minat: user.hobi_minat,
            ket_non_teknis: user.ket_non_teknis,
            cita_cita: user.cita_cita,
            uni_impian: user.uni_impian,
          };
          if (user.role === "Student") {
            payload.kelas = user.kelas;
            payload.tugas = user.tugas;
          } else if (user.role === "Teacher") {
            payload.subject_teached = user.subject_teached;
          }

          console.log("Success!!!");
          return res.json({
            success: "Successfully uploaded the lampiran file",
            user: payload,
          });
        }
      );
    });
  });
});

router.get("/download/:id", (req, res) => {
  let s3bucket = new AWS.S3();

  FileAvatar.find({ user_id: req.params.id }).then((result, err) => {
    if (!result) return res.status(400).json(err);

    let params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: result.s3_key,
      Expires: 5 * 60,
      ResponseContentDisposition: `attachment;filename=${result.filename}`,
    };
    const url = s3bucket.getSignedUrl("getObject", params);
    return res.status(200).json(url);
  });
});

// Router to delete a DOCUMENT file
router.delete("/:id", (req, res) => {
  const { file_to_delete } = req.body;
  // if file_to_delete is undefined,means that the object is deleted and hence all files should be deleted.
  if (!file_to_delete) {
    FileAvatar.find({ user_id: req.params.id }).then((avatars) => {
      let id_list = avatars.map((m) => Object(m._id));
      let file_to_delete = avatars;

      FileAvatar.deleteMany(
        {
          _id: {
            $in: id_list,
          },
        },
        function (err, results) {
          if (!results) {
            return res.status(404).json(err);
          }
          //Now Delete the file from AWS-S3
          // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#deleteObject-property
          let s3bucket = new AWS.S3();
          file_to_delete.forEach((file) => {
            let params = {
              Bucket: process.env.AWS_BUCKET_NAME,
              Key: file.s3_key,
            };
            s3bucket.deleteObject(params, (err, data) => {
              if (!data) return res.status(404).json(err);
            });
          });
          return res.status(200).send("Success");
        }
      );
    });
  } else {
    let id_list = file_to_delete.map((m) => Object(m._id));
    FileAvatar.deleteMany(
      {
        _id: {
          $in: id_list,
        },
      },
      function (err, results) {
        if (!results) {
          return res.status(404).json(err);
        }

        let s3bucket = new AWS.S3();
        file_to_delete.forEach((file) => {
          let params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: file.s3_key,
          };
          s3bucket.deleteObject(params, (err, data) => {
            if (!data) return res.status(404).json(err);
          });
        });
        return res.status(200).send("Success");
      }
    );
  }
});

router.get("/by_user/:id", (req, res) => {
  let s3bucket = new AWS.S3();
  const { id } = req.params;
  // .findOne({ user_id: id })
  console.log(id);
  FileAvatar.findOne({ user_id: id }).then((result, err) => {
    console.log(result, err);
    if (!result) {
      console.log("No avatar added");
      return res.status(400).json(err);
    }
    let params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: result.s3_key,
      Expires: 5 * 60,
      ResponseContentDisposition: `inline;filename=${result.filename}`,
    };
    const url = s3bucket.getSignedUrl("getObject", params);
    return res.status(200).json(url);
    s3bucket.getObject(
      {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: result.s3_key,
      },
      (err, data) => {
        res.setHeader(
          "Content-Disposition",
          `inline;filename=${result.filename}`
        );
        res.setHeader("Content-length", data.ContentLength);
        res.end(data.Body);
        // return res.status(200).json(url);
        // return res.status(200).json(url.split(/[?#]/)[0]);
      }
    ); // end of getObject
  });
});

module.exports = router;
