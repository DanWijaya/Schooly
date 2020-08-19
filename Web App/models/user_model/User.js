// Require Mongoose
const mongoose = require("mongoose");
// API dari mongoose MongoDb. 

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
    type: Date,
    default: new Date()
  },
  jenis_kelamin: {
    type: String,
    default: null
  },
  sekolah: {
    type: String,
    default: null
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
    default: null
  },
  ket_non_teknis: {
    type: String,
    default: null
  },
  cita_cita: {
    type: String,
    default: null
  },
  uni_impian: {
    type: String,
    default: null
  },
  active: {
    type: Boolean,
    default: false
  },
  passwordReset: { 
    type: String, 
    select: false 
  },
  passwordResetTime: { 
    type: Date, 
    select: true
  }
}, options )

const User = mongoose.model("users", UserSchema);
// mongoose.model(nama_collection , Schema );
module.exports = User;
