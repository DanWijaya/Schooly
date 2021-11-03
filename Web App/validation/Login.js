const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateLoginInput(data) {
  let errors = {};

  // Convert empty fields to an empty string so we can use validator functions
  for (let key of Object.keys(data)) {
    if (isEmpty(data[key])) {
      data[key] = ""; // data keys are email and password.
    }
  }

  // Email checks
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email belum diisi";
  } else if (!Validator.isEmail(data.email)) {
    errors.email = "Email tidak benar";
  }
  
  // Password checks
  if (Validator.isEmpty(data.password)) {
    errors.password = "Kata sandi belum diisi";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
