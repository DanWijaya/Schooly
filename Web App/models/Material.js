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
    // ,grades: [{user_id : {type: String, default: ""}, 
    // nilai: {type: Number, default: 0}}]
    , grades: {
        type: Map,
        default: null // userId -> the score. 
    }
})

module.exports = Material = mongoose.model("materials", MaterialSchema);