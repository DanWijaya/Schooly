const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create MaterialSchema
const MaterialSchema = new Schema({ 
    name: {
        type: String, 
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    class_assigned: [{
        type: Object,
        required: true
    }],
    author_id: {
        type: String,
        default: ""
    },
    description: {
        type: String,
        required: true
    },
    lampiran: [{
        type: Object,
        default: []
    }]
})

module.exports = Material = mongoose.model("materials", MaterialSchema);