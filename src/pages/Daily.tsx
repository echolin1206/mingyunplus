import { useState, useEffect } from 'react';
import { Check, X, Clock, Sunrise, Sunset, Moon, Sun, Star, ChevronLeft, ChevronRight, Palette, Sparkles, Scroll } from 'lucide-react';

const yiData = [
  ['祭祀', '祈福', '求嗣', '开光', '出行', '解除'],
  ['嫁娶', '纳采', '订盟', '安床', '移徙', '入宅'],
  ['开市', '交易', '立券', '纳财', '开业', '开工'],
  ['修造', '动土', '起基', '上梁', '盖屋', '装修'],
  ['求医', '治病', '服药', '针灸', '疗养', '康复'],
  ['入学', '求学', '考试', '面试', '签约', '谈判'],
  ['会友', '宴请', '聚会', '出游', '踏青', '登高'],
  ['裁衣', '裁冠', '理发', '整容', '修饰', '装扮'],
  ['种植', '养殖', '园艺', '绿化', '造林', '插秧'],
  ['安葬', '修坟', '立碑', '扫墓', '祭祀', '追思'],
];

const jiData = [
  ['开仓', '出货', '破财', '赌博', '投机', '冒险'],
  ['诉讼', '争吵', '冲突', '斗气', '顶撞', '抗议'],
  ['远行', '搬家', '迁移', '变动', '跳槽', '离职'],
  ['动土', '破土', '开挖', '拆毁', '破坏', '损坏'],
  ['嫁娶', '纳采', '订婚', '结婚', '离异', '分居'],
  ['签约', '合作', '投资', '借贷', '担保', '赊账'],
  ['开工', '开业', '动工', '启动', '发布', '上市'],
  ['探病', '问疾', '吊唁', '送葬', '哭泣', '悲伤'],
  ['登高', '涉水', '游泳', '潜水', '跳伞', '攀岩'],
  ['酗酒', '暴饮暴食', '熬夜', '伤身', '纵欲', '放纵'],
];

const hours = [
  { name: '子时', time: '23:00-01:00', desc: '夜半，万籁俱寂，宜静思冥想', good: true },
  { name: '丑时', time: '01:00-03:00', desc: '鸡鸣，阳气初生，宜安睡养精', good: true },
  { name: '寅时', time: '03:00-05:00', desc: '平旦，晨光微露，宜早起晨练', good: false },
  { name: '卯时', time: '05:00-07:00', desc: '日出，霞光万丈，宜梳妆整理', good: true },
  { name: '辰时', time: '07:00-09:00', desc: '食时，朝气蓬勃，宜进食早餐', good: true },
  { name: '巳时', time: '09:00-11:00', desc: '隅中，日丽风和，宜工作学习', good: true },
  { name: '午时', time: '11:00-13:00', desc: '日中，阳气最盛，宜午休小憩', good: false },
  { name: '未时', time: '13:00-15:00', desc: '日昳，午后时光，宜处理事务', good: true },
  { name: '申时', time: '15:00-17:00', desc: '晡时，夕阳西下，宜运动锻炼', good: true },
  { name: '酉时', time: '17:00-19:00', desc: '日入，华灯初上，宜归家团聚', good: true },
  { name: '戌时', time: '19:00-21:00', desc: '黄昏，夜幕降临，宜休闲放松', good: true },
  { name: '亥时', time: '21:00-23:00', desc: '人定，夜深人静，宜洗漱就寝', good: true },
];

