const mongoose = require("mongoose"); // Require Mongoose
const Schema = mongoose.Schema; // Define a Schema

let OTPRegisterSchema = new Schema(
  {
    otp: {
      type: String,
      require: true,
    },
    expiration_time: { type: Date, require: true },
    minutes_to_expire: { type: Number, require: true },
    verified: {
      type: Boolean,
      require: true,
      default: false,
    },
    email: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

const OTPRegister = mongoose.model("RegsiterOTP", OTPRegisterSchema);
module.exports = OTPRegister;
