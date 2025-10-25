# Agent 节点工具选择功能

## 🎯 功能概述

为 Agent 节点添加了完整的工具选择功能，用户可以从 `/tool` 页面已有的工具库中为每个 Agent 选择需要的工具，并在导出 JSON 配置时正确保存工具选择。

## ✨ 新增功能

### 1. 工具选择器组件 (`ToolSelector`)

**位置**: `src/components/workflow/ToolSelector/`

#### 功能特性
- ✅ **搜索过滤** - 支持按工具名称或描述搜索
- ✅ **分类筛选** - 支持按分类查看工具（文件操作、搜索查找、系统命令、网络请求）
- ✅ **批量操作** - 支持"全选当前"和"清空"操作
- ✅ **视觉反馈** - 已选工具高亮显示，带勾选标记
- ✅ **工具信息** - 显示工具图标、名称、描述、参数等详细信息
- ✅ **响应式设计** - 支持移动端和桌面端

#### 界面布局
```
┌─────────────────────────────────────────┐
│  🔧 选择工具                        ✕   │
├─────────────────────────────────────────┤
│  🔍 搜索框                              │
│  [📦 全部] [📁 文件] [🔍 搜索] ...    │
│  已选择: 3 个工具  [全选] [清空]       │
├─────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐            │
│  │ 📄 Read  │  │ ✏️ Write │  ...       │
│  │ file ops │  │ file ops │            │
│  │ ✓ 已选择  │  │          │            │
│  └──────────┘  └──────────┘            │
├─────────────────────────────────────────┤
│              [取消] [确认选择 (3)]      │
└─────────────────────────────────────────┘
```

### 2. Agent 节点工具管理

**修改文件**: `src/components/workflow/AgentNode/AgentNode.js`

#### 新增功能
```javascript
// 工具选择状态
const [selectedTools, setSelectedTools] = useState(tools || []);
const [showToolSelector, setShowToolSelector] = useState(false);

// 工具变化回调
const handleToolsChange = useCallback((newTools) => {
  setSelectedTools(newTools);
  if (data.onToolsChange) {
    data.onToolsChange(name, newTools);
  }
}, [data, name]);

// 移除单个工具
const handleRemoveTool = useCallback((toolId, e) => {
  e.stopPropagation();
  const newTools = selectedTools.filter(id => id !== toolId);
  handleToolsChange(newTools);
}, [selectedTools, handleToolsChange]);
```

#### 界面更新
```
┌────────── AgentNode ──────────┐
│  🚀 TriageAgent               │
├───────────────────────────────┤
│  💬 Instructions      [✏️]    │
│  你是智能分流助手...          │
│                                │
│  📋 Handoff Description [✏️]  │
│  分析用户需求并转发...        │
│                                │
│  🔧 Tools            [+ 添加]  │
│  [📄 Read ✕] [✏️ Write ✕]     │
│  [🔍 Grep ✕]                   │
│                                │
│  🔄 Handoffs                   │
│  → DataExtractionAgent         │
└───────────────────────────────┘
```

**工具标签特性**:
- 显示工具图标 + 名称
- 继承工具的品牌颜色
- 悬停效果
- 删除按钮（✕）

### 3. 工作流编辑器集成

**修改文件**: `src/components/workflow/AgentFlowEditor/AgentFlowEditor.js`

#### 新增状态管理
```javascript
// 工具选择状态（每个 Agent 的工具选择）
const [agentTools, setAgentTools] = useState({});

// 示例数据结构:
// {
//   "TriageAgent": ["read", "write", "grep"],
//   "DataExtractionAgent": ["read", "glob"],
//   "ReportAgent": ["write", "bash"]
// }
```

#### 工具变化处理
```javascript
const handleToolsChange = useCallback((agentName, newTools) => {
  // 1. 更新状态
  setAgentTools(prev => ({
    ...prev,
    [agentName]: newTools
  }));
  
  // 2. 同步更新节点数据
  setNodes((nds) =>
    nds.map((node) => {
      if (node.data && node.data.name === agentName) {
        return {
          ...node,
          data: {
            ...node.data,
            tools: newTools
          }
        };
      }
      return node;
    })
  );
}, [setNodes]);
```

