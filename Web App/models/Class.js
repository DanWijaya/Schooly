const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
const Schema = mongoose.Schema;

// Create Schema
const ClassSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  // 1 guru hanya boleh menjadi wali untuk 1 atau 0 kelas.
  // ini dipastikan saat pembuatan kelas (opsi wali kelas hanya akan berisi guru nonwali).
  walikelas: {
    type: ObjectId,
    // required: true
  },

  // ini semestinya bakal dihapus
  ukuran: {
    type: Number,
    required: true,
  },

  nihil: {
    type: Boolean,
    default: true,
  },

  /* 
  - ketua_kelas, bendahara, dan sekretaris bisa 1 orang yang sama
  - field ketua_kelas, bendahara, dan sekretaris akan dihapus ketika admin memindahkan murid yang bersangkutan ke kelas lain
  - ketua_kelas, bendahara, dan sekretaris tidak bisa disunting menjadi kosong
  */
  ketua_kelas: {
    type: ObjectId,
    ref: "users",
  },
  bendahara: {
    type: ObjectId,
    ref: "users",
  },
  sekretaris: {
    type: ObjectId,
    ref: "users",
  },

  subject_assigned: {
    type: [ObjectId],
  }
});

const Class = mongoose.model("class", ClassSchema);
module.exports = Class;