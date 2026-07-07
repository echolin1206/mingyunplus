// ========== 命运+ 纯前端 API ==========
// 所有逻辑纯前端实现，无需后端服务器

// 每日宜忌
const getDailyAlmanac = (date) => {
    const yiList = ['出行','祭祀','祈福','求嗣','开光','解除','伐木','出火','拆卸','修造','动土','上梁','安床','入宅','移徙','嫁娶','纳采','订盟','会亲友','进人口','竖柱','开市','立券','交易','纳财','栽种','牧养','纳畜','安葬'];
    const jiList = ['嫁娶','移徙','入宅','安门','作灶','出火','进人口','纳畜','开市','立券','交易','纳财','出货财','栽种','伐木','安葬','破土','置产','行丧','探病','开仓','经络','纳采','订盟','斋醮','出货财','祈福','求嗣','解除'];
    const colors = [
        {name:'星空紫', value:'#6B5B95'}, {name:'晨曦金', value:'#FFD700'}, {name:'翡翠绿', value:'#2E8B57'},
        {name:'胭脂红', value:'#E34234'}, {name:'天空蓝', value:'#87CEEB'}, {name:'樱花粉', value:'#FFB7C5'},
        {name:'琥珀橙', value:'#FFBF00'}, {name:'月光银', value:'#C0C0C0'}, {name:'暮云灰', value:'#708090'},
        {name:'碧海青', value:'#20B2AA'}
    ];
    const blessings = [
        '今日星辰相伴，好运自然来。保持微笑，美好的事物正在向你靠近。',
        '晨起沐朝阳，暮归携星光。今日的你，自带光芒，所行皆坦途。',
        '命里有时终须有，今日宜开怀大笑。放下忧虑，轻装前行。',
        '天时地利人和，今日诸事顺遂。心怀善意，福运自至。',
        '云开见月明，今日柳暗花明。坚持初心，好运已在路上。',
        '春风得意马蹄疾，一日看尽长安花。今日的你，值得所有美好。',
        '流水不争先，争的是滔滔不绝。今日宜稳扎稳打，厚积薄发。',
        '星光不问赶路人，时光不负有心人。今日的努力，是明日的惊喜。',
        '山有顶峰，湖有彼岸。今日若觉艰难，请相信一切终有回甘。',
        '心若向阳，无畏悲伤。今日宜积极乐观，好运气喜欢爱笑的人。'
    ];

    const seed = parseInt(date.replace(/-/g, ''));
    const rng = (s) => { let x = s; return () => { x = (x * 9301 + 49297) % 233280; return x / 233280; }; };
    const r = rng(seed);

    const shuf = (arr) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

    const yi = shuf(yiList).slice(0, 5 + Math.floor(r() * 4));
    const ji = shuf(jiList).slice(0, 3 + Math.floor(r() * 3));
    const color = colors[Math.floor(r() * colors.length)];
    const blessing = blessings[Math.floor(r() * blessings.length)];
    const score = 60 + Math.floor(r() * 41);

    return { date, yi: yi.join('、'), ji: ji.join('、'), luckyColor: color.name, luckyColorValue: color.value, blessing, fortuneScore: score };
};

// 命运测试
const calculateFateResult = (answers) => {
    const types = ['天命型','奋斗型','幸运型','智慧型','领袖型','艺术家型','守护型','探索型'];
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
    const score = answers.reduce((s, a) => s + parseInt(a), 0);
    const type = types[score % types.length];
    const luckyNumbers = [3, 7, 8, 9, 12, 16, 21, 28, 33, 42];
    const luckyColors = ['星空紫','晨曦金','翡翠绿','天空蓝','樱花粉'];
    return {
        type,
        description: descriptions[type],
        todayFortune: ['大吉','吉','中吉','小吉','平'][score % 5],
        luckyNumber: luckyNumbers[score % luckyNumbers.length],
        luckyColor: luckyColors[score % luckyColors.length],
        advice: '今日宜保持平常心，顺其自然。',
        score: 60 + (score % 41)
    };
};

