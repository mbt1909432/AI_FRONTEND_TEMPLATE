# AgentBuilder 系统设计总览

## 🎯 核心理念

**AgentBuilder** 是一个通过对话生成可执行 Agent 系统的零代码平台。

### 核心卖点
```
用户对话 
   ↓
自动生成 Agent 系统（零代码、零工作流编排）
   ↓
为 Agent 配置工具
   ↓
Agent 系统可以直接运行
   ↓
执行实际任务
```

---

## 🏗️ 系统架构

### 整体架构图
```
┌─────────────────────────────────────────────────────────────┐
│                    AgentBuilder 平台                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Landing Page│  │  Tools Page  │  │   Chat Page  │     │
│  │  首页/模板   │  │  工具库展示   │  │  对话+工作流  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│         │                 │                  │              │
│         └─────────────────┴──────────────────┘              │
│                           │                                 │
│         ┌─────────────────┴─────────────────┐              │
│         │                                   │              │
│    ┌────▼────┐                       ┌─────▼──────┐       │
│    │ Agent   │                       │ Workflow   │       │
│    │ System  │◄──────────────────────│ Editor     │       │
│    │ Runtime │  JSON 配置              │ (ComfyUI)  │       │
│    └─────────┘                       └────────────┘       │
│         │                                                  │
│         │                                                  │
│    ┌────▼────────────────────────────────┐               │
│    │         Tool Library                 │               │
│    │  (Read, Write, Grep, Bash...)       │               │
│    └─────────────────────────────────────┘               │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### 技术栈

| 层级 | 技术 | 用途 |
|------|------|------|
| **前端框架** | React 18.2.0 | UI 渲染 |
| **路由** | React Router 6.30.1 | 页面路由 |
| **工作流编辑器** | ReactFlow | 节点编辑器 |
| **国际化** | i18next 23.7.6 | 中英双语 |
| **状态管理** | React Hooks | useState, useCallback, useMemo |
| **样式** | CSS3 + CSS Modules | 样式隔离 |
| **构建工具** | Create React App | 开发/构建 |
| **部署** | Docker + GitHub Actions | CI/CD |

---

## 📱 页面结构

### 1. Landing Page（首页）
**路径**: `/`

**功能**:
- Hero 区域：主标题 + 对话输入框演示
- Templates 区域：12+ 预设 Agent 模板
- 模板分类：客户服务、数据分析、内容生成等

**组件树**:
```
LandingPage
├── Header (导航栏)
│   ├── Logo
│   ├── Nav Links
│   └── LanguageSwitcher
├── Hero (主区域)
│   ├── Title
│   ├── Chat Interface (演示)
│   └── Features
└── Templates (模板展示)
    ├── Category Tabs
    └── Template Cards (12个)
