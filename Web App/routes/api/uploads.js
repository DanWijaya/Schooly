const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const GridFsStorage = require("multer-gridfs-storage")
const GridFsStream = require("gridfs-stream");
const methodOverride = require("method-override")
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys")
const http = require('http');
const mongoose = require("mongoose");
const User= require("../../models/user_model/User");
const Task = require("../../models/Task");
const { reject } = require("async");
const { resolve } = require("path");

// Create Mongo Connection
mongoose.set('useUnifiedTopology', true);
mongoose.set('useNewUrlParser', true)
const conn = mongoose.createConnection(keys.mongoURI)

// Initialize gfs
let gfsAvatar;
let gfsTugas;
let gfsLampiran;

conn.once("open", () => {
  // Initialize Stream
  gfsAvatar = GridFsStream(conn.db, mongoose.mongo);
  gfsAvatar.collection("avatar")

  gfsTugas = GridFsStream(conn.db, mongoose.mongo);
  gfsTugas.collection("tugas")
  
  gfsLampiran = GridFsStream(conn.db, mongoose.mongo);
  gfsLampiran.collection("lampiran")
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
          const filename = buf.toString("hex") + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: "avatar"
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
        // const filename = buf.toString("hex") + path.extname(file.originalname);
        const filename = file.originalname
        const fileInfo = {
          filename: filename,
          bucketName: "tugas"
        };
        resolve(fileInfo);
      });
    });
  }
});

var lampiran_storage = new GridFsStorage({
  url: keys.mongoURI,
  file: (req,file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if(!err) {
          return reject(err);
        }
    const filename = file.originalname
    const fileInfo = {
      filename: filename, 
      bucketName: "lampiran"
    };
    resolve(fileInfo);
  })
})
  }
})

// Create the middleware which facilitates file uploads
const uploadAvatar = multer({ storage: avatar_storage });
const uploadTugas = multer({ storage: tugas_storage });
const uploadLampiran = multer({ storage: lampiran_storage});

// ------------------------------ Part for Avatar uploads ------------------------------- //
//Uploading for Avatar
router.get("/image-upload", (req,res) => {
    console.log("AA")
    gfsAvatar.files.find().toArray((err, files) => {
      // Check if files
      if (!files || files.length === 0) {
        res.render("image-upload", {files: false})
      } else {
        files.map(file => {
          if(file.contentType === "image/jpeg" || file.contentType === "image/png" || file.contentType === "image/jpg")
          {
            file.isImage = true;
          } else {
            file.isImage = false;
          }
        });
        res.render("image-upload", {files: files})
      }

      // Files exist
      return res.json(files);
    });
  })
  // @route GET /files
  // @desc Display all files in JSON
  router.get("/files/", (req, res) => {
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
  });

  // @route POST /upload
  // @desc Upload files to DB
  // This part where it uploads the avatar is done on users.js (because want to update the user data at the same time)
  /* router.post("/upload/:id", uploadAvatar.single("avatar"), (req,res) => {

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

    res.redirect("/image-upload");
    console.log(req.file.filename)
  }); */

  router.get("/image/:filename", (req, res) => {
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
      } else {
        res.status(404).json({
          err: "Not an image"
        });
      }
    });
  });

  router.delete("/image/:name", (req,res) => {
    gfsAvatar.remove({ filename: req.params.name, root: "avatar" }, (err, gridStore) => {
      if (err) {
        return res.status(404).json({ err: err });
      }
      else{
       return res.json("Successful")
      }
  
    });
  })

// --------------------------------- Tugas uploads ------------------------------------ //
// // @route DELETE /files/:id
// // @desc Delete File
// Upload Tugas
router.post("/uploadtugas/:user_id/:task_id", uploadTugas.array("tugas", 5), (req,res) => {
  // To get the file details, use req.file

  let id = req.params.user_id
  let task_id = req.params.task_id;
  console.log("Uploading the task file")

  User.findById(id, (err, user) => {
    if(!user){
      console.log("User not found")
      return res.status(404).json({ usernotfound: "Pengguna tidak ditemukan"});
    }

    else{
      for(var i = 0; i < req.files.length; i++) {
        user.tugas.push({id: req.files[i].id,
            filename: req.files[i].filename,
            for_task_object: task_id})
      }
      user
        .save()
        .then(console.log("Successfully upload the task in user data"))
        .catch(err => console.log(err))
    }
  })

  res.json("Upload file completed")
})

router.get("/tugas/:id", (req,res) => {
  id = new mongoose.mongo.ObjectId(req.params.id)
  gfsTugas.files.findOne({_id: id}, (err, file) => {
    // Check if files
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: "Tugas tidak ada"
      });
    }
    var type = file.contentType;
    var filename = file.filename;
    res.set("Content-Type", type);
    res.set("Content-Disposition", "attachment;filename=" + filename) // harus pakai attachment.

    // Files exist
    const readStream = gfsTugas.createReadStream(filename);
    readStream.pipe(res)

  });
  });

router.get("/previewtugas/:id", (req,res) => {
  id = new mongoose.mongo.ObjectId(req.params.id)
  gfsTugas.files.findOne({_id: id}, (err, file) => {
    // Check if files
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: "Tugas tidak ada"
      });
    }
    var type = file.contentType;
    var filename = file.filename;
    res.set("Content-Type", type);
    res.set("Content-Disposition", "inline;filename=" + filename)

    // Files exist
    const readStream = gfsTugas.createReadStream(filename);
    readStream.pipe(res)

});
})

router.get("/filetugas", (req, res) => {
  gfsTugas.files.find().toArray((err, files) => {
    // Check if files
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: "Tugas belum ada"
      });
    }

    // Files exist
    return res.json(files);
  });
});

router.delete("/tugas/:userid/:tugasid/", (req,res) => {
  tugas_id = new mongoose.mongo.ObjectId(req.params.tugasid)
  user_id = req.params.userid;

  gfsTugas.remove({ _id: tugas_id, root: "tugas" }, (err, gridStore) => {
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

  console.log("Delete file completed")
})

// ------------------------------ Part untuk upload lampiran tugas -------------------- //
//When uploading the lampiran, it is done tgt when creating the task object. 
// So, this implementation is on router.post("/create") in tasks.js file

router.post("/upload_lampiran/:task_id", uploadLampiran.array("lampiran", 5), (req,res) => {
  let task_id = req.params.task_id;
  console.log('Task Id is:', task_id)
  Task.findById(task_id, (err, task) => {
    console.log("This is the task", task)
    if(!task){
      return res.status(404).json({tasknotfound: "Task not found"});
    } else {
      let temp = []
      for(var i = 0; req.files.length; i++){
        temp.push(req.files[i].id)
      }
      
      task.lampiran = temp;
      task.save()
          .then(res.json("Successfully delete the task in user data"))
          .catch(err => res.status(400).send("Unable to update"))
      
      return res.status(200).json({success: "lampiran is uploaded"})
    }
  })
})
module.exports = {router, uploadAvatar, uploadTugas, uploadLampiran};