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

        let questions = req.body.questions;
        let questions_no_lampiran = questions.map((qns) => {
          delete qns.lampiran
          return qns
        })
        const newAssessment = new Assessment({
          ...req.body, 
          questions: questions_no_lampiran
        });
        console.log({...req.body, questions: questions_no_lampiran})
        newAssessment
            .save()
            .then(quiz => res.json(quiz))
            .catch(err => res.json(err))
      }
    })
})

router.post("/update/:id", (req,res) => {
  const { errors, isValid } = validateAssessmentInput(req.body)
  if(!isValid){
    console.log("Data is not valid")
    return res.status(400).json(errors)
  }

  let id = req.params.id;

  Assessment.findById(id, (err, assessmentData) => {
    if (!assessmentData)
        return res.status(404).send("Assessment data is not found");

    else{
        assessmentData.name = req.body.name;
        assessmentData.description = req.body.description;
        assessmentData.class_assigned = req.body.class_assigned;
        assessmentData.subject = req.body.subject;
        assessmentData.start_date = req.body.start_date;
        assessmentData.end_date = req.body.end_date;

        let questions = req.body.questions;
        let qns_list = questions.map((qns) => {
          let q = qns;
          // let lampiran = q.lampiran.filter(x => typeof x === "string")
          q.lampiran = qns.lampiran.filter(x => typeof x === "string")
          return q;
        })
        console.log(qns_list)
        assessmentData.questions = qns_list;
        assessmentData
                    .save()
                    .then(quiz => res.json(quiz))
                    .catch(err => res.status(400).send("Unable to update task database"));
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
