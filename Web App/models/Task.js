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
    filesubmitted: [{
        type: Schema.Types.ObjectId,
        default: null
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
    }]
    // ,grades: [{user_id : {type: String, default: ""}, 
    // nilai: {type: Number, default: 0}}]
    , grades: {
        type: Map,
        default: null // userId -> the score. 
    }
})

module.exports = Task = mongoose.model("tasks", TaskSchema);