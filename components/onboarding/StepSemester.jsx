'use client';

export default function StepSemester({ value, onChange }) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-white">Which semester are you in?</h2>
        <p className="text-slate-400 text-sm mt-1">This helps us tailor content to your level.</p>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {Array.from({ length: 8 }, (_, i) => i + 1).map((sem) => {
          const selected = value === sem;
          return (
            <button
              key={sem}
              type="button"
              onClick={() => onChange(sem)}
              className={`py-3 rounded-xl border text-sm font-semibold transition-all
                ${selected
                  ? 'bg-violet-600/20 border-violet-500 text-white'
                  : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white'}`}
            >
              {sem}
            </button>
          );
        })}
      </div>
    </div>
  );
}
