const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const LinkTW = require('./src/route/LinkTW');
const Auth = require('./src/route/Auth');
const User = require('./src/route/User');
const app = express();

dotenv.config();

// Kết nối đến MongoDB
mongoose.connect(process.env.URL_MONGODB)
    .then(() => {
        console.log('✅ Kết nối MongoDB thành công');
    })
    .catch((err) => console.error('❌ Lỗi kết nối MongoDB:', err));

// Cấu hình CORS
app.use(cors({
    origin: [process.env.APP_DOMAIN || 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Xử lý dữ liệu JSON
app.use(express.json({ limit: '50mb' }));

// Các route
app.use(LinkTW);
app.use('/a', Auth);
app.use('/u', User);

// Route cho robots.txt (cho Twitterbot)
app.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    res.send('User-agent: Twitterbot\nDisallow:');
});

// Chạy server ở cổng cố định
const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại ::${PORT}`);
});

// Xử lý khi nhấn Ctrl+C để tắt server gọn gàng
process.on('SIGINT', () => {
    console.log('\n🛑 Đang tắt server...');
    server.close(() => {
        console.log('✅ Server đã tắt.');
        process.exit(0);
    });
});
