export type AgentStatus = 'online' | 'thinking' | 'idle' | 'offline';
export type MessageRole = 'user' | 'agent' | 'system' | 'tool';
export type ToolCallStatus = 'pending' | 'approved' | 'denied' | 'executing' | 'complete' | 'error';

export interface Agent {
  id: string;
  name: string;
  model: string;
  status: AgentStatus;
  toolCount: number;
  memoryCount: number;
  avatar: string;
}

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  toolName?: string;
  toolArgs?: Record<string, unknown>;
  isStreaming?: boolean;
}

export interface ToolCall {
  id: string;
  name: string;
  args: Record<string, unknown>;
  status: ToolCallStatus;
  result?: string;
  timestamp: Date;
  duration?: number;
}

export interface MemoryChunk {
  id: string;
  content: string;
  similarity: number;
  timestamp: Date;
  synced: boolean;
}

export interface SystemStatus {
  mcpRouter: boolean;
  supabase: boolean;
  sequentialThinking: boolean;
  toolsAvailable: number;
}

export interface StatsDataPoint {
  time: string;
  toolCalls: number;
  tokens: number;
}
