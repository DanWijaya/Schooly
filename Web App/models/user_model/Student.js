const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require('./User');

const Student = User.discriminator('Student', new mongoose.Schema({
    kelas: { type: String, default: 'X C'},
    })
);

module.exports = mongoose.model('Student')
