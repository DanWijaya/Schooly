const { ObjectId } = require("mongodb"); // API from mongoose MongoDB
const mongoose = require("mongoose"); // Require Mongoose
const Schema = mongoose.Schema; // Define a Schema

// Create Announcement Schema
const AnnoucementSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    unit: {
      type: ObjectId,
      default: null,
    },
    lampiran: [
      {
        type: Object,
        default: [],
      },
    ],

    // If it is made by administrator, this array contain one element which is null.
    // Added null so that doesn't need to check role author_id during validation.
    class_assigned: [
      {
        type: ObjectId,
      },
    ],
    author_id: {
      type: ObjectId,
      required: true,
    },

    // Element in this array is either "Student" or "Teacher".
    to: {
      type: [String],
      validate: [
        (value) => {
          return value.length > 0;
        },
        "Pihak penerima tidak boleh kosong",
      ],
    },
  },
  { timestamps: true }
);

const Announcement = mongoose.model("announcements", AnnoucementSchema);
module.exports = Announcement;
