const { ObjectId } = require("mongodb"); // API from mongoose MongoDB
const mongoose = require("mongoose"); // Require Mongoose
const Schema = mongoose.Schema; // Define a Schema

// Create Subject Schema
const SubjectSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  unit: {
    type: ObjectId,
    default: null,
  },
});

module.exports = Subject = mongoose.model("subjects", SubjectSchema);
