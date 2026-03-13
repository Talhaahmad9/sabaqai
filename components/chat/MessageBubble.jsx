export default function MessageBubble({ message }) {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div className="max-w-xs md:max-w-md ml-auto bg-violet-600 text-white rounded-2xl rounded-tr-sm px-4 py-2.5 my-2">
        <div className="whitespace-pre-wrap">{message.content}</div>
      </div>
    );
  }

  return (
    <div className="max-w-xs md:max-w-md bg-slate-800 text-slate-100 rounded-2xl rounded-tl-sm px-4 py-2.5 my-2">
      <div className="whitespace-pre-wrap">{message.content}</div>
      {message.citations && message.citations.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {message.citations.map((c, idx) => (
            <span key={idx} className="inline-flex items-center gap-1 bg-slate-700 rounded-lg px-2 py-0.5 text-slate-400 text-xs">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.343-3 3v6h6v-6c0-1.657-1.343-3-3-3z" />
              </svg>
              <span className="truncate max-w-40">{c.pageContent || c.location}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