#### JSON 导出更新
```javascript
// 导出时使用最新的工具选择
const exportedAgents = agentNodes.map((node) => {
  const { name, type, output_parameters } = node.data;
  
  return {
    name: name,
    instructions: agentInstructions[name] || node.data.instructions || '',
    handoff_description: agentHandoffDescs[name] || node.data.handoff_description || '',
    tools: agentTools[name] || node.data.tools || [],  // ✅ 使用最新的工具选择
    handoffs: agentHandoffsMap[node.id] || [],
    output_parameters: output_parameters || null,
  };
});
```

## 📦 数据流

### 1. 加载工作流（JSON → 界面）
```
JSON 配置
  ↓
generateFlowFromJSON()
  ↓
创建 Agent 节点 (data.tools = agent.tools)
  ↓
AgentNode 显示工具标签
```

### 2. 用户选择工具（界面操作）
```
点击 [+ 添加] 按钮
  ↓
打开 ToolSelector 弹窗
  ↓
用户选择/取消工具
  ↓
handleToolsChange(agentName, newTools)
  ↓
更新 agentTools 状态 + 更新节点 data
  ↓
AgentNode 重新渲染，显示新工具
```

### 3. 导出配置（界面 → JSON）
```
点击 [导出] 按钮
  ↓
handleExportJSON()
  ↓
从 agentTools 状态读取最新工具
  ↓
构建 JSON 配置
  ↓
下载 .json 文件
```

## 🎨 样式特性

### ToolSelector 样式
- 深色模式设计（#1a1d2e 背景）
- 紫色主题色（#8b5cf6）
- 卡片式布局
- 平滑动画过渡
- 响应式网格布局

### AgentNode 工具标签样式
```css
.tool-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 6px;
  /* 动态背景色（继承工具颜色） */
  background: rgba(tool.color, 0.2);
  border: 1px solid rgba(tool.color, 0.4);
}

.remove-tool-btn {
  width: 16px;
  height: 16px;
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}
```

## 🔄 工具数据源

### 当前：静态数据
```javascript
// src/data/toolsData.js
export const toolsData = [
  {
    id: 'read',
    name: 'Read',
    category: 'file',
    description: '读取文件内容',
    icon: '📄',
    color: '#3b82f6',
    parameters: [...]
  },
  // ... 更多工具
];
```

### 未来：后端 API
```javascript
// 预留接口设计
useEffect(() => {
  // 从后端加载工具列表
  fetch('/api/tools')
    .then(res => res.json())
    .then(data => setToolsData(data));
}, []);
```

**迁移步骤**:
1. ✅ 当前使用 `src/data/toolsData.js` 静态数据
2. 🔄 后续添加 API 调用获取工具列表
3. 🔄 保持 `toolsData` 数据结构不变
4. 🔄 ToolSelector 组件无需修改

## 📝 JSON 配置格式

### 导出示例
```json
{
  "starter_agent": "TriageAgent",
  "agents": [
    {
      "name": "TriageAgent",
      "instructions": "你是智能分流助手，分析用户需求并转发给对应的专家。",
      "handoff_description": "负责接收用户请求并分流",
      "tools": ["read", "write", "grep"],
      "handoffs": ["DataExtractionAgent", "DataCalculationAgent"],
      "output_parameters": null
    },
    {
      "name": "DataExtractionAgent",
      "instructions": "你负责从数据中提取关键信息。",
      "handoff_description": "数据提取专家",
      "tools": ["read", "glob", "grep"],
      "handoffs": ["DataCalculationAgent"],
      "output_parameters": null
    }
  ]
}
```

### 工具字段说明
- `tools`: **字符串数组**，存储工具 ID
- 工具 ID 对应 `toolsData.js` 中的 `id` 字段
- 例如: `["read", "write", "grep"]`

## 🧪 测试场景

### 场景1: 从 JSON 加载并选择工具
1. 点击"加载示例"或"上传 JSON"
2. Agent 节点显示 JSON 中配置的工具
3. 点击 [+ 添加] 按钮
4. 在弹窗中选择/取消工具
5. 工具标签实时更新

### 场景2: 新建 Agent 并添加工具
1. 点击 [+ Add Agent] 按钮
2. 新 Agent 节点显示"未添加工具"
3. 点击 [+ 添加] 按钮
4. 选择工具后确认
5. 工具标签显示

