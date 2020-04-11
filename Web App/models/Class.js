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
  }, 
  ketua_kelas: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  bendahara: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  sekretaris: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  semua_murid : [{
    type: Schema.Types.ObjectId,
    ref: "users"
  }]

});

module.exports = Class = mongoose.model("class", ClassSchema);
