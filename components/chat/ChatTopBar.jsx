import Link from 'next/link';
import LanguageToggle from './LanguageToggle';

export default function ChatTopBar({ subject, language, onLanguageToggle }) {
  return (
    <header className="flex items-center px-4 h-14 bg-slate-800 border-b border-slate-700">
      <Link href="/dashboard" className="text-slate-300 hover:text-white">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </Link>

      <div className="flex-1 text-center text-white font-semibold truncate">{subject}</div>

      <div className="ml-auto">
        <LanguageToggle language={language} onToggle={onLanguageToggle} />
      </div>
    </header>
  );
}
