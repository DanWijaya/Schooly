const express = require("express");
const router = express.Router();
const keys = require("../../config/keys");
const mongoose = require("mongoose");

// Load input validation
const validateClassInput = require("../../validation/ClassData");

// Load the required Model
const Class = require("../../models/Class");
const Student = require("../../models/user_model/Student");

const { ObjectId } = require("mongodb");

router.post("/create", (req, res) => {
  const { errors, isValid } = validateClassInput(req.body);
  if (!isValid) {
    console.log("Not valid");
    return res.status(400).json(errors);
  }

  Class.findOne({ name: req.body.name }).then((kelas) => {
    if (kelas) {
      return res.status(400).json({ name: "Class name already exists" });
    } else {
      const newKelas = new Class({
        name: req.body.name,
        walikelas: req.body.walikelas,
        nihil: req.body.nihil,
        ukuran: req.body.ukuran,
        subject_assigned: req.body.mata_pelajaran.map((id) => (new ObjectId(id)))
      });

      newKelas
        .save()
        .then((kelas) => res.json(kelas))
        .catch((err) => console.log(err));
    }
  });
});
router.get("/view/:id", (req, res) => {
  Class.findById(req.params.id).then((kelas) => {
    if (!kelas) {
      return res.status(400).json("Class does not exist");
    } else {
      // console.log(kelas);
      res.json(kelas);
    }
  });
});

router.get("/viewall", (req, res) => {
  Class.find({}).then((classes, err) => {
    if (!classes) res.status(400).json(err);
    else {
      classes.sort((a, b) => (a.name > b.name ? 1 : -1));
      res.json(classes);
    }
  });
});

router.delete("/delete/:id", (req, res) => {
  let id = req.params.id;

  Student.find({ kelas: id }, (err, students) => {
    console.log("Students di kelas: ", students);

    if (students.length) {
      return res
        .status(400)
        .json({ has_student: "Kelas masih terdapat murid" });
    } else {
      Class.findByIdAndRemove(req.params.id).then((classes, err) => {
        if (!classes) {
          return res.status(400).json(err);
        } else {
          console.log(classes);
          return res.json("Successfully deleted the class");
        }
      });
    }
  });

  // .catch(res.json("Error happened"))
});

router.get("/setCurrentClass/:id", (req, res) => {
  let id = req.params.id;
  // console.log("set Current class is runned", id);
  Class.findById(id, (err, classData) => {
    if (!classData) return res.status(404).json("Class is not found");

    return res.json(classData);
  });
});

router.get("/viewSelectedClasses/", (req, res) => {
  const { classes_ids } = req.query;
  // console.log(classes_ids)
  let ids_to_find;

  if (classes_ids !== undefined) {
    ids_to_find = classes_ids.map((id) => new ObjectId(id));
  }
  Class.find({ _id: { $in: ids_to_find } }, (err, classes) => {
    if (!classes) return res.status(400).json("Class to update not found");

    return res.json(classes);
  });
});

router.post("/update/:id", (req, res) => {
  let id = req.params.id;

  const { errors, isValid } = validateClassInput(req.body);
  console.log(errors);
  if (!isValid) {
    console.log("Not valid");
    return res.status(400).json(errors);
  }

  Class.findById(id, (err, classData) => {
    if (!classData) {
      return res.status(400).json("Class to update not found");
    }
    // Initially there is else block
    classData.name = req.body.name;
    classData.walikelas = req.body.walikelas;
    classData.ketua_kelas = req.body.ketua_kelas;
    classData.sekretaris = req.body.sekretaris;
    classData.bendahara = req.body.bendahara;
    classData.nihil = req.body.nihil;
    classData.ukuran = req.body.ukuran;
    classData.subject_assigned = req.body.mata_pelajaran.map((id) => (new ObjectId(id)));

    classData
      .save()
      .then(() => {
        res.status(200).json("Done with updating class");
      })
      .catch(() => {
        console.log("Error in updating class");
      });
    // Pipeline on how to create a Async functions to be Synchronous function call
    // Step 1: declare promise
    // var myPromise = (id) => {
    //     return new Promise((resolve, reject) => {
    //         User.findById(id, (err, user) => {
    //             if (!user) {
    //                 reject(err)
    //             } else {
    //                 resolve(user);
    //             }
    //         })
    //     })
    // }
    //Step 2: async promise handler
    // var callMyPromise = async () => {
    //     var walikelas_data = await(myPromise(req.body.walikelas));
    //     var sekretaris_data = await(myPromise(req.body.sekretaris));
    //     var bendahara_data = await(myPromise(req.body.bendahara));
    //     var ketua_kelas_data = await(myPromise(req.body.ketua_kelas));

    //     classData.walikelas = walikelas_data
    //     classData.sekretaris = sekretaris_data
    //     classData.bendahara = bendahara_data
    //     classData.ketua_kelas = ketua_kelas_data

    //     // classData.save()
    //     return classData;
    // }
    //Step 3 : Make the call
    // callMyPromise().then(function(classData) {

    //     classData.save()
    //     res.json("Done")
    // });
  });
});

router.put("/class-officers", (req, res) => {
  let operations = [];
  for (let [classId, rolesToDelete] of Object.entries(req.body)) {
    let fieldToUnset = {};

    for (let role of rolesToDelete) {
      fieldToUnset[role] = "";
      // valuenya akan diabaikan, jadi boleh apa saja
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
      res.json("Unassign class officers complete");
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.put("/homeroom-teachers", (req, res) => {
  let operations = [];
  for (let [classId, teacherId] of Object.entries(req.body)) {
    let updateArgument = {};

    if (teacherId) {
      updateArgument = { walikelas: teacherId };
    } else {
      // jika teacherId null, atribut walikelas kelas ini akan dihapus
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
      res.json("Set homeroom teachers complete");
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
