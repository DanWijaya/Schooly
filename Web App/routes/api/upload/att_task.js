const express = require("express");
const router = express.Router();
const keys = require("../../../config/keys");
const mongoose = require("mongoose");
const GridFsStream = require("gridfs-stream");
const uploads = require("./uploads");
const Task = require("../../../models/Task");

const uploadLampiranTugas = uploads.uploadLampiranTugas;

// Create Mongo Connection
mongoose.set("useUnifiedTopology", true);
mongoose.set("useNewUrlParser", true);
const conn = mongoose.createConnection(keys.mongoURI);

//Initialize gfs
let gfsLampiranTugas;

conn.once("open", () => {
  gfsLampiranTugas = GridFsStream(conn.db, mongoose.mongo);
  gfsLampiranTugas.collection("lampiran_tugas");
});

// Lampiran Upload
// When uploading the lampiran, it is done tgt when creating the task object
// So, this implementation is on router.post("/create") in tasks.js file

router.post(
  "/lampiran/:task_id",
  uploadLampiranTugas.array("lampiran_tugas", 10),
  (req, res) => {
    let task_id = req.params.task_id;
    console.log("Upload lampiran is runned");
    console.log("Task Id is:", task_id);
    Task.findById(task_id, (err, task) => {
      console.log("This is the task", task);
      if (!task) {
        return res.status(404).json({ tasknotfound: "Task not found" });
      } else {
        let temp = [];
        console.log("Files are here: ", req.files);
        for (var i = 0; i < req.files.length; i++) {
          console.log(req.files[i]);
          temp.push({
            id: req.files[i].id,
            filename: req.files[i].filename,
          });
        }
        console.log("Temp: ", temp);
        // kalau udah ada lampiran, push aja.
        if (task.lampiran != undefined && task.lampiran.length > 0) {
          let temp2 = [...task.lampiran, ...temp];
          task.lampiran = temp2;
        } else {
          task.lampiran = temp;
        }

        console.log(task.lampiran);
        task
          .save() // kadang" kalau masukkin res.json di Error, bisa ada error cannot set headers after they are sent to the client.
          .then((task) =>
            res.json({
              success: "Successfully uploaded the lampiran file",
              _id: req.params.task_id,
            })
          )
          .catch((err) => {
            console.log("error kan ini");
          });
      }
    });
    // res.json({success: "Successfully uploaded the lampiran file", _id: req.params.task_id})
  }
);

router.get("/lampiran/:task_id", (req, res) => {
  id = new mongoose.mongo.ObjectId(req.params.task_id);
  if (Boolean(gfsLampiranTugas)) {
    gfsLampiranTugas.files.findOne({ _id: id }, (err, file) => {
      // Check if files
      if (!file || file.length === 0) {
        return res.status(404).json({
          err: "Tugas tidak ada",
        });
      }
      var type = file.contentType;
      var filename = file.filename;
      res.set("Content-Type", type);
      res.set("Content-Disposition", "attachment;filename=" + filename); // harus pakai attachment untuk download.

      // Files exist
      const readStream = gfsLampiranTugas.createReadStream(filename);
      readStream.pipe(res);
    });
  }
});

router.get("/preview/:task_id", (req, res) => {
  console.log("Previewing lampiran");
  id = new mongoose.mongo.ObjectId(req.params.task_id);
  if (Boolean(gfsLampiranTugas)) {
    gfsLampiranTugas.files.findOne({ _id: id }, (err, file) => {
      // Check if files
      if (!file || file.length === 0) {
        return res.status(404).json({
          err: "Tugas tidak ada",
        });
      }
      var type = file.contentType;
      var filename = file.filename;
      res.set("Content-Type", type);
      res.set("Content-Disposition", "inline;filename=" + filename); // harus pakai inline untuk preview.

      // Files exist
      const readStream = gfsLampiranTugas.createReadStream(filename);
      readStream.pipe(res);
    });
  }
});

router.delete("/lampiran/:task_id", (req, res) => {
  let task_id = req.params.task_id;
  const { lampiran_to_delete, current_lampiran } = req.body;
  for (var i = 0; i < lampiran_to_delete.length; i++) {
    lampiran_id = new mongoose.mongo.ObjectId(lampiran_to_delete[i].id);
    // di rootnya, masukkin collection namenya..
    gfsLampiranTugas.remove(
      { _id: lampiran_id, root: "lampiran_tugas" },
      (err) => {
        if (err) {
          console.log("error occured");
          return res.status(404).json({ err: "Error in removing the files" });
        } else {
          console.log("Sucessful, lampiran kenadelete");
        }
      }
    );

    for (var j = 0; j < current_lampiran.length; j++) {
      if (current_lampiran[j].filename === lampiran_to_delete[i].filename) {
        current_lampiran.splice(j, 1);
        break;
      }
    }
  }

  Task.findById(task_id, (err, task) => {
    if (!task) {
      return res.status(404).json("Task object is not found in the Database");
    } else {
      task.lampiran = current_lampiran;
      task
        .save()
        .then((task) => {
          return res.json({
            success:
              "Successfully updated the lampiran file and the lampiran field on Task object",
          });
        })
        .catch((err) =>
          console.log("Error happened in updating task lampiran field")
        );
    }
  });
});

module.exports = router;
