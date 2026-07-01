const express = require('express');
const router = express.Router();
const {
    getDailyAlmanac,
    saveDivinationRecord
} = require('../utils/divination');

// 获取每日宜忌
router.get('/daily-almanac', async (req, res) => {
    try {
        const today = new Date().toISOString().slice(0, 10);
        const almanac = await getDailyAlmanac(today);
        res.json({ code: 0, data: almanac });
    } catch (err) {
        console.error('获取每日宜忌失败:', err);
        res.status(500).json({ code: -1, msg: '获取失败' });
    }
});

// 命运测试
router.post('/test-fate', async (req, res) => {
    try {
        const { answers } = req.body;
        const result = calculateFateResult(answers);
        res.json({ code: 0, data: result });
    } catch (err) {
        console.error('命运测试失败:', err);
        res.status(500).json({ code: -1, msg: '测算失败' });
    }
});

// 塔罗占卜
router.post('/tarot', async (req, res) => {
    try {
        const { spread, question } = req.body;
        const result = drawTarot(spread, question);
        res.json({ code: 0, data: result });
    } catch (err) {
        console.error('塔罗占卜失败:', err);
        res.status(500).json({ code: -1, msg: '抽牌失败' });
    }
});

// 星座运势
router.get('/zodiac/:sign', async (req, res) => {
    try {
        const { sign } = req.params;
        const { period = 'daily' } = req.query;
        const result = getZodiacFortune(sign, period);
        res.json({ code: 0, data: result });
    } catch (err) {
        console.error('星座运势失败:', err);
        res.status(500).json({ code: -1, msg: '获取失败' });
    }
});

// 紫微星盘
router.post('/ziwei', async (req, res) => {
    try {
        const { birthYear, birthMonth, birthDay, birthHour, gender } = req.body;
        const result = calculateZiwei(birthYear, birthMonth, birthDay, birthHour, gender);
        res.json({ code: 0, data: result });
    } catch (err) {
        console.error('紫微星盘失败:', err);
        res.status(500).json({ code: -1, msg: '排盘失败' });
    }
});

// 流年运势
router.post('/yearly-fortune', async (req, res) => {
    try {
        const { birthYear, zodiac } = req.body;
        const result = calculateYearlyFortune(birthYear, zodiac);
        res.json({ code: 0, data: result });
    } catch (err) {
        console.error('流年运势失败:', err);
        res.status(500).json({ code: -1, msg: '测算失败' });
    }
});

// ============ 测算逻辑函数 ============

function calculateFateResult(answers) {
    const types = ['天命型', '奋斗型', '幸运型', '智慧型', '领袖型', '艺术家型', '守护型', '探索型'];
    const descriptions = {
        '天命型': '你天生自带光环，仿佛被命运选中。关键时刻总有贵人相助，但需谨记：天赋是礼物，努力才是答案。',
        '奋斗型': '你相信人定胜天，用汗水浇灌梦想。你的命运掌握在自己手中，每一份付出都会有回报。',
        '幸运型': '幸运女神常伴你左右，生活中总有意外之喜。但真正的智慧，是在好运时保持谦逊。',
        '智慧型': '你以智取胜，善于洞察先机。命运的齿轮在你的思考中转动，冷静是你的超能力。',
        '领袖型': '你天生具有号召力，能凝聚人心。命运给予你舞台，而你的担当让一切发光。',
        '艺术家型': '你感受世界的方式独一无二。命运对你而言是一幅画卷，而你正在用灵感描绘它。',
        '守护型': '你的温暖和善良是最好的护身符。看似平淡的命运中，你守护着最珍贵的幸福。',
        '探索型': '你不满足于已知，总在追寻新的可能。命运对你而言是一场冒险，而你享受每一程。'
    };
    const fortunes = ['大吉', '吉', '中吉', '小吉', '平', '小凶', '凶', '大凶'];
    
    // 根据答案计算类型（简化版）
    const score = answers.reduce((sum, a) => sum + parseInt(a), 0);
    const typeIndex = score % types.length;
    const type = types[typeIndex];
    
    // 今日运势
    const fortuneIndex = Math.floor(Math.random() * fortunes.length);
    const todayFortune = fortunes[fortuneIndex];
    
    // 幸运数字和颜色
    const luckyNumbers = [3, 7, 8, 9, 12, 16, 21, 28, 33, 42];
    const luckyColors = ['星空紫', '晨曦金', '翡翠绿', '天空蓝', '樱花粉'];
    
    return {
        type,
        description: descriptions[type],
        todayFortune,
        luckyNumber: luckyNumbers[score % luckyNumbers.length],
        luckyColor: luckyColors[score % luckyColors.length],
        advice: getAdviceByType(type),
        score: 60 + (score % 41)
    };
}

