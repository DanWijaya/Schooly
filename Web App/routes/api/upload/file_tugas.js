const express = require("express");
const router = express.Router();
const keys = require("../../../config/keys")
const mongoose = require("mongoose");
const User= require("../../../models/user_model/User");
const GridFsStream = require("gridfs-stream");
const uploads = require("./uploads");

const uploadTugas = uploads.uploadTugas;

// Create Mongo Connection
mongoose.set('useUnifiedTopology', true);
mongoose.set('useNewUrlParser', true)
const conn = mongoose.createConnection(keys.mongoURI)

//Initialize Avatar
let gfsTugas;

conn.once("open", () => {
  gfsTugas = GridFsStream(conn.db, mongoose.mongo);
  gfsTugas.collection("tugas");
})
// // @route DELETE /files/:id
// // @desc Delete File
// Upload Tugas

router.post("/uploadtugas/:user_id/:task_id/:ontime", uploadTugas.array("tugas", 10), (req,res) => {
  // To get the file details, use req.file

  let id = req.params.user_id
  let task_id = req.params.task_id;
  let ontime = req.params.ontime;
  console.log("Body: ", req.body)
  console.log("Uploading the task file")

  User.findById(id, (err, user) => {
    if (!user) {
      console.log("User not found")
      return res.status(404).json({ usernotfound: "Pengguna tidak ditemukan"});
    }

    else {
      if (!user.tugas) {
        let tugas_user = []
        for (var i = 0; i < req.files.length; i++) {
          tugas_user.push({
            id: req.files[i].id,
            filename: req.files[i].filename,
            for_task_object: task_id,
            ontime: ontime
          })
        }
        user.tugas = tugas_user
      }
      else {
        for (var i = 0; i < req.files.length; i++) {
          user.tugas.push({id: req.files[i].id,
              filename: req.files[i].filename,
              for_task_object: task_id,
              ontime: ontime})
        }
      }
      console.log(user.tugas)
      user
        .save()
        .then()
        .catch(err => console.log(err))
    }

    return res.json(true)
  })
})

router.get("/", (req,res) => {
  let chunkReader = function(length, file){
    var r = new FileReader();
    r.readAsDataURL(file)
  }
  

  let { tugas_ids } = req.query;

  console.log("MAU DI RUN YANG INI Tugas ids : ", tugas_ids)
  let id
  if(Array.isArray(tugas_ids)){
    id = tugas_ids.map((tugas_id) => new mongoose.mongo.ObjectId(tugas_id))
  }

  if(Boolean(gfsTugas)){
    gfsTugas.files.find({_id:id}).toArray((err, files) => {
      // Check if files
      if (!files || files.length === 0) {
        return res.status(404).json({
          err: "Tugas tidak ada"
        });
      } 

      var type = files[0].contentType;
      var filename = files[0].filename;
      res.set("Content-Type", type);
      res.set("Content-Disposition", "attachment;filename=" + filename) // harus pakai attachment.

      // Files exist
      const readStream = gfsTugas.createReadStream(filename);
      readStream.on('data', function(chunk) {
        console.log(chunk.toString())
      })
      // res.json(files)
    });
  }
})

router.get("/tugas/:tugas_id", (req,res) => {
  let { tugas_id } = req.params;
  let {tugas_ids} = req.query;

  console.log("TUGAS ID : ", tugas_id)
  let id
  if(tugas_ids) {
    id = tugas_ids.map((tugas_id) => new mongoose.mongo.ObjectId(tugas_id))
  } else {
    id = new mongoose.mongo.ObjectId(tugas_id)
  }
  

  if (Boolean(gfsTugas)) {
    gfsTugas.files.find({_id:id}).toArray((err, files) => {
      // Check if files
      if (!files || files.length === 0) {
        return res.status(404).json({
          err: "Tugas tidak ada"
        });
      } 

      var type = files[0].contentType;
      var filename = files[0].filename;
      res.set("Content-Type", type);
      res.set("Content-Disposition", "attachment;filename=" + filename) // harus pakai attachment.

      // Files exist
      const readStream = gfsTugas.createReadStream(filename);
      readStream.pipe(res)
      readStream.on('data', function(chunk) {
        
      })
      // res.json(files)
    });
  }
})

router.get("/previewtugas/:id", (req,res) => {
  id = new mongoose.mongo.ObjectId(req.params.id)
  if (Boolean(gfsTugas)) {
    gfsTugas.files.findOne({_id: id}, (err, file) => {
      // Check if files
      if (!file || file.length === 0) {
        return res.status(404).json({
          err: "Tugas tidak ada"
        });
      }
      console.log(file)
      var type = file.contentType;
      var filename = file.filename;
      res.set("Content-Type", type);
      res.set("Content-Disposition", "inline;filename=" + filename)

      // // Files exist
      const readStream = gfsTugas.createReadStream(filename);
      console.log("PREVIEW TUGASSS")
      readStream.pipe(res)
    });
  }
})

router.get("/filetugas", (req, res) => {
  if (Boolean(gfsTugas)) {
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
    if (err) {
      return res.status(404).json({err: err});
    }
    else {
      console.log("Successful: ", res.data)
      // return res.json("Successful")
     }

  })

  User.findById(user_id, (err, user) => {
    let tugas_id = req.params.tugasid;

    if (!user) {
      return res.status(404).json({usernotfound: "User not found"});
    }
    else {
      for (var i = 0; i < user.tugas.length; i++) {
        if (String(user.tugas[i].id) === String(tugas_id))
          user.tugas.splice(i,1)
      }

      user
          .save()
          .then(res.json(user.tugas))
          .catch(err => res.status(400).send("Unable to update user"))

    }
  })

  console.log("Delete file completed")
})

module.exports = router;