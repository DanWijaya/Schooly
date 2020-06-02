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
const Task = require("../../models/Task");

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
        // const filename = buf.toString('hex') + path.extname(file.originalname);
        const filename = file.originalname 
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
const uploadAvatar = multer({ storage: avatar_storage });
const uploadTugas = multer({ storage: tugas_storage });

//Uploading for Avatar
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

  
  // @route POST /upload  
  // @desc Upload files to DB
  router.post('/upload/:id', uploadAvatar.single('avatar'), (req,res) => {

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
    console.log(req.file.filename)
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
router.delete('/tugas/:userid/:tugasid/', (req,res) => {
  tugas_id = new mongoose.mongo.ObjectId(req.params.tugasid)
  user_id = req.params.userid;

  gfs2.remove({ _id: tugas_id, root: 'tugas' }, (err, gridStore) => {
    if(err) {
      return res.status(404).json({err: err});
    } else{
      console.log("Successful")
      // return res.json("Successful")
     }

  })

  User.findById(user_id, (err, user) => {
    let tugas_id = req.params.tugasid;

    if(!user){
      return res.status(404).json({usernotfound: "User not found"});
    } 
    else {
      for (var i = 0; i < user.tugas.length; i++){
        if(user.tugas[i].id == tugas_id)
          user.tugas.splice(i,1)
      }
      
      user
          .save()
          .then(res.json("Successfully delete the task in user data"))
          .catch(err => res.status(400).send("Unable to update user"))

    }
  })
})
router.delete('/image/:name', (req,res) => {
  gfs.remove({ filename: req.params.name, root: 'avatar' }, (err, gridStore) => {
    if (err) {
      return res.status(404).json({ err: err });
    }
    else{
     return res.json("Successful")
    }

  });
})


// Upload Tugas
  router.post('/uploadtugas/:user_id/', uploadTugas.single('tugas'), (req,res) => {
    // To get the file details, use req.file
    let id = req.params.user_id
    console.log("Uploading the task file")
    User.findById(id, (err, user) => {
      if(!user){
        console.log("User not found")
        return res.status(404).json({ usernotfound: "Pengguna tidak ditemukan"});
      }

      else{
        let taskId = req.file.id
        let filename = req.file.filename
        console.log(taskId)
        console.log(filename)
        user.tugas.push({id: taskId, filename: filename})

        user
          .save()
          .then(console.log("Done with updating task field on User"))
          .catch(err => console.log(err))
        
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

  //pakai read stream utk display imagenya di browser

  // @route GET /files/:filename
  // @desc  Display single file object

  router.get('/tugas/:id', (req,res) => {
    id = new mongoose.mongo.ObjectId(req.params.id)
    gfs2.files.findOne({_id: id}, (err, file) => {
      // Check if files
      if (!file || file.length === 0) {
        return res.status(404).json({
          err: 'Tugas tidak ada'
        });
      }
      var type = file.contentType;
      var filename = file.filename;
      res.set('Content-Type', type);
      res.set('Content-Disposition', "inline;filename=" + filename)

      // Files exist
      const readStream = gfs2.createReadStream(filename);
      readStream.pipe(res)
    });
    });
  


module.exports = {router, uploadAvatar, uploadTugas};