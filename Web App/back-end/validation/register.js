const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateRegisterInput(data) {
    let errors = {};

    // Converts empty fields to an empty string so we can use validatror functions 
    data.name = !isEmpty(data.name) ? data.name : "";
    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";
    data.password2 = !isEmpty(data.password2) ? data.password2 : "";

    //Validate name
    if (Validator.isEmpty(data.name)) {
        errors.name = "Name field is required";

    }

    // Validate Email
    if (Validator.isEmpty(data.email)){
        errors.email = "Email field is required"
    } else if (!Validator.isEmail(data.email)){
        errors.email = "Email is invalid"
    }

    // Validate Password
    if (Validator.isEmpty(data.password)){
        errors.password = "Password is required"; 
    }
    if(Validator.isEmpty(data.password2)){
        errors.password2 = "Confirm password field is required";
    }

    if(!Validator.isLength(data.password, {min: 8, max: 30})){
        errors.password = "Passsword must be at least 8 characters"
    }

    return {
        errors, 
        isValid: isEmpty(errors)
    };
};