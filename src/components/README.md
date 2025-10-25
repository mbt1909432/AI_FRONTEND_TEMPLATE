# Components 组件结构

本项目采用按功能分组的组件结构，便于维护和扩展。

## 📁 目录结构

```
components/
├── workflow/          # 🎨 工作流相关组件
│   ├── AgentFlowEditor/    # Agent 工作流编辑器
│   ├── AgentNode/          # Agent 节点组件
│   ├── InputOutputNode/    # 输入输出节点
│   └── WorkflowPanel/      # 工作流面板（旧版）
│
├── tools/             # 🛠️ 工具管理
│   └── ToolsLibrary/       # 工具库展示
│
├── layout/            # 📐 布局组件
│   ├── Header/             # 页面头部
│   └── Footer/             # 页面底部
│
├── home/              # 🏠 首页组件
│   ├── Hero/               # 首页横幅
│   └── Templates/          # 模板展示
│
├── auth/              # 🔐 认证相关
│   ├── LoginForm/          # 登录表单
│   ├── SignupForm/         # 注册表单
│   └── AuthForm.css        # 共享样式
│
└── common/            # 🔧 通用组件
    ├── Modal/              # 模态框
    └── LanguageSwitcher/   # 语言切换器
```

## 📦 组件结构

每个组件文件夹包含：
- `index.js` - 组件导出文件
- `ComponentName.js` - 组件逻辑
- `ComponentName.css` - 组件样式

## 🚀 使用方式

### 方式 1: 直接导入（推荐）

```javascript
// 从分类路径导入
import AgentFlowEditor from '../components/workflow/AgentFlowEditor';
import Header from '../components/layout/Header';
import Modal from '../components/common/Modal';
```

### 方式 2: 统一导入

```javascript
// 从统一入口导入
import { 
  AgentFlowEditor, 
  Header, 
  Footer,
  Modal 
} from '../components';
```

## 🎯 优势

1. **清晰的组织**
   - 按功能分组，一目了然
   - 每个组件自包含（JS + CSS）

2. **易于维护**
   - 相关文件聚在一起
   - 减少查找时间

3. **更好的扩展性**
   - 添加新组件时结构清晰
   - 便于团队协作

4. **独立性**
   - 每个组件可以独立迁移
   - 便于测试和复用

## 📝 添加新组件

1. 确定组件分类（workflow/layout/home/auth/common）
2. 创建组件文件夹
3. 添加三个文件：
   - `index.js`
   - `ComponentName.js`
   - `ComponentName.css`
4. 在 `components/index.js` 中添加导出

示例：
```bash
# 创建新组件
mkdir src/components/common/Button
cd src/components/common/Button

# 创建文件
touch index.js Button.js Button.css
```

## 🔄 迁移说明

已从扁平结构迁移到分组结构：

**旧结构**（23个文件混在一起）：
```
components/
├── AgentFlowEditor.js
├── AgentFlowEditor.css
├── AgentNode.js
├── AgentNode.css
└── ... (其他19个文件)
```

**新结构**（5个分类，结构清晰）：
```
components/
├── workflow/
├── layout/
├── home/
├── auth/
└── common/
```

所有导入路径已更新，无需额外修改。

