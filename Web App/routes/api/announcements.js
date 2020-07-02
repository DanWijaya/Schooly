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
        author_name: req.body.author_name,
        class_assigned: req.body.class_assigned,
        author_id: req.body.author_id,
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
router.get("/viewOne/:id", (req,res) => {
    console.log("view one is runned")
    let id = req.params.id;
    Announcement.findById(id, (err, announcementData) => {
        if(!announcementData)
            return res.status(404).send("Announcement data is not found");
        else {
            console.log("Announcementnya yang ini: ", announcementData)
            return res.json(announcementData)
        }
    })
})

//Define View classes route
router.get("/viewall", (req, res) => {
    Announcement.find({}).then((announcements, err) => {
        if(!announcements)
            return res.status(400).json("Announcements are not found");
        else 
            return res.json(announcements);
    })
})

// Search announcement by author.
router.get("/view/:id", (req, res) => {
    console.log("View announcement is runned")
    let id = req.params.id;
    Announcement.find({author_id: id }).then((announcements, err) => {
        if(!announcements){
            console.log("announcement is not found")
            return res.status(400).json("Announcements are not found")
        }
        else {
            console.log(announcements)
            return res.json(announcements);
        }
    })
})

router.post("/update/:id", (req,res) => {
    
    const { errors, isValid } = validateAnnouncementInput(req.body);

    if(!isValid){
        console.log("Not valid");
        return res.status(400).json(errors);
    }

    let id = req.params.id;

    console.log(req.body);
    Announcement.findById(id, (err, announcementData) => {
        if(!announcementData)
            return res.status(404).send("Announcement data is not found");
        else{
            announcementData.title = req.body.title;
            announcementData.description = req.body.description;
            announcementData.class_assigned = req.body.class_assigned;
            // announcementData.lampiran = req.body.lampiran;
            // announcementData.date_announced = req.body.date_announced

            announcementData
                        .save()
                        .then(taskData => res.json("Update Task complete"))
                        .catch(err => res.status(400).send("Unable to update task database"));
        }
    })
})

//Define delete routes
router.delete("/delete/:id", (req, res) => {
    Announcement.findByIdAndRemove(req.params.id)
        .then((announcements, err) => {
            if(!announcements) {
                res.status(400).json(err);
            } else {
                res.json(announcements);
            }
        })
})


module.exports = router;
