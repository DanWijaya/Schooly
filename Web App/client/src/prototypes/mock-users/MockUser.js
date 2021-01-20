// Require Mongoose
const mongoose = require("mongoose");
// API dari mongoose MongoDb.

// Define a Schema
const Schema = mongoose.Schema;

const options = { discriminatorKey: "role" };

// Create Schema (New way)

const MockUserSchema = new Schema(
  {
    avatar: {
      type: String,
      default: "",
    },
    // Informasi Pribadi
    name: {
      type: String,
      required: true,
    },
    tanggal_lahir: {
      type: Date,
      default: new Date(),
    },
    jenis_kelamin: {
      type: String,
      default: null,
    },
    sekolah: {
      type: String,
      default: null,
    },

    //Kontak
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    emergency_phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
  },
  options
);

const MockUser = mongoose.model("mock_users", MockUserSchema);

module.exports = MockUser;
