const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateRegisterInput(data) {
  let errors = {};
  // Convert empty fields to an empty string so we can use validator functions

  for (let key in Object.keys(data)){
    if(!isEmpty(data[key])){
      data[key] = ""
    }
  }
 
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
  } else {
    // Specific to Teacher
    if (data.role === "Teacher") {
      if(Validator.isEmpty(data.subject_teached)){
        errors.subject_teached = "Mata pelajaran belum dipilih";
      }
    }
  }

  

  // Phone checks
  if (Validator.isEmpty(data.phone)) {
    errors.phone = "Nomor telepon belum diisi";
  } else{
    if(!Validator.isNumeric(data.phone)){
      errors.phone = "Nomor telepon harus berupa angka semua"
    }
  }

  // Emergency phone checks
  if (Validator.isEmpty(data.emergency_phone)) {
    errors.emergency_phone = "Nomor telepon darurat belum diisi";
  } else{
    if(!Validator.isNumeric(data.emergency_phone)){
      errors.emergency_phone = "Nomor telepon harus berupa angka semua"
    }
  }

  // Address checks
  if (Validator.isEmpty(data.address)) {
    errors.address = "Alamat belum diisi";
  }

  // Password checks
  if (Validator.isEmpty(data.password)) {
    errors.password = "Kata sandi belum diisi";
  }

  if (Validator.isEmpty(data.password2)) {
    errors.password2 = "Konfirmasi kata sandi belum diisi";
  }

  if (
    !Validator.isEmpty(data.password) &&
    !Validator.isLength(data.password, { min: 8, max: 30 })
  ) {
    errors.password = "Kata sandi wajib memiliki 8 karakter atau lebih";
  }

  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = "Kata sandi harus sama";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
