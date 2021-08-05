const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = require("mongodb");

const EventSchema = new Schema(
	{
		unit: {
			type: ObjectId,
			default: null
		},
		name: {
			type: String,
			required: true
		},
		location: {
			type: String
		},
		start_date: {
			type: Date,
			required: true,
		},
		end_date: {
			type: Date,
			required: true,
		},

		// elemen pada array ini bernilai: "Student", "Teacher", atau "Admin"
		to: {
			type: [String],
			validate: [(value) => { return value.length > 0 }, "Pihak penerima tidak boleh kosong"]
		},
		description: {
			type: String,
		},
		author_id: {
			type: ObjectId,
			required: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("events", EventSchema);