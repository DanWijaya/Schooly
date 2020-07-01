const avatar = require("./uploads");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const validateAnnouncementInput = require("../../validation/AnnouncementData");

const Announcement = require("../../models/Announcement");

router.post("/create", (req, res) => {
    // Form Validation
    const { errors, isValid } = validateAnnouncementInput(req.body);
    if(!isValid){
        return res.status(404).json("Annoucement input is not valid ")
    }
    // Check Validation
    const newAnnouncement = new Announcement({
        title: req.body.title,
        description: req.body.description,
        author: req.body.author,
        date_announced: new Date()
    })
    newAnnouncement
            .save()
            .then(ann => {
                res.json(ann)
                console.log("Announcement is created")})
            .catch(err => console.log(err));
})

//Define View one announcement
router.get("viewOneAnnouncement/:id", (req,res) => {
    let id = req.params.id;
    Announcement.findById(id, (err, announcement) => {
        if(!announcement)
            return res.status(400).json("Announcement is not found");
        return res.json(announcement)
    })
})

//Define View classes route
router.get("/viewall", (req, res) => {
    Announcement.find({}).then((announcements, err) => {
        if(!announcements)
            return res.status(400).json("Tasks are not found");
        else
            return res.json(announcements);
    })
})

router.post("/update/:id", (req,res) => {
    if(!isValid){
        console.log("Not valid");
        return res.status(400).json(errors);
    }
    let id = req.params.id;

    console.log(req.body.name);
    Announcement.findById(id, (err, announcementData) => {
        if(!taskData)
            return res.status(404).send("Task data is not found");
        else{
            announcementData.title = req.body.title;
            announcementData.description = req.body.description;
            announcementData.lampiran = req.body.lampiran;
            announcementData.author = req.body.author;
            announcementData.date_announced = req.body.date_announced

            announcementData
                        .save()
                        .then(taskData => res.json("Update Task complete"))
                        .catch(err => res.status(400).send("Unable to update task database"));
        }
    })
})

//Define delete routes
router.delete("/delete/:id", (req, res) => {
    Task.findByIdAndRemove(req.params.id)
        .then((announcements, err) => {
            if(!tasks) {
                res.status(400).json(err);
            } else {
                res.json(tasks);
            }
        })
})


module.exports = router;
