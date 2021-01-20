const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const MockUser = require("./MockUserModel");

const MockAdmin = MockUser.discriminator(
  "MockAdmin",
  new mongoose.Schema({
    full_access: { type: Boolean, default: true },
    // class_teached: [{ type: Object, ref: "classes"}],
  })
);

module.exports = mongoose.model("MockAdmin");
