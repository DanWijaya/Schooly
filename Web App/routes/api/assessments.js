const Assessment = require("../../models/Assessment");
const Validator = require("validator");
const isEmpty = require("is-empty");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const keys = require("../../config/keys");
const mailgun = require("mailgun-js")({
  apiKey: keys.mailGunService.apiKey,
  domain: keys.mailGunService.domain,
});
const validateAssessmentInput = require("../../validation/AssessmentData");
const { Double } = require("mongodb");

router.post("/create", (req, res) => {
  const { errors, isValid } = validateAssessmentInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  Assessment.findOne({ name: req.body.name, subject: req.body.subject })
    .then((assessment) => {
      if (assessment) {
        throw { name: "Quizzes with same name and subject already exist" };
      }
      let questions = req.body.questions;
      let questions_no_lampiran = questions.map((qns) => {
        delete qns.lampiran;
        return qns;
      });
      let { class_assigned } = req.body;
      var map = new Map();
      class_assigned.forEach((a) => map.set(a, new Map()));
      console.log(map);
      const newAssessment = new Assessment({
        ...req.body,
        questions: questions_no_lampiran,
      });
      return newAssessment.save();
    })
    .then((assessment) => {
      console.log("Create assessment completed");
      return res.json(assessment);
    })
    .catch((err) => {
      console.error("Create assessment failed");
      console.error(err);
      return res.status(400).json(err);
    });
});