// 塔罗
const drawTarot = (spread, question) => {
    const majorArcana = [
        {name:'愚者', nameEn:'The Fool', keywords:'开端、自由、冒险', meaning:'新的旅程即将开始，保持开放的心态，拥抱未知的可能。'},
        {name:'魔术师', nameEn:'The Magician', keywords:'创造、行动、意志力', meaning:'你拥有实现目标所需的一切资源，现在是行动的最佳时机。'},
        {name:'女祭司', nameEn:'The High Priestess', keywords:'直觉、智慧、秘密', meaning:'相信你的直觉，答案就在你内心深处，静静聆听。'},
        {name:'女皇', nameEn:'The Empress', keywords:'丰饶、创造、母性', meaning:'丰盛与创造力环绕着你，滋养自己和他人，享受生命的馈赠。'},
        {name:'皇帝', nameEn:'The Emperor', keywords:'权威、结构、稳定', meaning:'建立秩序和规则，用理性和纪律来达成你的目标。'},
        {name:'教皇', nameEn:'The Hierophant', keywords:'传统、教导、信仰', meaning:'寻求智慧的指引，传统中蕴含着宝贵的经验和教训。'},
        {name:'恋人', nameEn:'The Lovers', keywords:'爱、选择、和谐', meaning:'重要的关系和选择摆在面前，跟随内心做出决定。'},
        {name:'战车', nameEn:'The Chariot', keywords:'胜利、意志、掌控', meaning:'通过坚定的意志力和自律，你将克服障碍取得胜利。'},
        {name:'力量', nameEn:'Strength', keywords:'勇气、耐心、内在力量', meaning:'真正的力量来自内心，用温柔和耐心驯服困难。'},
        {name:'隐者', nameEn:'The Hermit', keywords:'内省、指引、独处', meaning:'暂时退后，在独处中寻找智慧，内在的灯塔会指引方向。'},
        {name:'命运之轮', nameEn:'Wheel of Fortune', keywords:'转变、周期、命运', meaning:'命运之轮正在转动，顺应变化，新的周期即将开启。'},
        {name:'正义', nameEn:'Justice', keywords:'公平、真理、因果', meaning:'公正和平衡将得以伸张，你的行为将决定结果。'},
        {name:'倒吊人', nameEn:'The Hanged Man', keywords:'牺牲、暂停、新视角', meaning:'换个角度看问题，暂时的停顿是为了更好的出发。'},
        {name:'死神', nameEn:'Death', keywords:'结束、转变、新生', meaning:'旧事物的结束意味着新事物的开始，拥抱转变。'},
        {name:'节制', nameEn:'Temperance', keywords:'平衡、调和、耐心', meaning:'保持适度和平衡，融合对立的力量，创造和谐。'},
        {name:'恶魔', nameEn:'The Devil', keywords:'束缚、欲望、物质', meaning:'警惕过度的欲望和执念，打破自我设限的枷锁。'},
        {name:'塔', nameEn:'The Tower', keywords:'突变、启示、解放', meaning:'看似灾难的变故，实则是打破幻象、重建真实的机会。'},
        {name:'星星', nameEn:'The Star', keywords:'希望、灵感、宁静', meaning:'希望之光在前方闪耀，保持信念，愿望终将实现。'},
        {name:'月亮', nameEn:'The Moon', keywords:'幻觉、恐惧、潜意识', meaning:'面对内心的恐惧和不安，穿越迷雾，真相就在前方。'},
        {name:'太阳', nameEn:'The Sun', keywords:'成功、快乐、活力', meaning:'光明和成功伴随着你，尽情享受生命的美好时刻。'},
        {name:'审判', nameEn:'Judgement', keywords:'觉醒、重生、评价', meaning:'内心的呼唤唤醒了你，是时候做出改变了，重生在即。'},
        {name:'世界', nameEn:'The World', keywords:'完成、成就、圆满', meaning:'一个周期的圆满完成，收获成果，准备踏上新的旅程。'}
    ];
    const cardCount = spread === 'single' ? 1 : spread === 'three' ? 3 : 10;
    const cards = [];
    const used = new Set();
    for (let i = 0; i < cardCount; i++) {
        let idx;
        do { idx = Math.floor(Math.random() * majorArcana.length); } while (used.has(idx));
        used.add(idx);
        const reversed = Math.random() < 0.3;
        cards.push({...majorArcana[idx], reversed, position: i + 1});
    }
    const spreadName = spread === 'single' ? '单张牌' : spread === 'three' ? '三张牌阵（过去/现在/未来）' : '凯尔特十字';
    return {
        spread: spreadName,
        question,
        cards,
        summary: cards.length === 1 ? `关于"${question}"，${cards[0].name}牌显示：${cards[0].meaning}` : `针对"${question}"的塔罗指引：${cards[0].name}揭示了问题的根源，${cards[1].name}展示了当下的状态，${cards[2] ? cards[2].name + '预示了未来的走向' : ''}。整体而言，你需要在变化中保持觉知，顺应命运的指引。`
    };
};

