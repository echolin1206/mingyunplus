/**
 * 命运加法 - 微信支付后端 API
 * 部署平台：Cloudflare Workers
 * 
 * API 端点：
 * POST /api/order    - 创建支付订单
 * GET  /api/order/:id - 查询订单状态
 * POST /api/callback  - 微信支付回调通知
 */

import { Hono } from 'hono';
import {
  importPrivateKey,
  createNativeOrder,
  createH5Order,
  queryOrder,
  decryptCallback,
  type WxPayConfig,
} from './wxpay';

// Cloudflare Workers 环境类型
interface Env {
  // KV 存储
  KV: KVNamespace;
  // 环境变量
  WECHAT_MCHID: string;
  WECHAT_APPID: string;
  WECHAT_SERIAL_NO: string;
  WECHAT_APIV3_KEY: string;
  NOTIFY_URL: string;
  FRONTEND_URL: string;
  // Secrets（不在代码中暴露）
  WECHAT_PRIVATE_KEY: string;
}

// 订单数据结构
interface Order {
  id: string;
  outTradeNo: string;
  description: string;
  amount: number; // 分
  tradeType: 'native' | 'h5';
  status: 'pending' | 'paid' | 'failed';
  planType: 'single' | 'lifetime';
  createdAt: number;
  paidAt?: number;
  codeUrl?: string;   // Native 二维码链接
  h5Url?: string;     // H5 支付跳转链接
  userAgent?: string;
}

const app = new Hono<{ Bindings: Env }>();

// CORS 中间件 - 允许前端跨域请求
app.use('*', async (c, next) => {
  const origin = c.env.FRONTEND_URL || '*';
  c.header('Access-Control-Allow-Origin', origin);
  c.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  c.header('Access-Control-Max-Age', '86400');

  if (c.req.method === 'OPTIONS') {
    return c.text('', 204);
  }

  await next();
});

// 构建微信支付配置
async function buildWxConfig(env: Env): Promise<WxPayConfig> {
  const privateKey = await importPrivateKey(env.WECHAT_PRIVATE_KEY);
  return {
    mchid: env.WECHAT_MCHID,
    appid: env.WECHAT_APPID,
    serialNo: env.WECHAT_SERIAL_NO,
    privateKey,
    apiv3Key: env.WECHAT_APIV3_KEY,
    notifyUrl: env.NOTIFY_URL,
  };
}

// ============ API 路由 ============

// 健康检查
app.get('/', (c) => c.json({ status: 'ok', service: '命运加法支付服务' }));

