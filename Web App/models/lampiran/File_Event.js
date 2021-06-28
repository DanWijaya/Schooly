const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = require("mongodb");

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

// DocumentSchema.plugin(AutoIncrement, { inc_field: "document_id" });

const FileEvent = mongoose.model("file_events", FileEventSchema);
module.exports = FileEvent;
