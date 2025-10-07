
import { cn } from "@/lib/utils";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen } from 'lucide-react';

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp?: string;
}

interface ParsedResponse {
  quranRefs: string[];
  hadithRefs: string[];
  scholarThinking: string;
  mainContent: string;
}

function parseResponse(text: string): ParsedResponse {
  const result: ParsedResponse = {
    quranRefs: [],
    hadithRefs: [],
    scholarThinking: '',
    mainContent: text
  };

  // Extract Qur'an references from format: #49:17|29:10|4:125#
  const quranMatch = text.match(/#([^#]+)#/);
  if (quranMatch) {
    const refs = quranMatch[1].split('|');
    result.quranRefs = refs.map(ref => {
      const [surah, ayah] = ref.split(':');
      return `Surah ${surah}: Ayah ${ayah}`;
    });
    result.mainContent = result.mainContent.replace(/#[^#]+#/, '');
  }

  // Extract Hadith references from format: <sahih-muslim:1:162|sahih-bukhari:2:9>
  const hadithMatch = text.match(/<([^>]+)>/);
  if (hadithMatch) {
    const refs = hadithMatch[1].split('|');
    result.hadithRefs = refs.map(ref => {
      const parts = ref.split(':');
      const source = parts[0].replace(/-/g, ' ');
      return `${source} #${parts[1]} ${parts[2] ? '#' + parts[2] : ''}`.trim();
    });
    result.mainContent = result.mainContent.replace(/<[^>]+>/, '');
  }

  // Extract and remove <think> content
  const thinkMatch = result.mainContent.match(/<think>([\s\S]*?)<\/think>/);
  if (thinkMatch) {
    result.scholarThinking = thinkMatch[1].trim();
    result.mainContent = result.mainContent.replace(/<think>[\s\S]*?<\/think>/, '').trim();
  }

  return result;
}

export default function ChatMessage({ message, isUser, timestamp }: ChatMessageProps) {
  const [showThinking, setShowThinking] = useState(false);
  const parsed = !isUser ? parseResponse(message) : null;

  return (
    <div
      className={cn(
        "flex flex-col gap-1",
        isUser ? "items-end" : "items-start"
      )}
      data-testid={`message-${isUser ? "user" : "bot"}`}
    >
      <div
        className={cn(
          "px-4 py-3 shadow-sm transition-colors duration-300",
          isUser
            ? "bg-primary text-primary-foreground rounded-2xl rounded-br-sm max-w-xl"
            : "bg-card text-card-foreground border border-card-border rounded-2xl rounded-bl-sm max-w-2xl"
        )}
      >
        {isUser ? (
          <p className="text-base leading-relaxed whitespace-pre-wrap break-words">
            {message}
          </p>
        ) : (
          <div className="space-y-3">
            {/* Qur'an and Hadith References */}
            {parsed && (parsed.quranRefs.length > 0 || parsed.hadithRefs.length > 0) && (
              <div className="bg-muted/30 rounded-lg p-3 space-y-2 text-sm">
                {parsed.quranRefs.length > 0 && (
                  <div>
                    <p className="font-semibold text-foreground mb-1">Qur'an References</p>
                    {parsed.quranRefs.map((ref, i) => (
                      <p key={i} className="text-muted-foreground">{ref}</p>
                    ))}
                  </div>
                )}
                {parsed.hadithRefs.length > 0 && (
                  <div>
                    <p className="font-semibold text-foreground mb-1">Hadith References</p>
                    {parsed.hadithRefs.map((ref, i) => (
                      <p key={i} className="text-muted-foreground capitalize">{ref}</p>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Scholar's Thinking (Collapsible) */}
            {parsed?.scholarThinking && (
              <div className="border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setShowThinking(!showThinking)}
                  className="w-full flex items-center justify-between p-3 bg-muted/20 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-primary/70">
                      Scholar's Thinking (Internal Notes)
                    </span>
                  </div>
                  {showThinking ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
                {showThinking && (
                  <div className="p-3 text-sm prose prose-sm dark:prose-invert max-w-none bg-muted/10">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {parsed.scholarThinking}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            )}

            {/* Main Content */}
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({ children }) => (
                    <p className="text-base leading-relaxed mb-2 last:mb-0">{children}</p>
                  ),
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline break-words"
                    >
                      {children}
                    </a>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold text-foreground">{children}</strong>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc pl-6 mb-2 space-y-1">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal pl-6 mb-2 space-y-1">{children}</ol>
                  ),
                  li: ({ children }) => (
                    <li className="text-base leading-relaxed">{children}</li>
                  ),
                  h1: ({ children }) => (
                    <h1 className="text-xl font-bold mb-2">{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-lg font-bold mb-2">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-base font-bold mb-2">{children}</h3>
                  ),
                }}
              >
                {parsed?.mainContent || message}
              </ReactMarkdown>
            </div>

            {/* Telegram Channel Link */}
            <div className="mt-4 pt-3 border-t border-border">
              <a
                href="https://t.me/muslim_gen003"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors group"
              >
                <svg 
                  className="h-5 w-5" 
                  viewBox="0 0 24 24" 
                  fill="currentColor"
                  strokeWidth="0.5"
                  stroke="currentColor"
                >
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
                </svg>
                <span className="font-semibold">Join Our Telegram Channel</span>
              </a>
            </div>
          </div>
        )}
      </div>
      {timestamp && (
        <span className="text-xs text-muted-foreground px-2" data-testid="text-timestamp">
          {timestamp}
        </span>
      )}
    </div>
  );
}
