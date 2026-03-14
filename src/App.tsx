import { SidebarProvider } from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';
import { AgentSidebar } from '@/components/layout/AgentSidebar';
import { CommandConsole } from '@/components/console/CommandConsole';
import { RightPanel } from '@/components/panels/RightPanel';
import { useGravityClawWS } from '@/hooks/useGravityClawWS';

function AgentApp() {
  useGravityClawWS();

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-background">
      <AgentSidebar />
      <main className="flex flex-1 overflow-hidden">
        <CommandConsole />
        <RightPanel />
      </main>
    </div>
  );
}

function App() {
  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen={true}>
        <AgentApp />
      </SidebarProvider>
      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          className: 'border-border bg-card text-foreground font-mono-gc text-xs',
        }}
      />
    </TooltipProvider>
  );
}

export default App;
