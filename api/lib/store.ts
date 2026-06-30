// 简单的内存存储 - 生产环境建议改用 Redis 或数据库
// Vercel Serverless 每次请求都是独立的，这里用全局变量在单次请求内保持状态

interface Order {
  orderNo: string;
  userId: string;
  plan: 'single' | 'lifetime';
  amount: number;
  status: 'pending' | 'paid' | 'cancelled';
  tradeNo?: string; // 支付宝交易号
  createdAt: number;
  paidAt?: number;
}

// 全局订单存储（内存）
const orders: Map<string, Order> = new Map();

export function createOrder(data: Omit<Order, 'orderNo' | 'createdAt'> & { orderNo: string }): Order {
  const order: Order = {
    ...data,
    createdAt: Date.now(),
  };
  orders.set(data.orderNo, order);
  return order;
}

export function getOrder(orderNo: string): Order | undefined {
  return orders.get(orderNo);
}

export function updateOrder(orderNo: string, update: Partial<Order>): Order | undefined {
  const order = orders.get(orderNo);
  if (order) {
    Object.assign(order, update);
    return order;
  }
  return undefined;
}

export function getOrderByTradeNo(tradeNo: string): Order | undefined {
  for (const order of orders.values()) {
    if (order.tradeNo === tradeNo) return order;
  }
  return undefined;
}

// 清理超过24小时的订单
export function cleanupOldOrders(): void {
  const now = Date.now();
  for (const [key, order] of orders.entries()) {
    if (now - order.createdAt > 24 * 60 * 60 * 1000) {
      orders.delete(key);
    }
  }
}