// 创建订单
app.post('/api/order', async (c) => {
  try {
    const body = await c.req.json<{
      planType: 'single' | 'lifetime';
      description?: string;
    }>();

    const { planType, description } = body;

    if (!planType || !['single', 'lifetime'].includes(planType)) {
      return c.json({ error: '无效的套餐类型' }, 400);
    }

    // 金额（分）
    const amount = planType === 'single' ? 990 : 3900; // 9.90元 / 39.00元
    const desc = description || (planType === 'single' ? '命运加法-单次测算' : '命运加法-终身会员');

    // 生成订单号
    const outTradeNo = `MY${Date.now()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

    // 获取用户 UA 判断设备类型
    const ua = c.req.header('User-Agent') || '';
    const isMobile = /Mobile|Android|iPhone|iPad/i.test(ua);
    const tradeType = isMobile ? 'h5' : 'native';

    // 创建微信支付订单
    const wxConfig = await buildWxConfig(c.env);

    let codeUrl: string | undefined;
    let h5Url: string | undefined;

    if (tradeType === 'native') {
      // PC 端 - 扫码支付
      const result = await createNativeOrder(
        {
          outTradeNo,
          description: desc,
          amount,
          clientIp: c.req.header('CF-Connecting-IP') || '127.0.0.1',
        },
        wxConfig
      );
      codeUrl = result.code_url;
    } else {
      // 移动端 - H5 支付
      const result = await createH5Order(
        {
          outTradeNo,
          description: desc,
          amount,
          clientIp: c.req.header('CF-Connecting-IP') || '127.0.0.1',
        },
        wxConfig
      );
      h5Url = result.h5_url;
    }

    // 保存订单到 KV
    const order: Order = {
      id: outTradeNo,
      outTradeNo,
      description: desc,
      amount,
      tradeType,
      status: 'pending',
      planType,
      createdAt: Date.now(),
      codeUrl,
      h5Url,
      userAgent: ua,
    };

    await c.env.KV.put(`order:${outTradeNo}`, JSON.stringify(order), {
      expirationTtl: 86400, // 24 小时过期
    });

    return c.json({
      success: true,
      orderId: outTradeNo,
      tradeType,
      amount: amount / 100,
      codeUrl,     // PC 端用这个生成二维码
      h5Url,       // 移动端直接跳转
      planType,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : '创建订单失败';
    console.error('Create order error:', err);
    return c.json({ error: message }, 500);
  }
});

// 查询订单状态
app.get('/api/order/:id', async (c) => {
  try {
    const orderId = c.req.param('id');

    // 从 KV 读取订单
    const orderData = await c.env.KV.get(`order:${orderId}`);
    if (!orderData) {
      return c.json({ error: '订单不存在' }, 404);
    }

    const order = JSON.parse(orderData) as Order;

    // 如果订单还是 pending，主动查询微信支付
    if (order.status === 'pending') {
      try {
        const wxConfig = await buildWxConfig(c.env);
        const wxResult = await queryOrder(orderId, wxConfig);

        if (wxResult.trade_state === 'SUCCESS') {
          order.status = 'paid';
          order.paidAt = Date.now();
          await c.env.KV.put(`order:${orderId}`, JSON.stringify(order));

          // 如果是终身会员，记录会员状态
          if (order.planType === 'lifetime') {
            // 这里可以用订单关联到用户，简化处理用设备标识
            await c.env.KV.put(`member:lifetime`, JSON.stringify({
              orderId,
              paidAt: Date.now(),
              amount: order.amount,
            }));
          }
        } else if (
          ['CLOSED', 'REVOKED', 'PAYERROR'].includes(wxResult.trade_state)
        ) {
          order.status = 'failed';
          await c.env.KV.put(`order:${orderId}`, JSON.stringify(order));
        }
      } catch {
        // 查询失败不影响返回现有数据
      }
    }

    return c.json({
      success: true,
      order: {
        id: order.id,
        status: order.status,
        amount: order.amount / 100,
        planType: order.planType,
        tradeType: order.tradeType,
        createdAt: order.createdAt,
        paidAt: order.paidAt,
        codeUrl: order.codeUrl,
        h5Url: order.h5Url,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : '查询订单失败';
    return c.json({ error: message }, 500);
  }
});

// 微信支付回调通知
app.post('/api/callback', async (c) => {
  try {
    const body = await c.req.text();
    const data = JSON.parse(body) as {
      id: string;
      event_type: string;
      resource: {
        original_type: string;
        algorithm: string;
        ciphertext: string;
        associated_data: string;
        nonce: string;
      };
    };

    // 解密回调数据
    const decrypted = await decryptCallback(
      data.resource.ciphertext,
      data.resource.nonce,
      data.resource.associated_data,
      c.env.WECHAT_APIV3_KEY
    );

    const notifyData = decrypted as {
      out_trade_no: string;
      transaction_id: string;
      trade_state: string;
      success_time?: string;
      amount: { total: number; payer_total: number };
    };

    const orderId = notifyData.out_trade_no;

    // 更新订单状态
    const orderData = await c.env.KV.get(`order:${orderId}`);
    if (orderData) {
      const order = JSON.parse(orderData) as Order;

      if (notifyData.trade_state === 'SUCCESS') {
        order.status = 'paid';
        order.paidAt = Date.now();
        await c.env.KV.put(`order:${orderId}`, JSON.stringify(order));

        // 终身会员记录
        if (order.planType === 'lifetime') {
          await c.env.KV.put(`member:lifetime`, JSON.stringify({
            orderId,
            transactionId: notifyData.transaction_id,
            paidAt: Date.now(),
            amount: order.amount,
          }));
        }
      }
    }

    // 返回成功响应给微信支付
    return c.json({ code: 'SUCCESS', message: '成功' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : '回调处理失败';
    console.error('Callback error:', err);
    return c.json({ code: 'FAIL', message }, 500);
  }
});

// 检查会员状态（简化版）
app.get('/api/member/status', async (c) => {
  try {
    const memberData = await c.env.KV.get('member:lifetime');
    if (memberData) {
      const member = JSON.parse(memberData);
      return c.json({
        isMember: true,
        type: 'lifetime',
        paidAt: member.paidAt,
      });
    }
    return c.json({ isMember: false });
  } catch {
    return c.json({ isMember: false });
  }
});

export default app;
