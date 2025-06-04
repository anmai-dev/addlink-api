const path = require('path');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const dotenv = require('dotenv');
dotenv.config();

// Cấu hình Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

// Cấu hình Multer với Cloudinary Storage
const storage = new CloudinaryStorage({
    cloudinary,
    params: (req, file) => {
        // Sử dụng path.parse() ở đây, sau khi biến path đã được khởi tạo
        const fileNameWithoutExt = path.parse(file.originalname).name;
        return {
            folder: 'image_video_project', // Thư mục lưu trữ trên Cloudinary
            resource_type: 'auto', // Tự động phát hiện loại file (ảnh hoặc video)
            public_id: `${Date.now()}_${fileNameWithoutExt}`,
        }
    }
});

const uploadCloud = multer({ storage });

module.exports = uploadCloud;