import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { X, Check, Crown, Zap, MessageCircle, Copy, KeyRound, Loader2, ExternalLink } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  plan: 'single' | 'lifetime' | null;
}

type Step = 'loading' | 'pay' | 'alipay' | 'confirm' | 'polling' | 'success' | 'error';

export default function PaymentModal({
  isOpen,
  onClose,
  onSuccess,
  plan,
}: PaymentModalProps) {
  const [step, setStep] = useState<Step>('pay');
  const [copied, setCopied] = useState(false);
  const [orderNo, setOrderNo] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [apiAvailable, setApiAvailable] = useState(true);
  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const planInfo = {
    single: { title: '单次测算', price: '9.90', desc: '解锁一次完整测算报告' },
    lifetime: { title: '终身会员', price: '39.00', desc: '永久解锁全部测算功能' },
  };

  const info = plan ? planInfo[plan] : null;
  const customerServiceWechat = 'kaiyunbao888';

  // 获取当前登录用户ID
  const getUserId = (): string => {
    try {
      const user = JSON.parse(localStorage.getItem('mycurrentuser') || '{}');
      return user.email || user.username || 'guest';
    } catch {
      return 'guest';
    }
  };

  useEffect(() => {
    if (isOpen) {
      setStep('pay');
      setErrorMsg('');
      setApiAvailable(true);
    }
    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    };
  }, [isOpen]);

  // 创建订单并发起支付
  const handleCreateOrder = async () => {
    if (!plan) return;
    setStep('loading');

    try {
      const res = await fetch('/api/alipay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, userId: getUserId() }),
      });

      const data = await res.json();

      if (!data.success) {
        // API 未配置或其他错误，回退到扫码模式
        if (data.error?.includes('配置')) {
          setApiAvailable(false);
          setStep('pay');
          return;
        }
        throw new Error(data.message || '创建订单失败');
      }

      setOrderNo(data.orderNo);

      // 如果返回 HTML 表单，直接渲染提交
      if (data.payForm) {
        setStep('alipay');
        setTimeout(() => {
          if (formRef.current) {
            const form = formRef.current.querySelector('form');
            if (form) {
              form.setAttribute('target', '_blank');
              form.submit();
            }
          }
          // 开始轮询
          startPolling(data.orderNo);
        }, 500);
        return;
      }

      // 如果返回 URL，打开新窗口
      if (data.payUrl) {
        window.open(data.payUrl, '_blank');
        startPolling(data.orderNo);
        setStep('polling');
        return;
      }

      // 没有可用的支付方式，回退扫码
      setApiAvailable(false);
      setStep('pay');
    } catch (err: any) {
      console.error('支付接口错误:', err);
      setApiAvailable(false);
      setStep('pay');
    }
  };

  // 轮询订单状态
  const startPolling = (orderNum: string) => {
    setStep('polling');
    let attempts = 0;
    const maxAttempts = 60; // 最多轮询5分钟

    pollTimerRef.current = setInterval(async () => {
      attempts++;
      if (attempts > maxAttempts) {
        if (pollTimerRef.current) clearInterval(pollTimerRef.current);
        setStep('error');
        setErrorMsg('支付超时，请检查支付状态或联系客服');
        return;
      }

      try {
        const res = await fetch(`/api/alipay/query-order?orderNo=${orderNum}`);
        const data = await res.json();

        if (data.status === 'paid') {
          if (pollTimerRef.current) clearInterval(pollTimerRef.current);
          setStep('success');
          onSuccess();
        }
      } catch {
        // 轮询出错继续
      }
    }, 5000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(customerServiceWechat).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (!isOpen || !info) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[rgba(0,0,0,0.7)] backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-sm liquid-glass-strong rounded-3xl overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 interactive p-1 rounded-full hover:bg-[rgba(246,249,255,0.08)] transition-colors"
        >
          <X className="w-5 h-5 text-[rgba(246,249,255,0.5)]" />
        </button>

        {/* Loading */}
        {step === 'loading' && (
          <div className="p-8 text-center">
            <Loader2 className="w-10 h-10 text-[#efb6ff] animate-spin mx-auto mb-4" />
            <p className="text-[#f6f9ff]">正在创建订单...</p>
          </div>
        )}

        {/* Pay Selection */}
        {step === 'pay' && (
          <div className="p-6 md:p-8 text-center">
            <div className="mb-5">
              <div className="w-14 h-14 rounded-2xl bg-[rgba(239,182,255,0.1)] flex items-center justify-center mx-auto mb-3">
                {plan === 'lifetime' ? (
                  <Crown className="w-7 h-7 text-[#efb6ff]" />
                ) : (
                  <Zap className="w-7 h-7 text-[#efb6ff]" />
                )}
              </div>
              <h3 className="text-xl font-bold text-[#f6f9ff] mb-1">{info.title}</h3>
              <p className="text-sm text-[rgba(246,249,255,0.5)] mb-3">{info.desc}</p>
              <div className="inline-block px-4 py-2 rounded-full bg-[rgba(239,182,255,0.08)]">
                <span className="text-2xl font-bold text-[#efb6ff]">¥{info.price}</span>
              </div>
            </div>

            {/* API 支付按钮 */}
            <button
              onClick={handleCreateOrder}
              className="w-full py-4 rounded-xl font-medium bg-[#1677FF] text-white interactive hover:bg-[#4096FF] transition-colors flex items-center justify-center gap-2 mb-4"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                <path d="M5.5 2h13A2.5 2.5 0 0 1 21 4.5v15a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 19.5v-15A2.5 2.5 0 0 1 5.5 2zm.75 14.5a.75.75 0 0 0 0 1.5h11.5a.75.75 0 0 0 0-1.5H6.25zM12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
              </svg>
              支付宝直接支付
            </button>

            {/* 扫码备用 */}
            {!apiAvailable && (
              <>
                <div className="bg-white rounded-2xl p-4 mb-5 inline-block">
                  <p className="text-sm text-[#1677FF] font-semibold mb-3 flex items-center justify-center gap-2">
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#1677FF">
                      <path d="M5.5 2h13A2.5 2.5 0 0 1 21 4.5v15a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 19.5v-15A2.5 2.5 0 0 1 5.5 2zm.75 14.5a.75.75 0 0 0 0 1.5h11.5a.75.75 0 0 0 0-1.5H6.25zM12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
                    </svg>
                    支付宝扫码支付
                  </p>
                  <div className="w-44 h-44 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                    <img
                      src="/images/alipay-qr.jpg"
                      alt="支付宝收款码"
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  </div>
                </div>

                <button
                  onClick={() => setStep('confirm')}
                  className="w-full py-4 rounded-xl font-medium liquid-glass text-[#f6f9ff] interactive hover:text-[#efb6ff] transition-colors"
                >
                  我已付款，联系客服开通
                </button>
              </>
            )}

            <p className="text-xs text-[rgba(246,249,255,0.3)] mt-3">
              {apiAvailable ? '点击上方按钮将跳转支付宝完成支付' : 'API未配置，请使用扫码支付'}
            </p>
          </div>
        )}

        {/* Alipay Form Submit */}
        {step === 'alipay' && (
          <div className="p-6 text-center">
            <Loader2 className="w-10 h-10 text-[#efb6ff] animate-spin mx-auto mb-4" />
            <p className="text-[#f6f9ff] mb-2">正在跳转支付宝...</p>
            <p className="text-xs text-[rgba(246,249,255,0.5)]">请在新窗口完成支付</p>
            <div ref={formRef} className="hidden" />
          </div>
        )}

        {/* Polling */}
        {step === 'polling' && (
          <div className="p-8 text-center">
            <Loader2 className="w-10 h-10 text-[#efb6ff] animate-spin mx-auto mb-4" />
            <p className="text-[#f6f9ff] mb-2">等待支付完成...</p>
            <p className="text-xs text-[rgba(246,249,255,0.5)] mb-4">请在支付宝页面完成付款</p>
            <button
              onClick={() => {
                if (pollTimerRef.current) clearInterval(pollTimerRef.current);
                setStep('pay');
              }}
              className="text-sm text-[rgba(246,249,255,0.4)] hover:text-[rgba(246,249,255,0.7)]"
            >
              取消等待
            </button>
          </div>
        )}

        {/* Success */}
        {step === 'success' && (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-[rgba(0,200,150,0.15)] flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-[#00c896]" />
            </div>
            <h3 className="text-xl font-bold text-[#f6f9ff] mb-2">支付成功！</h3>
            <p className="text-sm text-[rgba(246,249,255,0.6)] mb-6">会员权益已激活</p>
            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl font-medium bg-[#efb6ff] text-[#051d1f] interactive hover:bg-[#f0c4ff] transition-colors"
            >
              去使用
            </button>
          </div>
        )}

        {/* Error */}
        {step === 'error' && (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-[rgba(255,100,100,0.15)] flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-[#ff6464]" />
            </div>
            <h3 className="text-xl font-bold text-[#f6f9ff] mb-2">支付超时</h3>
            <p className="text-sm text-[rgba(246,249,255,0.6)] mb-6">{errorMsg}</p>
            <Link
              to="/activate"
              onClick={onClose}
              className="w-full py-3 rounded-xl font-medium bg-[#efb6ff] text-[#051d1f] interactive hover:bg-[#f0c4ff] transition-colors flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              使用激活码开通
            </Link>
          </div>
        )}

        {/* Customer Service Fallback */}
        {step === 'confirm' && (
          <div className="p-6 md:p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-[rgba(0,200,150,0.15)] flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-[#00c896]" />
            </div>
            <h3 className="text-xl font-bold text-[#f6f9ff] mb-2">联系客服开通</h3>
            <p className="text-sm text-[rgba(246,249,255,0.6)] mb-6">
              请添加客服微信，发送付款截图
            </p>
            <div className="mb-6 p-4 rounded-xl bg-[rgba(239,182,255,0.08)] border border-[rgba(239,182,255,0.15)]">
              <p className="text-xs text-[rgba(246,249,255,0.5)] mb-2">客服微信号</p>
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl font-bold text-[#efb6ff] tracking-wider">{customerServiceWechat}</span>
                <button onClick={handleCopy} className="interactive p-2 rounded-lg hover:bg-[rgba(239,182,255,0.15)]">
                  {copied ? <Check className="w-4 h-4 text-[#00c896]" /> : <Copy className="w-4 h-4 text-[rgba(246,249,255,0.5)]" />}
                </button>
              </div>
            </div>
            <Link to="/activate" onClick={onClose} className="w-full py-4 rounded-xl font-medium bg-[#efb6ff] text-[#051d1f] interactive hover:bg-[#f0c4ff] transition-colors flex items-center justify-center gap-2">
              <KeyRound className="w-4 h-4" /> 去激活会员
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
