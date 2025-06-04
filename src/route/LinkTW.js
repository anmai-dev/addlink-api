const route = require('express').Router();
const LinkTWcontrollers = require('../controllers/LinkTWControllers');
const uploadCloud = require('../controllers/middlewareCloudinary');
const middlewareVerify = require('../controllers/middlewareControllers');
const escapeHtml = require('escape-html'); // Để vệ sinh dữ liệu tránh XSS

// Route CRUD
route.post('/', middlewareVerify.verifyToken, uploadCloud.single('image'), LinkTWcontrollers.createLink);
route.get('/', LinkTWcontrollers.getAllLink);
route.get('/user-slugs', middlewareVerify.verifyToken, LinkTWcontrollers.getSlugByuserId);
route.put('/:slug', LinkTWcontrollers.updateLink);
route.delete('/:slug', LinkTWcontrollers.deleteLink);

// API lấy dữ liệu liên kết
route.get('/api/:slug', LinkTWcontrollers.getLinkBySlug);

// Trang chuyển hướng với thẻ OG và Twitter Card
route.get('/api/:slug', async (req, res) => {
  const { slug } = req.params;
  const userAgent = req.headers['user-agent'] || '';
  const domain = process.env.APP_DOMAIN || 'https://yourdomain.com'; // Lấy domain từ .env

  try {
    const link = await require('../models/LinkTW').findOne({ slug });
    if (!link) {
      return res.status(404).send('Không tìm thấy liên kết');
    }

    // Vệ sinh dữ liệu tránh XSS
    const safeTitle = escapeHtml(link.title || 'Link Wrapper');
    const safeDescription = escapeHtml(link.description || 'Nhấp để truy cập liên kết đích');
    const safeImage = escapeHtml(link.image);
    const safeDestination = escapeHtml(link.destination);

    // Kiểm tra URL hợp lệ
    if (!safeDestination || !safeDestination.startsWith('http')) {
      return res.status(500).send('Liên kết đích không hợp lệ');
    }

    // Kiểm tra nếu là Twitterbot
    if (userAgent.includes('Twitterbot')) {
      res.send(`
        <!DOCTYPE html>
        <html lang="vi">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          
          <!-- Open Graph -->
          <meta property="og:type" content="website">
          <meta property="og:title" content="${safeTitle}">
          <meta property="og:description" content="${safeDescription}">
          <meta property="og:image" content="${safeImage}">
          <meta property="og:url" content="${domain}/${link.slug}">
          
          <!-- Twitter Card -->
          <meta name="twitter:card" content="summary_large_image">
          <meta name="twitter:title" content="${safeTitle}">
          <meta name="twitter:description" content="${safeDescription}">
          <meta name="twitter:image" content="${safeImage}">
          <meta name="twitter:site" content="@YourTwitterHandle">
          <meta name="twitter:image:alt" content="Mô tả hình ảnh cho liên kết">
          
          <title>Đang chuyển hướng...</title>
        </head>
        <body>
          <p>Đang chuyển hướng đến liên kết...</p>
        </body>
        </html>
      `);
    } else {
      // Chuyển hướng phía server cho người dùng
      res.redirect(301, safeDestination);
    }
  } catch (error) {
    console.error('Lỗi server:', error);
    res.status(500).send('Lỗi server');
  }
});

module.exports = route;