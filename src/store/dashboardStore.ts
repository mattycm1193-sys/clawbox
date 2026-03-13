import { create } from 'zustand';
import type { Agent, Message, ToolCall, MemoryChunk, SystemStatus } from '@/types';
import {
  MOCK_AGENTS,
  MOCK_MESSAGES,
  MOCK_TOOL_CALLS,
  MOCK_MEMORIES,
  MOCK_SYSTEM_STATUS,
} from '@/data/mockData';

interface PendingToolApproval {
  toolCallId: string;
  toolName: string;
  args: Record<string, unknown>;
}

interface DashboardState {
  // Agents
  agents: Agent[];
  activeAgentId: string;

  // Messages
  messages: Message[];
  isAgentThinking: boolean;

  // Tool calls
  toolCalls: ToolCall[];
  pendingApproval: PendingToolApproval | null;

  // Memory
  memories: MemoryChunk[];

  // System
  systemStatus: SystemStatus;
  rightPanelTab: 'tools' | 'memory' | 'stats';
  rightPanelOpen: boolean;
  inputValue: string;
  selectedModel: string;

  // Actions
  setActiveAgent: (id: string) => void;
  sendMessage: (content: string) => void;
  approveTool: (approved: boolean) => void;
  setRightPanelTab: (tab: 'tools' | 'memory' | 'stats') => void;
  setRightPanelOpen: (open: boolean) => void;
  setInputValue: (value: string) => void;
  setSelectedModel: (model: string) => void;
  dismissApproval: () => void;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  agents: MOCK_AGENTS,
  activeAgentId: MOCK_AGENTS[0].id,
  messages: MOCK_MESSAGES,
  isAgentThinking: false,
  toolCalls: MOCK_TOOL_CALLS,
  pendingApproval: {
    toolCallId: 'tc3',
    toolName: 'execute_terminal',
    args: { command: 'Get-ChildItem i:/GravityClaw -Recurse' },
  },
  memories: MOCK_MEMORIES,
  systemStatus: MOCK_SYSTEM_STATUS,
  rightPanelTab: 'tools',
  rightPanelOpen: true,
  inputValue: '',
  selectedModel: 'gemini-2.5-pro',

  setActiveAgent: (id) => set({ activeAgentId: id }),

  sendMessage: (content) => {
    const userMsg: Message = {
      id: `m-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date(),
    };
    set((s) => ({
      messages: [...s.messages, userMsg],
      isAgentThinking: true,
      inputValue: '',
    }));

    // Simulate agent thinking and response
    setTimeout(() => {
      const thinkingMsg: Message = {
        id: `m-${Date.now()}-think`,
        role: 'agent',
        content: '💭 [THINKING] Querying Neural Core...',
        timestamp: new Date(),
      };
      set((s) => ({ messages: [...s.messages, thinkingMsg] }));
    }, 500);

    setTimeout(() => {
      const toolMsg: Message = {
        id: `m-${Date.now()}-tool`,
        role: 'tool',
        content: 'Requesting permission to use tool: query_workspace',
        timestamp: new Date(),
        toolName: 'query_workspace',
        toolArgs: { query: content },
      };
      const newToolCall: ToolCall = {
        id: `tc-${Date.now()}`,
        name: 'query_workspace',
        args: { query: content },
        status: 'pending',
        timestamp: new Date(),
      };
      set((s) => ({
        messages: [...s.messages, toolMsg],
        toolCalls: [newToolCall, ...s.toolCalls],
        pendingApproval: {
          toolCallId: newToolCall.id,
          toolName: 'query_workspace',
          args: { query: content },
        },
        isAgentThinking: false,
      }));
    }, 1800);
  },

  approveTool: (approved) => {
    const { pendingApproval } = get();
    if (!pendingApproval) return;

    set((s) => ({
      toolCalls: s.toolCalls.map((tc) =>
        tc.id === pendingApproval.toolCallId
          ? { ...tc, status: approved ? 'executing' : 'denied' }
          : tc
      ),
      pendingApproval: null,
    }));

    if (approved) {
      setTimeout(() => {
        const tcId = pendingApproval.toolCallId;
        const agentResponseMsg: Message = {
          id: `m-${Date.now()}-resp`,
          role: 'agent',
          content: `✅ Tool \`${pendingApproval.toolName}\` executed successfully. Processing results and synthesizing response...`,
          timestamp: new Date(),
        };
        set((s) => ({
          toolCalls: s.toolCalls.map((tc) =>
            tc.id === tcId
              ? { ...tc, status: 'complete', result: 'Execution successful.', duration: 890 }
              : tc
          ),
          messages: [...s.messages, agentResponseMsg],
        }));
      }, 1500);
    }
  },

  dismissApproval: () => set({ pendingApproval: null }),
  setRightPanelTab: (tab) => set({ rightPanelTab: tab }),
  setRightPanelOpen: (open) => set({ rightPanelOpen: open }),
  setInputValue: (value) => set({ inputValue: value }),
  setSelectedModel: (model) => set({ selectedModel: model }),
}));
