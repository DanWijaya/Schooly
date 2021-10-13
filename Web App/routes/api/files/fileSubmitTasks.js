// 'use strict'
const express = require("express");
const router = express.Router();
const FileSubmitTask = require("../../../models/lampiran/FileSubmitTask");
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
  FileSubmitTask.find(
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
router.post(
  "/upload/:task_id&:author_id&:task_deadline",
  upload.array("tugas"),
  (req, res) => {
    const { files } = req;
    const { task_id, author_id, task_deadline } = req.params;
    const on_time = new Date() <= new Date(task_deadline);

    let s3bucket = new AWS.S3({
      accessKeyId: keys.awsKey.AWS_ACCESS_KEY_ID,
      secretAccessKey: keys.awsKey.AWS_SECRET_ACCESS_KEY,
      region: keys.awsKey.AWS_REGION,
    });
    // var ResponseData =[]
    //Where you want to store your file
    console.log("File yang mau diupload: ", files);
    var numsFileUploaded = 0;
    files.map((file) => {
      var params = {
        Bucket: keys.awsKey.AWS_BUCKET_NAME,
        Key: "submittask/" + uuidv4() + "_" + file.originalname,
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
              s3_directory: "submittask/",
              task_id: task_id,
              author_id: author_id,
              on_time: on_time,
            };
            var document = new FileSubmitTask(newFileUploaded);
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
            console.log("All files complete");
            numsFileUploaded++;
            if (numsFileUploaded == files.length) {
              console.log("Submit task succeed");
              // return res.json(true)
              return res.json({
                success: "Successfully uploaded the lampiran file",
              });
            }
          }
        });
    });
  }
);

router.get("/download/:id", (req, res) => {
  let s3bucket = new AWS.S3();

  FileSubmitTask.findById(req.params.id).then((result, err) => {
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

router.get("/by_multiple_tasks", (req, res) => {
  let { id_list } = req.query;

  FileSubmitTask.find({ _id: { $in: id_list } }).then((results) => {
    return res
      .status(200)
      .json({ fileSubmitTasks: results, tasks_id: id_list });
  });
});

// Router to delete a DOCUMENT file
router.delete("/:id", (req, res) => {
  const { delete_all } = req.body;
  // if file_to_delete is undefined,means that the object is deleted and hence all files should be deleted.
  if (!delete_all) {
    FileSubmitTask.findByIdAndDelete(req.params.id, (err, file) => {
      let s3bucket = new AWS.S3();
      let params = {
        Bucket: keys.awsKey.AWS_BUCKET_NAME,
        Key: file.s3_key,
      };
      s3bucket.deleteObject(params, (err, data) => {
        if (!data) {
          return res.status(404).json(err);
        }
        return res.status(200).send("Success");
      });
    });
  } else {
    FileSubmitTask.find({ task_id: req.params.id }).then((tasks) => {
      let id_list = tasks.map((m) => Object(m._id));
      let file_to_delete = tasks;

      FileSubmitTask.deleteMany(
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
  }
  /*else{
    let id_list = file_to_delete.map((m) => Object(m._id))
    FileSubmitTask.deleteMany({
      _id: {
        $in: id_list
          }
        }, function(err, results){
        if(!results){
          return res.status(404).json(err)
        } 

        let s3bucket = new AWS.S3();
        file_to_delete.forEach((file) => {
          let params = {
            Bucket: keys.awsKey.AWS_BUCKET_NAME,
            Key: file.s3_key
          };
          s3bucket.deleteObject(params, (err, data) => {
            if (!data)
              return res.status(404).json(err)
          });
        })
        return res.status(200).send("Success")
    });
  }
  */
});

router.get("/by_task/:task_id", (req, res) => {
  const { task_id } = req.params;

  FileSubmitTask.find({ task_id: task_id }).then((results, err) => {
    if (!results) return res.status(400).json(err);
    else {
      results.sort((a, b) => (a.filename > b.filename ? 1 : -1));
      return res.status(200).json(results);
    }
  });
});

router.get("/by_task_author/:task_id&:author_id", (req, res) => {
  const { task_id, author_id } = req.params;

  FileSubmitTask.find({ task_id: task_id, author_id: author_id }).then(
    (results, err) => {
      if (!results) return res.status(400).json(err);
      else {
        results.sort((a, b) => (a.filename > b.filename ? 1 : -1));
        return res.status(200).json(results);
      }
    }
  );
});

router.get("/by_author/:author_id", (req, res) => {
  FileSubmitTask.find({ author_id: req.params.author_id })
    .lean()
    .then((results) => {
      if (results.length === 0) {
        res.status(404).json("Files not found");
      } else {
        res.json(results);
      }
    });
});

router.get("/:id", (req, res) => {
  let s3bucket = new AWS.S3();

  FileSubmitTask.findById(req.params.id).then((result, err) => {
    if (!result) return res.status(400).json(err);
    const url = `${keys.cdn}/${result.s3_key}`;
    return res.status(200).json(url);
  });
});

router.get("/noatmpt/:author_id", (req, res) => {
  const { author_id } = req.params;
  console.log("USER IDSDSD:", author_id);
  let set_result = new Set();
  FileSubmitTask.find({ author_id: author_id })
    .then((files, err) => {
      files.forEach((item) => {
        set_result.add(item.task_id.toString());
      });
      return res.status(200).json(Array.from(set_result));
    })
    .catch((err) => {
      return res.status(404).json(err);
    });
  // return res.status(200).json(Array.from(set_result))
});

module.exports = router;