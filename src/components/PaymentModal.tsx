import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, Check, Crown, Zap, MessageCircle, Copy, KeyRound } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  plan: 'single' | 'lifetime' | null;
}

type Step = 'pay' | 'confirm';

export default function PaymentModal({
  isOpen,
  onClose,
  onSuccess,
  plan,
}: PaymentModalProps) {
  const [step, setStep] = useState<Step>('pay');
  const [copied, setCopied] = useState(false);

  const planInfo = {
    single: {
      title: '单次测算',
      price: '9.90',
      desc: '解锁一次完整测算报告',
      alipayQr: '/images/alipay-qr.jpg',
    },
    lifetime: {
      title: '终身会员',
      price: '39.00',
      desc: '永久解锁全部测算功能',
      alipayQr: '/images/alipay-qr.jpg',
    },
  };

  const info = plan ? planInfo[plan] : null;
  const customerServiceWechat = 'kaiyunbao888'; // 客服微信号

  useEffect(() => {
    if (isOpen) setStep('pay');
  }, [isOpen]);

  const handleCopy = () => {
    navigator.clipboard.writeText(customerServiceWechat).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (!isOpen || !info) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[rgba(0,0,0,0.7)] backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-sm liquid-glass-strong rounded-3xl overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 interactive p-1 rounded-full hover:bg-[rgba(246,249,255,0.08)] transition-colors"
        >
          <X className="w-5 h-5 text-[rgba(246,249,255,0.5)]" />
        </button>

        {/* Step 1: 扫码支付 */}
        {step === 'pay' && (
          <div className="p-6 md:p-8 text-center">
            {/* Header */}
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

            {/* Alipay QR Code */}
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
                  onError={(e) => { (e.target as HTMLImageElement).src = '/images/sun-moon.jpg'; }}
                />
              </div>
            </div>

            {/* Instructions */}
            <div className="mb-5 p-3 rounded-xl bg-[rgba(239,182,255,0.05)] border border-[rgba(239,182,255,0.1)] text-left">
              <p className="text-sm text-[rgba(246,249,255,0.8)] leading-relaxed">
                <span className="text-[#efb6ff]">1.</span> 使用支付宝扫码付款 ¥{info.price}
                <br />
                <span className="text-[#efb6ff]">2.</span> 截屏保存付款凭证
                <br />
                <span className="text-[#efb6ff]">3.</span> 添加客服微信，发送付款截图
              </p>
            </div>

            <button
              onClick={() => setStep('confirm')}
              className="w-full py-4 rounded-xl font-medium bg-[#efb6ff] text-[#051d1f] interactive hover:bg-[#f0c4ff] transition-colors"
            >
              我已付款，联系客服开通
            </button>
          </div>
        )}

        {/* Step 2: 联系客服 */}
        {step === 'confirm' && (
          <div className="p-6 md:p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-[rgba(0,200,150,0.15)] flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-[#00c896]" />
            </div>
            <h3 className="text-xl font-bold text-[#f6f9ff] mb-2">联系客服开通</h3>
            <p className="text-sm text-[rgba(246,249,255,0.6)] mb-6 leading-relaxed">
              请添加客服微信，发送付款截图
              <br />
              客服确认后将立即为您开通权益
            </p>

            {/* Customer Service WeChat ID */}
            <div className="mb-6 p-4 rounded-xl bg-[rgba(239,182,255,0.08)] border border-[rgba(239,182,255,0.15)]">
              <p className="text-xs text-[rgba(246,249,255,0.5)] mb-2">客服微信号</p>
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl font-bold text-[#efb6ff] tracking-wider">
                  {customerServiceWechat}
                </span>
                <button
                  onClick={handleCopy}
                  className="interactive p-2 rounded-lg hover:bg-[rgba(239,182,255,0.15)] transition-colors"
                  title="复制微信号"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-[#00c896]" />
                  ) : (
                    <Copy className="w-4 h-4 text-[rgba(246,249,255,0.5)]" />
                  )}
                </button>
              </div>
              {copied && <p className="text-xs text-[#00c896] mt-1">已复制到剪贴板</p>}
            </div>

            {/* Steps */}
            <div className="text-left mb-6 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[rgba(239,182,255,0.15)] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs text-[#efb6ff] font-bold">1</span>
                </div>
                <p className="text-sm text-[rgba(246,249,255,0.7)]">打开微信，搜索并添加客服微信号</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[rgba(239,182,255,0.15)] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs text-[#efb6ff] font-bold">2</span>
                </div>
                <p className="text-sm text-[rgba(246,249,255,0.7)]">发送付款截图给客服</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[rgba(239,182,255,0.15)] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs text-[#efb6ff] font-bold">3</span>
                </div>
                <p className="text-sm text-[rgba(246,249,255,0.7)]">客服发送激活码给你</p>
              </div>
            </div>

            <Link
              to="/activate"
              onClick={onClose}
              className="w-full py-4 rounded-xl font-medium bg-[#efb6ff] text-[#051d1f] interactive hover:bg-[#f0c4ff] transition-colors flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              去激活会员
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
