const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = require("mongodb");

// Create Task Schema
const TaskSchema = new Schema(
  {
    unit: {
      type: ObjectId,
      default: null
    },  
    name: {
      type: String,
      required: true,
    },
    deadline: {
      type: Date,
      required: [true, "The task has no deadline?"],
    },
    subject: {
      type: ObjectId,
      required: true,
    },
    class_assigned: [
      {
        type: ObjectId,
        required: true,
      },
    ],
    person_in_charge_id: {
      type: ObjectId,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    lampiran: [
      {
        type: Object,
        default: [],
      },
    ],
    grades: {
      type: Map,
      default: new Map(), // userId -> the score.
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
          required: true 
        },
        content: { 
          type: String,
          required: true
        },
        edited: {
          type: Boolean,
          default: false
        },
        createdAt: {
          type: Date,
          required: true
        }
      },
    ],
  },
  
  { timestamps: true }
);

const Task = mongoose.model("tasks", TaskSchema);
module.exports = Task;
