const Validator = require("validator");
const isEmpty = require("is-empty");

function validateRegisterInput1(data) {
  let errors1 = {};

  // Name checks
  if (Validator.isEmpty(data.name)) {
    errors1.name = "Nama belum diisi";
  }

  // Email checks
  if (Validator.isEmpty(data.email)) {
    errors1.email = "Email belum diisi";
  } else if (!Validator.isEmail(data.email)) {
    errors1.email = "Email tidak benar";
  }

  // Password checks error messagenya terlalu panjang kadang kadang
  if (Validator.isEmpty(data.password)) {
    errors1.password = "Kata sandi belum diisi";
  } else {
    if (data.password.length < 8) {
      errors1.password = "Kata sandi wajib memiliki 8 karakter atau lebih";
    } else if (!Validator.isStrongPassword(data.password, { minSymbols: 0 })) {
      errors1.password =
        "Kata sandi wajib memiliki minimal 1 huruf kecil, 1 huruf besar dan 1 angka.";
    }
  }

  //Password confirmation checks
  if (Validator.isEmpty(data.password2)) {
    errors1.password2 = "Konfirmasi kata sandi belum diisi";
  }

  if (!Validator.equals(data.password, data.password2)) {
    errors1.password2 = "Kata sandi dan konfirmasinya harus sama";
  }

  return {
    errors1,
    isValid1: isEmpty(errors1)
  }
};

function validateRegisterInput2(data) {
  let errors2 = {};
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

  //Role checks
  if (Validator.isEmpty(data.role)) {
    errors2.role = "Peran belum diisi";
  }
  // else {
  //   // Specific to Teacher
  //   if (data.role === "Teacher") {
  //     if (Validator.isEmpty(data.subject_teached)) {
  //       errors2.subject_teached = "Mata pelajaran belum dipilih";
  //     }
  //   }
  // }

  // Phone checks
  if (Validator.isEmpty(data.phone)) {
    errors2.phone = "Nomor telepon belum diisi";
  } else {
    if (!Validator.isNumeric(data.phone)) {
      errors2.phone = "Nomor telepon harus berupa angka semua";
    }
  }

  // Emergency phone checks
  if (Validator.isEmpty(data.emergency_phone)) {
    errors2.emergency_phone = "Nomor telepon darurat belum diisi";
  } else {
    if (!Validator.isNumeric(data.emergency_phone)) {
      errors2.emergency_phone = "Nomor telepon harus berupa angka semua";
    }
  }

  // Address checks
  if (Validator.isEmpty(data.address)) {
    errors2.address = "Alamat belum diisi";
  }

  //tanggal lahir checks
  if (!data.tanggal_lahir) {
    errors2.tanggal_lahir = "Tanggal lahir belum diisi";
  }

  return {
    errors2,
    isValid2: isEmpty(errors2),
  };
};

module.exports = {validateRegisterInput1, validateRegisterInput2}