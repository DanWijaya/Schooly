const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./User");
const { ObjectId } = require("mongodb");

const Teacher = User.discriminator(
  "Teacher",
  new mongoose.Schema({
    subject_teached: {
      type: [ObjectId],
      // required: true
    },
    class_teached: {
      type: [ObjectId],
    },
    class_to_subject: {
      type: Object,
    },
    unit: { type: ObjectId, ref: "units", default: null },
    // subject_teached: { type: [ObjectId], required: false },
    // class_teached: [{ type: Object, ref: "classes"}],
  })
);

module.exports = mongoose.model("Teacher");
