const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateUserImport(data) {
  let errors = {};

  // Convert empty fields to an empty string so we can use validator functions
  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.phone = !isEmpty(data.phone) ? data.phone : "";
  data.emergency_phone = !isEmpty(data.emergency_phone)
    ? data.emergency_phone
    : "";
  data.address = !isEmpty(data.address) ? data.address : "";
  data.role = !isEmpty(data.role) ? data.role : "";

  // Name checks
  if (Validator.isEmpty(data.name)) {
    errors.name = "Nama belum diisi";
  }

  // Email checks
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email belum diisi";
  } else if (!Validator.isEmail(data.email)) {
    errors.email = "Email tidak benar";
  }

  //Role checks
  if (Validator.isEmpty(data.role)) {
    errors.role = "Peran belum diisi";
  }

  // Check for student class field
  if (data.role === "MockStudent" && Validator.isEmpty(data.kelas)) {
    errors.kelas = "Kelas belum dipilih";
  }
  if (data.role === "MockTeacher" && Validator.isEmpty(data.subject_teached)) {
    errors.subject_teached = "Mata pelajaran belum dipilih";
  }

  // Phone checks
  if (Validator.isEmpty(data.phone)) {
    errors.phone = "Nomor telepon belum diisi";
  }

  // Emergency phone checks
  if (Validator.isEmpty(data.emergency_phone)) {
    errors.emergency_phone = "Nomor telepon darurat belum diisi";
  }

  // Address checks
  if (Validator.isEmpty(data.address)) {
    errors.address = "Alamat belum diisi";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
