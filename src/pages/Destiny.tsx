import { useState, useEffect, useRef } from 'react';
import { Compass, Sparkles, User, Calendar, Hash, ChevronRight, RotateCcw, Star } from 'lucide-react';
import PaymentModal from '../components/PaymentModal';

const destinyTypes = [
  { id: 'bazi', title: '八字精批', desc: '根据出生年月日时，排出四柱八字，分析你的命格、运势、事业、婚姻', price: '9.9', icon: <Calendar className="w-6 h-6" />, image: '/images/astro-chart.jpg' },
  { id: 'name', title: '姓名测试', desc: '通过姓名笔画数理，分析你的名字对命运的影响，给出改名建议', price: '9.9', icon: <User className="w-6 h-6" />, image: '/images/life-number.jpg' },
  { id: 'life', title: '生命灵数', desc: '根据出生日期计算出你的生命数字，揭示你的天赋、使命和人生课题', price: '9.9', icon: <Hash className="w-6 h-6" />, image: '/images/metallic-sphere.jpg' },
  { id: 'pair', title: '缘分配对', desc: '输入双方的生辰信息，分析你们的缘分指数、相处模式和未来走向', price: '9.9', icon: <Sparkles className="w-6 h-6" />, image: '/images/zodiac-pair.jpg' },
];

// ─── Form Components ───

