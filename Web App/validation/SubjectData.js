const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateSubjectInput(data) {
  let errors = {};
  // isEmpty method is used for string, so don't use it for class_assigned data because it is an array.
  for (let key of Object.keys(data)) {
    if (isEmpty(data[key])) {
      data[key] = "";
    }
  }

  if (Validator.isEmpty(data.name)) {
    errors.name = "Nama Mata pelajaran belum diisi";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
