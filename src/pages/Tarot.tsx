import { useState, useEffect } from 'react';
import { Sparkles, RotateCcw, Star, Moon, Sun, Heart, Zap, Shield, Compass, Crown } from 'lucide-react';

const tarotCards = [
  { id: 0, name: '愚者', meaning: '新的开始，冒险，信任直觉', detail: '你正站在人生的新起点，充满了无限可能。放下恐惧，跟随内心的指引，勇敢迈出第一步。这是一个适合尝试新事物的时刻。', icon: <Star className="w-8 h-8" /> },
  { id: 1, name: '魔术师', meaning: '创造力，行动力，资源丰富', detail: '你拥有实现目标所需的一切资源。现在是行动的最佳时机，将你的创意转化为现实。相信自己，你比想象中更有能力。', icon: <Zap className="w-8 h-8" /> },
  { id: 2, name: '女祭司', meaning: '直觉，内在智慧，静观其变', detail: '倾听内心的声音，答案已经在你的心中。这是一个需要耐心和静思的时期，不要急于行动，让直觉引导你。', icon: <Moon className="w-8 h-8" /> },
  { id: 3, name: '女皇', meaning: '丰饶，母性，创造力', detail: '你正处于一个充满创造力的时期，无论是事业还是感情，都会有丰硕的收获。善待自己，享受生活中的美好。', icon: <Heart className="w-8 h-8" /> },
  { id: 4, name: '皇帝', meaning: '权威，稳定，掌控', detail: '你需要展现领导力和决断力。建立秩序和规则，为自己的生活设定明确的目标和边界。稳定和成功即将到来。', icon: <Crown className="w-8 h-8" /> },
  { id: 5, name: '教皇', meaning: '传统，教导，精神指引', detail: '寻求智慧和指引的时刻。可能是长辈、导师或专业人士给你重要的建议。尊重传统，但也要有自己的判断。', icon: <Shield className="w-8 h-8" /> },
  { id: 6, name: '恋人', meaning: '爱情，选择，和谐', detail: '感情生活将迎来重要时刻，单身者可能遇到心动对象，有伴侣者关系更亲密。同时也可能面临重要的人生选择。', icon: <Heart className="w-8 h-8" /> },
  { id: 7, name: '战车', meaning: '胜利，意志，前进', detail: '通过坚定的意志和努力，你将战胜困难，取得胜利。保持专注和决心，不要被阻碍所动摇。成功就在前方。', icon: <Zap className="w-8 h-8" /> },
  { id: 8, name: '力量', meaning: '勇气，耐心，内在力量', detail: '真正的力量来自内心而非外力。用温柔和耐心去面对挑战，你会发现自己比想象中更强大。相信自己。', icon: <Sun className="w-8 h-8" /> },
  { id: 9, name: '隐士', meaning: '独处，反思，寻找答案', detail: '退一步，给自己一些独处的时间和空间。在静默中，你会找到一直寻求的答案。这是一段内省和成长的旅程。', icon: <Moon className="w-8 h-8" /> },
  { id: 10, name: '命运之轮', meaning: '转变，机遇，命运', detail: '命运的齿轮正在转动，好运即将降临。保持开放的心态，抓住机遇。变化是生活的常态，顺应它你将收获惊喜。', icon: <Compass className="w-8 h-8" /> },
  { id: 11, name: '正义', meaning: '公正，平衡，因果', detail: '公正和平衡将降临。你的付出终将得到回报，任何不公也会被纠正。做一个公正的决定，遵循内心的道德准则。', icon: <Shield className="w-8 h-8" /> },
  { id: 12, name: '倒吊人', meaning: '牺牲，等待，新视角', detail: '有时候需要暂停和等待，从不同的角度看待问题。短暂的停滞不代表失败，而是为了更好的飞跃。保持耐心。', icon: <Star className="w-8 h-8" /> },
  { id: 13, name: '死神', meaning: '结束，重生，转变', detail: '旧的篇章即将结束，但这意味着新的开始。不要害怕改变，放手过去，拥抱新生。转变虽然痛苦，但会带来成长。', icon: <Moon className="w-8 h-8" /> },
  { id: 14, name: '节制', meaning: '平衡，调和，耐心', detail: '寻求生活的平衡，不要走极端。在工作和休息、付出和收获之间找到和谐。 moderation 是通往幸福的关键。', icon: <Sun className="w-8 h-8" /> },
  { id: 15, name: '恶魔', meaning: '欲望，束缚，物质', detail: '警惕被物质或欲望所束缚。你可能陷入某种不健康的关系或习惯中。认清束缚你的东西，勇敢地打破它。', icon: <Zap className="w-8 h-8" /> },
  { id: 16, name: '塔', meaning: '突变，觉醒，释放', detail: '突如其来的变化可能会打破你原有的计划，但这其实是宇宙在帮你清除障碍。接受变化，你将获得重生。', icon: <Sparkles className="w-8 h-8" /> },
  { id: 17, name: '星星', meaning: '希望，灵感，宁静', detail: '黑暗过后的黎明，希望之光照亮前路。保持信念，你的愿望正在显化的路上。这是一个充满灵感和宁静的时刻。', icon: <Star className="w-8 h-8" /> },
  { id: 18, name: '月亮', meaning: '幻觉，潜意识，不安', detail: '事情可能不如表面看起来那样。相信你的直觉，它比你看到的更真实。不要被幻觉迷惑，深入探索真相。', icon: <Moon className="w-8 h-8" /> },
  { id: 19, name: '太阳', meaning: '成功，快乐，活力', detail: '最光明的时刻！成功、快乐和活力充满你的生活。享受这段美好时光，你的积极能量会感染身边的人。', icon: <Sun className="w-8 h-8" /> },
  { id: 20, name: '审判', meaning: '重生，觉醒，评价', detail: '一个重要的觉醒时刻，你将重新审视自己的人生。过去的努力将得到评价，新的篇章即将开启。听从内心的召唤。', icon: <Crown className="w-8 h-8" /> },
  { id: 21, name: '世界', meaning: '圆满，完成，成就', detail: '一个周期的圆满完成。你即将达成重要的目标，收获丰硕的成果。庆祝你的成就，同时准备迎接新的挑战。', icon: <Sparkles className="w-8 h-8" /> },
];

