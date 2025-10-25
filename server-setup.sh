#!/bin/bash

###############################################################################
# Chat-to-Agent 服务器配置脚本
# 用途: 在服务器上快速配置 Docker 环境和必要的设置
# 使用: chmod +x server-setup.sh && ./server-setup.sh
###############################################################################

set -e  # 遇到错误立即退出

echo "=========================================="
echo "  Chat-to-Agent 服务器配置脚本"
echo "=========================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 检查是否为 root 用户
if [[ $EUID -ne 0 ]]; then
   echo -e "${RED}错误: 请使用 root 用户运行此脚本${NC}"
   echo "使用: sudo ./server-setup.sh"
   exit 1
fi

# 1. 更新系统
echo -e "${YELLOW}[1/6] 更新系统包...${NC}"
apt update && apt upgrade -y

# 2. 安装 Docker
echo -e "${YELLOW}[2/6] 安装 Docker...${NC}"
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com | sh
    systemctl start docker
    systemctl enable docker
    echo -e "${GREEN}✓ Docker 安装成功${NC}"
else
    echo -e "${GREEN}✓ Docker 已安装${NC}"
fi

# 验证 Docker 安装
docker --version
docker compose version

# 3. 配置防火墙
echo -e "${YELLOW}[3/6] 配置防火墙...${NC}"
if command -v ufw &> /dev/null; then
    ufw allow 1923/tcp
    ufw allow 22/tcp
    echo -e "${GREEN}✓ 防火墙规则已配置（端口 22, 1923）${NC}"
else
    echo -e "${YELLOW}⚠ UFW 未安装，请手动配置防火墙${NC}"
fi

# 4. 创建工作目录
echo -e "${YELLOW}[4/6] 创建工作目录...${NC}"
mkdir -p ~/chat-to-agent
cd ~/chat-to-agent
echo -e "${GREEN}✓ 工作目录: ~/chat-to-agent${NC}"

# 5. 配置环境变量
echo -e "${YELLOW}[5/6] 配置环境变量...${NC}"
read -p "请输入你的 GitHub 用户名: " GIT_USER

if [ -z "$GIT_USER" ]; then
    echo -e "${RED}错误: GitHub 用户名不能为空${NC}"
    exit 1
fi

# 写入环境变量
cat > .env << EOF
GIT_USER=${GIT_USER}
NODE_ENV=production
EOF

# 添加到 bashrc
if ! grep -q "export GIT_USER=" ~/.bashrc; then
    echo "export GIT_USER=${GIT_USER}" >> ~/.bashrc
fi

echo -e "${GREEN}✓ 环境变量已配置${NC}"
echo "  GIT_USER=${GIT_USER}"

# 6. 登录 GitHub Container Registry
echo -e "${YELLOW}[6/6] 登录 GitHub Container Registry...${NC}"
echo ""
echo -e "${YELLOW}请输入你的 GitHub Personal Access Token:${NC}"
echo "（Token 需要 write:packages 和 read:packages 权限）"
read -s GITHUB_TOKEN

if [ -z "$GITHUB_TOKEN" ]; then
    echo -e "${YELLOW}⚠ 跳过 GHCR 登录，稍后需手动登录${NC}"
else
    echo "$GITHUB_TOKEN" | docker login ghcr.io -u "$GIT_USER" --password-stdin
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ GHCR 登录成功${NC}"
    else
        echo -e "${RED}✗ GHCR 登录失败，请检查 Token${NC}"
    fi
fi

# 7. 总结
echo ""
echo "=========================================="
echo -e "${GREEN}  配置完成！${NC}"
echo "=========================================="
echo ""
echo "📁 工作目录: ~/chat-to-agent"
echo "🌍 环境变量: GIT_USER=${GIT_USER}"
echo "🐳 Docker: $(docker --version)"
echo "🔧 Docker Compose: $(docker compose version)"
echo ""
echo "📝 下一步:"
echo "  1. 等待 GitHub Actions 构建并推送镜像"
echo "  2. 确保 docker-compose.yml 已上传到服务器"
echo "  3. 运行: docker compose up -d"
echo "  4. 访问: http://$(hostname -I | awk '{print $1}'):1923"
echo ""
echo "🔍 常用命令:"
echo "  docker ps                          # 查看容器状态"
echo "  docker logs -f chat-to-agent      # 查看日志"
echo "  docker compose pull                # 拉取最新镜像"
echo "  docker compose up -d               # 启动服务"
echo "  docker compose down                # 停止服务"
echo ""
echo -e "${GREEN}祝部署顺利！🎉${NC}"

