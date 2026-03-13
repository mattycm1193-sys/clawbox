import type { ToolCall } from '@/types';
import { Badge } from '@/components/ui/badge';
import { cn, formatRelativeTime, formatDuration } from '@/lib/utils';
import {
  Terminal,
  CheckCircle2,
  XCircle,
  Loader,
  Clock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useState } from 'react';

const STATUS_CONFIG = {
  pending: { icon: Clock, color: 'text-gc-amber', badgeClass: 'border-gc-amber/40 bg-gc-amber/10 text-gc-amber', label: 'PENDING' },
  approved: { icon: CheckCircle2, color: 'text-gc-cyan', badgeClass: 'border-gc-cyan/40 bg-gc-cyan/10 text-gc-cyan', label: 'APPROVED' },
  denied: { icon: XCircle, color: 'text-gc-red', badgeClass: 'border-gc-red/40 bg-gc-red/10 text-gc-red', label: 'DENIED' },
  executing: { icon: Loader, color: 'text-gc-cyan', badgeClass: 'border-gc-cyan/40 bg-gc-cyan/10 text-gc-cyan', label: 'EXECUTING' },
  complete: { icon: CheckCircle2, color: 'text-gc-green', badgeClass: 'border-gc-green/40 bg-gc-green/10 text-gc-green', label: 'COMPLETE' },
  error: { icon: XCircle, color: 'text-gc-red', badgeClass: 'border-gc-red/40 bg-gc-red/10 text-gc-red', label: 'ERROR' },
};

export function ToolCallCard({ toolCall }: { toolCall: ToolCall }) {
  const [expanded, setExpanded] = useState(toolCall.status === 'pending');
  const cfg = STATUS_CONFIG[toolCall.status];
  const StatusIcon = cfg.icon;

  return (
    <div
      className={cn(
        'rounded-lg border bg-card p-3 transition-all',
        toolCall.status === 'pending' ? 'border-gc-amber/40 gc-glow-cyan' : 'border-border',
        toolCall.status === 'complete' && 'border-gc-green/20',
        toolCall.status === 'executing' && 'border-gc-cyan/40'
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <Terminal size={13} className={cfg.color} />
          <span className="font-mono-gc text-xs font-medium text-foreground">
            {toolCall.name}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Badge
            variant="outline"
            className={cn('h-4 rounded-sm px-1 text-[9px]', cfg.badgeClass)}
          >
            <StatusIcon
              size={8}
              className={cn(toolCall.status === 'executing' && 'animate-spin')}
            />
            {cfg.label}
          </Badge>
          <button
            onClick={() => setExpanded((e) => !e)}
            className="text-muted-foreground hover:text-foreground"
          >
            {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-2 space-y-2">
          {/* Args */}
          <pre className="font-mono-gc overflow-x-auto rounded-md bg-background/50 p-2 text-[10px] text-muted-foreground">
            {JSON.stringify(toolCall.args, null, 2)}
          </pre>

          {/* Result */}
          {toolCall.result && (
            <div className="rounded-md bg-gc-green/5 border border-gc-green/20 p-2">
              <span className="text-label text-gc-green">Result</span>
              <p className="font-mono-gc mt-1 text-[10px] text-foreground/80 leading-relaxed">
                {toolCall.result.length > 200
                  ? toolCall.result.slice(0, 200) + '…'
                  : toolCall.result}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="mt-2 flex items-center justify-between">
        <span className="text-[10px] text-muted-foreground">
          {formatRelativeTime(toolCall.timestamp)}
        </span>
        {toolCall.duration && (
          <span className="font-mono-gc text-[10px] text-muted-foreground">
            ⏱ {formatDuration(toolCall.duration)}
          </span>
        )}
      </div>
    </div>
  );
}
