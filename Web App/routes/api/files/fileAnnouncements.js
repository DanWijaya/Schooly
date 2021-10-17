// 'use strict'
const express = require("express");
const router = express.Router();
const FileAnnouncement = require("../../../models/lampiran/FileAnnouncement");
const multer = require("multer");
var AWS = require("aws-sdk");
var fs = require("fs");
const keys = require("../../../config/keys");
const { ObjectId } = require("mongodb");
const { v4: uuidv4 } = require("uuid");

// Multer ships with storage engines DiskStorage and MemoryStorage
// And Multer adds a body object and a file or files object to the request object. The body object contains the values of the text fields of the form, the file or files object contains the files uploaded via the form.
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

AWS.config.update({
  accessKeyId: keys.awsKey.AWS_ACCESS_KEY_ID,
  secretAccessKey: keys.awsKey.AWS_SECRET_ACCESS_KEY,
  region: keys.awsKey.AWS_REGION,
});

router.get("/", (req, res, next) => {
  FileAnnouncement.find({}, (err, docs) => {
    if (err) {
      return next(err);
    }

    res.status(200).send(docs);
  });
});

// Route to upload file
router.post(
  "/upload/:announcement_id",
  upload.array("lampiran_announcement"),
  async (req, res) => {
    try {
      const { files } = req;
      const { announcement_id, author_id } = req.params;
      let s3bucket = new AWS.S3({
        accessKeyId: keys.awsKey.AWS_ACCESS_KEY_ID,
        secretAccessKey: keys.awsKey.AWS_SECRET_ACCESS_KEY,
        region: keys.awsKey.AWS_REGION,
      });

      let promises = files.map((file) => {
        var params = {
          Bucket: keys.awsKey.AWS_BUCKET_NAME,
          Key: "announcement/" + uuidv4() + "_" + file.originalname,
          Body: file.buffer,
          ContentType: file.mimetype,
          ContentDisposition: `inline;filename=${file.originalname}`,
        };

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
                  s3_directory: "announcement/",
                  announcement_id: announcement_id,
                };
                let document = new FileAnnouncement(newFileUploaded);
                resolve(document);
              }
            });
        });
      });

      const documents = await Promise.all(promises);
      await FileAnnouncement.insertMany(documents);
      return res.json({
        _id: announcement_id,
        success: "Successfully uploaded the lampiran file",
      });
    } catch (err) {
      return res.status(500).json({ error: true, Message: err });
    }
  }
);

router.get("/download/:id", (req, res) => {
  let s3bucket = new AWS.S3();

  FileAnnouncement.findById(req.params.id).then((result, err) => {
    if (!result) return res.status(400).json(err);

    let params = {
      Bucket: keys.awsKey.AWS_BUCKET_NAME,
      Key: result.s3_key,
      Expires: 5 * 60,
      ResponseContentDisposition: `attachment;filename=${result.filename}`,
    };

    const url = s3bucket.getSignedUrl("getObject", params);
    return res.status(200).json(url);
  });
});

router.delete("/all/:id", async (req, res) => {
  try {
    // req.params.id ini berupa id dari announcement.
    const file_to_delete = await FileAnnouncement.find({
      announcement_id: req.params.id,
    });
    // file_to_delete ini berupa ID dari file filenya.
    if (!file_to_delete) {
      return res.status(200).json("No file announcements to delete");
    }
    await FileAnnouncement.deleteMany({
      announcement_id: req.params.id,
    });

    const promises = file_to_delete.map((file) => {
      let s3bucket = new AWS.S3();
      let params = {
        Bucket: keys.awsKey.AWS_BUCKET_NAME,
        Key: file.s3_key,
      };

      return new Promise((resolve, reject) => {
        s3bucket
          .deleteObject(params, (err, data) => {
            if (!data) {
              reject(err);
            }
          })
          .on("httpDone", function (data) {
            resolve();
          });
      });
    });

    await Promise.all(promises);
    return res.status(200).json("Success");
  } catch (err) {
    return res.status(404).json(err);
  }
});

// Router to delete a DOCUMENT file
router.delete("/:id", async (req, res) => {
  const { file_to_delete } = req.body;
  // file_to_delete ini berupa ID dari file filenya.
  if (!file_to_delete) {
    return res.status(200).send("No file nnouncements to delete");
  }
  try {
    // if file_to_delete is undefined,means that the object is deleted and hence all files should be deleted.
    let id_list = file_to_delete.map((m) => ObjectId(m._id));
    const results = await FileAnnouncement.find({ _id: { $in: id_list } });
    await FileAnnouncement.deleteMany({ _id: { $in: id_list } });

    const promises = results.map((file) => {
      let s3bucket = new AWS.S3();
      let params = {
        Bucket: keys.awsKey.AWS_BUCKET_NAME,
        Key: file.s3_key,
      };
      return new Promise((resolve, reject) => {
        s3bucket
          .deleteObject(params, (err, data) => {
            if (!data) {
              reject(err);
            }
          })
          .on("httpDone", function (data) {
            resolve();
          });
      });
    });

    await Promise.all(promises);
    return res.status(200).send("Success");
  } catch (err) {
    return res.status(404).json(err);
  }
});

router.get("/by_announcement/:id", (req, res) => {
  FileAnnouncement.find({ announcement_id: req.params.id })
    .then((results, err) => {
      results.sort((a, b) => (a.filename > b.filename ? 1 : -1));
      return res.status(200).json(results);
    })
    .catch((err) => {
      return res.status(400).json(err);
    });
});

router.get("/:id", (req, res) => {
  let s3bucket = new AWS.S3();

  FileAnnouncement.findById(req.params.id).then((result, err) => {
    if (!result) return res.status(400).json(err);

    const url = `${keys.cdn}/${result.s3_key}`;
    return res.status(200).json(url);
  });
});

module.exports = router;
