# AgentBuilder - Zero-Code Agentic System Platform

<div align="center">

**通过对话构建 Agentic System，像聊天一样简单轻松**

[English](#english) | [中文](#chinese)

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![i18next](https://img.shields.io/badge/i18next-23.7.6-green.svg)](https://www.i18next.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

</div>

---

## <a id="chinese"></a>🌟 项目简介

AgentBuilder 是一款旨在通过对话生成 Agentic System 的创新平台。我们通过**零代码**、**零工作流编排**的方式，将高可用度的 Agentic System 交付给客户，大幅降低 Agent 构建成本。

### ✨ 核心特性

- 🤖 **对话式构建** - 通过自然语言对话即可构建复杂的 Agent 系统
- 🚀 **零代码开发** - 无需编写任何代码，降低技术门槛
- 📊 **自动编排** - 智能工作流自动生成，无需手动配置
- ⚡ **高可用性** - 企业级系统架构，保证服务稳定性
- 💰 **成本优化** - 显著降低 Agent 构建和维护成本
- 🌍 **国际化支持** - 完整的中英双语界面

---

## 🎨 界面预览

灵感来自 [Sheet0.com](https://www.sheet0.com/)，采用现代化设计：

- **渐变背景** - 清新的青绿色系渐变
- **卡片式布局** - 12+ 预设 Agent 模板
- **交互动画** - 流畅的悬停和状态转换效果
- **响应式设计** - 完美适配移动端和桌面端

---

## 🚀 快速开始

### 环境要求

- Node.js >= 14.0.0
- npm >= 6.0.0
- Docker (可选，用于容器化部署)

### 方式一：本地开发

```bash
# 1. 克隆项目
git clone <repository-url>
cd chat-to-agent

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm start

# 4. 在浏览器中访问
# http://localhost:3000
```

### 方式二：Docker 部署（推荐）

```bash
# 使用 Docker Compose 一键部署
docker-compose up -d

# 访问 http://localhost:1923
```

详细的 Docker 部署指南请查看 [DOCKER.md](DOCKER.md)

### 生产构建

```bash
# 构建生产版本
npm run build

# 构建产物在 build/ 目录
```

---

## 📁 项目结构

```
agentic-system-builder/
├── public/                     # 静态资源
├── src/
│   ├── components/            # React 组件
│   │   ├── Header/            # 导航栏
│   │   ├── Hero/              # 主标题区
│   │   ├── Templates/         # 模板展示
│   │   ├── Footer/            # 页脚
│   │   └── LanguageSwitcher/  # 语言切换器
│   ├── data/                  # 数据层
│   ├── i18n/                  # 国际化配置
│   │   ├── config.js          # i18n 初始化
│   │   └── locales/           # 语言包 (zh/en)
│   ├── config/                # 全局配置
│   └── App.js                 # 主应用
├── PROJECT_MANAGEMENT.md      # 项目管理文档
├── CONTRIBUTING.md            # 贡献指南
├── SETUP.md                   # 详细设置指南
└── package.json
```

---

## 🛠️ 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| React | 18.2.0 | UI 框架 |
| i18next | 23.7.6 | 国际化 |
| react-i18next | 13.5.0 | React 国际化集成 |
| i18next-browser-languagedetector | 7.2.0 | 语言自动检测 |

---

## 🌍 国际化

本项目支持完整的中英双语切换：

- 🇨🇳 **简体中文** (默认)
- 🇺🇸 **English**

语言会自动保存在 localStorage，支持浏览器语言检测。

### 添加新语言

查看 [贡献指南](CONTRIBUTING.md#国际化贡献) 了解如何添加新语言。

---

## 📖 文档

- [SETUP.md](SETUP.md) - 详细的设置和配置指南
- [PROJECT_MANAGEMENT.md](PROJECT_MANAGEMENT.md) - 项目管理和开发规范
- [CONTRIBUTING.md](CONTRIBUTING.md) - 如何为项目做贡献

---

## 🎯 预设模板

项目包含 12 个预设 Agent 模板：

1. 📊 客户反馈分析 Agent
2. 🧹 数据清洗助手
3. ✍️ 内容生成引擎
4. 💬 智能客服系统
5. 🔍 竞品监控 Agent
6. 💻 代码审查助手
7. 📝 会议总结 Agent
8. 🎓 学术论文助手
9. 📈 SEO 优化 Agent
10. 📧 邮件自动分类
11. 💰 财务报表分析
12. 🔧 API 测试 Agent

---

## 🤝 贡献

我们欢迎所有形式的贡献！

1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的修改 (`git commit -m 'feat: Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

详细信息请参阅 [贡献指南](CONTRIBUTING.md)。

---

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

---

## 👥 作者

**AgentBuilder Team**

---

## 🙏 致谢

- 设计灵感: [Sheet0.com](https://www.sheet0.com/)
- UI 库: [React](https://react.dev/)
- 国际化: [i18next](https://www.i18next.com/)

---

## 📞 联系我们

如有问题或建议，欢迎提交 Issue 或 Pull Request！

---

<div align="center">

**让 Agent 构建变得简单 | Making Agent Building Simple**

⭐ 如果这个项目对您有帮助，请给我们一个 Star！

</div>

---

## <a id="english"></a>🌟 Project Overview

AgentBuilder is an innovative platform designed to generate Agentic Systems through conversation. We deliver high-availability Agentic Systems to customers through **zero-code** and **zero workflow orchestration** approaches, significantly reducing Agent construction costs.

### ✨ Key Features

- 🤖 **Conversational Building** - Build complex Agent systems through natural language dialogue
- 🚀 **Zero Code** - No coding required, lowering technical barriers
- 📊 **Auto Orchestration** - Intelligent workflow auto-generation, no manual configuration needed
- ⚡ **High Availability** - Enterprise-grade system architecture ensuring service stability
- 💰 **Cost Optimization** - Significantly reduce Agent construction and maintenance costs
- 🌍 **i18n Support** - Complete bilingual interface (Chinese/English)

### 🚀 Quick Start

```bash
npm install
npm start
```

Visit `http://localhost:3000`

For more details, see [SETUP.md](SETUP.md)

---

**Happy Building! 🎉**

