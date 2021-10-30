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
  if (!isValid) {
    return res.status(400).json(errors);
  }

  //Check Validation
  let class_assigned = req.body.class_assigned;
  let class_assigned_ids = [];

  if (class_assigned.length > 0) {
    class_assigned.forEach((kelas) => class_assigned_ids.push(kelas));
  }

  const newMaterial = new Material({
    name: req.body.name,
    subject: req.body.subject,
    author_id: req.body.author_id,
    class_assigned: class_assigned_ids,
    description: req.body.description,
    unit: req.body.unit,
  });

  newMaterial
    .save()
    .then((material) => {
      console.log("Create Material completed");
      return res.status(200).json(material);
    })
    .catch((err) => {
      console.error("Create material failed");
      return res.status(400).json(err);
    });
});

router.put("/update/:id", (req, res) => {
  const { errors, isValid } = validateMaterialInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  let { id } = req.params;

  Material.findById(id)
    .then((materialData) => {
      if (!materialData) throw "Material data is not found";

      materialData.name = req.body.name;
      materialData.subject = req.body.subject;
      materialData.description = req.body.description;
      materialData.class_assigned = req.body.class_assigned;

      return materialData.save();
    })
    .then((taskData) => {
      console.log("Update material completed");
      return res.json(taskData);
    })
    .catch((err) => {
      console.error("Update material failed");
      return res.status(404).send(err);
    });
});

//Define View one material
router.get("/viewOne/:id", (req, res) => {
  let id = req.params.id;
  Material.findById(id)
    .then((materialData) => {
      if (!materialData) throw "Material data is not found";
      console.log("View material completed");
      return res.json(materialData);
    })
    .catch((err) => {
      console.error("View material failed");
      return res.status(400).json(err);
    });
});

//Define View classes route
router.get("/viewall", (req, res) => {
  Material.find({})
    .then((materials) => {
      if (!materials.length) {
        console.log("No Materials created");
      }
      console.log("View all materials completed");
      return res.json(materials);
    })
    .catch((err) => {
      console.error("View all materials failed");
      return res.status(400).json(err);
    });
});

router.get("/viewByClass/:id", (req, res) => {
  let id = req.params.id;
  // if want to get the MongoDB object that has id element in the array.
  Material.find({ class_assigned: id })
    .then((materials) => {
      if (!materials.length) console.log("Materials in the class are empty");
      return res.json(materials);
    })
    .catch((err) => {
      console.error("Materials view by class failed");
      return res.status(400).json(err);
    });
});

router.get("/viewByAuthor/:id", (req, res) => {
  let id = req.params.id;
  console.log("View material by author is runned");

  Material.find({ author_id: id })
    .then((materials) => {
      if (!materials.length) console.log("Materials by the autor is empty");
      return res.json(materials);
    })
    .catch((err) => {
      console.log("View material by author failed");
      return res.status(400).json(err);
    });
});

//Define delete routes
router.delete("/delete/:id", (req, res) => {
  Material.findByIdAndRemove(req.params.id)
    .then((materials) => {
      if (!materials) {
        throw "Material not found";
      }
      return res.json(materials);
    })
    .catch((err) => {
      console.error("Delete material failed");
      return res.status(400).json(err);
    });
});

router.post("/comment/:materialId", (req, res) => {
  let comment = req.body;
  const { materialId } = req.params;
  Material.findById(materialId)
    .then((materialData) => {
      if (!materialData) throw "Material data is not found";
      if (comment.content.length === 0) throw "Isi komentar tidak boleh kosong";

      let newComments = materialData.comments ? [...materialData.comments] : [];
      comment.createdAt = new mongoose.Types.ObjectId().getTimestamp();
      newComments.push(comment);

      materialData.comments = newComments;
      return materialData.save();
    })
    .then(() => {
      return res.json("Create material comment complete");
    })
    .catch((err) => {
      console.error("Create material comment failed");
      return res.status(400).send(err);
    });
});

router.put("/comment/:materialId", (req, res) => {
  let { updatedContent, commentId } = req.body;
  const { materialId } = req.params;

  Material.findById(materialId)
    .then((materialData) => {
      if (!materialData) throw "Material data is not found";
      if (updatedContent.length === 0) throw "Isi komentar tidak boleh kosong";

      let newComments = materialData.comments ? [...materialData.comments] : [];
      for (let i = 0; i < newComments.length; i++) {
        if (newComments[i]._id.toString() === commentId) {
          newComments[i].edited = true;
          newComments[i].content = updatedContent;
          break;
        }
      }

      materialData.comments = newComments;
      return materialData.save();
    })
    .then(() => {
      return res.json("Edit material comment complete");
    })
    .catch((err) => {
      console.error("Edit material comment failed");
      return res.status(400).send(err);
    });
});

router.delete("/comment/:materialId&:commentId", (req, res) => {
  const { materialId, commentId } = req.params;

  Material.findById(materialId)
    .then((materialData) => {
      if (!materialData) throw "Material data is not found";
      let newComments = materialData.comments ? [...materialData.comments] : [];
      for (let i = 0; i < newComments.length; i++) {
        if (newComments[i]._id.toString() === commentId) {
          newComments.splice(i, 1);
          break;
        }
      }

      materialData.comments = newComments;
      return materialData.save();
    })
    .then((material) => {
      console.log("Delete Material Comment completed");
      return res.json("Delete material comment complete");
    })
    .catch((err) => {
      console.error("Delete material comment failed");
      return res.status(400).send(err);
    });
});

module.exports = router;
