/**
 * 命运加法 - 后端 API 接口封装
 * 
 * 使用说明：
 * 1. 开发/未配置后端时：API_BASE 为空，自动回退到模拟支付模式
 * 2. 配置后端后：设置环境变量 VITE_API_BASE=https://api.mingyunpluse.com
 * 
 * 部署到 Vercel 时，在 Environment Variables 中添加：
 * VITE_API_BASE = https://api.mingyunpluse.com
 */

const API_BASE = import.meta.env.VITE_API_BASE || '';

// 是否使用模拟模式（没有配置后端时）
export const IS_MOCK = !API_BASE;

interface CreateOrderResponse {
  success: boolean;
  orderId: string;
  tradeType: 'native' | 'h5';
  amount: number;
  codeUrl?: string;
  h5Url?: string;
  planType: string;
}

interface OrderStatusResponse {
  success: boolean;
  order: {
    id: string;
    status: 'pending' | 'paid' | 'failed';
    amount: number;
    planType: string;
    tradeType: string;
    createdAt: number;
    paidAt?: number;
    codeUrl?: string;
    h5Url?: string;
  };
}

// 模拟创建订单（未配置后端时使用）
async function mockCreateOrder(planType: 'single' | 'lifetime'): Promise<CreateOrderResponse> {
  // 模拟网络延迟
  await new Promise((resolve) => setTimeout(resolve, 800));

  const orderId = `MOCK${Date.now()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  const amount = planType === 'single' ? 990 : 3900;

  // 模拟二维码链接（真实环境中是微信支付返回的链接）
  const mockCodeUrl = `weixin://wxpay/bizpayurl?pr=${Math.random().toString(36).slice(2, 10)}`;

  return {
    success: true,
    orderId,
    tradeType: 'native',
    amount,
    codeUrl: mockCodeUrl,
    planType,
  };
}

// 模拟查询订单
async function mockQueryOrder(): Promise<OrderStatusResponse> {
  // 模拟：默认返回 pending，等待用户操作
  return {
    success: true,
    order: {
      id: 'mock',
      status: 'pending',
      amount: 0,
      planType: 'single',
      tradeType: 'native',
      createdAt: Date.now(),
    },
  };
}

// 模拟支付成功确认
export async function mockConfirmPayment(orderId: string): Promise<boolean> {
  // 模拟延迟
  await new Promise((resolve) => setTimeout(resolve, 500));
  console.log(`[模拟支付] 订单 ${orderId} 已确认支付`);
  return true;
}

// 创建支付订单
export async function createOrder(
  planType: 'single' | 'lifetime',
  description?: string
): Promise<CreateOrderResponse> {
  if (IS_MOCK) {
    return mockCreateOrder(planType);
  }

  const response = await fetch(`${API_BASE}/api/order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ planType, description }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || '创建订单失败');
  }

  return response.json();
}

// 查询订单状态
export async function queryOrder(orderId: string): Promise<OrderStatusResponse> {
  if (IS_MOCK) {
    return mockQueryOrder();
  }

  const response = await fetch(`${API_BASE}/api/order/${orderId}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || '查询订单失败');
  }

  return response.json();
}

// 轮询订单状态（直到支付完成或超时）
export async function pollOrderStatus(
  orderId: string,
  onStatusChange: (status: 'pending' | 'paid' | 'failed') => void,
  maxAttempts = 60,
  interval = 2000
): Promise<boolean> {
  // 模拟模式下不走轮询，由用户手动确认
  if (IS_MOCK) {
    onStatusChange('pending');
    // 模拟模式下等待 5 秒后自动成功（给用户一个确认支付的过程）
    await new Promise((resolve) => setTimeout(resolve, 3000));
    onStatusChange('pending');
    // 注意：模拟模式下需要用户手动点击"已完成支付"来触发确认
    return false;
  }

  for (let i = 0; i < maxAttempts; i++) {
    const result = await queryOrder(orderId);
    const status = result.order.status;

    onStatusChange(status);

    if (status === 'paid') return true;
    if (status === 'failed') return false;

    await new Promise((resolve) => setTimeout(resolve, interval));
  }

  return false;
}
