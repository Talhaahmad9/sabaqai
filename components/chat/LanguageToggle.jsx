'use client';

export default function LanguageToggle({ language, onToggle }) {
  const isUr = language === 'roman-urdu';
  return (
    <button
      onClick={onToggle}
      className={`text-white text-xs font-semibold px-3 py-1 rounded-full transition-colors ${isUr ? 'bg-violet-600' : 'bg-slate-700'}`}
      aria-label="Toggle language"
    >
      {isUr ? 'UR' : 'EN'}
    </button>
  );
}
