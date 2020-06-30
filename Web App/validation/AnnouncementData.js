const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateAnnouncementInput(data) {
    let errors = {};

    // Convert empty fields to an empty strings so validator functions can be used
    data.title = isEmpty(data.title) ? "" : data.title;
    data.description = isEmpty(data.description) ? "" : data.description;

    // Name checks
    if (Validator.isEmpty(data.title)) {
        errors.name = "Name Pengumuman belum diisi";
    }

    if(Validator.isEmpty(data.description)) {
        errors.ukuran = "Deskripsi Pengumuman belum diisi"
    }

    return {
        errors, 
        isValid: isEmpty(errors)
    };
}