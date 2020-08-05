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

const Quiz = require("../../models/Quiz")

router.post('/create', (req,res) => {

  // const {errors, isValid} = validateQuizInput(req.body)
  // if(!isValid){
  //   console.log("Data is not valid")
  //   return res.status(400).json(errors)
  // }

  Quiz.findOne({ name: req.body.name, subject: req.body.subject})
    .then(quiz => {
      if(quiz){
        return res.status(400).json({ name: "Quizzes with same name and subject already exist"});
      }

      else {
        const newQuiz = new Quiz(req.body);

        newQuiz
            .save()
            .then(quiz => {
              res.json(quiz)
              console.log("Quiz is created")
            })
            .catch(err => console.log(err))
      }
    })
})

router.get("/view/:id", (req,res) => {
  let id = req.params.id
  Quiz.findById(id, (err, quiz) => {
    if(!quiz)
      return res.status(404).json("Quiz is not found")
    return res.json(quiz)
  })
})


