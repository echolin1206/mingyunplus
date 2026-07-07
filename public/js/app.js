// ========== 命运+ 前端应用 ==========

// 全局状态
const state = {
    currentUser: JSON.parse(localStorage.getItem('my_user') || 'null'),
    isVip: false,
    currentPage: 'home',
    testAnswers: [],
    currentQuestion: 0,
    tarotSpread: 'single',
    zodiacPeriod: 'daily',
    selectedPayOption: 'lifetime'
};

// 测试题目
const testQuestions = [
    {
        q: '当你遇到困难时，你的第一反应是？',
        options: [
            { text: '冷静分析，寻找解决方案', score: 3 },
            { text: '寻求朋友或家人的帮助', score: 1 },
            { text: '凭直觉行动，相信自己', score: 2 },
            { text: '暂时回避，等待时机', score: 0 }
        ]
    },
    {
        q: '以下哪种场景最让你向往？',
        options: [
            { text: '在山顶看日出，感受大自然的壮阔', score: 2 },
            { text: '在图书馆安静地读一本书', score: 3 },
            { text: '在派对中成为人群的焦点', score: 1 },
            { text: '在海边漫步，享受独处时光', score: 0 }
        ]
    },
    {
        q: '你如何看待命运？',
        options: [
            { text: '命运掌握在自己手中', score: 3 },
            { text: '命运是注定的，顺其自然', score: 0 },
            { text: '命运和选择各占一半', score: 2 },
            { text: '我相信冥冥中的安排', score: 1 }
        ]
    },
    {
        q: '如果让你拥有一种超能力，你会选择？',
        options: [
            { text: '预知未来', score: 1 },
            { text: '读心术', score: 3 },
            { text: '瞬间移动', score: 2 },
            { text: '治愈一切', score: 0 }
        ]
    },
    {
        q: '你最喜欢的季节是？',
        options: [
            { text: '春天 - 万物复苏，充满希望', score: 0 },
            { text: '夏天 - 热情奔放，活力无限', score: 2 },
            { text: '秋天 - 成熟稳重，收获满满', score: 3 },
            { text: '冬天 - 宁静安详，沉淀内心', score: 1 }
        ]
    },
    {
        q: '在朋友眼中，你更像哪种人？',
        options: [
            { text: '可靠的领导者', score: 3 },
            { text: '温暖的倾听者', score: 0 },
            { text: '有趣的开心果', score: 2 },
            { text: '神秘的思想家', score: 1 }
        ]
    },
    {
        q: '面对未知的未来，你的态度是？',
        options: [
            { text: '充满期待，跃跃欲试', score: 2 },
            { text: '谨慎规划，步步为营', score: 3 },
            { text: '随波逐流，享受当下', score: 0 },
            { text: '既期待又忐忑', score: 1 }
        ]
    }
];

// 星座数据
const zodiacData = [
    { sign: 'aries', name: '白羊座', icon: '♈', date: '3.21-4.19' },
    { sign: 'taurus', name: '金牛座', icon: '♉', date: '4.20-5.20' },
    { sign: 'gemini', name: '双子座', icon: '♊', date: '5.21-6.21' },
    { sign: 'cancer', name: '巨蟹座', icon: '♋', date: '6.22-7.22' },
    { sign: 'leo', name: '狮子座', icon: '♌', date: '7.23-8.22' },
    { sign: 'virgo', name: '处女座', icon: '♍', date: '8.23-9.22' },
    { sign: 'libra', name: '天秤座', icon: '♎', date: '9.23-10.23' },
    { sign: 'scorpio', name: '天蝎座', icon: '♏', date: '10.24-11.22' },
    { sign: 'sagittarius', name: '射手座', icon: '♐', date: '11.23-12.21' },
    { sign: 'capricorn', name: '摩羯座', icon: '♑', date: '12.22-1.19' },
    { sign: 'aquarius', name: '水瓶座', icon: '♒', date: '1.20-2.18' },
    { sign: 'pisces', name: '双鱼座', icon: '♓', date: '2.19-3.20' }
];

// ========== 初始化 ==========
document.addEventListener('DOMContentLoaded', () => {
    initStarCanvas();
    initDateSelects();
    loadDailyAlmanac();
    initZodiacList();
    checkUserStatus();
});

