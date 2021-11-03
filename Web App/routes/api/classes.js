const Class = require("../../models/Class");
const Student = require("../../models/user_model/Student");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const keys = require("../../config/keys");
const validateClassInput = require("../../validation/ClassData");
const { ObjectId } = require("mongodb");

router.post("/create", (req, res) => {
  const { errors, isValid } = validateClassInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  Class.findOne({ name: req.body.name })
    .then((cl) => {
      if (cl) {
        throw { name: "Nama kelas sudah dipakai" };
      } else {
        let classData = {
          name: req.body.name,
          nihil: req.body.nihil,
          ukuran: req.body.ukuran,
          subject_assigned: req.body.mata_pelajaran.map(
            (id) => new ObjectId(id)
          ),
          unit: ObjectId(req.body.unit),
        };

        if (req.body.walikelas) {
          classData.walikelas = req.body.walikelas;
        }
        const newClass = new Class(classData);

        return newClass.save();
      }
    })
    .then((cl) => {
      return res.json(cl);
    })
    .catch((err) => {
      console.error("Create class failed");
      console.error(err);
      return res.status(400).json(err);
    });
});

router.get("/view/:id", (req, res) => {
  Class.findById(req.params.id)
    .then((kelas) => {
      if (!kelas) {
        throw "Class does not exist";
      }
      console.log("APA DI RUN BAGUAN INI??");
      return res.json(kelas);
    })
    .catch((err) => {
      console.error("View class failed");
      console.error(err);
      return res.status(400).json(err);
    });
});

router.get("/viewall/:unitId", (req, res) => {
  const { unitId } = req.params;
  if (!unitId) {
    return res.json([]);
  }
  Class.find({ unit: unitId })
    .then((classes) => {
      // If it is multiple results, should check with length.
      if (!classes.length) {
        // For multiple result request, don't need to throw err because the result is an emtpy array.
        console.log("Class in the unit does not exist");
      }
      classes.sort((a, b) => (a.name > b.name ? 1 : -1));
      return res.json(classes);
    })
    .catch((err) => {
      console.error("View all class in unit failed");
      console.error(err);
      return res.status(400).json(err);
    });
});

router.delete("/delete/:id", (req, res) => {
  let id = req.params.id;

  Student.find({ kelas: id })
    .then((students) => {
      console.log("Students di kelas: ", students);
      if (students.length > 0) {
        throw { has_student: "Kelas masih terdapat murid" };
      }
      return Class.findByIdAndDelete(req.params.id);
    })
    .then((cl) => {
      if (!cl) {
        throw "Class to delete is not found";
      }
      return res.json("Successfully deleted the class");
    })
    .catch((err) => {
      console.error("Delete class failed");
      console.error(err);
      return res.status(400).json(err);
    });
});

router.get("/setCurrentClass/:id", (req, res) => {
  const { id } = req.params; // console.log("set Current class is runned", id);
  if (!id) {
    return res.json({});
  }
  Class.findById(id)
    .then((classData) => {
      console.log("Ini class data: ", classData);
      if (!classData) {
        throw "Class is not found";
      }
      return res.json(classData);
    })
    .catch((err) => {
      console.error("Set current class failed");
      console.error(err);
      return res.status(400).json(err);
    });
});

router.get("/viewSelectedClasses/", (req, res) => {
  const { classes_ids } = req.query;
  // console.log(classes_ids)
  let ids_to_find = [];

  if (Array.isArray(classes_ids)) {
    ids_to_find = classes_ids.map((id) => new ObjectId(id));
  }

  Class.find({ _id: { $in: ids_to_find } })
    .then((classes) => {
      if (!classes.length) {
        console.log("Selected classes not found");
      }
      return res.json(classes);
      // return res.status(400).json("Class to update not found");
    })
    .catch((err) => {
      console.error("View selected classes failed");
      console.error(err);
      return res.status(400).json(err);
    });
});

router.put("/update/:id", (req, res) => {
  let id = req.params.id;

  const { errors, isValid } = validateClassInput(req.body);
  console.log(errors);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  Class.findById(id)
    .then((classData) => {
      if (!classData) {
        throw "Class to update not found";
      }
      // Initially there is else block.
      classData.name = req.body.name;
      classData.ketua_kelas = req.body.ketua_kelas
        ? req.body.ketua_kelas
        : null;
      classData.walikelas = req.body.walikelas ? req.body.walikelas : null;
      classData.sekretaris = req.body.sekretaris ? req.body.sekretaris : null;
      classData.bendahara = req.body.bendahara ? req.body.bendahara : null;
      classData.ukuran = req.body.ukuran;
      classData.subject_assigned = req.body.mata_pelajaran.map(
        (id) => new ObjectId(id)
      );

      return classData.save();
    })
    .then(() => {
      return res.status(200).json("Done with updating class");
    })
    .catch((err) => {
      console.error("Update class failed");
      console.error(err);
      return res.status(400).json(err);
    });
});

router.put("/class-officers", (req, res) => {
  let operations = [];
  for (let [classId, rolesToDelete] of Object.entries(req.body)) {
    let fieldToUnset = {};

    for (let role of rolesToDelete) {
      fieldToUnset[role] = "";
      // The value can be ignored, so that may be anything.
    }

    operations.push({
      updateOne: {
        filter: { _id: classId },
        update: { $unset: fieldToUnset },
      },
    });
  }

  Class.bulkWrite(operations, { ordered: false })
    .then(() => {
      return res.json("Unassign class officers complete");
    })
    .catch((err) => {
      console.error("Unassign class officers failed");
      console.error(err);
      return res.status(500).json(err);
    });
});

router.put("/homeroom-teachers", (req, res) => {
  let operations = [];
  for (let [classId, teacherId] of Object.entries(req.body)) {
    let updateArgument = {};

    if (teacherId) {
      updateArgument = { walikelas: teacherId };
    } else {
      // If teacherId is null, homeroom teacher atrribute in this class will be deleted.
      updateArgument = { $unset: { walikelas: "" } };
    }

    operations.push({
      updateOne: {
        filter: { _id: classId },
        update: updateArgument,
      },
    });
  }

  Class.bulkWrite(operations, { ordered: false })
    .then(() => {
      return res.json("Set homeroom teachers complete");
    })
    .catch((err) => {
      console.error("Set homeroom teahers failed");
      console.log(err);
      return res.status(500).json(err);
    });
});

module.exports = router;
