const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = require("mongodb");

// Create MaterialSchema
const MaterialSchema = new Schema(
  {
    unit: {
      type: ObjectId,
      default: null,
    },
    name: {
      type: String,
      required: true,
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
    author_id: {
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
    comments: [
      {
        // nilai atribut "_id" (yang di-generate secara default) akan digunakan dalam penghapusan dan penyuntingan komentar
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

module.exports = Material = mongoose.model("materials", MaterialSchema);
