import { useEffect, useState } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useDashboardStore } from '@/store/dashboardStore';
import { AlertTriangle, Terminal, ShieldCheck, ShieldX, Clock } from 'lucide-react';

const TIMEOUT_SECONDS = 30;

export function ToolApprovalDialog() {
  const { pendingApproval, approveTool, dismissApproval } = useDashboardStore();
  const [countdown, setCountdown] = useState(TIMEOUT_SECONDS);

  const isOpen = !!pendingApproval;

  useEffect(() => {
    if (!isOpen) {
      setCountdown(TIMEOUT_SECONDS);
      return;
    }
    setCountdown(TIMEOUT_SECONDS);
    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(interval);
          dismissApproval();
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, dismissApproval]);

  if (!pendingApproval) return null;

  const progressPct = (countdown / TIMEOUT_SECONDS) * 100;

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="border-gc-amber/40 bg-card max-w-md gc-glow-cyan p-0 overflow-hidden">
        {/* Header bar */}
        <div className="flex items-center gap-2 border-b border-gc-amber/30 bg-gc-amber/5 px-4 py-3">
          <AlertTriangle size={16} className="text-gc-amber animate-[pulse-dot_1.5s_ease-in-out_infinite]" />
          <span className="text-sm font-semibold text-gc-amber">⚠️ Human Override Required</span>
          <div className="ml-auto flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Clock size={11} />
            <span className="font-mono-gc tabular-nums">{countdown}s</span>
          </div>
        </div>

        <div className="p-4">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-base">
              <Terminal size={16} className="text-gc-cyan" />
              <span>GravityClaw</span>
              <span className="text-muted-foreground font-normal">wants to use tool</span>
            </AlertDialogTitle>

            {/* Tool Badge */}
            <div className="mt-2">
              <Badge
                variant="outline"
                className="gap-1.5 rounded-md border-gc-cyan/40 bg-gc-cyan/10 px-2.5 py-1 text-sm font-mono text-gc-cyan"
              >
                <Terminal size={13} />
                {pendingApproval.toolName}
              </Badge>
            </div>

            <AlertDialogDescription className="mt-1 text-xs text-muted-foreground">
              Allow this action? Destructive operations cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {/* Args preview */}
          <div className="mt-3 rounded-lg border border-border bg-background/50 p-3">
            <span className="text-label text-muted-foreground mb-1.5 block">Arguments</span>
            <pre className="font-mono-gc overflow-x-auto text-[11px] text-foreground/80 leading-relaxed">
              {JSON.stringify(pendingApproval.args, null, 2)}
            </pre>
          </div>

          {/* Countdown bar */}
          <div className="mt-3">
            <Progress
              value={progressPct}
              className="h-1 bg-secondary [&>div]:bg-gc-amber [&>div]:transition-all"
            />
            <p className="mt-1 text-[10px] text-muted-foreground">
              Auto-denying in {countdown}s if no action taken
            </p>
          </div>

          <AlertDialogFooter className="mt-4 gap-2 sm:gap-2">
            <Button
              variant="outline"
              onClick={() => approveTool(false)}
              className="flex-1 gap-2 border-gc-red/40 bg-gc-red/5 text-gc-red hover:bg-gc-red/15 hover:border-gc-red/60"
            >
              <ShieldX size={14} />
              Deny
            </Button>
            <Button
              onClick={() => approveTool(true)}
              className="flex-1 gap-2 bg-gc-cyan text-background hover:bg-gc-cyan/80 gc-glow-cyan"
            >
              <ShieldCheck size={14} />
              Approve
            </Button>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
