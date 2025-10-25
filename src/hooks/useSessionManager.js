import { useState, useCallback, useEffect } from 'react';

// Session 管理 Hook
export const useSessionManager = () => {
  // 从 localStorage 加载 sessions
  const loadSessions = () => {
    try {
      const saved = localStorage.getItem('chat_sessions');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Failed to load sessions:', error);
    }
    
    // 默认创建一个 session
    return [{
      id: Date.now().toString(),
      name: '新对话',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [],
      workflowConfig: null
    }];
  };

  const [sessions, setSessions] = useState(loadSessions);
  const [currentSessionId, setCurrentSessionId] = useState(() => {
    const saved = localStorage.getItem('current_session_id');
    return saved || sessions[0]?.id;
  });

  // 保存 sessions 到 localStorage
  useEffect(() => {
    try {
      localStorage.setItem('chat_sessions', JSON.stringify(sessions));
    } catch (error) {
      console.error('Failed to save sessions:', error);
    }
  }, [sessions]);

  // 保存当前 session ID
  useEffect(() => {
    if (currentSessionId) {
      localStorage.setItem('current_session_id', currentSessionId);
    }
  }, [currentSessionId]);

  // 获取当前 session
  const currentSession = sessions.find(s => s.id === currentSessionId);

  // 创建新 session
  const createSession = useCallback((name = '新对话') => {
    const newSession = {
      id: Date.now().toString(),
      name,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [],
      workflowConfig: null
    };
    
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    
    return newSession;
  }, []);

  // 删除 session
  const deleteSession = useCallback((sessionId) => {
    setSessions(prev => {
      const filtered = prev.filter(s => s.id !== sessionId);
      
      // 如果删除的是当前 session，切换到第一个
      if (sessionId === currentSessionId && filtered.length > 0) {
        setCurrentSessionId(filtered[0].id);
      }
      
      // 如果删除后没有 session，创建一个新的
      if (filtered.length === 0) {
        const newSession = {
          id: Date.now().toString(),
          name: '新对话',
          createdAt: Date.now(),
          updatedAt: Date.now(),
          messages: [],
          workflowConfig: null
        };
        setCurrentSessionId(newSession.id);
        return [newSession];
      }
      
      return filtered;
    });
  }, [currentSessionId]);

  // 重命名 session
  const renameSession = useCallback((sessionId, newName) => {
    setSessions(prev => prev.map(s => 
      s.id === sessionId 
        ? { ...s, name: newName, updatedAt: Date.now() }
        : s
    ));
  }, []);

  // 切换 session
  const switchSession = useCallback((sessionId) => {
    setCurrentSessionId(sessionId);
  }, []);

  // 更新当前 session 的消息
  const updateMessages = useCallback((messages) => {
    setSessions(prev => prev.map(s => 
      s.id === currentSessionId 
        ? { ...s, messages, updatedAt: Date.now() }
        : s
    ));
  }, [currentSessionId]);

  // 添加消息到当前 session
  const addMessage = useCallback((message) => {
    setSessions(prev => prev.map(s => 
      s.id === currentSessionId 
        ? { ...s, messages: [...s.messages, message], updatedAt: Date.now() }
        : s
    ));
  }, [currentSessionId]);

  // 更新当前 session 的工作流配置
  const updateWorkflowConfig = useCallback((config) => {
    setSessions(prev => prev.map(s => 
      s.id === currentSessionId 
        ? { ...s, workflowConfig: config, updatedAt: Date.now() }
        : s
    ));
  }, [currentSessionId]);

  return {
    sessions,
    currentSession,
    currentSessionId,
    createSession,
    deleteSession,
    renameSession,
    switchSession,
    updateMessages,
    addMessage,
    updateWorkflowConfig
  };
};

