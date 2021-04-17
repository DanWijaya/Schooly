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
      type: Object
    }
  })
);

module.exports = mongoose.model("Teacher");
