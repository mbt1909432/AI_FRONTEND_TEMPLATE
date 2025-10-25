import React, { memo, useState, useCallback, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import ToolSelector from '../ToolSelector';
import { getToolById } from '../../../data/toolsData';
import './AgentNode.css';

const AgentNode = memo(({ data, isConnectable }) => {
  const { name, instructions, handoff_description, tools, handoffs, isStarter, type } = data;
  const [isEditingInstructions, setIsEditingInstructions] = useState(false);
  const [isEditingHandoff, setIsEditingHandoff] = useState(false);
  const [instructionsValue, setInstructionsValue] = useState(instructions || '');
  const [handoffDescValue, setHandoffDescValue] = useState(handoff_description || '');
  const [showToolSelector, setShowToolSelector] = useState(false);
  const [selectedTools, setSelectedTools] = useState(tools || []);

  // 当 instructions 从外部更新时，同步内部状态
  useEffect(() => {
    setInstructionsValue(instructions || '');
  }, [instructions]);

  // 当 handoff_description 从外部更新时，同步内部状态
  useEffect(() => {
    setHandoffDescValue(handoff_description || '');
  }, [handoff_description]);

  // 当 tools 从外部更新时，同步内部状态
  useEffect(() => {
    setSelectedTools(tools || []);
  }, [tools]);

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

  // 处理工具选择变化
  const handleToolsChange = useCallback((newTools) => {
    setSelectedTools(newTools);
    if (data.onToolsChange) {
      data.onToolsChange(name, newTools);
    }
  }, [data, name]);

  // 移除工具
  const handleRemoveTool = useCallback((toolId, e) => {
    e.stopPropagation();
    const newTools = selectedTools.filter(id => id !== toolId);
    handleToolsChange(newTools);
  }, [selectedTools, handleToolsChange]);

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

        {/* 工具选择区域 */}
        <div className="agent-section">
          <div className="section-label">
            🔧 Tools
            <button 
              className="add-tool-btn"
              onClick={() => setShowToolSelector(true)}
              title="添加工具"
            >
              + 添加
            </button>
          </div>
          {(() => {
            // 过滤出存在的工具
            const validTools = selectedTools
              .map((toolId) => ({ toolId, tool: getToolById(toolId) }))
              .filter(({ tool }) => tool !== undefined);
            
            return validTools.length > 0 ? (
              <div className="tools-list">
                {validTools.map(({ toolId, tool }) => (
                  <span 
                    key={toolId} 
                    className="tool-tag"
                    style={{ backgroundColor: tool.color + '20', borderColor: tool.color + '50' }}
                  >
                    <span className="tool-icon-small">{tool.icon}</span>
                    <span className="tool-name-text">{tool.name}</span>
                    <button 
                      className="remove-tool-btn"
                      onClick={(e) => handleRemoveTool(toolId, e)}
                      title="移除工具"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <div className="empty-tools">
                <span className="empty-text">未添加工具</span>
              </div>
            );
          })()}
        </div>

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

      {/* 工具选择器弹窗 */}
      {showToolSelector && (
        <ToolSelector
          selectedTools={selectedTools}
          onToolsChange={handleToolsChange}
          onClose={() => setShowToolSelector(false)}
        />
      )}
    </div>
  );
});

AgentNode.displayName = 'AgentNode';

export default AgentNode;

