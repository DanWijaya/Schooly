const FileAssessment = require("../../../models/lampiran/FileAssessment");
const Assessment = require("../../../models/Assessment");
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

// Route to upload a PDFF document file.
// In upload.single("file") - the name inside the single-quote is the name of the field that is going to be uploaded.
router.post(
  "/upload/:assessment_id",
  upload.array("lampiran_assessment"),
  async (req, res) => {
    try {
      const { files } = req;
      const { assessment_id } = req.params;

      let s3bucket = new AWS.S3({
        accessKeyId: keys.awsKey.AWS_ACCESS_KEY_ID,
        secretAccessKey: keys.awsKey.AWS_SECRET_ACCESS_KEY,
        region: keys.awsKey.AWS_REGION,
      });

      var lampiranCountArray = req.body.num_lampiran
        .split(",")
        .map((n) => Number(n));
      // lampiranCountArray = [1,2,0] (ada 1, 2 dan 0 foto di Soal no. 1, 2 dan 3)

      let assessment = await Assessment.findById(assessment_id);
      var questionsArray = assessment.questions;
      var newFileList = [];

      const promises = files.map((file) => {
        var params = {
          Bucket: keys.awsKey.AWS_BUCKET_NAME,
          Key: "assessment/" + uuidv4() + "_" + file.originalname,
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
                  s3_directory: "assessment/",
                  assessment_id: assessment_id,
                };
                let document = new FileAssessment(newFileUploaded);
                resolve(document);
              }
            });
        });
      });

      const documents = await Promise.all(promises);
      const results = await FileAssessment.insertMany(documents);
      const file_ids = results.map((r) => r._id);

      let nums_lampiran_added = 0;
      lampiranCountArray.forEach((l, idx) => {
        if (l > 0) {
          // l is the amount of attachments for a particular question.
          let temp = file_ids.slice(
            nums_lampiran_added,
            nums_lampiran_added + l
          );
          // temp is the ids of the file for a particular question.

          temp = questionsArray[idx].lampiran.concat(temp);
          questionsArray[idx].lampiran = temp;
          // Append temp to existing attachment of the quesiton.

          nums_lampiran_added = nums_lampiran_added + l;
          // nums_lampiran_added to keep track the attachment that has been added.
          assessment.questions = questionsArray;
        }
      });
      await assessment.save();
      return res.json({
        success: "Successfully uploaded the lampiran file",
        _id: req.params.id,
      });
    } catch (err) {
      console.error("Upload file assessment failed");
      console.error(err);
      return res.status(500).json({ error: true, Message: err });
    }
  }
);

router.get("/download/:id", (req, res) => {
  let s3bucket = new AWS.S3();

  FileAssessment.findById(req.params.id)
    .then((result) => {
      if (!result) throw "File announcement not found";

      let params = {
        Bucket: keys.awsKey.AWS_BUCKET_NAME,
        Key: result.s3_key,
        Expires: 5 * 60,
        ResponseContentDisposition: `attachment;filename=${result.filename}`,
      };

      return s3bucket.getSignedUrlPromise("getObject", params);
    })
    .then((url) => {
      console.log("Download file assessments completed");
      return res.json(url);
    })
    .catch((err) => {
      console.error("Download file assessments failed");
      console.error(err);
      return res.status(400).json(err);
    });
});

router.delete("/all/:id", async (req, res) => {
  try {
    // req.params.id is the id of the assessment.
    const file_to_delete = await FileAssessment.find({
      assessment_id: req.params.id,
    });
    // file_to_delete is the id of the files.
    if (!file_to_delete) {
      return res.json("No file assessment to delete");
    }
    await FileAssessment.deleteMany({
      assessment_id: req.params.id,
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
    console.error("Delete all file assessments failed");
    console.error(err);
    return res.status(404).json(err);
  }
});

// Router to delete a DOCUMENT file.
router.delete("/:id", async (req, res) => {
  const { id_to_delete } = req.body;
  // file_to_delete is the id of the files.
  if (!id_to_delete) {
    return res.status(200).send("No file assessments to delete");
  }
  try {
    // let id_list = id_to_delete.map((m) => ObjectId(m));
    const results = await FileAssessment.find({ _id: { $in: id_to_delete } });
    await FileAssessment.deleteMany({ _id: { $in: id_to_delete } });

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
    return res.json("Success");
  } catch (err) {
    console.error("Delete file assessments failed");
    console.error(err);
    return res.status(404).json(err);
  }
});

router.get("/by_assessment/:id", (req, res) => {
  FileAssessment.find({ assessment_id: req.params.id })
    .then((results) => {
      if (!results.length)
        console.log("File announcement by_assessment is empty");
      results.sort((a, b) => (a.filename > b.filename ? 1 : -1));
      return res.status(200).json(results);
    })
    .catch((err) => {
      console.error("file by_assessment failed");
      console.error(err);
      return res.status(400).json(err);
    });
});

router.post("/getS3Url", (req, res) => {
  // file_ids are unique.
  let { file_ids } = req.body;

  Promise.all(
    file_ids.map((id) => {
      return new Promise((resolve, reject) => {
        FileAssessment.findById(id).then((result, err) => {
          if (!result) {
            reject(err);
          }
          const url = `${keys.cdn}/${result.s3_key}`;
          resolve(url);
        });
      });
    })
  )
    .then((results) => {
      // let all_idToUrl = new Map();
      // results.forEach((idToUrl) => all_idToUrl = new Map([...all_idToUrl, ...idToUrl]))
      console.error("getS3Url fileAssessments completed");
      return res.json({ urls: results, ids: file_ids });
    })
    .catch((err) => {
      console.error("getS3Url fileAssessments failed");
      console.error(err);
      return res.status(400).json(err);
    });
});

module.exports = router;
