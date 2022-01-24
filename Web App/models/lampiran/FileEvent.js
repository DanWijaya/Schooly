const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// const AutoIncrement = require("mongoose-sequence")(mongoose);
const FileEventSchema = new Schema(
  {
    filename: { type: String, required: true },
    s3_key: { type: String, required: true },
    s3_directory: { type: String },
    event_id: { type: ObjectId },
  },
  {
    // createdAt,updatedAt fields are automatically added into records
    timestamps: true,
  }
);

const FileEvent = mongoose.model("fileEvents", FileEventSchema);
module.exports = FileEvent;
