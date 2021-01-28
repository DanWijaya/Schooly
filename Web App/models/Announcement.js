// Require Mongoose
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");

// Define a Schema
const Schema = mongoose.Schema;

// Create Schema
const AnnoucementSchema = new Schema(
  {
    title: {
      type: String,
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

    // jika dibuat oleh admin, array ini berisi satu elemen: null.
    // ditambahkan null agar tidak perlu mengecek role author_id saat validasi.
    class_assigned: [
      {
        type: ObjectId,
        // required: true,
      },
    ],
    author_id: {
      type: ObjectId,
      required: true,
    },
    // date_announced: {
    //     type: Date,
    //     required: true
    // }

    // value: "Student" / "Teacher" / "Teacher_Student"
    to: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

const Announcement = mongoose.model("announcements", AnnoucementSchema);
module.exports = Announcement;

// export
// Kalau di Schooly, di luar client folder pakai module.exports. Kalau di dlm client folder pakai export.
