const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// const AutoIncrement = require("mongoose-sequence")(mongoose);
const FileAvatarSchema = new Schema(
  {
    filename: { type: String, required: true },
    s3_key: { type: String, required: true },
    s3_directory: { type: String },
    user_id: { type: ObjectId },
  },
  {
    timestamps: true,
  }
);

const FileAvatar = mongoose.model("fileAvatar", FileAvatarSchema);
module.exports = FileAvatar;
