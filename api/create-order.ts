/**
 * Vercel Edge Function - 创建微信支付订单
 * 部署路径: /api/create-order
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

// 生成微信支付 Authorization 头
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
  // CORS
  const origin = req.headers.get('origin') || '*';
  if (req.method === 'OPTIONS') {
    return new Response('', {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  try {
    const { planType, description } = await req.json();

    // 从环境变量读取配置
    const mchid = process.env.WECHAT_MCHID || '1627375792';
    const appid = process.env.WECHAT_APPID || '';
    const serialNo = process.env.WECHAT_SERIAL_NO || '';
    const apiv3Key = process.env.WECHAT_APIV3_KEY || '';
    const privateKeyPem = process.env.WECHAT_PRIVATE_KEY || '';
    const notifyUrl = process.env.NOTIFY_URL || `https://${req.headers.get('host')}/api/callback`;

    if (!serialNo || !apiv3Key || !privateKeyPem) {
      return new Response(
        JSON.stringify({ error: '微信支付密钥未配置，请在 Vercel 环境变量中设置 WECHAT_SERIAL_NO, WECHAT_APIV3_KEY, WECHAT_PRIVATE_KEY' }),
        { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': origin } }
      );
    }

    const amount = planType === 'single' ? 990 : 3900;
    const desc = description || (planType === 'single' ? '命运加法-单次测算' : '命运加法-终身会员');
    const outTradeNo = `MY${Date.now()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

    const privateKey = await importPrivateKey(privateKeyPem);

    // 判断设备类型
    const ua = req.headers.get('User-Agent') || '';
    const isMobile = /Mobile|Android|iPhone|iPad/i.test(ua);

    let codeUrl: string | undefined;
    let h5Url: string | undefined;

    if (isMobile) {
      // H5 支付
      const urlPath = '/v3/pay/transactions/h5';
      const body = JSON.stringify({
        mchid,
        out_trade_no: outTradeNo,
        appid,
        description: desc,
        notify_url: notifyUrl,
        amount: { total: amount },
        scene_info: {
          payer_client_ip: '127.0.0.1',
          h5_info: { type: 'Wap', app_name: '命运加法', app_url: 'https://mingyunplus.com' },
        },
      });

      const auth = await createAuthHeader('POST', urlPath, body, mchid, serialNo, privateKey);
      const response = await fetch(`https://api.mch.weixin.qq.com${urlPath}`, {
        method: 'POST',
        headers: { Authorization: auth, 'Content-Type': 'application/json', Accept: 'application/json' },
        body,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(JSON.stringify(data));
      h5Url = data.h5_url;
    } else {
      // Native 支付（扫码）
      const urlPath = '/v3/pay/transactions/native';
      const body = JSON.stringify({
        mchid,
        out_trade_no: outTradeNo,
        appid,
        description: desc,
        notify_url: notifyUrl,
        amount: { total: amount },
      });

      const auth = await createAuthHeader('POST', urlPath, body, mchid, serialNo, privateKey);
      const response = await fetch(`https://api.mch.weixin.qq.com${urlPath}`, {
        method: 'POST',
        headers: { Authorization: auth, 'Content-Type': 'application/json', Accept: 'application/json' },
        body,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(JSON.stringify(data));
      codeUrl = data.code_url;
    }

    return new Response(
      JSON.stringify({
        success: true,
        orderId: outTradeNo,
        tradeType: isMobile ? 'h5' : 'native',
        amount: amount / 100,
        codeUrl,
        h5Url,
        planType,
      }),
      { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': origin } }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : '创建订单失败';
    console.error('Create order error:', err);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': origin } }
    );
  }
}
