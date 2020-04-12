const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ClassSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  walikelas: {
      type: Object,
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
    type: Object,
    ref: "users"
  },
  bendahara: {
    type: Object,
    ref: "users"
  },
  sekretaris: {
    type: Object,
    ref: "users"
  },
  semua_murid : [{
    type: Object,
    ref: "users"
  }]

});

module.exports = Class = mongoose.model("class", ClassSchema);
