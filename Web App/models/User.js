// Require Mongoose
const mongoose = require("mongoose");

// Define a Schema
const Schema = mongoose.Schema;

// Create Schema
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
  // phone_number: {
  //   type: Number,
  //   required: true
  // },
  // address: {
  //   type: String, 
  //   required: true
  // }
});

var User = mongoose.model("users", UserSchema)
var options = {discriminatorKey: 'role'};

// var StudentUser = User.discriminator('Student', 
//   new mongoose.Schema({kelas: String, nilai: Float32Array}, options))

// var TeacherUser = User.discriminator('Teacher', 
//   new mongoose.Schema({subjek_diajar: String}, options))

// var AdminUser = User.discriminator('Admin', 
//   new mongoose.Schema({admin_user: Boolean}, options)
// )
// Models are created from schemas using the mongoose.model() method. 
module.exports = User;
