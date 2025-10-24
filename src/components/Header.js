import React from 'react';
import { useTranslation } from 'react-i18next';
import './Header.css';
import LanguageSwitcher from './LanguageSwitcher';

function Header() {
  const { t } = useTranslation();

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <span className="logo-text">Chat To Agent</span>
          <span className="logo-cursor"></span>
        </div>
        <nav className="nav">
          <LanguageSwitcher />
          <a href="#login" className="nav-link">{t('header.login')}</a>
          <button className="btn-primary">{t('header.signup')}</button>
        </nav>
      </div>
    </header>
  );
}

export default Header;

