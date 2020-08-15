// Require Mongoose
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");

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
    class_assigned: [{
        type: ObjectId,
        required: true
    }],
    author_id: {
        type: ObjectId,
        required: true
    },
    date_announced: {
        type: Date,
        required: true
    }
})

const Announcement = mongoose.model("announcements", AnnoucementSchema);
module.exports = Announcement;

// export 
// Kalau di Schooly, di luar client folder pakai module.exports. Kalau di dlm client folder pakai export. 