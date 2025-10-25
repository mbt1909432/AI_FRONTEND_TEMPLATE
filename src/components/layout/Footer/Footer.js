import React from 'react';
import { useTranslation } from 'react-i18next';
import './Footer.css';

function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">{t('footer.legal')}</h3>
            <ul className="footer-links">
              <li><a href="#privacy">{t('footer.privacy')}</a></li>
              <li><a href="#terms">{t('footer.terms')}</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3 className="footer-title">{t('footer.social')}</h3>
            <ul className="footer-links">
              <li><a href="#twitter">{t('footer.twitter')}</a></li>
              <li><a href="#discord">{t('footer.discord')}</a></li>
              <li><a href="#github">{t('footer.github')}</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">{t('footer.contact')}</h3>
            <ul className="footer-links">
              <li>
                <span className="contact-item">
                  <span className="contact-icon">💬</span>
                  {t('footer.wechat')}
                </span>
              </li>
              <li>
                <a 
                  href="https://www.xiaohongshu.com/user/profile/5f6da2890000000001005f0c" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="contact-link"
                >
                  <span className="contact-icon">📕</span>
                  {t('footer.xiaohongshu')}
                </a>
              </li>
              <li className="welcome-text">{t('footer.welcome')}</li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p className="copyright">{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

