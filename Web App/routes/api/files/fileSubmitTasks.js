const FileSubmitTask = require("../../../models/lampiran/FileSubmitTask");
const express = require("express");
const router = express.Router();
const multer = require("multer");
var AWS = require("aws-sdk");
var fs = require("fs");
const keys = require("../../../config/keys");
const { ObjectId } = require("mongodb");
const { v4: uuidv4 } = require("uuid");

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

// Route to upload a PDF document file.
// In upload.single("file") - the name inside the single-quote is the name of the field that is going to be uploaded.
router.post(
  "/upload/:task_id&:author_id&:task_deadline",
  upload.array("tugas"),
  async (req, res) => {
    try {
      const { files } = req;
      const { task_id, author_id, task_deadline } = req.params;
      const on_time = new Date() <= new Date(task_deadline);

      let s3bucket = new AWS.S3({
        accessKeyId: keys.awsKey.AWS_ACCESS_KEY_ID,
        secretAccessKey: keys.awsKey.AWS_SECRET_ACCESS_KEY,
        region: keys.awsKey.AWS_REGION,
      });

      const promises = files.map((file) => {
        var params = {
          Bucket: keys.awsKey.AWS_BUCKET_NAME,
          Key: "submittask/" + uuidv4() + "_" + file.originalname,
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
                  s3_directory: "submittask/",
                  task_id: task_id,
                  author_id: author_id,
                  on_time: on_time,
                };
                let document = new FileSubmitTask(newFileUploaded);
                resolve(document);
              }
            });
        });
      });

      const documents = await Promise.all(promises);
      await FileSubmitTask.insertMany(documents);
      return res.json({
        success: "Successfully uploaded the lampiran file",
      });
    } catch (err) {
      console.error("Upload file Submit task failed");
      console.error(err);
      return res.status(500).json({ error: true, Message: err });
    }
  }
);

router.get("/download/:id", (req, res) => {
  let s3bucket = new AWS.S3();

  FileSubmitTask.findById(req.params.id)
    .then((result, err) => {
      if (!result) throw "File submit tasks not found";

      let params = {
        Bucket: keys.awsKey.AWS_BUCKET_NAME,
        Key: result.s3_key,
        Expires: 5 * 60,
        ResponseContentDisposition: `attachment;filename=${result.filename}`,
      };
      return s3bucket.getSignedUrlPromise("getObject", params);
      // const url = s3bucket.getSignedUrl("getObject", params);
      // return res.status(200).json(url);
    })
    .then((url) => {
      console.log("Download file submit tasks completed");
      return res.json(url);
    })
    .catch((err) => {
      console.error("Download file submit tasks failed");
      console.error(err);
      return res.status(400).json(err);
    });
});

router.get("/by_multiple_tasks", (req, res) => {
  let { id_list } = req.query;

  FileSubmitTask.find({ _id: { $in: id_list } })
    .then((results) => {
      return res
        .status(200)
        .json({ fileSubmitTasks: results, tasks_id: id_list });
    })
    .catch((err) => {
      console.error("Download file submit tasks by_multiple_tasks failed");
      console.error(err);
      return res.status(400).json(err);
    });
});

router.delete("/all/:id", async (req, res) => {
  try {
    // req.params.id is the id of the task.
    const file_to_delete = await FileSubmitTask.find({
      task_id: req.params.id,
    });
    // file_to_delete is the id of the files.
    if (!file_to_delete) {
      return res.status(200).json("No file task to delete");
    }
    await FileSubmitTask.deleteMany({
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
    console.error("Delete all submit tasks by task failed");
    console.error(err);
    return res.status(400).json(err);
  }
});

// Router to delete a DOCUMENT file.
router.delete("/", async (req, res) => {
  const { id_to_delete } = req.body;
  // file_to_delete is the id of the files.
  if (!id_to_delete) {
    return res.status(200).send("No file tasks to delete");
  }
  try {
    // if file_to_delete is undefined, means that the object is deleted and hence all files should be deleted.
    let id_list = id_to_delete.map((m) => ObjectId(m));
    console.log(id_list);
    const results = await FileSubmitTask.find({ _id: { $in: id_list } });
    await FileSubmitTask.deleteMany({ _id: { $in: id_list } });
    console.log(results);
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
    console.error("Delete multiple submit tasks failed");
    console.error(err);
    return res.status(404).json(err);
  }
});

router.get("/by_task/:task_id", (req, res) => {
  const { task_id } = req.params;

  FileSubmitTask.find({ task_id: task_id })
    .then((results) => {
      if (!results.length) console.log("file task by task is empty");
      else {
        results.sort((a, b) => (a.filename > b.filename ? 1 : -1));
        return res.status(200).json(results);
      }
    })
    .catch((err) => {
      console.error("Delete submit tasks by_task failed");
      console.error(err);
      return res.status(404).json(err);
    });
});

router.get("/by_task_author/:task_id&:author_id", (req, res) => {
  const { task_id, author_id } = req.params;

  FileSubmitTask.find({ task_id: task_id, author_id: author_id })
    .then((results) => {
      if (!results.length)
        console.log("FileSubmitTask by_task_author is empty");

      results.sort((a, b) => (a.filename > b.filename ? 1 : -1));
      return res.status(200).json(results);
    })
    .catch((err) => {
      console.error("get FileSubmitTask by_task_author failed");
      console.error(err);
      return res.status(404).json(err);
    });
});

router.get("/by_author/:author_id", (req, res) => {
  FileSubmitTask.find({ author_id: req.params.author_id })
    .lean()
    .then((results) => {
      if (!results.length) {
        console.log("Files not found");
      }
      return res.json(results);
    })
    .catch((err) => {
      console.error("get FileSubmitTask by_author failed");
      console.error(err);
      return res.status(400).json(err);
    });
});

router.get("/:id", (req, res) => {
  FileSubmitTask.findById(req.params.id)
    .then((result) => {
      if (!result) throw "File Submit Tasks not found";
      const url = `${keys.cdn}/${result.s3_key}`;
      return res.json(url);
    })
    .catch((err) => {
      console.error("get FileSubmitTask by_author failed");
      console.error(err);
      return res.status(400).json(err);
    });
});

router.get("/noatmpt/:author_id", (req, res) => {
  const { author_id } = req.params;
  let set_result = new Set();
  FileSubmitTask.find({ author_id: author_id })
    .then((files) => {
      if (!files.length)
        console.log("File Submit tasks by specific author is empty");
      files.forEach((item) => {
        set_result.add(item.task_id.toString());
      });
      return res.json(Array.from(set_result));
    })
    .catch((err) => {
      console.error("get FileSubmitTask by_author failed");
      console.error(err);
      return res.status(400).json(err);
    });
});

module.exports = router;