```

**响应式设计**:
- Desktop: 三列网格布局
- Tablet (≤768px): 单列布局
- Mobile (≤480px): 优化字体和间距

---

### 2. Tools Page（工具库）
**路径**: `/tools`

**功能**:
- 展示所有可用工具
- 工具分类：文件操作、搜索、系统命令、网络请求
- 工具详情：参数、示例、输出格式

**数据源**:
```javascript
// src/data/toolsData.js
export const toolsData = [
  {
    id: 'read',
    name: 'Read',
    category: 'file',
    icon: '📄',
    color: '#3b82f6',
    description: '读取文件内容',
    parameters: [...],
    example: {...}
  },
  // ... 8 个工具
];
```

**工具列表**:
1. 📄 **Read** - 读取文件
2. ✏️ **Write** - 写入文件
3. 🔧 **Edit** - 编辑文件
4. 🔍 **Glob** - 文件搜索
5. 🔎 **Grep** - 文本搜索
6. ⚡ **Bash** - 执行命令
7. 🌐 **WebFetch** - 获取网页
8. 🔍 **WebSearch** - 网络搜索

---

### 3. Chat Page（对话+工作流）
**路径**: `/chat`

**核心功能**:
- 左侧：对话侧边栏（历史记录）
- 中间：对话主区域
- 右侧：Agent 工作流编辑器

**布局结构**:
```
┌─────────────────────────────────────────────────────────┐
│                       Chat Page                          │
├──────────┬──────────────────────────┬───────────────────┤
│          │                          │                   │
│ Sidebar  │    Main Chat Area        │  Workflow Editor  │
│  (280px) │                          │      (50%)        │
│          │                          │                   │
│ ┌─────┐  │  ┌──────────────────┐   │  ┌─────────────┐ │
│ │Logo │  │  │ Messages         │   │  │ 🎨 工作流   │ │
│ │     │  │  │ ┌──────────────┐ │   │  │             │ │
│ │[New]│  │  │ │User: 你好    │ │   │  │  [上传][导出]│ │
│ └─────┘  │  │ │AI: 您好...   │ │   │  │  [Run]      │ │
│          │  │ └──────────────┘ │   │  │             │ │
│ History  │  │                  │   │  │  ┌────────┐  │ │
│ [💬对话1]│  │  ┌──────────────┐│   │  │  │Input   │  │ │
│ [💬对话2]│  │  │Input Box     ││   │  │  └────┬───┘  │ │
│          │  │  │[Send]        ││   │  │       │      │ │
│          │  │  └──────────────┘│   │  │  ┌────▼───┐  │ │
│ [语言🌐] │  └──────────────────┘   │  │  │Agent1  │  │ │
│ [用户👤] │                          │  │  │🔧Tools │  │ │
│          │                          │  │  └────┬───┘  │ │
│          │                          │  │       │      │ │
│          │                          │  │  ┌────▼───┐  │ │
│          │                          │  │  │Agent2  │  │ │
│          │                          │  │  └────────┘  │ │
└──────────┴──────────────────────────┴───────────────────┘
```

**移动端适配** (≤768px):
```
┌──────────────────────────────┐
│  [🍔]  Chat To Agent  [⚙️]  │  ← 移动端头部
├──────────────────────────────┤
│                              │
│  Main Chat Area (全屏)       │
│                              │
│  ┌────────────────────────┐ │
│  │ Messages              │ │
│  │                       │ │
│  └────────────────────────┘ │
│                              │
│  [Input Box]         [Send] │
│                              │
└──────────────────────────────┘

← 侧边栏和工作流编辑器改为抽屉式
  点击按钮滑入
