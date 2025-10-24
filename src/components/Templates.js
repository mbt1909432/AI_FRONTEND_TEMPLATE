import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './Templates.css';
import { getTemplates, getCategories } from '../data/templates';

function Templates() {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('all');
  
  const templates = getTemplates(t);
  const categories = getCategories(t);

  const filteredTemplates = activeCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === activeCategory);

  return (
    <section className="templates">
      <div className="templates-container">
        <div className="templates-header">
          <div className="category-tabs">
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`category-tab ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="templates-grid">
          {filteredTemplates.map(template => (
            <div 
              key={template.id} 
              className={`template-card ${template.featured ? 'featured' : ''}`}
            >
              <div className="template-header">
                <h3 className="template-title">{template.title}</h3>
                <div className="template-icon">
                  {template.icon}
                </div>
              </div>
              <p className="template-description">{template.description}</p>
              <div className="template-footer">
                <div className="template-tags">
                  {template.tags.map((tag, idx) => (
                    <span key={idx} className="template-tag">{tag}</span>
                  ))}
                </div>
                <div className="template-actions">
                  <button className="action-btn" title={t('templates.actions.view')}>
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                  </button>
                  <button className="action-btn" title={t('templates.actions.use')}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Templates;

