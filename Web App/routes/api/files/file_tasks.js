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

// route to upload a pdf document file
// In upload.single("file") - the name inside the single-quote is the name of the field that is going to be uploaded.
router.post("/upload/:task_id", upload.array("lampiran_tugas"), (req, res) => {
  const { files } = req;
  const { task_id, author_id } = req.params;
  let s3bucket = new AWS.S3({
    accessKeyId: keys.awsKey.AWS_ACCESS_KEY_ID,
    secretAccessKey: keys.awsKey.AWS_SECRET_ACCESS_KEY,
    region: keys.awsKey.AWS_REGION,
  });
  // var ResponseData =[]
  //Where you want to store your file

  var numsFileUploaded = 0;
  files.map((file) => {
    var params = {
      Bucket: keys.awsKey.AWS_BUCKET_NAME,
      Key: "task/" + uuidv4() + "_" + file.originalname,
      Body: file.buffer,
      ContentType: file.mimetype,
      ContentDisposition: `inline;filename=${file.originalname}`,
    };
    s3bucket
      .upload(params, function (err, data) {
        if (err) {
          return res.status(500).json({ error: true, Message: err });
        } else {
          var newFileUploaded = {
            filename: file.originalname,
            s3_key: params.Key,
            s3_directory: "tasks/",
            task_id: task_id,
          };
          var document = new FileTask(newFileUploaded);
          document.save(function (error, newFile) {
            if (error) {
              throw error;
            }
            console.log(newFile);
          });
        }
      })
      .on("httpUploadProgress", function (data) {
        if (data.loaded == data.total) {
          numsFileUploaded++;
          if (numsFileUploaded == files.length) {
            return res.json({
              _id: task_id,
              success: "Successfully uploaded the lampiran file",
            });
          }
        }
      });
  });
});

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
router.delete("/:id", (req, res) => {
  const { file_to_delete } = req.body;
  // if file_to_delete is undefined,means that the object is deleted and hence all files should be deleted.
  if (!file_to_delete) {
    FileTask.find({ task_id: req.params.id }).then((tasks) => {
      let id_list = tasks.map((m) => Object(m._id));
      let file_to_delete = tasks;

      FileTask.deleteMany(
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
    FileTask.deleteMany(
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
    // let params = {
    //   Bucket: keys.awsKey.AWS_BUCKET_NAME,
    //   Key: result.s3_key,
    //   Expires: 5 * 60,
    //   ResponseContentDisposition: `inline;filename=${result.filename}`,
    // };
    // const url = s3bucket.getSignedUrl("getObject", params);
    const url = `${keys.cdn}/${result.s3_key}`
    return res.status(200).json(url);
    s3bucket.getObject(
      {
        Bucket: keys.awsKey.AWS_BUCKET_NAME,
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