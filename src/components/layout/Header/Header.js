import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './Header.css';
import LanguageSwitcher from '../../common/LanguageSwitcher';
import Modal from '../../common/Modal';
import LoginForm from '../../auth/LoginForm';
import SignupForm from '../../auth/SignupForm';

function Header() {
  const { t } = useTranslation();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  const openLogin = () => {
    setIsSignupOpen(false);
    setIsLoginOpen(true);
  };

  const openSignup = () => {
    setIsLoginOpen(false);
    setIsSignupOpen(true);
  };

  const closeModals = () => {
    setIsLoginOpen(false);
    setIsSignupOpen(false);
  };

  return (
    <>
      <header className="header">
        <div className="header-container">
          <div className="logo">
            <span className="logo-text">Chat To Agent</span>
            <span className="logo-cursor"></span>
          </div>
          <nav className="nav">
            <LanguageSwitcher />
            <button onClick={openLogin} className="nav-link">{t('header.login')}</button>
            <button onClick={openSignup} className="btn-primary">{t('header.signup')}</button>
          </nav>
        </div>
      </header>

      <Modal isOpen={isLoginOpen} onClose={closeModals} title="登录">
        <LoginForm onClose={closeModals} onSwitchToSignup={openSignup} />
      </Modal>

      <Modal isOpen={isSignupOpen} onClose={closeModals} title="注册">
        <SignupForm onClose={closeModals} onSwitchToLogin={openLogin} />
      </Modal>
    </>
  );
}

export default Header;

