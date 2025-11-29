import { useState, useRef, useEffect } from "react";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import WelcomeScreen from "@/components/WelcomeScreen";
import TypingIndicator from "@/components/TypingIndicator";
import ThemeToggle from "@/components/ThemeToggle";
import { Menu, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
  thinking?: string;
  isStreaming?: boolean;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hijriDate, setHijriDate] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const streamingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const isUserScrollingRef = useRef(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (!isUserScrollingRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
      isUserScrollingRef.current = !isAtBottom;
    }
  };

  useEffect(() => {
    const fetchHijriDate = async () => {
      try {
        const response = await fetch("/api/hijri-date");
        const data = await response.json();
        setHijriDate(data.date);
      } catch (error) {
        console.error("Failed to fetch Hijri date:", error);
      }
    };
    fetchHijriDate();
  }, []);

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

      // Extract thinking from response text
      const thinkMatch = fullResponse.match(/<think>([\s\S]*?)<\/think>/);
      const thinking = thinkMatch ? thinkMatch[1].trim() : undefined;
      
      // Remove thinking from main text
      const mainText = fullResponse.replace(/<think>[\s\S]*?<\/think>/, '').trim();

      // Create placeholder message for streaming with thinking already set
      const botMessageId = (Date.now() + 1).toString();
      const botMessage: Message = {
        id: botMessageId,
        text: "",
        isUser: false,
        timestamp: formatTime(),
        thinking: thinking,
        isStreaming: true,
      };

      setMessages((prev) => [...prev, botMessage]);

      // Stream the main text word by word with slower animation
      let currentIndex = 0;
      const words = mainText.split(' ');
      const wordsPerBatch = 2; // Display 2 words at a time for better readability
      
      streamingIntervalRef.current = setInterval(() => {
        if (currentIndex < words.length) {
          currentIndex = Math.min(currentIndex + wordsPerBatch, words.length);
          const displayText = words.slice(0, currentIndex).join(' ');
          
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === botMessageId
                ? { ...msg, text: displayText, isStreaming: true }
                : msg
            )
          );
        } else {
          if (streamingIntervalRef.current) {
            clearInterval(streamingIntervalRef.current);
          }
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === botMessageId ? { ...msg, text: mainText, isStreaming: false } : msg
            )
          );
          isUserScrollingRef.current = false;
        }
      }, 60);
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

  // Clear chat function
  const handleClearChat = () => {
    setMessages([]);
    if (streamingIntervalRef.current) {
      clearInterval(streamingIntervalRef.current);
    }
    setIsLoading(false);
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
        <div className="flex items-center gap-3">
          {hijriDate && (
            <p className="text-xs font-serif text-foreground/70" data-testid="text-hijri-date">
              {hijriDate}
            </p>
          )}
          <ThemeToggle />
        </div>
      </header>

      {/* Messages Area */}
      {messages.length === 0 ? (
        <WelcomeScreen onQuestionSelect={handleSendMessage} />
      ) : (
        <div 
          ref={messagesContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto scroll-smooth"
        >
          <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 space-y-4">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message.text}
                isUser={message.isUser}
                timestamp={message.timestamp}
                thinking={message.thinking}
              />
            ))}
            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        </div>
      )}

      {/* New Chat Button */}
      {messages.length > 0 && (
        <div className="flex justify-center py-3">
          <button
            onClick={handleClearChat}
            disabled={isLoading}
            className="group flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-full transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="button-new-chat"
          >
            <Plus className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
            <span className="text-sm font-medium">New Chat</span>
          </button>
        </div>
      )}

      {/* Input Area */}
      <ChatInput onSend={handleSendMessage} disabled={isLoading} />
    </div>
  );
}
