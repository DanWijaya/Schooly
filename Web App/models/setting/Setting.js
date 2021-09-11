// 1. Import" mongoose MongoDB dll
// 2. Buat schema, nama schemanya SettingSchema, terus yang diimport 
// 3. di dalam schema itu, tambahin atribut upload_limit: { type: Number, default: 10} ,jangan lupa tambahin timestamps: true

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SettingSchema = new Schema(
  {
    upload_limit: {
        type: Number,
        default: 10,
    },
	},
	{ timestamps: true }
);

module.exports = Setting = mongoose.model("settings", SettingSchema);