export default function Tarot() {
  const [drawnCards, setDrawnCards] = useState<typeof tarotCards>([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [selectedCard, setSelectedCard] = useState<(typeof tarotCards)[0] | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const shuffleCards = () => {
    setIsShuffling(true);
    setSelectedCard(null);

    // 模拟洗牌动画
    setTimeout(() => {
      // 随机抽取3张牌
      const shuffled = [...tarotCards].sort(() => Math.random() - 0.5);
      const picked = shuffled.slice(0, 3);
      setDrawnCards(picked);
      setIsShuffling(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen pt-20 pb-16 px-6" style={{ background: '#051d1f' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1
            className="text-4xl md:text-5xl font-bold tracking-tight text-[#f6f9ff] mb-4 glow-text"
            style={{ fontFamily: 'Oswald, sans-serif' }}
          >
            塔罗占卜
          </h1>
          <p className="text-[rgba(246,249,255,0.6)] max-w-xl mx-auto">
            静下心来，默念你想问的问题，从牌阵中寻找答案
          </p>
        </div>

        {/* Draw Button */}
        {drawnCards.length === 0 && (
          <div className="text-center mb-12">
            <button
              onClick={shuffleCards}
              disabled={isShuffling}
              className="liquid-glass px-10 py-5 rounded-full text-lg font-medium text-[#f6f9ff] interactive hover:text-[#efb6ff] transition-colors pulse-glow disabled:opacity-50"
            >
              {isShuffling ? '洗牌中...' : '开始抽牌'}
            </button>
          </div>
        )}

        {/* Shuffling Animation */}
        {isShuffling && (
          <div className="flex justify-center gap-4 mb-12">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-32 h-48 liquid-glass rounded-xl flex items-center justify-center"
                style={{ animation: `float ${0.8 + i * 0.2}s ease-in-out infinite` }}
              >
                <Sparkles className="w-8 h-8 text-[#efb6ff] animate-spin" />
              </div>
            ))}
          </div>
        )}

        {/* Drawn Cards */}
        {drawnCards.length > 0 && !isShuffling && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {drawnCards.map((card, index) => (
                <button
                  key={card.id}
                  onClick={() => setSelectedCard(selectedCard?.id === card.id ? null : card)}
                  className={`liquid-glass rounded-2xl p-6 interactive text-center transition-all duration-300 hover:scale-[1.02] ${
                    selectedCard?.id === card.id ? 'ring-2 ring-[#efb6ff]' : ''
                  }`}
                >
                  <p className="text-xs text-[rgba(246,249,255,0.4)] mb-3">
                    {index === 0 ? '过去' : index === 1 ? '现在' : '未来'}
                  </p>
                  <div className="text-[#efb6ff] mb-4 flex justify-center">{card.icon}</div>
                  <h3 className="text-xl font-bold text-[#f6f9ff] mb-2">{card.name}</h3>
                  <p className="text-sm text-[rgba(246,249,255,0.6)]">{card.meaning}</p>
                </button>
              ))}
            </div>

            {/* Selected Card Detail */}
            {selectedCard && (
              <div className="liquid-glass rounded-2xl p-6 md:p-8 mb-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-[#efb6ff]">{selectedCard.icon}</div>
                  <h3 className="text-2xl font-bold text-[#f6f9ff]">{selectedCard.name}</h3>
                </div>
                <p className="text-[rgba(246,249,255,0.8)] leading-relaxed mb-4">{selectedCard.detail}</p>
                <div className="flex flex-wrap gap-2">
                  {selectedCard.meaning.split('，').map((keyword, i) => (
                    <span key={i} className="px-3 py-1 rounded-full text-xs bg-[rgba(239,182,255,0.1)] text-[#efb6ff]">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Redraw Button */}
            <div className="text-center">
              <button
                onClick={shuffleCards}
                disabled={isShuffling}
                className="inline-flex items-center gap-2 liquid-glass px-8 py-4 rounded-full text-[#f6f9ff] interactive hover:text-[#efb6ff] transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
                重新抽牌
              </button>
            </div>
          </>
        )}

        {/* Card Meanings Reference */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-[#f6f9ff] mb-6 text-center">牌义参考</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {tarotCards.map((card) => (
              <div
                key={card.id}
                className="liquid-glass rounded-xl p-3 text-center group hover:scale-105 transition-transform"
              >
                <div className="text-[#efb6ff] mb-2 flex justify-center group-hover:scale-110 transition-transform">
                  {card.icon}
                </div>
                <p className="text-sm font-semibold text-[#f6f9ff]">{card.name}</p>
                <p className="text-xs text-[rgba(246,249,255,0.5)]">{card.meaning.split('，')[0]}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
