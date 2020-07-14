const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
const Schema = mongoose.Schema;

// Create Schema
const ClassSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  walikelas: {
      type: ObjectId,
      required: true
  },
  ukuran: {
    type: Number,
    required: true
  },
  nihil: {
      type: Boolean,
      default: true
  }, 
  ketua_kelas: {
    type: ObjectId,
    ref: "users"
  },
  bendahara: {
    type: ObjectId,
    ref: "users"
  },
  sekretaris: {
    type: ObjectId,
    ref: "users"
  },

});

module.exports = Class = mongoose.model("class", ClassSchema);
