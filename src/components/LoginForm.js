import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './AuthForm.css';

function LoginForm({ onClose, onSwitchToSignup }) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login:', formData);
    // TODO: 实现登录逻辑
    alert('登录功能开发中...');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="email" className="form-label">邮箱</label>
        <input
          type="email"
          id="email"
          name="email"
          className="form-input"
          placeholder="your@email.com"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="password" className="form-label">密码</label>
        <input
          type="password"
          id="password"
          name="password"
          className="form-input"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-footer">
        <a href="#forgot" className="forgot-link">忘记密码？</a>
      </div>

      <button type="submit" className="form-submit">
        登录
      </button>

      <div className="form-divider">
        <span>还没有账号？</span>
      </div>

      <button type="button" className="form-switch" onClick={onSwitchToSignup}>
        立即注册
      </button>
    </form>
  );
}

export default LoginForm;

