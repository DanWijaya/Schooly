const express = require("express");
const router = express.Router();
const keys = require("../../config/keys");

//Load input validation
const validateTaskInput = require("../../validation/TaskData");
// Load Task model
const Task = require("../../models/Task");
const Class = require("../../models/Class");

const mongoose = require("mongoose");

//Define create route

router.post("/create", (req, res) => {
  // pakai body parser
  console.log(req.body);
  const { errors, isValid } = validateTaskInput(req.body);
  if (!isValid) {
    console.log("Not Valid");
    return res.status(400).json(errors); // errors ini kan juga json
  }

  Task.findOne({ name: req.body.name, subject: req.body.subject }).then(
    (task) => {
      if (task) {
        return res
          .status(400)
          .json({ name: "tasks with same name and subject already exist" });
      } else {
        const newTask = new Task(req.body);
        // const newTask = new Task({
        // name: req.body.name,
        // deadline: req.body.deadline,
        // subject: req.body.subject,
        // class_assigned: req.body.class_assigned,
        // description: req.body.description,
        // person_in_charge_id: req.body.person_in_charge_id
        // })

        newTask
          .save()
          .then((task) => {
            res.json(task);
            console.log("Task is created");
          })
          .catch((err) => console.log(err));
      }
    }
  );
});

//Define View classes route
router.get("/viewall", (req, res) => {
  // pokoknya kalau ada request, requestnya harus diiringi dengan response.
  Task.find({}).then((tasks, err) => {
    if (!tasks) return res.status(400).json("Tasks are not found");
    else return res.json(tasks);
  });
});

//Define delete routes
router.delete("/delete/:id", (req, res) => {
  Task.findByIdAndRemove(req.params.id).then((tasks, err) => {
    if (!tasks) {
      res.status(400).json(err);
    } else {
      res.json(tasks);
    }
  });
});

//Define Get one task routes
router.get("/view/:id", (req, res) => {
  let id = req.params.id;
  Task.findById(id, (err, taskData) => {
    if (!taskData) return res.status(404).json("Task is not found");

    return res.json(taskData);
  });
});

//Define update routes
router.post("/update/:id", (req, res) => {
  let grade = req.body.grade;
  const { errors, isValid } = validateTaskInput(req.body);

  if (!isValid) {
    console.log("Not Valid");
    return res.status(400).json(errors);
  }

  let id = req.params.id;

  console.log(req.body.name);
  Task.findById(id, (err, taskData) => {
    if (!taskData) return res.status(404).send("Task data is not found");
    else {
      // taskData.grades
      console.log(grade);
      if (!grade) {
        // Untuk taskData yang bukan edit atau kasi nilai
        taskData.name = req.body.name;
        taskData.deadine = req.body.deadine;
        taskData.subject = req.body.subject;
        taskData.class_assigned = req.body.class_assigned;
        taskData.description = req.body.description;
        taskData.deadline = req.body.deadline;
      } else {
        //grade kan dia Map (key, value). grade -> (studentId, nilainya)
        // untuk yang kasi nilai
        taskData.grades.set(req.body.studentId, grade);
      }

      taskData
        .save()
        .then((taskData) => res.json("Update Task complete"))
        .catch((err) => res.status(400).send("Unable to update task database"));
    }
  });
});

router.get("/gettasksbysc/:subjectId&:classId", (req, res) => {
  Task.find({
    subject: req.params.subjectId,
    class_assigned: { $elemMatch: { $eq: req.params.classId } },
  }).then((tasks) => {
    if (!tasks) {
      return res.status(200).json("Belum ada tugas");
    } else {
      return res.json(tasks);
    }
  });
});

router.get("/byclass/:classId", (req, res) => {
  Task.find({
    class_assigned: { $elemMatch: { $eq: req.params.classId } },
  }).then((tasks) => {
    if (!tasks) {
      return res.status(200).json("Belum ada tugas");
    } else {
      return res.status(200).json(tasks);
    }
  });
});

router.post("/createcomment/:id", (req, res) => {
  let comment = req.body;

  Task.findById(req.params.id, (err, taskData) => {
    if (!taskData) {
      return res.status(404).send("Task data is not found");
    } else {
      if (comment.content.length === 0) {
        res.status(400).json("Isi komentar tidak boleh kosong");
        return;
      }

      let newComments = taskData.comments ? [...taskData.comments] : [];
      comment.createdAt = new mongoose.Types.ObjectId().getTimestamp();
      newComments.push(comment);

      taskData.comments = newComments;
      taskData
        .save()
        .then(() => {
          res.json("Create task comment complete")
        })
        .catch(() => {
          res.status(400).send("Unable to create task comment")
        });
    }
  });
});

router.post("/editcomment/:id", (req, res) => {
  let { updatedContent, commentId } = req.body;

  Task.findById(req.params.id, (err, taskData) => {
    if (!taskData) {
      return res.status(404).send("Task data is not found");
    } else {
      if (updatedContent.length === 0) {
        res.status(400).json("Isi komentar tidak boleh kosong");
        return;
      }

      let newComments = taskData.comments ? [...taskData.comments] : [];
      for (let i = 0; i < newComments.length; i++) {
        if (newComments[i]._id.toString() === commentId) {
          newComments[i].edited = true;
          newComments[i].content = updatedContent;
          break;
        }
      }

      taskData.comments = newComments;
      taskData
        .save()
        .then(() => {
          res.json("Edit task comment complete")
        })
        .catch(() => {
          res.status(400).send("Unable to edit task comment")
        });
    }
  });
});

router.delete("/deletecomment/:id", (req, res) => {
  let { commentId } = req.body;
  
  Task.findById(req.params.id, (err, taskData) => {
    if (!taskData) {
      return res.status(404).send("Task data is not found");
    } else {

      let newComments = taskData.comments ? [...taskData.comments] : [];
      for (let i = 0; i < newComments.length; i++) {
        if (newComments[i]._id.toString() === commentId) {
          newComments.splice(i, 1);
          break;
        }
      }

      taskData.comments = newComments;
      taskData
        .save()
        .then(() => {
          res.json("Delete task comment complete")
        })
        .catch(() => {
          res.status(400).send("Unable to delete task comment")
        });
    }
  });
});

module.exports = router;
