const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./User");
const { ObjectId } = require("mongodb");

const Teacher = User.discriminator("Teacher", new mongoose.Schema({
    subject_teached: { type: Object, required: true},
    // class_teached: [{ type: Object, ref: "classes"}],
}),
);

module.exports = mongoose.model("Teacher");