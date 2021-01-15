const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateAssessmentInput(data) {
  let errors = {};
  data.name = isEmpty(data.name) ? "" : data.name;
  data.subject = isEmpty(data.subject) ? "" : data.subject;
  data.description = isEmpty(data.description) ? "" : data.description;
  data.type = isEmpty(data.type) ? "" : data.type;

  if (Validator.isEmpty(data.name)) {
    errors.name = "Nama belum diisi";
  }

  if (Validator.isEmpty(data.subject)) {
    errors.subject = "Mata Pelajaran belum diisi";
  }

  if (Validator.isEmpty(data.type)) {
    errors.type = "Tipe penilaian belum diisi";
  }

  if (Validator.isEmpty(data.description)) {
    errors.description = "Deskripsi belum diberikan";
  }

  if (!data.class_assigned.length) {
    errors.class_assigned = "Kelas yang ditujukan belum diisi";
  }
  if (!data.questions.length) {
    errors.questions = "Soal belum diberikan!";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