function getAdviceByType(type) {
    const advice = {
        '天命型': '今日宜：把握机遇，展现自我。忌：骄傲自满，错失良机。',
        '奋斗型': '今日宜：坚持计划，步步为营。忌：急于求成，透支精力。',
        '幸运型': '今日宜：尝试新事物，扩大社交。忌：过度依赖运气，忽视细节。',
        '智慧型': '今日宜：深度思考，制定策略。忌：思虑过度，错失行动时机。',
        '领袖型': '今日宜：团队协作，激励他人。忌：独断专行，忽视他人感受。',
        '艺术家型': '今日宜：创作表达，欣赏美。忌：沉溺幻想，逃避现实。',
        '守护型': '今日宜：陪伴家人，关怀朋友。忌：过度付出，忽略自己。',
        '探索型': '今日宜：学习新知，探索未知。忌：浅尝辄止，缺乏耐心。'
    };
    return advice[type] || '保持平常心，顺其自然。';
}

function drawTarot(spread, question) {
    const majorArcana = [
        { name: '愚者', nameEn: 'The Fool', keywords: '开端、自由、冒险', meaning: '新的旅程即将开始，保持开放的心态，拥抱未知的可能。', element: '风' },
        { name: '魔术师', nameEn: 'The Magician', keywords: '创造、行动、意志力', meaning: '你拥有实现目标所需的一切资源，现在是行动的最佳时机。', element: '风' },
        { name: '女祭司', nameEn: 'The High Priestess', keywords: '直觉、智慧、秘密', meaning: '相信你的直觉，答案就在你内心深处，静静聆听。', element: '水' },
        { name: '女皇', nameEn: 'The Empress', keywords: '丰饶、创造、母性', meaning: '丰盛与创造力环绕着你，滋养自己和他人，享受生命的馈赠。', element: '土' },
        { name: '皇帝', nameEn: 'The Emperor', keywords: '权威、结构、稳定', meaning: '建立秩序和规则，用理性和纪律来达成你的目标。', element: '火' },
        { name: '教皇', nameEn: 'The Hierophant', keywords: '传统、教导、信仰', meaning: '寻求智慧的指引，传统中蕴含着宝贵的经验和教训。', element: '土' },
        { name: '恋人', nameEn: 'The Lovers', keywords: '爱、选择、和谐', meaning: '重要的关系和选择摆在面前，跟随内心做出决定。', element: '风' },
        { name: '战车', nameEn: 'The Chariot', keywords: '胜利、意志、掌控', meaning: '通过坚定的意志力和自律，你将克服障碍取得胜利。', element: '水' },
        { name: '力量', nameEn: 'Strength', keywords: '勇气、耐心、内在力量', meaning: '真正的力量来自内心，用温柔和耐心驯服困难。', element: '火' },
        { name: '隐者', nameEn: 'The Hermit', keywords: '内省、指引、独处', meaning: '暂时退后，在独处中寻找智慧，内在的灯塔会指引方向。', element: '土' },
        { name: '命运之轮', nameEn: 'Wheel of Fortune', keywords: '转变、周期、命运', meaning: '命运之轮正在转动，顺应变化，新的周期即将开启。', element: '火' },
        { name: '正义', nameEn: 'Justice', keywords: '公平、真理、因果', meaning: '公正和平衡将得以伸张，你的行为将决定结果。', element: '风' },
        { name: '倒吊人', nameEn: 'The Hanged Man', keywords: '牺牲、暂停、新视角', meaning: '换个角度看问题，暂时的停顿是为了更好的出发。', element: '水' },
        { name: '死神', nameEn: 'Death', keywords: '结束、转变、新生', meaning: '旧事物的结束意味着新事物的开始，拥抱转变。', element: '水' },
        { name: '节制', nameEn: 'Temperance', keywords: '平衡、调和、耐心', meaning: '保持适度和平衡，融合对立的力量，创造和谐。', element: '火' },
        { name: '恶魔', nameEn: 'The Devil', keywords: '束缚、欲望、物质', meaning: '警惕过度的欲望和执念，打破自我设限的枷锁。', element: '土' },
        { name: '塔', nameEn: 'The Tower', keywords: '突变、启示、解放', meaning: '看似灾难的变故，实则是打破幻象、重建真实的机会。', element: '火' },
        { name: '星星', nameEn: 'The Star', keywords: '希望、灵感、宁静', meaning: '希望之光在前方闪耀，保持信念，愿望终将实现。', element: '风' },
        { name: '月亮', nameEn: 'The Moon', keywords: '幻觉、恐惧、潜意识', meaning: '面对内心的恐惧和不安，穿越迷雾，真相就在前方。', element: '水' },
        { name: '太阳', nameEn: 'The Sun', keywords: '成功、快乐、活力', meaning: '光明和成功伴随着你，尽情享受生命的美好时刻。', element: '火' },
        { name: '审判', nameEn: 'Judgement', keywords: '觉醒、重生、评价', meaning: '内心的呼唤唤醒了你，是时候做出改变了，重生在即。', element: '火' },
        { name: '世界', nameEn: 'The World', keywords: '完成、成就、圆满', meaning: '一个周期的圆满完成，收获成果，准备踏上新的旅程。', element: '土' }
    ];

    const spreadNames = {
        'single': '单张牌',
        'three': '三张牌阵（过去/现在/未来）',
        'celtic': '凯尔特十字'
    };

    const cardCount = spread === 'single' ? 1 : spread === 'three' ? 3 : 10;
    const cards = [];
    const used = new Set();
    
    for (let i = 0; i < cardCount; i++) {
        let idx;
        do { idx = Math.floor(Math.random() * majorArcana.length); } while (used.has(idx));
        used.add(idx);
        const reversed = Math.random() < 0.3;
        cards.push({ ...majorArcana[idx], reversed, position: i + 1 });
    }

    return {
        spread: spreadNames[spread] || '单张牌',
        question,
        cards,
        summary: generateTarotSummary(cards, question)
    };
}

