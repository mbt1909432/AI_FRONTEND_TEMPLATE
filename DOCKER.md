# Docker 部署指南 / Docker Deployment Guide

## 🐳 快速开始 / Quick Start

### 方式一：使用 Docker Compose（推荐）

```bash
# 构建并启动容器
docker-compose up -d

# 访问应用
# http://localhost:1923
```

### 方式二：使用 Docker 命令

```bash
# 构建镜像
docker build -t chat-to-agent .

# 运行容器
docker run -d -p 1923:80 --name chat-to-agent chat-to-agent

# 访问应用
# http://localhost:1923
```

---

## 📝 详细说明 / Detailed Instructions

### 构建镜像 / Build Image

```bash
# 构建生产镜像
docker build -t chat-to-agent:latest .

# 构建时指定版本
docker build -t chat-to-agent:v1.0.0 .
```

### 运行容器 / Run Container

```bash
# 基本运行
docker run -d \
  --name chat-to-agent \
  -p 1923:80 \
  chat-to-agent

# 带环境变量运行
docker run -d \
  --name chat-to-agent \
  -p 1923:80 \
  -e NODE_ENV=production \
  --restart unless-stopped \
  chat-to-agent
```

### 使用 Docker Compose

```bash
# 启动服务（后台）
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down

# 重新构建并启动
docker-compose up -d --build

# 停止并删除容器、网络、镜像
docker-compose down --rmi all
```

---

## 🔧 常用命令 / Common Commands

### 查看状态 / Check Status

```bash
# 查看运行中的容器
docker ps

# 查看所有容器
docker ps -a

# 查看容器日志
docker logs chat-to-agent

# 实时查看日志
docker logs -f chat-to-agent
```

### 容器管理 / Container Management

```bash
# 启动容器
docker start chat-to-agent

# 停止容器
docker stop chat-to-agent

# 重启容器
docker restart chat-to-agent

# 删除容器
docker rm chat-to-agent

# 强制删除运行中的容器
docker rm -f chat-to-agent
```

### 进入容器 / Enter Container

```bash
# 进入容器 shell
docker exec -it chat-to-agent sh

# 查看 Nginx 配置
docker exec chat-to-agent cat /etc/nginx/conf.d/default.conf

# 查看 Nginx 日志
docker exec chat-to-agent tail -f /var/log/nginx/access.log
```

---

## 🚀 生产环境部署 / Production Deployment

### 使用自定义端口

```bash
# 修改 docker-compose.yml 中的端口
ports:
  - "8080:80"  # 改为 8080 端口
```

### 使用环境变量文件

创建 `.env` 文件：

```env
PORT=1923
NODE_ENV=production
```

修改 `docker-compose.yml`：

```yaml
services:
  chat-to-agent:
    env_file:
      - .env
```

### 配置反向代理（Nginx/Caddy）

**Nginx 配置示例：**

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:1923;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 启用 HTTPS

```bash
# 使用 Let's Encrypt
docker run -d \
  --name chat-to-agent \
  -p 443:443 \
  -v /path/to/certs:/etc/nginx/certs \
  chat-to-agent
```

---

## 📊 性能优化 / Performance Optimization

### 多阶段构建（已实现）

Dockerfile 使用多阶段构建，最终镜像只包含必要文件：
- 第一阶段：构建 React 应用
- 第二阶段：使用 Nginx 提供静态文件

### 镜像大小优化

```bash
# 查看镜像大小
docker images chat-to-agent

# 清理无用镜像
docker image prune -a
```

### 启用 Gzip 压缩

已在 `nginx.conf` 中配置：
- 自动压缩 JS、CSS、HTML 等文件
- 减少传输大小 60-80%

---

## 🛠️ 故障排查 / Troubleshooting

### 容器无法启动

```bash
# 查看详细日志
docker logs chat-to-agent

# 检查容器状态
docker inspect chat-to-agent
```

### 端口被占用

```bash
# Windows 查看端口占用
netstat -ano | findstr :1923

# 更改端口（如果 1923 被占用）
docker run -d -p 8080:80 --name chat-to-agent chat-to-agent
```

### 更新代码后重新部署

```bash
# 停止并删除旧容器
docker-compose down

# 重新构建并启动
docker-compose up -d --build
```

### 清理 Docker 资源

```bash
# 清理未使用的容器
docker container prune

# 清理未使用的镜像
docker image prune

# 清理所有未使用资源
docker system prune -a
```

---

## 📈 监控和日志 / Monitoring & Logging

### 查看资源使用

```bash
# 查看容器资源使用情况
docker stats chat-to-agent

# 持续监控
docker stats
```

### 日志管理

```bash
# 查看最近 100 行日志
docker logs --tail 100 chat-to-agent

# 查看最近 10 分钟日志
docker logs --since 10m chat-to-agent

# 导出日志到文件
docker logs chat-to-agent > logs.txt
```

---

## 🔒 安全建议 / Security Best Practices

1. **不要以 root 用户运行**
2. **定期更新基础镜像**
3. **使用最小化镜像（alpine）**
4. **扫描镜像漏洞**

```bash
# 使用 Docker 安全扫描
docker scan chat-to-agent
```

---

## 📚 参考资料 / References

- [Docker 官方文档](https://docs.docker.com/)
- [Docker Compose 文档](https://docs.docker.com/compose/)
- [Nginx 官方文档](https://nginx.org/en/docs/)
- [React 部署文档](https://create-react-app.dev/docs/deployment/)

---

## 💡 提示 / Tips

- 使用 `docker-compose` 更方便管理多容器应用
- 定期备份重要数据和配置文件
- 在生产环境中使用特定版本标签而非 `latest`
- 配置自动重启策略 `--restart unless-stopped`

---

**祝部署顺利！Happy Deploying! 🚀**

