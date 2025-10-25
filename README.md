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
- 📊 **可视化编排** - ComfyUI 风格的可拖拽节点编辑器
- 🎨 **Agent 工作流** - 支持多 Agent 协作、任务交接（Handoff）
- 📥 **JSON 导入导出** - 拖拽上传 JSON 配置，一键导出工作流
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

### 方式三：CI/CD 自动部署（生产环境）

本项目支持通过 GitHub Actions 自动构建和部署：

```bash
# 推送到 main 分支触发自动部署
git push origin main
```

**部署流程：**
1. 🔨 自动构建 Docker 镜像
2. 📦 推送到 GitHub Container Registry
3. 🚀 SSH 连接服务器自动部署
4. ✅ 容器自动启动和健康检查

**配置指南：**
- 📋 [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - 完整部署指南
- ✅ [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) - 快速配置清单

部署后访问: `http://your-server-ip:1923`

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
| React Router | 6.30.1 | 路由管理 |
| ReactFlow | 最新 | 节点编辑器 |
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
- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - CI/CD 部署完整指南
- [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) - 部署快速配置清单
- [DOCKER.md](DOCKER.md) - Docker 部署说明

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

## 🎨 Agent 工作流编辑器

全新的 **ComfyUI 风格**可视化节点编辑器，支持：

### 功能特性

- ✅ **可拖拽节点** - 自由拖动和连接 Agent 节点
- ✅ **输入输出口** - 自动添加输入节点和输出节点
- ✅ **JSON 配置** - 支持导入导出 JSON 工作流配置
- ✅ **拖拽上传** - 直接拖拽 JSON 文件到编辑器
- ✅ **Run 按钮** - 一键运行工作流，实时查看执行结果
- ✅ **多 Agent 协作** - 支持 Agent 间任务交接（Handoff）
- ✅ **工具集成** - 为每个 Agent 配置专属工具
- ✅ **执行动画** - 工作流运行时高亮显示执行路径

### JSON 配置格式

```json
{
  "starter_agent": "TriageAgent",
  "agents": [
    {
      "name": "TriageAgent",
      "instructions": "你是智能分流助手，分析用户需求并转发给对应的专家。",
      "tools": [],
      "handoffs": ["DataExtractionAgent", "DataCalculationAgent"],
      "output_parameters": null
    }
  ]
}
```

### 节点类型配色

| 类型 | 颜色 | 说明 |
|------|------|------|
| 📥 Input | 蓝色 | 输入节点 |
| 🚀 Starter | 绿色 | 起始 Agent |
| 🔵 Extraction | 蓝色 | 数据提取 |
| 🟣 Calculation | 紫色 | 数据计算 |
| 🟠 Report | 橙色 | 报告生成 |
| 📤 Output | 翠绿色 | 输出节点 |

### 使用方法

1. **加载示例** - 点击"加载示例"按钮查看预设工作流
2. **上传 JSON** - 点击"上传"或直接拖拽 JSON 文件
3. **编辑节点** - 拖动节点位置，连接节点关系
4. **运行工作流** - 点击绿色"Run"按钮执行工作流
5. **查看结果** - 右下角弹出执行结果面板
6. **导出配置** - 点击"导出"下载工作流配置

📄 **示例配置**: 项目根目录的 `example-workflow.json`

### 工作流结构

```
📥 输入节点
    ↓
🚀 起始 Agent (Starter)
    ↓
🔵 数据提取 Agent → 🟣 计算 Agent → 🟠 报告 Agent
    ↓
📤 输出节点
```

每个工作流自动包含：
- **输入口** - 接收用户请求
- **Agent 节点链** - 按照 handoffs 连接
- **输出口** - 返回最终结果

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

