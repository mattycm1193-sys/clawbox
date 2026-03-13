import type { Agent, Message, ToolCall, MemoryChunk, SystemStatus, StatsDataPoint } from '@/types';

export const MOCK_AGENTS: Agent[] = [
  {
    id: 'gravityclaw-1',
    name: 'GravityClaw',
    model: 'gemini-2.5-pro',
    status: 'online',
    toolCount: 72,
    memoryCount: 148,
    avatar: 'GC',
  },
  {
    id: 'architect-1',
    name: 'Architect',
    model: 'gemini-2.5-flash',
    status: 'idle',
    toolCount: 12,
    memoryCount: 34,
    avatar: 'AR',
  },
  {
    id: 'researcher-1',
    name: 'Researcher',
    model: 'gemini-2.0-pro',
    status: 'offline',
    toolCount: 8,
    memoryCount: 91,
    avatar: 'RE',
  },
];

export const MOCK_MESSAGES: Message[] = [
  {
    id: 'm1',
    role: 'system',
    content: '🌌 [SYSTEM] GravityClaw Nerve Center Online. Agency Granted.',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
  },
  {
    id: 'm2',
    role: 'system',
    content: '🔌 [MCP_ROUTER] Connected. 72 tools discovered.',
    timestamp: new Date(Date.now() - 5 * 60 * 1000 + 500),
  },
  {
    id: 'm3',
    role: 'system',
    content: '🔄 [SYNC] 3 offline memories pushed to Supabase.',
    timestamp: new Date(Date.now() - 4 * 60 * 1000),
  },
  {
    id: 'm4',
    role: 'user',
    content: 'Analyze the project structure on the I: drive and give me a summary of the current state of GravityClaw.',
    timestamp: new Date(Date.now() - 3 * 60 * 1000),
  },
  {
    id: 'm5',
    role: 'agent',
    content: '💭 [THINKING] Querying Gemini Neural Core...',
    timestamp: new Date(Date.now() - 2 * 60 * 1000 + 100),
  },
  {
    id: 'm6',
    role: 'tool',
    content: 'Requesting permission to use tool: query_workspace',
    timestamp: new Date(Date.now() - 2 * 60 * 1000 + 200),
    toolName: 'query_workspace',
    toolArgs: { query: 'GravityClaw project structure overview' },
  },
  {
    id: 'm7',
    role: 'agent',
    content: `Based on my analysis of the I: drive workspace, here's the current state of GravityClaw:

**Architecture Overview:**
- **Core Engine**: \`gravityclaw.ts\` — The autonomous loop using Gemini 3.1 Pro
- **Tool Layer**: \`hands.ts\` — MCP Router bridge with 72+ available tools
- **Memory System**: Dual-layer (Supabase cloud + LocalHippocampus fallback)
- **Embedding Bridge**: Python \`embedder.py\` via sentence-transformers
- **MCP Core**: Custom server with execute_terminal, read_file, write_file

**Status**: Core loop is functional, backend (C#/.NET 10) is scaffolded but not integrated. The \`clawbox/\` UI is now being bootstrapped.

**Recommendation**: Prioritize the WebSocket bridge between this UI and the Node.js agent loop.`,
    timestamp: new Date(Date.now() - 1 * 60 * 1000),
  },
];

export const MOCK_TOOL_CALLS: ToolCall[] = [
  {
    id: 'tc1',
    name: 'query_workspace',
    args: { query: 'GravityClaw project structure overview' },
    status: 'complete',
    result: 'Found 47 files across 6 directories. Key files: gravityclaw.ts, hands.ts, MemoryController.ts...',
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    duration: 1240,
  },
  {
    id: 'tc2',
    name: 'read_file',
    args: { path: 'i:/GravityClaw/hands.ts' },
    status: 'complete',
    result: '// MCP Client Infrastructure...',
    timestamp: new Date(Date.now() - 90 * 1000),
    duration: 320,
  },
  {
    id: 'tc3',
    name: 'execute_terminal',
    args: { command: 'Get-ChildItem i:/GravityClaw -Recurse' },
    status: 'pending',
    timestamp: new Date(Date.now() - 10 * 1000),
  },
];

export const MOCK_MEMORIES: MemoryChunk[] = [
  {
    id: 'mem1',
    content: 'User: Analyze the project structure | GravityClaw: Found 47 files across 6 directories...',
    similarity: 0.94,
    timestamp: new Date(Date.now() - 60 * 1000),
    synced: true,
  },
  {
    id: 'mem2',
    content: 'User: Fix the MCP router connection | GravityClaw: Updated transport config with MCPR_TOKEN env var.',
    similarity: 0.81,
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
    synced: true,
  },
  {
    id: 'mem3',
    content: 'User: Install sentence-transformers | GravityClaw: Created embedder.py in engine/ folder.',
    similarity: 0.76,
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    synced: false,
  },
];

export const MOCK_SYSTEM_STATUS: SystemStatus = {
  mcpRouter: true,
  supabase: true,
  sequentialThinking: true,
  toolsAvailable: 72,
};

export const MOCK_STATS: StatsDataPoint[] = [
  { time: '00:00', toolCalls: 2, tokens: 1200 },
  { time: '04:00', toolCalls: 0, tokens: 0 },
  { time: '08:00', toolCalls: 8, tokens: 4800 },
  { time: '10:00', toolCalls: 15, tokens: 9200 },
  { time: '12:00', toolCalls: 23, tokens: 14100 },
  { time: '14:00', toolCalls: 11, tokens: 6700 },
  { time: '16:00', toolCalls: 31, tokens: 19800 },
  { time: '18:00', toolCalls: 18, tokens: 11200 },
  { time: '20:00', toolCalls: 9, tokens: 5500 },
  { time: '22:00', toolCalls: 4, tokens: 2400 },
  { time: 'Now', toolCalls: 7, tokens: 4300 },
];