```

---

## 🎨 Agent 工作流编辑器

### 核心组件

#### 1. AgentFlowEditor
**位置**: `src/components/workflow/AgentFlowEditor/`

**功能**:
- 基于 ReactFlow 的可视化编辑器
- JSON 导入/导出
- 拖拽上传
- 工作流运行

**状态管理**:
```javascript
const [nodes, setNodes] = useNodesState([]);           // 节点列表
const [edges, setEdges] = useEdgesState([]);           // 连线列表
const [agentInstructions, setAgentInstructions] = {}; // Agent 指令
const [agentHandoffDescs, setAgentHandoffDescs] = {}; // 交接描述
const [agentTools, setAgentTools] = {};                // 工具选择
const [isRunning, setIsRunning] = false;               // 运行状态
const [runResult, setRunResult] = null;                // 运行结果
```

#### 2. AgentNode
**位置**: `src/components/workflow/AgentNode/`

**节点结构**:
```
┌────────────────────────────┐
│  🚀 TriageAgent    [START] │  ← 头部
├────────────────────────────┤
│  💬 Instructions     [✏️]  │  ← 可编辑区域
│  你是智能分流助手...       │
│                            │
│  📋 Handoff Description[✏️]│
│  负责接收用户请求并分流... │
│                            │
│  🔧 Tools         [+ 添加] │  ← 工具选择
│  [📄 Read ✕] [🔍 Grep ✕]  │
│                            │
│  🔄 Handoffs               │  ← 自动生成
│  → DataExtractionAgent     │
│  → DataCalculationAgent     │
└────────────────────────────┘
```

**节点类型配色**:
| 类型 | 颜色 | 说明 |
|------|------|------|
| Starter | 🟢 绿色 | 起始 Agent |
| Extraction | 🔵 蓝色 | 数据提取 |
| Calculation | 🟣 紫色 | 数据计算 |
| Report | 🟠 橙色 | 报告生成 |
| Default | ⚪ 灰色 | 默认类型 |

#### 3. ToolSelector
**位置**: `src/components/workflow/ToolSelector/`

**功能**:
- 工具搜索和过滤
- 分类筛选
- 多选工具
- 批量操作

**界面布局**:
```
┌─────────────────────────────────────────┐
│  🔧 选择工具                        ✕   │
├─────────────────────────────────────────┤
│  🔍 [搜索框]                            │
│  [📦全部][📁文件][🔍搜索][⚡系统][🌐网络]│
│  已选择: 3 个工具  [全选当前] [清空]   │
├─────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐            │
│  │ 📄 Read  │  │ ✏️ Write │            │
│  │ file     │  │ file     │            │
│  │ ✓ 已选择  │  │          │            │
│  │ 读取文件  │  │ 创建文件  │            │
│  │ file_path*│  │ file_path*│           │
│  └──────────┘  └──────────┘            │
├─────────────────────────────────────────┤
│              [取消] [确认选择 (3)]      │
└─────────────────────────────────────────┘
```

---

## 📊 数据流设计

### 1. JSON 配置格式

```json
{
  "starter_agent": "TriageAgent",
  "agents": [
    {
      "name": "TriageAgent",
      "instructions": "你是智能分流助手...",
      "handoff_description": "处理所有用户初始请求...",
      "tools": ["read", "websearch"],
      "handoffs": ["DataExtractionAgent", "ReportAgent"],
      "output_parameters": null
    }
  ]
}
```

**字段说明**:
- `starter_agent`: 起始 Agent 名称
- `name`: Agent 唯一标识
- `instructions`: Agent 工作指令
- `handoff_description`: 交接场景描述
- `tools`: 工具 ID 数组（来自 toolsData.js）
- `handoffs`: 可以交接到的 Agent 列表
- `output_parameters`: 输出参数定义

### 2. 完整数据流

#### 流程1: 导入 JSON → 显示工作流
```
1. 用户上传 JSON / 拖拽文件
   ↓
2. generateFlowFromJSON(config)
   ↓
3. 解析 agents 数组
   ↓
4. 为每个 agent 创建节点
   - 过滤不存在的工具: validTools = tools.filter(id => getToolById(id))
   - 设置节点数据: { name, instructions, tools, handoffs, ... }
   ↓
5. 根据 handoffs 创建边（连线）
   ↓
6. 添加 Input 和 Output 节点
   ↓
7. 渲染到画布
```

#### 流程2: 编辑节点 → 更新状态
```
1. 用户编辑 Instructions
   ↓
2. handleInstructionsChange(agentName, newValue)
   ↓
3. 更新 agentInstructions 状态
   ↓
4. 节点自动重新渲染

---

1. 用户点击 [+ 添加] 工具
   ↓
2. 打开 ToolSelector 弹窗
   ↓
3. 用户选择工具
   ↓
4. handleToolsChange(agentName, newTools)
   ↓
5. 更新 agentTools 状态
   ↓
6. 更新节点 data.tools
   ↓
7. 工具标签重新渲染
```

#### 流程3: 导出 JSON → 下载配置
```
1. 用户点击 [导出] 按钮
   ↓
2. handleExportJSON()
   ↓
3. 从 nodes 和 edges 重建配置
   - 获取所有 Agent 节点
   - 根据 edges 重建 handoffs
   - 确定 starter_agent
   ↓
4. 构建 agents 数组
   - instructions: agentInstructions[name] || node.data.instructions
   - handoff_description: agentHandoffDescs[name] || node.data.handoff_description
   - tools: agentTools[name] || node.data.tools  ← 使用最新的工具选择
   ↓
5. 生成 JSON 字符串
   ↓
