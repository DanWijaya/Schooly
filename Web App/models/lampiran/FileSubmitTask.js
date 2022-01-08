const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// const AutoIncrement = require("mongoose-sequence")(mongoose);
const FileSubmitTaskSchema = new Schema(
  {
    filename: { type: String, required: true },
    s3_key: { type: String, required: true },
    s3_directory: { type: String },
    task_id: { type: ObjectId },
    author_id: { type: ObjectId },
    on_time: { type: Boolean, required: true },
  },
  {
    // createdAt,updatedAt fields are automatically added into records
    timestamps: true,
  }
);

const FileSubmitTask = mongoose.model("fileSubmitTasks", FileSubmitTaskSchema);

module.exports = FileSubmitTask;
