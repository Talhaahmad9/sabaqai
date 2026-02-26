function ClockIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function ChatIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
    </svg>
  );
}

function BookIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );
}

function WarningIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );
}

function StatCard({ label, value, bottomText, icon, valueClassName = 'text-white' }) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-400">{label}</span>
        <span className="text-violet-400">{icon}</span>
      </div>
      <p className={`text-3xl font-bold ${valueClassName}`}>{value}</p>
      <p className="text-xs text-slate-500">{bottomText}</p>
    </div>
  );
}

export default function StatCards({ hoursStudied, sessionsDone, topicsCovered, weakTopicsCount }) {
  const cards = [
    {
      label: 'Hours Studied',
      value: hoursStudied,
      bottomText: 'Total time',
      icon: <ClockIcon className="h-5 w-5" />,
    },
    {
      label: 'Sessions Done',
      value: sessionsDone,
      bottomText: 'Study sessions',
      icon: <ChatIcon className="h-5 w-5" />,
    },
    {
      label: 'Topics Covered',
      value: topicsCovered,
      bottomText: 'Concepts learned',
      icon: <BookIcon className="h-5 w-5" />,
    },
    {
      label: 'Weak Topics',
      value: weakTopicsCount,
      bottomText: 'Need revision',
      icon: <WarningIcon className="h-5 w-5" />,
      valueClassName: weakTopicsCount > 0 ? 'text-orange-400' : 'text-white',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </div>
  );
}
