import ChatMessage from '../ChatMessage';

export default function ChatMessageExample() {
  return (
    <div className="space-y-4 p-6 bg-background max-w-4xl">
      <ChatMessage
        message="Why is man created?"
        isUser={true}
        timestamp="2:30 PM"
      />
      <ChatMessage
        message="Man is created to worship Allah alone and to fulfill His purpose on earth. As Allah says in the Quran: 'And I did not create the jinn and mankind except to worship Me.' (Quran 51:56)"
        isUser={false}
        timestamp="2:30 PM"
      />
    </div>
  );
}
