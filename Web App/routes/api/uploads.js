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
const Announcement = require("../../models/Announcement");
const { reject } = require("async");
const { resolve } = require("path");
const { Console } = require("console");

// Create Mongo Connection
mongoose.set('useUnifiedTopology', true);
mongoose.set('useNewUrlParser', true)
const conn = mongoose.createConnection(keys.mongoURI)

// Initialize gfs
let gfsAvatar, gfsTugas, gfsLampiran, gfsLampiranAnnouncement;

conn.once("open", () => {
  // Initialize Stream
  gfsAvatar = GridFsStream(conn.db, mongoose.mongo);
  gfsAvatar.collection("avatar")

  gfsTugas = GridFsStream(conn.db, mongoose.mongo);
  gfsTugas.collection("tugas")

  gfsLampiran = GridFsStream(conn.db, mongoose.mongo);
  gfsLampiran.collection("lampiran")

  gfsLampiranAnnouncement = GridFsStream(conn.db, mongoose.mongo);
  gfsLampiranAnnouncement.collection("lampiran_announcement")
})

// Storage Engine initialization function
function storageEngine(bucketName, random=false){
  return new GridFsStorage({
    url: keys.mongoURI,
    file: (req,file) => {
      return new Promise((resolve,reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          let filename
          if(random)
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
var lampiran_storage = storageEngine("lampiran")
var lampiran_announcement_storage = storageEngine("lampiran_announcement")

// Create the middleware which facilitates file uploads
const uploadAvatar = multer({ storage: avatar_storage });
const uploadTugas = multer({ storage: tugas_storage });
const uploadLampiran = multer({ storage: lampiran_storage});
const uploadLampiranAnnouncement = multer({ storage: lampiran_announcement_storage});

// ------------------------------ Part for Avatar uploads ------------------------------- //
//Uploading for Avatar
router.get("/image-upload", (req,res) => {
    console.log("AA")
    if(Boolean(gfsAvatar)){
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
    }
  })
  // @route GET /files
  // @desc Display all files in JSON
  router.get("/files/", (req, res) => {
    if(Boolean(gfsAvatar)){
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
    if(Boolean(gfsAvatar)){
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
    }
  });

  router.delete("/image/:name", (req,res) => {
    if(Boolean(gfsAvatar)){
      gfsAvatar.remove({ filename: req.params.name, root: "avatar" }, (err, gridStore) => {
        if (err) {
          return res.status(404).json({ err: err });
        }
        else{
        return res.json("Successful")
        }

      });
    }
  })

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
  let id = new mongoose.mongo.ObjectId(req.params.id)
  if(Boolean(gfsTugas)){
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
  }
});

router.get("/previewtugas/:id", (req,res) => {
  id = new mongoose.mongo.ObjectId(req.params.id)
  if(Boolean(gfsTugas)){
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
  }
})

router.get("/filetugas", (req, res) => {
  if(Boolean(gfsTugas)){
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
  }
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

// Lampiran Upload
// When uploading the lampiran, it is done tgt when creating the task object
// So, this implementation is on router.post("/create") in tasks.js file

router.post("/upload_lampiran/:task_id", uploadLampiran.array("lampiran", 5), (req,res) => {
  let task_id = req.params.task_id;
  console.log("Upload lampiran is runned")
  console.log('Task Id is:', task_id)
  Task.findById(task_id, (err, task) => {
    console.log("This is the task", task)
    if(!task){
      return res.status(404).json({tasknotfound: "Task not found"});
    } else {
      let temp = []
      console.log("Files are here: ", req.files)
      for(var i = 0; i< req.files.length; i++){
        console.log(req.files[i])
        temp.push({
          id: req.files[i].id,
          filename: req.files[i].filename,
        })
      }
      console.log("Temp: ", temp)
      // kalau udah ada lampiran, push aja.
      if(task.lampiran != undefined && task.lampiran.length > 0){
        let temp2 = [...task.lampiran, ...temp]
        task.lampiran = temp2
      } else{
        task.lampiran = temp;
      }

      console.log(task.lampiran)
      task.save()// kadang" kalau masukkin res.json di Error, bisa ada error cannot set headers after they are sent to the client.
          .then(task => console.log("Task"))
          .catch(err => {console.log("error kan ini")})

        }
    })
  res.json({success: "Successfully uploaded the lampiran file"})
})


router.get("/lampiran/:task_id", (req,res) => {
  id = new mongoose.mongo.ObjectId(req.params.task_id)
  if(Boolean(gfsLampiran)){
    gfsLampiran.files.findOne({_id: id}, (err, file) => {
      // Check if files
      if (!file || file.length === 0) {
        return res.status(404).json({
          err: "Tugas tidak ada"
        });
      }
      var type = file.contentType;
      var filename = file.filename;
      res.set("Content-Type", type);
      res.set("Content-Disposition", "attachment;filename=" + filename) // harus pakai attachment untuk download.

      // Files exist
      const readStream = gfsLampiran.createReadStream(filename);
      readStream.pipe(res)
    })
  }
})

router.get("/previewlampiran/:task_id", (req,res) => {
  console.log("Previewing lampiran")
  id = new mongoose.mongo.ObjectId(req.params.task_id)
  if(Boolean(gfsLampiran)){
    gfsLampiran.files.findOne({_id: id}, (err, file) => {
      // Check if files
      if (!file || file.length === 0) {
        return res.status(404).json({
          err: "Tugas tidak ada"
        });
      }
      var type = file.contentType;
      var filename = file.filename;
      res.set("Content-Type", type);
      res.set("Content-Disposition", "inline;filename=" + filename) // harus pakai inline untuk preview.

      // Files exist
      const readStream = gfsLampiran.createReadStream(filename);
      readStream.pipe(res)
    })
  }
})

router.delete("/lampiran/:task_id", (req,res) => {
  let task_id = req.params.task_id;
  const {lampiran_to_delete, current_lampiran} = req.body;
  for(var i = 0; i < lampiran_to_delete.length; i++){
    lampiran_id = new mongoose.mongo.ObjectId(lampiran_to_delete[i].id)
    // di rootnya, masukkin collection namenya..
    gfsLampiran.remove({ _id: lampiran_id, root: "lampiran"}, (err) => {
      if(err) {
        console.log("error occured")
        return res.status(404).json({err: "Error in removing the files"});
      } else {
        console.log("Sucessful, lampiran kenadelete")
      }
    })

    for(var j =0; j < current_lampiran.length; j++) {
      if(current_lampiran[j].filename == lampiran_to_delete[i].filename){
        current_lampiran.splice(j,1)
        break;
      }
    }
  }

  Task.findById(task_id, (err, task) => {
    if(!task){
      return res.status(404).json("Task object is not found in the Database")
    } else {
      task.lampiran = current_lampiran;
      task.save()
          .then((task) => {return res.json({success: "Successfully updated the lampiran file and the lampiran field on Task object"})})
          .catch((err) => console.log("Error happened in updating task lampiran field"))
    }
  })
})

// Router for handling the upload lampiran announcement...
router.post("/upload_lampiran_annoucement/:id", uploadLampiranAnnouncement.array("lampiran_announcement", 5), (req,res) => {
  let announcement_id = req.params.id;
  console.log("Upload lampiran is runned")

  Announcement.findById(announcement_id, (err, announcement) => {
    console.log("This is the announcement", announcement)
    if(!announcement){
      return res.status(404).json({notfound: "Announcement not found"});
    } else {
      let temp = [];
      console.log("Files are here: ", req.files)
      // console.log("Files are here: ", req.files)
      for(var i = 0; i< req.files.length; i++){
        console.log(req.files[i])
        temp.push({
          id: req.files[i].id,
          filename: req.files[i].filename,
        })
      }
      console.log("Temp: ", temp)

      // kalau udah ada lampiran, push aja.
      if(announcement.lampiran != undefined && announcement.lampiran.length > 0){
        let temp2 = [...announcement.lampiran, ...temp]
        announcement.lampiran = temp2
      } else{
        announcement.lampiran = temp;
      }

      announcement.save()// kadang" kalau masukkin res.json di Error, bisa ada error cannot set headers after they are sent to the client.
                  .then(announcement => console.log("Lampiran announcement"))
                  .catch(err => {console.log("error kan ini")})

        }
    })
  res.json({success: "Successfully uploaded the lampiran file"})
})

router.delete("/lampiran_announcement/:id", (req,res) => {
  let announcement_id = req.params.id;
  const {lampiran_to_delete, current_lampiran} = req.body;
  for(var i = 0; i < lampiran_to_delete.length; i++){
    announcement_id = new mongoose.mongo.ObjectId(lampiran_to_delete[i].id)
    // di rootnya, masukkin collection namenya..
    gfsLampiranAnnouncement.remove({ _id: announcement_id, root: "lampiran_announcement"}, (err) => {
      if(err) {
        console.log("error occured")
        return res.status(404).json({err: "Error in removing the files"});
      }
      else {
        console.log("Sucessful, lampiran kenadelete")
      }
    })

    for(var j =0; j < current_lampiran.length; j++) {
      if(current_lampiran[j].filename == lampiran_to_delete[i].filename){
        current_lampiran.splice(j,1)
        break;
      }
    }
  }

  Announcement.findById(task_id, (err, ann) => {
    if(!task){
      return res.status(404).json("Task object is not found in the Database")
    } else {
      ann.lampiran = current_lampiran;
      task.save()
          .then((ann) => {return res.json({success: "Successfully updated the lampiran file and the lampiran field on Task object"})})
          .catch((err) => console.log("Error happened in updating task lampiran field"))
    }
  })
})

module.exports = { router, uploadAvatar, uploadTugas, uploadLampiran };
