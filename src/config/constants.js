/**
 * 全局常量配置 / Global Constants Configuration
 */

// 应用配置 / App Configuration
export const APP_CONFIG = {
  name: 'Chat To Agent',
  version: '0.1.0',
  defaultLanguage: 'zh',
  supportedLanguages: ['zh', 'en']
};

// 主题颜色 / Theme Colors
export const COLORS = {
  primary: '#667eea',
  secondary: '#764ba2',
  accent: '#f093fb',
  background: {
    start: '#667eea',
    middle1: '#764ba2',
    middle2: '#f093fb',
    middle3: '#4facfe',
    end: '#00f2fe'
  },
  text: {
    primary: '#1a1a1a',
    secondary: '#666',
    tertiary: '#999'
  },
  border: '#e0e0e0',
  white: '#ffffff'
};

// 断点 / Breakpoints
export const BREAKPOINTS = {
  mobile: '320px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1400px'
};

// 动画时长 / Animation Duration
export const ANIMATION = {
  fast: '0.2s',
  normal: '0.3s',
  slow: '0.5s'
};

// 间距 / Spacing
export const SPACING = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '40px',
  xxl: '60px'
};

// 圆角 / Border Radius
export const RADIUS = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  full: '50%'
};

// API 配置 / API Configuration (预留)
export const API_CONFIG = {
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
  timeout: 10000
};

// 本地存储键 / Local Storage Keys
export const STORAGE_KEYS = {
  language: 'i18nextLng',
  theme: 'app_theme',
  userPreferences: 'user_preferences'
};

