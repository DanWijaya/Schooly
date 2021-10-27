const express = require("express");
const router = express.Router();
const keys = require("../../config/keys");
const mongoose = require("mongoose");

const validateSubjectInput = require("../../validation/SubjectData");

// Load Subject model
const Subject = require("../../models/Subject");

router.post("/create", (req, res) => {
  const { errors, isValid } = validateSubjectInput(req.body);
  if (!isValid) {
    console.log("not valid data");
    return res.status(404).json(errors);
  }

  Subject.findOne({ name: req.body.name, unit: req.body.unit })
    .then((subject) => {
      if (subject) {
        console.log("Subject name in one unit must be unique");
        throw { name: "Nama mata pelajaran sudah dipakai" };
      }
      const newSubject = new Subject(req.body);
      return newSubject.save();
    })
    .then((subject) => {
      console.log("Create subject completed");
      return res.json(subject);
    })
    .catch((err) => {
      console.error("Create Subject failed");
      return res.status(400).json(err);
    });
});

router.put("/edit/:id", async (req, res) => {
  let id = req.params.id;
  try {
    const { errors, isValid } = validateSubjectInput(req.body);
    if (!isValid) {
      throw errors;
    }
    //Check if there is existing subject with same name.
    const subject1 = await Subject.findOne({
      name: req.body.name,
      unit: req.body.unit,
    });
    if (subject1) {
      console.error("Subject name in one unit must be unique");
      throw { name: "Nama mata pelajaran sudah dipakai" };
    }

    const subjectToUpdate = await Subject.findById(id);
    if (!subjectToUpdate) throw "Subject is not found";
    subjectToUpdate.name = req.body.name;
    await subjectToUpdate.save();

    return res.status(200).json("Update Subject completed");
  } catch (err) {
    console.error("Update Subject failed");
    return res.status(400).json(err);
  }
});

router.get("/view/:id", (req, res) => {
  Subject.findById(req.params.id).then((subject) => {
    if (!subject) {
      return res.status(400).json("Class does not exist");
    } else {
      // console.log(kelas);
      res.json(subject);
    }
  });
});

router.get("/viewall/:unitId", (req, res) => {
  const { unitId } = req.params;
  if (!unitId) {
    return res.json([]);
  }
  Subject.find({ unit: unitId })
    .then((subjects) => {
      if (!subjects.length) {
        console.log("No subjects created in unit");
      }
      subjects.sort((a, b) => (a.name > b.name ? 1 : -1));
      return res.json(subjects);
    })
    .catch((err) => {
      console.error("View all units failed");
      return res.status(400).json(err);
    });
});

router.delete("/delete/:id", (req, res) => {
  let id = req.params.id;
  Subject.findByIdAndRemove(id)
    .then((subject) => {
      if (!subject) throw "Subject to remove not found";
      return res.json(subject);
    })
    .catch((err) => {
      console.error("Delete Subject failed");
      return res.status(400).json(err);
    });
});

module.exports = router;
