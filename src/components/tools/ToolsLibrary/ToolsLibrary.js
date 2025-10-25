import React, { useState } from 'react';
import Header from '../../layout/Header';
import Footer from '../../layout/Footer';
import { toolsData, toolCategories, getToolsByCategory, searchTools } from '../../../data/toolsData';
import './ToolsLibrary.css';

function ToolsLibrary() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTool, setSelectedTool] = useState(null);

  // 获取显示的工具列表
  const getDisplayTools = () => {
    if (searchQuery.trim()) {
      return searchTools(searchQuery);
    }
    return getToolsByCategory(activeCategory);
  };

  const displayTools = getDisplayTools();

  return (
    <>
      <Header />
      <div className="tools-library">
        <div className="tools-container">
          <div className="tools-hero">
            <h1 className="tools-title">
              Agent <span className="highlight">工具库</span>
            </h1>
            <p className="tools-subtitle">
              探索 {toolsData.length} 个强大的工具，帮助你的 Agent 完成各种任务
            </p>
            
            <div className="tools-search">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="搜索工具..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="clear-search" onClick={() => setSearchQuery('')}>
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="tools-categories">
            {toolCategories.map(category => (
              <button
                key={category.id}
                className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveCategory(category.id);
                  setSearchQuery('');
                }}
              >
                <span className="category-icon">{category.icon}</span>
                <span className="category-name">{category.name}</span>
              </button>
            ))}
          </div>

      <div className="tools-grid">
        {displayTools.length > 0 ? (
          displayTools.map(tool => (
            <div 
              key={tool.id} 
              className="tool-card"
              onClick={() => setSelectedTool(tool)}
            >
              <div className="tool-card-header">
                <div className="tool-icon" style={{ backgroundColor: `${tool.color}20`, color: tool.color }}>
                  {tool.icon}
                </div>
                <div className="tool-name-section">
                  <h3 className="tool-name">{tool.name}</h3>
                  <span className="tool-category-badge">{toolCategories.find(c => c.id === tool.category)?.name}</span>
                </div>
              </div>

              <p className="tool-description">{tool.description}</p>

              <div className="tool-params">
                <div className="params-label">参数</div>
                <div className="params-list">
                  {tool.parameters.slice(0, 3).map((param, idx) => (
                    <span key={idx} className={`param-tag ${param.required ? 'required' : 'optional'}`}>
                      {param.name}
                      {param.required && <span className="required-mark">*</span>}
                    </span>
                  ))}
                  {tool.parameters.length > 3 && (
                    <span className="param-tag more">+{tool.parameters.length - 3}</span>
                  )}
                </div>
              </div>

            </div>
          ))
        ) : (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <p>没有找到匹配的工具</p>
            <button className="reset-btn" onClick={() => setSearchQuery('')}>
              清空搜索
            </button>
          </div>
        )}
          </div>
        </div>
      </div>

      {/* 工具详情模态框 */}
      {selectedTool && (
        <div className="tool-modal-overlay" onClick={() => setSelectedTool(null)}>
          <div className="tool-modal" onClick={(e) => e.stopPropagation()}>
            {/* 模态框头部 */}
            <div className="modal-header">
              <div className="modal-icon-wrapper" style={{ background: `linear-gradient(135deg, ${selectedTool.color}40, ${selectedTool.color}20)` }}>
                <span className="modal-icon" style={{ color: selectedTool.color }}>{selectedTool.icon}</span>
              </div>
              <div className="modal-header-content">
                <h2 className="modal-title">{selectedTool.name}</h2>
                <p className="modal-subtitle">{selectedTool.description}</p>
              </div>
              <button className="close-btn" onClick={() => setSelectedTool(null)}>✕</button>
            </div>

            {/* 模态框内容 */}
            <div className="modal-body">
              {/* 参数列表 */}
              <div className="detail-section">
                <div className="section-header">
                  <span className="section-icon">📋</span>
                  <h3>参数</h3>
                </div>
                <div className="params-grid">
                  {selectedTool.parameters.map((param, idx) => (
                    <div key={idx} className="param-card">
                      <div className="param-header">
                        <span className="param-name">{param.name}</span>
                        <div className="param-badges">
                          {param.required ? (
                            <span className="badge badge-required">必需</span>
                          ) : (
                            <span className="badge badge-optional">可选</span>
                          )}
                          <span className="badge badge-type">{param.type}</span>
                        </div>
                      </div>
                      <p className="param-description">{param.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 输出说明 */}
              <div className="detail-section">
                <div className="section-header">
                  <span className="section-icon">📤</span>
                  <h3>输出</h3>
                </div>
                <div className="output-content">
                  {selectedTool.output.split('\n').map((line, idx) => (
                    <div key={idx} className="output-line">
                      <span className="output-bullet">•</span>
                      <span>{line}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 使用示例 */}
              <div className="detail-section">
                <div className="section-header">
                  <span className="section-icon">💡</span>
                  <h3>示例</h3>
                </div>
                <div className="example-content">
                  <div className="example-item">
                    <div className="example-label">调用方式</div>
                    <div className="example-code-box">
                      <code>{selectedTool.example.code}</code>
                      <button 
                        className="copy-btn"
                        onClick={(e) => {
                          navigator.clipboard.writeText(selectedTool.example.code);
                          const btn = e.currentTarget;
                          btn.textContent = '✓';
                          setTimeout(() => btn.textContent = '📋', 1500);
                        }}
                        title="复制代码"
                      >
                        📋
                      </button>
                    </div>
                  </div>
                  <div className="example-divider">→</div>
                  <div className="example-item">
                    <div className="example-label">返回结果</div>
                    <div className="example-result-box">
                      {selectedTool.example.result}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}

export default ToolsLibrary;

