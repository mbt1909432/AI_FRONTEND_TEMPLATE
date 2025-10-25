# 🚀 部署快速清单

## ✅ 配置前准备

### 1. GitHub Secrets 配置

- [ ] **GIT_USER**: 你的 GitHub 用户名
- [ ] **GIT_TOKEN**: GitHub Personal Access Token（需要 `write:packages` 权限）
- [ ] **HOST_NAME**: 服务器 IP 或域名
- [ ] **DEPLOY_SSH_KEY**: SSH 私钥

### 2. 服务器准备

- [ ] 安装 Docker
- [ ] 安装 Docker Compose
- [ ] 添加 SSH 公钥到服务器
- [ ] 开放端口 1923（或你自定义的端口）

### 3. 代码修改

- [ ] 修改 `docker-compose.yml` 中的 `GIT_USER` 变量为你的 GitHub 用户名

## 🔑 快速命令

### 创建 GitHub Token
```
访问: https://github.com/settings/tokens
权限: write:packages, read:packages
```

### 生成 SSH 密钥
```bash
ssh-keygen -t ed25519 -C "deploy" -f ~/.ssh/deploy_key
cat ~/.ssh/deploy_key      # 私钥 → GitHub Secret
cat ~/.ssh/deploy_key.pub  # 公钥 → 服务器
```

### 服务器安装 Docker
```bash
curl -fsSL https://get.docker.com | sh
systemctl start docker
```

### 添加公钥到服务器
```bash
ssh root@YOUR_SERVER_IP
echo "YOUR_PUBLIC_KEY" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

## 🎯 部署步骤

1. **配置 Secrets** → GitHub 仓库设置
2. **推送代码** → `git push origin main`
3. **等待构建** → 查看 Actions 标签
4. **访问应用** → `http://YOUR_SERVER_IP:1923`

## 📝 首次部署命令

在服务器上手动执行（仅首次）：

```bash
# 登录 GHCR
echo YOUR_TOKEN | docker login ghcr.io -u YOUR_USERNAME --password-stdin

# 创建工作目录
mkdir -p ~/chat-to-agent
cd ~/chat-to-agent

# 设置环境变量
export GIT_USER=YOUR_GITHUB_USERNAME

# 手动拉取并启动（第一次）
docker pull ghcr.io/$GIT_USER/chat-to-agent:latest
docker run -d -p 1923:80 --name chat-to-agent --restart unless-stopped ghcr.io/$GIT_USER/chat-to-agent:latest
```

之后所有更新都将自动部署！

## 🔍 验证命令

```bash
# 检查容器状态
docker ps | grep chat-to-agent

# 查看日志
docker logs -f chat-to-agent

# 测试访问
curl http://localhost:1923
```

---

更多详情请查看 [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

