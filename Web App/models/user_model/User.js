// Require Mongoose
const mongoose = require("mongoose");

// Define a Schema
const Schema = mongoose.Schema;

const options = {discriminatorKey: "role"};

// Create Schema (New way)

const UserSchema = new Schema({
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: ""
  },

  // Informasi Pribadi
  name: {
    type: String,
    required: true
  },
  tanggal_lahir: {
    type: String,
    default: "Belum Diisi"
  },
  jenis_kelamin: {
    type: String,
    default: "Belum Diisi"
  },
  sekolah: {
    type: String,
    default: "Belum Diisi"
  },

  //Kontak
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  emergency_phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },

  //Karir
  hobi_minat: {
    type: String,
    default: "Belum Diisi"
  },
  ket_non_teknis: {
    type: String,
    default: "Belum Diisi"
  },
  cita_cita: {
    type: String,
    default: "Belum Diisi"
  },
  uni_impian: {
    type: String,
    default: "Belum Diisi"
  },
  passwordReset: { type: String, select: false },
  passwordResetTime: { type: Date, select: true}
}, options )

const User = mongoose.model("users", UserSchema);
module.exports = User;
