const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./User");

const Student = User.discriminator(
  "Student",
  new mongoose.Schema({
    kelas: { type: ObjectId, ref: "classes" },
    unit: { type: ObjectId, ref: "units", default: null },
  })
);

module.exports = mongoose.model("Student");