router.put("/update/:id", (req, res) => {
  const { errors, isValid } = validateAssessmentInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  let id = req.params.id;
  Assessment.findById(id)
    .then((assessmentData) => {
      if (!assessmentData) throw "Assessment data is not found";
      assessmentData.name = req.body.name;
      assessmentData.description = req.body.description;
      assessmentData.class_assigned = req.body.class_assigned;
      assessmentData.subject = req.body.subject;
      assessmentData.start_date = req.body.start_date;
      assessmentData.end_date = req.body.end_date;
      assessmentData.posted = req.body.posted;
      assessmentData.post_date = req.body.post_date;
      assessmentData.type = req.body.type;

      let questions = req.body.questions;
      let qns_list = questions.map((qns) => {
        let q = qns;
        q.lampiran = qns.lampiran.filter((x) => typeof x === "string");
        return q;
      });

      let curr_ans_list = assessmentData.questions.map((qns) => {
        return qns.answer;
      });
      let new_ans_list = req.body.questions.map((qns) => {
        return qns.answer;
      });

      let update_answer = false;
      if (JSON.stringify(curr_ans_list) != JSON.stringify(new_ans_list)) {
        update_answer = true;
      }

      let update_weights = false;
      if (
        JSON.stringify(assessmentData.question_weight) !==
        JSON.stringify(req.body.question_weight)
      ) {
        update_weights = true;
      }

      let currQstIdList = assessmentData.questions.map((qns) => {
        return qns._id;
      });
      let newQstIdList = req.body.questions.map((qns) => {
        return qns._id;
      });

      let transformIdx = newQstIdList.map((qstId) => {
        return currQstIdList.indexOf(qstId);
      });

      if (update_answer || update_weights) {
        if (assessmentData.submissions) {
          let weights = req.body.question_weight;
          for (const [key, value] of assessmentData.submissions.entries()) {
            // Key contains student's id, whereas value contains all students' answer for this assessment.
            let point_accumulator = 0;
            let weight_accumulator = 0;
            let longtextGrade = {};
            let isLongtextQuestionAdded = false;
            for (let i = 0; i < questions.length; i++) {
              // If this question is deleted, all of the students' answer will be ignored and this question won't be involved in grading.
              // If this question is already created before a change of the assessment is made, (whether there is a change or not),
              if (transformIdx[i] !== -1) {
                // value.length is already ensured equal to questions.length before assessment is changed (ViewAssessmentStudent.js).
                // value[i] is the student's answer for question-(i + 1), for example value[0] is the student's answer for the first question.
                // value[i] is an array (so that it can't be undefined atau null). value[i] can contain empty array.
                // questions[i].answer is the key answer for question-(i + 1).
                // value and questions[i].answer are array of array.
                if (questions[i].type === "radio") {
                  if (questions[i].answer[0] === value[transformIdx[i]][0]) {
                    point_accumulator += 1 * weights.radio;
                  }
                  weight_accumulator += 1 * weights.radio;
                } else if (questions[i].type === "checkbox") {
                  let temp_correct = 0;
                  value[transformIdx[i]].forEach((student_answer) => {
                    if (questions[i].answer.includes(student_answer)) {
                      temp_correct = temp_correct + 1;
                    } else {
                      temp_correct = temp_correct - 2;
                    }
                  });
                  weight_accumulator += 1 * weights.checkbox;

                  if (temp_correct > 0) {
                    // When creating/editing assessment, the question key answer is already ensured not empty.
                    // Because of that, questions[i].answer.length certainly is not 0.
                    point_accumulator +=
                      (weights.checkbox * temp_correct) /
                      questions[i].answer.length;
                  }
                } else if (questions[i].type === "shorttext") {
                  let temp_correct = 0;
                  for (let j = 0; j < questions[i].answer.length; j++) {
                    // if (value[i][j] === questions[i].answer[j]) {
                    if (value[transformIdx[i]][j] === questions[i].answer[j]) {
                      temp_correct++;
                    }
                  }
                  // When creating/editing assessment, the question key answer is already ensured not empty.
                  // Because of that, questions[i].answer.length certainly is not 0.
                  weight_accumulator += 1 * weights.shorttext;
                  point_accumulator +=
                    (weights.shorttext * temp_correct) /
                    questions[i].answer.length;
                } else {
                  if (
                    assessmentData.grades &&
                    assessmentData.grades.get(key) &&
                    assessmentData.grades.get(key).longtext_grades[
                      transformIdx[i]
                    ] !== undefined
                  ) {
                    let oldLongtextGrade = assessmentData.grades.get(key)
                      .longtext_grades[transformIdx[i]];
                    let oldLongtextWeight =
                      assessmentData.question_weight.longtext[transformIdx[i]];
                    let newLongtextWeight =
                      req.body.question_weight.longtext[i];

                    // new longtext_grade = old longtext_grade * new weight / old weight.
                    let newLongtextGrade =
                      (oldLongtextGrade * newLongtextWeight) /
                      oldLongtextWeight;
                    longtextGrade[i] = parseFloat(newLongtextGrade.toFixed(1));

                    weight_accumulator += newLongtextWeight;
                    point_accumulator += newLongtextGrade;
                  } else {
                    // If a change of assessment is made before the teacher finish grading for all long text question of this student,
                    break;
                  }
                }
              } else {
                // If this question is just added.

                // If this question can be checked automatically (multiple choice, checkbox, or short text),
                // all student is considered haven't answered this question.
                if (questions[i].type !== "longtext") {
                  weight_accumulator += 1 * weights[questions[i].type];
                } else {
                  // If this question is a long text question type, cancel the automatic grading.
                  // Total grade will be done after teacher already grade all long text question manually.
                  isLongtextQuestionAdded = true;
                  break;
                }
              }
            }

            if (!isLongtextQuestionAdded) {
              // weight_accumulator is already ensured not 0.
              let score = (100 * point_accumulator) / weight_accumulator;
              if (assessmentData.grades) {
                assessmentData.grades.set(key, {
                  total_grade: parseFloat(score.toFixed(1)),
                  longtext_grades: longtextGrade,
                });
              }
            }
            assessmentData.submissions.set(
              key,
              transformIdx.map((idx) => {
                if (idx === -1) {
                  return [];
                } else {
                  return value[idx];
                }
              })
            );
          }
        }
      }

      if (update_weights) {
        assessmentData.question_weight = req.body.question_weight;
      }
      assessmentData.questions = qns_list;
      return assessmentData.save();
    })
    .then((assessment) => {
      console.log("Update Assessment completed");
      return res.json(assessment);
    })
    .catch((err) => {
      console.error("Update Assessment failed");
      console.error(err);
      return res.status(400).send("Unable to update task database");
    });
});

