const Validator = require("validator")
const isEmpty = require("is-empty");

module.exports = function validateTaskInput(data) {
    let errors = {}
    // isEmpty method is used for string, so don't use it for class_assigned data bcs it is array.
    data.name = isEmpty(data.name) ? "" : data.name;
    // data.deadline, there is no need? 
    data.subject = isEmpty(data.subject) ? "" : data.subject;

    if (Validator.isEmpty(data.name)) {
        errors.name = "Name field is required"
    }

    if (data.class_assigned.length == 0) {
        errors.class_assigned = "Class assigned field is required"
    }

    if(Validator.isEmpty(data.subject)){
        errors.subject = "Subject field is required"
    }
    console.log(data.class_assigned)
    console.log("AAA", errors)
    return{
        errors,
        isValid: isEmpty(errors)
    }
}
