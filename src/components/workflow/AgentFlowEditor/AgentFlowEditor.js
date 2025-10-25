import React, { useState, useCallback, useRef, useEffect } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import AgentNode from '../AgentNode';
import { InputNode, OutputNode } from '../InputOutputNode';
import { getToolById } from '../../../data/toolsData';
import './AgentFlowEditor.css';

const nodeTypes = {
  agentNode: AgentNode,
  inputNode: InputNode,
  outputNode: OutputNode,
};

const AgentFlowEditor = ({ 
  isCollapsed, 
  onToggle, 
  isOpen = false, 
  sessionName = '新对话',
  workflowConfig = null,
  onWorkflowConfigChange
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [agentInstructions, setAgentInstructions] = useState({});
  const [agentHandoffDescs, setAgentHandoffDescs] = useState({});
  const [agentTools, setAgentTools] = useState({});
  const fileInputRef = useRef(null);
  const [currentSessionName, setCurrentSessionName] = useState(sessionName);
  const isInitialMount = useRef(true); // 跟踪是否是首次挂载

  // ============ 定义所有回调函数 ============
  
  // 处理输入节点数据变化
  const handleInputChange = useCallback((value) => {
    setUserInput(value);
  }, []);

  // 处理 Agent Instructions 变化
  const handleInstructionsChange = useCallback((agentName, newInstructions) => {
    setAgentInstructions(prev => ({
      ...prev,
      [agentName]: newInstructions
    }));
  }, []);

  // 处理 Agent Handoff Description 变化
  const handleHandoffDescChange = useCallback((agentName, newHandoffDesc) => {
    setAgentHandoffDescs(prev => ({
      ...prev,
      [agentName]: newHandoffDesc
    }));
  }, []);

  // 处理 Agent 工具选择变化
  const handleToolsChange = useCallback((agentName, newTools) => {
    setAgentTools(prev => ({
      ...prev,
      [agentName]: newTools
    }));
    
    // 同时更新节点的 data.tools
    setNodes((nds) =>
      nds.map((node) => {
        if (node.data && node.data.name === agentName) {
          return {
            ...node,
            data: {
              ...node.data,
              tools: newTools
            }
          };
        }
        return node;
      })
    );
  }, [setNodes]);

  // 连接节点时的回调
  const onConnect = useCallback(
    (params) =>
      setEdges((eds) => {
        let newEdges = [...eds];

        // 限制输入节点只能连接一条线
        if (params.source === 'input-node') {
          // 删除所有从 input-node 出发的旧连线
          newEdges = newEdges.filter((edge) => edge.source !== 'input-node');
        }

        // 限制输出节点只能连接一条线
        if (params.target === 'output-node') {
          // 删除所有连到 output-node 的旧连线
          newEdges = newEdges.filter((edge) => edge.target !== 'output-node');
        }

        // 添加新连线
        return addEdge(
          {
            ...params,
            type: 'smoothstep',
            animated: true,
            style: { stroke: '#8b5cf6', strokeWidth: 2 },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: '#8b5cf6',
            },
          },
          newEdges
        );
      }),
    [setEdges]
  );

  // 根据 agent 名称判断类型
  const getAgentType = (name) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('extraction') || lowerName.includes('extract')) return 'extraction';
    if (lowerName.includes('calculation') || lowerName.includes('calculate')) return 'calculation';
    if (lowerName.includes('report') || lowerName.includes('generation')) return 'report';
    return 'default';
  };

  // 从 JSON 配置生成节点和边
  const generateFlowFromJSON = useCallback((config) => {
    // 检查配置格式
    const isSimplifiedFormat = config.nodes && config.edges;
    
    // 如果是简化格式（从 session 恢复）
    if (isSimplifiedFormat) {
      // 恢复节点和边
      const restoredNodes = config.nodes.map(node => {
        // 重新绑定回调函数
        if (node.type === 'inputNode') {
          return {
            ...node,
            data: {
              ...node.data,
              onInputChange: handleInputChange,
            }
          };
        } else if (node.type === 'agentNode') {
          return {
            ...node,
            data: {
              ...node.data,
              onInstructionsChange: handleInstructionsChange,
              onHandoffDescChange: handleHandoffDescChange,
              onToolsChange: handleToolsChange,
            }
          };
        }
        return node;
      });
      
      setNodes(restoredNodes);
      setEdges(config.edges);
      setUserInput(config.userInput || '');
      setAgentInstructions(config.agentInstructions || {});
      setAgentHandoffDescs(config.agentHandoffDescs || {});
      setAgentTools(config.agentTools || {});
      return;
    }

    // 标准格式（从 JSON 文件导入）
    const { starter_agent, agents } = config;
    const newNodes = [];
    const newEdges = [];

    // 清空之前的状态
    setUserInput('');
    setAgentInstructions({});
    setAgentHandoffDescs({});
    setAgentTools({});

    // 添加输入节点
    const inputNode = {
      id: 'input-node',
      type: 'inputNode',
      position: { x: 400, y: 50 },
      data: {
        inputType: 'Text/JSON',
        userInput: '',
        onInputChange: handleInputChange,
      },
    };
    newNodes.push(inputNode);

    // 为每个 agent 创建节点
    agents.forEach((agent, index) => {
      const isStarter = agent.name === starter_agent;

      // 过滤掉不存在的工具
      const validTools = (agent.tools || []).filter(toolId => getToolById(toolId) !== undefined);

      const node = {
        id: agent.name,
        type: 'agentNode',
        position: {
          x: 100 + (index % 3) * 380,
          y: 250 + Math.floor(index / 3) * 400,
        },
        data: {
          name: agent.name,
          instructions: agent.instructions,
          handoff_description: agent.handoff_description,
          tools: validTools,
          handoffs: agent.handoffs || [],
          isStarter: isStarter,
          type: getAgentType(agent.name),
          onInstructionsChange: handleInstructionsChange,
          onHandoffDescChange: handleHandoffDescChange,
          onToolsChange: handleToolsChange,
        },
      };
      newNodes.push(node);

      // 连接输入节点到起始 Agent
      if (isStarter) {
        newEdges.push({
          id: `input-${agent.name}`,
          source: 'input-node',
          target: agent.name,
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#3b82f6', strokeWidth: 2 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#3b82f6',
          },
        });
      }

      // 创建交接连接
      if (agent.handoffs && agent.handoffs.length > 0) {
        agent.handoffs.forEach((handoffTarget) => {
          newEdges.push({
            id: `${agent.name}-${handoffTarget}`,
            source: agent.name,
            target: handoffTarget,
            type: 'smoothstep',
            animated: true,
            style: { stroke: '#8b5cf6', strokeWidth: 2 },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: '#8b5cf6',
            },
          });
        });
      }
    });

    // 添加输出节点
    const outputNode = {
      id: 'output-node',
      type: 'outputNode',
      position: { x: 400, y: 250 + Math.ceil(agents.length / 3) * 400 },
      data: {
        outputType: 'Structured Result',
        result: '',
      },
    };
    newNodes.push(outputNode);

    // 找到没有 handoffs 的节点（终点节点），连接到输出节点
    agents.forEach((agent) => {
      if (!agent.handoffs || agent.handoffs.length === 0) {
        newEdges.push({
          id: `${agent.name}-output`,
          source: agent.name,
          target: 'output-node',
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#10b981', strokeWidth: 2 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#10b981',
          },
        });
      }
    });

    // 初始化所有 Agent 的 instructions、handoff_description 和 tools
    const initialInstructions = {};
    const initialHandoffDescs = {};
    const initialAgentTools = {};
    agents.forEach((agent) => {
      initialInstructions[agent.name] = agent.instructions;
      initialHandoffDescs[agent.name] = agent.handoff_description || '';
      
      // 过滤掉不存在的工具
      const validTools = (agent.tools || []).filter(toolId => getToolById(toolId) !== undefined);
      initialAgentTools[agent.name] = validTools;
    });
    setAgentInstructions(initialInstructions);
    setAgentHandoffDescs(initialHandoffDescs);
    setAgentTools(initialAgentTools);

    setNodes(newNodes);
    setEdges(newEdges);
    
    // 保存到 session（如果提供了回调）
    if (onWorkflowConfigChange) {
      onWorkflowConfigChange(config);
    }
  }, [setNodes, setEdges, handleInputChange, handleInstructionsChange, handleHandoffDescChange, handleToolsChange, setUserInput, setAgentInstructions, setAgentHandoffDescs, onWorkflowConfigChange]);

  // ============ useEffect 区域 ============

  // 监听 sessionName 变化（包括初始加载和切换）
  useEffect(() => {
    // 检测是否是首次加载或 session 切换
    const isSessionChanged = sessionName !== currentSessionName;
    
    if (isSessionChanged) {
      console.log(`Session 变化: "${currentSessionName}" -> "${sessionName}"`);
      setCurrentSessionName(sessionName);
      
      // 标记为初始挂载，避免在恢复配置时触发自动保存
      isInitialMount.current = true;
      
      // 清空当前工作流状态
      setNodes([]);
      setEdges([]);
      setUserInput('');
      setAgentInstructions({});
      setAgentHandoffDescs({});
      setAgentTools({});
      setRunResult(null);
      
      // 延迟一帧，确保状态已经清空
      requestAnimationFrame(() => {
        // 如果有保存的工作流配置，恢复它
        if (workflowConfig) {
          console.log(`恢复 "${sessionName}" 的工作流配置`, workflowConfig);
          generateFlowFromJSON(workflowConfig);
        } else {
          console.log(`"${sessionName}" 没有工作流配置`);
        }
      });
    }
  }, [sessionName, currentSessionName, workflowConfig, generateFlowFromJSON, setNodes, setEdges]);

  // 监听 edges 变化，动态更新节点的 handoffs 显示
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        // 只更新 Agent 节点
        if (node.type === 'agentNode') {
          // 从 edges 中找出当前节点连接到的所有 Agent 节点
          const handoffs = edges
            .filter((edge) => edge.source === node.id)
            .map((edge) => edge.target)
            .filter((targetId) => {
              // 排除 input 和 output 节点
              return targetId !== 'input-node' && targetId !== 'output-node';
            });

          // 更新节点的 handoffs 数据
          return {
            ...node,
            data: {
              ...node.data,
              handoffs: handoffs,
            },
          };
        }
        return node;
      })
    );
  }, [edges, setNodes]);

  // 自动保存工作流状态到 Session（当节点或边变化时）
  useEffect(() => {
    // 跳过首次挂载时的保存（避免覆盖正在恢复的配置）
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // 延迟保存，避免频繁触发
    if (onWorkflowConfigChange) {
      const timer = setTimeout(() => {
        try {
          // 构建简化的配置对象（允许保存空配置）
          const config = {
            nodes: nodes.map(node => ({
              id: node.id,
              type: node.type,
              position: node.position,
              data: node.data
            })),
            edges: edges,
            agentInstructions,
            agentHandoffDescs,
            agentTools,
            userInput
          };
          console.log(`自动保存工作流 (${nodes.length} 个节点):`, config);
          onWorkflowConfigChange(config);
        } catch (error) {
          console.error('Failed to save workflow config:', error);
        }
      }, 500); // 减少到 0.5 秒，提升响应速度

      return () => clearTimeout(timer);
    }
  }, [nodes, edges, agentInstructions, agentHandoffDescs, agentTools, userInput, onWorkflowConfigChange]);

  // ============ 其他回调函数 ============

  // 导入 JSON 文件
  const handleFileUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const config = JSON.parse(e.target.result);
        generateFlowFromJSON(config);
      } catch (error) {
        alert('JSON 解析失败: ' + error.message);
      }
    };
    reader.readAsText(file);
  }, [generateFlowFromJSON]);

  // 处理拖拽上传
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files[0];
    if (!file || !file.name.endsWith('.json')) {
      alert('请上传 JSON 文件');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const config = JSON.parse(event.target.result);
        generateFlowFromJSON(config);
      } catch (error) {
        alert('JSON 解析失败: ' + error.message);
      }
    };
    reader.readAsText(file);
  }, [generateFlowFromJSON]);

  // 导出 JSON 配置
  const handleExportJSON = useCallback(() => {
    if (nodes.length === 0) {
      alert('当前没有工作流配置可导出');
      return;
    }

    // 从当前的 nodes 和 edges 重新构建 JSON 配置
    // 1. 获取所有 Agent 节点（排除 input 和 output）
    const agentNodes = nodes.filter(
      (node) => node.type !== 'inputNode' && node.type !== 'outputNode'
    );

    if (agentNodes.length === 0) {
      alert('当前没有 Agent 节点可导出');
      return;
    }

    // 2. 根据 edges 重新构建每个 agent 的 handoffs
    const agentHandoffsMap = {};
    agentNodes.forEach((node) => {
      agentHandoffsMap[node.id] = [];
    });

    edges.forEach((edge) => {
      // 只处理 agent 之间的连线（排除 input 和 output 的连线）
      if (
        agentHandoffsMap.hasOwnProperty(edge.source) &&
        agentHandoffsMap.hasOwnProperty(edge.target)
      ) {
        agentHandoffsMap[edge.source].push(edge.target);
      }
    });

    // 3. 确定 starter_agent (从 input-node 连出的第一个 agent)
    let starterAgent = null;
    const inputEdge = edges.find((edge) => edge.source === 'input-node');
    if (inputEdge) {
      starterAgent = inputEdge.target;
    } else {
      // 如果没有从 input 连出的边，使用第一个有 isStarter 标记的 agent
      const starterNode = agentNodes.find((node) => node.data.isStarter);
      starterAgent = starterNode ? starterNode.id : agentNodes[0].id;
    }

    // 4. 构建 agents 数组
    const exportedAgents = agentNodes.map((node) => {
      const { name, type, output_parameters } = node.data;
      
      return {
        name: name,
        instructions: agentInstructions[name] || node.data.instructions || '',
        handoff_description: agentHandoffDescs[name] || node.data.handoff_description || '',
        tools: agentTools[name] || node.data.tools || [],
        handoffs: agentHandoffsMap[node.id] || [],
        output_parameters: output_parameters || null,
      };
    });

    // 5. 构建最终的配置对象
    const updatedConfig = {
      starter_agent: starterAgent,
      agents: exportedAgents,
    };

    const jsonString = JSON.stringify(updatedConfig, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `agent-workflow-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // 提示用户
    alert(`✅ 配置已导出！\n包含 ${exportedAgents.length} 个 Agent 节点和实际的连线关系。`);
  }, [nodes, edges, agentInstructions, agentHandoffDescs, agentTools]);

  // 运行工作流
  const handleRunWorkflow = useCallback(async () => {
    // 检查是否有节点
    if (nodes.length === 0) {
      alert('请先加载或创建工作流配置');
      return;
    }

    if (!userInput || userInput.trim() === '') {
      alert('请在输入节点中填写内容');
      return;
    }

    setIsRunning(true);
    setRunResult(null);

    // 清空输出节点
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === 'output-node') {
          return {
            ...node,
            data: { ...node.data, result: '' },
          };
        }
        return node;
      })
    );

    // 模拟工作流执行
    setTimeout(() => {
      // 构建执行结果
      const agentSteps = workflowConfig.agents.map((agent) => {
        const currentInstructions = agentInstructions[agent.name] || agent.instructions;
        const currentHandoffDesc = agentHandoffDescs[agent.name] || agent.handoff_description;
        return {
          agent: agent.name,
          instructions: currentInstructions,
          handoff_description: currentHandoffDesc,
          tools: agent.tools || [],
          status: 'completed',
        };
      });

      const finalOutput = `
【工作流执行结果】

用户输入: ${userInput}

执行流程:
${agentSteps.map((step, idx) => `
${idx + 1}. ${step.agent}
   职责: ${step.handoff_description || '无描述'}
   指令: ${step.instructions}
   工具: ${step.tools.length > 0 ? step.tools.join(', ') : '无'}
   状态: ✅ 完成
`).join('')}

最终结果: 根据上述 Agent 协作流程，已成功处理用户请求。所有任务已按照工作流配置执行完成。
      `.trim();

      // 更新输出节点
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === 'output-node') {
            return {
              ...node,
              data: { ...node.data, result: finalOutput },
            };
          }
          return node;
        })
      );

      const result = {
        status: 'success',
        timestamp: new Date().toISOString(),
        workflow: workflowConfig.starter_agent,
        steps: agentSteps,
        finalOutput: finalOutput,
      };

      setRunResult(result);
      setIsRunning(false);

      // 动画效果：高亮执行路径
      const animateEdges = edges.map((edge) => ({
        ...edge,
        animated: true,
        style: { ...edge.style, strokeWidth: 3 },
      }));
      setEdges(animateEdges);

      // 3秒后恢复
      setTimeout(() => {
        const normalEdges = edges.map((edge) => ({
          ...edge,
          style: { ...edge.style, strokeWidth: 2 },
        }));
        setEdges(normalEdges);
      }, 3000);
    }, 2000);
  }, [workflowConfig, userInput, agentInstructions, agentHandoffDescs, edges, setEdges, setNodes]);

  // 添加新的 Agent 节点
  const addNewAgent = useCallback(() => {
    // 生成唯一的 Agent 名称
    const existingAgents = nodes.filter(
      (node) => node.type !== 'inputNode' && node.type !== 'outputNode'
    );
    const newAgentNumber = existingAgents.length + 1;
    const newAgentName = `NewAgent${newAgentNumber}`;

    // 计算新节点的位置（避免重叠）
    const baseX = 400;
    const baseY = 200;
    const offsetX = (newAgentNumber - 1) * 100;
    const offsetY = (newAgentNumber - 1) * 100;

    // 创建新节点（基于模板）
    const newNode = {
      id: newAgentName,
      type: 'agentNode',
      position: { x: baseX + offsetX, y: baseY + offsetY },
      data: {
        name: newAgentName,
        instructions: '在这里填写 Agent 的指令...',
        handoff_description: '描述此 Agent 的职责...',
        type: 'default',
        tools: [],
        handoffs: [],
        output_parameters: null,
        isStarter: false,
        onInstructionsChange: handleInstructionsChange,
        onHandoffDescChange: handleHandoffDescChange,
        onToolsChange: handleToolsChange,
      },
    };

    // 添加到画布
    setNodes((nds) => [...nds, newNode]);

    // 初始化状态
    setAgentInstructions((prev) => ({
      ...prev,
      [newAgentName]: '在这里填写 Agent 的指令...',
    }));
    setAgentHandoffDescs((prev) => ({
      ...prev,
      [newAgentName]: '描述此 Agent 的职责...',
    }));

    alert(`✅ 已添加新 Agent: ${newAgentName}\n\n可以通过编辑按钮修改 Instructions 和 Handoff Description`);
  }, [nodes, setNodes, handleInstructionsChange, handleHandoffDescChange]);

  // 加载示例配置
  const loadExampleConfig = useCallback(() => {
    const exampleConfig = {
      "starter_agent": "TriageAgent",
      "agents": [
        {
          "name": "TriageAgent",
          "instructions": "你是智能分流助手，分析用户需求并转发给对应的专家。",
          "handoff_description": "处理所有用户初始请求，并识别需求（数据提取、计算分析或结果总结）",
          "tools": [],
          "handoffs": ["DataExtractionAgent", "DataCalculationAgent", "ReportGenerationAgent"],
          "output_parameters": null
        },
        {
          "name": "DataExtractionAgent",
          "instructions": "你是数据提取专家，负责从文本中识别和提取关键数据。",
          "handoff_description": "负责从文本中提取关键数据",
          "tools": ["text_analysis"],
          "handoffs": ["DataCalculationAgent"],
          "output_parameters": { "extracted_data": "文本中提取的关键数据" }
        },
        {
          "name": "DataCalculationAgent",
          "instructions": "你是数据计算专家，使用数学计算工具进行数据分析。",
          "handoff_description": "接收提取的数据并进行计算分析",
          "tools": ["calculate"],
          "handoffs": ["ReportGenerationAgent"],
          "output_parameters": { "calculated_results": "数据计算结果" }
        },
        {
          "name": "ReportGenerationAgent",
          "instructions": "你是报告生成专家，负责总结分析结果并生成详细的报告。",
          "handoff_description": "负责生成分析报告",
          "tools": ["report_builder"],
          "handoffs": [],
          "output_parameters": { "analysis_report": "完整的分析报告" }
        }
      ]
    };
    generateFlowFromJSON(exampleConfig);
  }, [generateFlowFromJSON]);

  if (isCollapsed) {
    return (
      <div className={`agent-flow-editor collapsed ${isOpen ? 'open' : ''}`}>
        <button className="panel-toggle" onClick={onToggle} title="展开工作流">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
      </div>
    );
  }

  return (
    <aside className={`agent-flow-editor ${isOpen ? 'open' : ''}`}>
      <div className="panel-header">
        <div className="panel-title">
          <span className="panel-icon">🎨</span>
          <h3>{sessionName}的工作流编排</h3>
        </div>
        <button className="panel-toggle" onClick={onToggle} title="收起">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      </div>

      <div className="toolbar">
        <button className="toolbar-btn primary" onClick={loadExampleConfig} title="加载示例配置">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
          </svg>
          <span>加载示例</span>
        </button>

        <button
          className="toolbar-btn add-agent"
          onClick={addNewAgent}
          title="添加新的 Agent 节点"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="16"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
          <span>添加 Agent</span>
        </button>
        
        <button
          className="toolbar-btn"
          onClick={() => fileInputRef.current?.click()}
          title="上传 JSON 配置"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
          </svg>
          <span>上传</span>
        </button>
        
        <button
          className="toolbar-btn"
          onClick={handleExportJSON}
          disabled={!workflowConfig}
          title="导出 JSON 配置"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
          </svg>
          <span>导出</span>
        </button>

        <button
          className="toolbar-btn run-btn"
          onClick={handleRunWorkflow}
          disabled={!workflowConfig || isRunning}
          title="运行工作流"
        >
          {isRunning ? (
            <>
              <div className="running-spinner"></div>
              <span>运行中...</span>
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
              <span>Run</span>
            </>
          )}
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileUpload}
        style={{ display: 'none' }}
      />

      <div
        className="flow-container"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {nodes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>拖拽 JSON 文件到此处</h3>
            <p>或点击"加载示例"查看效果</p>
            <div className="drop-hint">支持拖拽上传 .json 文件</div>
          </div>
        ) : (
          <>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              fitView
              attributionPosition="bottom-left"
              deleteKeyCode={['Backspace', 'Delete']}
              edgesUpdatable={true}
              edgesFocusable={true}
              nodesDraggable={true}
              nodesConnectable={true}
              elementsSelectable={true}
            >
              <Background color="#4b5563" gap={16} />
              <Controls />
              <MiniMap
                nodeColor={(node) => {
                  if (node.type === 'inputNode') return '#3b82f6';
                  if (node.type === 'outputNode') return '#10b981';
                  if (node.data.isStarter) return '#22c55e';
                  if (node.data.type === 'extraction') return '#3b82f6';
                  if (node.data.type === 'calculation') return '#8b5cf6';
                  if (node.data.type === 'report') return '#f59e0b';
                  return '#6b7280';
                }}
                maskColor="rgba(0, 0, 0, 0.6)"
              />
            </ReactFlow>

            {/* 运行结果面板 */}
            {runResult && (
              <div className="run-result-panel">
                <div className="result-header">
                  <div className="result-icon">✅</div>
                  <div className="result-title">运行成功</div>
                  <button
                    className="close-result"
                    onClick={() => setRunResult(null)}
                  >
                    ×
                  </button>
                </div>
                <div className="result-content">
                  <div className="result-item">
                    <span className="result-label">起始 Agent:</span>
                    <span className="result-value">{runResult.workflow}</span>
                  </div>
                  <div className="result-item">
                    <span className="result-label">执行步骤:</span>
                    <span className="result-value">{runResult.steps.length} 个</span>
                  </div>
                  <div className="result-output">
                    <div className="output-label">最终输出:</div>
                    <div className="output-content">{runResult.finalOutput}</div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </aside>
  );
};

export default AgentFlowEditor;

