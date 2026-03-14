import { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useDashboardStore } from '@/store/dashboardStore';
import { MessageBubble } from './MessageBubble';
import { BrainCircuit } from 'lucide-react';

function ThinkingIndicator() {
  return (
    <div className="flex gap-2.5">
      <div className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-border bg-card">
        <BrainCircuit size={14} className="animate-[pulse-dot_1.5s_ease-in-out_infinite] text-gc-cyan" />
      </div>
      <div className="flex flex-col gap-2 mt-1">
        <span className="text-label text-gc-cyan">GravityClaw</span>
        <div className="flex items-center gap-1.5 rounded-lg border border-border bg-card p-3">
          <span className="font-mono-gc text-xs text-muted-foreground">thinking</span>
          <span className="flex gap-0.5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="size-1 rounded-full bg-gc-cyan animate-[pulse-dot_1.2s_ease-in-out_infinite]"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </span>
        </div>
      </div>
    </div>
  );
}

export function MessageStream() {
  const { messages, isAgentThinking } = useDashboardStore();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAgentThinking]);

  return (
    <ScrollArea className="flex-1 scrollbar-thin-gc">
      <div className="flex flex-col gap-4 p-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isAgentThinking && <ThinkingIndicator />}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}