6. 创建 Blob 并下载
```

---

## 🎯 核心功能实现

### 1. 工具选择系统

**设计目标**:
- Agent 可以从工具库中选择需要的工具
- 支持搜索、分类、批量操作
- 不存在的工具自动过滤
- 工具选择正确导出到 JSON

**关键实现**:

```javascript
// 1. 工具验证（导入时）
const validTools = (agent.tools || [])
  .filter(toolId => getToolById(toolId) !== undefined);

// 2. 工具渲染（显示时）
const validTools = selectedTools
  .map((toolId) => ({ toolId, tool: getToolById(toolId) }))
  .filter(({ tool }) => tool !== undefined);

// 3. 工具导出（保存时）
tools: agentTools[name] || node.data.tools || []
```

### 2. 节点编辑系统

**可编辑内容**:
1. **Instructions** - Agent 工作指令
2. **Handoff Description** - 交接场景描述
3. **Tools** - 工具选择

**实现方式**:
```javascript
// 使用状态管理 + 回调
const [isEditingInstructions, setIsEditingInstructions] = useState(false);
const [instructionsValue, setInstructionsValue] = useState(instructions);

// 编辑时
<textarea value={instructionsValue} onChange={handleChange} />

// 保存时
data.onInstructionsChange(name, newValue)
```

### 3. 工作流连线系统

**连线规则**:
1. Input 节点只能连接一个 Agent（起始 Agent）
2. Agent 之间可以多向连接
3. 最后的 Agent 连接到 Output 节点
4. 连线关系自动生成 handoffs

**实现**:
```javascript
// 监听 edges 变化
useEffect(() => {
  setNodes((nds) =>
    nds.map((node) => {
      if (node.type === 'agentNode') {
        // 从 edges 找出 handoffs
        const handoffs = edges
          .filter((edge) => edge.source === node.id)
          .map((edge) => edge.target)
          .filter(target => target !== 'output-node');
        
        return {
          ...node,
          data: { ...node.data, handoffs }
        };
      }
      return node;
    })
  );
}, [edges]);
```

---

## 🌍 国际化设计

### 语言支持
- 🇨🇳 简体中文（默认）
- 🇺🇸 English

### 实现方式
```javascript
// src/i18n/config.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(LanguageDetectorPlugin)
  .use(initReactI18next)
  .init({
    resources: {
      zh: { translation: require('./locales/zh.json') },
      en: { translation: require('./locales/en.json') }
    },
    lng: localStorage.getItem('language') || 'zh',
    fallbackLng: 'zh'
  });
```

### 使用方式
```javascript
const { t } = useTranslation();
<h1>{t('hero.title')}</h1>
```

---

## 📱 响应式设计

### 断点系统
```css
/* 主要断点 */
@media (max-width: 1400px) { /* 小屏桌面 */ }
@media (max-width: 1200px) { /* 平板横屏 */ }
@media (max-width: 768px)  { /* 平板竖屏 */ }
@media (max-width: 480px)  { /* 手机 */ }

/* 触摸设备 */
@media (hover: none) and (pointer: coarse) {
  button, a {
    min-height: 44px;  /* iOS 最小触摸区域 */
    min-width: 44px;
  }
}
```

### 适配策略

#### Desktop (>768px)
- 三栏布局（侧边栏 + 主区域 + 工作流）
- 完整导航栏
- 网格布局

#### Mobile (≤768px)
- 单栏布局
- 抽屉式侧边栏
- 移动端头部（汉堡菜单 + 标题 + 工作流按钮）
- 触摸优化

**Chat Page 移动端**:
```javascript
// 移动端头部
<div className="mobile-header">
  <button onClick={() => setIsSidebarOpen(true)}>🍔</button>
  <span>Chat To Agent</span>
  <button onClick={() => setIsWorkflowOpen(true)}>⚙️</button>
</div>

// 遮罩层
{(isSidebarOpen || isWorkflowOpen) && (
  <div className="mobile-overlay" onClick={closeAll} />
)}

// 抽屉式侧边栏
<aside className={`chat-sidebar ${isSidebarOpen ? 'open' : ''}`}>
  ...
