# 部署指南 - 命运+ (mingyunplus.com)

## 环境要求

- Node.js >= 16
- npm >= 8
- Nginx
- PM2 (推荐)
- 阿里云服务器 (CentOS 7+/Ubuntu 20.04+)

---

## 1. 服务器准备

### 安装 Node.js

```bash
# 使用 nvm 安装
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18

# 验证
node -v
npm -v
```

### 安装 PM2

```bash
npm install -g pm2
```

### 安装 Nginx

```bash
# CentOS
sudo yum install epel-release -y
sudo yum install nginx -y

# Ubuntu
sudo apt update
sudo apt install nginx -y
```

---

## 2. 项目部署

### 上传代码

```bash
# 在本地打包
cd mingyunplus
tar czvf mingyunplus.tar.gz .

# 上传到服务器 (使用 scp 或宝塔面板)
scp mingyunplus.tar.gz root@your-server-ip:/opt/
```

### 服务器上部署

```bash
# 解压
ssh root@your-server-ip
cd /opt
mkdir -p mingyunplus
tar xzvf mingyunplus.tar.gz -C mingyunplus/
cd mingyunplus

# 安装依赖
npm install --production

# 初始化数据库
npm run init-db

# 使用 PM2 启动
pm2 start server/app.js --name mingyunplus
pm2 save
pm2 startup
```

---

## 3. Nginx 配置

```nginx
server {
    listen 80;
    server_name mingyunplus.com www.mingyunplus.com;
    
    # 301 跳转到 HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name mingyunplus.com www.mingyunplus.com;
    
    # SSL 证书 (阿里云免费证书)
    ssl_certificate /etc/nginx/ssl/mingyunplus.crt;
    ssl_certificate_key /etc/nginx/ssl/mingyunplus.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;
    
    # 静态文件
    location /css/ {
        alias /opt/mingyunplus/public/css/;
        expires 30d;
    }
    
    location /js/ {
        alias /opt/mingyunplus/public/js/;
        expires 30d;
    }
    
    location /images/ {
        alias /opt/mingyunplus/public/images/;
        expires 30d;
    }
    
    # API 和页面路由代理到 Node.js
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # 支付宝回调 (确保外网可访问)
    location /api/pay/notify {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 应用 Nginx 配置

```bash
sudo nginx -t
sudo systemctl restart nginx
```

---

## 4. 域名与备案

- 确保域名已解析到服务器 IP
- 确保域名已完成 ICP 备案 (中国大陆要求)
- 在阿里云控制台配置域名解析 (A 记录指向服务器 IP)

---

## 5. 支付宝配置

### 5.1 申请企业支付宝

1. 登录 [支付宝商家中心](https://b.alipay.com/)
2. 完成企业认证
3. 创建应用 - 网页/移动应用
4. 开通"电脑网站支付"能力

### 5.2 配置密钥

1. 使用支付宝密钥工具生成 RSA2 密钥对
2. 上传应用公钥到支付宝
3. 记录支付宝公钥

### 5.3 配置环境变量

```bash
# 编辑服务器环境变量
sudo nano /etc/systemd/system/mingyunplus.service.env

# 添加以下内容
ALIPAY_APP_ID=你的应用ID
ALIPAY_PRIVATE_KEY=你的应用私钥
ALIPAY_PUBLIC_KEY=支付宝公钥
NODE_ENV=production
```

### 5.4 配置回调地址

在支付宝应用设置中配置：
- 授权回调地址: `https://mingyunplus.com/api/pay/notify`
- 应用网关: `https://mingyunplus.com`

---

## 6. 维护命令

```bash
# 查看应用状态
pm2 status

# 查看日志
pm2 logs mingyunplus

# 重启应用
pm2 restart mingyunplus

# 停止应用
pm2 stop mingyunplus

# 更新代码后重启
pm2 reload mingyunplus

# 查看 Nginx 日志
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

---

## 7. 安全建议

1. **防火墙**: 仅开放 80, 443, 22 端口
2. **定期备份**: 数据库和配置文件
3. **日志监控**: 配置异常访问告警
4. **HTTPS**: 强制使用 SSL
5. **Rate Limiting**: 已内置，可根据需要调整
6. **数据备份**: 定期备份 SQLite 数据库文件

```bash
# 备份数据库
cp /opt/mingyunplus/config/mingyunplus.db /opt/backup/mingyunplus-$(date +%Y%m%d).db
```

---

## 8. 常见问题

### Q: 支付宝支付失败？
A: 检查应用是否上线，密钥配置是否正确，回调地址是否外网可访问。

### Q: 数据库文件在哪？
A: `config/mingyunplus.db`，可以直接复制备份。

### Q: 如何修改端口？
A: 设置环境变量 `PORT=8080`，或修改 `server/app.js` 中的默认端口。

### Q: 如何更新代码？
A: 上传新代码后运行 `pm2 reload mingyunplus`。

---

## 9. 性能优化建议

- 使用 CDN 加速静态资源 (阿里云 CDN)
- 启用 Nginx gzip 压缩
- 配置浏览器缓存策略
- 考虑使用 Redis 缓存高频数据
- 监控服务器内存和 CPU 使用

---

## 10. 联系方式

如有问题，请查看日志或联系技术支持。

祝部署顺利！🎉
