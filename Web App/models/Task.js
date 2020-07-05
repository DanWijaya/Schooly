const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Task Schema
const TaskSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    deadline: {
        type: Date,
        required: [true, "The task has no deadline?"]
    },
    subject: {
        type: String,
        required: true
    },
    class_assigned: [{
        type: Object,
        required: true
    }],
    person_in_charge_id: {
        type: String,
        default: ""
    },
    description: {
        type: String,
        required: true
    },
    lampiran: [{
        type: Object,
        default: []
    }],
    grades: {
        type: Map,
        default: null // userId -> the score.
    }
})

module.exports = Task = mongoose.model("tasks", TaskSchema);
