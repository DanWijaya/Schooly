const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// const AutoIncrement = require("mongoose-sequence")(mongoose);
const FileMaterialSchema = new Schema(
  {
    filename: { type: String, required: true },
    s3_key: { type: String, required: true },
    s3_directory: { type: String },
    material_id: { type: ObjectId },
  },
  {
    // createdAt,updatedAt fields are automatically added into records
    timestamps: true,
  }
);

// DocumentSchema.plugin(AutoIncrement, { inc_field: "document_id" });

const FileMaterial = mongoose.model("fileMaterials", FileMaterialSchema);
module.exports = FileMaterial;
