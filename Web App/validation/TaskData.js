const Validator = require("validator")
const isEmpty = require("is-empty");

module.exports = function validateTaskInput(data) {
    let errors = {}

    data.name = isEmpty(data.name) ? "" : data.name;
    // data.deadline , there is no need? 
    data.subject = isEmpty(data.subject) ? "" : data.subject;

    if (Validator.isEmpty(data.name)) {
        errors.name = "Name field is required"
    }

    if(Validator.isEmpty(data.subject)){
        errors.subject = "Subject field is required"
    }

    return{
        errors,
        isValid: isEmpty(errors)
    }
}