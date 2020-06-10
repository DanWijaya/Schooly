const Validator = require("validator")
const isEmpty = require("is-empty");

module.exports = function validateTaskInput(data) {
    let errors = {}
    // isEmpty method is used for string, so don't use it for class_assigned data bcs it is array.
    data.name = isEmpty(data.name) ? "" : data.name;
    // data.deadline, there is no need? 
    data.subject = isEmpty(data.subject) ? "" : data.subject;
    data.description = isEmpty(data.description) ? "" : data.description;

    console.log(data.description, "Description")
    console.log(isEmpty(data.description))
    if (Validator.isEmpty(data.name)) {
        errors.name = "Nama tugas belum diisi"
    }

    // if (data.class_assigned.length == 0) {
    //     errors.class_assigned = "Kelas yang ditugaskan belum diisi"
    // }

    if(Validator.isEmpty(data.subject)){
        errors.subject = "Mata Pelajaran belum diisi"
    }
    if(Validator.isEmpty(data.description)) {
        errors.description = "Deskripsi belum diberikan"
    }

    console.log(data.class_assigned)
    console.log("AAA", errors)
    return{
        errors,
        isValid: isEmpty(errors)
    }
}
