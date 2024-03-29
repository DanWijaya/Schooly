const FileEvent = require("../../../models/lampiran/FileEvent");
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
  "/upload/:event_id",
  upload.array("lampiran_event"),
  async (req, res) => {
    try {
      const { files } = req;
      const { event_id } = req.params;
      let s3bucket = new AWS.S3({
        accessKeyId: keys.awsKey.AWS_ACCESS_KEY_ID,
        secretAccessKey: keys.awsKey.AWS_SECRET_ACCESS_KEY,
        region: keys.awsKey.AWS_REGION,
      });

      const promises = files.map((file) => {
        var params = {
          Bucket: keys.awsKey.AWS_BUCKET_NAME,
          Key: "event/" + uuidv4() + "_" + file.originalname,
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
                  s3_directory: "event/",
                  event_id: event_id,
                };
                let document = new FileEvent(newFileUploaded);
                resolve(document);
              }
            });
        });
      });
      const documents = await Promise.all(promises);
      await FileEvent.insertMany(documents);
      return res.json({
        _id: event_id,
        success: "Successfully uploaded the file",
      });
    } catch (err) {
      console.error("Upload file event failed");
      console.error(err);
      return res.status(500).json({ error: true, Message: err });
    }
  }
);

router.get("/download/:id", (req, res) => {
  let s3bucket = new AWS.S3();

  FileEvent.findById(req.params.id)
    .then((result) => {
      if (!result) throw "File event to download is empty";

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
      console.error("Download file event failed");
      console.error(err);
      return res.status(404).json(err);
    });
});

router.delete("/all/:id", async (req, res) => {
  try {
    // req.params.id is the id of the event.
    const file_to_delete = await FileEvent.find({ event_id: req.params.id });
    // file_to_delete is the id of the files.
    if (!file_to_delete) {
      return res.json("No file events to delete");
    }
    await FileEvent.deleteMany({
      event_id: req.params.id,
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
    return res.status(200).json("Delete file events by events completed");
  } catch (err) {
    console.error("Delete file events by events failed");
    console.error(err);
    return res.status(404).json(err);
  }
});

router.delete("/:id", async (req, res) => {
  const { file_to_delete } = req.body;
  // file_to_delete is the id of the files.
  if (!file_to_delete) {
    return res.status(200).send("No file events to delete");
  }
  try {
    // if file_to_delete is undefined, means that the object is deleted and hence all files should be deleted.
    let id_list = file_to_delete.map((m) => ObjectId(m._id));
    const results = await FileEvent.find({ _id: { $in: id_list } });
    await FileEvent.deleteMany({ _id: { $in: id_list } });

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
    return res.status(200).send("Delete file event completed");
  } catch (err) {
    console.error("Delete file Event failed");
    console.error(err);
    return res.status(404).json(err);
  }
});

router.get("/by_event/:id", (req, res) => {
  FileEvent.find({ event_id: req.params.id })
    .then((results) => {
      if (!results.length) console.log("File events by_event is empty");
      results.sort((a, b) => (a.filename > b.filename ? 1 : -1));
      return res.status(200).json(results);
    })
    .catch((err) => {
      console.error("Get file events by_event failed");
      console.error(err);
      return res.status(400).json(err);
    });
});

router.get("/:id", (req, res) => {
  let s3bucket = new AWS.S3();

  FileEvent.findById(req.params.id)
    .then((result) => {
      if (!result) throw "File event not found";
      const url = `${keys.cdn}/${result.s3_key}`;
      return res.json(url);
    })
    .catch((err) => {
      console.error("Get file event failed");
      console.error(err);
      return res.status(400).json(err);
    });
});

module.exports = router;
