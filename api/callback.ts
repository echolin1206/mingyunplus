/**
 * Vercel Edge Function - 微信支付回调通知
 * 部署路径: /api/callback
 */

export const config = {
  runtime: 'edge',
};

// 解密微信支付回调数据
async function decryptCallback(
  ciphertext: string,
  nonce: string,
  associatedData: string,
  apiv3Key: string
): Promise<Record<string, unknown>> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(apiv3Key),
    { name: 'AES-GCM' },
    false,
    ['decrypt']
  );

  const cipherBytes = Uint8Array.from(atob(ciphertext), (c) => c.charCodeAt(0));

  const decrypted = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: new TextEncoder().encode(nonce),
      additionalData: new TextEncoder().encode(associatedData),
    },
    key,
    cipherBytes
  );

  return JSON.parse(new TextDecoder().decode(decrypted));
}

export default async function handler(req: Request): Promise<Response> {
  try {
    const body = await req.json() as {
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

    const apiv3Key = process.env.WECHAT_APIV3_KEY || '';

    const decrypted = await decryptCallback(
      body.resource.ciphertext,
      body.resource.nonce,
      body.resource.associated_data,
      apiv3Key
    );

    const notifyData = decrypted as {
      out_trade_no: string;
      transaction_id: string;
      trade_state: string;
    };

    // 存储支付成功状态（使用简单的内存存储，Vercel Edge 每次请求独立）
    // 实际生产环境应该用数据库，这里用简单的 KV 或 header 传递
    console.log(`Payment success: ${notifyData.out_trade_no}`);

    return new Response(JSON.stringify({ code: 'SUCCESS', message: '成功' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : '回调处理失败';
    console.error('Callback error:', err);
    return new Response(JSON.stringify({ code: 'FAIL', message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
