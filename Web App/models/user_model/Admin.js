const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./User");

const Admin = User.discriminator(
  "Admin",
  new mongoose.Schema({
    unit: { type: ObjectId, ref: "units", default: null },
    // class_teached: [{ type: Object, ref: "classes"}],
  })
);

module.exports = mongoose.model("Admin");
