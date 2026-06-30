// 支付宝 SDK 配置 - 正式环境
// 配置步骤：
// 1. 登录 https://open.alipay.com/ → 创建网页应用
// 2. 绑定「手机网站支付」产品
// 3. 接口加签方式 → 设置 RSA2 公钥
// 4. 在 Vercel 环境变量中填入：
//    ALIPAY_APP_ID = 应用的 APPID
//    ALIPAY_PRIVATE_KEY = 密钥工具生成的应用私钥
//    ALIPAY_PUBLIC_KEY = 上传公钥后支付宝给的支付宝公钥

import AlipaySdk from 'alipay-sdk';

const alipaySdk = new AlipaySdk({
  appId: process.env.ALIPAY_APP_ID || '',
  privateKey: process.env.ALIPAY_PRIVATE_KEY || '',
  alipayPublicKey: process.env.ALIPAY_PUBLIC_KEY || '',
  gateway: 'https://openapi.alipay.com/gateway.do', // 正式环境网关
  signType: 'RSA2',
  charset: 'utf-8',
  version: '1.0',
});

export default alipaySdk;

// 检查配置是否完整
export function isConfigReady(): boolean {
  return !!(
    process.env.ALIPAY_APP_ID &&
    process.env.ALIPAY_PRIVATE_KEY &&
    process.env.ALIPAY_PUBLIC_KEY
  );
}
