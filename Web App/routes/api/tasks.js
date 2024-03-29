const Task = require("../../models/Task");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const keys = require("../../config/keys");
const {
  validateTaskInput,
  validateTaskGrade,
} = require("../../validation/TaskData");

// Define create routes.
router.post("/create", (req, res) => {
  // Use body parser.
  const { errors, isValid } = validateTaskInput(req.body);
  if (!isValid) {
    console.log("Not Valid");
    return res.status(400).json(errors); // These errors is also json.
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
      console.error(err);
      return res.status(400).json(err);
    });
});

// Define view classes routes.
router.get("/viewall/:unitId", (req, res) => {
  // When there is a request, the request must be followed with response.
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
      console.error(err);
      return res.status(400).json(err);
    });
});

// Define delete routes.
router.delete("/delete/:id", (req, res) => {
  Task.findByIdAndRemove(req.params.id)
    .then((taskData) => {
      if (!taskData) throw "Task to delete is not found";
      return res.json(taskData);
    })
    .catch((err) => {
      console.error("Unable to delete task");
      console.error(err);
      return res.status(400).json(err);
    });
});

// Define get one task routes.
router.get("/view/:id", (req, res) => {
  let id = req.params.id;
  Task.findById(id)
    .then((taskData) => {
      if (!taskData) throw "Task is not found";
      return res.json(taskData);
    })
    .catch((err) => {
      console.error("View task failed");
      console.error(err);
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
      // Grade is Map (key, value) = (student's id, score).
      // For the one who has been graded.
      taskData.grades.set(req.body.studentId, grade);
      return taskData.save();
    })
    .then(() => res.json("Grade Task completed"))
    .catch((err) => {
      console.error("Grade task failed");
      console.error(err);
      return res.status(400).json(err);
    });
});

// Define update routes.
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
      console.error(err);
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
      console.error(err);
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
      console.error(err);
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
      console.error("Update task comment failed");
      console.error(err);
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
      console.error("Delete task failed");
      console.error(err);
      return res.status(400).json(err);
    });
});

module.exports = router;
