import { useState, useRef, useEffect } from "react";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import WelcomeScreen from "@/components/WelcomeScreen";
import TypingIndicator from "@/components/TypingIndicator";
import ThemeToggle from "@/components/ThemeToggle";
import { Menu } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
  isStreaming?: boolean;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const streamingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const formatTime = () => {
    return new Date().toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getConversationHistory = (): [string, string][] => {
    const history: [string, string][] = [];
    for (let i = 0; i < messages.length; i += 2) {
      if (messages[i] && messages[i + 1]) {
        history.push([messages[i].text, messages[i + 1].text]);
      }
    }
    return history;
  };

  const removeThinkTags = (text: string): string => {
    return text.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
  };

  const handleSendMessage = async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: formatTime(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const conversationHistory = getConversationHistory();
      
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          conversationHistory,
        }),
      });

      const data = await response.json();
      const fullResponse = data.response;

      // Create placeholder message for streaming
      const botMessageId = (Date.now() + 1).toString();
      const botMessage: Message = {
        id: botMessageId,
        text: "",
        isUser: false,
        timestamp: formatTime(),
        isStreaming: true,
      };

      setMessages((prev) => [...prev, botMessage]);

      // Stream the response word by word
      let currentIndex = 0;
      const words = fullResponse.split(' ');
      
      streamingIntervalRef.current = setInterval(() => {
        if (currentIndex < words.length) {
          const rawText = words.slice(0, currentIndex + 1).join(' ');
          const displayText = removeThinkTags(rawText);
          
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === botMessageId
                ? { ...msg, text: rawText, isStreaming: true }
                : msg
            )
          );
          currentIndex++;
        } else {
          if (streamingIntervalRef.current) {
            clearInterval(streamingIntervalRef.current);
          }
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === botMessageId ? { ...msg, isStreaming: false } : msg
            )
          );
        }
      }, 50); // Adjust speed here (50ms = fast, 100ms = medium, 150ms = slow)
    } catch (error) {
      console.error("Error sending message:", error);
      
      if (streamingIntervalRef.current) {
        clearInterval(streamingIntervalRef.current);
      }
      
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      });
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I apologize, but I'm having trouble connecting. Please try again.",
        isUser: false,
        timestamp: formatTime(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamingIntervalRef.current) {
        clearInterval(streamingIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card px-4 md:px-6 h-16 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <button className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
            <Menu className="h-5 w-5 text-primary" />
          </button>
          <div>
            <h1 className="text-lg font-bold font-serif">Muslim Gen</h1>
            <p className="text-xs text-muted-foreground">المرشد الإسلامي</p>
          </div>
        </div>
        <ThemeToggle />
      </header>

      {/* Messages Area */}
      {messages.length === 0 ? (
        <WelcomeScreen onQuestionSelect={handleSendMessage} />
      ) : (
        <div className="flex-1 overflow-y-auto scroll-smooth">
          <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 space-y-4">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message.text}
                isUser={message.isUser}
                timestamp={message.timestamp}
              />
            ))}
            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        </div>
      )}

      {/* Input Area */}
      <ChatInput onSend={handleSendMessage} disabled={isLoading} />
    </div>
  );
}
