function WarningIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );
}

export default function WeakTopics({ topics }) {
  const hasTopics = topics && topics.length > 0;

  if (!hasTopics) {
    return (
      <p className="text-slate-500 text-sm">No weak topics yet — great work! 🎉</p>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {topics.map((topic) => (
          <span
            key={topic}
            className="inline-flex items-center gap-1.5 bg-orange-900/40 border border-orange-800 text-orange-400 rounded-full px-3 py-1 text-sm font-medium"
          >
            <WarningIcon className="h-3.5 w-3.5 shrink-0" />
            {topic}
          </span>
        ))}
      </div>
      <p className="text-slate-500 text-xs italic">
        Topics you asked about more than twice appear here
      </p>
    </div>
  );
}
