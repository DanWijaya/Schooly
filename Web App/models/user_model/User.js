const { ObjectId } = require("mongodb"); // API from mongoose MongoDB
const mongoose = require("mongoose"); // Require mongoose
const Schema = mongoose.Schema; // Define a Schema

const options = { discriminatorKey: "role" };

// Create User Schema
const UserSchema = new Schema(
  {
    active: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      required: true,
    },
    passwordReset: {
      type: String,
      select: false,
    },
    passwordResetTime: {
      type: Date,
      select: true,
    },

    // Personal Information
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
    unit: {
      type: ObjectId,
      default: null,
    },

    // Contacts
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

    // Career
    hobi_minat: {
      type: String,
      default: null,
    },
    ket_non_teknis: {
      type: String,
      default: null,
    },
    cita_cita: {
      type: String,
      default: null,
    },
    uni_impian: {
      type: String,
      default: null,
    },
  },
  options
);

const User = mongoose.model("users", UserSchema);
// mongoose.model(nama_collection , Schema );
module.exports = User;
