'use client';

const COLLEGES = [
  {
    name: 'Computer Science & Information Systems',
    programs: [
      'BS Computer Science',
      'BS Software Engineering',
      'BS Data Science',
      'BS Computer Engineering',
      'BS Actuarial Science & Risk Management',
      'BS Mathematics & Economics',
      'BS Statistics & Business Analytics',
      'BS Mathematics & Computational Finance',
      'BS Technology Management',
    ],
  },
  {
    name: 'Business Management',
    programs: [
      'BBA',
      'BS Entrepreneurship',
      'BS Accounting & Finance',
      'BS Economics & Finance',
      'BS Supply Chain Management',
      'BS Business Intelligence & Analytics',
    ],
  },
  {
    name: 'Economics & Social Development',
    programs: [
      'BS Economics',
      'BS Psychology',
      'BS Media Studies',
      'BS Business & Psychology',
      'B.Ed Honours',
    ],
  },
];

export default function StepProgram({ value, onChange }) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-white">What program are you in?</h2>
        <p className="text-slate-400 text-sm mt-1">Select your current degree program.</p>
      </div>

      <div className="space-y-5 max-h-64 overflow-y-auto pr-1">
        {COLLEGES.map((college) => (
          <div key={college.name} className="space-y-2">
            <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
              {college.name}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {college.programs.map((program) => {
                const selected = value === program;
                return (
                  <button
                    key={program}
                    type="button"
                    onClick={() => onChange(program)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg border text-sm transition-all
                      ${selected
                        ? 'bg-violet-600/20 border-violet-500 text-white'
                        : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white'}`}
                  >
                    {program}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
