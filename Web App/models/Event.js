const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = require("mongodb");

const EventSchema = new Schema(
	{
		name: {
			type: String,
			required: true
		},
		description: {
			type: String,
			required: true
		},
		// author_id: {
		// 	type: ObjectId,
		// 	required: true
		// },
		start_date: {
			type: Date,
			required: true,
		},
		end_date: {
			type: Date,
			required: true,
		}
	},
	{ timestamps: true }
);

module.exports = mongoose.model("events", EventSchema);