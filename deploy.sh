#!/bin/bash
# 命运+ 一键部署脚本
# 在阿里云服务器上运行: sudo bash deploy.sh

set -e

APP_NAME="mingyunplus"
APP_DIR="/opt/mingyunplus"
NODE_VERSION="18"

echo "========================================"
echo "  命运+ (MingYunPlus) 一键部署脚本"
echo "========================================"
echo ""

# 检查是否 root
if [ "$EUID" -ne 0 ]; then
    echo "❌ 请使用 root 权限运行: sudo bash deploy.sh"
    exit 1
fi

# 检查项目目录
if [ ! -d "$APP_DIR" ]; then
    echo "❌ 未找到项目目录 $APP_DIR"
    echo "请先将项目上传到 $APP_DIR，然后运行此脚本"
    exit 1
fi

cd "$APP_DIR"

echo "📦 1. 安装系统依赖..."
apt-get update -y
apt-get install -y curl wget git build-essential nginx sqlite3

echo ""
echo "📦 2. 安装 Node.js..."
if ! command -v node &> /dev/null || [ "$(node -v | cut -d'v' -f2 | cut -d'.' -f1)" != "$NODE_VERSION" ]; then
    curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash -
    apt-get install -y nodejs
fi
node -v
npm -v

echo ""
echo "📦 3. 安装 PM2..."
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
fi
pm2 --version

echo ""
echo "📦 4. 安装项目依赖..."
cd "$APP_DIR"
npm install --production

echo ""
echo "📦 5. 初始化数据库..."
if [ ! -f "config/mingyunplus.db" ]; then
    npm run init-db
    echo "✅ 数据库初始化完成"
else
    echo "ℹ️ 数据库已存在，跳过初始化"
fi

echo ""
echo "📦 6. 配置环境变量..."
if [ ! -f "config/.env" ]; then
    if [ -f "config/.env.example" ]; then
        cp config/.env.example config/.env
        echo "⚠️ 请编辑 config/.env 文件，填入你的支付宝配置"
    fi
fi

echo ""
echo "📦 7. 配置 Nginx..."
if [ -f "nginx.conf" ]; then
    cp nginx.conf /etc/nginx/conf.d/mingyunplus.conf
    
    # 创建 SSL 目录
    mkdir -p /etc/nginx/ssl
    
    # 测试配置
    nginx -t
    
    # 重启 Nginx
    systemctl restart nginx
    systemctl enable nginx
    echo "✅ Nginx 配置完成"
else
    echo "⚠️ 未找到 nginx.conf，跳过 Nginx 配置"
fi

echo ""
echo "📦 8. 创建日志目录..."
mkdir -p "$APP_DIR/logs"
mkdir -p /var/log/nginx

echo ""
echo "📦 9. 启动应用..."
pm2 delete "$APP_NAME" 2>/dev/null || true
pm2 start ecosystem.config.json
pm2 save
pm2 startup systemd -u root --hp /root

echo ""
echo "📦 10. 设置防火墙..."
if command -v ufw &> /dev/null; then
    ufw allow 22/tcp
    ufw allow 80/tcp
    ufw allow 443/tcp
    ufw --force enable
fi

echo ""
echo "========================================"
echo "  ✅ 部署完成!"
echo "========================================"
echo ""
echo "🌐 网站访问: https://mingyunplus.com"
echo "📊 PM2 管理: pm2 status"
echo "📜 查看日志: pm2 logs mingyunplus"
echo "🔄 重启应用: pm2 restart mingyunplus"
echo ""
echo "⚠️ 重要提醒:"
echo "   1. 请将 SSL 证书上传到 /etc/nginx/ssl/"
echo "   2. 请编辑 config/.env 填入支付宝配置"
echo "   3. 请确保域名已解析到本服务器IP"
echo "   4. 请确保域名已完成ICP备案"
echo ""
echo "祝上线顺利！🎉"
