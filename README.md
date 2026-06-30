# 命运+ (MingYunPlus)

> 有趣好玩的命运娱乐测试网站，让人放松解压 ✨
> 
> **在线演示**: [https://mingyunplus.com](https://mingyunplus.com) (即将上线)

## 项目简介

**命运+** 是一个专注于命运娱乐测试的趣味网站，集命运测试、塔罗占卜、紫微星盘、星座运势、流年运势、每日宜忌于一体，让用户在轻松有趣的氛围中探索命运的奥秘。

## 核心功能

| 功能 | 说明 | 付费模式 |
|------|------|----------|
| 🎯 命运测试 | 趣味性格/命运测试，多维度分析 | 免费体验 |
| 🔮 塔罗占卜 | 经典22张大阿尔卡纳，支持多种牌阵 | 免费抽牌 |
| ♈ 星座运势 | 12星座日/周/月/年运势 | 日运免费 |
| ⭐ 紫微星盘 | 生辰八字排盘，详解命格格局 | VIP专享 |
| 🐉 流年运势 | 年度运势分析，月度走势预测 | VIP专享 |
| 📅 每日宜忌 | 今日宜忌、幸运色、祈运语 | 每日免费 |

## 商业模式

- **单次测算**: ¥9.9/次
- **终身会员**: ¥39/永久
- **支付方式**: 企业支付宝

## 快速部署（二选一）

### 方案 A：Vercel 部署（推荐，免费，3分钟）

最适合个人项目，零成本，自动 HTTPS，自动部署。

```bash
# 1. 把代码上传到 GitHub
# 2. 在 Vercel 导入 GitHub 仓库
# 3. 点击 Deploy，搞定！
```

**详细步骤** → [docs/vercel-deploy.md](docs/vercel-deploy.md)

### 方案 B：阿里云服务器部署（适合生产环境）

适合大流量、需要数据持久化的场景。

```bash
# 一键部署脚本（Ubuntu）
sudo bash deploy.sh
```

**详细步骤** → [docs/deploy.md](docs/deploy.md)

## 技术架构

```
mingyunplus/
├── public/              # 前端静态资源（单页应用）
│   ├── index.html       # 主页面
│   ├── css/style.css    # 星空粒子 + 玻璃拟态样式
│   └── js/app.js        # 前端路由 + 交互逻辑
├── server/              # 后端服务（Express + SQLite）
│   ├── app.js           # Express 入口
│   ├── routes/          # API 路由
│   │   ├── divination.js # 测算 API（塔罗/紫微/星座/流年/测试）
│   │   ├── payment.js   # 支付 API（支付宝）
│   │   └── user.js      # 用户 API
│   └── utils/           # 工具函数
│       ├── db.js        # 数据库连接（支持 Vercel /tmp）
│       ├── divination.js # 测算算法 + 每日宜忌生成
│       └── init-db.js   # 数据库初始化脚本
├── vercel.json          # Vercel 部署配置
├── nginx.conf           # Nginx 反向代理配置
├── deploy.sh            # 阿里云一键部署脚本
├── ecosystem.config.json # PM2 进程配置
└── package.json         # 依赖管理
```

### 技术栈
- **后端**: Node.js + Express + SQLite
- **前端**: 原生 HTML5 + CSS3 + JavaScript（单页应用）
- **支付**: 支付宝企业版 SDK
- **部署**: Vercel（免费）或 阿里云 + PM2 + Nginx

## 本地开发

```bash
# 1. 安装依赖
npm install

# 2. 初始化数据库
npm run init-db

# 3. 启动开发服务器
npm run dev

# 4. 打开浏览器访问 http://localhost:3000
```

## 设计特色

- **视觉风格**: 深紫色 `#4A148C` + 金色 `#FFD700` + 星空黑 `#0D0221`
- **动态背景**: Canvas 星空粒子 + 连线动画
- **玻璃拟态**: 毛玻璃卡片 + 金色边框光晕
- **交互动效**: 塔罗牌 3D 翻转、渐显动画、浮动效果
- **响应式**: 完美适配手机端和桌面端

## 安全说明

- 所有 API 接口验证签名
- 支付回调做 IP 白名单校验
- SQL 注入防护（参数化查询）
- XSS 防护（输出转义）
- 限流防刷（Rate Limiting）

## 免责声明

本网站所有内容仅供娱乐参考，不作为任何决策依据。命运掌握在自己手中，请理性看待测算结果。

## 许可证

MIT License

---

🌟 祝你好运，探索命运的趣味！

如有问题，请查看 [docs/vercel-deploy.md](docs/vercel-deploy.md) 或 [docs/deploy.md](docs/deploy.md)。
