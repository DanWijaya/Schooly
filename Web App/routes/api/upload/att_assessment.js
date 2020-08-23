const express = require("express");
const router = express.Router();
const GridFsStream = require("gridfs-stream"); // untuk upload atau downlaod file.
const keys = require("../../../config/keys")
const mongoose = require("mongoose");
const Assessment = require("../../../models/Assessment");
const uploads = require("./uploads");

// Create Mongo Connection
mongoose.set('useUnifiedTopology', true);
mongoose.set('useNewUrlParser', true);

const conn = mongoose.createConnection(keys.mongoURI)

const uploadLampiranAssessment = uploads.uploadLampiranAssessment;
let gfsLampiranAssessment

conn.once("open", () => {
  gfsLampiranAssessment = GridFsStream(conn.db, mongoose.mongo);
  gfsLampiranAssessment.collection("lampiran_assessment")
})

// Router for handling the upload lampiran announcement...

router.post("/lampiran/:id", uploadLampiranAssessment.array("lampiran_assessment", 10), (req,res) => {
  let id = req.params.id;
  console.log("Upload lampiran is runned")

  Assessment.findById(id, (err, assessment) => {
    console.log("This is the announcement", assessment)
    if (!assessment) {
      return res.status(404).json({notfound: "Announcement not found"});
    }
    else {
      let temp = [];
      console.log("Files are here: ", req.files)
      // console.log("Files are here: ", req.files)
      for (var i = 0; i< req.files.length; i++) {
        console.log(req.files[i])
        temp.push({
          id: req.files[i].id,
          filename: req.files[i].filename,
        })
      }
      console.log("Temp: ", temp)

      // kalau udah ada lampiran, push aja.
      if (announcement.lampiran != undefined && announcement.lampiran.length > 0) {
        let temp2 = [...announcement.lampiran, ...temp]
        announcement.lampiran = temp2
      }
      else {
        announcement.lampiran = temp;
      }

      announcement.save()// kadang" kalau masukkin res.json di Error, bisa ada error cannot set headers after they are sent to the client.
                  .then(announcement => console.log("Lampiran announcement"))
                  .catch(err => {console.log("error kan ini")})

        }
    })
  res.json({success: "Successfully uploaded the lampiran file"})
})