</aside>
```

---

## 🎨 设计系统

### 色彩方案

**主题色**:
- Primary: `#667eea` (紫色)
- Secondary: `#764ba2` (深紫色)
- Success: `#22c55e` (绿色)
- Warning: `#f59e0b` (橙色)
- Error: `#ef4444` (红色)

**背景**:
- 主背景: `linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)`
- 卡片: `rgba(255, 255, 255, 0.95)` + `backdrop-filter: blur(20px)`
- 深色模式: `#1a1d2e` (工作流编辑器)

**工具颜色映射**:
```javascript
const toolColors = {
  read: '#3b82f6',    // 蓝色
  write: '#10b981',   // 绿色
  edit: '#f59e0b',    // 橙色
  grep: '#6366f1',    // 靛蓝
  glob: '#8b5cf6',    // 紫色
  bash: '#14b8a6',    // 青色
  webfetch: '#ec4899', // 粉色
  websearch: '#f43f5e' // 玫红
};
```

### 组件风格

**按钮**:
- 主按钮: 渐变背景 + 阴影 + hover 动画
- 次按钮: 边框 + 透明背景
- 图标按钮: 圆形 + 半透明背景

**卡片**:
- 圆角: `border-radius: 16-20px`
- 阴影: `box-shadow: 0 8px 32px rgba(...)`
- 毛玻璃: `backdrop-filter: blur(20px)`

**动画**:
```css
/* 淡入上浮 */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 渐变文字 */
@keyframes gradientText {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

/* 脉冲 */
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}
```

---

## 🔧 开发规范

### 组件结构
```
ComponentName/
├── index.js          # 导出
├── ComponentName.js  # 组件逻辑
└── ComponentName.css # 样式
```

### 命名约定
- 组件: PascalCase (`AgentNode`)
- 文件: PascalCase (`AgentNode.js`)
- CSS类: kebab-case (`.agent-node`)
- 函数: camelCase (`handleClick`)
- 常量: UPPER_SNAKE_CASE (`MAX_AGENTS`)

### 状态管理原则
1. 使用 `useState` 管理本地状态
2. 使用 `useCallback` 避免重复渲染
3. 使用 `useMemo` 缓存计算结果
4. 使用 `useEffect` 处理副作用

### 性能优化
1. `React.memo` 包裹纯组件
2. 避免内联函数（使用 useCallback）
3. 列表渲染使用稳定的 key
4. 懒加载大型组件

---

## 📦 文件结构

```
my_blog/
├── public/
│   └── index.html                    # HTML 模板
├── src/
│   ├── components/                   # 组件库
│   │   ├── auth/                     # 认证组件
│   │   │   ├── LoginForm/
│   │   │   └── SignupForm/
│   │   ├── common/                   # 通用组件
│   │   │   ├── LanguageSwitcher/
│   │   │   └── Modal/
│   │   ├── home/                     # 首页组件
│   │   │   ├── Hero/
│   │   │   └── Templates/
│   │   ├── layout/                   # 布局组件
│   │   │   ├── Header/
│   │   │   └── Footer/
│   │   ├── tools/                    # 工具组件
│   │   │   └── ToolsLibrary/
│   │   └── workflow/                 # 工作流组件
│   │       ├── AgentFlowEditor/      # 工作流编辑器
│   │       ├── AgentNode/            # Agent 节点
│   │       ├── InputOutputNode/      # 输入输出节点
│   │       ├── ToolSelector/         # 工具选择器 ✅ 新增
│   │       └── WorkflowPanel/        # 工作流面板
│   ├── config/                       # 配置
│   │   └── constants.js
│   ├── data/                         # 数据
│   │   ├── templates.js              # 模板数据
│   │   └── toolsData.js              # 工具数据
│   ├── i18n/                         # 国际化
│   │   ├── config.js
│   │   └── locales/
│   │       ├── en.json
│   │       └── zh.json
│   ├── pages/                        # 页面
│   │   ├── ChatPage.js               # 对话页面
│   │   ├── LandingPage.js            # 首页
│   │   └── ToolsPage.js              # 工具页面
│   ├── App.js                        # 根组件
│   ├── App.css                       # 全局样式
│   └── index.js                      # 入口文件
├── example-workflow.json             # 示例配置
├── package.json                      # 依赖管理
├── Dockerfile                        # Docker 配置
├── docker-compose.yml                # Docker Compose
└── .github/workflows/
    └── action_for_deployment.yml     # GitHub Actions
```

