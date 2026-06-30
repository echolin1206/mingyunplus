import { useState, useEffect } from 'react';
import { Star, Heart, Briefcase, Coins, Users, ChevronLeft, Sparkles } from 'lucide-react';

const zodiacSigns = [
  { name: '白羊座', date: '3.21 - 4.19', element: '火', icon: '♈' },
  { name: '金牛座', date: '4.20 - 5.20', element: '土', icon: '♉' },
  { name: '双子座', date: '5.21 - 6.21', element: '风', icon: '♊' },
  { name: '巨蟹座', date: '6.22 - 7.22', element: '水', icon: '♋' },
  { name: '狮子座', date: '7.23 - 8.22', element: '火', icon: '♌' },
  { name: '处女座', date: '8.23 - 9.22', element: '土', icon: '♍' },
  { name: '天秤座', date: '9.23 - 10.23', element: '风', icon: '♎' },
  { name: '天蝎座', date: '10.24 - 11.22', element: '水', icon: '♏' },
  { name: '射手座', date: '11.23 - 12.21', element: '火', icon: '♐' },
  { name: '摩羯座', date: '12.22 - 1.19', element: '土', icon: '♑' },
  { name: '水瓶座', date: '1.20 - 2.18', element: '风', icon: '♒' },
  { name: '双鱼座', date: '2.19 - 3.20', element: '水', icon: '♓' },
];

