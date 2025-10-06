export default function TypingIndicator() {
  return (
    <div className="flex items-start">
      <div className="bg-card border border-card-border rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
        <div className="flex gap-1" data-testid="indicator-typing">
          <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}