### 场景3: 修改工具后导出
1. 修改多个 Agent 的工具选择
2. 点击 [导出] 按钮
3. 下载的 JSON 包含最新的工具配置
4. 重新导入 JSON，工具选择正确恢复

### 场景4: 移除工具
1. 点击工具标签上的 ✕ 按钮
2. 工具立即从列表中移除
3. 导出 JSON 时不包含该工具

## 🎯 用户体验优化

### 视觉反馈
- ✅ 工具标签使用工具的品牌颜色
- ✅ 悬停效果（transform + shadow）
- ✅ 已选工具高亮显示（紫色边框）
- ✅ 工具计数器（已选择: X 个工具）

### 交互优化
- ✅ 搜索框自动聚焦
- ✅ 点击工具卡片切换选择状态
- ✅ 点击遮罩层关闭弹窗
- ✅ ESC 键关闭弹窗（可扩展）

### 性能优化
- ✅ 使用 `useCallback` 避免重复渲染
- ✅ 使用 `useMemo` 缓存过滤结果
- ✅ 工具选择状态只在必要时更新节点

## 📂 文件结构

```
src/
├── components/
│   └── workflow/
│       ├── AgentNode/
│       │   ├── AgentNode.js        ✅ 已修改
│       │   ├── AgentNode.css       ✅ 已修改
│       │   └── index.js
│       ├── ToolSelector/           ✅ 新增
│       │   ├── ToolSelector.js
│       │   ├── ToolSelector.css
│       │   └── index.js
│       └── AgentFlowEditor/
│           ├── AgentFlowEditor.js  ✅ 已修改
│           └── AgentFlowEditor.css
├── data/
│   └── toolsData.js               ✅ 已存在（未修改）
└── pages/
    └── ToolsPage.js               ✅ 已存在（未修改）
```

## 🚀 使用方法

### 1. 打开工作流编辑器
```
访问 /chat 页面 → 右侧工作流面板
```

### 2. 为 Agent 添加工具
```
点击 Agent 节点的 [+ 添加] 按钮
→ 在弹窗中搜索/选择工具
→ 点击 [确认选择]
```

### 3. 管理已选工具
```
查看: 工具标签自动显示
移除: 点击工具标签上的 ✕ 按钮
```

### 4. 导出配置
```
点击工具栏的 [导出] 按钮
→ 下载 JSON 文件（包含工具配置）
```

### 5. 导入配置
```
点击 [上传] 按钮或拖拽 JSON 文件
→ 工具选择自动恢复
```

## 🔮 未来扩展

### 1. 后端集成
- [ ] 从后端 API 加载工具列表
- [ ] 支持自定义工具上传
- [ ] 工具版本管理

### 2. 高级功能
- [ ] 工具参数配置（在 Agent 节点内配置工具参数）
- [ ] 工具依赖检查（某些工具需要其他工具支持）
- [ ] 工具推荐（根据 Agent 指令推荐合适的工具）

### 3. 用户体验
- [ ] 工具使用统计
- [ ] 最近使用的工具
- [ ] 工具收藏功能
- [ ] 工具使用示例

## ✅ 完成清单

- [x] 创建 ToolSelector 组件
- [x] 添加工具搜索和过滤功能
- [x] 修改 AgentNode 支持工具选择
- [x] 更新 AgentFlowEditor 状态管理
- [x] 修改 JSON 导出逻辑包含工具
- [x] 添加工具标签样式
- [x] 支持移除单个工具
- [x] 测试所有功能流程
- [x] 创建功能文档

## 🎉 总结

现在 Agent 节点具备完整的工具选择和管理功能：

1. ✅ **可视化工具选择** - 从工具库中直观选择
2. ✅ **实时状态同步** - 选择后立即生效
3. ✅ **正确导出导入** - JSON 配置完整保存工具信息
4. ✅ **良好用户体验** - 搜索、过滤、批量操作
5. ✅ **易于扩展** - 支持后端 API 集成

**核心卖点**: 用户通过对话生成 Agent 系统 → 为 Agent 选择工具 → Agent 系统可运行并调用这些工具执行任务！🚀

