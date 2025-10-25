import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './ChatPage.css';
import LanguageSwitcher from '../components/common/LanguageSwitcher';
import AgentFlowEditor from '../components/workflow/AgentFlowEditor';

function ChatPage() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const initialPrompt = location.state?.prompt || '';
  
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: '您好！我看到您发送了"' + (initialPrompt || '1') + '" - 我能为您做些什么？您是想测试对话、开始计数，还是有特定的内容想要讨论？',
    }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isWorkflowCollapsed, setIsWorkflowCollapsed] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isWorkflowOpen, setIsWorkflowOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isThinking) return;

    const userMessage = {
      id: messages.length + 1,
      role: 'user',
      content: input
    };

    setMessages([...messages, userMessage]);
    setInput('');
    setIsThinking(true);

    // 模拟 AI 响应
    setTimeout(() => {
      const aiMessage = {
        id: messages.length + 2,
        role: 'assistant',
        content: '这是一个模拟回复。在实际应用中，这里会连接到您的 AI Agent 系统。'
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsThinking(false);
    }, 1500);
  };

  const handleNewChat = () => {
    navigate('/');
  };

  return (
    <div className="chat-page">
      {/* 遮罩层（移动端） */}
      {(isSidebarOpen || isWorkflowOpen) && (
        <div 
          className="mobile-overlay"
          onClick={() => {
            setIsSidebarOpen(false);
            setIsWorkflowOpen(false);
          }}
        />
      )}

      {/* 左侧边栏 */}
      <aside className={`chat-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="sidebar-logo-text">Chat To Agent</span>
          </div>
          <button className="new-chat-btn" onClick={handleNewChat}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            <span>新对话</span>
          </button>
        </div>

        <div className="sidebar-content">
          <div className="chat-history">
            <div className="history-item active">
              <span className="history-icon">💬</span>
              <span className="history-text">{initialPrompt || '新对话'}</span>
            </div>
          </div>
        </div>

        <div className="sidebar-footer">
          <LanguageSwitcher />
          <button className="user-profile">
            <div className="avatar">W</div>
            <span>用户</span>
          </button>
        </div>
      </aside>

      {/* 主对话区 */}
      <main className="chat-main">
        {/* 移动端顶部栏 */}
        <div className="mobile-header">
          <button 
            className="mobile-menu-btn"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label="Toggle sidebar"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18"/>
            </svg>
          </button>
          <span className="mobile-title">Chat To Agent</span>
          <button 
            className="mobile-workflow-btn"
            onClick={() => setIsWorkflowOpen(!isWorkflowOpen)}
            aria-label="Toggle workflow"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v4m0 12v4M2 12h4m12 0h4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/>
            </svg>
          </button>
        </div>

        <div className="chat-messages">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.role}`}>
              <div className="message-avatar">
                {message.role === 'user' ? 'W' : '🤖'}
              </div>
              <div className="message-content">
                <div className="message-text">{message.content}</div>
              </div>
            </div>
          ))}
          
          {isThinking && (
            <div className="message assistant">
              <div className="message-avatar">🤖</div>
              <div className="message-content">
                <div className="thinking-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-area">
          <form className="chat-input-form" onSubmit={handleSubmit}>
            <div className="input-wrapper">
              <textarea
                className="chat-textarea"
                placeholder="向 Chat To Agent 发送消息..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                rows="1"
              />
              <button 
                type="submit" 
                className="send-button"
                disabled={!input.trim() || isThinking}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 4L12 20M12 4L6 10M12 4L18 10"/>
                </svg>
              </button>
            </div>
            <div className="input-footer">
              <span className="input-hint">Chat To Agent 可能会犯错。请核实重要信息。</span>
            </div>
          </form>
        </div>
      </main>

      {/* 右侧 Agent 工作流编辑器 */}
      <AgentFlowEditor 
        isCollapsed={isWorkflowCollapsed}
        onToggle={() => setIsWorkflowCollapsed(!isWorkflowCollapsed)}
        isOpen={isWorkflowOpen}
      />
    </div>
  );
}

export default ChatPage;

