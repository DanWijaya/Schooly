const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateMaterialInput(data) {
  let errors = {};
  console.log("Dari validation: ", data);
  // isEmpty method is used for string, so don't use it for class_assigned data bcs it is array.
  data.name = isEmpty(data.name) ? "" : data.name;
  // data.deadline, there is no need?
  data.subject = isEmpty(data.subject) ? "" : data.subject;
  data.description = isEmpty(data.description) ? "" : data.description;

  console.log(data.class_assigned);
  if (Validator.isEmpty(data.name)) {
    errors.name = "Nama materi belum diisi";
  }

  if (Validator.isEmpty(data.subject)) {
    errors.subject = "Mata Pelajaran belum diisi";
  }
  if (Validator.isEmpty(data.description)) {
    errors.description = "Deskripsi belum diberikan";
  }
  if (!data.class_assigned.length) {
    errors.class_assigned = "Kelas yang ditujukan belum diisi";
  }
  if (!data.lampiran.length) {
    errors.lampiran_materi = "Lampiran belum ditambahkan ke Materi";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
