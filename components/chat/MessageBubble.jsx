import ReactMarkdown from "react-markdown";

function formatTime(timestamp) {
  if (!timestamp) return "";
  return new Date(timestamp).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export default function MessageBubble({ message }) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex flex-col items-end my-2">
        <div className="max-w-xs md:max-w-2xl bg-violet-600 text-white rounded-2xl rounded-tr-sm px-4 py-2.5">
          <div className="whitespace-pre-wrap">{message.content}</div>
        </div>
        {message.timestamp && (
          <span className="text-slate-500 text-xs mt-1 mr-1">
            {formatTime(message.timestamp)}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start my-2">
      <div className="max-w-xs md:max-w-2xl bg-slate-800 text-slate-100 rounded-2xl rounded-tl-sm px-4 py-2.5">
        <div
          className="prose prose-invert prose-sm max-w-none
          prose-headings:text-white prose-headings:font-semibold
          prose-p:text-slate-100 prose-p:leading-relaxed
          prose-strong:text-white
          prose-ul:text-slate-100 prose-ol:text-slate-100
          prose-li:text-slate-100 prose-li:marker:text-violet-400
          prose-code:text-violet-300 prose-code:bg-slate-700 prose-code:px-1 prose-code:rounded"
        >
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
        {message.citations && message.citations.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {message.citations.map((c, idx) => {
              const fileName = c.location?.split("/").pop() || "Source";
              return (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 bg-slate-700 rounded-lg px-2 py-0.5 text-slate-400 text-xs"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span className="truncate max-w-40">{fileName}</span>
                </span>
              );
            })}
          </div>
        )}
      </div>
      {message.timestamp && (
        <span className="text-slate-500 text-xs mt-1 ml-1">
          {formatTime(message.timestamp)}
        </span>
      )}
    </div>
  );
}