function generateTarotSummary(cards, question) {
    if (cards.length === 1) {
        return `关于"${question}"，${cards[0].name}牌显示：${cards[0].meaning}${cards[0].reversed ? '（逆位：能量受阻，需从反面思考）' : ''}`;
    }
    return `针对"${question}"的塔罗指引：${cards[0].name}揭示了问题的根源，${cards[1].name}展示了当下的状态，${cards[2] ? cards[2].name + '预示了未来的走向' : ''}。整体而言，你需要在变化中保持觉知，顺应命运的指引。`;
}

function getZodiacFortune(sign, period) {
    const signs = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];
    const signNames = ['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座'];
    const signIndex = signs.indexOf(sign);
    if (signIndex === -1) return null;

    const categories = ['爱情', '事业', '财富', '健康'];
    const fortunes = ['★★★★★', '★★★★☆', '★★★☆☆', '★★☆☆☆', '★☆☆☆☆'];
    const advices = [
        '今日能量充沛，适合主动出击，把握机会。',
        '保持平和心态，静待时机成熟。',
        '与人合作能带来意想不到的收获。',
        '注意细节，避免冲动决策。',
        '适当放慢脚步，给自己充电的时间。',
        '表达真实想法，沟通会带来转机。',
        '财务方面谨慎为上，不宜大额支出。',
        '健康是今日重点，记得休息和锻炼。'
    ];

    const result = {
        sign: signNames[signIndex],
        period: period === 'daily' ? '今日' : period === 'weekly' ? '本周' : period === 'monthly' ? '本月' : '本年',
        overall: fortunes[Math.floor(Math.random() * 3)],
        details: {},
        advice: advices[Math.floor(Math.random() * advices.length)],
        luckyNumber: Math.floor(Math.random() * 99) + 1,
        luckyColor: ['星空紫', '晨曦金', '翡翠绿', '天空蓝', '樱花粉'][Math.floor(Math.random() * 5)]
    };

    categories.forEach(cat => {
        result.details[cat] = fortunes[Math.floor(Math.random() * fortunes.length)];
    });

    return result;
}

