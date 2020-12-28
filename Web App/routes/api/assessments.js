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

//ANCHOR update
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

        let curr_ans_list = assessmentData.questions.map((qns) => { return qns.answer; })
        let new_ans_list = req.body.questions.map((qns) => {return qns.answer; })
      
        let update_answer = false;
        if(JSON.stringify(curr_ans_list) != JSON.stringify(new_ans_list)){
          update_answer = true;
        }

        let update_weights = false;
        if (JSON.stringify(assessmentData.question_weight) !== JSON.stringify(req.body.question_weight)){
          update_weights = true;
        }

        let currQstIdList = assessmentData.questions.map((qns) => { return qns._id; })
        let newQstIdList = req.body.questions.map((qns) => { return qns._id; })

        let transformIdx = newQstIdList.map((qstId) => {
          return currQstIdList.indexOf(qstId);
        })
        
        if (update_answer || update_weights){
          if(assessmentData.submissions){
            let weights = req.body.question_weight;
            for (const [key, value] of assessmentData.submissions.entries()) {
              
              // key berisi id murid, sedangkan value berisi semua jawaban murid tersebut untuk assessment ini.
              let point_accumulator = 0;
              let weight_accumulator = 0;
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
                    if (questions[i].answer[0] === value[transformIdx[i]][0]) {
                      point_accumulator += 1 * weights.radio;
                    }
                    weight_accumulator += 1 * weights.radio;
                  }
                  else if (questions[i].type === "checkbox") {
                    let temp_correct = 0;
                    value[transformIdx[i]].forEach((student_answer) => {
                      if (questions[i].answer.includes(student_answer)) {
                        temp_correct = temp_correct + 1;
                      }
                      else {
                        temp_correct = temp_correct - 2;
                      }
                    })
                    weight_accumulator += 1 * weights.checkbox;

                    if (temp_correct > 0) {
                      // saat pembuatan / sunting assessment, kunci jawaban soal sudah dipastikan tidak kosong.
                      // karena itu, questions[i].answer.length pasti tidak 0
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
                    weight_accumulator += 1 * weights.shorttext;
                    point_accumulator += weights.shorttext * temp_correct / questions[i].answer.length;
                  }
                  else {

                    if (assessmentData.grades && assessmentData.grades.get(key) && assessmentData.grades.get(key).longtext_grades[transformIdx[i]] !== undefined) {
                      let oldLongtextGrade = assessmentData.grades.get(key).longtext_grades[transformIdx[i]];
                      let oldLongtextWeight = assessmentData.question_weight.longtext[transformIdx[i]];
                      let newLongtextWeight = req.body.question_weight.longtext[i];

                      // longtext_grade baru = longtext_grade lama * bobot baru / bobot lama
                      let newLongtextGrade = oldLongtextGrade * newLongtextWeight / oldLongtextWeight;
                      longtextGrade[i] = parseFloat(newLongtextGrade.toFixed(1));

                      weight_accumulator += newLongtextWeight;
                      point_accumulator += newLongtextGrade;
                    } else {
                      // jika perubahan assessment dilakukan sebelum guru selesai memberikan nilai untuk semua jawaban uraian murid ini,
                      break;
                    }
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
                // weight_accumulator sudah dipastikan tidak 0
                let score = 100 * point_accumulator / weight_accumulator;                
                assessmentData.grades.set(key, { total_grade: parseFloat(score.toFixed(1)), longtext_grades: longtextGrade});
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

        if (update_weights) {
          assessmentData.question_weight = req.body.question_weight;
        }
        assessmentData.questions = qns_list;
        assessmentData
                    .save()
                    .then(ass => res.json(update_answer))
                    .catch(err => res.status(400).send("Unable to update task database"));
      }
  })
})


// ANCHOR submit
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

      let hasLongtextQuestion = false;
      for (let question of assessmentData.questions.values()) {
        if (question.type === "longtext") {
          hasLongtextQuestion = true;
          break;
        }
      }
      // jika tidak ada soal uraian, nilai total bisa langsung dihitung
      if (!hasLongtextQuestion) {

        if (!assessmentData.grades) {
          // jika murid ini adalah murid pertama yang submit jawaban
          grades = new Map();
        } else {
          grades = new Map(assessmentData.grades);
        }

        if (!grades.has(userId)) {
          let studentId = userId; //agar sebagian kode bisa direuse di updateGrade
                      
          let weights = assessmentData.question_weight;
          let point_accumulator = 0;
          let weight_accumulator = 0;
          for (let i = 0; i < questions.length; i++) {
            // answers.length sudah dipastikan sama dengan questions.length di ViewAssessmentStudent.js
            // answers[i] adalah jawaban murid untuk pertanyaan ke-(i + 1), misal answer[0] adalah jawaban murid untuk pertanyaan pertama.
            // questions[i].answer adalah kunci jawaban untuk pertanyaan ke-(i + 1).
            // answers dan questions[i].answer adalah array of array
            if (questions[i].type === "radio") {
              if (questions[i].answer[0] === answers[i][0]) {
                point_accumulator += 1 * weights.radio;
              }
              weight_accumulator += 1 * weights.radio;
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
              weight_accumulator += 1 * weights.checkbox;

              if (temp_correct > 0) {
                // saat pembuatan/sunting assessment, kunci jawaban soal sudah dipastikan tidak kosong.
                // karena itu, questions[i].answer.length pasti tidak 0
                point_accumulator += weights.checkbox * temp_correct / questions[i].answer.length;
              }
            }
            else if (questions[i].type === "shorttext") {
              let temp_correct = 0;
              for (let j = 0; j < questions[i].answer.length; j++) {
                if (answers[i][j] === questions[i].answer[j]) {
                  temp_correct++;
                }
              }
              // saat pembuatan/sunting assessment, kunci jawaban soal sudah dipastikan tidak kosong.
              // karena itu, questions[i].answer.length pasti tidak 0
              weight_accumulator += 1 * weights.shorttext;
              point_accumulator += weights.shorttext * temp_correct / questions[i].answer.length;
            }
          }
          let score = 100 * point_accumulator / weight_accumulator;
          grades.set(studentId, { total_grade: parseFloat(score.toFixed(1)), longtext_grades: null});
        }

        assessmentData.grades = grades;
      } // jika ada soal uraian, penghitungan nilai akan ditunda hingga semua jawaban uraian untuk suatu murid sudah dinilai
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


