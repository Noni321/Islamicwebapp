import ChatInput from '../ChatInput';
import { useState } from 'react';

export default function ChatInputExample() {
  const [lastMessage, setLastMessage] = useState("");

  return (
    <div className="bg-background">
      {lastMessage && (
        <div className="p-4 text-center text-muted-foreground">
          Last sent: {lastMessage}
        </div>
      )}
      <ChatInput onSend={(msg) => setLastMessage(msg)} />
    </div>
  );
}
