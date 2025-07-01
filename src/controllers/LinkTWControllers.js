const LinkTW = require('../models/LinkTW');
const cloudinary = require('cloudinary').v2;
const uploadCloud = require('./middlewareCloudinary');
const path = require('path');
const fs = require('fs');





const LinkTWcontrollers = {
    // Tạo link mới
    createLink: async (req, res) => {
        try {
            const { title, description, destination, slug } = req.body;
            const image = req.file ? req.file.path : null; // Đường dẫn file từ Cloudinary

            if (!image) {
                return res.status(400).json({ message: 'Vui lòng upload file ảnh' });
            }

            const newLink = new LinkTW({
                title,
                description,
                destination,
                slug,
                userId: req.user.id,
                image // Lưu URL từ Cloudinary
            });

            const savedLink = await newLink.save();
            res.status(201).json(savedLink);
        } catch (error) {
            console.error('Error creating link:', error);
            res.status(500).json({ message: 'Lỗi server khi tạo link' });
        }
    },
    getSlugByuserId: async (req, res) => {
        try {
            console.log("User from token:", req.user); // Log để debug
            const userId = req.user.id;
            if (!userId) {
                return res.status(401).json({ message: 'Không tìm thấy thông tin người dùng' });
            }
            console.log("Finding slugs for userId:", userId); // Log để debug
            const slugs = await LinkTW.find({ userId });
            console.log("Found slugs:", slugs); // Log để debug
            if (!slugs || slugs.length === 0) {
                return res.status(404).json({ message: 'Không tìm thấy slug nào cho người dùng này' });
            }
            res.status(200).json(slugs);
        } catch (error) {
            console.error('Error fetching slugs by userId:', error);
            res.status(500).json({ message: 'Lỗi server khi lấy danh sách slug' });
        }
    },
    // Lấy tất cả link
    getAllLink: async (req, res) => {
        try {
            const links = await LinkTW.find();
            return res.status(200).json(links);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },



    // Lấy danh sách tất cả slug
    getallSlug: async (req, res) => {
        try {
            const links = await LinkTW.find({}, 'slug');
            return res.status(200).json(links);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    // Cập nhật link
    updateLink: async (req, res) => {
        const { slug } = req.params;
        const { title, image, destination, description } = req.body;

        try {
            const link = await LinkTW.findOne({ slug });
            if (!link) {
                return res.status(404).json({ message: "Link not found" });
            }

            // Cập nhật dữ liệu
            link.title = title;
            link.image = image;
            link.destination = destination;
            link.description = description;

            await link.save();
            return res.status(200).json(link);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    deleteLink: async (req, res) => {
        try {
            const link = await LinkTW.findById(req.params.id);
            if (!link) {
                return res.status(404).json({ message: "Link not found" });
            }
            console.log(`delete link ${link._id}`);
            console.log(`delete image ${link.image}`)

            // xoa anh tu cloudinary
            try {
                if (link.image.includes('cloudinary.com')) {
                    // Lấy public ID từ URL Cloudinary (vd: https://res.cloudinary.com/demo/image/upload/v1234567890/image_video_project/team_logos/abcdef.jpg)
                    const publicId = link.image.split('/').slice(-3).join('/').split('.')[0]; // image_video_project/team_logos/abcdef
                    await cloudinary.uploader.destroy(publicId);
                    console.log(`Deleted  from Cloudinary: ${publicId}`);
                }
            } catch (error) {
                console.error('Error deleting images from Cloudinary:', error);
                // Tiếp tục xóa match trong database ngay cả khi không xóa được ảh
                return res.status(500).json({ message: 'Error deleting images from Cloudinary' });
            }
            // Xóa match từ database
            await LinkTW.findByIdAndDelete(req.params.id);
            return res.status(200).json({ message: 'Match deleted successfully', id: req.params.id });
        } catch (error) {
            console.error('Error deleting match:', error);
            return res.status(500).json({ message: 'Internal Server Error', error: error.message });
        }
    }

}

module.exports = LinkTWcontrollers;