// 星座运势
const getZodiacFortune = (sign, period) => {
    const signs = ['aries','taurus','gemini','cancer','leo','virgo','libra','scorpio','sagittarius','capricorn','aquarius','pisces'];
    const signNames = ['白羊座','金牛座','双子座','巨蟹座','狮子座','处女座','天秤座','天蝎座','射手座','摩羯座','水瓶座','双鱼座'];
    const idx = signs.indexOf(sign);
    if (idx === -1) return null;
    const cats = ['爱情','事业','财富','健康'];
    const stars = ['★★★★★','★★★★☆','★★★☆☆','★★☆☆☆'];
    const adv = ['今日能量充沛，适合主动出击','保持平和心态，静待时机','与人合作能带来收获','注意细节，避免冲动','适当放慢脚步，给自己充电','表达真实想法，沟通带来转机','财务方面谨慎为上','健康是今日重点'];
    const details = {};
    cats.forEach(c => details[c] = stars[Math.floor(Math.random() * stars.length)]);
    return {
        sign: signNames[idx],
        period: period === 'daily' ? '今日' : period === 'weekly' ? '本周' : period === 'monthly' ? '本月' : '本年',
        overall: stars[Math.floor(Math.random() * 3)],
        details,
        advice: adv[Math.floor(Math.random() * adv.length)],
        luckyNumber: Math.floor(Math.random() * 99) + 1,
        luckyColor: ['星空紫','晨曦金','翡翠绿','天空蓝','樱花粉'][Math.floor(Math.random() * 5)]
    };
};

// 紫微星盘
const calculateZiwei = (birthYear, birthMonth, birthDay, birthHour, gender) => {
    const mainStars = ['紫微','天机','太阳','武曲','天同','廉贞','天府','太阴','贪狼','巨门','天相','天梁','七杀','破军'];
    const palaces = ['命宫','兄弟宫','夫妻宫','子女宫','财帛宫','疾厄宫','迁移宫','仆役宫','官禄宫','田宅宫','福德宫','父母宫'];
    const palaceStars = {};
    palaces.forEach(p => {
        const stars = [];
        for (let i = 0; i < 1 + Math.floor(Math.random() * 3); i++) {
            stars.push(mainStars[Math.floor(Math.random() * mainStars.length)]);
        }
        palaceStars[p] = [...new Set(stars)];
    });
    const destiny = palaces[Math.floor(Math.random() * palaces.length)];
    const body = palaces[Math.floor(Math.random() * palaces.length)];
    const ming = ['杀破狼','机月同梁','紫府武相'][Math.floor(Math.random() * 3)];
    const xing = ['吉星拱照','凶星聚会','吉凶参半'][Math.floor(Math.random() * 3)];
    return {
        birthInfo: {year: birthYear, month: birthMonth, day: birthDay, hour: birthHour, gender},
        destinyPalace: destiny, bodyPalace: body, ming, xing, palaceStars,
        summary: `你的命宫在${destiny}，主星组合为${ming}格局。${destiny}有${palaceStars[destiny].join('、')}等星曜坐守，显示你${destiny === '命宫' ? '个性鲜明，有领导才能' : destiny === '兄弟宫' ? '人缘极佳，贵人运旺' : '命运独特，需要自我探索'}。`,
        advice: '今日宜发挥自身特长，保持积极心态。'
    };
};

