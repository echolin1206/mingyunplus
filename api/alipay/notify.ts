// 支付宝异步通知回调 - Vercel Serverless Function
import type { VercelRequest, VercelResponse } from '@vercel/node';
import alipaySdk from '../lib/alipay';
import { updateOrder, getOrder } from '../lib/store';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  try {
    // 获取支付宝回调参数
    const notifyData = req.body;

    // 验证签名
    const signVerified = alipaySdk.checkResponseSign(notifyData, 'RSA2');

    if (!signVerified) {
      console.error('签名验证失败');
      return res.status(400).send('fail');
    }

    const { out_trade_no, trade_no, trade_status } = notifyData;

    // 查找订单
    const order = getOrder(out_trade_no);
    if (!order) {
      console.error('订单不存在:', out_trade_no);
      return res.status(200).send('success'); // 返回 success 避免支付宝重复通知
    }

    // 更新订单状态
    if (trade_status === 'TRADE_SUCCESS' || trade_status === 'TRADE_FINISHED') {
      updateOrder(out_trade_no, {
        status: 'paid',
        tradeNo: trade_no,
        paidAt: Date.now(),
      });

      console.log('订单支付成功:', out_trade_no, trade_no);
    }

    // 必须返回 success，否则支付宝会持续通知
    return res.status(200).send('success');
  } catch (error: any) {
    console.error('处理回调失败:', error);
    return res.status(500).send('fail');
  }
}
