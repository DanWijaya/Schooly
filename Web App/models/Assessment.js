const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = require("mongodb");

// Create AssessmentSchema
const AssessmentSchema = new Schema({ 
    name: {
        type: String, 
        required: true
    },
    class_assigned: [{
        type: ObjectId,
        required: true
    }],
    author_id: {
        type: ObjectId,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    subject: {
      type: ObjectId,
      required: true
    },
    start_date: {
      type: Date,
      required: true
    },
    end_date: {
      type: Date,
      required: true
    },
    questions: [{
        name: {type: String, required: true},
        options: [{ type: String, required: true }],
        answer: {type: String, required: true}
    }]
})

module.exports = Assessment = mongoose.model("assessments", AssessmentSchema);