const express = require("express");
const router = express.Router();
const keys = require("../../config/keys");

//Load input validation
const {
  validateTaskInput,
  validateTaskGrade,
} = require("../../validation/TaskData");
// Load Task model
const Task = require("../../models/Task");
const mongoose = require("mongoose");

//Define create route

router.post("/create", (req, res) => {
  // pakai body parser
  const { errors, isValid } = validateTaskInput(req.body);
  if (!isValid) {
    console.log("Not Valid");
    return res.status(400).json(errors); // errors ini kan juga json
  }
  console.log(req.body);
  Task.findOne({ name: req.body.name, subject: req.body.subject })
    .then((task) => {
      if (task) {
        throw {
          name: "Tugas dengan nama dan mata pelajaran yang sama sudah ada",
        };
      } else {
        const newTask = new Task(req.body);
        return newTask.save();
      }
    })
    .then((task) => {
      console.log("Create task completed");
      return res.json(task);
    })
    .catch((err) => {
      console.error("Create task failed");
      return res.status(400).json(err);
    });
});

//Define View classes route
router.get("/viewall/:unitId", (req, res) => {
  // pokoknya kalau ada request, requestnya harus diiringi dengan response.
  const { unitId } = req.params;
  if (!unitId) {
    return res.json([]);
  }
  Task.find({ unit: unitId })
    .then((tasks, err) => {
      if (!tasks.length) {
        console.log("Tasks in the unit are empty");
      }
      return res.json(tasks);
    })
    .catch((err) => {
      console.error("Unable to view all tasks");
      return res.status(400).json(err);
    });
});

//Define delete routes
router.delete("/delete/:id", (req, res) => {
  Task.findByIdAndRemove(req.params.id)
    .then((taskData) => {
      if (!taskData) throw "Task to delete is not found";
      return res.json(taskData);
    })
    .catch((err) => {
      console.error("Unable to delete task");
      return res.status(400).json(err);
    });
});

//Define Get one task routes
router.get("/view/:id", (req, res) => {
  let id = req.params.id;
  Task.findById(id)
    .then((taskData) => {
      if (!taskData) throw "Task is not found";
      return res.json(taskData);
    })
    .catch((err) => {
      console.error("View task failed");
      return res.status(400).json(err);
    });
});

router.post("/grade/:id", (req, res) => {
  let { id } = req.params;
  console.log(req.body);
  const { errorsGrade, isValidGrade } = validateTaskGrade(req.body);
  if (!isValidGrade) {
    return res.status(400).json(errorsGrade);
  }
  let grade = req.body.grade;
  Task.findById(id)
    .then((taskData) => {
      if (!taskData) throw "Task to grade is not found";
      //grade kan dia Map (key, value). grade -> (studentId, nilainya)
      // untuk yang kasi nilai
      taskData.grades.set(req.body.studentId, grade);
      return taskData.save();
    })
    .then(() => res.json("Grade Task completed"))
    .catch((err) => {
      console.error("Grade task failed");
      return res.status(400).json(err);
    });
});

//Define update routes
router.put("/update/:id", (req, res) => {
  let grade = req.body.grade;
  const { errors, isValid } = validateTaskInput(req.body);
  if (!isValid) {
    console.log("Not valid");
    throw errors;
  }

  let id = req.params.id;

  console.log(req.body.name);
  Task.findById(id)
    .then((taskData) => {
      if (!taskData) throw "Task data is not found";
      taskData.name = req.body.name;
      taskData.deadine = req.body.deadine;
      taskData.subject = req.body.subject;
      taskData.class_assigned = req.body.class_assigned;
      taskData.description = req.body.description;
      taskData.deadline = req.body.deadline;

      return taskData.save();
    })
    .then((taskData) => {
      console.log("Update task completed");
      return res.json("Update Task complete");
    })
    .catch((err) => {
      console.error("Update task failed");
      return res.status(400).json(err);
    });
});

router.get("/view", (req, res) => {
  const { subjectId, classId } = req.query;
  let query = {};
  if (subjectId) {
    query.subject = subjectId;
  }
  if (classId) {
    query.class_assigned = { $elemMatch: { $eq: classId } };
  }

  Task.find(query)
    .then((tasks) => {
      if (!tasks.length) {
        console.log("Belum ada tugas");
      }
      return res.json(tasks);
    })
    .catch((err) => {
      console.error("View Task failed");
      return res.status(400).json(err);
    });
});

router.post("/comment/:taskId", (req, res) => {
  let comment = req.body;
  const { taskId } = req.params;

  Task.findById(taskId)
    .then((taskData) => {
      if (!taskData) throw "Task data is not found";
      if (!comment.content.length) throw "Isi komentar tidak boleh kosong";

      let newComments = taskData.comments ? [...taskData.comments] : [];
      comment.createdAt = new mongoose.Types.ObjectId().getTimestamp();
      newComments.push(comment);
      taskData.comments = newComments;
      return taskData.save();
    })
    .then(() => {
      return res.json("Create task comment completed");
    })
    .catch((err) => {
      console.error("Create task comment failed");
      return res.status(400).json(err);
    });
});

router.put("/comment/:taskId", (req, res) => {
  let { updatedContent, commentId } = req.body;
  const { taskId } = req.params;
  Task.findById(taskId)
    .then((taskData) => {
      if (!taskData) throw "Task data is not found";
      if (updatedContent.length === 0) throw "Isi komentar tidak boleh kosong";

      let newComments = taskData.comments ? [...taskData.comments] : [];
      for (let i = 0; i < newComments.length; i++) {
        if (newComments[i]._id.toString() === commentId) {
          newComments[i].edited = true;
          newComments[i].content = updatedContent;
          break;
        }
      }

      taskData.comments = newComments;
      return taskData.save();
    })
    .then(() => {
      console.log("Update task comment completed");
      return res.json("Update task comment complete");
    })
    .catch((err) => {
      // status code tergantung errornya (sebenarnya status code should not be a big deal).
      console.error("Update task comment failed");
      return res.status(400).json(err);
    });
});

router.delete("/comment/:taskId&:commentId", (req, res) => {
  const { taskId, commentId } = req.params;

  Task.findById(taskId)
    .then((taskData) => {
      if (!taskData) throw "Task data is not found";
      let newComments = taskData.comments ? [...taskData.comments] : [];
      for (let i = 0; i < newComments.length; i++) {
        if (newComments[i]._id.toString() === commentId) {
          newComments.splice(i, 1);
          break;
        }
      }

      taskData.comments = newComments;
      return taskData.save();
    })
    .then(() => {
      console.log("Delete task comment completed");
      return res.json("Delete task comment complete");
    })
    .catch((err) => {
      // status code tergantung errornya (sebenarnya status code should not be a big deal).
      console.error("Delete task failed");
      return res.status(400).json(err);
    });
});

module.exports = router;
