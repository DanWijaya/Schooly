const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateEventInput(data) {
  let errors = {};

  for (let key of Object.keys(data)) {
    if (isEmpty(data[key])) {
      data[key] = "";
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

  // If to contains an empty array, this attribute will not be replaced with "".
  // When using length, empty array and empty string can be handled simultenaously.
  if (!data.to.length) {
    errors.to = "Pihak penerima belum diisi";
  }

  // if (Validator.isEmpty(data.description)) {
  //   errors.description = "Deskripsi belum diisi";
  // }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
