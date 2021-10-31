// 'use strict'
const express = require("express");
const router = express.Router();
const FileMaterial = require("../../../models/lampiran/FileMaterial");
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

// route to upload a pdf document file
// In upload.single("file") - the name inside the single-quote is the name of the field that is going to be uploaded.
router.post(
  "/upload/:material_id",
  upload.array("lampiran_materi"),
  async (req, res) => {
    try {
      const { files } = req;
      const { material_id, author_id } = req.params;
      let s3bucket = new AWS.S3({
        accessKeyId: keys.awsKey.AWS_ACCESS_KEY_ID,
        secretAccessKey: keys.awsKey.AWS_SECRET_ACCESS_KEY,
        region: keys.awsKey.AWS_REGION,
      });

      let promises = files.map((file) => {
        var params = {
          Bucket: keys.awsKey.AWS_BUCKET_NAME,
          Key: "material/" + uuidv4() + "_" + file.originalname,
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
                  s3_directory: "materials/",
                  material_id: material_id,
                };
                let document = new FileMaterial(newFileUploaded);
                resolve(document);
              }
            });
        });
      });

      const documents = await Promise.all(promises);
      await FileMaterial.insertMany(documents);
      return res.json({
        _id: material_id,
        success: "Successfully uploaded the lampiran file",
      });
    } catch (err) {
      console.error("Upload fileMaterials failed");
      console.error(err);
      return res.status(500).json({ error: true, Message: err });
    }
  }
);

router.get("/download/:id", (req, res) => {
  let s3bucket = new AWS.S3();

  FileMaterial.findById(req.params.id)
    .then((result) => {
      if (!result) return res.status(400).json(err);

      let params = {
        Bucket: keys.awsKey.AWS_BUCKET_NAME,
        Key: result.s3_key,
        Expires: 5 * 60,
        ResponseContentDisposition: `attachment;filename=${result.filename}`,
      };
      const url = s3bucket.getSignedUrl("getObject", params);
      return res.json(url);
    })
    .catch((err) => {
      console.error("Download file Material failed");
      console.error(err);
      return res.status(400).json(err);
    });
});

router.delete("/all/:id", async (req, res) => {
  try {
    // req.params.id ini berupa id dari material.
    const file_to_delete = await FileMaterial.find({
      material_id: req.params.id,
    });
    // file_to_delete ini berupa ID dari file filenya.
    if (!file_to_delete) {
      return res.json("No file materials to delete");
    }
    await FileMaterial.deleteMany({
      material_id: req.params.id,
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
    return res.json("Success");
  } catch (err) {
    console.error("Error in deleting all file materials files");
    console.error(err);
    return res.status(404).json(err);
  }
});

// Router to delete a DOCUMENT file
router.delete("/:id", async (req, res) => {
  const { file_to_delete } = req.body;
  // if file_to_delete is undefined,means that the object is deleted and hence all files should be deleted.
  if (!file_to_delete) {
    return res.json("No file materials to delete");
  }
  try {
    let id_list = file_to_delete.map((m) => ObjectId(m._id));
    console.log("Ini id list: ", id_list);
    const results = await FileMaterial.find({ _id: { $in: id_list } });
    await FileMaterial.deleteMany({ _id: { $in: id_list } });

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
    return res.send("Success");
  } catch (err) {
    console.error("Delete File material failed");
    console.error(err);
    return res.status(404).json(err);
  }
});

router.get("/by_material/:id", (req, res) => {
  FileMaterial.find({ material_id: req.params.id })
    .then((results) => {
      if (!results.length) throw "File material by_material is empty";
      results.sort((a, b) => (a.filename > b.filename ? 1 : -1));
      return res.json(results);
    })
    .catch((err) => {
      console.error("File material by_material failed");
      console.error(err);
      return res.status(400).json(err);
    });
});

router.get("/:id", (req, res) => {
  FileMaterial.findById(req.params.id)
    .then((result) => {
      if (!result) throw "File material is empty";
      const url = `${keys.cdn}/${result.s3_key}`;
      return res.json(url);
    })
    .catch((err) => {
      console.error("Get one file material failed");
      console.error(err);
      return res.status(400).json(err);
    });
});

module.exports = router;
