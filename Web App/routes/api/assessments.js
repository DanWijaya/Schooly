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
const { update } = require("../../models/Assessment");

router.post('/create', (req,res) => {

  const {errors, isValid} = validateAssessmentInput(req.body)
  if(!isValid){
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
        grades.set(studentId, parseFloat(grade.toFixed(1)));
        console.log(grades.get(studentId));
      }
      else {
        let grade_map = new Map();
        grade_map.set(studentId, parseFloat(grade.toFixed(1)));
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
        assessmentData.question_weight = req.body.question_weight;

        let questions = req.body.questions;
        let qns_list = questions.map((qns) => {
          let q = qns;
          q.lampiran = qns.lampiran.filter(x => typeof x === "string")
          return q;
        })

        let curr_ans_list = assessmentData.questions.map((qns) => { return qns.answer; })
        let new_ans_list = req.body.questions.map((qns) => {return qns.answer; })

        let update_answer = false;
        if(JSON.stringify(curr_ans_list) != JSON.stringify(new_ans_list)){
          update_answer = true;
        }

        let currQstIdList = assessmentData.questions.map((qns) => { return qns._id; })
        let newQstIdList = req.body.questions.map((qns) => { return qns._id; })

        let transformIdx = newQstIdList.map((qstId) => {
          return currQstIdList.indexOf(qstId);
        })
        
        // ANCHOR update
        let weights = req.body.question_weight;
        if(update_answer){
          if(assessmentData.submissions){
            for (const [key, value] of assessmentData.submissions.entries()) {
              
              // key berisi id murid, sedangkan value berisi semua jawaban murid tersebut untuk assessment ini.
              // console.log(key, value);
              // let correct_count = 0;
              let point_accumulator = 0;
              let weight_accumulator = 0;
              let number_of_gradeable_questions = 0;
              let longtextGrade = {};
              let isLongtextQuestionAdded = false;
              for (let i = 0; i < questions.length; i++){

                // 1. jika soal dihapus, semua jawaban murid akan diabaikan dan soal ini tidak masuk dalam penilaian

                // 2. jika soal ini sudah ada sebelum perubahan assessment dilakukan, (baik mengalami perubahan maupun tidak), 
                if (transformIdx[i] !== -1) {

                  // value.length sudah dipastikan sama dengan questions.length sebelum assessment diubah (ViewAssessmentStudent.js)
                  // value[i] adalah jawaban murid untuk pertanyaan ke-(i + 1), misal value[0] adalah jawaban murid untuk pertanyaan pertama.
                  // value[i] sudah dipastikan berbentuk array (tidak mungkin undefined atau null). value[i] bisa berupa array kosong.
                  // questions[i].answer adalah kunci jawaban untuk pertanyaan ke-(i + 1).
                  // value dan questions[i].answer adalah array of array
                  if (questions[i].type === "radio") {
                    // if (questions[i].answer[0] === value[i][0]) {
                    if (questions[i].answer[0] === value[transformIdx[i]][0]) {
                      // correct_count = correct_count + 1;
                      point_accumulator += 1 * weights.radio;
                    }
                    // number_of_gradeable_questions = number_of_gradeable_questions + 1;
                    weight_accumulator += 1 * weights.radio;
                  }
                  else if (questions[i].type === "checkbox") {
                    let temp_correct = 0;
                    // value[i].forEach((student_answer) => {
                    value[transformIdx[i]].forEach((student_answer) => {
                      if (questions[i].answer.includes(student_answer)) {
                        temp_correct = temp_correct + 1;
                      }
                      else {
                        temp_correct = temp_correct - 2;
                      }
                    })
                    // number_of_gradeable_questions = number_of_gradeable_questions + 1;
                    weight_accumulator += 1 * weights.checkbox;

                    if (temp_correct > 0) {
                      // saat pembuatan / sunting assessment, kunci jawaban soal sudah dipastikan tidak kosong.
                      // karena itu, questions[i].answer.length pasti tidak 0
                      // correct_count = correct_count + temp_correct / questions[i].answer.length;
                      point_accumulator += weights.checkbox *  temp_correct / questions[i].answer.length;
                    }
                  }
                  else if (questions[i].type === "shorttext") {
                    let temp_correct = 0;
                    for (let j = 0; j < questions[i].answer.length; j++) {
                      // if (value[i][j] === questions[i].answer[j]) {
                      if (value[transformIdx[i]][j] === questions[i].answer[j]) {
                        temp_correct++;
                      }
                    }
                    // saat pembuatan / sunting assessment, kunci jawaban soal sudah dipastikan tidak kosong.
                    // karena itu, questions[i].answer.length pasti tidak 0
                    // number_of_gradeable_questions = number_of_gradeable_questions + 1;
                    // correct_count = correct_count + temp_correct / questions[i].answer.length;
                    weight_accumulator += 1 * weights.shorttext;
                    point_accumulator += weights.shorttext * temp_correct / questions[i].answer.length;
                  }
                  else {
                    // (tidak perlu dicek lengkap atau tidak karena di edit/create assessment, bobot setiap soal uraian sudah dipastikan ada)
                    let oldLongtextGrade = assessmentData.grades.get(key).longtext_grades[i];
                    let oldLongtextWeight = assessmentData.question_weight.longtext;
                    let newLongtextWeight = req.body.question_weight.longtext;

                    // longtext_grade baru = longtext_grade lama * bobot baru / bobot lama
                    let newLongtextGrade = oldLongtextGrade * newLongtextWeight / oldLongtextWeight;
                    longtextGrade[i] = parseFloat(newLongtextGrade.toFixed(1));
                  }
                } else { 
                  // 3. jika soal ini baru ditambahkan

                  // jika soal ini bertipe radio, checkbox, atau isian (dapat dicek secara otomatis),
                  // semua murid dianggap tidak menjawab soal ini 
                  if (questions[i].type !== "longtext") {
                    weight_accumulator += 1 * weights[questions[i].type];
                  } else { 
                    // jika soal ini bertipe uraian, batalkan penilaian. 
                    // penilaian nilai total akan dilakukan setelah guru sudah memberikan nilai kepada semua soal uraian secara manual
                    isLongtextQuestionAdded = true;
                    break;
                  }
                }
              }

              if (!isLongtextQuestionAdded) {
                let score = 0;
                if (number_of_gradeable_questions > 0) {
                  // score = 100 * correct_count / number_of_gradeable_questions;
                  score = 100 * point_accumulator / weight_accumulator;

                } // number_of_gradeable_questions === 0 ketika semua soal pada assessment ini bertipe uraian
                assessmentData.grades.set(key, { total_score: parseFloat(score.toFixed(1)), longtext_grades: longtextGrade});
              }
              assessmentData.submissions.set(key, transformIdx.map((idx) => {
                if (idx === -1) {
                  return [];
                } else {
                  return value[idx];
                }
              }));
            }
          }
        }
        assessmentData.questions = qns_list;
        assessmentData
                    .save()
                    .then(ass => res.json(update_answer))
                    .catch(err => res.status(400).send("Unable to update task database"));
      }
  })
})