function calculateZiwei(birthYear, birthMonth, birthDay, birthHour, gender) {
    const mainStars = ['紫微', '天机', '太阳', '武曲', '天同', '廉贞', '天府', '太阴', '贪狼', '巨门', '天相', '天梁', '七杀', '破军'];
    const palaces = ['命宫', '兄弟宫', '夫妻宫', '子女宫', '财帛宫', '疾厄宫', '迁移宫', '仆役宫', '官禄宫', '田宅宫', '福德宫', '父母宫'];
    
    // 简化版紫微排盘
    const palaceStars = {};
    palaces.forEach(palace => {
        const starCount = 1 + Math.floor(Math.random() * 3);
        const stars = [];
        for (let i = 0; i < starCount; i++) {
            stars.push(mainStars[Math.floor(Math.random() * mainStars.length)]);
        }
        palaceStars[palace] = [...new Set(stars)];
    });

    const destinyPalace = palaces[Math.floor(Math.random() * palaces.length)];
    const bodyPalace = palaces[Math.floor(Math.random() * palaces.length)];
    
    const ming = ['杀破狼', '机月同梁', '紫府武相'][Math.floor(Math.random() * 3)];
    const xing = ['吉星拱照', '凶星聚会', '吉凶参半'][Math.floor(Math.random() * 3)];

    return {
        birthInfo: { year: birthYear, month: birthMonth, day: birthDay, hour: birthHour, gender },
        destinyPalace,
        bodyPalace,
        ming,
        xing,
        palaceStars,
        summary: `你的命宫在${destinyPalace}，主星组合为${ming}格局。${destinyPalace}有${palaceStars[destinyPalace].join('、')}等星曜坐守，显示你${getZiweiSummary(destinyPalace, ming)}。`,
        advice: getZiweiAdvice(destinyPalace)
    };
}

function getZiweiSummary(palace, ming) {
    const summaries = {
        '命宫': '个性鲜明，有领导才能',
        '兄弟宫': '人缘极佳，贵人运旺',
        '夫妻宫': '感情丰富，重视关系',
        '子女宫': '创造力强，适合创新领域',
        '财帛宫': '财运亨通，善于理财',
        '疾厄宫': '需要注意健康保养',
        '迁移宫': '适合外出发展，变动带来机遇',
        '仆役宫': '团队合作能力强',
        '官禄宫': '事业心强，有成就欲望',
        '田宅宫': '重视家庭，房产运佳',
        '福德宫': '精神生活丰富，福气深厚',
        '父母宫': '受长辈荫庇，家教良好'
    };
    return summaries[palace] || '命运多舛，需努力拼搏';
}

