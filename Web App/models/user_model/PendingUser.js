// Require Mongoose
const mongoose = require("mongoose");

// Define a Schema
const Schema = mongoose.Schema;

const options = { discriminatorKey: "role" };

// Create Schema (New way)

const PendingUserSchema = new Schema(
  {
    password: {
      type: String,
      required: true,
    },
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
    role: {},
  },
  options
);

const PendingUser = mongoose.model("pendingusers", PendingUserSchema);
module.exports = PendingUser;