function BaziForm({ onResult }: { onResult: (r: string) => void }) {
  const [year, setYear] = useState('1995');
  const [month, setMonth] = useState('6');
  const [day, setDay] = useState('15');
  const [hour, setHour] = useState('12');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      const gan = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
      const zhi = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
      const elements = ['木','木','火','火','土','土','金','金','水','水'];
      const seed = parseInt(year) + parseInt(month) + parseInt(day);
      const r = `【四柱八字】\n\n年柱：${gan[seed%10]}${zhi[seed%12]} (${elements[seed%10]})\n月柱：${gan[(seed+2)%10]}${zhi[(seed+2)%12]} (${elements[(seed+2)%10]})\n日柱：${gan[(seed+4)%10]}${zhi[(seed+4)%12]} (${elements[(seed+4)%10]})\n时柱：${gan[(seed+hour.length)%10]}${zhi[parseInt(hour)%12]} (${elements[(seed+hour.length)%10]})\n\n【命格分析】\n你的日主为${gan[(seed+4)%10]}，属${elements[(seed+4)%10]}命。${gender==='male'?'阳':'阴'}性命格，性格${seed%2===0?'外向开朗，行动力强，有领导才能':'内敛沉稳，思维缜密，善于谋划'}。\n\n【五行分析】\n你的八字中${elements[seed%10]}旺，${elements[(seed+2)%12]}相生，整体五行${seed%3===0?'均衡':seed%3===1?'偏旺':'偏弱'}。建议${seed%2===0?'多接触水元素以平衡':'多接触火元素以增旺'}。\n\n【事业运势】\n适合从事与${elements[seed%5]}、${elements[(seed+2)%5]}相关的行业。中年后事业运上升，40岁左右有重大突破。\n\n【婚姻感情】\n${gender==='male'?'妻':'夫'}星${seed%2===0?'明朗，感情顺遂':'暗藏，需主动争取'}。适婚年龄在${25+(seed%8)}岁左右。\n\n【财运分析】\n正财稳定，偏财${seed%3===0?'旺盛':'一般'}。注意理财规划，35岁后财运亨通。\n\n【健康提醒】\n注意${['肝胆','心脏','脾胃','肺部','肾脏'][seed%5]}方面的保养，保持规律作息。`;
      setLoading(false);
      onResult(r);
    }, 2000);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div><label className="text-sm text-[rgba(246,249,255,0.6)] mb-1 block">出生年份</label><input type="number" value={year} onChange={e => setYear(e.target.value)} className="w-full bg-[rgba(246,249,255,0.05)] border border-[rgba(246,249,255,0.1)] rounded-xl px-4 py-3 text-[#f6f9ff] focus:outline-none focus:border-[#efb6ff]" /></div>
        <div><label className="text-sm text-[rgba(246,249,255,0.6)] mb-1 block">出生月份</label><input type="number" min="1" max="12" value={month} onChange={e => setMonth(e.target.value)} className="w-full bg-[rgba(246,249,255,0.05)] border border-[rgba(246,249,255,0.1)] rounded-xl px-4 py-3 text-[#f6f9ff] focus:outline-none focus:border-[#efb6ff]" /></div>
        <div><label className="text-sm text-[rgba(246,249,255,0.6)] mb-1 block">出生日期</label><input type="number" min="1" max="31" value={day} onChange={e => setDay(e.target.value)} className="w-full bg-[rgba(246,249,255,0.05)] border border-[rgba(246,249,255,0.1)] rounded-xl px-4 py-3 text-[#f6f9ff] focus:outline-none focus:border-[#efb6ff]" /></div>
        <div><label className="text-sm text-[rgba(246,249,255,0.6)] mb-1 block">出生时辰</label><select value={hour} onChange={e => setHour(e.target.value)} className="w-full bg-[rgba(246,249,255,0.05)] border border-[rgba(246,249,255,0.1)] rounded-xl px-4 py-3 text-[#f6f9ff] focus:outline-none focus:border-[#efb6ff]"><option value="0">子时 (23-1)</option><option value="2">丑时 (1-3)</option><option value="4">寅时 (3-5)</option><option value="6">卯时 (5-7)</option><option value="8">辰时 (7-9)</option><option value="10">巳时 (9-11)</option><option value="12">午时 (11-13)</option><option value="14">未时 (13-15)</option><option value="16">申时 (15-17)</option><option value="18">酉时 (17-19)</option><option value="20">戌时 (19-21)</option><option value="22">亥时 (21-23)</option></select></div>
      </div>
      <div><label className="text-sm text-[rgba(246,249,255,0.6)] mb-2 block">性别</label><div className="flex gap-3"><button onClick={() => setGender('male')} className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all interactive ${gender==='male'?'liquid-glass text-[#f6f9ff]':'bg-[rgba(246,249,255,0.03)] text-[rgba(246,249,255,0.5)]'}`}>男</button><button onClick={() => setGender('female')} className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all interactive ${gender==='female'?'liquid-glass text-[#f6f9ff]':'bg-[rgba(246,249,255,0.03)] text-[rgba(246,249,255,0.5)]'}`}>女</button></div></div>
      <button onClick={handleSubmit} disabled={loading} className="w-full liquid-glass py-4 rounded-xl text-[#f6f9ff] font-medium interactive hover:text-[#efb6ff] transition-colors disabled:opacity-50">{loading?'正在测算中...':'开始八字精批'}</button>
    </div>
  );
}

