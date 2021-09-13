const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");

const validateMaterialInput = require("../../validation/MaterialData");
const Material = require("../../models/Material");

const mongoose = require("mongoose");

router.post("/create", (req, res) => {
  const { errors, isValid } = validateMaterialInput(req.body);
  console.log("MASALAH DI CREATE", errors, isValid);
  if (!isValid) {
    console.log(errors);
    return res.status(400).json(errors);
  }

  //Check Validation
  let class_assigned = req.body.class_assigned;
  let class_assigned_ids = [];

  if (class_assigned.length > 0) {
    class_assigned.forEach((kelas) => class_assigned_ids.push(kelas));
  }

  console.log("author id : ", req.body.author_id);
  const newMaterial = new Material({
    name: req.body.name,
    subject: req.body.subject,
    author_id: req.body.author_id,
    class_assigned: class_assigned_ids,
    description: req.body.description,
    // lampiran: req.body.lampiran
  });

  console.log(newMaterial);
  newMaterial
    .save()
    .then((material) => {
      console.log("Material is created");
      console.log(material);
      return res.status(200).json(material);
      // res.json(material);
    })
    .catch((err) => console.log(err));
});

router.put("/update/:id", (req, res) => {
  const { errors, isValid } = validateMaterialInput(req.body);

  if (!isValid) {
    console.log("Not valid lahhh");
    return res.status(400).json(errors);
  }

  console.log(errors);
  let id = req.params.id;

  console.log(req.body);
  Material.findById(id, (err, materialData) => {
    if (!materialData)
      return res.status(404).send("material data is not found");
    else {
      materialData.name = req.body.name;
      materialData.subject = req.body.subject;
      materialData.description = req.body.description;
      materialData.class_assigned = req.body.class_assigned;

      materialData
        .save()
        .then((taskData) => res.json("Update Task complete"))
        .catch((err) => res.status(400).send("Unable to update task database"));
    }
  });
});

//Define View one material
router.get("/viewOne/:id", (req, res) => {
  console.log("view one is runned");
  let id = req.params.id;
  Material.findById(id, (err, materialData) => {
    if (!materialData)
      return res.status(404).send("material data is not found");
    else {
      console.log("materialnya yang ini: ", materialData);
      return res.json(materialData);
    }
  });
});

//Define View classes route
router.get("/viewall", (req, res) => {
  Material.find({}).then((materials, err) => {
    if (!materials) return res.status(400).json("materials are not found");
    else return res.json(materials);
  });
});

router.get("/viewByClass/:id", (req, res) => {
  let id = req.params.id;
  console.log(id);
  console.log("View Material by class is runned");
  // if want to get the MongoDB object that has id element in the array.
  Material.find({ class_assigned: id }, (err, materials) => {
    if (!materials) {
      console.log("Not found");
      return res.status(400).json("material with that class is not found");
    }
    console.log("materials: ", materials);
    return res.json(materials);
  });
});

router.get("/viewByAuthor/:id", (req, res) => {
  let id = req.params.id;
  console.log("View material by author is runned");

  Material.find({ author_id: id }, (err, materials) => {
    if (!materials) {
      console.log("Not found");
      return res
        .status(400)
        .json("Material with that author_id is not found in DB");
    }
    console.log("materials : ,", materials);
    return res.json(materials);
  });
});

//Define delete routes
router.delete("/delete/:id", (req, res) => {
  Material.findByIdAndRemove(req.params.id).then((materials, err) => {
    if (!materials) {
      res.status(400).json(err);
    } else {
      res.json(materials);
    }
  });
});

router.post("/comment/:materialId", (req, res) => {
  let comment = req.body;

  Material.findById(req.params.materialId, (err, materialData) => {
    if (!materialData) {
      return res.status(404).send("Material data is not found");
    } else {
      if (comment.content.length === 0) {
        res.status(400).json("Isi komentar tidak boleh kosong");
        return;
      }

      let newComments = materialData.comments ? [...materialData.comments] : [];
      comment.createdAt = new mongoose.Types.ObjectId().getTimestamp();
      newComments.push(comment);

      materialData.comments = newComments;
      materialData
        .save()
        .then(() => {
          res.json("Create material comment complete");
        })
        .catch(() => {
          res.status(400).send("Unable to create material comment");
        });
    }
  });
});

router.put("/comment/:materialId", (req, res) => {
  let { updatedContent, commentId } = req.body;

  Material.findById(req.params.materialId, (err, materialData) => {
    if (!materialData) {
      return res.status(404).send("Material data is not found");
    } else {
      if (updatedContent.length === 0) {
        res.status(400).json("Isi komentar tidak boleh kosong");
        return;
      }

      let newComments = materialData.comments ? [...materialData.comments] : [];
      for (let i = 0; i < newComments.length; i++) {
        if (newComments[i]._id.toString() === commentId) {
          newComments[i].edited = true;
          newComments[i].content = updatedContent;
          break;
        }
      }

      materialData.comments = newComments;
      materialData
        .save()
        .then(() => {
          res.json("Edit material comment complete");
        })
        .catch(() => {
          res.status(400).send("Unable to edit material comment");
        });
    }
  });
});

router.delete("/comment/:materialId&:commentId", (req, res) => {
  const { materialId, commentId } = req.params;

  Material.findById(materialId, (err, materialData) => {
    if (!materialData) {
      return res.status(404).send("Material data is not found");
    } else {
      let newComments = materialData.comments ? [...materialData.comments] : [];
      for (let i = 0; i < newComments.length; i++) {
        if (newComments[i]._id.toString() === commentId) {
          newComments.splice(i, 1);
          break;
        }
      }

      materialData.comments = newComments;
      materialData
        .save()
        .then(() => {
          res.json("Delete material comment complete");
        })
        .catch(() => {
          res.status(400).send("Unable to delete material comment");
        });
    }
  });
});

module.exports = router;
