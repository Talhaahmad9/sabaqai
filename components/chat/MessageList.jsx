import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import ReactMarkdown from "react-markdown";

export default function MessageList({
  messages,
  loading,
  streamingText,
  bottomRef,
}) {
  return (
    <div className="flex flex-col">
      {messages.map((m, idx) => (
        <MessageBubble key={idx} message={m} />
      ))}

      {/* Typing indicator while waiting for response */}
      {loading && !streamingText && (
        <div className="mt-2">
          <TypingIndicator />
        </div>
      )}

      {/* Streaming text bubble */}
      {streamingText && (
        <div className="max-w-xs md:max-w-2xl bg-slate-800 text-slate-100 rounded-2xl rounded-tl-sm px-4 py-2.5 my-2">
          <div
            className="prose prose-invert prose-sm max-w-none
            prose-headings:text-white prose-p:text-slate-100
            prose-strong:text-white prose-ul:text-slate-100
            prose-li:text-slate-100 prose-li:marker:text-violet-400"
          >
            <ReactMarkdown>{streamingText}</ReactMarkdown>
          </div>
          <span className="inline-block w-1.5 h-4 bg-violet-400 animate-pulse ml-1 align-middle" />
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
