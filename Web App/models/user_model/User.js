// Require Mongoose
const mongoose = require("mongoose");

// Define a Schema
const Schema = mongoose.Schema;

const options = {discriminatorKey: 'role'};

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
    default: "Isi tanggal dengan format HH/BB/TTTT !"
  },
  jenis_kelamin: {
    type: String,
    default: "Isi pria atau wanita !"
  },
  sekolah: {
    type: String, 
    default: "Isi Sekolah mu !"
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
    required: false
  },
  ket_non_teknis: {
    type: String, 
    required: false
  },
  cita_cita: {type: String, 
    required: false
  },
  uni_impian: { 
    type: String, 
    required: false
  },
}, options )

const User = mongoose.model('users', UserSchema);
module.exports = User;

