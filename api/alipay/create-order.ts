// 创建支付宝订单 - Vercel Serverless Function
import type { VercelRequest, VercelResponse } from '@vercel/node';
import alipaySdk, { isConfigReady } from '../lib/alipay';
import { createOrder, cleanupOldOrders } from '../lib/store';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 允许跨域
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 检查配置
  if (!isConfigReady()) {
    return res.status(500).json({
      error: '支付宝配置未就绪',
      message: '请在 Vercel 环境变量中设置 ALIPAY_APP_ID, ALIPAY_PRIVATE_KEY, ALIPAY_PUBLIC_KEY',
    });
  }

  try {
    const { plan, userId } = req.body || {};

    if (!plan || !['single', 'lifetime'].includes(plan)) {
      return res.status(400).json({ error: '无效的套餐类型' });
    }

    if (!userId) {
      return res.status(400).json({ error: '缺少用户ID' });
    }

    // 清理旧订单
    cleanupOldOrders();

    // 生成订单号
    const orderNo = `MY${Date.now()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    const amount = plan === 'single' ? 9.9 : 39;
    const subject = plan === 'single' ? '命运加法-单次测算' : '命运加法-终身会员';

    // 保存订单到内存
    createOrder({
      orderNo,
      userId,
      plan,
      amount,
      status: 'pending',
    });

    // 回调地址：优先使用 SITE_URL 环境变量（你的域名），其次用请求来源
    const origin = process.env.SITE_URL || req.headers.origin || '';

    // 调用支付宝接口创建订单（手机网站支付）
    const result = await alipaySdk.exec('alipay.trade.wap.pay', {
      notify_url: `${origin}/api/alipay/notify`,
      bizContent: {
        out_trade_no: orderNo,
        total_amount: amount.toString(),
        subject,
        product_code: 'QUICK_WAP_WAY',
      },
    }, { validateSign: true });

    // 手机网站支付返回的是 form 表单 HTML
    if (result && typeof result === 'string' && result.includes('<form')) {
      return res.status(200).json({
        success: true,
        orderNo,
        payUrl: null,
        payForm: result, // HTML form，前端直接提交
      });
    }

    // 如果返回的是 URL（电脑网站支付）
    return res.status(200).json({
      success: true,
      orderNo,
      payUrl: result,
    });
  } catch (error: any) {
    console.error('创建订单失败:', error);
    return res.status(500).json({
      error: '创建订单失败',
      message: error.message || '未知错误',
    });
  }
}
