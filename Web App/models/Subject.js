const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Subject Schema 
const SubjectSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    all_class: {
        type: Boolean,
        default: true
    }
})

module.exports = Subject = mongoose.model("subjects", SubjectSchema)