const db = require('./db');

// 生成订单号
function generateOrderNo() {
    const date = new Date();
    const prefix = date.toISOString().slice(0, 10).replace(/-/g, '');
    const suffix = Math.random().toString(36).substr(2, 6).toUpperCase();
    return `MY${prefix}${suffix}`;
}

// 创建订单
function createOrder(userId, productType, amount) {
    return new Promise((resolve, reject) => {
        const orderNo = generateOrderNo();
        db.run(
            `INSERT INTO orders (user_id, order_no, product_type, amount) VALUES (?, ?, ?, ?)`,
            [userId, orderNo, productType, amount],
            function(err) {
                if (err) reject(err);
                else resolve({ id: this.lastID, orderNo });
            }
        );
    });
}

// 根据订单号查询订单
function getOrderByNo(orderNo) {
    return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM orders WHERE order_no = ?`, [orderNo], (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}

// 更新订单状态为已支付
function updateOrderPaid(orderNo, payTime) {
    return new Promise((resolve, reject) => {
        db.run(
            `UPDATE orders SET status = 1, pay_time = ? WHERE order_no = ?`,
            [payTime, orderNo],
            function(err) {
                if (err) reject(err);
                else resolve(this.changes);
            }
        );
    });
}

// 检查用户是否VIP
function checkUserVip(userId) {
    return new Promise((resolve, reject) => {
        db.get(`SELECT is_vip FROM users WHERE id = ?`, [userId], (err, row) => {
            if (err) reject(err);
            else resolve(row && row.is_vip === 1);
        });
    });
}

// 设置用户为VIP
function setUserVip(userId) {
    return new Promise((resolve, reject) => {
        db.run(
            `UPDATE users SET is_vip = 1, vip_expire = 9999999999 WHERE id = ?`,
            [userId],
            function(err) {
                if (err) reject(err);
                else resolve(this.changes);
            }
        );
    });
}

// 保存测算记录
function saveDivinationRecord(userId, type, inputData, resultData, isFree) {
    return new Promise((resolve, reject) => {
        db.run(
            `INSERT INTO divination_records (user_id, type, input_data, result_data, is_free) VALUES (?, ?, ?, ?, ?)`,
            [userId, type, JSON.stringify(inputData), JSON.stringify(resultData), isFree ? 1 : 0],
            function(err) {
                if (err) reject(err);
                else resolve(this.lastID);
            }
        );
    });
}

// 获取或生成每日宜忌
function getDailyAlmanac(date) {
    return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM daily_almanac WHERE date = ?`, [date], async (err, row) => {
            if (err) reject(err);
            else if (row) {
                // 数据库字段是下划线格式，统一转为驼峰
                resolve({
                    date: row.date,
                    yi: row.yi,
                    ji: row.ji,
                    luckyColor: row.lucky_color,
                    luckyColorValue: row.lucky_color_value,
                    blessing: row.blessing,
                    fortuneScore: row.fortune_score
                });
            }
            else {
                // 生成新的每日宜忌
                const almanac = generateDailyAlmanac(date);
                db.run(
                    `INSERT INTO daily_almanac (date, yi, ji, lucky_color, lucky_color_value, blessing, fortune_score) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                    [almanac.date, almanac.yi, almanac.ji, almanac.luckyColor, almanac.luckyColorValue, almanac.blessing, almanac.fortuneScore],
                    function(err) {
                        if (err) reject(err);
                        else resolve(almanac);
                    }
                );
            }
        });
    });
}

// 生成每日宜忌数据
function generateDailyAlmanac(date) {
    const yiList = [
        '出行', '祭祀', '祈福', '求嗣', '开光', '出行', '解除', '伐木', '出火', '拆卸', '修造', '动土', '上梁', '安床', '入宅', '移徙',
        '嫁娶', '纳采', '订盟', '会亲友', '进人口', '修造', '竖柱', '上梁', '开市', '立券', '交易', '纳财', '栽种', '牧养', '纳畜', '安葬'
    ];
    const jiList = [
        '嫁娶', '移徙', '入宅', '安门', '作灶', '出火', '进人口', '纳畜', '开市', '立券', '交易', '纳财', '出货财', '栽种', '伐木', '安葬',
        '破土', '置产', '行丧', '探病', '开仓', '经络', '纳采', '订盟', '斋醮', '开仓', '出货财', '祈福', '求嗣', '开光', '出行', '解除'
    ];
    const colors = [
        { name: '星空紫', value: '#6B5B95' },
        { name: '晨曦金', value: '#FFD700' },
        { name: '翡翠绿', value: '#2E8B57' },
        { name: '胭脂红', value: '#E34234' },
        { name: '天空蓝', value: '#87CEEB' },
        { name: '樱花粉', value: '#FFB7C5' },
        { name: '琥珀橙', value: '#FFBF00' },
        { name: '月光银', value: '#C0C0C0' },
        { name: '暮云灰', value: '#708090' },
        { name: '碧海青', value: '#20B2AA' }
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
        '心若向阳，无畏悲伤。今日宜积极乐观，好运气喜欢爱笑的人。',
        '人生如逆旅，我亦是行人。今日放宽心，沿途皆是风景。',
        '不求尽善尽美，但求无愧于心。今日做真实的自己，便是最好的运势。',
        '万物皆有裂痕，那是光照进来的地方。今日的不完美，亦是独特的礼物。',
        '积土而为山，积水而为海。今日宜积累小确幸，汇聚大幸福。',
        '海阔凭鱼跃，天高任鸟飞。今日宜大胆追梦，天地广阔任君行。'
    ];

    // 使用日期作为种子保证同一天结果一致
    const seed = date.split('-').join('');
    const rng = seededRandom(seed);

    const selectedYi = shuffleArray([...yiList], rng).slice(0, 5 + Math.floor(rng() * 4));
    const selectedJi = shuffleArray([...jiList], rng).slice(0, 3 + Math.floor(rng() * 3));
    const selectedColor = colors[Math.floor(rng() * colors.length)];
    const selectedBlessing = blessings[Math.floor(rng() * blessings.length)];
    const fortuneScore = 60 + Math.floor(rng() * 41);

    return {
        date,
        yi: selectedYi.join('、'),
        ji: selectedJi.join('、'),
        luckyColor: selectedColor.name,
        luckyColorValue: selectedColor.value,
        blessing: selectedBlessing,
        fortuneScore
    };
}

function seededRandom(seed) {
    let x = parseInt(seed);
    return function() {
        x = (x * 9301 + 49297) % 233280;
        return x / 233280;
    };
}

function shuffleArray(array, rng) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

module.exports = {
    createOrder,
    getOrderByNo,
    updateOrderPaid,
    checkUserVip,
    setUserVip,
    saveDivinationRecord,
    getDailyAlmanac
};