function NameForm({ onResult }: { onResult: (r: string) => void }) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const handleSubmit = () => {
    if (!name.trim()) return;
    setLoading(true);
    setTimeout(() => {
      const score = 60 + (name.charCodeAt(0) % 40);
      const analyses = ['你的名字五行搭配均衡，天格数理吉利。名字中的字义积极向上，有助于事业发展和人际关系的建立。','你的名字带有强烈的个性色彩，独一无二。虽然数理上略有波折，但也意味着人生经历丰富，成就非凡。','你的名字音律优美，朗朗上口。五行中金旺，适合从事与金属、金融相关的行业。','你的名字蕴含深厚的文化底蕴，给人以稳重可靠的印象。水元素偏旺，有助于智慧和灵感的发挥。'];
      const elements = [['木','火'],['金','水'],['土','金'],['水','木']];
      const idx = name.charCodeAt(0) % analyses.length;
      const r = `【姓名测试报告】\n\n测试姓名：${name}\n综合评分：${score}分\n\n【五格分析】\n天格：${15+(name.charCodeAt(0)%20)} (吉)\n人格：${20+(name.charCodeAt(0)%15)} (吉)\n地格：${18+(name.length%12)} (${score>80?'吉':'半吉'})\n外格：${10+(name.charCodeAt(name.length-1)%15)} (${score>75?'吉':'平'})\n总格：${35+(name.charCodeAt(0)%20)} (大吉)\n\n【五行属性】\n主元素：${elements[idx][0]}\n辅元素：${elements[idx][1]}\n\n【详细分析】\n${analyses[idx]}\n\n【性格影响】\n你的名字会赋予你${score>80?'自信、果断、有领导力':score>70?'温和、细腻、善于沟通':'独立、坚韧、不屈不挠'}的性格特质。\n\n【事业建议】\n适合从事${elements[idx][0]}属性相关的行业，如${elements[idx][0]==='木'?'教育、文化、出版':elements[idx][0]==='火'?'餐饮、娱乐、传媒':elements[idx][0]==='土'?'房地产、建筑、农业':elements[idx][0]==='金'?'金融、科技、机械':'旅游、贸易、物流'}等领域。\n\n【感情运势】\n名字对感情运势的影响${score>80?'积极正面，容易遇到心仪对象':'平稳，需要主动争取'}。`;
      setLoading(false);
      onResult(r);
    }, 1500);
  };
  return (
    <div className="space-y-4">
      <div><label className="text-sm text-[rgba(246,249,255,0.6)] mb-1 block">请输入你的姓名</label><input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="例如：李明" className="w-full bg-[rgba(246,249,255,0.05)] border border-[rgba(246,249,255,0.1)] rounded-xl px-4 py-3 text-[#f6f9ff] placeholder:text-[rgba(246,249,255,0.3)] focus:outline-none focus:border-[#efb6ff]" /></div>
      <button onClick={handleSubmit} disabled={loading || !name.trim()} className="w-full liquid-glass py-4 rounded-xl text-[#f6f9ff] font-medium interactive hover:text-[#efb6ff] transition-colors disabled:opacity-50">{loading?'正在分析中...':'开始姓名测试'}</button>
    </div>
  );
}

