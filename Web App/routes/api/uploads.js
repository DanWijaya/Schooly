const express = require("express");
const router = express.Router();
const keys = require("../../config/keys");
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const GridFsStorage = require("multer-gridfs-storage")
const GridFsStream = require("gridfs-stream");
const methodOverride = require("method-override")


const mongoose = require("mongoose");

// Create Mongo Connection 
const conn = mongoose.createConnection(keys.mongoURI)

// Initialize gfs 
let gfs;

conn.once('open', () => {
  // Initialize Stream
  gfs = GridFsStream(conn.db, mongoose.mongo);
  gfs.collection('avatar')
  // all set!
})


// Create storage engine
var storage = new GridFsStorage({
    url: keys.mongoURI,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'avatar'
          };
          resolve(fileInfo);
        });
      });
    }
  });

// Create the middleware which facilitates file uploads
const upload = multer({ storage });

router.get('/image-upload', (req,res) => {
    console.log("AA")
    gfs.files.find().toArray((err, files) => {
      // Check if files
      if (!files || files.length === 0) {
        res.render('image-upload', {files: false})
      } else {
        files.map(file => {
          if(file.contentType === 'image/jpeg' || file.contentType === 'img/png' || file.contentType === 'img/jpg')
          {
            file.isImage = true;
          } else {
            file.isImage = false;
          }
        });
        res.render('image-upload', {files: files})
      }
  
      // Files exist
      return res.json(files);
    });
  })
  // @route POST /upload
  // @desc Upload files to DB
  router.post('/upload', upload.single('avatar'), (req,res) => {
    // res.json({ file: req.file});
    res.redirect('/image-upload')
    console.log(req.file.filename)
  });
  
  // @route GET /files
  // @desc Display all files in JSON
  router.get('/files', (req, res) => {
    gfs.files.find().toArray((err, files) => {
      // Check if files
      if (!files || files.length === 0) {
        return res.status(404).json({
          err: 'No files exist'
        });
      }
  
      // Files exist
      return res.json(files);
    });
  });
  
  // @route GET /files/:filename
  // @desc  Display single file object
  router.get('/files/:filename', (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
      // Check if file
      if (!file || file.length === 0) {
        return res.status(404).json({
          err: 'No file exists'
        });
      }
      // File exists
      return res.json(file);
    });
  });
  
  //pakai read stream utk display imagenya di browser
  
  // @route GET /files/:filename
  // @desc  Display single file object
  router.get('/image/:filename', (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
      // Check if file
      if (!file || file.length === 0) {
        return res.status(404).json({
          err: 'No file exists'
        });
      }
      // Check if Image
      if (file.contentType === 'image/jpeg' || file.contentType === 'img/png' || file.contentType === 'img/jpg') {
        // Show outputnya di browser kita
        const readStream = gfs.createReadStream(file.filename);
        readStream.pipe(res)
      } else {
        res.status(404).json({
          err: "Not an image"
        });
      }
    });
  });

module.exports = router;