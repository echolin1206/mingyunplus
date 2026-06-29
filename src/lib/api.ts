/**
 * 命运加法 - API 接口封装
 * 
 * 使用 Vercel Edge Functions 作为后端：
 * - /api/create-order  → 创建微信支付订单
 * - /api/query-order   → 查询订单状态
 * - /api/callback      → 微信支付回调
 * 
 * 如果后端未配置（没有设置 WECHAT_SERIAL_NO 等密钥），自动回退到模拟模式
 */

const API_BASE = import.meta.env.VITE_API_BASE || '';

// 是否强制使用模拟模式
const FORCE_MOCK = false;

// 检测后端是否可用（通过检查环境变量或发起测试请求）
let backendAvailable: boolean | null = null;

export async function checkBackend(): Promise<boolean> {
  if (backendAvailable !== null) return backendAvailable;
  if (FORCE_MOCK) {
    backendAvailable = false;
    return false;
  }
  try {
    const res = await fetch(`${API_BASE || ''}/api/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planType: 'single' }),
    });
    const data = await res.json();
    backendAvailable = !data.error || !data.error.includes('未配置');
    return backendAvailable;
  } catch {
    backendAvailable = false;
    return false;
  }
}

export const IS_MOCK = FORCE_MOCK || !API_BASE;

// ===== 真实 API 调用 =====

export async function createOrder(
  planType: 'single' | 'lifetime',
  description?: string
): Promise<{
  success: boolean;
  orderId: string;
  tradeType: 'native' | 'h5';
  amount: number;
  codeUrl?: string;
  h5Url?: string;
  planType: string;
}> {
  const res = await fetch(`${API_BASE || ''}/api/create-order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ planType, description }),
  });
  return res.json();
}

export async function queryOrder(orderId: string): Promise<{
  success: boolean;
  order: { id: string; status: string; amount: number; planType: string; tradeState?: string };
}> {
  const res = await fetch(`${API_BASE || ''}/api/query-order?id=${orderId}`);
  return res.json();
}

export async function pollOrderStatus(
  orderId: string,
  onStatusChange: (status: 'pending' | 'paid' | 'failed') => void,
  maxAttempts = 60,
  interval = 2000
): Promise<boolean> {
  for (let i = 0; i < maxAttempts; i++) {
    const result = await queryOrder(orderId);
    const status = result.order?.status || 'pending';
    onStatusChange(status as 'pending' | 'paid' | 'failed');
    if (status === 'paid') return true;
    if (status === 'failed') return false;
    await new Promise((resolve) => setTimeout(resolve, interval));
  }
  return false;
}

// ===== 模拟模式（后端未配置时使用） =====

export async function mockCreateOrder(planType: 'single' | 'lifetime'): Promise<{
  success: boolean;
  orderId: string;
  tradeType: 'native' | 'h5';
  amount: number;
  codeUrl?: string;
  h5Url?: string;
  planType: string;
}> {
  await new Promise((r) => setTimeout(r, 800));
  return {
    success: true,
    orderId: `MOCK${Date.now()}`,
    tradeType: 'native',
    amount: planType === 'single' ? 9.9 : 39,
    planType,
  };
}

export async function mockConfirmPayment(orderId: string): Promise<boolean> {
  await new Promise((r) => setTimeout(r, 500));
  console.log(`[模拟支付] 订单 ${orderId} 已确认`);
  return true;
}
