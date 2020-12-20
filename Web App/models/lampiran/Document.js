const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AutoIncrement = require("mongoose-sequence")(mongoose);

const DocumentSchema = new Schema(
  {
    // document_id: { type: Number, default: 0 },
    // description: { type: String },
    filename: { type: String, required: true },
    s3_key: { type: String, required: true},
    s3_directory: { type: String}
  },
  {
    // createdAt,updatedAt fields are automatically added into records
    timestamps: true
  }
);

DocumentSchema.plugin(AutoIncrement, { inc_field: "document_id" });

const Document = mongoose.model("documents", DocumentSchema);
module.exports = Document

/* The mongoose-sequence creates a commodity collection named 'counters' which keeps track of the auto-incremental number. So during development to reset the go_id back to 1, I just have to drop the counter collection by running db.counters.drop()  */