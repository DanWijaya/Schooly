const Validator = require("validator");
const isEmpty = require("is-empty");

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const crypto = require('crypto');
const mailgun = require("mailgun-js")({
  apiKey: keys.mailGunService.apiKey,
  domain: keys.mailGunService.domain,
})
const passport = require("passport");
const validateAssessmentInput = require("../../validation/AssessmentData");
const Assessment = require("../../models/Assessment")

router.post('/create', (req,res) => {

  const {errors, isValid} = validateAssessmentInput(req.body)
  if(!isValid){
    console.log("Data is not valid")
    return res.status(400).json(errors)
  }

  Assessment.findOne({ name: req.body.name, subject: req.body.subject})
    .then(assessment => {
      if(assessment){
        return res.status(400).json({ name: "Quizzes with same name and subject already exist"});
      }

      else {
        console.log("HDHEWJ FNKERNFKERF ",req.body)
        const newAssessment = new Assessment(req.body);

        newAssessment
            .save()
            .then(quiz => res.json(quiz))
            .catch(err => res.json(err))
      }
    })
})

router.get("/viewall", (req,res) => {
  Assessment.find({})
            .then(assessments => {
              if(!assessments)
                res.status(400).json("Assessments are not found")
              else 
                res.json(assessments)
            })
})

router.get("/view/:id", (req,res) => {
  let id = req.params.id
  Assessment.findById(id, (err, assessment) => {
    if(!assessment)
      return res.status(404).json("Quiz is not found")

    return res.json(assessment)
  })
})

router.delete("/delete/:id", (req,res) => {
  let id = req.params.id

  Assessment.findByIdAndRemove(id, (err, assessment) => {
    if(!assessment)
      return res.status(404).json("Quiz to be deleted not found");
      
    return res.json(assessment)
  })
})

module.exports = router;
