const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = require("mongoose");

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
        type: ObjectId,
        required: true
    },
    class_assigned: [{
        type: ObjectId,
        required: true
    }],
    person_in_charge_id: {
        type: ObjectId,
        required: true
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
