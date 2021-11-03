const { ObjectId } = require("mongodb"); // API from mongoose MongoDB
const mongoose = require("mongoose"); // Require Mongoose
const Schema = mongoose.Schema; // Define a Schema

// Create Task Schema
const TaskSchema = new Schema(
  {
    name: {
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
    class_assigned: [
      {
        type: ObjectId,
        required: true,
      },
    ],
    subject: {
      type: ObjectId,
      required: true,
    },
    person_in_charge_id: {
      type: ObjectId,
      required: true,
    },
    lampiran: [
      {
        type: Object,
        default: [],
      },
    ],
    deadline: {
      type: Date,
      required: [true, "The task has no deadline?"],
    },
    grades: {
      type: Map,
      default: new Map(), // userId - score.
    },
    // submissions: {
    //     type: Map,
    //     default: new Map()
    //     //submissions berupa user_id -> Object
    //     //Objectnya berupa object dengan key-pair (file id, file name)
    // }
    comments: [
      {
        author_id: {
          type: ObjectId,
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        edited: {
          type: Boolean,
          default: false,
        },
        createdAt: {
          type: Date,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const Task = mongoose.model("tasks", TaskSchema);
module.exports = Task;
