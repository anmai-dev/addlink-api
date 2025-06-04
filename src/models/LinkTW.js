const { timestamps } = require('mongodb');
const mongoose = require('mongoose');

const linkTWSchema = mongoose.Schema({
    title: { type: String },
    image: { type: String, required: true },                // ảnh hiển thị
    destination: { type: String, required: true },          // link đích khi click
    description: { type: String },
    slug: { type: String, required: true },  // slug để tạo đường dẫn
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true })


module.exports = mongoose.model('LinkTW', linkTWSchema);