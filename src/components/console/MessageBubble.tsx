import type { Message } from '@/types';
import { cn, formatTime } from '@/lib/utils';
import { Bot, User, Terminal, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';

const ROLE_CONFIG = {
  user: {
    icon: User,
    label: 'You',
    iconClass: 'text-foreground',
    containerClass: 'flex-row-reverse',
    bubbleClass: 'bg-secondary border border-border text-foreground ml-8',
  },
  agent: {
    icon: Bot,
    label: 'GravityClaw',
    iconClass: 'text-gc-cyan',
    containerClass: 'flex-row',
    bubbleClass: 'bg-card border border-border text-foreground mr-8',
  },
  system: {
    icon: Info,
    label: 'SYSTEM',
    iconClass: 'text-muted-foreground',
    containerClass: 'flex-row',
    bubbleClass: 'bg-transparent border-0 text-muted-foreground mr-8',
  },
  tool: {
    icon: Terminal,
    label: 'TOOL_CALL',
    iconClass: 'text-gc-amber',
    containerClass: 'flex-row',
    bubbleClass: 'bg-gc-amber/5 border border-gc-amber/30 text-foreground mr-8',
  },
};

function ToolArgsView({ args }: { args: Record<string, unknown> }) {
  const [expanded, setExpanded] = useState(false);
  const json = JSON.stringify(args, null, 2);

  return (
    <div className="mt-2">
      <button
        onClick={() => setExpanded((e) => !e)}
        className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
      >
        {expanded ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
        <span>args</span>
      </button>
      {expanded && (
        <pre className="font-mono-gc mt-1 rounded-md bg-background/50 p-2 text-[11px] text-gc-amber/80 overflow-x-auto">
          {json}
        </pre>
      )}
    </div>
  );
}

export function MessageBubble({ message }: { message: Message }) {
  const config = ROLE_CONFIG[message.role];
  const Icon = config.icon;

  return (
    <div className={cn('flex gap-2.5 group', config.containerClass)}>
      {/* Icon */}
      <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg border border-border bg-card">
        <Icon size={14} className={config.iconClass} />
      </div>

      {/* Content */}
      <div className="flex max-w-[85%] flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className={cn('text-label', config.iconClass)}>{config.label}</span>
          {message.toolName && (
            <Badge
              variant="outline"
              className="h-4 gap-1 rounded-sm border-gc-amber/40 bg-gc-amber/5 px-1 text-[9px] text-gc-amber"
            >
              <Terminal size={8} />
              {message.toolName}
            </Badge>
          )}
          <span className="text-[10px] text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
            {formatTime(message.timestamp)}
          </span>
        </div>

        <div className={cn('rounded-lg p-3 text-sm', config.bubbleClass)}>
          {message.role === 'agent' ? (
            <div
              className="prose prose-invert max-w-none text-sm leading-relaxed [&_strong]:text-foreground [&_code]:font-mono-gc [&_code]:rounded [&_code]:bg-background/50 [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-gc-cyan [&_code]:text-xs"
              dangerouslySetInnerHTML={{
                __html: message.content
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  .replace(/`([^`]+)`/g, '<code>$1</code>')
                  .replace(/\n/g, '<br/>'),
              }}
            />
          ) : message.role === 'system' ? (
            <span className="font-mono-gc text-xs">{message.content}</span>
          ) : (
            <span className="text-sm leading-relaxed">{message.content}</span>
          )}

          {message.toolArgs && (
            <ToolArgsView args={message.toolArgs} />
          )}
        </div>

        {message.isStreaming && (
          <div className="flex items-center gap-1.5 text-[10px] text-gc-cyan">
            <span className="animate-[gc-blink_1s_step-end_infinite]">▋</span>
            <span>generating…</span>
          </div>
        )}
      </div>
    </div>
  );
}
