// Require Mongoose
const mongoose = require("mongoose");

// Define a Schema
const Schema = mongoose.Schema;

// Create Schema
const AnnoucementSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String, 
        required: true
    },
    lampiran: [{
        type: Object,
        default: []
    }],
    author: {
        type: String, // Taruh idnya saja
        required: true
    },
    date_announced: {
        type: Date,
        required: true
    }
})

const Announcement = mongoose.model("announcements", AnnoucementSchema);
module.exports = Announcement;