function LifeNumberForm({ onResult }: { onResult: (r: string) => void }) {
  const [birthDate, setBirthDate] = useState('');
  const [loading, setLoading] = useState(false);
  const handleSubmit = () => {
    if (!birthDate) return;
    setLoading(true);
    setTimeout(() => {
      const nums = birthDate.replace(/-/g, '').split('').map(Number);
      let lifePath = nums.reduce((a, b) => a + b, 0);
      while (lifePath > 9) lifePath = String(lifePath).split('').map(Number).reduce((a, b) => a + b, 0);
      const meanings: Record<number, string> = { 1: '领导者 - 天生具有领导才能和开创精神，独立自主，充满自信。你的人生使命是成为开拓者，勇敢追求自己的目标。', 2: '协调者 - 敏感细腻，善于倾听和调解。你天生具有外交才能，适合从事需要人际沟通的工作。人生课题是学习在关系中保持自我。', 3: '创造者 - 富有创意和表达力，乐观开朗。你天生是艺术家，适合从事创意工作。注意不要在享乐中迷失方向。', 4: '建设者 - 踏实稳重，注重秩序和规则。你是团队的基石，适合从事需要耐心和专注的工作。学会灵活变通是你的课题。', 5: '自由者 - 热爱自由和冒险，适应力强。你渴望体验生活的多样性，适合从事需要变动和旅行的职业。注意培养专注力。', 6: '守护者 - 富有责任心和爱心，天生具有疗愈能力。你适合从事教育、医疗、社工等助人的职业。学会爱自己同样重要。', 7: '探索者 - 智慧深邃，喜欢思考和研究。你是真理的追寻者，适合学术、科研、哲学等领域。注意不要过于孤僻。', 8: '成就者 - 具有商业头脑和管理才能，追求物质和精神的双重成功。你有实现大事业的潜力。学会平衡工作与生活。', 9: '人道者 - 具有博大的胸怀和无私的爱心。你的人生使命是为人类服务，从事慈善、艺术、教育等工作。学会放下执着。' };
      const r = `【生命灵数报告】\n\n出生日期：${birthDate}\n生命灵数：${lifePath}\n\n【核心特质】\n${meanings[lifePath]}\n\n【天赋与才能】\n${lifePath % 2 === 0 ? '你的直觉力很强，善于感知他人的情绪和需求。' : '你的逻辑思维出众，善于分析和解决问题。'}\n${lifePath >= 5 ? '你具有超强的适应能力，能在变化中找到机会。' : '你的稳定性是你的最大优势，能给人安全感。'}\n\n【人生课题】\n${['学会独立但不孤立，领导但不独裁', '在付出和接受之间找到平衡', '将创意转化为实际成果', '在稳定中寻求突破和创新', '在自由中找到责任和方向', '在关爱他人的同时照顾好自己', '将智慧转化为实际的行动', '在追求成功中保持内心的平静', '在理想主义和现实主义之间找到平衡'][lifePath - 1]}\n\n【适合的职业方向】\n${lifePath === 1 ? '企业家、管理者、创业者' : lifePath === 2 ? '外交官、咨询师、调解员' : lifePath === 3 ? '艺术家、作家、设计师' : lifePath === 4 ? '工程师、建筑师、会计师' : lifePath === 5 ? '记者、销售、旅行家' : lifePath === 6 ? '教师、医生、社工' : lifePath === 7 ? '研究员、科学家、哲学家' : lifePath === 8 ? 'CEO、银行家、投资人' : '慈善家、艺术家、疗愈师'}\n\n【感情建议】\n与生命灵数为${(lifePath + 2) % 9 + 1}或${(lifePath + 4) % 9 + 1}的人最为合拍。在感情中，你需要${lifePath % 2 === 0 ? '更多的安全感和承诺' : '更多的自由和空间'}。`;
      setLoading(false);
      onResult(r);
    }, 1500);
  };
  return (
    <div className="space-y-4">
      <div><label className="text-sm text-[rgba(246,249,255,0.6)] mb-1 block">请选择你的出生日期</label><input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} className="w-full bg-[rgba(246,249,255,0.05)] border border-[rgba(246,249,255,0.1)] rounded-xl px-4 py-3 text-[#f6f9ff] focus:outline-none focus:border-[#efb6ff]" /></div>
      <button onClick={handleSubmit} disabled={loading || !birthDate} className="w-full liquid-glass py-4 rounded-xl text-[#f6f9ff] font-medium interactive hover:text-[#efb6ff] transition-colors disabled:opacity-50">{loading?'正在计算中...':'计算生命灵数'}</button>
    </div>
  );
}

