export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center mt-24">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.343-3 3v6h6v-6c0-1.657-1.343-3-3-3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h8M8 11h8" />
      </svg>
      <p className="text-slate-400 text-sm mt-3">Ask anything about your uploaded materials</p>
    </div>
  );
}
