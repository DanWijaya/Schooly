const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// const AutoIncrement = require("mongoose-sequence")(mongoose);
const FileAnnouncementSchema = new Schema(
  {
    filename: { type: String, required: true },
    s3_key: { type: String, required: true },
    s3_directory: { type: String },
    announcement_id: { type: ObjectId },
  },
  {
    timestamps: true,
  }
);

const FileAnnouncement = mongoose.model(
  "fileAnnouncements",
  FileAnnouncementSchema
);
module.exports = FileAnnouncement;
