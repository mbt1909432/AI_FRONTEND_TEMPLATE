import React, { memo, useState, useCallback, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import './AgentNode.css';

const AgentNode = memo(({ data, isConnectable }) => {
  const { name, instructions, handoff_description, tools, handoffs, isStarter, type } = data;
  const [isEditingInstructions, setIsEditingInstructions] = useState(false);
  const [isEditingHandoff, setIsEditingHandoff] = useState(false);
  const [instructionsValue, setInstructionsValue] = useState(instructions || '');
  const [handoffDescValue, setHandoffDescValue] = useState(handoff_description || '');

  // 当 instructions 从外部更新时，同步内部状态
  useEffect(() => {
    setInstructionsValue(instructions || '');
  }, [instructions]);

  // 当 handoff_description 从外部更新时，同步内部状态
  useEffect(() => {
    setHandoffDescValue(handoff_description || '');
  }, [handoff_description]);

  // 根据节点角色选择颜色
  const getNodeColor = () => {
    if (isStarter) return 'starter';
    if (type === 'extraction') return 'extraction';
    if (type === 'calculation') return 'calculation';
    if (type === 'report') return 'report';
    return 'default';
  };

  // 处理 instructions 修改
  const handleInstructionsChange = useCallback((e) => {
    const newValue = e.target.value;
    setInstructionsValue(newValue);
    if (data.onInstructionsChange) {
      data.onInstructionsChange(name, newValue);
    }
  }, [data, name]);

  // 处理 handoff_description 修改
  const handleHandoffDescChange = useCallback((e) => {
    const newValue = e.target.value;
    setHandoffDescValue(newValue);
    if (data.onHandoffDescChange) {
      data.onHandoffDescChange(name, newValue);
    }
  }, [data, name]);

  return (
    <div className={`agent-node ${getNodeColor()}`}>
      {/* 输入连接点 */}
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="agent-handle handle-input"
      />

      {/* 节点头部 */}
      <div className="agent-node-header">
        {isStarter && <span className="starter-badge">START</span>}
        <div className="agent-icon">
          {isStarter ? '🚀' : '🤖'}
        </div>
        <div className="agent-name">{name}</div>
      </div>

      {/* 节点内容 */}
      <div className="agent-node-body">
        <div className="agent-section">
          <div className="section-label">
            💬 Instructions
            <button 
              className="edit-btn"
              onClick={() => setIsEditingInstructions(!isEditingInstructions)}
              title={isEditingInstructions ? '完成编辑' : '编辑指令'}
            >
              {isEditingInstructions ? '✓' : '✏️'}
            </button>
          </div>
          {isEditingInstructions ? (
            <textarea
              className="instructions-editor"
              value={instructionsValue}
              onChange={handleInstructionsChange}
              placeholder="输入 Agent 的工作指令..."
              rows={4}
              autoFocus
            />
          ) : (
            <div className="section-content instructions">
              {instructionsValue || '暂无指令'}
            </div>
          )}
        </div>

        {/* Handoff Description */}
        <div className="agent-section">
          <div className="section-label">
            📋 Handoff Description
            <button 
              className="edit-btn"
              onClick={() => setIsEditingHandoff(!isEditingHandoff)}
              title={isEditingHandoff ? '完成编辑' : '编辑描述'}
            >
              {isEditingHandoff ? '✓' : '✏️'}
            </button>
          </div>
          {isEditingHandoff ? (
            <textarea
              className="handoff-editor"
              value={handoffDescValue}
              onChange={handleHandoffDescChange}
              placeholder="描述此 Agent 的职责和交接场景..."
              rows={3}
              autoFocus
            />
          ) : (
            <div className="section-content handoff-desc">
              {handoffDescValue || '暂无描述'}
            </div>
          )}
        </div>

        {tools && tools.length > 0 && (
          <div className="agent-section">
            <div className="section-label">🔧 Tools</div>
            <div className="tools-list">
              {tools.map((tool, index) => (
                <span key={index} className="tool-tag">
                  {tool}
                </span>
              ))}
            </div>
          </div>
        )}

        {handoffs && handoffs.length > 0 && (
          <div className="agent-section">
            <div className="section-label">🔄 Handoffs</div>
            <div className="handoffs-list">
              {handoffs.map((handoff, index) => (
                <span key={index} className="handoff-tag">
                  → {handoff}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 输出连接点 */}
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="agent-handle handle-output"
      />
    </div>
  );
});

AgentNode.displayName = 'AgentNode';

export default AgentNode;

