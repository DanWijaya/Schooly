const express = require("express");
const router = express.Router();
const keys = require("../../config/keys");

//Load input validation

// Load Task model
const Task = require("../../models/Task");

router.post("/create", (req, res) => {
    Task.findOne({ name: req.body.name, subject: req.body.subject})
        .then(task => { 
        if(task) {
            return res.status(400).json({ name: "tasks with same name and subject already exist"});
        }
        else {
            const newTask = new Task({
            name: req.body.name,
            deadline: req.body.deadline,
            subject: req.body.subject,
            submitted: req.body.submitted
        });
        newTask
            .save()
            .then(task => {res.json(task)
                console.log("Task is created")})
            .catch(err => console.log(err));
            }
        });
    });
            

    
router.post("/view", (req, res) => {
    
    // const name = req.body.name;
    // const subject = req.body.subject;
    let id = req.params.id;
    console.log("req");
    Task.findById(id)
        .then(task => {
        //Check if task exists
        if (!task) {
            return res.status(404).json({ tasknotfound: "Task not found"});
        } else {
            const payload = {
                name : req.body.name,
                deadline : req.body.deadline,
                subject : req.body.subject,
                submitted : req.body.submitted,
                }
            res.json(payload);     
            }  
    });
});

router.get('/viewall', (req, res) => {
    
    Task.find({}).then((tasks, err) => {
        if(!tasks)
            return res.status(400).json("Tasks are not found");
        else 
            return res.json(tasks);
    })
})

router.delete('/delete/:id', (req, res) => {
    Task.findByIdAndRemove(req.params.id)
        .then((tasks, err) => {
            if(!tasks) {
                res.status(400).json(err);
            } else {
                res.json(tasks);
            }
        })
})

module.exports = router;