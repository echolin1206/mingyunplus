// 查询订单支付状态 - Vercel Serverless Function
import type { VercelRequest, VercelResponse } from '@vercel/node';
import alipaySdk, { isConfigReady } from '../lib/alipay';
import { getOrder, updateOrder } from '../lib/store';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { orderNo } = req.query;

    if (!orderNo || typeof orderNo !== 'string') {
      return res.status(400).json({ error: '缺少订单号' });
    }

    // 先从内存查
    const order = getOrder(orderNo);
    if (!order) {
      return res.status(404).json({ error: '订单不存在' });
    }

    // 如果已支付直接返回
    if (order.status === 'paid') {
      return res.status(200).json({
        success: true,
        status: 'paid',
        plan: order.plan,
      });
    }

    // 如果支付宝配置就绪，也查一下支付宝侧状态
    if (isConfigReady()) {
      try {
        const result: any = await alipaySdk.exec('alipay.trade.query', {
          bizContent: {
            out_trade_no: orderNo,
          },
        });

        if (
          result &&
          (result.trade_status === 'TRADE_SUCCESS' || result.trade_status === 'TRADE_FINISHED')
        ) {
          updateOrder(orderNo, {
            status: 'paid',
            tradeNo: result.trade_no,
            paidAt: Date.now(),
          });

          return res.status(200).json({
            success: true,
            status: 'paid',
            plan: order.plan,
          });
        }
      } catch (e) {
        // 支付宝查询失败不影响返回
      }
    }

    // 未支付
    return res.status(200).json({
      success: true,
      status: order.status,
      plan: order.plan,
    });
  } catch (error: any) {
    console.error('查询订单失败:', error);
    return res.status(500).json({ error: '查询失败', message: error.message });
  }
}
