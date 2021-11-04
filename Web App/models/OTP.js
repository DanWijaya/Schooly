const mongoose = require("mongoose"); // Require Mongoose
const Schema = mongoose.Schema; // Define a Schema

let otpSchema = new Schema(
  {
    visitor_email: { type: String },
    generated_otp: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Otp", otpSchema);