function getZiweiAdvice(palace) {
    const advice = {
        '命宫': '发挥领导力，但需听取他人意见',
        '兄弟宫': '多结交良师益友',
        '夫妻宫': '感情需要经营，沟通是关键',
        '子女宫': '培养创新思维，敢于突破',
        '财帛宫': '投资需谨慎，理性消费',
        '疾厄宫': '规律作息，定期体检',
        '迁移宫': '把握出差、旅行中的机会',
        '仆役宫': '团队协作中展现价值',
        '官禄宫': '专注目标，稳步前进',
        '田宅宫': '重视家庭和谐',
        '福德宫': '保持乐观，积德行善',
        '父母宫': '孝顺长辈，传承家风'
    };
    return advice[palace] || '顺其自然，随遇而安';
}

function calculateYearlyFortune(birthYear, zodiac) {
    const zodiacs = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthYear;
    
    const aspects = ['事业运', '财运', '感情运', '健康运', '学业运'];
    const scores = aspects.map(() => 60 + Math.floor(Math.random() * 41));
    
    const fortunes = ['太岁当头', '吉星高照', '平平稳稳', '小有波折', '否极泰来'];
    const fortune = fortunes[Math.floor(Math.random() * fortunes.length)];
    
    const luckyItems = {
        '鼠': { color: '星空紫', direction: '北方', number: 2 },
        '牛': { color: '翡翠绿', direction: '东北', number: 5 },
        '虎': { color: '烈焰红', direction: '东方', number: 3 },
        '兔': { color: '樱花粉', direction: '东方', number: 4 },
        '龙': { color: '晨曦金', direction: '东南', number: 1 },
        '蛇': { color: '神秘黑', direction: '东南', number: 6 },
        '马': { color: '烈焰红', direction: '南方', number: 7 },
        '羊': { color: '翡翠绿', direction: '西南', number: 8 },
        '猴': { color: '天空蓝', direction: '西南', number: 9 },
        '鸡': { color: '晨曦金', direction: '西方', number: 10 },
        '狗': { color: '琥珀橙', direction: '西北', number: 11 },
        '猪': { color: '星空紫', direction: '西北', number: 12 }
    };
    
    const zodiacIndex = zodiacs.indexOf(zodiac);
    const lucky = luckyItems[zodiac] || { color: '晨曦金', direction: '中央', number: 5 };
    
    const monthlyFortunes = [];
    for (let i = 1; i <= 12; i++) {
        monthlyFortunes.push({
            month: i,
            score: 50 + Math.floor(Math.random() * 51),
            highlight: ['宜投资理财', '宜社交拓展', '宜学习充电', '宜休养生息', '宜出行旅游'][Math.floor(Math.random() * 5)]
        });
    }
    
    return {
        year: currentYear,
        age,
        zodiac,
        overallFortune: fortune,
        aspectScores: aspects.reduce((obj, aspect, i) => {
            obj[aspect] = scores[i];
            return obj;
        }, {}),
        luckyColor: lucky.color,
        luckyDirection: lucky.direction,
        luckyNumber: lucky.number,
        monthlyFortunes,
        summary: `${currentYear}年，你的整体运势呈现"${fortune}"之象。${fortune === '吉星高照' ? '这是大展宏图的一年，把握机会！' : fortune === '太岁当头' ? '需要谨慎行事，低调为上。' : '保持平常心，稳中求进。'}`,
        advice: getYearlyAdvice(fortune)
    };
}

function getYearlyAdvice(fortune) {
    const advice = {
        '太岁当头': '低调行事，避免大额投资，注意健康，多行善积德。',
        '吉星高照': '积极出击，把握机遇，拓展人脉，尝试新的挑战。',
        '平平稳稳': '稳中求进，巩固现有成果，适当储蓄，保持现状。',
        '小有波折': '保持耐心，困难是暂时的，多听取长辈建议。',
        '否极泰来': '黎明前的黑暗，坚持就是胜利，下半年运势会好转。'
    };
    return advice[fortune] || '顺其自然，做好自己。';
}

module.exports = router;
