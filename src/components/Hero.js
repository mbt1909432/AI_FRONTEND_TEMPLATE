import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './Hero.css';

function Hero() {
  const { t } = useTranslation();
  const [prompt, setPrompt] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (prompt.trim()) {
      setIsThinking(true);
      // Simulate processing
      setTimeout(() => {
        setIsThinking(false);
        console.log('Processing prompt:', prompt);
      }, 2000);
    }
  };

  return (
    <section className="hero">
      <div className="hero-container">
        <h1 className="hero-title">
          {t('hero.title')}{' '}
          <span className="highlight">{t('hero.titleHighlight')}</span>
          <br />
          {t('hero.subtitle')}
        </h1>
        
        <div className="chat-interface">
          <div className="chat-header">
            <span className="chat-label">{t('hero.inputLabel')}</span>
            <span className="beta-badge">{t('hero.beta')}</span>
          </div>
          
          <form onSubmit={handleSubmit} className="chat-form">
            <textarea
              className="chat-input"
              placeholder={t('hero.inputPlaceholder')}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows="4"
            />
            
            <div className="chat-footer">
              <div className="status-badges">
                {isThinking && (
                  <span className="status-badge thinking">
                    <span className="status-icon">🤔</span>
                    {t('hero.thinking')}
                  </span>
                )}
              </div>
              
              <button 
                type="submit" 
                className="submit-btn"
                disabled={!prompt.trim() || isThinking}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 4L12 20M12 4L6 10M12 4L18 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </form>
        </div>

        <div className="features">
          <div className="feature-item">
            <span className="feature-icon">🚀</span>
            <span className="feature-text">{t('hero.features.zeroCode')}</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">⚡</span>
            <span className="feature-text">{t('hero.features.highAvailability')}</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">💰</span>
            <span className="feature-text">{t('hero.features.lowCost')}</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🎯</span>
            <span className="feature-text">{t('hero.features.autoOrchestration')}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;

