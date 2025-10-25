# Session 管理功能实现

## 🎯 功能概述

实现了完整的 Session（会话）管理系统，每个 Session 都有独立的聊天记录和工作流配置。

## ✨ 新增功能

### 1. Session 管理核心功能
- ✅ 创建新 Session
- ✅ 切换 Session
- ✅ 重命名 Session
- ✅ 删除 Session
- ✅ 自动保存到 localStorage
- ✅ Session 独立状态管理

### 2. 每个 Session 包含
```javascript
{
  id: "1698765432100",              // 唯一标识
  name: "新对话",                    // 可修改的名称
  createdAt: 1698765432100,         // 创建时间
  updatedAt: 1698765432100,         // 更新时间
  messages: [],                     // 聊天消息历史
  workflowConfig: null              // 工作流配置
}
```

### 3. 动态标题显示
工作流编辑器标题显示：**"[Session名称]的工作流编排"**
- 例如：`新对话的工作流编排`
- 例如：`客户反馈分析的工作流编排`

## 📦 新增文件

### 1. Session 管理 Hook
**文件**: `src/hooks/useSessionManager.js`

**功能**:
```javascript
const {
  sessions,              // 所有 sessions 列表
  currentSession,        // 当前 session 对象
  currentSessionId,      // 当前 session ID
  createSession,         // 创建新 session
  deleteSession,         // 删除 session
  renameSession,         // 重命名 session
  switchSession,         // 切换 session
  updateMessages,        // 更新消息列表
  addMessage,            // 添加单条消息
  updateWorkflowConfig   // 更新工作流配置
} = useSessionManager();
```

**持久化**:
- 自动保存到 `localStorage`
- 键名: `chat_sessions` 和 `current_session_id`
- 刷新页面后数据不丢失

### 2. Session 列表组件
**文件**: `src/components/chat/SessionList/`

**组件结构**:
```
SessionList
├── SessionList.js     # 组件逻辑
├── SessionList.css    # 样式
└── index.js           # 导出
```

**功能**:
- 显示所有 sessions
- 当前 session 高亮显示
- 悬停显示操作按钮
- 双击/点击编辑按钮重命名
- 点击删除按钮删除（需确认）
- 显示相对时间（刚刚、3分钟前、2小时前、3天前）

## 🎨 界面设计

### Session 列表项
```
┌─────────────────────────────────────┐
│ 💬  新对话                    ✏️ 🗑️│
│     刚刚                             │
├─────────────────────────────────────┤
│ 💬  客户反馈分析              ✏️ 🗑️│
│     5分钟前                          │
├─────────────────────────────────────┤
│ 💬  数据分析工作流 (当前)     ✏️ 🗑️│
│     1小时前                          │
└─────────────────────────────────────┘
```

**状态**:
- 普通: 透明背景
- Hover: 浅紫色背景
- Active: 紫色渐变背景 + 粗体

### 重命名交互
```
点击 ✏️ 按钮
   ↓
显示输入框
   ↓
用户输入新名称
   ↓
按 Enter 或失焦 → 保存
按 Esc → 取消
```

### 工作流标题
```
Before: 🎨 Agent 工作流编排
After:  🎨 新对话的工作流编排
        🎨 客户反馈分析的工作流编排
```

## 🔄 数据流

### 1. 创建 Session
```
用户点击 [+ 新对话] 按钮
   ↓
createSession('新对话')
   ↓
生成新 Session 对象
   ↓
添加到 sessions 数组开头
   ↓
设置为当前 Session
   ↓
保存到 localStorage
   ↓
界面自动切换到新 Session
```

### 2. 切换 Session
```
用户点击 Session 列表项
   ↓
switchSession(sessionId)
   ↓
更新 currentSessionId
   ↓
保存到 localStorage
   ↓
界面显示该 Session 的消息和工作流
```

### 3. 发送消息
```
用户输入消息并发送
   ↓
addMessage({ id, role, content })
   ↓
更新当前 Session 的 messages
   ↓
更新 updatedAt 时间戳
   ↓
保存到 localStorage
   ↓
界面实时更新
```

### 4. 导入工作流
```
用户上传 JSON 文件
   ↓
generateFlowFromJSON(config)
   ↓
创建节点和边
   ↓
onWorkflowConfigChange(config)
   ↓
更新当前 Session 的 workflowConfig
   ↓
保存到 localStorage
```

## 🔧 核心实现

### ChatPage 集成

**修改前**:
```javascript
const [messages, setMessages] = useState([...]);

const handleSubmit = () => {
  setMessages([...messages, newMessage]);
};
```

**修改后**:
```javascript
const {
  currentSession,
  addMessage,
  updateWorkflowConfig
} = useSessionManager();

const messages = currentSession?.messages || [];

const handleSubmit = () => {
  addMessage(newMessage);
};
```

### AgentFlowEditor 集成

**新增 Props**:
```javascript
<AgentFlowEditor 
  sessionName={currentSession?.name || '新对话'}
  workflowConfig={currentSession?.workflowConfig}
  onWorkflowConfigChange={updateWorkflowConfig}
/>
```

**标题显示**:
```javascript
<h3>{sessionName}的工作流编排</h3>
```

## 📱 移动端优化

### Session 切换
```javascript
const handleSessionSelect = (sessionId) => {
  switchSession(sessionId);
  setIsSidebarOpen(false);  // 移动端自动关闭侧边栏
};
```

