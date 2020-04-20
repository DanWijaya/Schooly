const express = require('express');
const router = express.Router();
// @desc uploads file to DB

const mongoose = require('mongoose');
const key = require('../../config/keys').mongoURI
const path = require('path')
const crypto = require('crypto');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const GridFsStream = require('gridfs-stream');
const methodOverride = require('method-override');


const conn = mongoose.createConnection(key);
console.log(conn)
conn.once('open', function () {
  // Intialize stream
  gfs = GridFsStream(conn.db, mongoose.mongo);
  gfs.collection('uploads')
  // all set!
})

// Create storage engine (a storage object basically)
// crypto.randomBytes us used to generate names (16 chars)
const storage = new GridFsStorage({
    url: key,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'uploads'
          };
          resolve(fileInfo);
        });
      });
    }
  }); 

  const upload = multer({ storage})


// @route GET /
// @desc Loads form
router.get('/image-upload', (req, res) => {
    gfs.files.find().toArray((err, files) => {
      // Check if files
      if (!files || files.length === 0) {
        res.render('index', { files: false });
      } else {
        files.map(file => {
          if (
            file.contentType === 'image/jpeg' ||
            file.contentType === 'image/png'
          ) {
            file.isImage = true;
          } else {
            file.isImage = false;
          }
        });
        res.render('index', { files: files });
      }
    });
  });
  
  // @route POST /upload
  // @desc  Uploads file to DB
  router.post('/upload', (req, res) => {
    console.log(req)
    upload.single(req)
    console.log("Upload method")
    // res.json({ file: req });
    // res.redirect('/image-upload');
  });
  
  // @route GET /files
  // @desc  Display all files in JSON
  router.get('/files', (req, res) => {
    gfs.files.find({}).toArray((err, files) => {
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
  
  // @route GET /image/:filename
  // @desc Display Image
  router.get('/image/:filename', (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
      // Check if file
      if (!file || file.length === 0) {
        return res.status(404).json({
          err: 'No file exists'
        });
      }
  
      // Check if image
      if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
        // Read output to browser
        const readstream = gfs.createReadStream(file.filename);
        readstream.pipe(res);
      } else {
        res.status(404).json({
          err: 'Not an image'
        });
      }
    });
  });
  
  // @route DELETE /files/:id
  // @desc  Delete file
  router.delete('/files/:id', (req, res) => {
    gfs.remove({ _id: req.params.id, root: 'uploads' }, (err, gridStore) => {
      if (err) {
        return res.status(404).json({ err: err });
      }
  
      res.redirect('/');
    });
  });

  module.exports = router;
