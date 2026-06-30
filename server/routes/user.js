const express = require('express');
const router = express.Router();
const db = require('../utils/db');

// 获取/创建用户（模拟微信登录，实际接入需要微信SDK）
router.post('/user/login', async (req, res) => {
    try {
        const { unionId, nickname, avatar } = req.body;
        
        if (!unionId) {
            return res.status(400).json({ code: -1, msg: '缺少用户标识' });
        }
        
        // 查找用户
        db.get('SELECT * FROM users WHERE union_id = ?', [unionId], async (err, user) => {
            if (err) {
                console.error('查询用户失败:', err);
                return res.status(500).json({ code: -1, msg: '登录失败' });
            }
            
            if (user) {
                // 更新用户信息
                db.run(
                    'UPDATE users SET nickname = ?, avatar = ? WHERE id = ?',
                    [nickname || user.nickname, avatar || user.avatar, user.id]
                );
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
                // 创建新用户
                db.run(
                    'INSERT INTO users (union_id, nickname, avatar) VALUES (?, ?, ?)',
                    [unionId, nickname || '神秘用户', avatar || ''],
                    function(err) {
                        if (err) {
                            console.error('创建用户失败:', err);
                            return res.status(500).json({ code: -1, msg: '注册失败' });
                        }
                        res.json({
                            code: 0,
                            data: {
                                id: this.lastID,
                                unionId,
                                nickname: nickname || '神秘用户',
                                avatar: avatar || '',
                                isVip: false,
                                vipExpire: null
                            }
                        });
                    }
                );
            }
        });
    } catch (err) {
        console.error('登录失败:', err);
        res.status(500).json({ code: -1, msg: '登录失败' });
    }
});

// 获取用户信息
router.get('/user/:id', async (req, res) => {
    try {
        const { id } = req.params;
        db.get('SELECT * FROM users WHERE id = ?', [id], (err, user) => {
            if (err) {
                console.error('查询用户失败:', err);
                return res.status(500).json({ code: -1, msg: '查询失败' });
            }
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
        db.all(
            'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
            [id],
            (err, rows) => {
                if (err) {
                    console.error('查询订单失败:', err);
                    return res.status(500).json({ code: -1, msg: '查询失败' });
                }
                res.json({ code: 0, data: rows });
            }
        );
    } catch (err) {
        console.error('获取订单失败:', err);
        res.status(500).json({ code: -1, msg: '获取失败' });
    }
});

// 获取用户测算记录
router.get('/user/:id/records', async (req, res) => {
    try {
        const { id } = req.params;
        db.all(
            'SELECT * FROM divination_records WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
            [id],
            (err, rows) => {
                if (err) {
                    console.error('查询记录失败:', err);
                    return res.status(500).json({ code: -1, msg: '查询失败' });
                }
                res.json({ code: 0, data: rows });
            }
        );
    } catch (err) {
        console.error('获取记录失败:', err);
        res.status(500).json({ code: -1, msg: '获取失败' });
    }
});

module.exports = router;
