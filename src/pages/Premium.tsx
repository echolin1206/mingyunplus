import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Crown, Infinity, Check, Star, Zap, Shield, Gift, KeyRound, User, Calendar } from 'lucide-react';
import PaymentModal from '../components/PaymentModal';
import { getCurrentUser } from './Login';

const singleFeatures = [
  '单次八字精批',
  '姓名五格分析',
  '生命灵数解读',
  '星座运势查询',
  '当日有效',
];

const lifetimeFeatures = [
  '全部单次版功能',
  '无限次八字精批',
  '流年运势预测',
  '塔罗牌阵推演',
  '缘分深度配对',
  '每日运势推送',
  '专属命理顾问',
  '优先测算通道',
  '新功能抢先体验',
  '终身免费更新',
];

function PricingCard({
  title,
  price,
  period,
  features,
  highlighted,
  icon,
  onSelect,
  disabled = false,
}: {
  title: string;
  price: string;
  period: string;
  features: string[];
  highlighted: boolean;
  icon: React.ReactNode;
  onSelect: () => void;
  disabled?: boolean;
}) {
  return (
    <div
      className={`relative rounded-3xl p-6 md:p-8 transition-all duration-500 hover:scale-[1.02] ${
        highlighted
          ? 'liquid-glass-strong border-2 border-[rgba(239,182,255,0.3)]'
          : 'liquid-glass'
      }`}
    >
      {highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#efb6ff] text-[#051d1f] text-xs font-bold flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          推荐
        </div>
      )}

      <div className="text-center mb-6">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
          highlighted ? 'bg-[rgba(239,182,255,0.15)]' : 'bg-[rgba(246,249,255,0.05)]'
        }`}>
          <div className={highlighted ? 'text-[#efb6ff]' : 'text-[rgba(246,249,255,0.6)]'}>
            {icon}
          </div>
        </div>
        <h3 className="text-xl font-bold text-[#f6f9ff] mb-1">{title}</h3>
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-4xl font-bold text-[#f6f9ff]">¥{price}</span>
          <span className="text-sm text-[rgba(246,249,255,0.5)]">{period}</span>
        </div>
      </div>

      <ul className="space-y-3 mb-8">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
              highlighted ? 'bg-[rgba(239,182,255,0.15)]' : 'bg-[rgba(0,200,150,0.1)]'
            }`}>
              <Check className={`w-3 h-3 ${highlighted ? 'text-[#efb6ff]' : 'text-[#00c896]'}`} />
            </div>
            <span className="text-sm text-[rgba(246,249,255,0.8)]">{feature}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={onSelect}
        disabled={disabled}
        className={`w-full py-4 rounded-xl font-medium interactive transition-all ${
          disabled
            ? 'bg-[rgba(0,200,150,0.1)] text-[#00c896] cursor-default'
            : highlighted
              ? 'bg-[#efb6ff] text-[#051d1f] hover:bg-[#f0c4ff]'
              : 'liquid-glass text-[#f6f9ff] hover:text-[#efb6ff]'
        }`}
      >
        {disabled ? (
          <span className="flex items-center justify-center gap-2">
            <Check className="w-4 h-4" />
            已开通
          </span>
        ) : highlighted ? (
          '立即开通终身会员'
        ) : (
          '购买单次测算'
        )}
      </button>
    </div>
  );
}

const testimonials = [
  {
    name: '小雨',
    sign: '天蝎座',
    text: '八字精批的结果让我大吃一惊，说中了我事业的转折点和感情的走向。39元终身会员真的很值！',
    rating: 5,
  },
  {
    name: '阿杰',
    sign: '双子座',
    text: '每天看宜忌已经成为习惯了，真的帮我避开了很多不必要的麻烦。网站设计也很有格调。',
    rating: 5,
  },
  {
    name: '琳娜',
    sign: '双鱼座',
    text: '缘分配对的功能特别有趣，和男朋友测了一下，居然有88%的匹配度！现在我们已经订婚了。',
    rating: 5,
  },
  {
    name: '大明',
    sign: '摩羯座',
    text: '作为一个理性的人，本来是抱着娱乐的心态来的。但姓名测试的结果意外的准确，推荐尝试。',
    rating: 4,
  },
];