// ========== 星空背景动画 ==========
function initStarCanvas() {
    const canvas = document.getElementById('star-canvas');
    const ctx = canvas.getContext('2d');
    let width, height;
    const stars = [];
    const STAR_COUNT = 150;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    function createStar() {
        return {
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 2 + 0.5,
            speed: Math.random() * 0.5 + 0.1,
            opacity: Math.random(),
            direction: Math.random() > 0.5 ? 1 : -1
        };
    }

    function initStars() {
        stars.length = 0;
        for (let i = 0; i < STAR_COUNT; i++) {
            stars.push(createStar());
        }
    }

    function drawStars() {
        ctx.clearRect(0, 0, width, height);
        stars.forEach(star => {
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 215, 0, ${star.opacity})`;
            ctx.fill();

            star.opacity += star.speed * 0.01 * star.direction;
            if (star.opacity > 1 || star.opacity < 0.2) {
                star.direction *= -1;
            }

            star.y -= star.speed * 0.3;
            if (star.y < 0) {
                star.y = height;
                star.x = Math.random() * width;
            }
        });

        // 绘制连接线
        for (let i = 0; i < stars.length; i++) {
            for (let j = i + 1; j < stars.length; j++) {
                const dx = stars[i].x - stars[j].x;
                const dy = stars[i].y - stars[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 100) {
                    ctx.beginPath();
                    ctx.moveTo(stars[i].x, stars[i].y);
                    ctx.lineTo(stars[j].x, stars[j].y);
                    ctx.strokeStyle = `rgba(124, 77, 255, ${0.1 * (1 - dist / 100)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(drawStars);
    }

    resize();
    initStars();
    drawStars();
    window.addEventListener('resize', () => { resize(); initStars(); });
}

// ========== 页面路由 ==========
function goPage(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    
    const target = document.getElementById(`page-${page}`);
    if (target) {
        target.classList.add('active');
        target.classList.add('fade-in');
        state.currentPage = page;
    }
    
    // 更新导航状态
    document.querySelectorAll('.nav-item').forEach(btn => {
        if (btn.textContent.includes(getPageName(page))) {
            btn.classList.add('active');
        }
    });

    window.scrollTo(0, 0);
}

function getPageName(page) {
    const names = {
        home: '首页', test: '命运测试', tarot: '塔罗',
        zodiac: '星座', ziwei: '紫微', yearly: '流年',
        profile: '我的', daily: '每日'
    };
    return names[page] || '';
}

// ========== 每日宜忌 ==========
async function loadDailyAlmanac() {
    try {
        const today = new Date().toISOString().slice(0, 10);
        const data = { code: 0, data: window.MYAPI.getDailyAlmanac(today) };
        renderDailyAlmanac(data.data);
    } catch (err) {
        console.error('加载每日宜忌失败:', err);
    }
}

function renderDailyAlmanac(data) {
    const dateStr = new Date().toLocaleDateString('zh-CN', {
        year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'
    });
    
    // 首页卡片
    const card = document.getElementById('daily-almanac');
    if (card) {
        card.querySelector('.daily-date').textContent = dateStr;
        card.querySelector('.daily-score').textContent = data.fortuneScore;
        card.querySelector('.yi-content').textContent = data.yi;
        card.querySelector('.ji-content').textContent = data.ji;
        document.getElementById('lucky-color-dot').style.backgroundColor = data.luckyColorValue;
        document.getElementById('lucky-color-text').textContent = `幸运色：${data.luckyColor}`;
        document.getElementById('daily-blessing').textContent = data.blessing;
    }

    // 每日宜忌页面
    const detail = document.getElementById('daily-detail');
    if (detail) {
        detail.innerHTML = `
            <div class="daily-date">${dateStr}</div>
            <div class="daily-score">${data.fortuneScore}</div>
            <div class="daily-score-label">今日运势指数</div>
            <div class="daily-yiji">
                <div class="yi-box">
                    <span class="yi-label">✅ 宜</span>
                    <span class="yi-content">${data.yi}</span>
                </div>
                <div class="ji-box">
                    <span class="ji-label">❌ 忌</span>
                    <span class="ji-content">${data.ji}</span>
                </div>
            </div>
            <div class="daily-lucky">
                <div class="lucky-item">
                    <span class="lucky-color-dot" style="background-color:${data.luckyColorValue}"></span>
                    <span>幸运色：${data.luckyColor}</span>
                </div>
            </div>
            <div class="daily-blessing">${data.blessing}</div>
        `;
    }
}

// ========== 命运测试 ==========
function startTest() {
    state.testAnswers = [];
    state.currentQuestion = 0;
    document.getElementById('test-start').style.display = 'none';
    document.getElementById('test-questions').style.display = 'block';
    document.getElementById('test-result').style.display = 'none';
    renderQuestion();
}

function renderQuestion() {
    const q = testQuestions[state.currentQuestion];
    const progress = document.getElementById('test-progress');
    progress.innerHTML = testQuestions.map((_, i) =>
        `<div class="progress-dot ${i <= state.currentQuestion ? 'active' : ''}"></div>`
    ).join('');

    const card = document.getElementById('question-card');
    card.innerHTML = `
        <div class="question-text">${state.currentQuestion + 1}. ${q.q}</div>
        <div class="answer-options">
            ${q.options.map((opt, i) => `
                <button class="answer-btn" onclick="answerQuestion(${opt.score})">${String.fromCharCode(65 + i)}. ${opt.text}</button>
            `).join('')}
        </div>
    `;
}

function answerQuestion(score) {
    state.testAnswers.push(score);
    state.currentQuestion++;
    if (state.currentQuestion < testQuestions.length) {
        renderQuestion();
    } else {
        showTestResult();
    }
}

async function showTestResult() {
    document.getElementById('test-questions').style.display = 'none';
    document.getElementById('test-result').style.display = 'block';

    try {
        const data = { code: 0, data: window.MYAPI.calculateFateResult(state.testAnswers) };
        renderTestResult(data.data);
    } catch (err) {
        console.error('获取测试结果失败:', err);
    }
}

function renderTestResult(result) {
    const card = document.getElementById('result-card');
    card.innerHTML = `
        <div class="result-type">${result.type}</div>
        <div class="result-score">${result.score}</div>
        <div style="color:var(--text-secondary);margin-bottom:16px">命运契合度</div>
        <div class="result-desc">${result.description}</div>
        <div class="result-lucky">
            <div class="lucky-tag">
                <span class="lucky-tag-label">今日运势</span>
                <span class="lucky-tag-value">${result.todayFortune}</span>
            </div>
            <div class="lucky-tag">
                <span class="lucky-tag-label">幸运数字</span>
                <span class="lucky-tag-value">${result.luckyNumber}</span>
            </div>
            <div class="lucky-tag">
                <span class="lucky-tag-label">幸运颜色</span>
                <span class="lucky-tag-value">${result.luckyColor}</span>
            </div>
        </div>
        <div class="result-advice">${result.advice}</div>
    `;
}

function restartTest() {
    startTest();
}

function shareResult() {
    alert('分享功能开发中，敬请期待！');
}

// ========== 塔罗占卜 ==========
function selectSpread(btn) {
    document.querySelectorAll('.spread-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.tarotSpread = btn.dataset.spread;
}

async function drawTarot() {
    const question = document.getElementById('tarot-question').value.trim() || '我的运势如何？';
    const container = document.getElementById('tarot-cards');
    const summary = document.getElementById('tarot-summary');

    container.innerHTML = '<div style="color:var(--text-secondary);padding:40px">正在洗牌中...</div>';
    summary.style.display = 'none';

    try {
        const data = { code: 0, data: window.MYAPI.drawTarot(state.tarotSpread, question) };
        renderTarotCards(data.data);
    } catch (err) {
        console.error('塔罗抽牌失败:', err);
        container.innerHTML = '<div style="color:#FFA07A">抽牌失败，请重试</div>';
    }
}

function renderTarotCards(data) {
    const container = document.getElementById('tarot-cards');
    const summary = document.getElementById('tarot-summary');

    const positions = ['过去', '现在', '未来', '建议', '结果', '环境', '希望', '恐惧', '外在', '结果'];

    container.innerHTML = data.cards.map((card, i) => `
        <div class="tarot-card" onclick="flipCard(this)" style="animation:fadeIn 0.5s ease ${i * 0.2}s both">
            <div class="tarot-card-inner">
                <div class="tarot-card-front">
                    <div class="card-back-pattern">🔮</div>
                    <div style="color:var(--gold);font-size:0.85rem;margin-top:8px">命运+</div>
                </div>
                <div class="tarot-card-back">
                    <div class="card-name">${card.name}${card.reversed ? ' ↓' : ''}</div>
                    <div class="card-name-en">${card.nameEn}</div>
                    <div class="card-keyword">${card.keywords}</div>
                    <div class="card-meaning ${card.reversed ? 'card-reversed' : ''}">${card.meaning}</div>
                    <div style="color:var(--text-secondary);font-size:0.75rem;margin-top:8px">${data.cards.length > 1 ? (positions[i] || `第${i+1}张`) : ''}</div>
                </div>
            </div>
        </div>
    `).join('');

    summary.innerHTML = `
        <div style="color:var(--gold);font-weight:bold;margin-bottom:12px">🔮 解读</div>
        <div>${data.summary}</div>
        <div style="margin-top:16px;color:var(--text-secondary);font-size:0.85rem">牌阵：${data.spread}</div>
    `;
    summary.style.display = 'block';
}

function flipCard(card) {
    card.classList.toggle('flipped');
}

// ========== 星座运势 ==========
function initZodiacList() {
    const list = document.getElementById('zodiac-list');
    if (!list) return;
    list.innerHTML = zodiacData.map(z => `
        <div class="zodiac-card glass-card" onclick="showZodiacDetail('${z.sign}')">
            <span class="zodiac-icon">${z.icon}</span>
            <div class="zodiac-name">${z.name}</div>
            <div class="zodiac-date">${z.date}</div>
        </div>
    `).join('');
}

function showZodiacDetail(sign) {
    document.getElementById('zodiac-list').style.display = 'none';
    document.getElementById('zodiac-detail').style.display = 'block';
    loadZodiacFortune(sign, 'daily');
}

function backToZodiacList() {
    document.getElementById('zodiac-list').style.display = 'grid';
    document.getElementById('zodiac-detail').style.display = 'none';
}

function selectPeriod(btn) {
    document.querySelectorAll('.period-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.zodiacPeriod = btn.dataset.period;
    // 重新加载当前星座的运势
    const currentSign = document.querySelector('.zodiac-detail-title')?.dataset?.sign || 'aries';
    loadZodiacFortune(currentSign, state.zodiacPeriod);
}

async function loadZodiacFortune(sign, period) {
    const content = document.getElementById('zodiac-fortune-content');
    content.innerHTML = '<div style="text-align:center;color:var(--text-secondary);padding:40px">加载中...</div>';

    try {
        const data = { code: 0, data: window.MYAPI.getZodiacFortune(sign, period) };
        renderZodiacFortune(data.data, sign);
    } catch (err) {
        console.error('加载星座运势失败:', err);
    }
}

function renderZodiacFortune(data, sign) {
    const content = document.getElementById('zodiac-fortune-content');
    const zodiacInfo = zodiacData.find(z => z.sign === sign);

    content.innerHTML = `
        <div class="fortune-overview glass-card">
            <div style="font-size:2rem">${zodiacInfo?.icon || '♈'}</div>
            <div style="font-size:1.5rem;color:var(--gold);margin:8px 0">${data.sign}</div>
            <div style="color:var(--text-secondary)">${data.period}运势</div>
            <div class="fortune-stars">${data.overall}</div>
            <div style="color:var(--gold-light);margin-top:16px">${data.advice}</div>
            <div class="daily-lucky" style="margin-top:16px">
                <div class="lucky-item">
                    <span>幸运数字：${data.luckyNumber}</span>
                </div>
                <div class="lucky-item">
                    <span>幸运色：${data.luckyColor}</span>
                </div>
            </div>
        </div>
        <div class="fortune-categories">
            ${Object.entries(data.details).map(([key, val]) => `
                <div class="fortune-category">
                    <div class="category-name">${key}</div>
                    <div class="category-stars">${val}</div>
                </div>
            `).join('')}
        </div>
    `;
}

// ========== 紫微星盘 ==========
function initDateSelects() {
    const monthSelect = document.getElementById('ziwei-month');
    const daySelect = document.getElementById('ziwei-day');
    const hourSelect = document.getElementById('ziwei-hour');

    if (monthSelect) {
        for (let i = 1; i <= 12; i++) {
            monthSelect.innerHTML += `<option value="${i}">${i}月</option>`;
        }
    }

    if (daySelect) {
        for (let i = 1; i <= 31; i++) {
            daySelect.innerHTML += `<option value="${i}">${i}日</option>`;
        }
    }

    if (hourSelect) {
        const hours = ['子时(23-1)', '丑时(1-3)', '寅时(3-5)', '卯时(5-7)', '辰时(7-9)', '巳时(9-11)',
            '午时(11-13)', '未时(13-15)', '申时(15-17)', '酉时(17-19)', '戌时(19-21)', '亥时(21-23)'];
        hours.forEach((h, i) => {
            hourSelect.innerHTML += `<option value="${i}">${h}</option>`;
        });
    }
}

async function submitZiwei() {
    if (!checkVip()) return;

    const year = document.getElementById('ziwei-year').value;
    const month = document.getElementById('ziwei-month').value;
    const day = document.getElementById('ziwei-day').value;
    const hour = document.getElementById('ziwei-hour').value;
    const gender = document.getElementById('ziwei-gender').value;

    document.getElementById('ziwei-form-container').style.display = 'none';
    const resultDiv = document.getElementById('ziwei-result');
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = '<div style="text-align:center;color:var(--text-secondary);padding:40px">正在排盘中...</div>';

    try {
        const data = { code: 0, data: window.MYAPI.calculateZiwei(year, month, day, hour, gender) };
        renderZiweiResult(data.data);
    } catch (err) {
        console.error('紫微排盘失败:', err);
        resultDiv.innerHTML = '<div style="text-align:center;color:#FFA07A">排盘失败，请重试</div>';
    }
}

function renderZiweiResult(data) {
    const resultDiv = document.getElementById('ziwei-result');
    const palaces = ['命宫', '兄弟宫', '夫妻宫', '子女宫', '财帛宫', '疾厄宫', '迁移宫', '仆役宫', '官禄宫', '田宅宫', '福德宫', '父母宫'];

    resultDiv.innerHTML = `
        <div class="fortune-overview glass-card">
            <div style="font-size:1.5rem;color:var(--gold);margin-bottom:8px">紫微斗数命盘</div>
            <div style="color:var(--text-secondary)">${data.birthInfo.year}年 ${data.birthInfo.month}月 ${data.birthInfo.day}日 ${data.birthInfo.gender === 'male' ? '男' : '女'}</div>
            <div class="yearly-fortune-tag" style="margin-top:16px">${data.ming}格局 · ${data.xing}</div>
            <div style="margin-top:16px;color:var(--gold-light)">命宫：${data.destinyPalace} | 身宫：${data.bodyPalace}</div>
        </div>
        <div class="ziwei-palace-grid">
            ${palaces.map(p => {
                const isDestiny = p === data.destinyPalace;
                const stars = data.palaceStars[p] || [];
                return `
                    <div class="palace-item ${isDestiny ? 'destiny' : ''}">
                        <div class="palace-name">${p}${isDestiny ? ' ★' : ''}</div>
                        <div class="palace-stars">${stars.join('、')}</div>
                    </div>
                `;
            }).join('')}
        </div>
        <div class="tarot-summary" style="margin-top:32px">
            <div style="color:var(--gold);font-weight:bold;margin-bottom:12px">命盘解读</div>
            <div>${data.summary}</div>
            <div style="margin-top:16px"><strong>建议：</strong>${data.advice}</div>
        </div>
        <div style="text-align:center;margin-top:24px">
            <button class="hero-cta" onclick="resetZiwei()">重新排盘</button>
        </div>
    `;
}

function resetZiwei() {
    document.getElementById('ziwei-form-container').style.display = 'block';
    document.getElementById('ziwei-result').style.display = 'none';
}

// ========== 流年运势 ==========
async function submitYearly() {
    if (!checkVip()) return;

    const birthYear = document.getElementById('yearly-birth-year').value;
    const zodiac = document.getElementById('yearly-zodiac').value;

    document.getElementById('yearly-form-container').style.display = 'none';
    const resultDiv = document.getElementById('yearly-result');
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = '<div style="text-align:center;color:var(--text-secondary);padding:40px">正在测算中...</div>';

    try {
        const data = { code: 0, data: window.MYAPI.calculateYearlyFortune(birthYear, zodiac) };
        renderYearlyResult(data.data);
    } catch (err) {
        console.error('流年测算失败:', err);
        resultDiv.innerHTML = '<div style="text-align:center;color:#FFA07A">测算失败，请重试</div>';
    }
}

function renderYearlyResult(data) {
    const resultDiv = document.getElementById('yearly-result');
    const aspects = Object.entries(data.aspectScores);

    resultDiv.innerHTML = `
        <div class="yearly-summary glass-card">
            <div style="font-size:1.5rem;color:var(--gold);margin-bottom:8px">${data.year}年运势</div>
            <div style="color:var(--text-secondary)">${data.zodiac}年 · ${data.age}岁</div>
            <div class="yearly-fortune-tag">${data.overallFortune}</div>
            <div class="daily-lucky" style="margin-top:16px">
                <div class="lucky-item">
                    <span>幸运色：${data.luckyColor}</span>
                </div>
                <div class="lucky-item">
                    <span>幸运方向：${data.luckyDirection}</span>
                </div>
                <div class="lucky-item">
                    <span>幸运数：${data.luckyNumber}</span>
                </div>
            </div>
        </div>
        <div class="aspect-bars">
            ${aspects.map(([name, score]) => `
                <div class="aspect-bar">
                    <span class="aspect-name">${name}</span>
                    <div class="aspect-progress">
                        <div class="aspect-fill" style="width:${score}%"></div>
                    </div>
                    <span class="aspect-score">${score}</span>
                </div>
            `).join('')}
        </div>
        <div class="tarot-summary">
            <div style="color:var(--gold);font-weight:bold;margin-bottom:12px">年度总结</div>
            <div>${data.summary}</div>
            <div style="margin-top:16px"><strong>建议：</strong>${data.advice}</div>
        </div>
        <div style="margin-top:32px">
            <div style="text-align:center;color:var(--gold);margin-bottom:16px;font-weight:bold">📅 月度走势</div>
            <div class="monthly-grid">
                ${data.monthlyFortunes.map(m => `
                    <div class="month-item">
                        <div class="month-num">${m.month}月</div>
                        <div class="month-score">${m.score}分</div>
                        <div class="month-highlight">${m.highlight}</div>
                    </div>
                `).join('')}
            </div>
        </div>
        <div style="text-align:center;margin-top:24px">
            <button class="hero-cta" onclick="resetYearly()">重新测算</button>
        </div>
    `;

    // 动画进度条
    setTimeout(() => {
        document.querySelectorAll('.aspect-fill').forEach(el => {
            el.style.width = el.style.width;
        });
    }, 100);
}

function resetYearly() {
    document.getElementById('yearly-form-container').style.display = 'block';
    document.getElementById('yearly-result').style.display = 'none';
}

// ========== 支付系统 ==========
function showPayModal(defaultOption) {
    state.selectedPayOption = defaultOption || 'lifetime';
    document.getElementById('pay-modal').style.display = 'flex';
    document.getElementById('pay-error').style.display = 'none';
    document.getElementById('pay-error').textContent = '';
    document.getElementById('pay-qrcode').style.display = 'none';
    document.getElementById('pay-actions').style.display = 'none';
    document.getElementById('pay-btn-start').style.display = 'block';
    document.getElementById('pay-btn-start').textContent = '立即支付';
    document.getElementById('pay-btn-start').disabled = true;
    document.getElementById('pay-btn-start').style.opacity = '0.5';
    document.getElementById('pay-btn-start').onclick = confirmPay;
    document.getElementById('pay-agree-check').checked = false;
    updatePaySelection();
}

function onAgreeChange() {
    const checked = document.getElementById('pay-agree-check').checked;
    const btn = document.getElementById('pay-btn-start');
    btn.disabled = !checked;
    btn.style.opacity = checked ? '1' : '0.5';
}

function closePayModal() {
    document.getElementById('pay-modal').style.display = 'none';
}

function selectPayOption(option) {
    state.selectedPayOption = option;
    updatePaySelection();
}

function updatePaySelection() {
    document.querySelectorAll('.pay-option').forEach(el => el.classList.remove('selected'));
    const selected = document.getElementById('pay-option-' + state.selectedPayOption);
    if (selected) selected.classList.add('selected');
}

function showPayError(msg) {
    const errEl = document.getElementById('pay-error');
    errEl.textContent = msg;
    errEl.style.display = 'block';
}

function hidePayError() {
    const errEl = document.getElementById('pay-error');
    errEl.style.display = 'none';
    errEl.textContent = '';
}

async function confirmPay() {
    if (!document.getElementById('pay-agree-check').checked) {
        showPayError('请先阅读并同意《免责声明》《退款规则》《用户服务协议》');
        return;
    }

    hidePayError();
    const btn = document.getElementById('pay-btn-start');
    btn.textContent = '正在生成订单...';
    btn.disabled = true;

    try {
        const orderData = window.MYAPI.createOrder(state.currentUser ? state.currentUser.id : 1, state.selectedPayOption);
        document.getElementById('pay-amount-display').textContent = '¥' + orderData.amount;
        
        if (orderData.demoMode) {
            document.getElementById('pay-demo-tip').style.display = 'block';
        } else {
            document.getElementById('pay-demo-tip').style.display = 'none';
        }

        document.getElementById('pay-qrcode').style.display = 'block';
        document.getElementById('pay-actions').style.display = 'block';
        btn.style.display = 'none';

        const confirmBtn = document.getElementById('pay-btn-confirm');
        confirmBtn.onclick = function() { confirmPaymentDone(orderData.orderNo); };

    } catch (err) {
        console.error('创建订单失败:', err);
        showPayError('网络异常，请检查网络后重试');
        btn.textContent = '立即支付';
        btn.disabled = false;
    }
}

async function confirmPaymentDone(orderNo) {
    const confirmBtn = document.getElementById('pay-btn-confirm');
    confirmBtn.textContent = '正在确认...';
    confirmBtn.disabled = true;

    try {
        const data = { code: 0, msg: '支付成功' };
        if (data.code === 0) {
            alert('支付成功！已解锁完整趣味解读功能');
            closePayModal();
            if (state.selectedPayOption === 'lifetime') {
                state.isVip = true;
                state.currentUser.isVip = true;
                localStorage.setItem('my_user', JSON.stringify(state.currentUser));
                updateVipStatus();
            }
        } else {
            showPayError(data.msg || '支付确认失败，请重试');
            confirmBtn.textContent = '✅ 确认支付';
            confirmBtn.disabled = false;
        }
    } catch (err) {
        console.error('支付确认失败:', err);
        showPayError('网络异常，请重试');
        confirmBtn.textContent = '✅ 确认支付';
        confirmBtn.disabled = false;
    }
}

async function mockPaySuccess(orderNo) {
    await confirmPaymentDone(orderNo);
}

// ========== 用户系统 ==========
function checkUserStatus() {
    if (state.currentUser) {
        state.isVip = state.currentUser.isVip;
        updateVipStatus();
    }
}

function updateVipStatus() {
    const vipEl = document.getElementById('profile-vip');
    if (vipEl) {
        if (state.isVip) {
            vipEl.textContent = '终身会员';
            vipEl.classList.remove('not');
        } else {
            vipEl.textContent = '普通用户';
            vipEl.classList.add('not');
        }
    }
}

function checkVip() {
    if (state.isVip) return true;
    showPayModal('single');
    return false;
}

// 模拟登录
function mockLogin() {
    const user = {
        id: 1,
        unionId: 'mock_user_001',
        nickname: '神秘用户',
        avatar: '',
        isVip: false
    };
    state.currentUser = user;
    localStorage.setItem('my_user', JSON.stringify(user));
    document.getElementById('profile-name').textContent = user.nickname;
}

// 页面加载时模拟登录
mockLogin();
