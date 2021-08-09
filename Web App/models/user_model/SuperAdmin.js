const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./User");

const SuperAdmin = User.discriminator(
  "SuperAdmin",
  new mongoose.Schema({
    full_access: { type: Boolean, default: true },
    // class_teached: [{ type: Object, ref: "classes"}],
  })
);

module.exports = mongoose.model("SuperAdmin");
