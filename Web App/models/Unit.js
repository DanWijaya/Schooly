const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = require("mongodb");

const UnitSchema = new Schema({
    name: {
        type: String,
        required: true
    }
}, 
{ timestampes: true }
);

const Unit = mongoose.model("units", UnitSchema);
module.exports = Unit;
