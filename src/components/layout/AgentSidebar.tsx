import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { useDashboardStore } from '@/store/dashboardStore';
import type { Agent } from '@/types';
import {
  Terminal,
  Brain,
  Wrench,
  BarChart3,
  HardDrive,
  Activity,
  Plus,
  CloudOff,
  Cloud,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { label: 'Console', icon: Terminal, id: 'console' },
  { label: 'Memory', icon: Brain, id: 'memory' },
  { label: 'Tools', icon: Wrench, id: 'tools' },
  { label: 'Stats', icon: BarChart3, id: 'stats' },
];

function AgentStatusDot({ status }: { status: Agent['status'] }) {
  const colorMap = {
    online: 'bg-gc-green shadow-[0_0_6px_var(--color-gc-green)]',
    thinking: 'bg-gc-amber shadow-[0_0_6px_var(--color-gc-amber)] animate-[pulse-dot_1s_ease-in-out_infinite]',
    idle: 'bg-muted-foreground',
    offline: 'bg-gc-red/50',
  };
  return (
    <span className={cn('size-2 shrink-0 rounded-full', colorMap[status])} />
  );
}

function AgentItem({ agent }: { agent: Agent }) {
  const { activeAgentId, setActiveAgent } = useDashboardStore();
  const isActive = agent.id === activeAgentId;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={isActive}
        onClick={() => setActiveAgent(agent.id)}
        className={cn(
          'group h-auto flex-col items-start gap-0.5 py-2',
          isActive && 'gc-glow-cyan border border-gc-cyan/30 bg-gc-cyan/5'
        )}
        tooltip={agent.name}
      >
        <div className="flex w-full items-center gap-2">
          {/* Avatar */}
          <div
            className={cn(
              'flex size-7 shrink-0 items-center justify-center rounded-md text-[10px] font-bold',
              isActive
                ? 'bg-gc-cyan text-background'
                : 'bg-secondary text-secondary-foreground'
            )}
          >
            {agent.avatar}
          </div>
          <div className="min-w-0 flex-1 truncate">
            <div className="flex items-center gap-1.5">
              <AgentStatusDot status={agent.status} />
              <span className="truncate text-xs font-medium">{agent.name}</span>
            </div>
            <span className="truncate text-[10px] text-muted-foreground">
              {agent.model}
            </span>
          </div>
        </div>
        {isActive && (
          <div className="flex w-full gap-2 pl-9">
            <span className="text-[10px] text-muted-foreground">
              {agent.toolCount} tools · {agent.memoryCount} memories
            </span>
          </div>
        )}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export function AgentSidebar() {
  const { agents, systemStatus, setRightPanelTab } = useDashboardStore();

  return (
    <Sidebar collapsible="icon" className="border-r border-border bg-sidebar">
      <SidebarHeader className="px-3 py-3">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-gc-cyan/10 gc-glow-cyan">
            <Activity size={16} className="text-gc-cyan" />
          </div>
          <div className="group-data-[collapsible=icon]:hidden">
            <div className="text-sm font-bold tracking-tight text-foreground">
              GravityClaw
            </div>
            <div className="text-[10px] text-muted-foreground">Neural Core</div>
          </div>
          <SidebarTrigger className="ml-auto text-muted-foreground" />
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      {/* Navigation */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-label text-muted-foreground">
            Navigation
          </SidebarGroupLabel>
          <SidebarMenu>
            {NAV_ITEMS.map((item) => (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  isActive={item.id === 'console'}
                  tooltip={item.label}
                  onClick={() => {
                    if (item.id !== 'console') {
                      setRightPanelTab(
                        item.id === 'memory'
                          ? 'memory'
                          : item.id === 'stats'
                          ? 'stats'
                          : 'tools'
                      );
                    }
                  }}
                  className="gap-2"
                >
                  <item.icon size={15} />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Agents */}
        <SidebarGroup>
          <div className="flex items-center justify-between pr-1">
            <SidebarGroupLabel className="text-label text-muted-foreground">
              Agents
            </SidebarGroupLabel>
            <Badge
              variant="outline"
              className="h-4 rounded-sm border-border px-1 text-[9px] text-muted-foreground"
            >
              {agents.filter((a) => a.status !== 'offline').length}/{agents.length}
            </Badge>
          </div>
          <SidebarMenu>
            {agents.map((agent) => (
              <AgentItem key={agent.id} agent={agent} />
            ))}
            {/* Add agent button */}
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Add Agent"
                className="text-muted-foreground hover:text-foreground"
              >
                <Plus size={14} />
                <span>Add Agent</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer: Memory Sync */}
      <SidebarFooter className="border-t border-border p-3">
        <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
          {systemStatus.supabase ? (
            <>
              <Cloud size={13} className="shrink-0 text-gc-green" />
              <div className="group-data-[collapsible=icon]:hidden">
                <div className="text-[10px] font-medium text-gc-green">Cloud Synced</div>
                <div className="text-[9px] text-muted-foreground">Supabase active</div>
              </div>
            </>
          ) : (
            <>
              <CloudOff size={13} className="shrink-0 text-gc-amber" />
              <div className="group-data-[collapsible=icon]:hidden">
                <div className="text-[10px] font-medium text-gc-amber">Local Fallback</div>
                <div className="text-[9px] text-muted-foreground">I: drive active</div>
              </div>
            </>
          )}
          <div className="ml-auto group-data-[collapsible=icon]:hidden">
            <HardDrive size={12} className="text-muted-foreground" />
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
