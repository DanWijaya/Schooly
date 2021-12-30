const Validator = require("validator");
const isEmpty = require("is-empty");

function validateRegisterInput1(data) {
  let errors = {};

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

  // Password checks the error message too long sometimes.
  if (Validator.isEmpty(data.password)) {
    errors.password = "Kata sandi belum diisi";
  } else {
    if (data.password.length < 8) {
      errors.password = "Kata sandi wajib memiliki 8 karakter atau lebih";
    } else if (!Validator.isStrongPassword(data.password, { minSymbols: 0 })) {
      errors.password =
        "Kata sandi wajib memiliki minimal 1 huruf kecil, 1 huruf besar dan 1 angka.";
    }
  }

  // Password confirmation checks
  if (Validator.isEmpty(data.password2)) {
    errors.password2 = "Konfirmasi kata sandi belum diisi";
  }

  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = "Kata sandi dan konfirmasinya harus sama";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
}

async function validateRegisterInput2(data) {
  let errors = {};
  // Convert empty fields to an empty string so we can use validator functions
  // data keys: name
  //  email
  //  role
  //  subject_teached
  //  phone
  //  emergency_phone
  //  address
  //  password
  //  password2
  //  tanggal_lahir

  for (let key of Object.keys(data)) {
    if (isEmpty(data[key])) {
      data[key] = "";
    }
  }

  // Role checks
  if (Validator.isEmpty(data.role)) {
    errors.role = "Peran belum diisi";
  }

  // Phone checks
  if (Validator.isEmpty(data.phone)) {
    errors.phone = "Nomor telepon belum diisi";
  } else {
    if (!Validator.isNumeric(data.phone)) {
      errors.phone = "Nomor telepon harus berupa angka semua";
    }
  }

  // Emergency phone checks
  if (Validator.isEmpty(data.emergency_phone)) {
    errors.emergency_phone = "Nomor telepon darurat belum diisi";
  } else {
    if (!Validator.isNumeric(data.emergency_phone)) {
      errors.emergency_phone = "Nomor telepon harus berupa angka semua";
    }
  }

  // Address checks
  if (Validator.isEmpty(data.address)) {
    errors.address = "Alamat belum diisi";
  }

  // Birth date checks
  if (!data.tanggal_lahir) {
    errors.tanggal_lahir = "Tanggal lahir belum diisi";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
}

module.exports = { validateRegisterInput1, validateRegisterInput2 };
