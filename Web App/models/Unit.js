const { ObjectId } = require("mongodb"); // API from mongoose MongoDB
const mongoose = require("mongoose"); // Require Mongoose
const Schema = mongoose.Schema; // Define a Schema

// Create Unit Schema
const UnitSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: null,
    },
  },
  { timestampes: true }
);

const Unit = mongoose.model("units", UnitSchema);
module.exports = Unit;
