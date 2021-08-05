// Require Mongoose
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");

// Define a Schema
const Schema = mongoose.Schema;

// Create Schema
const AnnoucementSchema = new Schema(
  {
    unit: {
      type: ObjectId,
      default: null
    },
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
      },
    ],
    author_id: {
      type: ObjectId,
      required: true,
    },

		// elemen pada array ini bernilai: "Student" atau "Teacher"
    to: {
      type: [String],
      validate: [(value) => { return value.length > 0 }, "Pihak penerima tidak boleh kosong"]
    },
  },
  { timestamps: true }
);

const Announcement = mongoose.model("announcements", AnnoucementSchema);
module.exports = Announcement;

// export
// Kalau di Schooly, di luar client folder pakai module.exports. Kalau di dlm client folder pakai export.
