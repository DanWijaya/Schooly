const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateAssessmentInput(data) {
  let errors = {};
  // data keys: name, subject, description, type

  for (let key in Object.keys(data)) {
    if (isEmpty(data[key])) {
      data[key] = "";
    }
  }
  
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
