# Vercel 部署指南 - 命运+

> 零成本、自动 HTTPS、全球 CDN —— Vercel 是部署命运+ 的最佳选择！

---

## 方案对比

| 方案 | 成本 | 复杂度 | 数据库 | 适合场景 |
|------|------|--------|--------|----------|
| Vercel (推荐) | 免费 | 简单 | 内存/SQLite (/tmp) | 快速上线、个人项目 |
| 阿里云 ECS | 付费 | 中等 | SQLite 持久化 | 生产级、大流量 |
| 其他云服务器 | 付费 | 中等 | 持久化 | 自定义需求 |

---

## Vercel 部署特点

### 优势
- ✅ **完全免费** —— 个人项目零成本
- ✅ **自动 HTTPS** —— 不需要手动配置 SSL 证书
- ✅ **全球 CDN** —— 静态资源自动加速
- ✅ **自动部署** —— GitHub 提交代码后自动重新部署
- ✅ **自定义域名** —— 可以绑定你的 mingyunplus.com

### 限制
- ⚠️ **数据库不持久化** —— Vercel 是 Serverless，每次冷启动数据库重置
- ⚠️ **单次请求 10 秒超时** —— 不适合长时间计算

> 💡 **对于命运+ 娱乐网站**：这些限制完全不影响使用！每日宜忌每次重新生成，用户数据不需要长期保存。

---

## 前置准备