function PairForm({ onResult }: { onResult: (r: string) => void }) {
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [date1, setDate1] = useState('');
  const [date2, setDate2] = useState('');
  const [loading, setLoading] = useState(false);
  const handleSubmit = () => {
    if (!name1.trim() || !name2.trim()) return;
    setLoading(true);
    setTimeout(() => {
      const seed = (name1.charCodeAt(0) + name2.charCodeAt(0)) % 100;
      const score = 50 + (seed % 50);
      const r = `【缘分配对报告】\n\n甲方：${name1} (${date1 || '未知'})\n乙方：${name2} (${date2 || '未知'})\n\n【缘分指数】 ${score}%\n${score >= 90 ? '天作之合' : score >= 80 ? '金玉良缘' : score >= 70 ? '情投意合' : score >= 60 ? '相敬如宾' : score >= 50 ? '缘分尚浅' : '需多磨合'}\n\n【性格匹配度】\n${name1}性格${seed % 2 === 0 ? '外向主动' : '内敛沉稳'}，${name2}性格${seed % 3 === 0 ? '温柔体贴' : seed % 3 === 1 ? '独立自主' : '幽默风趣'}。\n两人在性格上${score >= 70 ? '互补性强，能够相互理解和包容' : '差异较大，需要更多沟通和磨合'}。\n\n【感情走向】\n${score >= 80 ? '感情发展顺利，有望修成正果。建议珍惜彼此，共同规划未来。' : score >= 60 ? '感情基础不错，但需要双方共同努力。多创造共同的回忆和经历。' : '感情之路可能较为曲折，但如果真心相爱，一切困难都能克服。'}\n\n【相处建议】\n1. ${name1}需要多给予${name2}${seed % 2 === 0 ? '关心和陪伴' : '空间和信任'}\n2. ${name2}可以尝试理解${name1}的${seed % 3 === 0 ? '完美主义倾向' : seed % 3 === 1 ? '情绪化表现' : '事业心'}\n3. 两人共同的兴趣点是${['旅行', '美食', '电影', '音乐', '运动'][seed % 5]}，可以多在这方面培养共同话题\n\n【缘分提示】\n${score >= 85 ? '你们的前世可能就已经相识，今生重逢是命中注定的缘分。' : score >= 70 ? '你们的相遇是宇宙精心安排的，好好珍惜这段感情。' : '缘分需要经营，用心对待每一天，幸福就在不远处。'}`;
      setLoading(false);
      onResult(r);
    }, 1800);
  };
  return (
    <div className="space-y-4">
      <div className="p-4 rounded-xl bg-[rgba(239,182,255,0.05)] border border-[rgba(239,182,255,0.1)]"><h4 className="text-sm font-semibold text-[#efb6ff] mb-3">甲方信息</h4><div className="grid grid-cols-2 gap-3"><input type="text" value={name1} onChange={e => setName1(e.target.value)} placeholder="姓名" className="w-full bg-[rgba(246,249,255,0.05)] border border-[rgba(246,249,255,0.1)] rounded-xl px-4 py-2.5 text-sm text-[#f6f9ff] placeholder:text-[rgba(246,249,255,0.3)] focus:outline-none focus:border-[#efb6ff]" /><input type="date" value={date1} onChange={e => setDate1(e.target.value)} className="w-full bg-[rgba(246,249,255,0.05)] border border-[rgba(246,249,255,0.1)] rounded-xl px-4 py-2.5 text-sm text-[#f6f9ff] focus:outline-none focus:border-[#efb6ff]" /></div></div>
      <div className="p-4 rounded-xl bg-[rgba(239,182,255,0.05)] border border-[rgba(239,182,255,0.1)]"><h4 className="text-sm font-semibold text-[#efb6ff] mb-3">乙方信息</h4><div className="grid grid-cols-2 gap-3"><input type="text" value={name2} onChange={e => setName2(e.target.value)} placeholder="姓名" className="w-full bg-[rgba(246,249,255,0.05)] border border-[rgba(246,249,255,0.1)] rounded-xl px-4 py-2.5 text-sm text-[#f6f9ff] placeholder:text-[rgba(246,249,255,0.3)] focus:outline-none focus:border-[#efb6ff]" /><input type="date" value={date2} onChange={e => setDate2(e.target.value)} className="w-full bg-[rgba(246,249,255,0.05)] border border-[rgba(246,249,255,0.1)] rounded-xl px-4 py-2.5 text-sm text-[#f6f9ff] focus:outline-none focus:border-[#efb6ff]" /></div></div>
      <button onClick={handleSubmit} disabled={loading || !name1.trim() || !name2.trim()} className="w-full liquid-glass py-4 rounded-xl text-[#f6f9ff] font-medium interactive hover:text-[#efb6ff] transition-colors disabled:opacity-50">{loading?'正在测算缘分...':'开始缘分配对'}</button>
    </div>
  );
}

// ─── Main Page ───

