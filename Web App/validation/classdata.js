const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateRegisterInput(data) {
    let errors = {};

    // Convert empty fields to an empty strings so validator functions can be used
    data.name = isEmpty(data.name) ? "" : data.name;
    data.walikelas = isEmpty(data.walikelas) ? "" : data.walikelas;
    data.ukuran = isEmpty(data.ukuran) ? 0 : data.ukuran;

    // Name checks
    if (Validator.isEmpty(data.name)) {
        errors.name = "Name field is required";
    }

    // Kedepannya, Walikelas harus pakai Object guru. 
    if(Validator.isEmpty(data.walikelas)) {
        errors.walikelas = "Waliklas field is required" 
    } 

    if(data.ukuran <= 0) {
        errors.ukuran = "Class size must be positive"
    }

    return {
        errors, 
        isValid: isEmpty(errors)
    };
}