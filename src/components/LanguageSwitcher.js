import React from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSwitcher.css';

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'zh' ? 'en' : 'zh';
    i18n.changeLanguage(newLang);
  };

  return (
    <button 
      className="language-switcher" 
      onClick={toggleLanguage}
      title={i18n.language === 'zh' ? '切换到英文' : 'Switch to Chinese'}
    >
      <span className="lang-icon">🌐</span>
      <span className="lang-text">
        {i18n.language === 'zh' ? 'EN' : '中文'}
      </span>
    </button>
  );
}

export default LanguageSwitcher;

