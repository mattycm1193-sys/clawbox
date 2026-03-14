import { create } from 'zustand';
import type { Agent, Message, ToolCall, MemoryChunk, SystemStatus } from '@/types';
import { MOCK_AGENTS } from '@/data/mockData';

interface PendingToolApproval {
  toolCallId: string;
  toolName: string;
  args: Record<string, unknown>;
}

type WsSendFn = (data: object) => void;

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
  wsConnected: boolean;
  _wsSend: WsSendFn | null;
  _hasConnectedBefore: boolean;

  // UI state
  rightPanelTab: 'tools' | 'memory' | 'stats';
  rightPanelOpen: boolean;
  inputValue: string;
  selectedModel: string;
  toolCount: number;

  // Public actions
  setActiveAgent: (id: string) => void;
  sendMessage: (content: string) => void;
  approveTool: (approved: boolean) => void;
  dismissApproval: () => void;
  setRightPanelTab: (tab: 'tools' | 'memory' | 'stats') => void;
  setRightPanelOpen: (open: boolean) => void;
  setInputValue: (value: string) => void;
  setSelectedModel: (model: string) => void;

  // WS integration (called by useGravityClawWS)
  setWsConnected: (connected: boolean, sendFn: WsSendFn | null) => void;
  _inboundMessage: (msg: Message) => void;
  _setThinking: (thinking: boolean) => void;
  _inboundToolRequest: (id: string, name: string, args: Record<string, unknown>, timestamp: Date) => void;
  _inboundToolResult: (id: string, result: string, status: 'complete' | 'error', duration: number) => void;
  _inboundStatus: (status: SystemStatus) => void;
  _inboundMemories: (memories: MemoryChunk[]) => void;
}

const INITIAL_STATUS: SystemStatus = {
  mcpRouter: false,
  supabase: false,
  sequentialThinking: false,
  toolsAvailable: 0,
};

const CONNECTING_MESSAGE: Message = {
  id: 'boot-connect',
  role: 'system',
  content: '⚡ [CLAWBOX] Connecting to GravityClaw agent server...',
  timestamp: new Date(),
};

export const useDashboardStore = create<DashboardState>((set, get) => ({
  agents: MOCK_AGENTS,
  activeAgentId: MOCK_AGENTS[0]!.id,
  messages: [CONNECTING_MESSAGE],
  isAgentThinking: false,
  toolCalls: [],
  pendingApproval: null,
  memories: [],
  systemStatus: INITIAL_STATUS,
  wsConnected: false,
  _wsSend: null,
  _hasConnectedBefore: false,
  rightPanelTab: 'tools',
  rightPanelOpen: true,
  inputValue: '',
  selectedModel: 'gemini-2.5-pro',
  toolCount: 0,

  setActiveAgent: (id) => set({ activeAgentId: id }),

  sendMessage: (content) => {
    const { _wsSend, selectedModel } = get();

    const userMsg: Message = {
      id: `m-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date(),
    };

    set((s) => ({ messages: [...s.messages, userMsg], inputValue: '' }));

    if (_wsSend) {
      _wsSend({ type: 'user_message', content, model: selectedModel });
    } else {
      set((s) => ({
        messages: [
          ...s.messages,
          {
            id: `m-offline-${Date.now()}`,
            role: 'system' as const,
            content: '⚠️ [OFFLINE] Agent server is not running. Start: npm run start:bridge',
            timestamp: new Date(),
          },
        ],
      }));
    }
  },

  approveTool: (approved) => {
    const { pendingApproval, _wsSend } = get();
    if (!pendingApproval) return;

    set((s) => ({
      toolCalls: s.toolCalls.map((tc) =>
        tc.id === pendingApproval.toolCallId
          ? { ...tc, status: approved ? ('executing' as const) : ('denied' as const) }
          : tc,
      ),
      pendingApproval: null,
    }));

    if (_wsSend) {
      _wsSend({ type: 'tool_approval', id: pendingApproval.toolCallId, approved });
    }
  },

  dismissApproval: () => set({ pendingApproval: null }),
  setRightPanelTab: (tab) => set({ rightPanelTab: tab }),
  setRightPanelOpen: (open) => set({ rightPanelOpen: open }),
  setInputValue: (value) => set({ inputValue: value }),
  setSelectedModel: (model) => set({ selectedModel: model }),

  setWsConnected: (connected, sendFn) => {
    const { _hasConnectedBefore } = get();

    if (connected && !_hasConnectedBefore) {
      // First connection — boot messages will come from agent
      set({ wsConnected: true, _wsSend: sendFn, _hasConnectedBefore: true });
    } else if (connected && _hasConnectedBefore) {
      // Reconnected
      set((s) => ({
        wsConnected: true,
        _wsSend: sendFn,
        messages: [
          ...s.messages,
          {
            id: `ws-rc-${Date.now()}`,
            role: 'system' as const,
            content: '🔌 [WS_BRIDGE] Reconnected. Rebooting agent...',
            timestamp: new Date(),
          },
        ],
      }));
    } else {
      // Disconnected
      set((s) => ({
        wsConnected: false,
        _wsSend: null,
        isAgentThinking: false,
        systemStatus: { ...s.systemStatus, mcpRouter: false, supabase: false, sequentialThinking: false },
        messages: [
          ...s.messages,
          {
            id: `ws-dc-${Date.now()}`,
            role: 'system' as const,
            content: '⚠️ [WS_BRIDGE] Connection lost. Reconnecting in 5s...',
            timestamp: new Date(),
          },
        ],
      }));
    }
  },

  _inboundMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),

  _setThinking: (thinking) => set({ isAgentThinking: thinking }),

  _inboundToolRequest: (id, name, args, timestamp) => {
    const newToolCall: ToolCall = { id, name, args, status: 'pending', timestamp };
    set((s) => ({
      toolCalls: [newToolCall, ...s.toolCalls],
      pendingApproval: { toolCallId: id, toolName: name, args },
    }));
  },

  _inboundToolResult: (id, result, status, duration) => {
    set((s) => ({
      toolCalls: s.toolCalls.map((tc) =>
        tc.id === id
          ? {
              ...tc,
              status: status === 'complete' ? ('complete' as const) : ('error' as const),
              result,
              duration,
            }
          : tc,
      ),
      // Clear pending approval if this is the pending tool
      pendingApproval: s.pendingApproval?.toolCallId === id ? null : s.pendingApproval,
    }));
  },

  _inboundStatus: (status) => set({ systemStatus: status, toolCount: status.toolsAvailable }),

  _inboundMemories: (memories) => set({ memories }),
}));
