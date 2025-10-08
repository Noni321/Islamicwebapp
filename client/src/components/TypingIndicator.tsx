export default function TypingIndicator() {
  return (
    <div className="flex items-start">
      <div className="bg-card border border-card-border rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
        <div className="flex flex-col items-center gap-3">
          <div className="flex gap-1" data-testid="indicator-typing">
            <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium text-primary animate-pulse">Thinking</span>
            <span className="flex gap-0.5">
              <span className="text-primary animate-bounce" style={{ animationDelay: "0ms" }}>.</span>
              <span className="text-primary animate-bounce" style={{ animationDelay: "200ms" }}>.</span>
              <span className="text-primary animate-bounce" style={{ animationDelay: "400ms" }}>.</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
