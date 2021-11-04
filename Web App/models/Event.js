const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Event Schema
const EventSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    unit: {
      type: ObjectId,
      default: null,
    },
    author_id: {
      type: ObjectId,
      required: true,
    },
    location: {
      type: String,
    },
    start_date: {
      type: Date,
      required: true,
    },
    end_date: {
      type: Date,
      required: true,
    },
    to: {
      type: [String],
      validate: [
        (value) => {
          return value.length > 0;
        },
        "Pihak penerima tidak boleh kosong",
      ],
    },
    // Element in this array has the value either "Student", "Teacher", or "Administrator".
  },
  { timestamps: true }
);

module.exports = mongoose.model("events", EventSchema);
