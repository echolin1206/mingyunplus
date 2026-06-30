const express = require('express');
const router = express.Router();
const {
    createOrder,
    getOrderByNo,
    updateOrderPaid,
    setUserVip
} = require('../utils/divination');

// 支付宝配置（需要替换为真实配置）
const ALIPAY_APP_ID = process.env.ALIPAY_APP_ID;
const ALIPAY_PRIVATE_KEY = process.env.ALIPAY_PRIVATE_KEY;
const ALIPAY_PUBLIC_KEY = process.env.ALIPAY_PUBLIC_KEY;

// 检查是否已配置支付宝
const isAlipayConfigured = ALIPAY_APP_ID && 
    ALIPAY_APP_ID !== 'your_app_id' && 
    ALIPAY_APP_ID !== 'your_app_id_here' &&
    ALIPAY_PRIVATE_KEY && 
    ALIPAY_PRIVATE_KEY !== 'your_private_key' &&
    ALIPAY_PRIVATE_KEY !== 'your_private_key_here';

const ALIPAY_CONFIG = {
    appId: ALIPAY_APP_ID || 'your_app_id',
    privateKey: ALIPAY_PRIVATE_KEY || 'your_private_key',
    alipayPublicKey: ALIPAY_PUBLIC_KEY || 'alipay_public_key',
    gateway: 'https://openapi.alipay.com/gateway.do',
    notifyUrl: process.env.APP_URL ? `${process.env.APP_URL}/api/pay/notify` : 'https://mingyunplus.com/api/pay/notify',
    returnUrl: process.env.APP_URL ? `${process.env.APP_URL}/pay/success` : 'https://mingyunplus.com/pay/success'
};

// 创建支付订单
router.post('/pay/create', async (req, res) => {
    try {
        const { userId, productType } = req.body;
        
        if (!userId) {
            return res.status(400).json({ code: -1, msg: '缺少用户ID' });
        }
        
        const productMap = {
            'single': { name: '单次测算', price: 9.9 },
            'lifetime': { name: '终身会员', price: 39 }
        };
        
        const product = productMap[productType];
        if (!product) {
            return res.status(400).json({ code: -1, msg: '无效的产品类型' });
        }
        
        const order = await createOrder(userId, productType, product.price);
        
        // 生成支付宝支付参数（简化版，实际接入需使用支付宝SDK）
        const payParams = {
            orderNo: order.orderNo,
            amount: product.price,
            subject: product.name,
            body: `命运+ - ${product.name}`,
            qrCode: generateMockQrCode(order.orderNo) // 实际应调用支付宝SDK
        };
        
        res.json({
            code: 0,
            data: {
                orderNo: order.orderNo,
                payParams,
                amount: product.price,
                productName: product.name,
                demoMode: !isAlipayConfigured // 未配置支付宝时标记为演示模式
            }
        });
    } catch (err) {
        console.error('创建支付订单失败:', err);
        res.status(500).json({ code: -1, msg: '创建订单失败，请稍后重试' });
    }
});

// 查询订单状态
router.get('/pay/status/:orderNo', async (req, res) => {
    try {
        const { orderNo } = req.params;
        const order = await getOrderByNo(orderNo);
        
        if (!order) {
            return res.status(404).json({ code: -1, msg: '订单不存在' });
        }
        
        res.json({
            code: 0,
            data: {
                orderNo: order.order_no,
                status: order.status, // 0: 未支付, 1: 已支付
                amount: order.amount,
                productType: order.product_type
            }
        });
    } catch (err) {
        console.error('查询订单失败:', err);
        res.status(500).json({ code: -1, msg: '查询失败' });
    }
});

// 支付宝异步通知（支付回调）
router.post('/pay/notify', async (req, res) => {
    try {
        const { out_trade_no, trade_status } = req.body;
        
        // 验证签名（实际应使用支付宝SDK验证）
        if (trade_status === 'TRADE_SUCCESS' || trade_status === 'TRADE_FINISHED') {
            const order = await getOrderByNo(out_trade_no);
            if (order && order.status === 0) {
                await updateOrderPaid(out_trade_no, Math.floor(Date.now() / 1000));
                
                // 如果是终身会员，设置用户VIP状态
                if (order.product_type === 'lifetime') {
                    await setUserVip(order.user_id);
                }
            }
        }
        
        res.send('success'); // 支付宝要求返回 success
    } catch (err) {
        console.error('支付回调处理失败:', err);
        res.send('fail');
    }
});

// 模拟支付成功（测试用/演示模式）
router.post('/pay/mock-success', async (req, res) => {
    try {
        const { orderNo } = req.body;
        
        if (!orderNo) {
            return res.status(400).json({ code: -1, msg: '缺少订单号' });
        }
        
        const order = await getOrderByNo(orderNo);
        
        if (!order) {
            return res.status(404).json({ code: -1, msg: '订单不存在' });
        }
        
        await updateOrderPaid(orderNo, Math.floor(Date.now() / 1000));
        
        if (order.product_type === 'lifetime') {
            await setUserVip(order.user_id);
        }
        
        res.json({ code: 0, msg: '支付成功' });
    } catch (err) {
        console.error('模拟支付失败:', err);
        res.status(500).json({ code: -1, msg: '处理失败' });
    }
});

// 生成模拟二维码（实际接入时替换为支付宝SDK返回的二维码）
function generateMockQrCode(orderNo) {
    // 返回一个模拟的QR码数据URL或URL字符串
    return `https://mingyunplus.com/pay/qrcode/${orderNo}`;
}

module.exports = router;
