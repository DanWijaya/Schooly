const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateEventInput(data) {
  let errors = {};

  for (let key in Object.keys(data)) {
    if (isEmpty(data[key])) {
      data[key] = "";
    }
  }

  if (Validator.isEmpty(data.name)) {
    errors.name = "Nama Kegiatan belum diisi";
  }

  if (Validator.isEmpty(data.description)) {
    errors.description = "Deskripsi Kegiatan belum diisi";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };

}