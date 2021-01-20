const express = require("express");
const router = express.Router();
const GridFsStream = require("gridfs-stream"); // untuk upload atau downlaod file.
const keys = require("../../../config/keys");
const mongoose = require("mongoose");
const Assessment = require("../../../models/Assessment");
const uploads = require("./uploads");

// Create Mongo Connection
mongoose.set("useUnifiedTopology", true);
mongoose.set("useNewUrlParser", true);
const { ObjectId } = require("mongodb");
const conn = mongoose.createConnection(keys.mongoURI);

const uploadLampiranAssessment = uploads.uploadLampiranAssessment;
let gfsLampiranAssessment;

conn.once("open", () => {
  gfsLampiranAssessment = GridFsStream(conn.db, mongoose.mongo);
  gfsLampiranAssessment.collection("lampiran_assessment");
});

// Router for handling the upload lampiran announcement...
router.post(
  "/lampiran/:id",
  uploadLampiranAssessment.array("lampiran_assessment"),
  (req, res) => {
    let id = req.params.id;

    // req.files // berupa array array ObjectId yang dibuat dari hasil upload
    console.log("UPLOAD ASSESSMENT LAMPIRAN IS RUNNED");

    Assessment.findById(id, (err, assessment) => {
      console.log("This is the announcement", assessment);
      if (!assessment) {
        return res.status(404).json({ notfound: "Announcement not found" });
      } else {
        var questionsArray = assessment.questions;
        var lampiranCountArray = req.body.num_lampiran
          .split(",")
          .map((n) => Number(n));
        var filesArray = req.files;

        lampiranCountArray.forEach((cnt, i) => {
          // let temp = []
          // let question = questionsArray[i]
          for (let idx = 0; idx < cnt; idx++) {
            var file = filesArray.shift();
            questionsArray[i].lampiran.push(file.id);
          }
        });
        // let temp = [];
        // console.log("Files are here: ", req.files)
        // for (var i = 0; i< req.files.length; i++) {
        //   console.log(req.files[i])
        //   temp.push(ObjectId(req.files[i].id))
        // }

        // kalau udah ada lampiran, push aja.
        assessment.questions = questionsArray;
        assessment
          .save() // kadang" kalau masukkin res.json di Error, bisa ada error cannot set headers after they are sent to the client.
          .then((assessment) =>
            res.json({
              success: "Successfully uploaded the lampiran file",
              _id: req.params.id,
            })
          )
          .catch((err) => {
            console.log("error kan ini");
          });
      }
    });
    // res.json({success: "Successfully uploaded the lampiran file"})
  }
);

router.get("/:id", (req, res) => {
  if (Boolean(gfsLampiranAssessment)) {
    gfsLampiranAssessment.files.findOne(
      { _id: ObjectId(req.params.id) },
      (err, file) => {
        // Check if file
        if (!file || file.length === 0) {
          return res.status(404).json({
            err: "No file exists",
          });
        }
        // Check if Image
        if (
          file.contentType === "image/jpeg" ||
          file.contentType === "image/png" ||
          file.contentType === "image/jpg"
        ) {
          // Show outputnya di browser kita

          const readStream = gfsLampiranAssessment.createReadStream(
            file.filename
          );
          readStream.pipe(res);
        } else {
          res.status(404).json({
            err: "Not an image",
          });
        }
      }
    );
  }
});

router.delete("/lampiran/:id", (req, res) => {
  const { lampiran_to_delete, current_lampiran } = req.body;
  console.log(lampiran_to_delete);

  for (var i = 0; i < lampiran_to_delete.length; i++) {
    let id = new mongoose.mongo.ObjectId(lampiran_to_delete[i]);
    // // di rootnya, masukkin collection namenya..
    console.log("Removee");
    gfsLampiranAssessment.remove(
      { _id: id, root: "lampiran_assessment" },
      (err) => {
        if (err) {
          console.log("error occured");
          return res.status(404).json({ err: "Error in removing the files" });
        } else {
          console.log("Sucessful, lampiran kenadelete");
        }
      }
    );

    // if (req.params.id !== "deleteall") {
    //   for (var j =0; j < current_lampiran.length; j++) {
    //     if (current_lampiran[j].filename === lampiran_to_delete[i].filename) {
    //       current_lampiran.splice(j,1)
    //       break;
    //     }
    //   }

    // Assessment.findById(id, (err, ass) => {
    //   if (!ass) {
    //     return res.status(404).json("Ann object is not found in the Database")
    //   }
    //   else {
    //     ass.lampiran = current_lampiran;
    //     ass.save()
    //         .then(ass => res.json({success: "Successfully updated the lampiran file and the lampiran field on Task object"}))
    //         .catch((err) => console.log("Error happened in updating task lampiran field"))
    //       }
    //     })
    //   }
  }
  return res.json({ success: "Succesfully deleted all lampiran materi" });
});

module.exports = router;