### 操作按钮
- 移动端操作按钮始终可见（不需要 hover）
- 按钮大小适配触摸操作（28px × 28px）

## 🎯 使用场景

### 场景1: 创建新对话
```
1. 点击 [+ 新对话] 按钮
2. 自动创建新 Session，名称为"新对话"
3. 切换到新 Session，空白对话界面
4. 开始新的对话
```

### 场景2: 重命名 Session
```
1. 点击 Session 右侧的 ✏️ 按钮
2. 显示输入框，输入新名称
3. 按 Enter 或点击其他地方保存
4. 标题和列表同步更新
```

### 场景3: 多 Session 切换
```
Session A: 客户反馈分析
├── 消息: [用户消息1, AI回复1, ...]
└── 工作流: example-workflow.json

切换到 Session B: 数据处理
├── 消息: [用户消息2, AI回复2, ...]
└── 工作流: custom-workflow.json

再切回 Session A
├── 消息和工作流完全恢复
└── 状态独立，互不影响
```

### 场景4: 删除 Session
```
1. 点击 Session 右侧的 🗑️ 按钮
2. 弹出确认对话框
3. 确认后删除
4. 如果删除的是当前 Session，自动切换到第一个
5. 如果删除后没有 Session，自动创建新的
```

## 🔒 边界情况处理

### 1. 最后一个 Session
```javascript
if (sessions.length === 1) {
  // 不显示删除按钮
  // 确保始终有至少一个 Session
}
```

### 2. 删除当前 Session
```javascript
if (sessionId === currentSessionId) {
  // 切换到下一个 Session
  setCurrentSessionId(remainingSessions[0].id);
}
```

### 3. 空 Session 列表
```javascript
if (filtered.length === 0) {
  // 自动创建新 Session
  const newSession = { ...defaultSession };
  return [newSession];
}
```

### 4. localStorage 失败
```javascript
try {
  localStorage.setItem('chat_sessions', JSON.stringify(sessions));
} catch (error) {
  console.error('Failed to save sessions:', error);
  // 静默失败，不影响用户体验
}
```

## 📊 性能优化

### 1. useCallback 优化
```javascript
const createSession = useCallback((name) => {
  // 避免重复渲染
}, []);

const renameSession = useCallback((id, name) => {
  // 避免重复渲染
}, []);
```

### 2. 条件更新
```javascript
setSessions(prev => prev.map(s => 
  s.id === currentSessionId 
    ? { ...s, messages, updatedAt: Date.now() }
    : s  // 不变的 Session 不更新
));
```

### 3. 懒加载
```javascript
const loadSessions = () => {
  // 只在初始化时从 localStorage 加载
  // 后续通过状态管理
};
```

## 🧪 测试要点

### 功能测试
- [ ] 创建新 Session
- [ ] 切换 Session（消息和工作流正确恢复）
- [ ] 重命名 Session
- [ ] 删除 Session
- [ ] 刷新页面后数据保留
- [ ] 标题显示正确的 Session 名称

### 交互测试
- [ ] 重命名时按 Enter 保存
- [ ] 重命名时按 Esc 取消
- [ ] 重命名时失焦保存
- [ ] 删除时弹出确认
- [ ] 移动端切换后侧边栏关闭

### 边界测试
- [ ] 最后一个 Session 不能删除
- [ ] 删除当前 Session 自动切换
- [ ] localStorage 满了不崩溃
- [ ] 空名称自动设为"新对话"

## 📝 后续优化建议

### 1. Session 搜索
```javascript
const [searchQuery, setSearchQuery] = useState('');
const filteredSessions = sessions.filter(s => 
  s.name.includes(searchQuery)
);
```

### 2. Session 分组
```javascript
const groupedSessions = {
  today: [...],
  yesterday: [...],
  thisWeek: [...],
  older: [...]
};
```

### 3. Session 导出/导入
```javascript
// 导出
const exportSession = (sessionId) => {
  const session = sessions.find(s => s.id === sessionId);
  downloadJSON(session, `session-${session.name}.json`);
};

// 导入
const importSession = (file) => {
  const session = JSON.parse(file);
  setSessions([session, ...sessions]);
};
```

### 4. Session 云同步
```javascript
// 与后端 API 同步
const syncSessions = async () => {
  await api.post('/sessions/sync', { sessions });
};
```

### 5. Session 标签
```javascript
{
  id: "...",
  name: "客户反馈分析",
  tags: ["客服", "数据分析"],  // 添加标签
  ...
}
```

## ✅ 完成清单

- [x] 创建 useSessionManager Hook
- [x] 实现 Session CRUD 操作
- [x] 创建 SessionList 组件
- [x] 集成到 ChatPage
- [x] 修改 AgentFlowEditor 标题
- [x] 实现 localStorage 持久化
- [x] 移动端优化
- [x] 边界情况处理
- [x] 无 linter 错误

## 🎉 总结

现在 Chat 页面具备完整的 Session 管理功能：

1. ✅ **多 Session 支持** - 可以创建多个独立对话
2. ✅ **状态隔离** - 每个 Session 独立的消息和工作流
3. ✅ **命名管理** - 可以给 Session 起有意义的名字
4. ✅ **持久化** - 刷新页面数据不丢失
5. ✅ **动态标题** - 工作流标题显示当前 Session 名称
6. ✅ **用户体验** - 流畅的切换和编辑交互

**核心价值**：用户可以同时管理多个 Agent 工作流项目，每个项目独立保存，互不干扰！🚀

