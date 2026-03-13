import { TopStatusBar } from '@/components/layout/TopStatusBar';
import { MessageStream } from './MessageStream';
import { CommandInput } from './CommandInput';
import { ToolApprovalDialog } from '@/components/dialogs/ToolApprovalDialog';

export function CommandConsole() {
  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden">
      <TopStatusBar />
      <MessageStream />
      <CommandInput />
      <ToolApprovalDialog />
    </div>
  );
}
