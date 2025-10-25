#!/bin/bash

###############################################################################
# Chat-to-Agent 本地测试脚本
# 用途: 在本地构建和测试 Docker 镜像
# 使用: chmod +x local-test.sh && ./local-test.sh
###############################################################################

set -e

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "=========================================="
echo "  Chat-to-Agent 本地测试"
echo "=========================================="
echo ""

# 检查 Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}错误: Docker 未安装${NC}"
    echo "请访问 https://docs.docker.com/get-docker/ 安装 Docker"
    exit 1
fi

# 清理旧容器和镜像
echo -e "${YELLOW}[1/4] 清理旧容器...${NC}"
docker stop chat-to-agent-test 2>/dev/null || true
docker rm chat-to-agent-test 2>/dev/null || true
echo -e "${GREEN}✓ 清理完成${NC}"
echo ""

# 构建镜像
echo -e "${YELLOW}[2/4] 构建 Docker 镜像...${NC}"
echo -e "${BLUE}这可能需要几分钟时间...${NC}"
docker build -t chat-to-agent:test .

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ 镜像构建成功${NC}"
else
    echo -e "${RED}✗ 镜像构建失败${NC}"
    exit 1
fi
echo ""

# 查看镜像信息
echo -e "${YELLOW}[3/4] 镜像信息:${NC}"
docker images chat-to-agent:test
echo ""

# 启动容器
echo -e "${YELLOW}[4/4] 启动测试容器...${NC}"
docker run -d \
    --name chat-to-agent-test \
    -p 1923:80 \
    --restart unless-stopped \
    chat-to-agent:test

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ 容器启动成功${NC}"
else
    echo -e "${RED}✗ 容器启动失败${NC}"
    exit 1
fi
echo ""

# 等待容器启动
echo -e "${BLUE}等待容器启动...${NC}"
sleep 3

# 检查容器状态
echo ""
echo "=========================================="
echo -e "${GREEN}  测试完成！${NC}"
echo "=========================================="
echo ""
echo "📦 容器状态:"
docker ps | grep chat-to-agent-test
echo ""
echo "📊 容器详情:"
docker inspect chat-to-agent-test --format='容器名称: {{.Name}}
状态: {{.State.Status}}
启动时间: {{.State.StartedAt}}
端口映射: {{range $p, $conf := .NetworkSettings.Ports}}{{$p}} -> {{(index $conf 0).HostPort}}{{end}}'
echo ""
echo "🌐 访问地址:"
echo "  http://localhost:1923"
echo ""
echo "🔍 测试命令:"
echo "  curl http://localhost:1923"
echo ""

# 测试连接
echo -e "${YELLOW}正在测试连接...${NC}"
sleep 2
if curl -f http://localhost:1923 >/dev/null 2>&1; then
    echo -e "${GREEN}✓ 服务响应正常${NC}"
else
    echo -e "${RED}✗ 服务无响应，请检查日志${NC}"
    echo "使用以下命令查看日志:"
    echo "  docker logs chat-to-agent-test"
fi
echo ""

echo "📝 常用命令:"
echo "  docker logs -f chat-to-agent-test     # 查看实时日志"
echo "  docker stop chat-to-agent-test        # 停止容器"
echo "  docker start chat-to-agent-test       # 启动容器"
echo "  docker restart chat-to-agent-test     # 重启容器"
echo "  docker rm -f chat-to-agent-test       # 删除容器"
echo ""
echo -e "${GREEN}测试成功！可以在浏览器中访问 http://localhost:1923${NC}"
echo ""
echo "💡 提示: 如果需要停止测试，运行:"
echo "  docker stop chat-to-agent-test && docker rm chat-to-agent-test"