---

## 🚀 部署架构

### CI/CD 流程
```
Developer Push
      ↓
GitHub Actions Triggered
      ↓
  1. Build React App
  2. Build Docker Image
  3. Push to GitHub Registry
  4. SSH to Server
  5. Pull Image
  6. Docker Compose Up
      ↓
  Production Running
```

### Docker 配置
```yaml
# docker-compose.yml
services:
  web:
    image: ghcr.io/username/my_blog:latest
    ports:
      - "1923:80"
    restart: unless-stopped
```

---

## 🎯 核心亮点

### 1. 零代码 Agent 构建
- 通过对话生成 Agent 系统
- 可视化工作流编辑
- 无需编程知识

### 2. ComfyUI 风格编辑器
- 可拖拽节点
- 自动连线
- 实时预览

### 3. 工具生态系统
- 8+ 内置工具
- 可扩展架构
- 工具选择器

### 4. 完整的移动端支持
- 响应式布局
- 触摸优化
- 抽屉式导航

### 5. 国际化支持
- 中英双语
- 自动检测
- 易于扩展

---

## 🔮 未来规划

### 短期 (1-3个月)
- [ ] 后端 API 集成
- [ ] Agent 实际运行功能
- [ ] 工具参数配置界面
- [ ] 用户认证系统

### 中期 (3-6个月)
- [ ] Agent 对话生成（AI 自动生成工作流）
- [ ] 工具市场（用户上传自定义工具）
- [ ] 工作流模板库
- [ ] 协作编辑功能

### 长期 (6-12个月)
- [ ] Agent 性能监控
- [ ] A/B 测试系统
- [ ] 工作流版本管理
- [ ] 企业级权限管理

---

## 📚 技术文档索引

| 文档 | 描述 |
|------|------|
| `README.md` | 项目介绍和快速开始 |
| `SETUP.md` | 详细设置指南 |
| `DEPLOYMENT_GUIDE.md` | 部署指南 |
| `MOBILE_CHAT_PAGE_FIX.md` | Chat 页面移动端修复 |
| `AGENT_TOOL_SELECTOR_FEATURE.md` | 工具选择功能文档 |
| `TOOL_VALIDATION_FIX.md` | 工具验证修复说明 |
| `SYSTEM_DESIGN_OVERVIEW.md` | 系统设计总览（本文档）|

---

## 💡 设计理念

### 用户体验优先
- 简单直观的界面
- 流畅的动画过渡
- 及时的视觉反馈
- 错误容忍设计

### 性能优化
- React 组件优化
- 懒加载策略
- 缓存机制
- 响应式图片

### 可维护性
- 模块化组件
- 清晰的文件结构
- 完善的注释
- 统一的代码风格

### 可扩展性
- 插件化工具系统
- 数据驱动设计
- API 友好架构
- 配置化优先

---

## 🎉 总结

**AgentBuilder** 是一个完整的零代码 Agent 构建平台，具备：

✅ **完善的前端架构** - React + ReactFlow + i18next  
✅ **优秀的用户体验** - 响应式 + 移动端优化  
✅ **强大的工具系统** - 8+ 工具 + 选择器  
✅ **灵活的工作流** - ComfyUI 风格编辑器  
✅ **完整的国际化** - 中英双语支持  
✅ **自动化部署** - Docker + GitHub Actions  

**核心价值**：通过对话生成可执行的 Agent 系统，让 Agent 构建变得简单！

---

*最后更新: 2025-10-25*  
*版本: 1.0.0*  
*作者: AgentBuilder Team*