export default function Destiny() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paid, setPaid] = useState(false);
  const pendingResult = useRef<string | null>(null);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const handleResult = (r: string) => {
    pendingResult.current = r;
    setPaymentOpen(true);
  };

  const handlePaymentSuccess = () => {
    setPaid(true);
    setPaymentOpen(false);
    if (pendingResult.current) {
      setResult(pendingResult.current);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const reset = () => {
    setResult(null);
    setSelectedType(null);
    setPaid(false);
    pendingResult.current = null;
  };

  if (result && paid) {
    return (
      <>
        <div className="min-h-screen pt-20 pb-16 px-6" style={{ background: '#051d1f' }}>
          <div className="max-w-3xl mx-auto">
            <button onClick={reset} className="flex items-center gap-2 text-[rgba(246,249,255,0.6)] hover:text-[#f6f9ff] mb-6 interactive transition-colors">
              <RotateCcw className="w-4 h-4" />重新测算
            </button>
            <div className="liquid-glass rounded-3xl p-6 md:p-8">
              <div className="flex items-center gap-2 mb-6">
                <Star className="w-5 h-5 text-[#efb6ff]" />
                <h2 className="text-xl font-bold text-[#f6f9ff]">测算结果</h2>
              </div>
              <pre className="whitespace-pre-wrap text-sm text-[rgba(246,249,255,0.8)] leading-relaxed font-sans">{result}</pre>
            </div>
          </div>
        </div>
        <PaymentModal isOpen={false} onClose={() => {}} onSuccess={() => {}} plan={null} />
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen pt-20 pb-16 px-6" style={{ background: '#051d1f' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#f6f9ff] mb-4 glow-text" style={{ fontFamily: 'Oswald, sans-serif' }}>紫微命盘</h1>
            <p className="text-[rgba(246,249,255,0.6)]">9.9元解锁，洞见你的人生蓝图</p>
          </div>

          {!selectedType ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {destinyTypes.map((type) => (
                <button key={type.id} onClick={() => setSelectedType(type.id)} className="liquid-glass rounded-2xl p-6 interactive group text-left transition-all duration-300 hover:scale-[1.01]">
                  <div className="flex items-start gap-4">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0"><img src={type.image} alt={type.title} className="w-full h-full object-cover" /></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold text-[#f6f9ff]">{type.title}</h3>
                        <span className="text-[#efb6ff] font-semibold">¥{type.price}</span>
                      </div>
                      <p className="text-sm text-[rgba(246,249,255,0.6)] mb-3 leading-relaxed">{type.desc}</p>
                      <div className="flex items-center gap-1 text-[#efb6ff] text-sm opacity-0 group-hover:opacity-100 transition-opacity"><span>开始测算</span><ChevronRight className="w-4 h-4" /></div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="max-w-2xl mx-auto">
              <button onClick={() => setSelectedType(null)} className="flex items-center gap-2 text-[rgba(246,249,255,0.6)] hover:text-[#f6f9ff] mb-6 interactive transition-colors">
                <Compass className="w-4 h-4" />选择其他测算
              </button>
              <div className="liquid-glass rounded-3xl p-6 md:p-8">
                <div className="text-center mb-6">
                  <div className="text-[#efb6ff] mb-2">{destinyTypes.find(t => t.id === selectedType)?.icon}</div>
                  <h2 className="text-2xl font-bold text-[#f6f9ff]">{destinyTypes.find(t => t.id === selectedType)?.title}</h2>
                  <p className="text-sm text-[rgba(246,249,255,0.5)] mt-1">{destinyTypes.find(t => t.id === selectedType)?.desc}</p>
                </div>
                {selectedType === 'bazi' && <BaziForm onResult={handleResult} />}
                {selectedType === 'name' && <NameForm onResult={handleResult} />}
                {selectedType === 'life' && <LifeNumberForm onResult={handleResult} />}
                {selectedType === 'pair' && <PairForm onResult={handleResult} />}
              </div>
            </div>
          )}
        </div>
      </div>
      <PaymentModal
        isOpen={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        onSuccess={handlePaymentSuccess}
        plan="single"
        description={selectedType ? destinyTypes.find(t => t.id === selectedType)?.title : undefined}
      />
    </>
  );
}
