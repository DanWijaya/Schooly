const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateRegisterInput(data) {
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
  // else {
  //   // Specific to Teacher
  //   if (data.role === "Teacher") {
  //     if (Validator.isEmpty(data.subject_teached)) {
  //       errors.subject_teached = "Mata pelajaran belum dipilih";
  //     }
  //   }
  // }

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

  // Password checks error messagenya terlalu panjang kadang kadang
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

  //Password confirmation checks
  if (Validator.isEmpty(data.password2)) {
    errors.password2 = "Konfirmasi kata sandi belum diisi";
  }

  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = "Kata sandi dan konfirmasinya harus sama";
  }

  //tanggal lahir checks
  if (!data.tanggal_lahir) {
    errors.tanggal_lahir = "Tanggal lahir belum diisi";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
