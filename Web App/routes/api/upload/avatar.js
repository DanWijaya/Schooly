const express = require("express");
const router = express.Router(); 
const GridFsStream = require("gridfs-stream");
const keys = require("../../../config/keys")
const mongoose = require("mongoose");
const User= require("../../../models/user_model/User");
const uploads = require("./uploads");

const uploadAvatar = uploads.uploadAvatar;

// Create Mongo Connection
mongoose.set('useUnifiedTopology', true);
mongoose.set('useNewUrlParser', true)
const conn = mongoose.createConnection(keys.mongoURI)

// Initialize gfs
let gfsAvatar;


conn.once("open", () => {
  // Initialize Stream
  gfsAvatar = GridFsStream(conn.db, mongoose.mongo);
  gfsAvatar.collection("avatar")
})

// ------------------------------ Part for Avatar uploads ------------------------------- //
// Uploading for Avatar
router.get("/image-upload", (req,res) => {
  console.log("AA")
  if (Boolean(gfsAvatar)) {
    gfsAvatar.files.find().toArray((err, files) => {
      // Check if files
      if (!files || files.length === 0) {
        res.render("image-upload", {files: false})
      }
      else {
        files.map(file => {
          if (file.contentType === "image/jpeg" || file.contentType === "image/png" || file.contentType === "image/jpg") {
            file.isImage = true;
          }
          else {
            file.isImage = false;
          }
        });
        res.render("image-upload", {files: files})
      }

      // Files exist
      return res.json(files);
    });
  }
})
// @route GET /files
// @desc Display all files in JSON
router.get("/files/", (req, res) => {
  if (Boolean(gfsAvatar)) {
    gfsAvatar.files.find().toArray((err, files) => {
      // Check if files
      if (!files || files.length === 0) {
        return res.status(404).json({
          err: "No files exist"
        });
      }

      // Files exist
      return res.json(files);
    });
  }
});

// @route POST /upload
// @desc Upload files to DB
// This part where it uploads the avatar is done on users.js (because want to update the user data at the same time)
/* router.post("/upload/:id", uploadAvatar.single("avatar"), (req,res) => {*/

router.get("/:filename", (req, res) => {
  if (Boolean(gfsAvatar)) {
    gfsAvatar.files.findOne({ filename: req.params.filename }, (err, file) => {
      // Check if file
      if (!file || file.length === 0) {
        return res.status(404).json({
          err: "No file exists"
        });
      }
      // Check if Image
      if (file.contentType === "image/jpeg" || file.contentType === "image/png" || file.contentType === "image/jpg") {
        // Show outputnya di browser kita

        const readStream = gfsAvatar.createReadStream(file.filename);
        readStream.pipe(res)
      }
      else {
        res.status(404).json({
          err: "Not an image"
        });
      }
    });
  }
});

router.delete("/:name", (req,res) => {
  if (Boolean(gfsAvatar)) {
    gfsAvatar.remove({ filename: req.params.name, root: "avatar" }, (err, gridStore) => {
      if (err) {
        return res.status(404).json({ err: err });
      }
      else {
      return res.json("Successful")
      }

    });
  }
})

module.exports = {router, uploadAvatar};