import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';

export default function MessageList({ messages, loading, bottomRef }) {
  return (
    <div className="flex flex-col">
      {messages.map((m, idx) => (
        <MessageBubble key={idx} message={m} />
      ))}

      {loading && (
        <div className="mt-2">
          <TypingIndicator />
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
