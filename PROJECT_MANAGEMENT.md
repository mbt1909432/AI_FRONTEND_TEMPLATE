# 项目管理文档 / Project Management

## 📋 项目概述 / Project Overview

**项目名称**: AgentBuilder - Zero-Code Agentic System Platform  
**版本**: 0.1.0  
**技术栈**: React 18, i18next, CSS3  
**开发语言**: JavaScript/JSX  
**支持语言**: 中文、英文

---

## 🏗️ 项目结构 / Project Structure

```
agentic-system-builder/
├── public/                     # 静态资源 / Static assets
│   └── index.html             # HTML 模板 / HTML template
│
├── src/
│   ├── components/            # React 组件 / React components
│   │   ├── Header.js          # 顶部导航 / Header navigation
│   │   ├── Header.css
│   │   ├── Hero.js            # 主页英雄区 / Hero section
│   │   ├── Hero.css
│   │   ├── Templates.js       # 模板展示 / Template showcase
│   │   ├── Templates.css
│   │   ├── Footer.js          # 页脚 / Footer
│   │   ├── Footer.css
│   │   ├── LanguageSwitcher.js # 语言切换器 / Language switcher
│   │   └── LanguageSwitcher.css
│   │
│   ├── data/                  # 数据层 / Data layer
│   │   └── templates.js       # 模板数据 / Template data
│   │
│   ├── i18n/                  # 国际化配置 / i18n configuration
│   │   ├── config.js          # i18n 初始化 / i18n initialization
│   │   └── locales/           # 语言包 / Language files
│   │       ├── zh.json        # 中文翻译 / Chinese translations
│   │       └── en.json        # 英文翻译 / English translations
│   │
│   ├── App.js                 # 主应用组件 / Main app component
│   ├── App.css                # 全局应用样式 / Global app styles
│   ├── index.js               # 应用入口 / App entry point
│   └── index.css              # 基础样式 / Base styles
│
├── package.json               # 依赖管理 / Dependencies
├── .gitignore                 # Git 忽略文件 / Git ignore
├── README.md                  # 项目说明 / Project readme
├── SETUP.md                   # 设置指南 / Setup guide
└── PROJECT_MANAGEMENT.md      # 本文件 / This file
```

---

## 🔧 开发规范 / Development Standards

### 代码规范 / Code Standards

1. **组件命名**: 使用 PascalCase (例如: `LanguageSwitcher`)
2. **文件命名**: 组件文件与组件名相同
3. **CSS 命名**: 使用 kebab-case (例如: `.language-switcher`)
4. **缩进**: 2 个空格
5. **引号**: 单引号用于 JS，双引号用于 JSX 属性

### 组件结构 / Component Structure

```javascript
// 1. Imports
import React from 'react';
import { useTranslation } from 'react-i18next';
import './ComponentName.css';

// 2. Component definition
function ComponentName() {
  const { t } = useTranslation();
  
  // 3. State and hooks
  // 4. Event handlers
  // 5. Render
  return (
    // JSX
  );
}

// 6. Export
export default ComponentName;
```

---

## 🌍 国际化管理 / Internationalization

### 添加新翻译 / Adding New Translations

1. 在 `src/i18n/locales/zh.json` 添加中文
2. 在 `src/i18n/locales/en.json` 添加对应英文
3. 在组件中使用 `t('key.path')`

**示例 / Example**:
```json
// zh.json
{
  "newSection": {
    "title": "新标题",
    "description": "新描述"
  }
}

// en.json
{
  "newSection": {
    "title": "New Title",
    "description": "New Description"
  }
}
```

```jsx
// Component
const { t } = useTranslation();
<h1>{t('newSection.title')}</h1>
```

### 语言检测优先级 / Language Detection Priority

1. localStorage (持久化)
2. 浏览器语言设置
3. 默认: 中文 (zh)

---

## 🎨 设计系统 / Design System

### 颜色变量 / Color Variables

| 用途 | 颜色值 | 说明 |
|------|--------|------|
| 主色调 | `#00E676` | 绿色强调色 |
| 背景渐变 | `#E0F7FA → #B2EBF2 → #80DEEA` | 青绿色渐变 |
| 主文本 | `#1a1a1a` | 深灰色 |
| 次文本 | `#666` | 中灰色 |
| 辅助文本 | `#999` | 浅灰色 |
| 边框 | `#e0e0e0` | 淡灰色 |

