# Chat-to-Agent 部署指南

## 📋 项目概述

这是一个基于 React 的前端应用，使用 Docker + Nginx 部署，通过 GitHub Actions 实现自动化 CI/CD。

## 🔧 部署架构

```
GitHub Push → GitHub Actions → 构建 Docker 镜像 → 推送到 GHCR → SSH 部署到服务器 → Docker Compose 启动
```

## 📝 配置步骤

### 1. 配置 GitHub Secrets

在你的 GitHub 仓库中配置以下 Secrets：

进入：`Settings` → `Secrets and variables` → `Actions` → `New repository secret`

| Secret 名称 | 说明 | 示例值 |
|------------|------|--------|
| `GIT_USER` | 你的 GitHub 用户名 | `your-username` |
| `GIT_TOKEN` | GitHub Personal Access Token | `ghp_xxxxxxxxxxxx` |
| `HOST_NAME` | 服务器 IP 地址或域名 | `123.456.789.0` |
| `DEPLOY_SSH_KEY` | SSH 私钥（用于连接服务器） | `-----BEGIN OPENSSH PRIVATE KEY-----...` |

#### 1.1 创建 GitHub Personal Access Token (GIT_TOKEN)

1. 访问：https://github.com/settings/tokens
2. 点击 `Generate new token` → `Generate new token (classic)`
3. 选择以下权限：
   - ✅ `write:packages` - 上传镜像到 GHCR
   - ✅ `read:packages` - 拉取镜像
   - ✅ `delete:packages` - 删除旧镜像（可选）
4. 生成后复制 Token（只显示一次）

#### 1.2 生成 SSH 密钥对 (DEPLOY_SSH_KEY)

在本地运行：

```bash
# 生成 SSH 密钥对
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/deploy_key

# 查看私钥（复制到 GitHub Secret）
cat ~/.ssh/deploy_key

# 查看公钥（添加到服务器）
cat ~/.ssh/deploy_key.pub
```

### 2. 配置服务器

#### 2.1 添加 SSH 公钥到服务器

```bash
# SSH 登录到服务器
ssh root@your-server-ip

# 添加公钥到 authorized_keys
echo "你的公钥内容" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

#### 2.2 安装 Docker 和 Docker Compose

```bash
# 安装 Docker（Ubuntu/Debian）
curl -fsSL https://get.docker.com | sh

# 启动 Docker 服务
systemctl start docker
systemctl enable docker

# 验证安装
docker --version
docker compose version
```

#### 2.3 在服务器上配置环境变量

```bash
# 在服务器上创建 .env 文件（如果需要）
mkdir -p ~/chat-to-agent
cd ~/chat-to-agent

# 创建 .env 文件
cat > .env << EOF
GIT_USER=你的GitHub用户名
EOF
```

### 3. 修改 docker-compose.yml

在服务器上部署前，确保 `docker-compose.yml` 中的镜像名称正确：

```yaml
image: ghcr.io/你的GitHub用户名/chat-to-agent:latest
```

或者使用环境变量（推荐）：

```yaml
image: ghcr.io/${GIT_USER}/chat-to-agent:latest
```

### 4. 触发部署

#### 方式一：自动部署（推荐）

推送代码到 `main` 分支：

```bash
git add .
git commit -m "feat: update deployment"
git push origin main
```

#### 方式二：手动触发

1. 进入 GitHub 仓库
2. 点击 `Actions` 标签
3. 选择 `action_for_deployment.yml` workflow
4. 点击 `Run workflow` 按钮

### 5. 查看部署状态

#### 5.1 在 GitHub 查看

- 进入 `Actions` 标签查看 workflow 运行状态
- 查看每个步骤的日志

#### 5.2 在服务器查看

```bash
# 查看容器状态
docker ps

# 查看日志
docker logs chat-to-agent

# 查看镜像
docker images | grep chat-to-agent
```

## 🌐 访问应用

部署成功后，通过以下地址访问：

```
http://your-server-ip:1923
```

## 🔍 常见问题

### Q1: GitHub Actions 构建失败

**检查项：**
- GitHub Secrets 是否配置正确
- Token 权限是否足够
- SSH 密钥是否正确

### Q2: SSH 连接失败

**解决方案：**
```bash
# 在本地测试 SSH 连接
ssh -i ~/.ssh/deploy_key root@your-server-ip

# 检查服务器防火墙
# 确保 22 端口（SSH）开放
```

### Q3: Docker 镜像拉取失败

**解决方案：**
```bash
# 在服务器上手动登录 GHCR
echo YOUR_TOKEN | docker login ghcr.io -u YOUR_USERNAME --password-stdin

# 手动拉取镜像测试
docker pull ghcr.io/YOUR_USERNAME/chat-to-agent:latest
```

### Q4: 容器启动失败

**检查项：**
```bash
# 查看容器日志
docker logs chat-to-agent

# 查看容器详细信息
docker inspect chat-to-agent

# 检查端口占用
netstat -tlnp | grep 1923
```

### Q5: 修改部署端口

编辑 `docker-compose.yml`：

```yaml
ports:
  - "你想要的端口:80"  # 例如 "8080:80"
```

## 🔄 更新部署

### 本地开发测试

```bash
# 本地构建测试
docker build -t chat-to-agent:test .

# 本地运行测试
docker run -p 1923:80 chat-to-agent:test
```

### 回滚到之前版本

```bash
# 在服务器上
cd ~/chat-to-agent

# 拉取特定版本（使用 commit SHA）
docker pull ghcr.io/YOUR_USERNAME/chat-to-agent:COMMIT_SHA

# 修改 docker-compose.yml 指定版本
# image: ghcr.io/YOUR_USERNAME/chat-to-agent:COMMIT_SHA

# 重启
docker compose up -d
```

## 📊 监控和维护

### 查看资源使用

```bash
# 查看容器资源使用
docker stats chat-to-agent
```

### 清理旧镜像

```bash
# 清理未使用的镜像
docker image prune -a

# 查看磁盘使用
docker system df
```

### 备份

```bash
# 备份 docker-compose 配置
cp docker-compose.yml docker-compose.yml.backup
```

## 🚀 优化建议

### 1. 使用域名（可选）

配置 Nginx 反向代理：

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:1923;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 2. 启用 HTTPS（可选）

使用 Let's Encrypt：

```bash
# 安装 certbot
apt install certbot python3-certbot-nginx

# 获取证书
certbot --nginx -d your-domain.com
```

### 3. 配置自动更新

可以使用 Watchtower 自动拉取最新镜像：

```yaml
# 在 docker-compose.yml 中添加
watchtower:
  image: containrrr/watchtower
  volumes:
    - /var/run/docker.sock:/var/run/docker.sock
  command: --interval 300 # 每5分钟检查一次
```

## 📞 技术支持

如有问题，请查看：
- GitHub Actions 日志
- Docker 容器日志
- 服务器系统日志：`/var/log/syslog`

---

**祝部署顺利！** 🎉