1. **GitHub 账号** —— [github.com](https://github.com)
2. **Vercel 账号** —— [vercel.com](https://vercel.com)（用 GitHub 账号一键登录）
3. **你的域名**（可选） —— mingyunplus.com

---

## 部署步骤（Windows 版）

### 第一步：注册账号（5分钟）

1. 打开 [github.com](https://github.com)，用邮箱注册
2. 打开 [vercel.com](https://vercel.com)，点击 **Sign Up**，选择 **Continue with GitHub**
3. 授权 Vercel 访问你的 GitHub 仓库

---

### 第二步：创建 GitHub 仓库（5分钟）

#### 方法 A：用 GitHub 网页（最简单）

1. 登录 GitHub → 点击右上角 **+** → **New repository**
2. 填写信息：
   - Repository name: `mingyunplus`（或任意名称）
   - Description: `命运+ - 有趣好玩的命运娱乐测试网站`
   - 选择 **Public**（免费）或 **Private**
   - 勾选 **Add a README file**（可选）
3. 点击 **Create repository**

#### 方法 B：用 Git 命令行（推荐，会 Git 的同学用）

```bash
# 1. 确保你在项目目录
cd mingyunplus

# 2. 初始化 Git 仓库
git init

# 3. 添加所有文件
git add .

# 4. 提交
git commit -m "feat: 命运+ 网站初始化"

# 5. 在 GitHub 创建仓库（不要初始化 README）
# 然后关联并推送
git branch -M main
git remote add origin https://github.com/你的用户名/mingyunplus.git
git push -u origin main
```

---

### 第三步：上传代码到 GitHub（Windows 用户推荐）

如果你不会用 Git 命令，用 **GitHub Desktop** 最简单：

1. 下载 [GitHub Desktop](https://desktop.github.com/)
2. 安装并登录你的 GitHub 账号
3. 点击 **File → Add local repository**
4. 选择你的 `mingyunplus` 文件夹
5. 点击 **Publish repository** → 选择 **Public** → 点击 **Publish repository**

✅ 现在代码已经在 GitHub 上了！

---

### 第四步：连接 Vercel 部署（3分钟）

1. 打开 [vercel.com](https://vercel.com)，登录
2. 点击 **Add New Project**
3. 在 **Import Git Repository** 列表中找到 `mingyunplus`
4. 点击 **Import**
5. 配置选项：
   - **Framework Preset**: 选择 **Other**
   - **Root Directory**: 保持默认 `./`（项目根目录）
   - **Build Command**: 留空（Vercel 会自动识别 `vercel.json`）
   - **Output Directory**: 留空
6. 点击 **Deploy**

⏳ 等待 1-2 分钟，Vercel 会自动构建和部署！

---

### 第五步：查看部署结果

部署完成后，Vercel 会给你一个域名，类似：
```
https://mingyunplus-你的用户名.vercel.app
```

点击即可访问！🎉

---

### 第六步：绑定自定义域名（可选，5分钟）

把你的 **mingyunplus.com** 绑定到 Vercel：

1. 在 Vercel Dashboard → 选择你的项目 → 点击 **Settings**
2. 左侧选择 **Domains**
3. 输入你的域名：`mingyunplus.com`
4. 点击 **Add**
5. Vercel 会提示你需要配置的 DNS 记录，通常是：
   - 类型：**A 记录** → 指向 `76.76.21.21`
   - 或 **CNAME 记录** → 指向 `cname.vercel-dns.com`

6. 登录你的域名服务商（阿里云域名控制台），添加对应的 DNS 记录
7. 等待 DNS 生效（通常 5-30 分钟）

✅ 完成后，访问 `https://mingyunplus.com` 就能看到你的网站！

---

## 配置环境变量（重要！）

在 Vercel Dashboard → 你的项目 → **Settings → Environment Variables** 中添加：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `ALIPAY_APP_ID` | 你的支付宝应用ID | 支付功能必需 |
| `ALIPAY_PRIVATE_KEY` | 你的应用私钥 | 支付功能必需 |
| `ALIPAY_PUBLIC_KEY` | 支付宝公钥 | 支付功能必需 |
| `NODE_ENV` | `production` | 生产环境 |

> ⚠️ 如果不配置支付宝，支付功能会显示模拟二维码，其他功能完全正常。

---

## 支付宝回调配置（Vercel 版）

支付宝需要回调地址验证支付结果。Vercel 的回调地址是：

```
https://你的域名/api/pay/notify
# 例如：
https://mingyunplus.com/api/pay/notify
```

在 [支付宝开放平台](https://open.alipay.com/) → 你的应用 → 开发设置中：
1. 设置 **授权回调地址**: `https://mingyunplus.com/api/pay/notify`
2. 设置 **应用网关**: `https://mingyunplus.com`

---

## 更新网站（重新部署）

每次修改代码后，推送到 GitHub，Vercel 会自动重新部署！

### 用 GitHub Desktop（推荐）

1. 打开 GitHub Desktop
2. 选择 mingyunplus 仓库
3. 填写 Summary（如：`fix: 修复按钮样式`）
4. 点击 **Commit to main**
5. 点击 **Push origin**

⏳ Vercel 会自动检测 GitHub 的推送，1-2 分钟后自动重新部署！

### 用 Git 命令行

```bash
cd mingyunplus
git add .
git commit -m "你的修改说明"
git push
```

---

## 常见问题

### Q: 部署失败了怎么办？

**A:** 查看 Vercel Dashboard → 你的项目 → **Deployments** → 点击失败的部署 → 查看 **Build Logs** 错误信息。常见问题：
- `sqlite3` 编译失败 → 在 Vercel 项目设置里把 **Node.js Version** 设为 `18.x`
- 缺少依赖 → 检查 `package.json` 是否正确

### Q: 数据库数据丢了？

**A:** Vercel 的 Serverless 环境每次冷启动会重置 `/tmp` 目录。对于命运+：
- 每日宜忌每次重新生成 ✓
- 用户订单建议用支付宝的账单记录，不依赖本地数据库
- 如果需要持久化，可以考虑接入 **Vercel Postgres**（付费）或 **Neon**（免费额度）

### Q: 可以部署到国内吗？访问速度快吗？

**A:** Vercel 的 CDN 在全球都有节点，但中国大陆访问可能略慢。解决方案：
- 绑定自定义域名后，中国大陆用户访问速度会改善
- 或者后续迁移到阿里云（已有部署脚本 `deploy.sh`）

### Q: 支付功能在 Vercel 上能用吗？

**A:** 可以！支付宝回调会发送到 Vercel 的 Serverless Function，处理完成后返回 `success`。完全支持。

### Q: 我想换回阿里云部署怎么办？

**A:** 项目同时支持两种部署方式！阿里云部署请看 `docs/deploy.md`，使用 `deploy.sh` 一键脚本即可。

---

## 技术说明（给想了解原理的同学）

### Vercel 部署架构

```
用户访问
    ↓
Vercel CDN（全球加速）
    ↓
┌─────────────────────────────────────┐
│  Vercel Edge Network                │
│  ┌──────────┐    ┌──────────────┐   │
│  │ 静态文件 │    │ API 请求      │   │
│  │ public/  │    │ server/app.js │   │
│  │ CSS/JS   │    │ Express API   │   │
│  └──────────┘    └──────────────┘   │
│              ↑                        │
│    ┌─────────┐                        │
│    │ SQLite  │  (/tmp/mingyunplus.db) │
│    │ 内存库  │  每次冷启动重置        │
│    └─────────┘                        │
└─────────────────────────────────────┘
```

### 关键配置

- `vercel.json` —— 告诉 Vercel 如何构建和路由
- `server/app.js` —— 检测 `VERCEL` 环境变量，不在 Vercel 上启动本地服务器
- `server/utils/db.js` —— Vercel 环境下使用 `/tmp` 目录存放 SQLite

---

## 部署检查清单

- [ ] GitHub 仓库已创建且代码已上传
- [ ] Vercel 项目已导入 GitHub 仓库
- [ ] 部署成功，可以访问 Vercel 域名
- [ ] （可选）自定义域名已绑定
- [ ] （可选）支付宝环境变量已配置
- [ ] （可选）支付宝回调地址已设置

---

🎉 完成！你的命运+ 网站已经上线了！

有任何问题随时问我！
