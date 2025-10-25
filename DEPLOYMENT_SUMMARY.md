# 🎯 部署配置总结

## 📦 已完成的配置

### 1. GitHub Actions Workflow (`.github/workflows/action_for_deployment.yml`)

**主要改动：**
- ✅ 移除了不存在的 backend 构建步骤
- ✅ 移除了 deployment 文件夹依赖
- ✅ 简化为单一前端应用部署流程
- ✅ 使用 GitHub Container Registry (ghcr.io)
- ✅ 支持手动触发部署 (workflow_dispatch)
- ✅ 添加镜像版本标签（latest + commit SHA）
- ✅ 自动清理旧镜像

**触发条件：**
- 推送到 `main` 分支
- 手动触发（Actions 页面）

### 2. Docker Compose 配置

**docker-compose.yml** (开发环境)
- 注释了本地构建配置
- 配置使用 GHCR 镜像
- 端口: 1923:80
- 支持环境变量 `GIT_USER`

**docker-compose.prod.yml** (生产环境) - 新增
- 健康检查配置
- 日志轮转配置
- 自动重启策略
- 优化的生产环境设置

### 3. 文档

已创建以下文档：

| 文档 | 说明 |
|------|------|
| `DEPLOYMENT_GUIDE.md` | 完整的部署指南（含问题排查） |
| `DEPLOYMENT_CHECKLIST.md` | 快速配置清单 |
| `docker-compose.prod.yml` | 生产环境配置 |
| `DEPLOYMENT_SUMMARY.md` | 本文件 - 配置总结 |

**更新的文档：**
- `README.md` - 添加 CI/CD 部署说明

## 🔐 需要配置的 GitHub Secrets

在 GitHub 仓库中配置以下 Secrets：

| Secret | 说明 | 获取方式 |
|--------|------|----------|
| `GIT_USER` | GitHub 用户名 | 你的 GitHub 用户名 |
| `GIT_TOKEN` | GitHub Token | Settings → Developer settings → Personal access tokens |
| `HOST_NAME` | 服务器 IP | 你的服务器地址 |
| `DEPLOY_SSH_KEY` | SSH 私钥 | `ssh-keygen -t ed25519` 生成 |

## 🛠️ 配置步骤概览

### Step 1: 配置 GitHub Secrets
```
仓库 → Settings → Secrets and variables → Actions → New repository secret
```

### Step 2: 生成 GitHub Token
```
https://github.com/settings/tokens
权限: write:packages, read:packages
```

### Step 3: 配置 SSH 密钥
```bash
# 生成密钥
ssh-keygen -t ed25519 -C "deploy" -f ~/.ssh/deploy_key

# 私钥 → GitHub Secret (DEPLOY_SSH_KEY)
cat ~/.ssh/deploy_key

# 公钥 → 服务器
ssh-copy-id -i ~/.ssh/deploy_key.pub root@your-server-ip
```

### Step 4: 服务器准备
```bash
# 安装 Docker
curl -fsSL https://get.docker.com | sh

# 创建工作目录
mkdir -p ~/chat-to-agent

# 设置环境变量（重要！）
export GIT_USER=你的GitHub用户名
echo "export GIT_USER=你的GitHub用户名" >> ~/.bashrc
```

### Step 5: 推送代码触发部署
```bash
git add .
git commit -m "chore: setup CI/CD"
git push origin main
```

## 🔍 验证部署

### 查看 GitHub Actions
```
仓库 → Actions → 查看 workflow 运行状态
```

### 查看服务器
```bash
# SSH 登录服务器
ssh root@your-server-ip

# 查看容器
docker ps | grep chat-to-agent

# 查看日志
docker logs -f chat-to-agent

# 测试访问
curl http://localhost:1923
```

### 浏览器访问
```
http://your-server-ip:1923
```

## 📊 部署流程图

```
┌─────────────────┐
│  Git Push main  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ GitHub Actions  │
│   Triggered     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Build Docker   │
│     Image       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Push to GHCR  │
│ (ghcr.io/...)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   SSH Deploy    │
│   to Server     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Docker Compose  │
│    Pull & Up    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Service Live  │
│   on Port 1923  │
└─────────────────┘
```

## 🚨 重要提示

### 1. 修改 docker-compose.yml 中的用户名

在推送到仓库前，确保修改：

```yaml
image: ghcr.io/${GIT_USER:-your-github-username}/chat-to-agent:latest
```

将 `your-github-username` 替换为你的实际 GitHub 用户名。

或者在服务器上设置环境变量：

```bash
export GIT_USER=你的GitHub用户名
```

### 2. 首次部署可能需要手动登录

```bash
# 在服务器上
echo YOUR_TOKEN | docker login ghcr.io -u YOUR_USERNAME --password-stdin
```

### 3. 端口配置

默认端口: `1923`

如需修改，编辑 `docker-compose.yml`:
```yaml
ports:
  - "你的端口:80"
```

并确保服务器防火墙开放该端口。

### 4. 域名配置（可选）

如果使用域名，配置 Nginx 反向代理：

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

## 🔄 日常使用

### 更新应用
```bash
# 只需推送代码
git push origin main

# GitHub Actions 会自动：
# 1. 构建新镜像
# 2. 推送到 GHCR
# 3. 部署到服务器
```

### 手动触发部署
```
GitHub → Actions → action_for_deployment.yml → Run workflow
```

### 回滚版本
```bash
# 在服务器上
docker pull ghcr.io/YOUR_USERNAME/chat-to-agent:COMMIT_SHA
# 修改 docker-compose.yml 使用该 SHA
docker compose up -d
```

## 📝 下一步

1. ✅ 阅读 [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)
2. ✅ 配置 GitHub Secrets
3. ✅ 准备服务器环境
4. ✅ 推送代码触发首次部署
5. ✅ 验证部署成功

## 💡 提示

- 🔐 妥善保管 SSH 私钥和 GitHub Token
- 📊 定期查看 GitHub Actions 日志
- 🔍 使用 `docker logs` 排查问题
- 🚀 考虑配置域名和 HTTPS
- 💾 定期备份 docker-compose.yml

## 🆘 获取帮助

- 详细部署步骤: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- 快速配置: [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)
- 问题排查: [DEPLOYMENT_GUIDE.md#常见问题](DEPLOYMENT_GUIDE.md#常见问题)

---

**祝部署顺利！** 🎉

