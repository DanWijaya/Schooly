const express = require("express");
const router = express.Router();
const keys = require("../../config/keys");

//Load input validation
const validateTaskInput = require("../../validation/TaskData")
// Load Task model
const Task = require("../../models/Task");
const Class = require("../../models/Class")
//Define create route
router.post("/create", (req, res) => {

    const { errors, isValid } = validateTaskInput(req.body)
    if (!isValid) {
        console.log("Not Valid");
        return res.status(400).json(errors);
    }
    Task.findOne({ name: req.body.name, subject: req.body.subject})
        .then(task => {
        if (task) {
            return res.status(400).json({ name: "tasks with same name and subject already exist"});
        }

        else {
          const newTask = new Task(req.body)
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
              .then(task => {
                  res.json(task)
                  console.log("Task is created")})
              .catch(err => console.log(err));
            }
        });
    });



//Define View classes route
router.get("/viewall", (req, res) => {
    Task.find({}).then((tasks, err) => {
        if (!tasks)
            return res.status(400).json("Tasks are not found");
        else
            return res.json(tasks);
    })
})

//Define delete routes
router.delete("/delete/:id", (req, res) => {
    Task.findByIdAndRemove(req.params.id)
        .then((tasks, err) => {
            if (!tasks) {
                res.status(400).json(err);
            }
            else {
                res.json(tasks);
            }
        })
})

//Define Edit routes
router.get("/view/:id", (req, res) => {
    let id = req.params.id;
    Task.findById(id, (err, taskData) => {
      if(!taskData)
        return res.status(404).json("Task is not found")

      return res.json(taskData);
    })
})

//Define update routes
router.post("/update/:id", (req, res) => {
    let grade = req.body.grade;

    const { errors, isValid } = validateTaskInput(req.body)

    if (!isValid) {
        console.log("Not Valid");
        return res.status(400).json(errors);
    }

    let id = req.params.id;

    console.log(req.body.name);
    Task.findById(id, (err, taskData) => {
        if (!taskData)
            return res.status(404).send("Task data is not found");
        else {
            console.log(grade)
            if (!grade) {
                // Untuk taskData yang bukan edit atau kasi nilai
                taskData.name = req.body.name;
                taskData.deadine = req.body.deadine;
                taskData.subject = req.body.subject;
                taskData.class_assigned = req.body.class_assigned;
                taskData.description = req.body.description;
                taskData.deadline = req.body.deadline;
            }
            else {
                // untuk yang kasi nilai
                if (!taskData.grades) {
                    let gradeMap = new Map()
                    gradeMap.set(req.body.studentId, grade)
                    taskData.grades = gradeMap
                    console.log(gradeMap, taskData.grades)
                }
                else {
                    taskData.grades.set(req.body.studentId,grade)
                }

            }

            taskData
                .save()
                .then(taskData => res.json("Update Task complete"))
                .catch(err => res.status(400).send("Unable to update task database"));

        }
        });
    });

module.exports = router;
