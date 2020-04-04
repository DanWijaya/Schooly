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
  }  // phone_number: {
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

// // Require util
// const util = require("util");
// // Require Mongoose
// const mongoose = require("mongoose");
// // Define a Schema
// const Schema = mongoose.Schema;

// var options = {discriminatorKey: 'role'};

// function BaseSchema() {
//   Schema.apply(this, arguments);

//   this.add({ 
//       role: { 
//         type: Schema.Types.ObjectId, 
//         ref: 'Role',
//         required: true
//       },
//       name: {
//         type: String,
//         required: true
//       },
//       email: {
//         type: String,
//         required: true
//       },
//       password: {
//         type: String,
//         required: true
//       },
//       date: {
//         type: Date,
//         default: Date.now
//       }, 
//     })
//   }
// util.inherits(BaseSchema, Schema);

// var UserSchema = new BaseSchema();
// UserSchema.virtual('type').get(() => {return this.__t});

// var StudentSchema = new BaseSchema({ NomorAbsen: {type: Number}});
// var TeacherSchema = new BaseSchema({ Mapel: {type: String}});

// // finishing up the file 
// var User = mongoose.model('User', UserSchema);
// User.discriminator('Student', StudentSchema);
// User.discriminator('Teacher', TeacherSchema);

// var Student = mongoose.model('Student');
// var Teacher = mongoose.model('Teacher');

// // // Create Schema
// // const UserSchema = new Schema({
  
// //   name: {
// //     type: String,
// //     required: true
// //   },
// //   email: {
// //     type: String,
// //     required: true
// //   },
// //   password: {
// //     type: String,
// //     required: true
// //   },
// //   date: {
// //     type: Date,
// //     default: Date.now
// //   }, 
// //   options
// //   // phone_number: {
// //   //   type: Number,
// //   //   required: true
// //   // },
// //   // address: {
// //   //   type: String, 
// //   //   required: true
// //   // }
// // });

// // var User = mongoose.model("users", UserSchema)

// //Student is a special type of a user.
// const Student

// // Student Schema
// module.exports = {
//   User,
//   Student,
//   Teacher}
//   ;

