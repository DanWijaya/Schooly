const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateAnnouncementInput(data) {
  let errors = {};

  // Convert empty fields to an empty strings so validator functions can be used.
  for (let key of Object.keys(data)) {
    if (isEmpty(data[key])) {
      data[key] = ""; // data keys are title, description, and to.
    }
  }

  // Name checks
  if (Validator.isEmpty(data.title)) {
    errors.title = "Nama Pengumuman belum diisi";
  }

  if (Validator.isEmpty(data.description)) {
    errors.description = "Deskripsi Pengumuman belum diisi";
  }

  if (!data.class_assigned.length) {
    errors.class_assigned = "Kelas yang ditujukan belum diisi";
  }

  if (!data.to.length) {
    errors.to = "Peran yang ditujukan belum diisi";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
