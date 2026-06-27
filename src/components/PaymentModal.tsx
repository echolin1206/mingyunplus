import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Check, Loader2, Crown, Zap, ShieldCheck, QrCode, ExternalLink } from 'lucide-react';
import { createOrder, pollOrderStatus, mockConfirmPayment, IS_MOCK } from '../lib/api';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  plan: 'single' | 'lifetime' | null;
  description?: string;
}

type Step = 'loading' | 'qr' | 'h5' | 'polling' | 'success' | 'error';

export default function PaymentModal({
  isOpen,
  onClose,
  onSuccess,
  plan,
  description,
}: PaymentModalProps) {
  const [step, setStep] = useState<Step>('loading');
  const [error, setError] = useState('');
  const [orderId, setOrderId] = useState('');
  const [codeUrl, setCodeUrl] = useState('');
  const [h5Url, setH5Url] = useState('');
  const [tradeType, setTradeType] = useState<'native' | 'h5'>('native');
  const pollingRef = useRef(false);

  const planInfo = {
    single: { title: '单次测算', price: '9.90', desc: description || '解锁一次完整测算报告' },
    lifetime: { title: '终身会员', price: '39.00', desc: description || '永久解锁全部功能' },
  };

  const info = plan ? planInfo[plan] : { title: '', price: '', desc: '' };

  // 创建订单
  const initOrder = useCallback(async () => {
    if (!plan || !isOpen) return;

    setStep('loading');
    setError('');

    try {
      const result = await createOrder(plan, description);
      setOrderId(result.orderId);
      setTradeType(result.tradeType);

      if (result.tradeType === 'native' && result.codeUrl) {
        // PC 端 - 展示二维码
        setCodeUrl(result.codeUrl);
        setStep('qr');
        startPolling(result.orderId);
      } else if (result.tradeType === 'h5' && result.h5Url) {
        // 移动端 - 跳转 H5 支付
        setH5Url(result.h5Url);
        setStep('h5');
        // 自动跳转
        setTimeout(() => {
          window.location.href = result.h5Url!;
        }, 2000);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '创建订单失败';
      setError(msg);
      setStep('error');
    }
  }, [plan, isOpen, description]);

  // 轮询订单状态
  const startPolling = useCallback(
    async (oid: string) => {
      if (pollingRef.current) return;
      pollingRef.current = true;

      try {
        const paid = await pollOrderStatus(oid, (status) => {
          if (status === 'pending') {
            setStep('polling');
          }
        });

        if (paid) {
          setStep('success');
        } else {
          setError('支付未完成或已超时');
          setStep('error');
        }
      } catch {
        setError('查询支付状态失败');
        setStep('error');
      } finally {
        pollingRef.current = false;
      }
    },
    []
  );

  // 手动刷新状态 / 确认支付完成
  const checkStatus = useCallback(async () => {
    if (!orderId) return;

    // 模拟模式：用户点击"已完成支付"直接触发成功
    if (IS_MOCK) {
      setStep('polling');
      await new Promise((resolve) => setTimeout(resolve, 800));
      const success = await mockConfirmPayment(orderId);
      if (success) {
        setStep('success');
      }
      return;
    }

    // 真实模式：轮询查询微信支付状态
    setStep('polling');
    try {
      const paid = await pollOrderStatus(orderId, (status) => {
        if (status === 'pending') setStep('polling');
      }, 15, 2000);

      if (paid) {
        setStep('success');
      } else {
        setStep('qr');
      }
    } catch {
      setStep('qr');
    }
  }, [orderId]);

  useEffect(() => {
    if (isOpen && plan) {
      initOrder();
    }
    return () => {
      pollingRef.current = false;
    };
  }, [isOpen, plan, initOrder]);

  // 支付成功后的处理
  const handleSuccessClose = () => {
    onSuccess();
    onClose();
  };

  if (!isOpen || !plan) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[rgba(0,0,0,0.7)] backdrop-blur-sm" onClick={step === 'success' ? handleSuccessClose : undefined} />

      {/* Modal */}
      <div className="relative w-full max-w-md liquid-glass-strong rounded-3xl overflow-hidden">
        {/* Close button */}
        {step !== 'success' && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 interactive p-1 rounded-full hover:bg-[rgba(246,249,255,0.08)] transition-colors"
          >
            <X className="w-5 h-5 text-[rgba(246,249,255,0.5)]" />
          </button>
        )}

        {/* Loading */}
        {step === 'loading' && (
          <div className="p-8 text-center">
            <Loader2 className="w-10 h-10 text-[#efb6ff] animate-spin mx-auto mb-4" />
            <h3 className="text-lg font-bold text-[#f6f9ff]">正在创建订单...</h3>
            <p className="text-sm text-[rgba(246,249,255,0.5)] mt-2">请稍候</p>
          </div>
        )}

        {/* QR Code - PC 端扫码支付 */}
        {step === 'qr' && (
          <div className="p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 rounded-2xl bg-[rgba(239,182,255,0.1)] flex items-center justify-center mx-auto mb-4">
                {plan === 'lifetime' ? (
                  <Crown className="w-8 h-8 text-[#efb6ff]" />
                ) : (
                  <Zap className="w-8 h-8 text-[#efb6ff]" />
                )}
              </div>
              <h3 className="text-xl font-bold text-[#f6f9ff] mb-1">{info.title}</h3>
              <p className="text-sm text-[rgba(246,249,255,0.5)]">{info.desc}</p>
            </div>

            <div className="mb-2">
              <span className="text-2xl font-bold text-[#f6f9ff]">¥{info.price}</span>
            </div>

            {/* QR Code */}
            <div className="bg-white rounded-2xl p-4 mb-4 inline-block">
              {codeUrl ? (
                <div className="w-44 h-44 relative">
                  {/* 使用 qrcode 库生成真实二维码更好，这里用占位 */}
                  <svg viewBox="0 0 200 200" className="w-full h-full">
                    <rect x="0" y="0" width="200" height="200" fill="white" />
                    {/* 简化的 QR 图案 - 实际应使用 qrcode 库 */}
                    <rect x="10" y="10" width="50" height="50" fill="none" stroke="#1a1a2e" strokeWidth="4" />
                    <rect x="18" y="18" width="34" height="34" fill="#1a1a2e" />
                    <rect x="26" y="26" width="18" height="18" fill="white" />
                    <rect x="32" y="32" width="6" height="6" fill="#1a1a2e" />

                    <rect x="140" y="10" width="50" height="50" fill="none" stroke="#1a1a2e" strokeWidth="4" />
                    <rect x="148" y="18" width="34" height="34" fill="#1a1a2e" />
                    <rect x="156" y="26" width="18" height="18" fill="white" />
                    <rect x="162" y="32" width="6" height="6" fill="#1a1a2e" />

                    <rect x="10" y="140" width="50" height="50" fill="none" stroke="#1a1a2e" strokeWidth="4" />
                    <rect x="18" y="148" width="34" height="34" fill="#1a1a2e" />
                    <rect x="26" y="156" width="18" height="18" fill="white" />
                    <rect x="32" y="162" width="6" height="6" fill="#1a1a2e" />

                    {/* 中心 logo */}
                    <circle cx="100" cy="100" r="16" fill="none" stroke="#efb6ff" strokeWidth="2" />
                    <text x="100" y="105" textAnchor="middle" fill="#efb6ff" fontSize="10" fontWeight="bold">微</text>

                    {/* 数据区域 */}
                    {Array.from({ length: 20 }).map((_, i) =>
                      Array.from({ length: 20 }).map((_, j) => {
                        const sx = 70 + j * 5;
                        const sy = 10 + i * 5;
                        if (sx < 140 && sy < 140 && (i * j + i + j) % 5 === 0) {
                          return <rect key={`d-${i}-${j}`} x={sx} y={sy} width="3" height="3" fill="#1a1a2e" />;
                        }
                        return null;
                      })
                    )}
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[8px] text-gray-400">请使用微信扫码</span>
                  </div>
                </div>
              ) : (
                <div className="w-44 h-44 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-gray-300 animate-spin" />
                </div>
              )}
            </div>

            {IS_MOCK ? (
              <>
                <p className="text-xs text-[rgba(246,249,255,0.4)] mb-2">
                  模拟支付模式 - 点击下方按钮模拟支付成功
                </p>
                <div className="mb-4 px-4 py-2 rounded-lg bg-[rgba(239,182,255,0.08)] border border-[rgba(239,182,255,0.15)]">
                  <p className="text-xs text-[#efb6ff]">
                    配置真实后端后，此处将显示微信扫码二维码
                  </p>
                </div>
                <button
                  onClick={checkStatus}
                  className="w-full py-3 rounded-xl text-sm font-medium bg-[#efb6ff] text-[#051d1f] interactive hover:bg-[#f0c4ff] transition-colors"
                >
                  模拟支付成功
                </button>
              </>
            ) : (
              <>
                <p className="text-xs text-[rgba(246,249,255,0.4)] mb-2">
                  请使用微信扫一扫完成支付
                </p>
                {codeUrl && (
                  <p className="text-[10px] text-[rgba(246,249,255,0.2)] mb-4 break-all px-4">
                    {codeUrl.slice(0, 60)}...
                  </p>
                )}
                <button
                  onClick={checkStatus}
                  className="w-full liquid-glass py-3 rounded-xl text-sm text-[#f6f9ff] interactive hover:text-[#efb6ff] transition-colors"
                >
                  我已完成支付
                </button>
              </>
            )}
          </div>
        )}

        {/* Polling - 等待支付确认 */}
        {step === 'polling' && (
          <div className="p-8 text-center">
            <Loader2 className="w-10 h-10 text-[#efb6ff] animate-spin mx-auto mb-4" />
            <h3 className="text-lg font-bold text-[#f6f9ff]">正在确认支付...</h3>
            <p className="text-sm text-[rgba(246,249,255,0.5)] mt-2">
              请稍候，正在查询微信支付结果
            </p>
          </div>
        )}

        {/* H5 - 移动端跳转 */}
        {step === 'h5' && (
          <div className="p-8 text-center">
            <Loader2 className="w-10 h-10 text-[#efb6ff] animate-spin mx-auto mb-4" />
            <h3 className="text-lg font-bold text-[#f6f9ff]">正在跳转微信支付...</h3>
            <p className="text-sm text-[rgba(246,249,255,0.5)] mt-2 mb-6">
              即将调起微信支付完成付款
            </p>

            {h5Url && (
              <a
                href={h5Url}
                className="inline-flex items-center gap-2 liquid-glass px-6 py-3 rounded-xl text-sm text-[#f6f9ff] interactive hover:text-[#efb6ff] transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                手动跳转
              </a>
            )}

            <div className="mt-6 pt-4 border-t border-[rgba(246,249,255,0.08)]">
              <button
                onClick={checkStatus}
                className="text-sm text-[rgba(246,249,255,0.4)] hover:text-[#efb6ff] transition-colors interactive"
              >
                已完成支付？点击查询
              </button>
            </div>
          </div>
        )}

        {/* Success */}
        {step === 'success' && (
          <div className="p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-[rgba(0,200,150,0.15)] flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-[#00c896]" />
            </div>

            <h3 className="text-2xl font-bold text-[#f6f9ff] mb-2">
              {plan === 'lifetime' ? '恭喜成为终身会员！' : '支付成功！'}
            </h3>

            <p className="text-sm text-[rgba(246,249,255,0.6)] mb-6">
              {plan === 'lifetime'
                ? '你已解锁全部测算功能，享受终身免费更新'
                : '你已解锁本次测算，快去体验吧'}
            </p>

            <div className="flex items-center justify-center gap-2 mb-8 p-4 rounded-xl bg-[rgba(0,200,150,0.05)] border border-[rgba(0,200,150,0.1)]">
              <ShieldCheck className="w-5 h-5 text-[#00c896]" />
              <span className="text-sm text-[#00c896]">
                {plan === 'lifetime' ? '终身会员权益已激活' : '单次测算权益已激活'}
              </span>
            </div>

            <button
              onClick={handleSuccessClose}
              className="w-full py-4 rounded-xl font-medium liquid-glass text-[#f6f9ff] interactive hover:text-[#efb6ff] transition-colors"
            >
              开始使用
            </button>
          </div>
        )}

        {/* Error */}
        {step === 'error' && (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-[rgba(255,100,100,0.15)] flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-[#ff6464]" />
            </div>
            <h3 className="text-lg font-bold text-[#f6f9ff] mb-2">支付出错</h3>
            <p className="text-sm text-[rgba(246,249,255,0.5)] mb-6">{error || '请稍后重试'}</p>
            <button
              onClick={initOrder}
              className="w-full liquid-glass py-3 rounded-xl text-sm text-[#f6f9ff] interactive hover:text-[#efb6ff] transition-colors"
            >
              重新创建订单
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
