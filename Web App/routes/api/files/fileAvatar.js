const FileAvatar = require("../../../models/lampiran/FileAvatar");
const User = require("../../../models/user_model/User");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
var AWS = require("aws-sdk");
var fs = require("fs");
const { ObjectId } = require("mongodb");
const { v4: uuidv4 } = require("uuid");
const keys = require("../../../config/keys");

// Multer ships with storage engines DiskStorage and MemoryStorage
// And Multer adds a body object and a file or files object to the request object.
// The body object contains the values of the text fields of the form,
// the file or files object contains the files uploaded via the form.
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

AWS.config.update({
  accessKeyId: keys.awsKey.AWS_ACCESS_KEY_ID,
  secretAccessKey: keys.awsKey.AWS_SECRET_ACCESS_KEY,
  region: keys.awsKey.AWS_REGION,
});

// Route to upload file.
// In upload.single("file") - the name inside the single-quote is the name of the field that is going to be uploaded.
router.post("/upload/:user_id", upload.single("avatar"), async (req, res) => {
  try {
    const { file } = req;
    const { user_id } = req.params;
    let s3bucket = new AWS.S3({
      accessKeyId: keys.awsKey.AWS_ACCESS_KEY_ID,
      secretAccessKey: keys.awsKey.AWS_SECRET_ACCESS_KEY,
      region: keys.awsKey.AWS_REGION,
    });

    var params = {
      Bucket: keys.awsKey.AWS_BUCKET_NAME,
      Key: "avatar/" + uuidv4() + "_" + file.originalname,
      Body: file.buffer,
      ContentType: file.mimetype,
      ContentDisposition: `inline;filename=${file.originalname}`,
    };

    const oldAvatar = await FileAvatar.findOneAndDelete({ user_id: user_id });
    if (oldAvatar) {
      let params = {
        Bucket: keys.awsKey.AWS_BUCKET_NAME,
        Key: oldAvatar.s3_key,
      };
      await new Promise((resolve, reject) => {
        s3bucket
          .deleteObject(params, (error, data) => {
            if (error) return reject(err);
          })
          .on("httpDone", () => {
            resolve();
          });
      });
    }

    const promise = () => {
      return new Promise((resolve, reject) => {
        s3bucket
          .upload(params, function (err, data) {
            if (err) {
              reject({ error: true, Message: err });
            }
          })
          .on("httpUploadProgress", function (data) {
            if (data.loaded == data.total) {
              let newFileUploaded = {
                filename: file.originalname,
                s3_key: params.Key,
                s3_directory: "user/",
                user_id: user_id,
              };
              let document = new FileAvatar(newFileUploaded);
              resolve(document);
            }
          });
      });
    };

    const document = await promise();
    const newAvatar = await document.save();
    const user = await User.findOneAndUpdate(
      { _id: user_id },
      { $set: { avatar: newAvatar._id } },
      { new: true }
    );

    var payload = {
      _id: user._id,
      role: user.role,
      // avatar: user.avatar,

      // Personal Information
      name: user.name,
      tanggal_lahir: user.tanggal_lahir,
      jenis_kelamin: user.jenis_kelamin,
      sekolah: user.sekolah,

      // Contacts
      email: user.email,
      phone: user.phone,
      emergency_phone: user.emergency_phone,
      address: user.address,

      // Career
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
  } catch (err) {
    console.error("File Avatar upload failed");
    console.error(err);
    return res.status(500).json({ error: true, Message: err });
  }
});

router.get("/download/:id", (req, res) => {
  let s3bucket = new AWS.S3();

  FileAvatar.find({ user_id: req.params.id })
    .then((result) => {
      if (!result) throw "No file avatar";

      let params = {
        Bucket: keys.awsKey.AWS_BUCKET_NAME,
        Key: result.s3_key,
        Expires: 5 * 60,
        ResponseContentDisposition: `attachment;filename=${result.filename}`,
      };
      const url = s3bucket.getSignedUrl("getObject", params);
      return res.status(200).json(url);
    })
    .catch((err) => {
      console.error("Download file avatar failed");
      return res.status(400).json(err);
    });
});

// Router to delete a DOCUMENT file.
router.delete("/:id", (req, res) => {
  const { file_to_delete } = req.body;
  // if file_to_delete is undefined, means that the object is deleted and hence all files should be deleted.
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
          // Now Delete the file from AWS-S3.
          // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#deleteObject-property
          let s3bucket = new AWS.S3();
          file_to_delete.forEach((file) => {
            let params = {
              Bucket: keys.awsKey.AWS_BUCKET_NAME,
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
            Bucket: keys.awsKey.AWS_BUCKET_NAME,
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
  const { id } = req.params;
  // .findOne({ user_id: id })
  console.log(id);
  FileAvatar.findOne({ user_id: id })
    .then((result) => {
      if (!result) {
        console.log("No avatar added");
        return res.json("");
      }

      const url = `${keys.cdn}/${result.s3_key}`;
      return res.status(200).json(url);
    })
    .catch((err) => {
      console.error("Get avatar by_user failed");
      return res.status(400).json(err);
    });
});

router.get("/multiuser", (req, res) => {
  // req.body is in list.
  let { id_list } = req.query;
  if (!Array.isArray(id_list)) {
    id_list = [];
  }
  id_list = id_list.map((id) => ObjectId(id));
  FileAvatar.find({ user_id: { $in: id_list } })
    .then((avatars) => {
      if (!avatars.length) {
        console.log("Users avatar is not found at all");
      }
      var urls = {};
      avatars.forEach((a) => {
        urls[a.user_id] = `${keys.cdn}/${a.s3_key}`;
      });
      console.log("Get multiple users avatar completed");
      return res.json(urls);
    })
    .catch((err) => {
      console.error("Get multiple users avatar failed");
      return res.status(400).json(err);
    });
});

module.exports = router;
