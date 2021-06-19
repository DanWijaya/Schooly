const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateClassInput(data) {
  let errors = {};

  // console.log(data.walikelas)
  // Convert empty fields to an empty strings so validator functions can be used
  // data has:
  // name, walikelas
  for (let key in Object.keys(data)) {
    if (isEmpty(data[key])) {
      data[key] = "";
    }
  }

  // data.name = isEmpty(data.name) ? "" : data.name;
  // data.walikelas = isEmpty(data.walikelas) ? "" : data.walikelas;
  // data.ukuran = isEmpty(data.ukuran) ? 0 : Number(data.ukuran);

  // Name checks
  if (Validator.isEmpty(data.name)) {
    errors.name = "Nama kelas belum diisi";
  }

  // if (Validator.isEmpty(data.walikelas)) {
  //     errors.walikelas = "Wali kelas belum diisi"
  // }

  // if (Number.isInteger(data.ukuran)) {
  //   if (data.ukuran <= 0) {
  //     errors.ukuran = "Jumlah murid harus bernilai positif";
  //   }
  // } else {
  //   errors.ukuran = "Jumlah murid harus berupa bilangan bulat";
  // }

  if (data.mata_pelajaran.length === 0) {
    errors.mata_pelajaran = "Mata pelajaran belum diisi";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
