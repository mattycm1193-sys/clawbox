import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { MOCK_STATS } from '@/data/mockData';
import { useDashboardStore } from '@/store/dashboardStore';
import type { ChartConfig } from '@/components/ui/chart';

const chartConfig = {
  toolCalls: {
    label: 'Tool Calls',
    color: 'var(--color-gc-cyan)',
  },
  tokens: {
    label: 'Tokens (×100)',
    color: 'var(--color-gc-violet)',
  },
} satisfies ChartConfig;

// Normalize tokens to same scale
const normalizedData = MOCK_STATS.map((d) => ({
  ...d,
  tokensNorm: Math.round(d.tokens / 100),
}));

export function StatsPanel() {
  const { agents, activeAgentId, toolCalls } = useDashboardStore();
  const agent = agents.find((a) => a.id === activeAgentId);

  const completed = toolCalls.filter((tc) => tc.status === 'complete').length;
  const pending = toolCalls.filter((tc) => tc.status === 'pending').length;
  const denied = toolCalls.filter((tc) => tc.status === 'denied').length;

  return (
    <div className="flex flex-col gap-4">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: 'Tools Available', value: agent?.toolCount ?? 0, color: 'text-gc-cyan' },
          { label: 'Memories', value: agent?.memoryCount ?? 0, color: 'text-gc-violet' },
          { label: 'Completed', value: completed, color: 'text-gc-green' },
          { label: 'Denied', value: denied, color: 'text-gc-red' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-border bg-card p-3"
          >
            <div className={`text-xl font-bold tabular-nums ${stat.color}`}>
              {stat.value}
            </div>
            <div className="text-label text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Pending indicator */}
      {pending > 0 && (
        <div className="flex items-center gap-2 rounded-lg border border-gc-amber/30 bg-gc-amber/5 px-3 py-2">
          <span className="size-1.5 rounded-full bg-gc-amber animate-[pulse-dot_1s_ease-in-out_infinite]" />
          <span className="text-xs text-gc-amber">{pending} tool call awaiting approval</span>
        </div>
      )}

      {/* Chart */}
      <div>
        <p className="text-label text-muted-foreground mb-2">Tool Usage (24h)</p>
        <ChartContainer config={chartConfig} className="h-40 w-full">
          <AreaChart data={normalizedData} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="cyanGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-gc-cyan)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--color-gc-cyan)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="violetGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-gc-violet)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--color-gc-violet)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 9, fill: 'var(--color-muted-foreground)' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 9, fill: 'var(--color-muted-foreground)' }}
              axisLine={false}
              tickLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="toolCalls"
              stroke="var(--color-gc-cyan)"
              strokeWidth={1.5}
              fill="url(#cyanGrad)"
            />
            <Area
              type="monotone"
              dataKey="tokensNorm"
              stroke="var(--color-gc-violet)"
              strokeWidth={1.5}
              fill="url(#violetGrad)"
            />
          </AreaChart>
        </ChartContainer>
      </div>
    </div>
  );
}
