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
const { ObjectId } = require("mongodb");
const conn = mongoose.createConnection(keys.mongoURI)

const uploadLampiranAssessment = uploads.uploadLampiranAssessment;
let gfsLampiranAssessment

conn.once("open", () => {
  gfsLampiranAssessment = GridFsStream(conn.db, mongoose.mongo);
  gfsLampiranAssessment.collection("lampiran_assessment")
})

// Router for handling the upload lampiran announcement...
router.post("/lampiran/:id/:qnsIndex", uploadLampiranAssessment.array("lampiran_assessment", 10), (req,res) => {
  let id = req.params.id;
  let qnsIndex = req.params.qnsIndex;

  console.log("UPLOAD LAMPIRAN IS RUNNED")

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
        temp.push(ObjectId(req.files[i].id))
      }
      console.log("Temp: ", temp)

      // kalau udah ada lampiran, push aja.
      let qns = assessment.questions[qnsIndex];
      qns.lampiran = qns.lampiran.concat(temp)
      assessment.questions[qnsIndex] = qns;
      // for (var i = 0; i < questions.length; i++){
      //   letquestions[i].lampiran.push()
      // }
      // if (assessment.questions != undefined && assessment.questions.length > 0) {
      //   let temp2 = [...assessment.lampiran, ...temp]
      //   announcement.lampiran = temp2
      // }
      // else {
      //   announcement.lampiran = temp;
      // }

      assessment.save()// kadang" kalau masukkin res.json di Error, bisa ada error cannot set headers after they are sent to the client.
                  .then(assessment => res.json({success: "Successfully uploaded the lampiran file"}))
                  .catch(err => {console.log("error kan ini")})

        }
    })
  // res.json({success: "Successfully uploaded the lampiran file"})
})

router.get("/:id", (req, res) => {
  if (Boolean(gfsLampiranAssessment)) {
    gfsLampiranAssessment.files.findOne({ _id: ObjectId(req.params.id) }, (err, file) => {
      // Check if file
      if (!file || file.length === 0) {
        return res.status(404).json({
          err: "No file exists"
        });
      }
      // Check if Image
      if (file.contentType === "image/jpeg" || file.contentType === "image/png" || file.contentType === "image/jpg") {
        // Show outputnya di browser kita

        const readStream = gfsLampiranAssessment.createReadStream(file.filename);
        readStream.pipe(res)
      }
      else {
        res.status(404).json({
          err: "Not an image"
        });
      }
    });
  }
});

module.exports = router