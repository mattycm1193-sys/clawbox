import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useDashboardStore } from '@/store/dashboardStore';
import {
  Cpu,
  Database,
  Wrench,
  Settings,
  ChevronRight,
  BrainCircuit,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

function StatusPill({
  label,
  online,
  icon: Icon,
}: {
  label: string;
  online: boolean;
  icon: React.ElementType;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <div
        className={cn(
          'size-1.5 rounded-full',
          online
            ? 'bg-gc-green shadow-[0_0_6px_var(--color-gc-green)]'
            : 'bg-muted-foreground',
          online && 'animate-[pulse-dot_2s_ease-in-out_infinite]'
        )}
      />
      <Icon
        size={12}
        className={online ? 'text-gc-green' : 'text-muted-foreground'}
      />
      <span className={cn('text-label', online ? 'text-gc-green' : 'text-muted-foreground')}>
        {label}
      </span>
    </div>
  );
}

export function TopStatusBar() {
  const { systemStatus, selectedModel } = useDashboardStore();

  return (
    <div className="flex h-10 shrink-0 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-sm">
      {/* Left: Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <BrainCircuit size={14} className="text-gc-cyan" />
        <span className="font-medium text-foreground">GravityClaw</span>
        <ChevronRight size={12} />
        <span>Console</span>
      </div>

      {/* Center: System Status */}
      <div className="flex items-center gap-4">
        <StatusPill label="MCP Router" online={systemStatus.mcpRouter} icon={Zap} />
        <div className="h-3 w-px bg-border" />
        <StatusPill label="Supabase" online={systemStatus.supabase} icon={Database} />
        <div className="h-3 w-px bg-border" />
        <StatusPill label="Seq. Thinking" online={systemStatus.sequentialThinking} icon={BrainCircuit} />
      </div>

      {/* Right: Model + Tools count */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5">
          <Wrench size={12} className="text-muted-foreground" />
          <span className="text-label text-muted-foreground">
            {systemStatus.toolsAvailable} tools
          </span>
        </div>
        <Badge
          variant="outline"
          className="h-5 gap-1 rounded-sm border-gc-cyan/30 bg-gc-cyan/5 px-1.5 text-[10px] text-gc-cyan"
        >
          <Cpu size={10} />
          {selectedModel}
        </Badge>
        <Tooltip>
          <TooltipTrigger className="inline-flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
            <Settings size={13} />
          </TooltipTrigger>
          <TooltipContent>Settings</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
