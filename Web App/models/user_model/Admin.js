const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./User");

const Admin = User.discriminator(
  "Admin",
  new mongoose.Schema({
    full_access: { type: Boolean, default: true },
    // class_teached: [{ type: Object, ref: "classes"}],
  })
);

module.exports = mongoose.model("Admin");
