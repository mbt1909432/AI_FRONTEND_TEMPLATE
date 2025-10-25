import React, { useState, useMemo } from 'react';
import { toolsData, toolCategories } from '../../../data/toolsData';
import './ToolSelector.css';

const ToolSelector = ({ selectedTools = [], onToolsChange, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // 过滤工具
  const filteredTools = useMemo(() => {
    let tools = toolsData;
    
    // 按分类过滤
    if (selectedCategory !== 'all') {
      tools = tools.filter(tool => tool.category === selectedCategory);
    }
    
    // 按搜索关键词过滤
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      tools = tools.filter(tool =>
        tool.name.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query)
      );
    }
    
    return tools;
  }, [selectedCategory, searchQuery]);

  // 切换工具选择
  const toggleTool = (toolId) => {
    const newSelectedTools = selectedTools.includes(toolId)
      ? selectedTools.filter(id => id !== toolId)
      : [...selectedTools, toolId];
    onToolsChange(newSelectedTools);
  };

  // 全选当前分类
  const selectAll = () => {
    const allToolIds = filteredTools.map(tool => tool.id);
    const newSelected = [...new Set([...selectedTools, ...allToolIds])];
    onToolsChange(newSelected);
  };

  // 清空选择
  const clearAll = () => {
    onToolsChange([]);
  };

  return (
    <div className="tool-selector-overlay" onClick={onClose}>
      <div className="tool-selector-modal" onClick={(e) => e.stopPropagation()}>
        <div className="tool-selector-header">
          <h3>🔧 选择工具</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="tool-selector-controls">
          {/* 搜索框 */}
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="搜索工具名称或描述..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          {/* 分类标签 */}
          <div className="category-tabs">
            {toolCategories.map((category) => (
              <button
                key={category.id}
                className={`category-tab ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>

          {/* 批量操作 */}
          <div className="batch-actions">
            <span className="selected-count">
              已选择: {selectedTools.length} 个工具
            </span>
            <div className="action-buttons">
              <button className="action-btn" onClick={selectAll}>
                全选当前
              </button>
              <button className="action-btn" onClick={clearAll}>
                清空
              </button>
            </div>
          </div>
        </div>

        {/* 工具列表 */}
        <div className="tool-selector-content">
          {filteredTools.length > 0 ? (
            <div className="tools-grid">
              {filteredTools.map((tool) => {
                const isSelected = selectedTools.includes(tool.id);
                return (
                  <div
                    key={tool.id}
                    className={`tool-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleTool(tool.id)}
                  >
                    <div className="tool-card-header">
                      <div className="tool-icon" style={{ backgroundColor: tool.color }}>
                        {tool.icon}
                      </div>
                      <div className="tool-info">
                        <div className="tool-name">{tool.name}</div>
                        <div className="tool-category-badge">{tool.category}</div>
                      </div>
                      <div className="tool-checkbox">
                        {isSelected && <span className="checkmark">✓</span>}
                      </div>
                    </div>
                    <div className="tool-description">{tool.description}</div>
                    <div className="tool-params">
                      {tool.parameters.slice(0, 2).map((param, idx) => (
                        <span key={idx} className="param-tag">
                          {param.name}
                          {param.required && <span className="required">*</span>}
                        </span>
                      ))}
                      {tool.parameters.length > 2 && (
                        <span className="param-tag more">+{tool.parameters.length - 2}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <div className="empty-text">未找到匹配的工具</div>
            </div>
          )}
        </div>

        {/* 底部操作 */}
        <div className="tool-selector-footer">
          <button className="btn-cancel" onClick={onClose}>
            取消
          </button>
          <button className="btn-confirm" onClick={onClose}>
            确认选择{selectedTools.length > 0 ? ` (${selectedTools.length})` : ''}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ToolSelector;