const luckyColors = [
  { name: '正红', hex: '#E63946', element: '火', meaning: '热情奔放，今日穿红色能提升自信与人缘，助力事业突破', advice: '可搭配黑色下装，既显气场又稳重' },
  { name: '翡翠绿', hex: '#2A9D8F', element: '木', meaning: '生机勃勃，绿色为你带来平和与好运，适合谈判与考试', advice: '搭配米色或白色单品，清新自然' },
  { name: '琉璃蓝', hex: '#4361EE', element: '水', meaning: '智慧深邃，蓝色助你思维清晰，适合创作与决策', advice: '搭配银色饰品，提升整体精致感' },
  { name: '琥珀金', hex: '#D4A373', element: '金', meaning: '富贵祥和，金色为你招来财运与贵人，适合商务场合', advice: '搭配深棕色，彰显品味与内涵' },
  { name: '象牙白', hex: '#F8F9FA', element: '金', meaning: '纯净无暇，白色净化负能量，为你开启崭新的一天', advice: '搭配浅蓝或淡粉配饰，增添柔和气质' },
  { name: '紫檀紫', hex: '#7B2CBF', element: '火', meaning: '神秘高贵，紫色激发你的直觉与灵感，适合艺术与冥想', advice: '搭配深灰或黑色，凸显紫色的优雅' },
  { name: '珊瑚橙', hex: '#FF7F51', element: '火', meaning: '温暖活力，橙色为你注入热情与创造力，适合社交聚会', advice: '搭配牛仔蓝，休闲又不失活力' },
  { name: '青瓷灰', hex: '#6C757D', element: '土', meaning: '沉稳内敛，灰色助你保持理性与冷静，适合重要会议', advice: '搭配白色内搭，打破沉闷增添亮点' },
  { name: '桃夭粉', hex: '#FFB5A7', element: '火', meaning: '温柔浪漫，粉色为你招来桃花运，适合约会与表白', advice: '搭配白色或浅灰，甜而不腻' },
  { name: '墨黑', hex: '#1A1A2E', element: '水', meaning: '深邃神秘，黑色助你收敛气场、沉淀思绪，适合独处深思', advice: '搭配金属质感配饰，增添层次感' },
  { name: '丁香紫粉', hex: '#C77DFF', element: '火', meaning: '梦幻柔美，紫粉色提升你的魅力指数，吸引贵人相助', advice: '搭配同色系深浅变化，打造高级感' },
  { name: '薄荷青', hex: '#64DFDF', element: '木', meaning: '清爽通透，青色为你带来好心情与好运气，适合出行旅游', advice: '搭配白色或奶油色，清新宜人' },
];

const blessingTexts = [
  '心若向阳，无畏悲伤。今日的每一个选择，都在书写明天的故事。',
  '天道酬勤，你的努力终将被看见。保持初心，好运自会降临。',
  '今日之我，胜于昨日。每一次进步，都是对生命最好的回馈。',
  '静水流深，大智若愚。今日宜沉淀思绪，静待花开。',
  '一念花开，一念花落。心存善念，福报自来。',
  '山重水复疑无路，柳暗花明又一村。坚持住，转机就在眼前。',
  '星光不问赶路人，时光不负有心人。今日播种，来日收获。',
  '海纳百川，有容乃大。今日以宽容待人，便是给自己最大的福报。',
  '不经一番寒彻骨，怎得梅花扑鼻香。今日的挑战，是明日的勋章。',
  '行到水穷处，坐看云起时。放下执念，便是自在。',
  '愿你今日所行皆坦途，所遇皆良人，所得皆所愿。',
  '心中有光，脚下有路。今日宜稳步前行，不急不躁。',
];

function getDailyData(date: Date) {
  const daySeed = date.getDate() + date.getMonth() * 31;
  const yiIndex = daySeed % yiData.length;
  const jiIndex = (daySeed + 3) % jiData.length;
  const ganZhi = ['甲子', '乙丑', '丙寅', '丁卯', '戊辰', '己巳', '庚午', '辛未', '壬申', '癸酉', '甲戌', '乙亥'];
  const ganZhiIndex = (date.getFullYear() * 365 + date.getMonth() * 31 + date.getDate()) % 60;
  const animal = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
  const dayNum = Math.floor(date.getTime() / 86400000);
  const animalIndex = dayNum % 12;

  const festivals: Record<string, string> = {
    '1-1': '元旦',
    '2-14': '情人节',
    '3-8': '妇女节',
    '4-1': '愚人节',
    '5-1': '劳动节',
    '6-1': '儿童节',
    '8-15': '中秋节',
    '10-1': '国庆节',
    '12-25': '圣诞节',
  };

  const festivalKey = `${date.getMonth() + 1}-${date.getDate()}`;

  // 幸运色
  const colorIndex = (daySeed + ganZhiIndex) % luckyColors.length;
  const secondaryIndex = (colorIndex + 3) % luckyColors.length;

  // 祈运语
  const blessingIndex = (daySeed + ganZhiIndex) % blessingTexts.length;

  return {
    yi: yiData[yiIndex],
    ji: jiData[jiIndex],
    ganZhi: ganZhi[ganZhiIndex % 10] + ganZhi[Math.floor(ganZhiIndex / 10) % 12],
    chong: animal[(animalIndex + 6) % 12],
    sha: ['东', '西', '南', '北', '东南', '西南', '东北', '西北'][daySeed % 8],
    zhi: ['建', '除', '满', '平', '定', '执', '破', '危', '成', '收', '开', '闭'][daySeed % 12],
    festival: festivals[festivalKey] || null,
    luckyColor: luckyColors[colorIndex],
    secondaryColor: luckyColors[secondaryIndex],
    blessing: blessingTexts[blessingIndex],
  };
}