router.put("/submit/:id", (req, res) => {
  let id = req.params.id;
  let { answers, classId, userId } = req.body;

  Assessment.findById(id)
    .then((assessmentData) => {
      if (!assessmentData) {
        throw "Assessment cannot be found";
      }
      let now = new Date();
      if (now < new Date(assessmentData.post_date)) {
        return res.json("Assessment not posted");
      }

      console.log(answers, classId, userId);
      let { submissions, questions, submissions_timestamp } = assessmentData;
      let grades;
      if (submissions) {
        if (!submissions.has(userId)) {
          submissions.set(userId, answers);
          submissions_timestamp.set(userId, now);
        } else {
          return res.send("Assessment has already answered");
        }
      } else {
        let map1 = new Map();
        map1.set(userId, answers);
        submissions = map1;

        let map2 = new Map();
        map2.set(userId, now);
        submissions_timestamp = map2;
      }

      let hasLongtextQuestion = false;
      for (let question of assessmentData.questions.values()) {
        if (question.type === "longtext") {
          hasLongtextQuestion = true;
          break;
        }
      }
      // If there is no long text question, total score can be counted instantly.
      if (!hasLongtextQuestion) {
        if (!assessmentData.grades) {
          // If this student is the first student who submit the answer.
          grades = new Map();
        } else {
          grades = new Map(assessmentData.grades);
        }

        // if (!grades.has(userId)) {
        let studentId = userId; // So that half of the code can be reused in updateGrade.

        let weights = assessmentData.question_weight;
        let point_accumulator = 0;
        let weight_accumulator = 0;
        for (let i = 0; i < questions.length; i++) {
          // answers.length is already ensured same with questions.length in ViewAssessmentStudent.js.
          // answers[i] is the student's answer for question-(i + 1), for example answer[0] is the student's answer for the first question.
          // questions[i].answer is the key answer for question-(i + 1).
          // answers dan questions[i].answer are array of array.
          if (questions[i].type === "radio") {
            if (questions[i].answer[0] === answers[i][0]) {
              point_accumulator += 1 * weights.radio;
            }
            weight_accumulator += 1 * weights.radio;
          } else if (questions[i].type === "checkbox") {
            let temp_correct = 0;
            answers[i].forEach((student_answer) => {
              if (questions[i].answer.includes(student_answer)) {
                temp_correct = temp_correct + 1;
              } else {
                temp_correct = temp_correct - 2;
              }
            });
            weight_accumulator += 1 * weights.checkbox;

            if (temp_correct > 0) {
              // When creating/editing assessment, the question key answer is already ensured not empty.
              // Because of that, questions[i].answer.length certainly is not 0.
              point_accumulator +=
                (weights.checkbox * temp_correct) / questions[i].answer.length;
            }
          } else if (questions[i].type === "shorttext") {
            let temp_correct = 0;
            for (let j = 0; j < questions[i].answer.length; j++) {
              if (answers[i][j] === questions[i].answer[j]) {
                temp_correct++;
              }
            }
            // When creating/editing assessment, the question key answer is already ensured not empty.
            // Because of that, questions[i].answer.length certainly is not 0.
            weight_accumulator += 1 * weights.shorttext;
            point_accumulator +=
              (weights.shorttext * temp_correct) / questions[i].answer.length;
          }
        }
        let score = (100 * point_accumulator) / weight_accumulator;
        grades.set(studentId, {
          total_grade: parseFloat(score.toFixed(1)),
          longtext_grades: null,
        });

        assessmentData.grades = grades;
      } // If there is a long text question, the final score will not be counted first until every long text question answer for a student already graded.
      assessmentData.submissions = submissions;
      assessmentData.submissions_timestamp = submissions_timestamp;

      return assessmentData.save();
    })
    .then((ass) => {
      console.log("Submit Assessment completed");
      return res.json(ass);
    })
    .catch((err) => {
      console.error("Submit Assessment failed");
      console.error(err);
      return res.status(400).send(err);
    });
});

router.get("/viewall/:unitId", (req, res) => {
  let { unitId } = req.params;
  if (!unitId) {
    return res.json([]);
  }
  Assessment.find({ unit: unitId })
    .lean()
    .then((assessments) => {
      if (!assessments.length) {
        throw "Assessments are not found";
      }
      console.log("Hasil assessments: ", assessments);
      return res.json(assessments);
    })
    .catch((err) => {
      console.error("View all assessments failed");
      console.error(err);
      return res.status(400).json(err);
    });
});

router.get("/view/:id", (req, res) => {
  let id = req.params.id;
  Assessment.findById(id)
    .lean()
    .then((assessment) => {
      if (!assessment) {
        throw "Assessment is not found";
      }
      console.log("View Assessment completed");
      if (assessment.posted === null) {
        res.json({
          ...assessment,
          posted: new Date() >= new Date(assessment.post_date),
        });
      } else {
        res.json(assessment);
      }
    })
    .catch((err) => {
      console.error("View Assessment failed");
      console.error(err);
      return res.status(400).json(err);
    });
});

