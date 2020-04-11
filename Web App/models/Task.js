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
        type: Schema.Types.ObjectId,
        required: true
    }]
    
   
})

module.exports = Task = mongoose.model("tasks", TaskSchema);