const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateClassInput(data) {
  let errors = {};

  // Convert empty fields to an empty strings so validator functions can be used.
  for (let key of Object.keys(data)) {
    if (isEmpty(data[key])) {
      data[key] = "";
      // data keys are name and wali_kelas.
    }
  }

  // Name checks
  if (Validator.isEmpty(data.name)) {
    errors.name = "Nama kelas belum diisi";
  }

  if (data.mata_pelajaran.length === 0) {
    errors.mata_pelajaran = "Mata pelajaran belum diisi";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
