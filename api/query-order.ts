/**
 * Vercel Edge Function - 查询微信支付订单状态
 * 部署路径: /api/query-order?id=ORDER_ID
 */

export const config = {
  runtime: 'edge',
};

// 从 PEM 导入私钥
async function importPrivateKey(pem: string): Promise<CryptoKey> {
  const pemContent = pem
    .replace(/-----BEGIN PRIVATE KEY-----/g, '')
    .replace(/-----END PRIVATE KEY-----/g, '')
    .replace(/\n/g, '');
  const binaryDer = Uint8Array.from(atob(pemContent), (c) => c.charCodeAt(0));
  return crypto.subtle.importKey(
    'pkcs8',
    binaryDer.buffer,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  );
}

async function createAuthHeader(
  method: string,
  urlPath: string,
  body: string,
  mchid: string,
  serialNo: string,
  privateKey: CryptoKey
): Promise<string> {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonceStr = crypto.randomUUID().replace(/-/g, '');
  const message = `${method}\n${urlPath}\n${timestamp}\n${nonceStr}\n${body}\n`;

  const signature = await crypto.subtle.sign(
    { name: 'RSASSA-PKCS1-v1_5' },
    privateKey,
    new TextEncoder().encode(message)
  );

  const signatureBase64 = btoa(String.fromCharCode(...new Uint8Array(signature)));

  return `WECHATPAY2-SHA256-RSA2048 mchid="${mchid}",nonce_str="${nonceStr}",timestamp="${timestamp}",serial_no="${serialNo}",signature="${signatureBase64}"`;
}

export default async function handler(req: Request): Promise<Response> {
  const origin = req.headers.get('origin') || '*';

  if (req.method === 'OPTIONS') {
    return new Response('', {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  try {
    const url = new URL(req.url);
    const orderId = url.searchParams.get('id');

    if (!orderId) {
      return new Response(
        JSON.stringify({ error: '缺少订单号' }),
        { status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': origin } }
      );
    }

    const mchid = process.env.WECHAT_MCHID || '1627375792';
    const serialNo = process.env.WECHAT_SERIAL_NO || '';
    const privateKeyPem = process.env.WECHAT_PRIVATE_KEY || '';

    if (!serialNo || !privateKeyPem) {
      return new Response(
        JSON.stringify({ error: '微信支付密钥未配置' }),
        { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': origin } }
      );
    }

    const privateKey = await importPrivateKey(privateKeyPem);
    const urlPath = `/v3/pay/transactions/out-trade-no/${orderId}?mchid=${mchid}`;
    const auth = await createAuthHeader('GET', urlPath, '', mchid, serialNo, privateKey);

    const response = await fetch(`https://api.mch.weixin.qq.com${urlPath}`, {
      headers: { Authorization: auth, Accept: 'application/json' },
    });

    const data = await response.json();

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: JSON.stringify(data) }),
        { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': origin } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        order: {
          id: orderId,
          status: data.trade_state === 'SUCCESS' ? 'paid' : 'pending',
          amount: (data.amount?.total || 0) / 100,
          planType: data.description?.includes('终身') ? 'lifetime' : 'single',
          tradeState: data.trade_state,
          tradeStateDesc: data.trade_state_desc,
        },
      }),
      { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': origin } }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : '查询订单失败';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': origin } }
    );
  }
}
