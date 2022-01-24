const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// const AutoIncrement = require("mongoose-sequence")(mongoose);
const FileAssessmentSchema = new Schema(
  {
    filename: { type: String, required: true },
    s3_key: { type: String, required: true },
    s3_directory: { type: String },
    assessment_id: { type: ObjectId },
  },
  {
    timestamps: true,
  }
);

const FileAssessment = mongoose.model("fileAssessments", FileAssessmentSchema);
module.exports = FileAssessment;
