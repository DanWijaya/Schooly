// 'use strict'
const express = require("express");
const router = express.Router();
const FileTask = require("../../../models/lampiran/File_Task");
const multer = require("multer");
var AWS = require("aws-sdk");
var fs = require("fs");
const { ObjectId } = require("mongodb");
const { v4: uuidv4 } = require("uuid");
const keys = require("../../../config/keys");

// Multer ships with storage engines DiskStorage and MemoryStorage
// And Multer adds a body object and a file or files object to the request object. The body object contains the values of the text fields of the form, the file or files object contains the files uploaded via the form.
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

AWS.config.update({
  accessKeyId: keys.awsKey.AWS_ACCESS_KEY_ID,
  secretAccessKey: keys.awsKey.AWS_SECRET_ACCESS_KEY,
  region: keys.awsKey.AWS_REGION,
});

// Get all Documents Routes
router.get("/", (req, res, next) => {
  FileTask.find(
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

router.post(
  "/upload/:task_id",
  upload.array("lampiran_tugas"),
  async (req, res) => {
    try {
      const { files } = req;
      const { task_id, author_id } = req.params;
      let s3bucket = new AWS.S3({
        accessKeyId: keys.awsKey.AWS_ACCESS_KEY_ID,
        secretAccessKey: keys.awsKey.AWS_SECRET_ACCESS_KEY,
        region: keys.awsKey.AWS_REGION,
      });

      let promises = files.map((file) => {
        var params = {
          Bucket: keys.awsKey.AWS_BUCKET_NAME,
          Key: "task/" + uuidv4() + "_" + file.originalname,
          Body: file.buffer,
          ContentType: file.mimetype,
          ContentDisposition: `inline;filename=${file.originalname}`,
        };

        return new Promise((resolve, reject) => {
          s3bucket
            .upload(params, function (err, data) {
              if (err) {
                reject({ error: true, Message: err });
                // return res.status(500).json({ error: true, Message: err });
              }
            })
            .on("httpUploadProgress", function (data) {
              if (data.loaded == data.total) {
                let newFileUploaded = {
                  filename: file.originalname,
                  s3_key: params.Key,
                  s3_directory: "tasks/",
                  task_id: task_id,
                };
                let document = new FileTask(newFileUploaded);
                resolve(document);
              }
            });
        });
      });

      const documents = await Promise.all(promises);
      await FileTask.insertMany(documents);
      return res.json({
        _id: task_id,
        success: "Successfully uploaded the lampiran file",
      });
    } catch (err) {
      return res.status(500).json({ error: true, Message: err });
    }
  }
);

router.get("/download/:id", (req, res) => {
  let s3bucket = new AWS.S3();

  FileTask.findById(req.params.id).then((result, err) => {
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

// Router to delete a DOCUMENT file

router.delete("/all/:id", async (req, res) => {
  try {
    // req.params.id ini berupa id dari task.
    const file_to_delete = await FileTask.find({ task_id: req.params.id });
    // file_to_delete ini berupa ID dari file filenya.
    if (!file_to_delete) {
      return res.status(200).json("No file tasks to delete");
    }
    await FileTask.deleteMany({
      task_id: req.params.id,
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

router.delete("/:id", async (req, res) => {
  const { file_to_delete } = req.body;
  // file_to_delete ini berupa ID dari file filenya.
  console.log("Ini file to deletenya: ", file_to_delete);
  if (!file_to_delete) {
    console.log("Jancuk");
    return res.status(200).send("No file tasks to delete");
  }
  try {
    // if file_to_delete is undefined,means that the object is deleted and hence all files should be deleted.
    let id_list = file_to_delete.map((m) => ObjectId(m._id));
    console.log("Ini id list: ", id_list);
    const results = await FileTask.find({ _id: { $in: id_list } });
    console.log(results);
    await FileTask.deleteMany({ _id: { $in: id_list } });

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

router.get("/by_task/:id", (req, res) => {
  return FileTask.find({ task_id: req.params.id }).then((results, err) => {
    if (!results) return res.status(400).json(err);
    else {
      results.sort((a, b) => (a.filename > b.filename ? 1 : -1));
      return res.status(200).json(results);
    }
  });
});

router.get("/:id", (req, res) => {
  let s3bucket = new AWS.S3();

  FileTask.findById(req.params.id).then((result, err) => {
    if (!result) return res.status(400).json(err);
    const url = `${keys.cdn}/${result.s3_key}`;
    return res.status(200).json(url); // end of getObject
  });
});

module.exports = router;
