const express = require("express");
const router = express.Router();
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const GridFsStorage = require("multer-gridfs-storage")
const GridFsStream = require("gridfs-stream");
const methodOverride = require("method-override")
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys")

const mongoose = require("mongoose");
const User= require("../../models/user_model/User");

// Create Mongo Connection F
const conn = mongoose.createConnection(keys.mongoURI)

// Initialize gfs
let gfs;
let gfs2;

conn.once('open', () => {
  // Initialize Stream
  gfs = GridFsStream(conn.db, mongoose.mongo);
  gfs.collection('avatar')

  gfs2 = GridFsStream(conn.db, mongoose.mongo);
  gfs2.collection('tugas')

  // all set!
})


// Create storage engine
var avatar_storage = new GridFsStorage({
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
 
  var tugas_storage = new GridFsStorage({
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
            bucketName: 'tugas'
          };
          resolve(fileInfo);
        });
      });
    }
  });


// Create the middleware which facilitates file uploads
const upload = multer({ storage: avatar_storage });
const upload2 = multer({ storage: tugas_storage });

router.get('/image-upload', (req,res) => {
    console.log("AA")
    gfs.files.find().toArray((err, files) => {
      // Check if files
      if (!files || files.length === 0) {
        res.render('image-upload', {files: false})
      } else {
        files.map(file => {
          if(file.contentType === 'image/jpeg' || file.contentType === 'image/png' || file.contentType === 'image/jpg')
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
  router.post('/upload/:id', upload.single('avatar'), (req,res) => {
    // res.json({ file: req.file});
    let id = req.params.id
    User.findById(id, (err, userData) => {
      if(!userData)
        res.status(404).send("User data is not found");
      else{
        userData.avatar = req.file.filename;

        userData
              .save()
              .then()
              .catch(err => res.status(400).send("Unable to update user"))
      }
    })

    res.redirect('/image-upload');
    console.log(req.params)
    console.log(req.file.filename)
  });

  router.post('/uploadtugas', upload2.single('tugas'), (req,res) => {
    console.log("test upload tugas")
    console.log(req)
    console.log("Tugas telah diupload")
    
    // return res.json("Success")
  })

  router.get('/tugas/:filename', (req,res) => {

  })
  router.get('/download/:id', (req,res) => {
    tugasModel.find({_id:req.params.id}, (err,data) => {
      if(err){
        console.log(err)
      }
      else { 
        var path= __dirname+'/public'+data[0].tugasPath;
        res.download(path);
      }
    })
  })

  router.get('/filetugas', (req, res) => {
    gfs2.files.find().toArray((err, files) => {
      // Check if files
      if (!files || files.length === 0) {
        return res.status(404).json({
          err: 'Tugas belum ada'
        });
      }

      // Files exist
      return res.json(files);
    });
  });

  // @route GET /files
  // @desc Display all files in JSON
  router.get('/files/', (req, res) => {
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

  router.get('/tugass/:filename', (req,res) => {
    gfs2.files.findOne({filename: req.params.filename}, (err, file) => {
      // Check if files
      if (!file || file.length === 0) {
        return res.status(404).json({
          err: 'Tugas tidak ada'
        });
      }

      // Files exist
      const readStream = gfs2.createReadStream(file.filename);
      readStream.pipe(res)
    });
    });
  
  router.get('/image/:filename', (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
      // Check if file
      if (!file || file.length === 0) {
        return res.status(404).json({
          err: 'No file exists'
        });
      }
      // Check if Image
      if (file.contentType === 'image/jpeg' || file.contentType === 'image/png' || file.contentType === 'image/jpg') {
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

// // @route DELETE /files/:id
// // @desc Delete File

router.delete('/image/:name', (req,res) => {
  gfs.remove({ filename: req.params.name, root: 'avatar' }, (err, gridStore) => {
    if (err) {
      return res.status(404).json({ err: err });
    }
    else{
     return res.json("Successful")
    }
    // res.redirect('/');
  });
})

// router.get('/download/tugas/:id', (req,res) => {
//   gfs2.find({filename:req.params.filename}, (err,data)=> {
//     if(err)
//       console.log(err)
//     else{
//       var 
//     }
//   })
// })
module.exports = {router, upload, upload2};