// 流年运势
const calculateYearlyFortune = (birthYear, zodiac) => {
    const zodiacs = ['鼠','牛','虎','兔','龙','蛇','马','羊','猴','鸡','狗','猪'];
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthYear;
    const aspects = ['事业运','财运','感情运','健康运','学业运'];
    const scores = aspects.map(() => 60 + Math.floor(Math.random() * 41));
    const fortunes = ['吉星高照','平平稳稳','小有波折','否极泰来'];
    const fortune = fortunes[Math.floor(Math.random() * fortunes.length)];
    const luckyItems = {
        '鼠': {color:'星空紫', direction:'北方', number:2}, '牛': {color:'翡翠绿', direction:'东北', number:5},
        '虎': {color:'烈焰红', direction:'东方', number:3}, '兔': {color:'樱花粉', direction:'东方', number:4},
        '龙': {color:'晨曦金', direction:'东南', number:1}, '蛇': {color:'神秘黑', direction:'东南', number:6},
        '马': {color:'烈焰红', direction:'南方', number:7}, '羊': {color:'翡翠绿', direction:'西南', number:8},
        '猴': {color:'天空蓝', direction:'西南', number:9}, '鸡': {color:'晨曦金', direction:'西方', number:10},
        '狗': {color:'琥珀橙', direction:'西北', number:11}, '猪': {color:'星空紫', direction:'西北', number:12}
    };
    const lucky = luckyItems[zodiac] || {color:'晨曦金', direction:'中央', number:5};
    const monthly = [];
    for (let i = 1; i <= 12; i++) {
        monthly.push({month: i, score: 50 + Math.floor(Math.random() * 51), highlight: ['宜投资理财','宜社交拓展','宜学习充电','宜休养生息','宜出行旅游'][Math.floor(Math.random() * 5)]});
    }
    return {
        year: currentYear, age, zodiac, overallFortune: fortune,
        aspectScores: aspects.reduce((o, a, i) => {o[a] = scores[i]; return o;}, {}),
        luckyColor: lucky.color, luckyDirection: lucky.direction, luckyNumber: lucky.number,
        monthlyFortunes: monthly,
        summary: `${currentYear}年，你的整体趣味状态呈现"${fortune}"之象。${fortune === '吉星高照' ? '这是大展宏图的一年，把握机会！' : fortune === '平平稳稳' ? '保持平常心，稳中求进。' : '保持耐心，困难是暂时的。'}`,
        advice: fortune === '吉星高照' ? '积极出击，把握机遇' : '保持耐心，静待时机'
    };
};

// 支付订单模拟
const createOrder = (userId, productType) => {
    const date = new Date().toISOString().slice(0,10).replace(/-/g,'');
    const suffix = Math.random().toString(36).substr(2,6).toUpperCase();
    const orderNo = `MY${date}${suffix}`;
    const productMap = {single: {name: '单次深度测算', price: 9.9}, lifetime: {name: '全站畅玩权益', price: 39}};
    const product = productMap[productType];
    return {orderNo, amount: product.price, productName: product.name, demoMode: true};
};

// 导出
window.MYAPI = {
    getDailyAlmanac, calculateFateResult, drawTarot, getZodiacFortune, calculateZiwei, calculateYearlyFortune, createOrder
};
