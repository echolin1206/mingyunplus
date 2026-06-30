const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const db = require('./utils/db');

const app = express();

// CORS 跨域
app.use(cors());

// 限流中间件（Vercel 环境降低限流标准）
const isVercel = process.env.VERCEL === '1';
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: isVercel ? 300 : 100,
    message: { code: -1, msg: '请求过于频繁，请稍后再试' }
});
app.use(limiter);

// 中间件
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 静态文件
app.use(express.static(path.join(__dirname, '../public')));

// API路由
app.use('/api', require('./routes/divination'));
app.use('/api', require('./routes/payment'));
app.use('/api', require('./routes/user'));

// 首页
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// 页面路由（SPA 回退）
app.get('/:page', (req, res) => {
    const page = req.params.page;
    const validPages = ['tarot', 'zodiac', 'ziwei', 'fortune', 'daily', 'profile', 'payment'];
    if (validPages.includes(page)) {
        res.sendFile(path.join(__dirname, '../public/index.html'));
    } else {
        res.status(404).send('页面未找到');
    }
});

// 错误处理
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ code: -1, msg: '服务器内部错误' });
});

// 仅在非 Vercel 环境启动 HTTP 服务器（本地开发）
if (!isVercel) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`命运+ 服务器运行在 http://localhost:${PORT}`);
        console.log(`环境: ${process.env.NODE_ENV || 'development'}`);
    });
}

module.exports = app;