router.delete("/delete/:id", (req, res) => {
  let id = req.params.id;

  Assessment.findByIdAndRemove(id)
    .then((assessment) => {
      if (!assessment) throw "Quiz to be deleted not found";
      return res.json(assessment);
    })
    .catch((err) => {
      console.error("Delete task failed");
      console.error(err);
      return res.status(400).json(err);
    });
});

router.get("/view", (req, res) => {
  const { subjectId, classId, type } = req.query;
  let query = {};
  if (subjectId) {
    query.subject = subjectId;
  }
  if (classId) {
    query.class_assigned = { $elemMatch: { $eq: classId } };
  }
  if (type === "Kuis" || type === "Ujian") {
    query.type = type;
  }

  Assessment.find(query)
    .lean()
    .then((assessments) => {
      console.log("View Assessment completed");
      if (assessments.length === 0) {
        console.log("Assessments are empty");
        return res.json(assessments);
      }
      return res.json(
        assessments.map((assessment) => {
          if (assessment.posted === null) {
            return {
              ...assessment,
              posted: new Date() >= new Date(assessment.post_date),
            };
          } else {
            return assessment;
          }
        })
      );
    })
    .catch((err) => {
      console.error("View assessment failed");
      console.error(err);
      return res.status(400).json(err);
    });
});

router.put("/suspects/:assessmentId", (req, res) => {
  Assessment.findById(req.params.assessmentId)
    .then((assessmentData) => {
      if (!assessmentData) {
        throw "Assessment data is not found";
      }
      assessmentData.suspects = req.body;
      return assessmentData.save();
    })
    .then((assessment) => {
      console.log("Get Suspects completed");
      return res.json(assessment);
    })
    .catch((err) => {
      console.error("Get suspects failed");
      console.error(err);
      return res.status(400).send(err);
    });
});

router.put("/grades", (req, res) => {
  Assessment.findById(req.body.assessmentId, (err, assessmentData) => {
    if (!assessmentData) {
      throw "Assessment data is not found";
    } else {
      let questions = assessmentData.questions;
      let weights = assessmentData.question_weight;
      let { studentId, questionIdx, longtextGrade } = req.body;

      let longtextQstCount = 0;
      questions.forEach((qst) => {
        if (qst.type === "longtext") {
          longtextQstCount++;
        }
      });

      let newLtGrades;
      let grades;
      // When an assessment is made for the first time, it won't have this attribute.
      // If this student is the first graded student,
      if (!assessmentData.grades) {
        newLtGrades = {};
        grades = new Map();
      } else {
        // If this student is not the first graded student,
        grades = new Map(assessmentData.grades);

        // If all long text answer question of a student is not yet graded, grades attribute in assessment will not save that student's data.
        // If long text answer of this student has not been graded yet (This is the first long text question score that is gained).
        if (!assessmentData.grades.has(studentId)) {
          newLtGrades = {};
        } else {
          newLtGrades = assessmentData.grades.get(studentId).longtext_grades;
        }
      }
      newLtGrades[questionIdx] = longtextGrade;

      if (longtextQstCount === Object.keys(newLtGrades).length) {
        // If all of long text question is already graded, count the final score for this student.

        let answers = assessmentData.submissions.get(studentId);
        let point_accumulator = Object.values(newLtGrades).reduce(
          (accumulator, currval) => accumulator + currval
        );
        let weight_accumulator = Object.values(weights.longtext).reduce(
          (accumulator, currval) => accumulator + currval
        );

        for (let i = 0; i < questions.length; i++) {
          // answers.length is already ensured same with questions.length in ViewAssessmentStudent.js.
          // answers[i] is the student's answer for question-(i + 1), for example answer[0] is the student's answer for the first question.
          // questions[i].answer is the key answer for question-(i + 1).
          // answers dan questions[i].answer are array of array.
          if (questions[i].type === "radio") {
            if (questions[i].answer[0] === answers[i][0]) {
              point_accumulator += 1 * weights.radio;
            }
            weight_accumulator += 1 * weights.radio;
          } else if (questions[i].type === "checkbox") {
            let temp_correct = 0;

            answers[i].forEach((student_answer) => {
              if (questions[i].answer.includes(student_answer)) {
                temp_correct = temp_correct + 1;
              } else {
                temp_correct = temp_correct - 2;
              }
            });
            weight_accumulator += 1 * weights.checkbox;

            if (temp_correct > 0) {
              // When creating/editing assessment, the question key answer is already ensured not empty.
              // Because of that, questions[i].answer.length certainly is not 0.
              point_accumulator +=
                (weights.checkbox * temp_correct) / questions[i].answer.length;
            }
          } else if (questions[i].type === "shorttext") {
            let temp_correct = 0;
            for (let j = 0; j < questions[i].answer.length; j++) {
              if (answers[i][j] === questions[i].answer[j]) {
                temp_correct++;
              }
            }

            // When creating/editing assessment, the question key answer is already ensured not empty.
            // Because of that, questions[i].answer.length certainly is not 0.
            weight_accumulator += 1 * weights.shorttext;
            point_accumulator +=
              (weights.shorttext * temp_correct) / questions[i].answer.length;
          }
        }

        let score = 0;
        score = (100 * point_accumulator) / weight_accumulator;
        grades.set(studentId, {
          total_grade: parseFloat(score.toFixed(1)),
          longtext_grades: newLtGrades,
        });
      } else {
        // If not all of the long text question is finished graded.
        grades.set(studentId, {
          total_grade: null,
          longtext_grades: newLtGrades,
        });
      }

      assessmentData.grades = grades;
      return assessmentData.save();
    }
  })
    .then((ass) => {
      console.log("Grade assessment completed");
      return res.json(ass);
    })
    .catch((err) => {
      console.error("Grade assessment failed");
      console.error(err);
      return res.status(400).send(err);
    });
});