const fortuneData: Record<string, {
  overall: number;
  love: number;
  career: number;
  wealth: number;
  social: number;
  summary: string;
  loveDesc: string;
  careerDesc: string;
  wealthDesc: string;
  lucky: { color: string; number: string; direction: string };
}> = {
  '白羊座': {
    overall: 85, love: 78, career: 92, wealth: 70, social: 88,
    summary: '今日火星能量充沛，行动力和决断力达到峰值。适合推进重要计划，但需注意冲动决策带来的风险。保持热情的同时多听取他人建议。',
    loveDesc: '单身者容易在户外活动或运动场合遇到心动对象。有伴侣者适合一起尝试新鲜事物，增进感情。',
    careerDesc: '工作效率极高，领导和同事都对你的表现赞赏有加。重要的会议或谈判安排在今天会有好结果。',
    wealthDesc: '正财稳定，偏财方面有小的意外之喜。但不宜进行大额投资或冒险性消费。',
    lucky: { color: '红色', number: '9', direction: '南方' },
  },
  '金牛座': {
    overall: 72, love: 80, career: 68, wealth: 85, social: 65,
    summary: '金星守护带来稳定的能量，适合整理思绪和规划未来。不要急于求成，稳扎稳打才是你的优势。财务方面有望获得不错的收益。',
    loveDesc: '温柔体贴的一面会打动身边的人。适合安排浪漫的约会或给对方一个惊喜。',
    careerDesc: '节奏较慢的一天，适合处理细节工作和完善已有方案。避免开始全新的项目。',
    wealthDesc: '理财运势佳，适合研究投资方案或咨询专业人士。可能收到之前投资的回报。',
    lucky: { color: '绿色', number: '6', direction: '东北' },
  },
  '双子座': {
    overall: 90, love: 85, career: 88, wealth: 75, social: 95,
    summary: '水星加持，思维敏捷、表达流畅。社交运势爆棚，是拓展人脉、沟通交流的最佳时机。多参加聚会或线上活动。',
    loveDesc: '魅力值满分，言语幽默风趣会吸引不少异性目光。单身者有望在今天脱单。',
    careerDesc: '创意灵感迸发，适合头脑风暴和方案策划。与同事的合作会非常顺利。',
    wealthDesc: '信息就是财富，留意身边的投资资讯。但需甄别真伪，避免被虚假信息误导。',
    lucky: { color: '黄色', number: '5', direction: '西北' },
  },
  '巨蟹座': {
    overall: 68, love: 90, career: 65, wealth: 72, social: 60,
    summary: '月亮能量让你情感细腻，直觉敏锐。适合陪伴家人、整理居家环境。情绪可能会有波动，注意调节心态。',
    loveDesc: '感情运势极佳，与伴侣的默契度提升。单身者可能在家庭聚会中遇到合适的对象。',
    careerDesc: '情绪化可能影响工作效率。建议优先处理熟悉的事务，避免做重大决策。',
    wealthDesc: '家庭相关支出可能增加。不宜借贷或担保，守住现有的财富为上策。',
    lucky: { color: '银色', number: '2', direction: '北方' },
  },
  '狮子座': {
    overall: 88, love: 82, career: 90, wealth: 80, social: 92,
    summary: '太阳的能量让你光芒四射，自信满满。领导力和创造力都处于高峰，适合展现自我、争取机会。保持谦逊会更受欢迎。',
    loveDesc: '自信的态度极具吸引力。但注意不要过于强势，给对方表达的空间。',
    careerDesc: '事业运势强劲，适合向上级汇报工作或争取晋升机会。团队合作中 naturally 成为核心人物。',
    wealthDesc: '收入有望增加，可能有额外的奖金或兼职收入。适当犒劳自己是不错的选择。',
    lucky: { color: '金色', number: '1', direction: '东南' },
  },
  '处女座': {
    overall: 75, love: 70, career: 85, wealth: 78, social: 72,
    summary: '水星让你逻辑清晰、注重细节。适合处理繁琐的工作和整理事务。健康状况需要关注，注意作息规律。',
    loveDesc: '过于追求完美可能让对方感到压力。适当放松标准，享受不完美的美好。',
    careerDesc: '分析能力和执行力都很强，适合处理数据、审核、校对等精细工作。',
    wealthDesc: '通过精打细算可以节省一笔开支。适合制定详细的预算计划。',
    lucky: { color: '棕色', number: '4', direction: '西南' },
  },
  '天秤座': {
    overall: 82, love: 92, career: 78, wealth: 80, social: 88,
    summary: '金星加持，魅力和审美都在线。人际关系和谐，适合社交活动和艺术创作。在做决定时不要过于犹豫。',
    loveDesc: '桃花运旺盛，异性缘极佳。有伴侣者感情甜蜜，适合共度浪漫时光。',
    careerDesc: '需要协调和沟通的场合表现出色。但面对选择时可能会纠结，相信直觉。',
    wealthDesc: '审美相关的投资可能带来回报。适合购买艺术品或时尚单品。',
    lucky: { color: '粉色', number: '7', direction: '西方' },
  },
  '天蝎座': {
    overall: 78, love: 88, career: 82, wealth: 75, social: 70,
    summary: '冥王星能量深沉而有力，直觉异常敏锐。适合深入研究、调查分析。情绪可能较为强烈，注意控制占有欲。',
    loveDesc: '深情的一面会打动对方。但要注意给彼此留有私人空间，过于黏腻可能适得其反。',
    careerDesc: '洞察力强，能发现别人忽略的细节。适合处理复杂的项目和棘手的问题。',
    wealthDesc: '可能有隐藏的收入来源。但要注意风险，避免涉及灰色地带的财务操作。',
    lucky: { color: '深红', number: '8', direction: '东方' },
  },
  '射手座': {
    overall: 92, love: 75, career: 85, wealth: 82, social: 90,
    summary: '木星带来好运和扩张的能量，乐观积极的态度会感染身边的人。适合学习新知识、规划旅行。注意言行一致。',
    loveDesc: '自由奔放的个性很有吸引力。但要让对方感受到你的真诚和专一。',
    careerDesc: '学习能力强，适合参加培训或考取证书。远方的机会值得关注。',
    wealthDesc: '远方相关的投资或跨地域业务可能带来收益。适合规划长期的财务目标。',
    lucky: { color: '紫色', number: '3', direction: '南方' },
  },
  '摩羯座': {
    overall: 80, love: 68, career: 95, wealth: 88, social: 75,
    summary: '土星赋予你坚韧和责任感，事业运势达到顶峰。努力和付出终会得到回报。不要忽视身体健康，适当休息。',
    loveDesc: '事业心强可能让伴侣感到被忽略。抽时间陪伴对方，表达你的关心。',
    careerDesc: '事业运势超级旺盛，上司认可、项目推进顺利。升职加薪的机会就在眼前。',
    wealthDesc: '正财收入稳步增长。长期投资开始显现回报，坚持你的理财策略。',
    lucky: { color: '黑色', number: '10', direction: '北方' },
  },
  '水瓶座': {
    overall: 86, love: 78, career: 80, wealth: 72, social: 90,
    summary: '天王星的创新能量让你充满奇思妙想。适合尝试新事物、接触前沿科技。人际关系活跃，但独处的时间也很宝贵。',
    loveDesc: '独特的个性会吸引志同道合的人。不要被传统观念束缚，勇敢追求真爱。',
    careerDesc: '创新想法得到认可，适合提出改革方案或新技术应用。独立工作比团队协作更高效。',
    wealthDesc: '科技相关的投资可能有惊喜。但需做好风险评估，不要把鸡蛋放在一个篮子里。',
    lucky: { color: '电光蓝', number: '11', direction: '西方' },
  },
  '双鱼座': {
    overall: 76, love: 92, career: 70, wealth: 68, social: 80,
    summary: '海王星的梦幻能量让你想象力丰富、同情心泛滥。适合艺术创作和灵性修养。注意分辨现实与幻想，避免被他人利用。',
    loveDesc: '浪漫指数爆表，适合表白或制造惊喜。你的温柔体贴会让对方深深着迷。',
    careerDesc: '创意工作表现出色，但执行力可能不足。把想法落实到行动上会有意想不到的收获。',
    wealthDesc: '容易因为同情心而破财。帮助他人之前先确保自己的财务状况稳定。',
    lucky: { color: '海蓝色', number: '12', direction: '东南' },
  },
};

