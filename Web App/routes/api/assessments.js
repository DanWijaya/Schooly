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
const Assessment = require("../../models/Assessment");
const { Double } = require("mongodb");

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
        let { class_assigned } = req.body;
        var map = new Map()
        class_assigned.forEach((a) =>  map.set(a, new Map()))
        console.log(map)
        const newAssessment = new Assessment({
          ...req.body, 
          questions: questions_no_lampiran
        });
        newAssessment
            .save()
            .then(quiz => res.json(quiz))
            .catch(err => res.json(err))
      }
    })
})

router.post("/grade/:id", (req,res) => {
  let { id } = req.params;

  Assessment.findById(id, (err, assessmentData) => {
    if(!assessmentData)
      return res.status(404).send("Assessment data is not found");
    else {
      let { grades } = assessmentData;
      let { grade, studentId } = req.body;
      console.log(req.body)
      if(grades){
        console.log(grades)
        console.log(grades.get(studentId));
        grades.set(studentId, parseFloat(grade.toFixed(2)));
        console.log(grades.get(studentId));
      }
      else {
        let grade_map = new Map();
        grade_map.set(studentId, parseFloat(grade.toFixed(2)));
        grades = grade_map;
      }

      assessmentData.grades = grades;
      assessmentData
                .save()
                .then(ass => res.json(ass))
                .catch(err => res.status(400).send("Unable to update task database"));

    }
  })
})
router.post("/update/:id", (req,res) => {
  const { errors, isValid } = validateAssessmentInput(req.body)

  if(!isValid){
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
        assessmentData.posted = req.body.posted;
        assessmentData.type = req.body.type;

        let questions = req.body.questions;
        let qns_list = questions.map((qns) => {
          let q = qns;
          q.lampiran = qns.lampiran.filter(x => typeof x === "string")
          return q;
        })
        console.log(qns_list)
        assessmentData.questions = qns_list;

        assessmentData
                    .save()
                    .then(ass => res.json(ass))
                    .catch(err => res.status(400).send("Unable to update task database"));
    }
  })
})

router.post("/submit/:id", (req,res) => {
  let id = req.params.id;
  let { answers, classId, userId } = req.body;

  Assessment.findById(id, (err,assessmentData) => {

    if(!assessmentData){
      return res.status(404).send("Assessment cannot be found");
    }
    else{
      if(!assessmentData.posted){
        return res.json("Assessment not posted")
      }
      console.log(answers, classId, userId)
      let { submissions, grades , questions} = assessmentData;
      if(submissions){
        if(!submissions.has(userId)){
          submissions.set(userId, answers);
        }
      }
      else{
        let map = new Map();
        map.set(userId, answers);
        submissions = map;
      }
      let correct_count = 0;

      if(grades){
        if(!grades.has(userId)){
          for(let i = 0; i < questions.length; i++){
            if(questions[i].answer == answers[i]){
              correct_count = correct_count + 1
            }
          }
          let score = 100 * correct_count/questions.length;
          grades.set(userId, parseFloat(score.toFixed(2)));
        }
      }
      else {
        let grade_map = new Map();
        for(let i = 0; i < questions.length; i++){
          if(questions[i].answer == answers[i]){
            correct_count = correct_count + 1
          }
        }
        let score = 100 * correct_count/questions.length;
        grade_map.set(userId, parseFloat(score.toFixed(2)));
        grades = grade_map;
      }

      assessmentData.grades = grades;
      assessmentData.submissions = submissions;

      assessmentData
          .save()
          .then(ass => res.json(ass))
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
