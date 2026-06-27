/**
 * 微信支付 v3 API 核心封装
 * 支持：Native支付（扫码）、H5支付（手机浏览器）
 */

export interface WxPayConfig {
  mchid: string;
  appid: string;
  serialNo: string;
  privateKey: CryptoKey;
  apiv3Key: string;
  notifyUrl: string;
}

export interface OrderParams {
  outTradeNo: string;
  description: string;
  amount: number; // 单位：分
  clientIp?: string;
}

// 从 PEM 格式导入 RSA 私钥
export async function importPrivateKey(pem: string): Promise<CryptoKey> {
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

// 生成微信支付 v3 Authorization 头
async function createAuthHeader(
  method: string,
  urlPath: string,
  body: string,
  config: WxPayConfig
): Promise<string> {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonceStr = crypto.randomUUID().replace(/-/g, '');
  const message = `${method}\n${urlPath}\n${timestamp}\n${nonceStr}\n${body}\n`;

  const signature = await crypto.subtle.sign(
    { name: 'RSASSA-PKCS1-v1_5' },
    config.privateKey,
    new TextEncoder().encode(message)
  );

  const signatureBase64 = btoa(
    String.fromCharCode(...new Uint8Array(signature))
  );

  return `WECHATPAY2-SHA256-RSA2048 mchid="${config.mchid}",nonce_str="${nonceStr}",timestamp="${timestamp}",serial_no="${config.serialNo}",signature="${signatureBase64}"`;
}

// 发送微信支付 API 请求
async function wxRequest<T>(
  method: string,
  urlPath: string,
  body: string,
  config: WxPayConfig
): Promise<T> {
  const auth = await createAuthHeader(method, urlPath, body, config);

  const response = await fetch(`https://api.mch.weixin.qq.com${urlPath}`, {
    method,
    headers: {
      Authorization: auth,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: method === 'GET' ? undefined : body,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`WeChatPay Error: ${JSON.stringify(data)}`);
  }

  return data as T;
}

// Native 支付 - 生成扫码支付二维码
export async function createNativeOrder(
  params: OrderParams,
  config: WxPayConfig
): Promise<{ code_url: string }> {
  const urlPath = '/v3/pay/transactions/native';
  const body = JSON.stringify({
    mchid: config.mchid,
    out_trade_no: params.outTradeNo,
    appid: config.appid,
    description: params.description,
    notify_url: config.notifyUrl,
    amount: { total: params.amount },
  });

  return wxRequest('POST', urlPath, body, config);
}

// H5 支付 - 手机浏览器调起微信支付
export async function createH5Order(
  params: OrderParams,
  config: WxPayConfig
): Promise<{ h5_url: string }> {
  const urlPath = '/v3/pay/transactions/h5';
  const body = JSON.stringify({
    mchid: config.mchid,
    out_trade_no: params.outTradeNo,
    appid: config.appid,
    description: params.description,
    notify_url: config.notifyUrl,
    amount: { total: params.amount },
    scene_info: {
      payer_client_ip: params.clientIp || '127.0.0.1',
      h5_info: {
        type: 'Wap',
        app_name: '命运加法',
        app_url: 'https://mingyunpluse.com',
      },
    },
  });

  return wxRequest('POST', urlPath, body, config);
}

// 查询订单状态
export async function queryOrder(
  outTradeNo: string,
  config: WxPayConfig
): Promise<{
  trade_state: string;
  trade_state_desc: string;
  out_trade_no: string;
  transaction_id?: string;
  amount?: { total: number; payer_total: number };
  success_time?: string;
}> {
  const urlPath = `/v3/pay/transactions/out-trade-no/${outTradeNo}?mchid=${config.mchid}`;
  return wxRequest('GET', urlPath, '', config);
}

// 解密回调通知
export async function decryptCallback(
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

  const cipherBytes = Uint8Array.from(atob(ciphertext), (c) =>
    c.charCodeAt(0)
  );

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
