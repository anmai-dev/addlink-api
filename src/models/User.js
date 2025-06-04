const { timestamps } = require('mongodb');
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 255

    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 1024
    },
    admin: {
        type: Boolean,
        default: false
    }

}, { timestamps: true })


module.exports = mongoose.model('User', userSchema);