// ANCHOR updateGrades
router.post("/updateGrades", (req, res) => {
  Assessment.findById(req.body.assessmentId, (err, assessmentData) => {
    if (!assessmentData) {
      return res.status(404).send("Assessment data is not found");
    } else {
      let questions = assessmentData.questions;
      let weights = assessmentData.question_weight;
      let { studentId, questionIdx, longtextGrade} = req.body;

      let longtextQstCount = 0;
      questions.forEach((qst) =>{
        if (qst.type === "longtext") {
          longtextQstCount++;
        } 
      });

      let newLtGrades;
      let grades;
      // pas pertama kali assessment dibuat, atribut grades tidak ada.
      // jika murid ini adalah murid pertama yang diberi nilai,
      if (!assessmentData.grades) {
        newLtGrades = {};
        grades = new Map();
      } else {
        // jika murid ini bukan murid pertama yang dinilai
        grades = new Map(assessmentData.grades);

        // jika semua jawaban uraian suatu murid belum dinilai, atribut grades pada assessment tidak akan menyimpan data murid tersebut 
        // jika jawaban uraian murid ini belum pernah dinilai (ini adalah nilai uraian pertama yang diperoleh)
        if (!assessmentData.grades.has(studentId)) {
          newLtGrades = {};
        } else {
          newLtGrades = assessmentData.grades.get(studentId).longtext_grades; 
        }
      }
      newLtGrades[questionIdx] = longtextGrade;

      if (longtextQstCount === Object.keys(newLtGrades).length) {
        // jika nilai soal uraian sudah lengkap, hitung nilai total murid ini

        let answers = assessmentData.submissions.get(studentId);
        let point_accumulator = Object.values(newLtGrades).reduce((accumulator, currval) => (accumulator + currval));
        let weight_accumulator = Object.values(weights.longtext).reduce((accumulator, currval) => (accumulator + currval));

        for (let i = 0; i < questions.length; i++) {
          // answers.length sudah dipastikan sama dengan questions.length di ViewAssessmentStudent.js
          // answers[i] adalah jawaban murid untuk pertanyaan ke-(i + 1), misal answer[0] adalah jawaban murid untuk pertanyaan pertama.
          // questions[i].answer adalah kunci jawaban untuk pertanyaan ke-(i + 1).
          // answers dan questions[i].answer adalah array of array
          if (questions[i].type === "radio") {
            if (questions[i].answer[0] === answers[i][0]) {
              point_accumulator += 1 * weights.radio;
            }
            weight_accumulator += 1 * weights.radio;
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
            weight_accumulator += 1 * weights.checkbox;

            if (temp_correct > 0) {
              // saat pembuatan/sunting assessment, kunci jawaban soal sudah dipastikan tidak kosong.
              // karena itu, questions[i].answer.length pasti tidak 0
              point_accumulator += weights.checkbox * temp_correct / questions[i].answer.length;
            }
          }
          else if (questions[i].type === "shorttext") {
            let temp_correct = 0;
            for (let j = 0; j < questions[i].answer.length; j++) {
              if (answers[i][j] === questions[i].answer[j]) {
                temp_correct++;
              }
            }

            // saat pembuatan/sunting assessment, kunci jawaban soal sudah dipastikan tidak kosong.
            // karena itu, questions[i].answer.length pasti tidak 0
            weight_accumulator += 1 * weights.shorttext;
            point_accumulator += weights.shorttext * temp_correct / questions[i].answer.length;
          }
        }

        let score = 0;
        score = 100 * point_accumulator / weight_accumulator;
        grades.set(studentId, { total_grade: parseFloat(score.toFixed(1)), longtext_grades: newLtGrades });
      } else {
        // jika nilai uraian belum lengkap
        grades.set(studentId, { total_grade: null, longtext_grades: newLtGrades });
      }

      assessmentData.grades = grades;
      assessmentData
        .save()
        .then((ass) => {res.json(ass)})
        .catch(() => res.status(400).send(`Unable to update grades attribute`));
    }
  })
})

module.exports = router;
