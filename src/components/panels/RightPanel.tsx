import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useDashboardStore } from '@/store/dashboardStore';
import { ToolCallCard } from './ToolCallCard';
import { MemoryPanel } from './MemoryPanel';
import { StatsPanel } from './StatsPanel';
import { PanelRightClose, PanelRightOpen, Wrench, Brain, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function RightPanel() {
  const {
    toolCalls,
    memories,
    rightPanelTab,
    rightPanelOpen,
    setRightPanelTab,
    setRightPanelOpen,
  } = useDashboardStore();

  return (
    <div
      className={cn(
        'flex shrink-0 flex-col border-l border-border bg-gc-surface transition-all duration-300',
        rightPanelOpen ? 'w-72' : 'w-10'
      )}
    >
      {/* Panel Toggle */}
      <div className="flex h-10 shrink-0 items-center justify-between border-b border-border px-2">
        {rightPanelOpen && (
          <span className="text-label text-muted-foreground">Inspector</span>
        )}
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={() => setRightPanelOpen(!rightPanelOpen)}
          className="ml-auto text-muted-foreground hover:text-foreground"
        >
          {rightPanelOpen ? <PanelRightClose size={14} /> : <PanelRightOpen size={14} />}
        </Button>
      </div>

      {rightPanelOpen && (
        <Tabs
          value={rightPanelTab}
          onValueChange={(v) => setRightPanelTab(v as 'tools' | 'memory' | 'stats')}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <TabsList className="mx-3 mt-2 h-8 shrink-0 grid w-auto grid-cols-3 bg-secondary">
            <TabsTrigger value="tools" className="gap-1 text-[11px]">
              <Wrench size={11} />
              Tools
            </TabsTrigger>
            <TabsTrigger value="memory" className="gap-1 text-[11px]">
              <Brain size={11} />
              Memory
            </TabsTrigger>
            <TabsTrigger value="stats" className="gap-1 text-[11px]">
              <BarChart3 size={11} />
              Stats
            </TabsTrigger>
          </TabsList>

          <Separator className="mt-2" />

          <TabsContent value="tools" className="flex-1 overflow-hidden mt-0">
            <ScrollArea className="h-full scrollbar-thin-gc">
              <div className="flex flex-col gap-2 p-3">
                {toolCalls.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 py-8 text-muted-foreground">
                    <Wrench size={24} className="opacity-30" />
                    <p className="text-xs">No tool calls yet</p>
                  </div>
                ) : (
                  toolCalls.map((tc) => (
                    <ToolCallCard key={tc.id} toolCall={tc} />
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="memory" className="flex-1 overflow-hidden mt-0">
            <ScrollArea className="h-full scrollbar-thin-gc">
              <div className="p-3">
                <MemoryPanel memories={memories} />
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="stats" className="flex-1 overflow-hidden mt-0">
            <ScrollArea className="h-full scrollbar-thin-gc">
              <div className="p-3">
                <StatsPanel />
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
