import { useState } from 'react';
import { Calendar, Star, TrendingUp, Heart, Briefcase, Coins, Sparkles } from 'lucide-react';

const zodiacSigns = [
  { name: '白羊座', icon: '♈' },
  { name: '金牛座', icon: '♉' },
  { name: '双子座', icon: '♊' },
  { name: '巨蟹座', icon: '♋' },
  { name: '狮子座', icon: '♌' },
  { name: '处女座', icon: '♍' },
  { name: '天秤座', icon: '♎' },
  { name: '天蝎座', icon: '♏' },
  { name: '射手座', icon: '♐' },
  { name: '摩羯座', icon: '♑' },
  { name: '水瓶座', icon: '♒' },
  { name: '双鱼座', icon: '♓' },
];

const fortuneTemplates: Record<string, { overall: string; love: string; career: string; wealth: string }> = {
  '白羊座': { overall: '2025年是白羊座的突破之年。火星的能量将推动你走出舒适区，迎接新的挑战。上半年机遇频现，下半年收获颇丰。', love: '桃花运旺盛，3-5月容易遇到心仪对象。已有伴侣者感情升温，适合共同规划未来。', career: '事业迎来关键转折点，有机会升职或跳槽到更好的平台。保持积极态度，贵人会在关键时刻出现。', wealth: '正财稳定增长，下半年偏财运佳。适合在5月和10月进行理财投资。' },
  '金牛座': { overall: '2025年金牛座稳中有升。土星带来沉稳的能量，适合打基础、做规划。虽然变化不快，但每一步都踏实有力。', love: '感情稳定发展，4月和9月是增进感情的好时机。单身者可能在职场或学习场合遇到良缘。', career: '工作环境趋于稳定，有望获得加薪或额外福利。下半年适合拓展副业。', wealth: '财运平稳上升，储蓄增加。避免冲动消费，稳健投资会带来不错回报。' },
  '双子座': { overall: '2025年双子座充满变化和机遇。水星的守护让你思维敏捷，适合学习新技能和拓展人脉。', love: '社交活跃带来桃花，但要注意分辨真心。6月和11月感情运势最佳。', career: '沟通能力强，适合从事销售、媒体、教育等行业。可能有出差或外派机会。', wealth: '多渠道收入增加，但支出也大。建议做好预算规划，避免不必要的开销。' },
  '巨蟹座': { overall: '2025年巨蟹座聚焦家庭和内心成长。月亮的能量让你情感丰富，直觉敏锐，适合自我提升。', love: '家庭关系和谐，单身者可能通过家人介绍认识对象。8月是感情甜蜜期。', career: '工作状态稳定，适合深耕专业领域。下半年可能有居家办公或灵活工作的机会。', wealth: '房产运势佳，适合考虑置业。理财以保守为主，避免高风险投资。' },
  '狮子座': { overall: '2025年狮子座光芒四射。太阳的能量让你自信满满，领导力和创造力达到高峰，是展现自我的好时机。', love: '魅力值爆表，追求者众多。但要注意不要太过强势，给对方表达的空间。', career: '事业运势强劲，有望获得重要项目或晋升机会。适合创业或担任领导角色。', wealth: '收入大幅增加，但也要注意慷慨过头。适当投资自己会获得更高回报。' },
  '处女座': { overall: '2025年处女座注重细节和完美。水星的守护让你逻辑思维清晰，适合解决复杂问题和优化流程。', love: '务实的态度让你在感情中显得可靠。9月可能遇到志同道合的伴侣。', career: '专业技能得到认可，有望获得行业认证或专业资格。适合深耕技术领域。', wealth: '通过精打细算积累财富。健康相关的投资会带来长期回报。' },
  '天秤座': { overall: '2025年天秤座追求和谐与平衡。金星的守护让你审美在线，人际关系圆融，适合合作类项目。', love: '感情生活甜蜜，适合结婚或同居。单身者在艺术场合容易遇到心动对象。', career: '合作运势佳，适合团队协作或寻找合伙人。下半年可能有海外合作机会。', wealth: '通过合作共赢获得财富。美学相关投资（如艺术品）可能带来意外收益。' },
  '天蝎座': { overall: '2025年天蝎座深度蜕变。冥王星的能量让你洞察一切，适合深入研究和探索未知领域。', love: '深情专一的态度打动对方。注意控制占有欲，给对方适当空间。', career: '适合从事研究、调查、金融等需要深度思考的行业。可能有秘密项目带来突破。', wealth: '投资回报丰厚，尤其是长期项目。保险和遗产相关事宜顺利。' },
  '射手座': { overall: '2025年射手座自由奔放。木星的守护带来好运和扩张的能量，适合旅行、学习和探索。', love: '异地恋或旅行中可能邂逅浪漫。保持开放心态，真爱可能来自意想不到的地方。', career: '适合从事教育、旅游、国际贸易等行业。可能有海外发展机会。', wealth: '远方带来财运，跨境投资或旅行中发现商机。注意控制冒险倾向。' },
  '摩羯座': { overall: '2025年摩羯座稳扎稳打。土星的守护让你责任感倍增，适合制定长期规划并逐步执行。', love: '晚婚晚恋的摩羯座今年感情运上升，可能在年底遇到命中注定的对象。', career: '事业达到新高度，有望获得行业地位或权威认可。适合向上级争取机会。', wealth: '长期投资回报显现，养老金和储蓄增长。适合购置不动产。' },
  '水瓶座': { overall: '2025年水瓶座创新突破。天王星的能量带来革新和独立精神，适合尝试新事物和打破常规。', love: '独特的个性吸引志同道合的人。注意在感情中不要过于理性，适当表达情感。', career: '科技、互联网、社会创新领域运势佳。可能有颠覆性的创意得到认可。', wealth: '新兴行业投资带来回报。加密货币和科技股可能有不错收益，但要控制风险。' },
  '双鱼座': { overall: '2025年双鱼座灵性成长。海王星的守护让你直觉敏锐，富有同情心，适合艺术创作和灵性修行。', love: '浪漫指数爆表，容易陷入梦幻般的恋情。注意区分理想与现实，避免被表象迷惑。', career: '创意和艺术类工作表现出色。适合从事设计、音乐、影视等创意行业。', wealth: '艺术投资可能升值。注意不要被虚假的投资项目所骗，谨慎理财。' },
};

