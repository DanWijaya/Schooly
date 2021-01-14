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

  // ini semestinya bakal dihapus
  ukuran: {
    type: Number,
    required: true
  },

  nihil: {
      type: Boolean,
      default: true
  },

  /* 
  implementasi sekarang:
  - ketua_kelas, bendahara, dan sekretaris bisa 1 orang yang sama
  - field ketua_kelas, bendahara, dan sekretaris akan dihapus ketika admin memindahkan murid yang bersangkutan ke kelas lain.
  */
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
