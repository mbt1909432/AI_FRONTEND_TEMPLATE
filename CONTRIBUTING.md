# 贡献指南 / Contributing Guide

感谢您对 AgentBuilder 项目的关注！我们欢迎各种形式的贡献。

---

## 🤝 如何贡献 / How to Contribute

### 报告 Bug / Reporting Bugs

1. 在 [Issues](./issues) 中搜索是否已有相同问题
2. 如果没有，创建新 issue
3. 提供详细的重现步骤
4. 包含截图或错误日志

### 提交功能请求 / Submitting Feature Requests

1. 检查功能是否已在规划中
2. 创建 feature request issue
3. 详细描述使用场景和需求
4. 讨论可行性

### 提交代码 / Submitting Code

1. **Fork 项目**
```bash
git clone https://github.com/your-username/agentic-system-builder.git
cd agentic-system-builder
```

2. **创建分支**
```bash
git checkout -b feature/your-feature-name
```

3. **开发**
```bash
npm install
npm start
```

4. **提交**
```bash
git add .
git commit -m "feat: your feature description"
```

5. **推送并创建 PR**
```bash
git push origin feature/your-feature-name
```

---

## 📝 代码规范 / Code Standards

### JavaScript/JSX

- 使用 ES6+ 语法
- 组件使用函数式组件和 Hooks
- 保持组件单一职责
- 添加必要的注释

### CSS

- 使用组件级 CSS 文件
- 类名使用 kebab-case
- 避免使用 !important
- 保持响应式设计

### 国际化 / i18n

- 所有用户可见文本必须使用 `t()` 函数
- 同步更新 `zh.json` 和 `en.json`
- 使用有意义的键名

---

## ✅ Pull Request 检查清单 / PR Checklist

提交 PR 前请确保：

- [ ] 代码遵循项目规范
- [ ] 添加了必要的注释
- [ ] 更新了相关文档
- [ ] 测试通过（如有测试）
- [ ] 中英文翻译完整
- [ ] 没有控制台警告或错误
- [ ] PR 描述清晰

---

## 🌍 国际化贡献 / i18n Contributions

### 添加新语言

1. 在 `src/i18n/locales/` 创建新语言文件 (如 `fr.json`)
2. 翻译所有键值
3. 在 `src/i18n/config.js` 注册新语言
4. 更新 `LanguageSwitcher` 组件
5. 提交 PR

---

## 🎨 设计贡献 / Design Contributions

如果您有设计建议：

1. 创建 issue 附上设计稿
2. 说明设计理念
3. 考虑可访问性
4. 保持品牌一致性

---

## 📖 文档贡献 / Documentation Contributions

文档同样重要：

- 修正错别字
- 改进说明清晰度
- 添加示例
- 翻译文档

---

## 🐛 Bug 修复流程 / Bug Fix Process

1. 确认 bug 存在
2. 在本地重现问题
3. 找到根本原因
4. 编写修复代码
5. 验证修复效果
6. 提交 PR

---

## 💬 交流渠道 / Communication

- **Issues**: 技术问题和功能讨论
- **Discussions**: 一般性讨论
- **PR Comments**: 代码审查反馈

---

## 🙏 行为准则 / Code of Conduct

- 尊重所有贡献者
- 提供建设性反馈
- 保持专业和友善
- 欢迎新手提问

---

## 📄 许可协议 / License

通过贡献代码，您同意您的贡献将在 MIT 许可证下发布。

---

**再次感谢您的贡献！ / Thank you for your contribution!** 🎉

