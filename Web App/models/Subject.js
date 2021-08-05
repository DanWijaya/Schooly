const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = require("mongodb");

// Create Subject Schema
const SubjectSchema = new Schema({
  unit: {
    type: ObjectId,
    default: null
  },
  name: {
    type: String,
    required: true,
  },
});

module.exports = Subject = mongoose.model("subjects", SubjectSchema);
