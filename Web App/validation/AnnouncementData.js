const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateAnnouncementInput(data) {
  let errors = {};

  // Convert empty fields to an empty strings so validator functions can be used
  data.title = isEmpty(data.title) ? "" : data.title;
  data.description = isEmpty(data.description) ? "" : data.description;
  data.to = isEmpty(data.to) ? "" : data.to;

  // Name checks
  if (Validator.isEmpty(data.title)) {
    errors.title = "Name Pengumuman belum diisi";
  }

  if (Validator.isEmpty(data.description)) {
    errors.description = "Deskripsi Pengumuman belum diisi";
  }

  if (!data.class_assigned.length) {
    errors.class_assigned = "Kelas yang ditujukan belum diisi";
  }

  if (Validator.isEmpty(data.to)) {
    errors.to = "Peran yang ditujukan belum diisi";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
