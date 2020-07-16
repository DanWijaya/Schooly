const Validator = require("validator")
const isEmpty = require("is-empty");

module.exports = function validateSubjectInput(data) {
    let errors = {}
    // isEmpty method is used for string, so don't use it for class_assigned data bcs it is array.
    data.name = isEmpty(data.name) ? "" : data.name;

    if (Validator.isEmpty(data.name)) {
        errors.name = "Nama Mata pelajaran belum diisi"
    }

    return{
        errors,
        isValid: isEmpty(errors)
    }
}
