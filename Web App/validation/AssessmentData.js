const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateAssessmentInput(data) {
  let errors = {};
  
  console.log(data);
  for (let key of Object.keys(data)) {
    if (key !== "posted") {
      if (isEmpty(data[key])) {
        data[key] = ""; // data keys are name, subject, description, and type.
      }
    }
  }

  if (Validator.isEmpty(data.name)) {
    errors.name = "Nama belum diisi";
  }

  if (Validator.isEmpty(data.start_date)) {
    errors.start_date_custom = "Waktu mulai belum diisi";
  }

  if (Validator.isEmpty(data.end_date)) {
    errors.end_date_custom = "Waktu selesai belum diisi";
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
