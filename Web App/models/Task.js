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
    },
    submitted: {
        type: Boolean,
        default: false,
    },
   
})

module.exports = Task = mongoose.model("tasks", TaskSchema);