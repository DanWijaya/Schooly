const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const MockUser = require("./MockUserModel");

const MockTeacher = MockUser.discriminator("Teacher", new mongoose.Schema({
    subject_teached: { type: String, required: true},
    // class_teached: [{ type: Object, ref: "classes"}],
}),
);

module.exports = mongoose.model("MockTeacher");