const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

function getMonthlyFortune(signName: string, monthIndex: number) {
  const seed = signName.charCodeAt(0) + monthIndex;
  const scores = {
    overall: 60 + (seed * 7) % 40,
    love: 55 + (seed * 11) % 45,
    career: 58 + (seed * 13) % 42,
    wealth: 52 + (seed * 17) % 48,
  };

  const aspects = [
    '贵人相助，机遇频现',
    '稳扎稳打，积累力量',
    '桃花旺盛，感情甜蜜',
    '事业突破，升职加薪',
    '财运亨通，投资获利',
    '健康注意，劳逸结合',
    '社交活跃，拓展人脉',
    '学习进步，技能提升',
    '家庭和谐，温馨幸福',
    '创意迸发，灵感不断',
    '旅行运佳，开阔眼界',
    '总结收获，规划未来',
  ];

  return {
    ...scores,
    highlight: aspects[(seed + monthIndex) % aspects.length],
  };
}

export default function Yearly() {
  const [selectedSign, setSelectedSign] = useState<string | null>(null);

  const fortune = selectedSign ? fortuneTemplates[selectedSign] : null;

  return (
    <div className="min-h-screen pt-20 pb-16 px-6" style={{ background: '#051d1f' }}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1
            className="text-4xl md:text-5xl font-bold tracking-tight text-[#f6f9ff] mb-4 glow-text"
            style={{ fontFamily: 'Oswald, sans-serif' }}
          >
            2026 流年运势
          </h1>
          <p className="text-[rgba(246,249,255,0.6)]">选择你的星座，查看全年运势预测</p>
        </div>

        {/* Zodiac Selection */}
        {!selectedSign ? (
          <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
            {zodiacSigns.map((sign) => (
              <button
                key={sign.name}
                onClick={() => setSelectedSign(sign.name)}
                className="liquid-glass rounded-2xl p-5 interactive group text-center transition-all duration-300 hover:scale-[1.02]"
              >
                <span className="text-3xl mb-2 block">{sign.icon}</span>
                <p className="text-sm font-semibold text-[#f6f9ff]">{sign.name}</p>
              </button>
            ))}
          </div>
        ) : (
          <div>
            {/* Back Button */}
            <button
              onClick={() => setSelectedSign(null)}
              className="text-[rgba(246,249,255,0.6)] hover:text-[#f6f9ff] mb-6 interactive transition-colors text-sm"
            >
              ← 重新选择星座
            </button>

            {/* Year Overview */}
            <div className="liquid-glass rounded-3xl p-6 md:p-8 mb-8">
              <div className="text-center mb-6">
                <span className="text-4xl mb-2 block">{zodiacSigns.find((s) => s.name === selectedSign)?.icon}</span>
                <h2 className="text-2xl font-bold text-[#f6f9ff]">{selectedSign} · 2026年运势</h2>
              </div>

              {fortune && (
                <>
                  <div className="mb-6 p-4 rounded-xl bg-[rgba(239,182,255,0.05)] border border-[rgba(239,182,255,0.1)]">
                    <h3 className="text-[#efb6ff] font-semibold mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      年度总览
                    </h3>
                    <p className="text-[rgba(246,249,255,0.8)] leading-relaxed">{fortune.overall}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-[rgba(246,249,255,0.03)]">
                      <h4 className="text-sm font-semibold text-[#efb6ff] mb-2 flex items-center gap-1">
                        <Heart className="w-3 h-3" /> 爱情运势
                      </h4>
                      <p className="text-xs text-[rgba(246,249,255,0.7)] leading-relaxed">{fortune.love}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-[rgba(246,249,255,0.03)]">
                      <h4 className="text-sm font-semibold text-[#efb6ff] mb-2 flex items-center gap-1">
                        <Briefcase className="w-3 h-3" /> 事业运势
                      </h4>
                      <p className="text-xs text-[rgba(246,249,255,0.7)] leading-relaxed">{fortune.career}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-[rgba(246,249,255,0.03)]">
                      <h4 className="text-sm font-semibold text-[#efb6ff] mb-2 flex items-center gap-1">
                        <Coins className="w-3 h-3" /> 财富运势
                      </h4>
                      <p className="text-xs text-[rgba(246,249,255,0.7)] leading-relaxed">{fortune.wealth}</p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Monthly Breakdown */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-[#f6f9ff] mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#efb6ff]" />
                月度运势
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {months.map((month, i) => {
                  const mFortune = getMonthlyFortune(selectedSign, i);
                  return (
                    <div key={month} className="liquid-glass rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-[#f6f9ff]">{month}</span>
                        <span className="text-xs text-[#efb6ff]">{mFortune.overall}分</span>
                      </div>
                      <div className="h-1.5 bg-[rgba(246,249,255,0.08)] rounded-full mb-2 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#efb6ff]"
                          style={{ width: `${mFortune.overall}%` }}
                        />
                      </div>
                      <p className="text-xs text-[rgba(246,249,255,0.6)]">{mFortune.highlight}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Score Summary */}
            <div className="liquid-glass rounded-2xl p-6">
              <h3 className="text-lg font-bold text-[#f6f9ff] mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#efb6ff]" />
                年度评分
              </h3>
              {fortune && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: '综合运势', score: 75 + selectedSign.charCodeAt(0) % 20, icon: <Star className="w-4 h-4" /> },
                    { label: '爱情运势', score: 70 + selectedSign.charCodeAt(1) % 25, icon: <Heart className="w-4 h-4" /> },
                    { label: '事业运势', score: 72 + selectedSign.charCodeAt(2) % 23, icon: <Briefcase className="w-4 h-4" /> },
                    { label: '财富运势', score: 68 + selectedSign.charCodeAt(0) % 27, icon: <Coins className="w-4 h-4" /> },
                  ].map((item, i) => (
                    <div key={i} className="text-center">
                      <div className="text-[#efb6ff] mb-1 flex justify-center">{item.icon}</div>
                      <p className="text-2xl font-bold text-[#f6f9ff]">{item.score}</p>
                      <p className="text-xs text-[rgba(246,249,255,0.5)]">{item.label}</p>
                      <div className="h-1 bg-[rgba(246,249,255,0.08)] rounded-full mt-2 overflow-hidden">
                        <div className="h-full bg-[#efb6ff] rounded-full" style={{ width: `${item.score}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
