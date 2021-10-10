const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateUnitInput(data) {
  let errors = {};
  console.log("Dari validation: ", data);
  // isEmpty method is used for string, so don't use it for class_assigned data bcs it is array.
  // data keys: name, subect, description, class_assigned, lampiran_materi

  for (let key of Object.keys(data)) {
    if (isEmpty(data[key])) {
      data[key] = "";
    }
  }

  if (Validator.isEmpty(data.name)) {
    errors.name = "Nama materi belum diisi";
  }

  if (Validator.isEmpty(data.description)) {
    errors.description = "Deskripsi belum diberikan";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
