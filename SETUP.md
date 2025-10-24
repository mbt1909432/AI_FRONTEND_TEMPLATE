# 项目设置指南

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm start
```

应用将在 `http://localhost:3000` 启动

### 3. 构建生产版本

```bash
npm run build
```

## 📁 项目结构

```
agentic-system-builder/
├── public/
│   └── index.html          # HTML 模板
├── src/
│   ├── components/         # React 组件
│   │   ├── Header.js       # 导航栏组件
│   │   ├── Header.css
│   │   ├── Hero.js         # 主标题和输入区
│   │   ├── Hero.css
│   │   ├── Templates.js    # 模板展示区
│   │   ├── Templates.css
│   │   ├── Footer.js       # 页脚组件
│   │   └── Footer.css
│   ├── data/
│   │   └── templates.js    # 模板数据
│   ├── App.js             # 主应用组件
│   ├── App.css            # 全局应用样式
│   ├── index.js           # 应用入口
│   └── index.css          # 全局基础样式
├── package.json
└── README.md
```

## 🎨 设计特点

- **渐变背景**: 青绿色系渐变，营造现代感
- **强调色**: 亮绿色 (#00E676) 用于 CTA 和高亮
- **交互动画**: 悬停效果、按钮动画、状态指示
- **响应式设计**: 适配移动端和桌面端

## 🔧 自定义

### 修改配色

在各个 CSS 文件中搜索以下颜色值进行替换：
- `#00E676` - 主要强调色（绿色）
- `#E0F7FA`, `#B2EBF2`, `#80DEEA` - 渐变背景色
- `#1a1a1a` - 主要文本色

### 添加新模板

编辑 `src/data/templates.js` 文件，在 `templateData` 数组中添加新的模板对象：

```javascript
{
  id: 13,
  title: '您的 Agent 标题',
  description: '描述文字...',
  icon: '🤖',
  category: 'business', // 或其他分类
  tags: ['标签1', '标签2'],
  featured: false // 设为 true 显示特殊样式
}
```

### 添加新分类

在 `src/data/templates.js` 的 `categories` 数组中添加：

```javascript
{ id: 'your-category', name: '分类名称' }
```

## 📱 浏览器支持

- Chrome (最新)
- Firefox (最新)
- Safari (最新)
- Edge (最新)

## 💡 开发建议

1. 使用 React DevTools 调试组件
2. 检查控制台警告和错误
3. 测试不同屏幕尺寸的响应式表现
4. 优化图片和资源加载

## 🐛 常见问题

**Q: 启动后页面空白？**
A: 检查控制台错误，确保所有依赖已正确安装

**Q: 样式未生效？**
A: 清除浏览器缓存，或使用无痕模式测试

**Q: 如何部署到生产环境？**
A: 运行 `npm run build`，然后将 `build` 文件夹部署到服务器