router.get("/status/:id", (req, res) => {
  Assessment.findById(req.params.id)
    .then((assessment) => {
      if (!assessment) {
        throw "Assessment not found";
      }
      let now = new Date();
      let startDate = new Date(assessment.start_date);
      let endDate = new Date(assessment.end_date);
      let status;
      if (now < startDate) {
        status = -1;
      } else if (now >= startDate && now <= endDate) {
        status = 0;
      } else {
        // (now > endDate)
        status = 1;
      }
      return res.json({ status, now });
    })
    .catch((err) => {
      return res.status(400).json(err);
    });
});

router.post("/validity", (req, res) => {
  const { errors, isValid } = validateAssessmentInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  return res.status(200);
});

// Assessment Analytics
// Get the difficulty ranking of the questions.
router.get("/qnsDifficultyRanking/:id", async (req, res) => {
  let { id } = req.params;

  // Get the key answer first.
  const getKeyAnswers = new Promise((resolve, reject) => {
    Assessment.findById(id, (err, assessmentData) => {
      if (!assessmentData) reject("Assessment not found");
      else {
        let { questions } = assessmentData;
        let key_answers;
        if (Array.isArray(questions)) {
          key_answers = questions.map((qns) => qns.answer);
          resolve({
            assessmentData: assessmentData,
            key_answers: key_answers,
          });
        } else {
          reject("Question for this assessment is still empty");
        }
      }
    });
  });

  try {
    const result = await getKeyAnswers;
    const { key_answers, assessmentData } = result;
    // Then process the answers.
    let { submissions } = assessmentData;
    if (Object.keys(submissions).length == 0) {
      return res.status(404).json("Submission for this assessment is empty");
    } else {
      let submissions = assessmentData.submissions;
      const qns_length = assessmentData.questions.length;

      let correctCountByQns = [];
      for (var i = 0; i < qns_length; i++) {
        let correctCount = 0;
        for (const [key, val] of submissions.entries()) {
          console.log(val[i], key_answers[i]);
          if (val[i][0] == key_answers[i][0]) {
            correctCount += 1;
          }
        }
        correctCountByQns.push(correctCount);
      }
      let qns_ranking = correctCountByQns
        .map((val, ind) => {
          return { ind, val };
        })
        .sort((a, b) => {
          return a.val > b.val ? 1 : a.val == b.val ? 0 : -1;
        })
        .map((obj) => obj.ind + 1);

      // The results will the question numbers, from the hardest to easiest.
      console.log("Get qns difficulty completed");
      return res.json(qns_ranking);
    }
  } catch (err) {
    console.error("Get Qns Difficulty failed");
    console.error(err);
    return res.status(404).json(err);
  }
});
// router.get("/ansByStd")

module.exports = router;
