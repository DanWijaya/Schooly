const Validator = require("validator");
const isEmpty = require("is-empty");

function validateTaskGrade(data) {
  // The data is grade.
  let errors = {};
  if (isEmpty(data.grade)) {
    if (data.grade > 100 || data.grade < 0) {
      errors = { grade: "Nilai harus diantara 0 dan 100" };
    }
  }
  return {
    errors,
    isValidGrade: isEmpty(errors),
  };
}

function validateTaskInput(data) {
  let errors = {};
  data.name = isEmpty(data.name) ? "" : data.name;
  // data.deadline, there is no need?
  data.subject = isEmpty(data.subject) ? "" : data.subject;
  data.description = isEmpty(data.description) ? "" : data.description;
  data.grade = isEmpty(data.grade) ? "" : data.grade;
  data.deadline = isEmpty(data.deadline) ? "" : data.deadline;

  console.log(data.description, "Description");

  if (Validator.isEmpty(data.name)) {
    errors.name = "Nama tugas belum diisi";
  }

  if (Validator.isEmpty(data.subject)) {
    errors.subject = "Mata Pelajaran belum diisi";
  }

  if (Validator.isEmpty(data.description)) {
    errors.description = "Deskripsi belum diisi";
  }

  if (Validator.isEmpty(data.deadline)) {
    errors.deadline = "Batas waktu belum diisi";
  }

  console.log("Class assigned: ", data.class_assigned);
  if (data.class_assigned.length == 0) {
    errors.class_assigned = "Kelas yang ditujukan belum diisi";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
}

module.exports = {
  validateTaskGrade: validateTaskGrade,
  validateTaskInput: validateTaskInput,
};