function ProgressBar({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  const getColor = (v: number) => {
    if (v >= 85) return 'bg-[#efb6ff]';
    if (v >= 70) return 'bg-[#f6f9ff]';
    return 'bg-[rgba(246,249,255,0.4)]';
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-[rgba(246,249,255,0.7)]">
          {icon}
          <span>{label}</span>
        </div>
        <span className="text-sm font-semibold text-[#f6f9ff]">{value}%</span>
      </div>
      <div className="h-2 bg-[rgba(246,249,255,0.08)] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${getColor(value)}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export default function Zodiac() {
  const [selected, setSelected] = useState<string | null>(null);
  const today = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fortune = selected ? fortuneData[selected] : null;

  return (
    <div className="min-h-screen pt-20 pb-16 px-6" style={{ background: '#051d1f' }}>
      <div className="max-w-6xl mx-auto">
        {!selected ? (
          <>
            <div className="text-center mb-12">
              <h1
                className="text-4xl md:text-5xl font-bold tracking-tight text-[#f6f9ff] mb-4 glow-text"
                style={{ fontFamily: 'Oswald, sans-serif' }}
              >
                每日星象
              </h1>
              <p className="text-[rgba(246,249,255,0.6)]">{today}</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {zodiacSigns.map((sign) => (
                <button
                  key={sign.name}
                  onClick={() => setSelected(sign.name)}
                  className="liquid-glass rounded-2xl p-5 interactive group text-left transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform inline-block">
                    {sign.icon}
                  </div>
                  <h3 className="text-lg font-bold text-[#f6f9ff] mb-1">{sign.name}</h3>
                  <p className="text-xs text-[rgba(246,249,255,0.5)]">{sign.date}</p>
                  <span className="inline-block mt-2 text-xs text-[#efb6ff] bg-[rgba(239,182,255,0.1)] px-2 py-0.5 rounded-full">
                    {sign.element}象星座
                  </span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="max-w-3xl mx-auto">
            <button
              onClick={() => setSelected(null)}
              className="flex items-center gap-2 text-[rgba(246,249,255,0.6)] hover:text-[#f6f9ff] mb-8 interactive transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              返回星座列表
            </button>

            <div className="liquid-glass rounded-3xl p-6 md:p-8">
              <div className="text-center mb-8">
                <span className="text-5xl mb-4 block">
                  {zodiacSigns.find((s) => s.name === selected)?.icon}
                </span>
                <h2 className="text-3xl font-bold text-[#f6f9ff] mb-2">{selected} · 今日运势</h2>
                <p className="text-[rgba(246,249,255,0.5)] text-sm">{today}</p>
              </div>

              {fortune && (
                <>
                  <div className="space-y-4 mb-8">
                    <ProgressBar label="综合运势" value={fortune.overall} icon={<Star className="w-4 h-4" />} />
                    <ProgressBar label="爱情运势" value={fortune.love} icon={<Heart className="w-4 h-4" />} />
                    <ProgressBar label="事业运势" value={fortune.career} icon={<Briefcase className="w-4 h-4" />} />
                    <ProgressBar label="财富运势" value={fortune.wealth} icon={<Coins className="w-4 h-4" />} />
                    <ProgressBar label="人际运势" value={fortune.social} icon={<Users className="w-4 h-4" />} />
                  </div>

                  <div className="mb-6 p-4 rounded-xl bg-[rgba(239,182,255,0.05)] border border-[rgba(239,182,255,0.1)]">
                    <h3 className="text-[#efb6ff] font-semibold mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      运势概述
                    </h3>
                    <p className="text-[rgba(246,249,255,0.8)] leading-relaxed text-sm">{fortune.summary}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="p-4 rounded-xl bg-[rgba(246,249,255,0.03)]">
                      <h4 className="text-sm font-semibold text-[#efb6ff] mb-2 flex items-center gap-1">
                        <Heart className="w-3 h-3" /> 爱情
                      </h4>
                      <p className="text-xs text-[rgba(246,249,255,0.7)] leading-relaxed">{fortune.loveDesc}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-[rgba(246,249,255,0.03)]">
                      <h4 className="text-sm font-semibold text-[#efb6ff] mb-2 flex items-center gap-1">
                        <Briefcase className="w-3 h-3" /> 事业
                      </h4>
                      <p className="text-xs text-[rgba(246,249,255,0.7)] leading-relaxed">{fortune.careerDesc}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-[rgba(246,249,255,0.03)]">
                      <h4 className="text-sm font-semibold text-[#efb6ff] mb-2 flex items-center gap-1">
                        <Coins className="w-3 h-3" /> 财运
                      </h4>
                      <p className="text-xs text-[rgba(246,249,255,0.7)] leading-relaxed">{fortune.wealthDesc}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-6 p-4 rounded-xl bg-[rgba(0,70,67,0.3)]">
                    <div className="text-center">
                      <p className="text-xs text-[rgba(246,249,255,0.5)] mb-1">幸运色</p>
                      <p className="text-sm font-semibold text-[#f6f9ff]">{fortune.lucky.color}</p>
                    </div>
                    <div className="w-px h-8 bg-[rgba(246,249,255,0.1)]" />
                    <div className="text-center">
                      <p className="text-xs text-[rgba(246,249,255,0.5)] mb-1">幸运数字</p>
                      <p className="text-sm font-semibold text-[#f6f9ff]">{fortune.lucky.number}</p>
                    </div>
                    <div className="w-px h-8 bg-[rgba(246,249,255,0.1)]" />
                    <div className="text-center">
                      <p className="text-xs text-[rgba(246,249,255,0.5)] mb-1">吉位</p>
                      <p className="text-sm font-semibold text-[#f6f9ff]">{fortune.lucky.direction}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
