const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const GridFsStorage = require("multer-gridfs-storage")
const GridFsStream = require("gridfs-stream");
const keys = require("../../../config/keys")
const mongoose = require("mongoose");
const User= require("../../../models/user_model/User");
const Task = require("../../../models/Task");

// Create Mongo Connection
mongoose.set('useUnifiedTopology', true);
mongoose.set('useNewUrlParser', true)
const conn = mongoose.createConnection(keys.mongoURI)

// Storage Engine initialization function
function storageEngine(bucketName, random=false) {
  return new GridFsStorage({
    url: keys.mongoURI,
    file: (req,file) => {
      return new Promise((resolve,reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          let filename
          if (random)
            filename = buf.toString("hex") + path.extname(file.originalname);
          else
            filename = file.originalname;

          const fileInfo = {
            filename: filename,
            bucketName: bucketName
          };

          resolve(fileInfo);
        })
      })
    }
  })
}

// Create storage engine
var avatar_storage = storageEngine("avatar", true)
var tugas_storage = storageEngine("tugas")
var lampiran_tugas_storage = storageEngine("lampiran_tugas")
var lampiran_announcement_storage = storageEngine("lampiran_announcement")
var lampiran_materi_storage = storageEngine("lampiran_materi");
var lampiran_assessment_storage = storageEngine("lampiran_assessment");

// Create the middleware which facilitates file uploads
const uploadAvatar = multer({ storage: avatar_storage });
const uploadTugas = multer({ storage: tugas_storage });
const uploadLampiranTugas= multer({ storage: lampiran_tugas_storage});
const uploadLampiranAnnouncement = multer({ storage: lampiran_announcement_storage});
const uploadLampiranMateri = multer({ storage: lampiran_materi_storage});
const uploadLampiranAssessment = multer({ storage: lampiran_assessment_storage})

module.exports = {
   router,
   uploadAvatar, 
   uploadTugas, 
   uploadLampiranTugas,
   uploadLampiranAnnouncement,
   uploadLampiranMateri,
   uploadLampiranAssessment
};
