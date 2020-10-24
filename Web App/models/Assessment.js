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
        name: {type: String, required: true, default: ""},
        options: {type: [String]},
        answer: {type: String},
        lampiran: [{ type: ObjectId , default: [], _id: false}],
        type: {type: String, required: true}
    }],
    posted: { type: Boolean, required: true, default: false},
    grades: {
      type: Map
    },
    submissions:{
      type: Map, default: []
    },
    type: {
      type: String,
      required: true
    }
})

module.exports = Assessment = mongoose.model("assessments", AssessmentSchema);