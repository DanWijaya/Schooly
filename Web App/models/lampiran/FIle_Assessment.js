const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = require("mongodb");

// const AutoIncrement = require("mongoose-sequence")(mongoose);
const FileAssessmentSchema = new Schema(
    {
      filename: { type: String, required: true },
      s3_key: { type: String, required: true},
      s3_directory: { type: String},
      assessment_id : { type: ObjectId }
    },
    {
      timestamps: true
    }
  );
  
  // DocumentSchema.plugin(AutoIncrement, { inc_field: "document_id" });
  
  const FileAssessment = mongoose.model("file_assessment", FileAssessmentSchema);
  module.exports = FileAssessment

