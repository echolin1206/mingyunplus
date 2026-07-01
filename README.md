# 命运+ (MingYunPlus)

> 有趣好玩的命运娱乐测试网站，让人放松解压

## 项目简介

**命运+** (mingyunplus.com) 是一个专注于命运娱乐测试的趣味网站，集命运测试、塔罗占卜、紫微星盘、星座运势、流年运势、每日宜忌于一体，让用户在轻松有趣的氛围中探索命运的奥秘。

## 核心功能

| 功能 | 说明 | 付费模式 |
|------|------|----------|
| 🎯 命运测试 | 趣味性格/命运测试，多维度分析 | 免费体验 |
| 🔮 塔罗占卜 | 经典78张塔罗，支持多种牌阵 | 免费抽牌 |
| ♈ 星座运势 | 12星座日/周/月/年运势 | 日运免费 |
| ⭐ 紫微星盘 | 生辰八字排盘，详解命格 | VIP专享 |
| 🐉 流年运势 | 年度运势分析，月度走势 | VIP专享 |
| 📅 每日宜忌 | 今日宜忌、幸运色、祈运语 | 每日免费 |

## 商业模式

- **单次测算**: ¥9.9/次
- **终身会员**: ¥39/永久
- **支付方式**: 企业支付宝

## 技术架构

```
mingyunplus/
├── public/              # 前端静态资源
│   ├── index.html       # 主页面
│   ├── css/
│   │   └── style.css    # 全局样式
│   └── js/
│       └── app.js       # 前端逻辑
├── server/              # 后端服务
│   ├── app.js           # 主入口
│   ├── routes/
│   │   ├── divination.js # 测算API
│   │   ├── payment.js   # 支付API
│   │   └── user.js      # 用户API
│   └── utils/
│       ├── db.js        # 数据库连接
│       ├── init-db.js   # 数据库初始化
│       └── divination.js # 测算工具
├── config/
│   └── .env.example     # 环境变量模板
├── docs/
│   ├── plan.md          # 项目规划
│   └── deploy.md        # 部署指南
├── package.json         # 依赖管理
└── ecosystem.config.json # PM2配置
```

### 技术栈
- **后端**: Node.js + Express + SQLite
- **前端**: 原生 HTML5 + CSS3 + JavaScript
- **支付**: 支付宝企业版 SDK
- **部署**: PM2 + Nginx (阿里云)

## 快速开始

### 本地开发

```bash
# 1. 克隆项目
git clone <repo-url> mingyunplus
cd mingyunplus

# 2. 安装依赖
npm install

# 3. 初始化数据库
npm run init-db

# 4. 启动开发服务器
npm run dev
```

### 生产部署

详见 [docs/deploy.md](docs/deploy.md)

```bash
# 安装依赖
npm install --production

# 初始化数据库
npm run init-db

# PM2 启动
pm2 start ecosystem.config.json
pm2 save
pm2 startup
```

## 配置说明

复制 `config/.env.example` 为 `config/.env` 并填写真实配置：

```bash
ALIPAY_APP_ID=你的应用ID
ALIPAY_PRIVATE_KEY=你的应用私钥
ALIPAY_PUBLIC_KEY=支付宝公钥
NODE_ENV=production
PORT=3000
```

## 设计特色

- **视觉风格**: 深紫色 + 金色 + 星空黑，神秘梦幻
- **交互动效**: 星空粒子背景、塔罗牌翻转、渐显动画
- **用户体验**: 玻璃拟态卡片、响应式设计、流畅过渡
- **内容风格**: 有趣治愈，避免迷信色彩，强调娱乐性

## 安全说明

- 所有API接口验证签名
- 支付回调做IP白名单校验
- SQL注入防护（参数化查询）
- XSS防护（输出转义）
- 限流防刷（Rate Limiting）

## 免责声明

本网站所有内容仅供娱乐参考，不作为任何决策依据。命运掌握在自己手中，请理性看待测算结果。

## 许可证

MIT License

---

🌟 祝你好运，探索命运的趣味！
