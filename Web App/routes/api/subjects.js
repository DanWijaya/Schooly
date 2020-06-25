const express = require("express");
const router = express.Router();
const keys = require("../../config/keys");
const mongoose = require("mongoose");

// const validateSubjectInput = require("../../validation/SubjectData")

// Load Subject model
const Subject = require("../../models/Subject");

router.post("/create", (req, res) => {

    // const {errors, isValid} = validateSubjectInput

    // if(!isValid){
    //     console.log("not valid data");
    //     return res.status(404).json(errors)
    // }

    console.log(req.body.name)
    Subject.findOne({ name: req.body.name}).then(subject => {
        if(subject){
            return res.status(404).json({ name : "The subject with this name already in Database"})

        } else {
            const newSubject = new Subject({
                name: req.body.name
            })

            newSubject 
                    .save()
                    .then(subject => res.json(subject))
                    .catch(err => res.json(err));
        }
    })
})

router.get("/view/:id", (req, res) => {
    Subject.findById(req.params.id).then(subject => {
        if(!subject){
            return res.status(400).json("Class does not exist");
        } else {
            // console.log(kelas);
            res.json(subject);
        }
    });
});

router.get("/viewall", (req, res) => {
    Subject.find({}).then((subjects, err) => {
        if(!subjects)
            res.status(400).json(err);
        else 
            res.json(subjects);
    });
});

module.exports = router;