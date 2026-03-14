import { useEffect, useRef } from 'react';
import { useDashboardStore } from '@/store/dashboardStore';
import type { Message, MemoryChunk } from '@/types';

const WS_URL = 'ws://localhost:8765';
const RECONNECT_DELAY_MS = 5_000;

export function useGravityClawWS() {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;

    function connect() {
      if (!mounted.current) return;

      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        if (!mounted.current) {
          ws.close();
          return;
        }
        useDashboardStore.getState().setWsConnected(true, (data) => {
          if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(data));
        });
      };

      ws.onmessage = (event) => {
        if (!mounted.current) return;

        let msg: any;
        try {
          msg = JSON.parse(event.data as string);
        } catch {
          return;
        }

        const s = useDashboardStore.getState();

        switch (msg.type as string) {
          case 'message': {
            const m: Message = {
              id: msg.id ?? crypto.randomUUID(),
              role: msg.role,
              content: msg.content,
              timestamp: new Date(msg.timestamp ?? Date.now()),
              toolName: msg.toolName,
              toolArgs: msg.toolArgs,
            };
            s._inboundMessage(m);
            break;
          }
          case 'thinking':
            s._setThinking(true);
            break;
          case 'done_thinking':
            s._setThinking(false);
            break;
          case 'tool_request':
            s._inboundToolRequest(
              msg.id,
              msg.name,
              msg.args,
              new Date(msg.timestamp ?? Date.now()),
            );
            break;
          case 'tool_result':
            s._inboundToolResult(msg.id, msg.result, msg.status, msg.duration ?? 0);
            break;
          case 'tool_auto_denied':
            s._inboundToolResult(msg.id, 'Auto-denied after 30s timeout', 'error', 0);
            break;
          case 'status':
            s._inboundStatus({
              mcpRouter: msg.mcpRouter,
              supabase: msg.supabase,
              sequentialThinking: msg.sequentialThinking,
              toolsAvailable: msg.toolsAvailable,
            });
            break;
          case 'memories': {
            const memories: MemoryChunk[] = (msg.memories ?? []).map((m: any) => ({
              ...m,
              timestamp: new Date(m.timestamp),
            }));
            s._inboundMemories(memories);
            break;
          }
        }
      };

      ws.onclose = () => {
        if (!mounted.current) return;
        useDashboardStore.getState().setWsConnected(false, null);
        reconnectTimer.current = setTimeout(connect, RECONNECT_DELAY_MS);
      };

      ws.onerror = () => {
        // onclose will fire after onerror — reconnect handled there
      };
    }

    connect();

    return () => {
      mounted.current = false;
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      wsRef.current?.close();
    };
  }, []);
}
