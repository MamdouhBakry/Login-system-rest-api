const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    dateOfBirth: Date
})

module.exports = mongoose.model("User", userSchema);