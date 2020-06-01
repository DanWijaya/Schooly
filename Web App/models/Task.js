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
    }]

})

module.exports = Task = mongoose.model("tasks", TaskSchema);