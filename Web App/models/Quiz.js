const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = require("mongodb");

// Create MaterialSchema
const QuizSchema = new Schema({ 
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
    problems: [{
        question: {type: String, required: true},
        options: [{ type: String, required: true }],
        answerIndex: {type: Number, required: true}
    }]
})

module.exports = Quiz = mongoose.model("quizzes", QuizSchema);