export default function Daily() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState<'overview' | 'hours'>('overview');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const data = getDailyData(currentDate);

  const dateStr = currentDate.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  const lunarStr = `农历${['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'][currentDate.getMonth()]}月${['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十', '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十', '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'][currentDate.getDate() - 1]}`;

  const prevDay = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - 1);
    setCurrentDate(d);
  };

  const nextDay = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + 1);
    setCurrentDate(d);
  };

  const isToday = currentDate.toDateString() === new Date().toDateString();

  return (
    <div className="min-h-screen pt-20 pb-16 px-6" style={{ background: '#051d1f' }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1
            className="text-4xl md:text-5xl font-bold tracking-tight text-[#f6f9ff] mb-4 glow-text"
            style={{ fontFamily: 'Oswald, sans-serif' }}
          >
            今日宜忌
          </h1>
          <p className="text-[rgba(246,249,255,0.6)]">顺应天时，把握每一个当下的能量</p>
        </div>

        {/* Date Navigation */}
        <div className="liquid-glass rounded-2xl p-4 mb-6 flex items-center justify-between">
          <button onClick={prevDay} className="interactive p-2 rounded-full hover:bg-[rgba(246,249,255,0.05)] transition-colors">
            <ChevronLeft className="w-5 h-5 text-[rgba(246,249,255,0.6)]" />
          </button>
          <div className="text-center">
            <p className="text-lg font-semibold text-[#f6f9ff]">{dateStr}</p>
            <p className="text-sm text-[rgba(246,249,255,0.5)]">{lunarStr}</p>
          </div>
          <button onClick={nextDay} className="interactive p-2 rounded-full hover:bg-[rgba(246,249,255,0.05)] transition-colors">
            <ChevronRight className="w-5 h-5 text-[rgba(246,249,255,0.6)]" />
          </button>
        </div>

        {isToday && data.festival && (
          <div className="mb-6 p-4 rounded-xl bg-[rgba(239,182,255,0.08)] border border-[rgba(239,182,255,0.15)] text-center">
            <Star className="w-5 h-5 text-[#efb6ff] mx-auto mb-1" />
            <p className="text-[#efb6ff] font-semibold">今日 {data.festival}</p>
          </div>
        )}

        {/* Basic Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="liquid-glass rounded-xl p-4 text-center">
            <p className="text-xs text-[rgba(246,249,255,0.5)] mb-1">干支</p>
            <p className="text-lg font-bold text-[#f6f9ff]">{data.ganZhi}</p>
          </div>
          <div className="liquid-glass rounded-xl p-4 text-center">
            <p className="text-xs text-[rgba(246,249,255,0.5)] mb-1">冲煞</p>
            <p className="text-lg font-bold text-[#f6f9ff]">冲{data.chong}</p>
          </div>
          <div className="liquid-glass rounded-xl p-4 text-center">
            <p className="text-xs text-[rgba(246,249,255,0.5)] mb-1">煞方</p>
            <p className="text-lg font-bold text-[#f6f9ff]">{data.sha}</p>
          </div>
          <div className="liquid-glass rounded-xl p-4 text-center">
            <p className="text-xs text-[rgba(246,249,255,0.5)] mb-1">十二值</p>
            <p className="text-lg font-bold text-[#efb6ff]">{data.zhi}日</p>
          </div>
        </div>

        {/* === 新增板块1：今日宜忌明细 === */}
        <div className="liquid-glass rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-bold text-[#f6f9ff] mb-5 flex items-center gap-2">
            <Scroll className="w-5 h-5 text-[#efb6ff]" />
            今日宜忌明细
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Yi */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-[rgba(0,200,150,0.15)] flex items-center justify-center">
                  <Check className="w-4 h-4 text-[#00c896]" />
                </div>
                <h4 className="text-base font-bold text-[#00c896]">今日宜</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.yi.map((item, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-full text-sm bg-[rgba(0,200,150,0.08)] text-[#00c896] border border-[rgba(0,200,150,0.15)]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
            {/* Ji */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-[rgba(255,100,100,0.15)] flex items-center justify-center">
                  <X className="w-4 h-4 text-[#ff6464]" />
                </div>
                <h4 className="text-base font-bold text-[#ff6464]">今日忌</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.ji.map((item, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-full text-sm bg-[rgba(255,100,100,0.08)] text-[#ff6464] border border-[rgba(255,100,100,0.15)]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* === 新增板块2：今日幸运色 === */}
        <div className="liquid-glass rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-5">
            <Palette className="w-5 h-5 text-[#efb6ff]" />
            <h3 className="text-lg font-bold text-[#f6f9ff]">今日幸运色</h3>
            <Sparkles className="w-4 h-4 text-[#efb6ff] float-animation" />
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Primary Lucky Color */}
            <div className="flex items-center gap-4">
              <div
                className="w-20 h-20 rounded-full flex-shrink-0 pulse-glow"
                style={{
                  backgroundColor: data.luckyColor.hex,
                  boxShadow: `0 0 30px ${data.luckyColor.hex}40, 0 0 60px ${data.luckyColor.hex}20`,
                }}
              />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-2xl font-bold" style={{ color: data.luckyColor.hex }}>
                    {data.luckyColor.name}
                  </p>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[rgba(246,249,255,0.08)] text-[rgba(246,249,255,0.5)]">
                    {data.luckyColor.element}行
                  </span>
                </div>
                <p className="text-xs text-[rgba(246,249,255,0.4)] font-mono">{data.luckyColor.hex}</p>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px h-16 bg-[rgba(246,249,255,0.1)]" />
            <div className="md:hidden w-full h-px bg-[rgba(246,249,255,0.1)]" />

            {/* Color Info */}
            <div className="flex-1 space-y-3">
              <p className="text-sm text-[rgba(246,249,255,0.8)] leading-relaxed">
                {data.luckyColor.meaning}
              </p>
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-[#efb6ff] flex-shrink-0 mt-0.5" />
                <p className="text-xs text-[rgba(246,249,255,0.6)]">
                  <span className="text-[#efb6ff]">穿搭建议：</span>
                  {data.luckyColor.advice}
                </p>
              </div>
            </div>

            {/* Secondary Color */}
            <div className="flex flex-col items-center gap-2 flex-shrink-0">
              <p className="text-xs text-[rgba(246,249,255,0.4)]">辅助色</p>
              <div
                className="w-12 h-12 rounded-full"
                style={{
                  backgroundColor: data.secondaryColor.hex,
                  boxShadow: `0 0 15px ${data.secondaryColor.hex}30`,
                }}
              />
              <p className="text-xs text-[rgba(246,249,255,0.6)]">{data.secondaryColor.name}</p>
            </div>
          </div>

          {/* Color palette strip */}
          <div className="mt-5 flex gap-2">
            {[data.luckyColor.hex, data.secondaryColor.hex, '#f6f9ff', '#051d1f'].map((c, i) => (
              <div
                key={i}
                className="flex-1 h-2 rounded-full"
                style={{ backgroundColor: c, opacity: i >= 2 ? 0.3 : 1 }}
              />
            ))}
          </div>
        </div>

        {/* === 新增板块3：今日祈运语 === */}
        <div className="liquid-glass rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-[#efb6ff]" />
            <h3 className="text-lg font-bold text-[#f6f9ff]">今日祈运语</h3>
          </div>
          <div className="p-5 rounded-xl bg-[rgba(239,182,255,0.05)] border border-[rgba(239,182,255,0.1)]">
            <p className="text-base text-[rgba(246,249,255,0.9)] leading-relaxed text-center italic">
              &ldquo;{data.blessing}&rdquo;
            </p>
          </div>
          <p className="text-xs text-[rgba(246,249,255,0.4)] mt-3 text-center">
            默念祈运语三遍，心诚则灵，好运自来
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all interactive ${
              activeTab === 'overview'
                ? 'liquid-glass text-[#f6f9ff]'
                : 'text-[rgba(246,249,255,0.5)] hover:text-[#f6f9ff]'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Sunrise className="w-4 h-4" />
              时辰吉凶
            </div>
          </button>
          <button
            onClick={() => setActiveTab('hours')}
            className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all interactive ${
              activeTab === 'hours'
                ? 'liquid-glass text-[#f6f9ff]'
                : 'text-[rgba(246,249,255,0.5)] hover:text-[#f6f9ff]'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Clock className="w-4 h-4" />
              时辰详情
            </div>
          </button>
        </div>

        {activeTab === 'overview' ? (
          <div className="space-y-3">
            {hours.map((hour, i) => (
              <div
                key={i}
                className={`liquid-glass rounded-xl p-4 flex items-center gap-4 transition-all ${
                  hour.good ? 'border-l-2 border-l-[#00c896]' : 'border-l-2 border-l-[rgba(246,249,255,0.2)]'
                }`}
              >
                <div className="w-12 text-center">
                  <p className="text-sm font-semibold text-[#f6f9ff]">{hour.name}</p>
                  <p className="text-xs text-[rgba(246,249,255,0.4)]">{hour.time}</p>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-[rgba(246,249,255,0.7)]">{hour.desc}</p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs ${
                  hour.good
                    ? 'bg-[rgba(0,200,150,0.1)] text-[#00c896]'
                    : 'bg-[rgba(246,249,255,0.05)] text-[rgba(246,249,255,0.4)]'
                }`}>
                  {hour.good ? '吉' : '平'}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {hours.map((hour, i) => (
              <div
                key={i}
                className={`liquid-glass rounded-xl p-4 flex items-center gap-4 transition-all ${
                  hour.good ? 'border-l-2 border-l-[#00c896]' : 'border-l-2 border-l-[rgba(246,249,255,0.2)]'
                }`}
              >
                <div className="w-12 text-center">
                  <p className="text-sm font-semibold text-[#f6f9ff]">{hour.name}</p>
                  <p className="text-xs text-[rgba(246,249,255,0.4)]">{hour.time}</p>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-[rgba(246,249,255,0.7)]">{hour.desc}</p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs ${
                  hour.good
                    ? 'bg-[rgba(0,200,150,0.1)] text-[#00c896]'
                    : 'bg-[rgba(246,249,255,0.05)] text-[rgba(246,249,255,0.4)]'
                }`}>
                  {hour.good ? '吉' : '平'}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Solar info */}
        <div className="mt-8 liquid-glass rounded-2xl p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <Sunrise className="w-5 h-5 text-[#efb6ff] mx-auto mb-2" />
              <p className="text-xs text-[rgba(246,249,255,0.5)]">日出</p>
              <p className="text-sm font-semibold text-[#f6f9ff]">06:12</p>
            </div>
            <div className="text-center">
              <Sun className="w-5 h-5 text-[#efb6ff] mx-auto mb-2" />
              <p className="text-xs text-[rgba(246,249,255,0.5)]">日中</p>
              <p className="text-sm font-semibold text-[#f6f9ff]">12:05</p>
            </div>
            <div className="text-center">
              <Sunset className="w-5 h-5 text-[#efb6ff] mx-auto mb-2" />
              <p className="text-xs text-[rgba(246,249,255,0.5)]">日落</p>
              <p className="text-sm font-semibold text-[#f6f9ff]">18:48</p>
            </div>
            <div className="text-center">
              <Moon className="w-5 h-5 text-[#efb6ff] mx-auto mb-2" />
              <p className="text-xs text-[rgba(246,249,255,0.5)]">月相</p>
              <p className="text-sm font-semibold text-[#f6f9ff]">
                {currentDate.getDate() <= 15 ? '渐盈' : '渐亏'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
