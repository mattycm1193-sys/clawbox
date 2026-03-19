import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';
import { AgentSidebar } from '@/components/layout/AgentSidebar';
import { CommandConsole } from '@/components/console/CommandConsole';
import { RightPanel } from '@/components/panels/RightPanel';
import { useGravityClawWS } from '@/hooks/useGravityClawWS';

function AgentApp() {
  useGravityClawWS();

  return (
    <ResizablePanelGroup direction="horizontal" className="h-dvh w-full">
      <ResizablePanel defaultSize={20}>
        <AgentSidebar />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={55}>
        <CommandConsole />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={25}>
        <RightPanel />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

function App() {
  return (
    <TooltipProvider>
      <AgentApp />
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
