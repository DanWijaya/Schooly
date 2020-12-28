// 'use strict'
const express = require("express");
const router = express.Router();
const FileAnnouncement = require("../../../models/lampiran/File_Announcement");
const multer = require("multer");
var AWS = require("aws-sdk");
var fs = require("fs");
const { ObjectId } = require("mongodb");
const { v4: uuidv4} = require("uuid");

// Multer ships with storage engines DiskStorage and MemoryStorage
// And Multer adds a body object and a file or files object to the request object. The body object contains the values of the text fields of the form, the file or files object contains the files uploaded via the form.
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
  })

router.get("/", (req,res, next) => {
    FileAnnouncement.find(
        {}, (err, docs) => {
            if(err){
                return next(err)
            }

            res.status(200).send(docs);
        }
    )
});

// Route to upload file
router.post("/upload/:id", upload.array("lampiran_announcement"), (req,res) => {
    const { files } = req
    let s3bucket = new AWS.S3();
    console.log("Ann files: ", files)
    var numsFileUploaded = 0;
    files.map((file) => {
        var params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: "announcement/" + uuidv4() + "_" + file.originalname,
        Body: file.buffer,
        ContentType: file.mimetype, 
        ContentDisposition: `inline;filename=${file.originalname}`
        };
        s3bucket.upload(params, function(err,data) {
            if(err){
                return res.status(500).json({ error: true, Message: err })
            } else {
                newFileUploaded = {
                    filename: file.originalname,
                    s3_key: params.Key,
                    s3_directory: "announcements/",
                    announcement_id: req.params.id
                }

                var document = new FileAnnouncement(newFileUploaded);
                document.save(function(error, newFile) {
                    if(error) {
                        throw error
                    }
                    console.log(newFile)
                })
            }
        }).on("httpUploadProgress", function(data){
            if(data.loaded == data.total){
                numsFileUploaded++;
                if(numsFileUploaded == files.length){
                    return res.json({success: "Successfully uploaded the lampiran file"});
                }
            }
        })
    })
})

router.get("/download/:id", (req,res) => {
    let s3bucket = new AWS.S3()

    FileAnnouncement.findById(req.params.id).then((result, err) => {
        if(!result)
        return res.status(400).json(err)
    
        let params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: result.s3_key,
        Expires: 5 * 60,
        ResponseContentDisposition :`attachment;filename=${result.filename}`
        }

        const url = s3bucket.getSignedUrl('getObject', params)
        return res.status(200).json(url);
    })
})

// Router to delete a DOCUMENT file
router.delete("/:id", (req, res) => {
    const {file_to_delete} = req.body;
  
    if(!file_to_delete){
        FileAnnouncement.find({ announcement_id: req.params.id}).then((items) => {
        let id_list = items.map((m) => Object(m._id))
        let file_to_delete = items
    
            FileAnnouncement.deleteMany({
                _id: {
                    $in: id_list
                    }
                }, function(err, results){
                if(!results){
                    return res.status(404).json(err)
                } 
                //Now Delete the file from AWS-S3
                // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#deleteObject-property
                let s3bucket = new AWS.S3();
                file_to_delete.forEach((file) => {
                    let params = {
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: file.s3_key
                    };
                    s3bucket.deleteObject(params, (err, data) => {
                    if (!data)
                        return res.status(404).json(err)
                    });
                })
                return res.status(200).send("Success")
            });
        })
  } else{
      let id_list = file_to_delete.map((m) => Object(m._id))
      FileAnnouncement.deleteMany({
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
              Bucket: process.env.AWS_BUCKET_NAME,
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
  });

  router.get("/by_announcement/:id", (req, res) => {
    FileAnnouncement.find({ announcement_id: req.params.id })
    .then((results, err) => {
      if(!results)
        return res.status(400).json(err);
      else{
        results.sort((a,b) => (a.filename > b.filename) ? 1 : -1)
        return res.status(200).json(results)
      }
    })
  })

  router.get("/:id", (req,res) => {
      let s3bucket = new AWS.S3()

      FileAnnouncement.findById(req.params.id).then((result, err) => {
        if(!result)
          return res.status(400).json(err);

        let params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: result.s3_key,
            Expires: 5 * 60,
            ResponseContentDisposition :`inline;filename=${result.filename}`
        }
        const url = s3bucket.getSignedUrl('getObject', params)
        return res.status(200).json(url);
  })
})

module.exports = router;