### 间距系统 / Spacing System

- **极小**: 4px
- **小**: 8px
- **中**: 16px
- **大**: 24px
- **超大**: 40px, 60px, 80px

### 圆角 / Border Radius

- **小**: 8px (按钮、输入框)
- **中**: 12px (表单元素)
- **大**: 16px (卡片)
- **圆形**: 50% (图标按钮)

---

## 📦 依赖管理 / Dependency Management

### 核心依赖 / Core Dependencies

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "i18next": "^23.7.6",
  "react-i18next": "^13.5.0",
  "i18next-browser-languagedetector": "^7.2.0"
}
```

### 添加新依赖流程 / Adding New Dependencies

1. 评估必要性
2. 检查许可证兼容性
3. 安装: `npm install package-name`
4. 更新文档
5. 提交代码审查

---

## 🚀 部署流程 / Deployment Process

### 开发环境 / Development

```bash
npm install
npm start
# 访问 http://localhost:3000
```

### 生产构建 / Production Build

```bash
npm run build
# 输出到 /build 目录
```

### 部署检查清单 / Deployment Checklist

- [ ] 所有功能测试通过
- [ ] 中英文翻译完整
- [ ] 响应式设计验证
- [ ] 性能优化检查
- [ ] 浏览器兼容性测试
- [ ] 生产环境变量配置
- [ ] 备份当前版本

---

## 🐛 问题追踪 / Issue Tracking

### Bug 报告模板 / Bug Report Template

```markdown
**描述**: [简要描述问题]
**重现步骤**:
1. 
2. 
3. 

**期望行为**: 
**实际行为**: 
**环境**: 
- 浏览器: 
- 操作系统: 
- 版本: 

**截图**: [如有]
```

### 功能请求模板 / Feature Request Template

```markdown
**功能描述**: 
**使用场景**: 
**优先级**: [高/中/低]
**可行性评估**: 
```

---

## 📈 版本管理 / Version Control

### Git 工作流 / Git Workflow

```bash
# 创建功能分支
git checkout -b feature/new-feature

# 开发并提交
git add .
git commit -m "feat: add new feature"

# 推送并创建 PR
git push origin feature/new-feature
```

### 提交信息规范 / Commit Message Convention

- `feat:` 新功能
- `fix:` Bug 修复
- `docs:` 文档更新
- `style:` 代码格式调整
- `refactor:` 代码重构
- `test:` 测试相关
- `chore:` 构建/工具相关

---

## 📊 性能监控 / Performance Monitoring

### 关键指标 / Key Metrics

- **FCP** (First Contentful Paint): < 1.8s
- **LCP** (Largest Contentful Paint): < 2.5s
- **TTI** (Time to Interactive): < 3.8s
- **Bundle Size**: < 500KB (gzipped)

### 优化建议 / Optimization Tips

1. 使用 React.memo() 避免不必要的重渲染
2. 懒加载非关键组件
3. 图片优化和懒加载
4. CSS 代码分割
5. 生产环境使用 CDN

---

## 🔒 安全规范 / Security Guidelines

1. **不要提交敏感信息** (API keys, tokens)
2. **使用环境变量** 管理配置
3. **定期更新依赖** 修复安全漏洞
4. **XSS 防护**: React 默认转义
5. **HTTPS**: 生产环境必须使用

---

## 🧪 测试策略 / Testing Strategy

### 测试类型 / Test Types

1. **单元测试**: 组件独立功能
2. **集成测试**: 组件交互
3. **端到端测试**: 完整用户流程
4. **可访问性测试**: WCAG 标准
5. **国际化测试**: 多语言验证

---

## 📞 联系与支持 / Contact & Support

**项目维护者**: AgentBuilder Team  
**文档更新**: 2025-10-24

---

## 🔄 更新日志 / Changelog

### v0.1.0 (2025-10-24)
- ✨ 初始项目搭建
- 🌍 添加中英双语支持
- 🎨 实现 Sheet0.com 风格设计
- 📦 集成 i18next 国际化
- 📝 完善项目文档

---

## 📚 学习资源 / Learning Resources

- [React 官方文档](https://react.dev/)
- [i18next 文档](https://www.i18next.com/)
- [CSS Grid 指南](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [React 国际化最佳实践](https://react.i18next.com/)

