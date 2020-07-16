const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateClassInput(data) {
    let errors = {};

    // console.log(data.walikelas)
    // Convert empty fields to an empty strings so validator functions can be used
    data.name = isEmpty(data.name) ? "" : data.name;
    data.walikelas = isEmpty(data.walikelas) ? "" : data.walikelas;
    data.ukuran = isEmpty(data.ukuran) ? 0 : data.ukuran;

    // Name checks
    if (Validator.isEmpty(data.name)) {
        errors.name = "Name kelas belum diisi";
    }


    if (Object.keys(data.walikelas).length == 0) {
        errors.walikelas = "Wali kelas belum diisi" 
    }
    if (data.ukuran <= 0) {
        errors.ukuran = "Jumlah murid harus bernilai positif"
    }
    
    if (!Number.isInteger(data.ukuran)) {
        errors.ukuran = "Jumlah murid harus berupa bilangan bulat"
    }
    
    return {
        errors, 
        isValid: isEmpty(errors)
    };
}
