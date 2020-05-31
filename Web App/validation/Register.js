const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateRegisterInput(data) {
  let errors = {};

  // Convert empty fields to an empty string so we can use validator functions
  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.phone = !isEmpty(data.phone) ? data.phone : "";
  data.emergency_phone = !isEmpty(data.emergency_phone) ? data.emergency_phone : "";
  data.address = !isEmpty(data.address) ? data.address : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";

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

  // Phone checks
  if (Validator.isEmpty(data.phone)) {
    errors.phone = "Nomor telepon belum diisi"
  }

  // Emergency phone checks
  if (Validator.isEmpty(data.emergency_phone)) {
    errors.phone = "Nomor telepon darurat belum diisi"
  }

  // Emergency phone checks
  if (Validator.isEmpty(data.address)) {
    errors.address = "Alamat belum diisi"
  }

  // Password checks
  if (Validator.isEmpty(data.password)) {
    errors.password = "Kata sandi belum diisi";
  }

  if (Validator.isEmpty(data.password2)) {
    errors.password2 = "Konfirmasi kata sandi belum diisi";
  }

  if (!Validator.isEmpty(data.password) && !Validator.isLength(data.password, { min: 8, max: 30 })) {
      errors.password = "Kata sandi wajib memiliki 8 karakter atau lebih";
  }

  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = "Kata sandi harus sama";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};