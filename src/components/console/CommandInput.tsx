import { useRef, type KeyboardEvent } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDashboardStore } from '@/store/dashboardStore';
import { Send, Cpu, Paperclip } from 'lucide-react';
import { cn } from '@/lib/utils';

const MODELS = [
  { value: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro' },
  { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash' },
  { value: 'gemini-2.0-pro', label: 'Gemini 2.0 Pro' },
  { value: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash' },
];

export function CommandInput() {
  const { inputValue, setInputValue, sendMessage, isAgentThinking, selectedModel, setSelectedModel, toolCount } =
    useDashboardStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = inputValue.trim();
    if (!trimmed || isAgentThinking) return;
    sendMessage(trimmed);
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const canSend = inputValue.trim().length > 0 && !isAgentThinking;

  return (
    <div className="shrink-0 border-t border-border bg-background/80 p-3 backdrop-blur-sm">
      {/* Input area */}
      <div
        className={cn(
          'relative flex flex-col gap-2 rounded-xl border border-border bg-card p-3 transition-all',
          'focus-within:border-gc-cyan/50 focus-within:gc-glow-cyan'
        )}
      >
        <Textarea
          ref={textareaRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your command... (Enter to send, Shift+Enter for new line)"
          disabled={isAgentThinking}
          rows={2}
          className="font-mono-gc min-h-0 resize-none border-0 bg-transparent p-0 text-sm text-foreground shadow-none placeholder:text-muted-foreground/50 focus-visible:ring-0"
        />

        {/* Bottom toolbar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Model selector */}
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger
                size="sm"
                className="h-7 w-auto gap-1.5 border-border bg-transparent text-[11px] text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <Cpu size={11} />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover text-xs">
                {MODELS.map((m) => (
                  <SelectItem key={m.value} value={m.value} className="text-xs">
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="ghost"
              size="icon-xs"
              className="text-muted-foreground hover:text-foreground"
              title="Attach file"
            >
              <Paperclip size={13} />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground">
              {isAgentThinking ? '⟳ Processing…' : 'Enter ↵ to send'}
            </span>
            <Button
              size="icon-xs"
              onClick={handleSend}
              disabled={!canSend}
              className={cn(
                'size-7 transition-all',
                canSend
                  ? 'bg-gc-cyan text-background hover:bg-gc-cyan/80 gc-glow-cyan'
                  : 'opacity-40'
              )}
            >
              <Send size={13} />
            </Button>
          </div>
        </div>
      </div>

      <p className="mt-1.5 text-center text-[9px] text-muted-foreground">
        GravityClaw has access to {72} MCP tools · All destructive actions require approval
        GravityClaw has access to {toolCount} MCP tools · All destructive actions require approval
      </p>
    </div>
  );
}
