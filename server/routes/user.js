const express = require('express');
const router = express.Router();
const db = require('../utils/db');

// 获取/创建用户
router.post('/user/login', async (req, res) => {
    try {
        const { unionId, nickname, avatar } = req.body;
        if (!unionId) {
            return res.status(400).json({ code: -1, msg: '缺少用户标识' });
        }
        
        const user = db.get('SELECT * FROM users WHERE union_id = ?', [unionId]);
        
        if (user) {
            db.update('users', { id: user.id }, {
                nickname: nickname || user.nickname,
                avatar: avatar || user.avatar
            });
            res.json({
                code: 0,
                data: {
                    id: user.id,
                    unionId: user.union_id,
                    nickname: nickname || user.nickname,
                    avatar: avatar || user.avatar,
                    isVip: user.is_vip === 1,
                    vipExpire: user.vip_expire
                }
            });
        } else {
            const row = db.insert('users', {
                union_id: unionId,
                nickname: nickname || '神秘用户',
                avatar: avatar || '',
                is_vip: 0,
                created_at: Math.floor(Date.now() / 1000)
            });
            res.json({
                code: 0,
                data: {
                    id: row.id,
                    unionId,
                    nickname: nickname || '神秘用户',
                    avatar: avatar || '',
                    isVip: false,
                    vipExpire: null
                }
            });
        }
    } catch (err) {
        console.error('登录失败:', err);
        res.status(500).json({ code: -1, msg: '登录失败' });
    }
});

// 获取用户信息
router.get('/user/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = db.get('SELECT * FROM users WHERE id = ?', [parseInt(id)]);
        if (!user) {
            return res.status(404).json({ code: -1, msg: '用户不存在' });
        }
        res.json({
            code: 0,
            data: {
                id: user.id,
                nickname: user.nickname,
                avatar: user.avatar,
                isVip: user.is_vip === 1,
                vipExpire: user.vip_expire
            }
        });
    } catch (err) {
        console.error('获取用户信息失败:', err);
        res.status(500).json({ code: -1, msg: '获取失败' });
    }
});

// 获取用户订单记录
router.get('/user/:id/orders', async (req, res) => {
    try {
        const { id } = req.params;
        const rows = db.all('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [parseInt(id)]);
        res.json({ code: 0, data: rows });
    } catch (err) {
        console.error('获取订单失败:', err);
        res.status(500).json({ code: -1, msg: '获取失败' });
    }
});

// 获取用户测算记录
router.get('/user/:id/records', async (req, res) => {
    try {
        const { id } = req.params;
        const rows = db.all('SELECT * FROM divination_records WHERE user_id = ? ORDER BY created_at DESC LIMIT 50', [parseInt(id)]);
        res.json({ code: 0, data: rows });
    } catch (err) {
        console.error('获取记录失败:', err);
        res.status(500).json({ code: -1, msg: '获取失败' });
    }
});

module.exports = router;
