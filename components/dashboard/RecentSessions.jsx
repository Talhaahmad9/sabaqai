function timeAgo(date) {
  const now = new Date();
  const then = new Date(date);
  const seconds = Math.floor((now - then) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'Just now';
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  if (days === 1) return 'Yesterday';
  return then.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function ChevronRightIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

function ChatBubbleIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
    </svg>
  );
}

function EmptyState() {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 flex flex-col items-center gap-3">
      <ChatBubbleIcon className="h-10 w-10 text-slate-600" />
      <p className="text-slate-400 font-medium">No sessions yet</p>
      <p className="text-slate-500 text-sm text-center">
        Upload your materials and start studying!
      </p>
    </div>
  );
}

function SessionCard({ session }) {
  const messageCount = session.messages?.length ?? 0;

  return (
    <div className="bg-slate-800 border border-slate-700 hover:border-slate-500 rounded-xl p-4 flex items-center gap-4 transition-colors">
      {/* Icon box */}
      <div className="bg-violet-900 rounded-lg p-2 shrink-0">
        <span className="text-xl">📚</span>
      </div>

      {/* Middle: subject + message count */}
      <div className="flex-1 min-w-0">
        <p className="text-white font-medium truncate">{session.subject ?? 'Untitled Session'}</p>
        <p className="text-slate-400 text-sm">
          {messageCount} {messageCount === 1 ? 'message' : 'messages'}
        </p>
      </div>

      {/* Right: date + chevron */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-slate-500 text-xs">{timeAgo(session.createdAt)}</span>
        <ChevronRightIcon className="h-4 w-4 text-slate-600" />
      </div>
    </div>
  );
}

export default function RecentSessions({ sessions }) {
  const hasSessions = sessions && sessions.length > 0;
  const recent = hasSessions ? [...sessions].slice(0, 5) : [];

  if (!hasSessions) return <EmptyState />;

  return (
    <div className="space-y-3">
      {recent.map((session) => (
        <SessionCard key={session._id} session={session} />
      ))}

      {sessions.length > 0 && (
        <div className="flex justify-center pt-1">
          <button className="text-sm text-slate-300 bg-slate-700 hover:bg-slate-600 rounded-lg px-4 py-2 transition-colors">
            View all sessions
          </button>
        </div>
      )}
    </div>
  );
}
