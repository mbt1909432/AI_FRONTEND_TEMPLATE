import React, { useState } from 'react';
import './WorkflowPanel.css';

function WorkflowPanel({ workflow, isCollapsed, onToggle }) {
  const [selectedNode, setSelectedNode] = useState(null);

  // 模拟工作流数据
  const defaultWorkflow = workflow || {
    nodes: [
      { id: 1, type: 'trigger', title: '触发器', description: '用户输入触发', status: 'active', icon: '⚡' },
      { id: 2, type: 'llm', title: 'LLM 分析', description: '理解用户意图', status: 'processing', icon: '🤖' },
      { id: 3, type: 'tool', title: '工具调用', description: '执行特定任务', status: 'pending', icon: '🔧' },
      { id: 4, type: 'output', title: '输出结果', description: '返回给用户', status: 'pending', icon: '📤' }
    ],
    connections: [
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 3, to: 4 }
    ]
  };

  const handleNodeClick = (node) => {
    setSelectedNode(selectedNode?.id === node.id ? null : node);
  };

  if (isCollapsed) {
    return (
      <div className="workflow-panel collapsed">
        <button className="panel-toggle" onClick={onToggle} title="展开工作流">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
      </div>
    );
  }

  return (
    <aside className="workflow-panel">
      <div className="panel-header">
        <div className="panel-title">
          <span className="panel-icon">🔄</span>
          <h3>工作流编排</h3>
        </div>
        <button className="panel-toggle" onClick={onToggle} title="收起">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      </div>

      <div className="panel-content">
        <div className="workflow-status">
          <div className="status-item">
            <span className="status-dot active"></span>
            <span>运行中</span>
          </div>
          <div className="status-time">
            <span>⏱️ 实时更新</span>
          </div>
        </div>

        <div className="workflow-canvas">
          {defaultWorkflow.nodes.map((node, index) => (
            <div key={node.id}>
              <div
                className={`workflow-node ${node.status} ${selectedNode?.id === node.id ? 'selected' : ''}`}
                data-type={node.type}
                onClick={() => handleNodeClick(node)}
              >
                <div className="node-icon">{node.icon}</div>
                <div className="node-content">
                  <div className="node-title">{node.title}</div>
                  <div className="node-description">{node.description}</div>
                </div>
                <div className="node-status">
                  {node.status === 'active' && <span className="pulse"></span>}
                  {node.status === 'processing' && (
                    <div className="processing-spinner">
                      <div className="spinner"></div>
                    </div>
                  )}
                  {node.status === 'pending' && <span className="pending-dot"></span>}
                  {node.status === 'completed' && <span className="check-icon">✓</span>}
                </div>
              </div>

              {index < defaultWorkflow.nodes.length - 1 && (
                <div className="workflow-connector">
                  <div className="connector-line"></div>
                  <div className="connector-arrow">↓</div>
                </div>
              )}
            </div>
          ))}
        </div>

        {selectedNode && (
          <div className="node-details">
            <div className="details-header">
              <span className="details-icon">{selectedNode.icon}</span>
              <h4>{selectedNode.title}</h4>
            </div>
            <div className="details-content">
              <div className="detail-row">
                <span className="detail-label">类型：</span>
                <span className="detail-value">{selectedNode.type}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">状态：</span>
                <span className={`detail-value status-${selectedNode.status}`}>
                  {selectedNode.status === 'active' && '激活'}
                  {selectedNode.status === 'processing' && '处理中'}
                  {selectedNode.status === 'pending' && '等待'}
                  {selectedNode.status === 'completed' && '完成'}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">描述：</span>
                <span className="detail-value">{selectedNode.description}</span>
              </div>
            </div>
          </div>
        )}

        <div className="workflow-actions">
          <button className="action-btn secondary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            重置
          </button>
          <button className="action-btn primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/>
            </svg>
            导出
          </button>
        </div>
      </div>
    </aside>
  );
}

export default WorkflowPanel;


