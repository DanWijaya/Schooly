const { ObjectId } = require("mongodb"); // API from mongoose MongoDB
const mongoose = require("mongoose"); // Require Mongoose
const Schema = mongoose.Schema; // Define a Schema

// Create Class Schema
const ClassSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  // 1 Teacher can only be homeroom teacher for 1 or 0 class.
  // This is ensured when the class is created (homeroom teacher options only contains non homeroom teachers).
  walikelas: {
    type: ObjectId,
    // required: true
  },
  unit: {
    type: ObjectId,
    default: null,
  },
  unit: {
    type: ObjectId,
    ref: "units"
  },
  subject_assigned: {
    type: [ObjectId],
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
  /*
  - Class president, secretary, and treasurer can be the same person.
  - Class president, secretary, and treasurer field will be deleted if administrator move students with those roles to another class.
  - Class president, secretary, and treasurer can't be editted into empty.
  */
});

const Class = mongoose.model("class", ClassSchema);
module.exports = Class;
