const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateSubjectInput(data) {
  let errors = {};
  // isEmpty method is used for string, so don't use it for class_assigned data bcs it is array.
  for (let key in Object.keys(data)) {
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
