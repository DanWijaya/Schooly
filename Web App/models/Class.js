const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ClassSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  walikelas: {
      type: String,
      required: true
  },
  ukuran: {
    type: Number,
    required: true
  },
  nihil: {
      type: Boolean,
      default: true
  }
});

module.exports = Class = mongoose.model("class", ClassSchema);
