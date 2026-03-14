import type { MemoryChunk } from '@/types';
import { Badge } from '@/components/ui/badge';
import { formatRelativeTime } from '@/lib/utils';
import { Brain, Cloud, HardDrive } from 'lucide-react';

function MemoryItem({ memory }: { memory: MemoryChunk }) {
  const similarityPct = Math.round(memory.similarity * 100);

  return (
    <div className="rounded-lg border border-border bg-card p-3 space-y-2">
      <div className="flex items-start justify-between gap-2">
        <Brain size={12} className="mt-0.5 shrink-0 text-gc-violet" />
        <div className="flex-1 min-w-0">
          <p className="font-mono-gc text-[11px] text-foreground/80 leading-relaxed line-clamp-2">
            {memory.content}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Similarity bar */}
          <div className="flex items-center gap-1.5">
            <div className="h-1 w-16 rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full rounded-full bg-gc-violet transition-all"
                style={{ width: `${similarityPct}%` }}
              />
            </div>
            <span className="text-[10px] text-muted-foreground">{similarityPct}%</span>
          </div>
          {memory.synced ? (
            <Badge
              variant="outline"
              className="h-4 gap-0.5 rounded-sm border-gc-green/30 bg-gc-green/5 px-1 text-[9px] text-gc-green"
            >
              <Cloud size={7} />
              synced
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="h-4 gap-0.5 rounded-sm border-gc-amber/30 bg-gc-amber/5 px-1 text-[9px] text-gc-amber"
            >
              <HardDrive size={7} />
              local
            </Badge>
          )}
        </div>
        <span className="text-[10px] text-muted-foreground">
          {formatRelativeTime(memory.timestamp)}
        </span>
      </div>
    </div>
  );
}

export function MemoryPanel({ memories }: { memories: MemoryChunk[] }) {
  if (memories.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 text-muted-foreground">
        <Brain size={24} className="opacity-30" />
        <p className="text-xs">No memories found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {memories.map((mem) => (
        <MemoryItem key={mem.id} memory={mem} />
      ))}
    </div>
  );
}
