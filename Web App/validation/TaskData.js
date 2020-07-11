const Validator = require("validator")
const isEmpty = require("is-empty");

module.exports = function validateTaskInput(data) {
    let errors = {}
    // isEmpty method is used for string, so don't use it for class_assigned data bcs it is array.
    data.name = isEmpty(data.name) ? "" : data.name;
    // data.deadline, there is no need?
    data.subject = isEmpty(data.subject) ? "" : data.subject;
    data.description = isEmpty(data.description) ? "" : data.description;
    data.grade = isEmpty(data.grade) ? "" : data.grade;
    data.deadline = isEmpty(data.deadline) ? "" : data.deadline;

    console.log(data.description, "Description")

    if (Validator.isEmpty(data.name)) {
        errors.name = "Nama tugas belum diisi"
    }

    if(Validator.isEmpty(data.subject)){
        errors.subject = "Mata Pelajaran belum diisi"
    }
    if(Validator.isEmpty(data.description)) {
        errors.description = "Deskripsi belum diisi"
    }
    if(Validator.isEmpty(data.deadline)){
        errors.deadline = "Batas waktu belum diisi"
    }
    if(!data.class_assigned.length) {
        errors.class_assigned = "Kelas yang ditujukan belum diisi"
    }
    if(data.grade > 100 && data.grade < 0){
        errors = { grade : "Nilai harus diantara 0 dan 100"}
    }

    if(!isEmpty(data.grade)){
        return {
            errors,
            isValid: isEmpty(errors)
        }
    }

    return{
        errors,
        isValid: isEmpty(errors)
    }
}
