const express = require("express");
const router = express.Router();
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");

// Load Task model
const Task = require("../../models/Task");

router.post("/task/create", (req, res) => {
    
    Task.findOne({ name: req.body.name }).then(task => {
        if(task) {
            return res.status(400).json({ name: "Task name has been used before"});

        } else {
            const newTask = newTask({
                name: req.body.name,
                deadline: req.body.deadline,
                score: req.body.score,
            })
        }
    })
    

})