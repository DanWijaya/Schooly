// Require Mongoose
const mongoose = require("mongoose");

// Define a Schema
const Schema = mongoose.Schema;

const options = {discriminatorKey: 'role'};

// Create Schema (New way)

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }, 
  address: {
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
  avatar: {
    type: String,
    default: ""
  }
}, options )

const User = mongoose.model('users', UserSchema);
module.exports = User;

