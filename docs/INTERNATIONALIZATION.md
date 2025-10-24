# 国际化指南 / Internationalization Guide

## 📖 概述 / Overview

本项目使用 `i18next` 和 `react-i18next` 实现完整的国际化支持。

---

## 🌍 支持的语言 / Supported Languages

| 语言 | 代码 | 完成度 |
|------|------|--------|
| 简体中文 | `zh` | ✅ 100% |
| English | `en` | ✅ 100% |

---

## 🔧 配置说明 / Configuration

### 初始化配置

位置: `src/i18n/config.js`

```javascript
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'zh',        // 回退语言
    lng: 'zh',                // 默认语言
    interpolation: {
      escapeValue: false      // React 已经处理 XSS
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });
```

### 语言检测优先级

1. **localStorage** - 用户上次选择的语言
2. **navigator** - 浏览器语言设置
3. **fallback** - 默认中文

---

## 📝 使用方法 / Usage

### 在组件中使用

```jsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('key.path')}</h1>
    </div>
  );
}
```

### 带变量的翻译

```json
{
  "welcome": "欢迎, {{name}}！"
}
```

```jsx
<p>{t('welcome', { name: 'John' })}</p>
```

### 数组翻译

```json
{
  "tags": ["标签1", "标签2", "标签3"]
}
```

```jsx
const tags = t('tags', { returnObjects: true });
```

---

## 📂 语言文件结构 / Language File Structure

### 推荐的命名空间结构

```json
{
  "header": {
    "login": "...",
    "signup": "..."
  },
  "hero": {
    "title": "...",
    "features": {
      "item1": "..."
    }
  },
  "templates": {
    "categories": { },
    "items": { }
  },
  "footer": { }
}
```

### 命名规范

- 使用 **camelCase** 命名键
- 使用 **嵌套对象** 组织相关翻译
- 保持键名的语义化

---

## ➕ 添加新语言 / Adding New Language

### 步骤 1: 创建语言文件

在 `src/i18n/locales/` 创建新文件，如 `fr.json`（法语）：

```json
{
  "header": {
    "login": "Connexion",
    "signup": "S'inscrire gratuitement"
  }
  // ... 复制所有键并翻译
}
```

### 步骤 2: 注册语言

在 `src/i18n/config.js` 中导入并注册：

```javascript
import translationFR from './locales/fr.json';

const resources = {
  en: { translation: translationEN },
  zh: { translation: translationZH },
  fr: { translation: translationFR }  // 新增
};
```

### 步骤 3: 更新语言切换器

修改 `src/components/LanguageSwitcher.js`：

```javascript
const languages = [
  { code: 'zh', name: '中文' },
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' }
];
```

### 步骤 4: 更新配置

在 `src/config/constants.js` 添加：

```javascript
export const APP_CONFIG = {
  supportedLanguages: ['zh', 'en', 'fr']
};
```

---

## ✅ 翻译检查清单 / Translation Checklist

提交新翻译前，请确认：

- [ ] 所有键都已翻译
- [ ] 没有遗漏的占位符 (如 `{{name}}`)
- [ ] 数组长度与原文一致
- [ ] 标点符号符合目标语言习惯
- [ ] 专业术语翻译准确
- [ ] 在实际界面中测试过

---

## 🎯 最佳实践 / Best Practices

### 1. 保持键名一致

✅ 好的做法：
```json
{
  "button": {
    "submit": "提交",
    "cancel": "取消"
  }
}
```

❌ 避免：
```json
{
  "submitButton": "提交",
  "cancelBtn": "取消"
}
```

### 2. 使用描述性键名

✅ 好的做法：
```json
{
  "error": {
    "emailInvalid": "邮箱格式不正确"
  }
}
```

❌ 避免：
```json
{
  "err1": "邮箱格式不正确"
}
```

### 3. 避免硬编码文本

✅ 好的做法：
```jsx
<button>{t('button.submit')}</button>
```

❌ 避免：
```jsx
<button>提交</button>
```

### 4. 复数处理

```json
{
  "items": "{{count}} 个项目",
  "items_plural": "{{count}} 个项目"
}
```

```jsx
t('items', { count: 5 })
```

---

## 🔍 调试 / Debugging

### 查看当前语言

```jsx
const { i18n } = useTranslation();
console.log('Current language:', i18n.language);
```

### 查看缺失的翻译

在开发环境中，缺失的键会显示为键名本身。

### 强制刷新翻译

```jsx
i18n.reloadResources();
```

---

## 📊 翻译统计 / Translation Stats

| 语言 | 键数量 | 完成度 | 最后更新 |
|------|--------|--------|----------|
| 中文 (zh) | 50+ | 100% | 2025-10-24 |
| English (en) | 50+ | 100% | 2025-10-24 |

---

## 🤝 贡献翻译 / Contributing Translations

我们欢迎社区贡献新的语言翻译！

1. 选择一个语言
2. 复制 `en.json` 作为模板
3. 翻译所有文本
4. 提交 Pull Request

详见 [CONTRIBUTING.md](../CONTRIBUTING.md)

---

## 📚 参考资源 / References

- [i18next 官方文档](https://www.i18next.com/)
- [react-i18next 文档](https://react.i18next.com/)
- [语言代码列表](https://www.iso.org/iso-639-language-codes.html)

---

**感谢您帮助 AgentBuilder 变得更加国际化！ 🌍**

