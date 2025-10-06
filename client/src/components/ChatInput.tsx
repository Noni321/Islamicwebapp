import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, KeyboardEvent } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t bg-card p-4 sticky bottom-0">
      <div className="max-w-4xl mx-auto flex gap-3 items-end">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask your Islamic question..."
          className="resize-none min-h-[44px] max-h-32 rounded-xl focus-visible:ring-2 focus-visible:ring-ring text-base"
          disabled={disabled}
          rows={1}
          data-testid="input-message"
        />
        <Button
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          size="icon"
          className="rounded-lg min-h-[44px] min-w-[44px]"
          data-testid="button-send"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
