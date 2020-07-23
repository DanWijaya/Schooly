const express = require("express");
const router = express.Router();
const GridFsStream = require("gridfs-stream");
const keys = require("../../../config/keys")
const mongoose = require("mongoose");
const Material = require("../../../models/Material");
const uploads = require("./uploads");

const uploadLampiranMateri = uploads.uploadLampiranMateri;
// Create Mongo Connection
mongoose.set('useUnifiedTopology', true);
mongoose.set('useNewUrlParser', true)
const conn = mongoose.createConnection(keys.mongoURI)

// Initialize 
let gfsLampiranMateri;

conn.once("open", () => {
  gfsLampiranMateri = GridFsStream(conn.db, mongoose.mongo)
  gfsLampiranMateri.collection("lampiran_materi")
})

// Router for handling the upload lampiran Materi...
router.post("/lampiran/:id", uploadLampiranMateri.array("lampiran_materi", 10), (req,res) => {
  let material_id = req.params.id;
  console.log("Upload lampiran is runned")

  Material.findById(material_id, (err, material) => {

    if (!material) {
      return res.status(404).json({notfound: "Material not found"});
    }
    else {
      let temp = [];
      console.log("Files are here: ", req.files)
      // console.log("Files are here: ", req.files)
      for(var i = 0; i< req.files.length; i++) {
        console.log(req.files[i])
        temp.push({
          id: req.files[i].id,
          filename: req.files[i].filename,
        })
      }
      console.log("Temp: ", temp)

      // kalau udah ada lampiran, push aja.
      if (material.lampiran != undefined && material.lampiran.length > 0) {
        let temp2 = [...material.lampiran, ...temp]
        material.lampiran = temp2
      }
      else {
        material.lampiran = temp;
      }

      material.save()// kadang" kalau masukkin res.json di Error, bisa ada error cannot set headers after they are sent to the client.
                  .then(material => console.log("Lampiran material"))
                  .catch(err => {console.log("error kan ini")})

        }
    })
  res.json({success: "Successfully uploaded the lampiran file"})
})

router.delete("/lampiran/:id", (req,res) => {
  let material_id = req.params.id;
  console.log(material_id)
  const {lampiran_to_delete, current_lampiran} = req.body;
  console.log("Current Lampirannya: ",Boolean(current_lampiran))
  console.log("Material ID: ",Boolean(material_id))
  for(var i = 0; i < lampiran_to_delete.length; i++) {
    id = new mongoose.mongo.ObjectId(lampiran_to_delete[i].id)
    // di rootnya, masukkin collection namenya..
    gfsLampiranMateri.remove({ _id: id, root: "lampiran_materi"}, (err) => {
      if (err) {
        console.log("error occured")
        return res.status(404).json({err: "Error in removing the files"});
      }
      else {
        console.log("Sucessful, lampiran kenadelete")
      }
    })

    if (material_id !== "deleteall") {
      for(var j =0; j < current_lampiran.length; j++) {
        if (current_lampiran[j].filename === lampiran_to_delete[i].filename) {
          current_lampiran.splice(j,1)
          break;
        }
      }

    console.log("Deleted alr")
    Material.findById(material_id, (err, ann) => {
      if (!ann) {
        return res.status(404).json("Ann object is not found in the Database")
      }
      else {
        ann.lampiran = current_lampiran;
        ann.save()
            .then((ann) => {return res.json({success: "Successfully updated the lampiran file and the lampiran field on Task object"})})
            .catch((err) => console.log("Error happened in updating task lampiran field"))
        }
      })
    }
  }
  return res.json({success: "Succesfully deleted all lampiran materi"})
})

router.get("/lampiran_materi/:id", (req,res) => {
  id = new mongoose.mongo.ObjectId(req.params.id)
  if (Boolean(gfsLampiranMateri)) {
    gfsLampiranMateri.files.findOne({_id: id}, (err, file) => {
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
      const readStream = gfsLampiranMateri.createReadStream(filename);
      readStream.pipe(res)
    })
  }
})

router.get("/previewlampiran_materi/:id", (req,res) => {
  console.log("Previewing lampiran")
  id = new mongoose.mongo.ObjectId(req.params.id)
  if (Boolean(gfsLampiranMateri)) {
    gfsLampiranMateri.files.findOne({_id: id}, (err, file) => {
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
      const readStream = gfsLampiranMateri.createReadStream(filename);
      readStream.pipe(res)
    })
  }
})

module.exports = router;