export default function Premium() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'single' | 'lifetime' | null>(null);
  const [currentUser, setCurrentUser] = useState(getCurrentUser());

  useEffect(() => {
    window.scrollTo(0, 0);
    // 监听会员状态变化
    const checkMember = () => setCurrentUser(getCurrentUser());
    window.addEventListener('storage', checkMember);
    return () => window.removeEventListener('storage', checkMember);
  }, []);

  const handleSelect = (plan: 'single' | 'lifetime') => {
    setSelectedPlan(plan);
    setPaymentOpen(true);
  };

  const faqs = [
    {
      q: '单次测算和终身会员有什么区别？',
      a: '单次测算只能使用一次指定的测算功能，当日有效。终身会员可以无限次使用所有测算功能，包括未来新上线的功能，一次付费永久使用。',
    },
    {
      q: '测算结果准确吗？',
      a: '我们的测算基于传统命理学原理，结合现代数据分析技术。测算结果仅供参考和娱乐，人生的走向最终还是由你自己的选择和努力决定。',
    },
    {
      q: '可以退款吗？',
      a: '虚拟产品使用后不支持退款。激活码一经使用即视为服务已交付，无法退换。购买前请确认您的需求。',
    },
    {
      q: '个人信息安全吗？',
      a: '我们采用银行级加密技术保护您的个人信息，绝不会将您的信息泄露给第三方或用于商业用途。',
    },
  ];

  return (
    <>
      <div className="min-h-screen pt-20 pb-16" style={{ background: '#051d1f' }}>
        {/* Hero */}
        <div className="px-6 mb-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1
              className="text-4xl md:text-6xl font-bold tracking-tight text-[#f6f9ff] mb-6 glow-text"
              style={{ fontFamily: 'Oswald, sans-serif' }}
            >
              解锁你的命运密码
            </h1>
            <p className="text-lg text-[rgba(246,249,255,0.6)] max-w-2xl mx-auto leading-relaxed">
              无论是好奇心的驱使，还是对未来的期许，命运加法都将为你揭示星辰背后的秘密
            </p>
          </div>
        </div>

        {/* Member Status Card */}
        {currentUser && currentUser.memberType !== 'none' && (
          <div className="px-6 mb-16">
            <div className="max-w-lg mx-auto liquid-glass-strong rounded-3xl p-8 text-center border-2 border-[rgba(239,182,255,0.2)]">
              <div className="w-20 h-20 rounded-full bg-[rgba(239,182,255,0.1)] flex items-center justify-center mx-auto mb-4">
                {currentUser.memberType === 'lifetime' ? (
                  <Crown className="w-10 h-10 text-[#efb6ff]" />
                ) : (
                  <Zap className="w-10 h-10 text-[#00c896]" />
                )}
              </div>
              <h2 className="text-2xl font-bold text-[#f6f9ff] mb-2">
                {currentUser.memberType === 'lifetime' ? '终身会员' : '单次测算权益'}
              </h2>
              <div className="flex items-center justify-center gap-4 mb-4 text-sm text-[rgba(246,249,255,0.5)]">
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {currentUser.username}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {currentUser.memberType === 'lifetime' ? '永久有效' : '当日有效'}
                </span>
              </div>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                currentUser.memberType === 'lifetime'
                  ? 'bg-[rgba(239,182,255,0.15)] text-[#efb6ff]'
                  : 'bg-[rgba(0,200,150,0.1)] text-[#00c896]'
              }`}>
                <Check className="w-4 h-4" />
                {currentUser.memberType === 'lifetime'
                  ? '已解锁全部测算功能'
                  : '已激活单次测算权益'}
              </div>
              {currentUser.memberType === 'single' && (
                <p className="mt-3 text-xs text-[rgba(246,249,255,0.4)]">
                  单次权益使用后失效，建议升级终身会员
                </p>
              )}
            </div>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="px-6 mb-20">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            <PricingCard
              title="单次测算"
              price="9.9"
              period="/次"
              features={singleFeatures}
              highlighted={false}
              icon={<Zap className="w-6 h-6" />}
              onSelect={() => handleSelect('single')}
              disabled={currentUser?.memberType === 'single' || currentUser?.memberType === 'lifetime'}
            />
            <PricingCard
              title="终身会员"
              price="39"
              period="终身"
              features={lifetimeFeatures}
              highlighted={true}
              icon={<Crown className="w-6 h-6" />}
              onSelect={() => handleSelect('lifetime')}
              disabled={currentUser?.memberType === 'lifetime'}
            />
          </div>
        </div>

        {/* Features Grid */}
        <div className="px-6 mb-20">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-[#f6f9ff] mb-10">
              会员专享权益
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: <Infinity className="w-6 h-6" />, title: '无限测算', desc: '不限制使用次数' },
                { icon: <Star className="w-6 h-6" />, title: '完整报告', desc: '深度详细分析' },
                { icon: <Sparkles className="w-6 h-6" />, title: '每日推送', desc: '专属运势提醒' },
                { icon: <Shield className="w-6 h-6" />, title: '隐私保护', desc: '银行级加密' },
                { icon: <Zap className="w-6 h-6" />, title: '优先通道', desc: '免排队等待' },
                { icon: <Gift className="w-6 h-6" />, title: '新功能抢先', desc: '优先体验新功能' },
                { icon: <Crown className="w-6 h-6" />, title: '专属顾问', desc: '一对一咨询' },
                { icon: <Infinity className="w-6 h-6" />, title: '终身更新', desc: '持续功能迭代' },
              ].map((feature, i) => (
                <div key={i} className="liquid-glass rounded-2xl p-5 text-center group hover:scale-105 transition-transform">
                  <div className="text-[#efb6ff] mb-3 group-hover:scale-110 transition-transform inline-block">
                    {feature.icon}
                  </div>
                  <h4 className="text-sm font-semibold text-[#f6f9ff] mb-1">{feature.title}</h4>
                  <p className="text-xs text-[rgba(246,249,255,0.5)]">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="px-6 mb-20">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-[#f6f9ff] mb-10">
              用户评价
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {testimonials.map((t, i) => (
                <div key={i} className="liquid-glass rounded-2xl p-6">
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, si) => (
                      <Star
                        key={si}
                        className={`w-4 h-4 ${si < t.rating ? 'text-[#efb6ff] fill-[#efb6ff]' : 'text-[rgba(246,249,255,0.2)]'}`}
                      />
                    ))}
                  </div>
                  <p className="text-[rgba(246,249,255,0.8)] text-sm leading-relaxed mb-4">{t.text}</p>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[rgba(239,182,255,0.15)] flex items-center justify-center text-xs text-[#efb6ff] font-semibold">
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="text-sm text-[#f6f9ff]">{t.name}</p>
                      <p className="text-xs text-[rgba(246,249,255,0.4)]">{t.sign}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activate Code Entry */}
        <div className="px-6 mb-20">
          <div className="max-w-lg mx-auto liquid-glass rounded-3xl p-8 text-center">
            <KeyRound className="w-10 h-10 text-[#efb6ff] mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-[#f6f9ff] mb-2">已有激活码？</h2>
            <p className="text-sm text-[rgba(246,249,255,0.6)] mb-6">
              如果你已经从客服获得了激活码，点击下方按钮立即开通会员
            </p>
            <Link
              to="/activate"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-medium bg-[#efb6ff] text-[#051d1f] interactive hover:bg-[#f0c4ff] transition-colors"
            >
              <KeyRound className="w-5 h-5" />
              输入激活码
            </Link>
          </div>
        </div>

        {/* FAQ */}
        <div className="px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-[#f6f9ff] mb-10">
              常见问题
            </h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="liquid-glass rounded-xl overflow-hidden">
                  <button
                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left interactive"
                  >
                    <span className="text-sm font-medium text-[#f6f9ff]">{faq.q}</span>
                    <span className={`text-[#efb6ff] transition-transform ${activeFaq === i ? 'rotate-45' : ''}`}>
                      +
                    </span>
                  </button>
                  {activeFaq === i && (
                    <div className="px-6 pb-4">
                      <p className="text-sm text-[rgba(246,249,255,0.7)] leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <PaymentModal
        isOpen={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        onSuccess={() => {
          // 支付成功后的处理
          window.location.reload();
        }}
        plan={selectedPlan}
      />
    </>
  );
}
