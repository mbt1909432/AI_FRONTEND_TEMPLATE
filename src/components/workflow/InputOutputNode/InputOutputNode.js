import React, { memo, useState, useCallback, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import './InputOutputNode.css';

// 输入节点
export const InputNode = memo(({ data, isConnectable }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(data.userInput || '');

  // 当 userInput 从外部更新时，同步内部状态
  useEffect(() => {
    setInputValue(data.userInput || '');
  }, [data.userInput]);

  const handleInputChange = useCallback((e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    if (data.onInputChange) {
      data.onInputChange(newValue);
    }
  }, [data]);

  return (
    <div className="io-node input-node">
      <div className="io-node-header">
        <div className="io-icon">📥</div>
        <div className="io-title">输入口</div>
      </div>
      <div className="io-node-body">
        <div className="io-label">用户输入</div>
        <div className="io-description">
          接收用户的初始请求和数据
        </div>
        
        {/* 可编辑的输入框 */}
        <div className="input-editor">
          <textarea
            className="input-textarea"
            placeholder="在此输入您的请求或数据..."
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => setIsEditing(true)}
            onBlur={() => setIsEditing(false)}
            rows={4}
          />
        </div>

        {data.inputType && (
          <div className="io-type">
            <span className="type-badge">{data.inputType}</span>
          </div>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="io-handle output"
      />
    </div>
  );
});

// 输出节点
export const OutputNode = memo(({ data, isConnectable }) => {
  const hasResult = data.result && data.result.length > 0;

  return (
    <div className={`io-node output-node ${hasResult ? 'has-result' : ''}`}>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="io-handle input"
      />
      <div className="io-node-header">
        <div className="io-icon">📤</div>
        <div className="io-title">输出口</div>
      </div>
      <div className="io-node-body">
        <div className="io-label">最终结果</div>
        
        {/* 显示执行结果 */}
        {hasResult ? (
          <div className="output-result">
            <div className="result-status">
              <span className="status-icon">✅</span>
              <span className="status-text">执行完成</span>
            </div>
            <div className="result-content">
              {data.result}
            </div>
          </div>
        ) : (
          <div className="io-description">
            等待工作流执行结果...
          </div>
        )}

        {data.outputType && (
          <div className="io-type">
            <span className="type-badge">{data.outputType}</span>
          </div>
        )}
      </div>
    </div>
  );
});

InputNode.displayName = 'InputNode';
OutputNode.displayName = 'OutputNode';

