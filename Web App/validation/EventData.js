const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateEventInput(data) {
  let errors = {};

  for (let key of Object.keys(data)) {
    if (isEmpty(data[key])) {
      data[key] = "";
    }
  }

  if (Validator.isEmpty(data.name)) {
    errors.name = "Nama Kegiatan belum diisi";
  }

  if (Validator.isEmpty(data.start_date)) {
    errors.start_date_submission = "Waktu mulai Kegiatan belum diisi";
  }
  
  if (Validator.isEmpty(data.end_date)) {
    errors.end_date_submission = "Waktu selesai Kegiatan belum diisi";
  }

  // jika to berisi array kosong, atribut ini tidak akan direplace dengan "".
  // dengan menggunakan length, array kosong dan string kosong akan bisa dihandle sekaligus
  if (!data.to.length) {
    errors.to = "Pihak penerima Kegiatan belum diisi";
  }

  if (Validator.isEmpty(data.description)) {
    errors.description = "Deskripsi Kegiatan belum diisi";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };

}