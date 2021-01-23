// 'use strict'
const express = require("express");
const router = express.Router();
const FileAssessment = require("../../../models/lampiran/File_Assessment");
const multer = require("multer");
var AWS = require("aws-sdk");
var fs = require("fs");
const { ObjectId } = require("mongodb");
const { v4: uuidv4 } = require("uuid");
const Assessment = require("../../../models/Assessment");
const FileAnnouncement = require("../../../models/lampiran/File_Announcement");

// Multer ships with storage engines DiskStorage and MemoryStorage
// And Multer adds a body object and a file or files object to the request object. The body object contains the values of the text fields of the form, the file or files object contains the files uploaded via the form.
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// route to upload a pdf document file
// In upload.single("file") - the name inside the single-quote is the name of the field that is going to be uploaded.
router.post("/upload/:id", upload.array("lampiran_assessment"), (req, res) => {
  
 var filesArray = req.files;
 console.log("ASASAS")
  let s3bucket = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    });

    var lampiranCountArray = req.body.num_lampiran
        .split(",")
        .map((n) => Number(n));
    
    Assessment.findById(req.params.id, (err, assessment) => {

        var questionsArray = assessment.questions;
        var newFileList = []
        console.log("Count array: ", lampiranCountArray)
        lampiranCountArray.forEach((cnt, question_idx) => {
          // let temp = []
          var numFileToUpload = cnt;
          // cnt adalah jumlah lampiran di satu soal assessment. 
          for (let idx = 0; idx < cnt; idx++) {
            // take the leftmost file in the array by popping it out
            var file = filesArray.shift();
            //params required for S3 objects
            var params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: "assessment/" + uuidv4() + "_" + file.originalname,
                Body: file.buffer,
                ContentType: file.mimetype,
                ContentDisposition: `inline;filename=${file.originalname}`,
            };

            //UPload to S3
            s3bucket.upload(params, function(err,data) {
                if (err) {
                    return res.status(500).json({ error: true, Message: err });
                  } else {
                    // Taruh ini di luar s3bucket upload. 
                    var newFileUploaded = {
                      filename: file.originalname,
                      s3_key: params.Key,
                      s3_directory: "assessment/",
                      assessment_id: req.params.id,
                    };

                    let newFile = new FileAssessment(newFileUploaded);
                    newFileList.push(newFile);
                    if(newFileList.length == cnt){
                    FileAssessment.insertMany(newFileList)
                          .then((result) => {
                            console.log("Result: ", result)
                            new Promise((resolve) => {
                              resolve(
                                result.map((r) =>r._id)
                              )
                            }).then((file_ids) => {
                              console.log("File ids: ", file_ids)
                              let temp = questionsArray[question_idx].lampiran.concat(file_ids)
                              questionsArray[question_idx].lampiran = temp;
                              console.log("Soal soal assessment", questionsArray);
                              return questionsArray;
                          })
                        }) 
                  }
                }
            }).on("httpUploadProgress", function(data) {
                if(data.loaded == data.total) {
                    numFileToUpload--;
                }
            })
          }
        });
        assessment.questions = questionsArray;
        console.log("SDSD",questionsArray);
        assessment
          .save() // kadang" kalau masukkin res.json di Error, bisa ada error cannot set headers after they are sent to the client.
          .then(() => {
              return res.json({success: "Successfully uploaded the lampiran file",_id: req.params.id})
            })
          .catch((err) => {
            console.log("error kan ini");
            return res.status(500).json({ error: true, Message: err });
          });
  });
});

router.get("/download/:id", (req, res) => {
  let s3bucket = new AWS.S3();

  FileAssessment.findById(req.params.id).then((result, err) => {
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
    FileAssessment.find({ assessment_id: req.params.id }).then((assessments) => {
      let id_list = assessments.map((m) => Object(m._id));
      let file_to_delete = assessments;

      FileAssessment.deleteMany(
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
    FileAssessment.deleteMany(
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

router.get("/by_assessment/:id", (req, res) => {
  FileAssessment.find({ assessment_id: req.params.id }).then((results, err) => {
    if (!results) return res.status(400).json(err);
    else {
      results.sort((a, b) => (a.filename > b.filename ? 1 : -1));
      return res.status(200).json(results);
    }
  });
});

router.get("/:id", (req, res) => {
  let s3bucket = new AWS.S3();

  FileAssessment.findById(req.params.id).then((result, err) => {
    if (!result) return res.status(400).json(err);
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
