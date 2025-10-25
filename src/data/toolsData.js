// Agent 工具库数据
export const toolsData = [
  {
    id: 'read',
    name: 'Read',
    category: 'file',
    description: '读取文件内容，支持代码、图片、PDF等',
    parameters: [
      { name: 'file_path', required: true, type: 'string', description: '绝对路径' },
      { name: 'offset', required: false, type: 'number', description: '起始行号' },
      { name: 'limit', required: false, type: 'number', description: '读取行数' }
    ],
    output: '带行号的文件内容\n图片会显示视觉内容\n空文件显示警告',
    example: {
      code: 'Read("/home/user/app.js")',
      result: '显示JavaScript代码内容'
    },
    icon: '📄',
    color: '#3b82f6'
  },
  {
    id: 'write',
    name: 'Write',
    category: 'file',
    description: '创建或覆写文件',
    parameters: [
      { name: 'file_path', required: true, type: 'string', description: '绝对路径' },
      { name: 'content', required: true, type: 'string', description: '文件内容' }
    ],
    output: '确认文件已创建/覆写',
    example: {
      code: 'Write("/tmp/config.json", "{\\"port\\": 3000}")',
      result: '创建配置文件'
    },
    icon: '✏️',
    color: '#10b981'
  },
  {
    id: 'edit',
    name: 'Edit',
    category: 'file',
    description: '精确替换文件中的文本',
    parameters: [
      { name: 'file_path', required: true, type: 'string', description: '绝对路径' },
      { name: 'old_string', required: true, type: 'string', description: '原文本' },
      { name: 'new_string', required: true, type: 'string', description: '新文本' },
      { name: 'replace_all', required: false, type: 'boolean', description: '替换所有' }
    ],
    output: '确认替换完成或错误信息',
    example: {
      code: 'Edit("app.js", "const port = 3000", "const port = 8080")',
      result: '修改端口配置'
    },
    icon: '🔧',
    color: '#f59e0b'
  },
  {
    id: 'glob',
    name: 'Glob',
    category: 'search',
    description: '文件模式匹配查找',
    parameters: [
      { name: 'pattern', required: true, type: 'string', description: 'glob模式' },
      { name: 'path', required: false, type: 'string', description: '搜索目录' }
    ],
    output: '按修改时间排序的文件路径列表',
    example: {
      code: 'Glob("**/*.py")',
      result: '查找所有Python文件'
    },
    icon: '🔍',
    color: '#8b5cf6'
  },
  {
    id: 'grep',
    name: 'Grep',
    category: 'search',
    description: '基于ripgrep的文本搜索',
    parameters: [
      { name: 'pattern', required: true, type: 'string', description: '正则表达式' },
      { name: 'output_mode', required: false, type: 'string', description: 'content/files_with_matches/count' },
      { name: 'glob', required: false, type: 'string', description: '文件过滤' },
      { name: '-i', required: false, type: 'boolean', description: '忽略大小写' }
    ],
    output: '匹配的行内容、文件路径或计数',
    example: {
      code: 'Grep("function.*User", output_mode="content")',
      result: '搜索用户相关函数'
    },
    icon: '🔎',
    color: '#6366f1'
  },
  {
    id: 'bash',
    name: 'Bash',
    category: 'system',
    description: '执行shell命令',
    parameters: [
      { name: 'command', required: true, type: 'string', description: '命令' },
      { name: 'description', required: false, type: 'string', description: '描述' },
      { name: 'timeout', required: false, type: 'number', description: '超时时间' },
      { name: 'run_in_background', required: false, type: 'boolean', description: '后台运行' }
    ],
    output: '命令输出、错误信息、退出码',
    example: {
      code: 'Bash("npm test")',
      result: '运行测试并显示结果'
    },
    icon: '⚡',
    color: '#14b8a6'
  },
  {
    id: 'webfetch',
    name: 'WebFetch',
    category: 'web',
    description: '获取并处理网页内容',
    parameters: [
      { name: 'url', required: true, type: 'string', description: '网址' },
      { name: 'prompt', required: true, type: 'string', description: '处理提示' }
    ],
    output: 'AI处理后的内容摘要',
    example: {
      code: 'WebFetch("https://docs.react.dev", "Extract installation steps")',
      result: 'React安装指南'
    },
    icon: '🌐',
    color: '#ec4899'
  },
  {
    id: 'websearch',
    name: 'WebSearch',
    category: 'web',
    description: '搜索最新网络信息',
    parameters: [
      { name: 'query', required: true, type: 'string', description: '搜索词' },
      { name: 'allowed_domains', required: false, type: 'array', description: '允许域名' },
      { name: 'blocked_domains', required: false, type: 'array', description: '屏蔽域名' }
    ],
    output: '格式化的搜索结果',
    example: {
      code: 'WebSearch("Next.js 14 new features")',
      result: '最新Next.js功能介绍'
    },
    icon: '🔍',
    color: '#f43f5e'
  }
];

// 工具分类
export const toolCategories = [
  { id: 'all', name: '全部工具', icon: '📦' },
  { id: 'file', name: '文件操作', icon: '📁' },
  { id: 'search', name: '搜索查找', icon: '🔍' },
  { id: 'system', name: '系统命令', icon: '⚡' },
  { id: 'web', name: '网络请求', icon: '🌐' }
];

// 根据分类获取工具
export const getToolsByCategory = (category) => {
  if (category === 'all') return toolsData;
  return toolsData.filter(tool => tool.category === category);
};

// 根据ID获取工具
export const getToolById = (id) => {
  return toolsData.find(tool => tool.id === id);
};

// 搜索工具
export const searchTools = (query) => {
  const lowerQuery = query.toLowerCase();
  return toolsData.filter(tool => 
    tool.name.toLowerCase().includes(lowerQuery) ||
    tool.description.toLowerCase().includes(lowerQuery) ||
    tool.parameters.some(p => p.name.toLowerCase().includes(lowerQuery))
  );
};

