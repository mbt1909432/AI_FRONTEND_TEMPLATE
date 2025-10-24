import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './AuthForm.css';

function SignupForm({ onClose, onSwitchToLogin }) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('两次输入的密码不一致！');
      return;
    }
    console.log('Signup:', formData);
    // TODO: 实现注册逻辑
    alert('注册功能开发中...');
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
        <label htmlFor="name" className="form-label">用户名</label>
        <input
          type="text"
          id="name"
          name="name"
          className="form-input"
          placeholder="输入您的用户名"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

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
          placeholder="至少 8 个字符"
          value={formData.password}
          onChange={handleChange}
          required
          minLength="8"
        />
      </div>

      <div className="form-group">
        <label htmlFor="confirmPassword" className="form-label">确认密码</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          className="form-input"
          placeholder="再次输入密码"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit" className="form-submit">
        注册
      </button>

      <div className="form-divider">
        <span>已有账号？</span>
      </div>

      <button type="button" className="form-switch" onClick={onSwitchToLogin}>
        立即登录
      </button>
    </form>
  );
}

export default SignupForm;