router.post("/submit/:id", (req,res) => {
  let id = req.params.id;
  let { answers, classId, userId } = req.body;

  Assessment.findById(id, (err,assessmentData) => {
    console.log(assessmentData)
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
      // ANCHOR submit
      if(grades){
        if(!grades.has(userId)){
          let number_of_gradeable_questions = 0 // Karena Esai tidak bisa autograde, maka yang dihitung hanya radio dan checkbox saja.
          for(let i = 0; i < questions.length; i++){
            // answers.length sudah dipastikan sama dengan questions.length di ViewAssessmentStudent.js
            // answers[i] adalah jawaban murid untuk pertanyaan ke-(i + 1), misal answer[0] adalah jawaban murid untuk pertanyaan pertama.
            // questions[i].answer adalah kunci jawaban untuk pertanyaan ke-(i + 1).
            // answers dan questions[i].answer adalah array of array
            if(questions[i].type === "radio"){
              if(questions[i].answer[0] === answers[i][0]){
                correct_count = correct_count + 1;
              }
              number_of_gradeable_questions = number_of_gradeable_questions + 1;
            }
            else if(questions[i].type === "checkbox"){
              let temp_correct = 0;
              answers[i].forEach((student_answer) => {
                if(questions[i].answer.includes(student_answer)){
                  temp_correct = temp_correct + 1;
                }
                else{
                  temp_correct = temp_correct - 2;
                }
              })
              number_of_gradeable_questions = number_of_gradeable_questions + 1;
              if(temp_correct > 0){
                // saat pembuatan/sunting assessment, kunci jawaban soal sudah dipastikan tidak kosong.
                // karena itu, questions[i].answer.length pasti tidak 0
                correct_count = correct_count + temp_correct/questions[i].answer.length;
              }
            }
            else if (questions[i].type === "shorttext"){
              let temp_correct = 0;
              for (let j = 0; j < questions[i].answer.length; j++) {
                if (answers[i][j] === questions[i].answer[j]) {
                  temp_correct++;
                }
              }
              number_of_gradeable_questions = number_of_gradeable_questions + 1;
              
              // saat pembuatan/sunting assessment, kunci jawaban soal sudah dipastikan tidak kosong.
              // karena itu, questions[i].answer.length pasti tidak 0
              correct_count = correct_count + temp_correct / questions[i].answer.length;
            }
          }
          let score = 0;
          if (number_of_gradeable_questions > 0) {
            score = 100 * correct_count / number_of_gradeable_questions;
          } // number_of_gradeable_questions === 0 ketika semua soal pada assessment ini bertipe uraian
          grades.set(userId, parseFloat(score.toFixed(1)));
        }
      }
      else {
        let grade_map = new Map();
        let number_of_gradeable_questions = 0
        for(let i = 0; i < questions.length; i++){
          // answers.length sudah dipastikan sama dengan questions.length ViewAssessmentStudent.js
          // answers[i] adalah jawaban murid untuk pertanyaan ke-(i + 1), misal answer[0] adalah jawaban murid untuk pertanyaan pertama.
          // questions[i].answer adalah kunci jawaban untuk pertanyaan ke-(i + 1).
          // answers dan questions[i].answer adalah array of array
          if (questions[i].type === "radio") {
            if (questions[i].answer[0] === answers[i][0]) {
              correct_count = correct_count + 1;
            }
            number_of_gradeable_questions = number_of_gradeable_questions + 1;
          }
          else if (questions[i].type === "checkbox") {
            let temp_correct = 0;
            answers[i].forEach((student_answer) => {
              if (questions[i].answer.includes(student_answer)) {
                temp_correct = temp_correct + 1;
              }
              else {
                temp_correct = temp_correct - 2;
              }
            })
            number_of_gradeable_questions = number_of_gradeable_questions + 1;
            if (temp_correct > 0) {
              // saat pembuatan / sunting assessment, kunci jawaban soal sudah dipastikan tidak kosong.
              // karena itu, questions[i].answer.length pasti tidak 0
              correct_count = correct_count + temp_correct / questions[i].answer.length;
            }
          }
          else if (questions[i].type === "shorttext") {
            let temp_correct = 0;
            for (let j = 0; j < questions[i].answer.length; j++) {
              if (answers[i][j] === questions[i].answer[j]) {
                temp_correct++;
              }
            }
            number_of_gradeable_questions = number_of_gradeable_questions + 1;

            // saat pembuatan/sunting assessment, kunci jawaban soal sudah dipastikan tidak kosong.
            // karena itu, questions[i].answer.length pasti tidak 0
            correct_count = correct_count + temp_correct / questions[i].answer.length; 
          }
        }
        let score = 0;
        if (number_of_gradeable_questions > 0) {
          score = 100 * correct_count/number_of_gradeable_questions;
        } // number_of_gradeable_questions === 0 ketika semua soal pada assessment ini bertipe uraian
        grade_map.set(userId, parseFloat(score.toFixed(1)));
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

router.get("/getkuisbysc/:subjectId&:classId", (req, res) => {
  Assessment.find({subject: req.params.subjectId, class_assigned: {$elemMatch: {$eq: req.params.classId}}, type: "Kuis"}).then((kuis) => {
    if (!kuis) {
      return res.status(200).json("Belum ada kuis");
    } else {
      return res.json(kuis);
    }
  });
})

router.get("/getujianbysc/:subjectId&:classId", (req, res) => {
Assessment.find({subject: req.params.subjectId, class_assigned: {$elemMatch: {$eq: req.params.classId}}, type: "Ujian"}).then((ujian) => {
    if (!ujian) {
      return res.status(200).json("Belum ada ujian");
    } else {
      return res.json(ujian);
    }
  });
})

router.post("/updateSuspects/:id", (req, res) => {
  Assessment.findById(req.params.id, (err, assessmentData) => {
    if (!assessmentData) {
      return res.status(404).send("Assessment data is not found");
    } else {
      assessmentData.suspects = req.body;
      assessmentData
        .save()
        .then(() => res.json(req.body))
        .catch(() => res.status(400).send(`Unable to update suspects attribute for assessment ${id}`));
    }
  })
})

module.exports = router;
