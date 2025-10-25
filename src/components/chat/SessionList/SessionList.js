import React, { useState } from 'react';
import './SessionList.css';

const SessionList = ({ 
  sessions, 
  currentSessionId, 
  onSessionSelect, 
  onSessionRename,
  onSessionDelete 
}) => {
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

  const handleRename = (sessionId) => {
    setEditingId(sessionId);
    const session = sessions.find(s => s.id === sessionId);
    setEditName(session?.name || '');
  };

  const handleSaveRename = (sessionId) => {
    if (editName.trim()) {
      onSessionRename(sessionId, editName.trim());
    }
    setEditingId(null);
  };

  const handleCancelRename = () => {
    setEditingId(null);
    setEditName('');
  };

  const handleKeyDown = (e, sessionId) => {
    if (e.key === 'Enter') {
      handleSaveRename(sessionId);
    } else if (e.key === 'Escape') {
      handleCancelRename();
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return '刚刚';
    if (diffMins < 60) return `${diffMins}分钟前`;
    if (diffHours < 24) return `${diffHours}小时前`;
    if (diffDays < 7) return `${diffDays}天前`;
    
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="session-list">
      {sessions.map((session) => (
        <div
          key={session.id}
          className={`session-item ${session.id === currentSessionId ? 'active' : ''}`}
        >
          <div 
            className="session-content"
            onClick={() => onSessionSelect(session.id)}
          >
            <span className="session-icon">💬</span>
            {editingId === session.id ? (
              <input
                className="session-name-input"
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onBlur={() => handleSaveRename(session.id)}
                onKeyDown={(e) => handleKeyDown(e, session.id)}
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
            ) : (
              <div className="session-info">
                <span className="session-name">{session.name}</span>
                <span className="session-time">{formatDate(session.updatedAt)}</span>
              </div>
            )}
          </div>
          
          <div className="session-actions">
            <button
              className="session-action-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleRename(session.id);
              }}
              title="重命名"
            >
              ✏️
            </button>
            {sessions.length > 1 && (
              <button
                className="session-action-btn delete"
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm('确定要删除这个对话吗？')) {
                    onSessionDelete(session.id);
                  }
                }}
                title="删除"
              >
                🗑️
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SessionList;

