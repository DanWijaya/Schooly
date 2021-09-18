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

  Subject.findOne({ name: req.body.name, unit: req.body.unit }).then((subject) => {
    if (subject) {
      return res
        .status(404)
        .json({ name: "Nama mata pelajaran sudah dipakai" });
    } else {
      const newSubject = new Subject(req.body);

      newSubject
        .save()
        .then((subject) => res.json(subject))
        .catch((err) => res.json(err));
    }
  });
});

router.put("/edit/:id", (req, res) => {
  let id = req.params.id;

  const { errors, isValid } = validateSubjectInput(req.body);
  if (!isValid) {
    return res.status(404).json(errors);
  }

  Subject.findOne({ name: req.body.name, unit: req.body.unit }, (err, subject) => {
    if (subject) {
      return res
        .status(404)
        .json({ name: "Nama mata pelajaran sudah dipakai" });
    } else {
      Subject.findById(id, (err, subject) => {
        if (!subject) {
          return res
            .status(404)
            .json({ name: "Mata pelajaran tidak ditemukan" });
        } else {
          subject.name = req.body.name;
          
          subject
            .save()
            .then(res.status(200).json("Done with updating subject"))
            .catch(console.log("Erorr in updating the subject"));
        }
      });
    }
  });
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

router.get("/viewall/:unit_id", (req, res) => {
  let { unit_id } = req.params;
  Subject.find({unit: unit_id}).then((subjects, err) => {
    if (!subjects) res.status(400).json(err);
    else {
      subjects.sort((a, b) => (a.name > b.name ? 1 : -1));
      res.json(subjects);
    }
  });
});

router.delete("/delete/:id", (req, res) => {
  let id = req.params.id;
  Subject.findByIdAndRemove(id).then((subject, err) => {
    if (!subject) return res.status(400).json(err);
    else {
      console.log(subject);
      return res.json();
    }
  });
});

module.exports = router;
