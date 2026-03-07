'use client';

import { useState } from 'react';

export default function StepSubjects({ subjects, onChange }) {
  const [input, setInput] = useState('');

  function addSubject() {
    const trimmed = input.trim();
    if (!trimmed || subjects.includes(trimmed) || subjects.length >= 6) return;
    onChange([...subjects, trimmed]);
    setInput('');
  }

  function removeSubject(name) {
    onChange(subjects.filter((s) => s !== name));
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSubject();
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-white">What subjects are you studying this semester?</h2>
        <p className="text-slate-400 text-sm mt-1">Add up to 6 subjects.</p>
      </div>

      {/* Input row */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. Control Systems"
          maxLength={50}
          disabled={subjects.length >= 6}
          className="flex-1 px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-600 text-white
            placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500
            focus:border-transparent transition disabled:opacity-40 disabled:cursor-not-allowed"
        />
        <button
          type="button"
          onClick={addSubject}
          disabled={!input.trim() || subjects.length >= 6}
          className="px-4 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-40
            disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors"
        >
          Add
        </button>
      </div>

      {/* Chips */}
      {subjects.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {subjects.map((subject) => (
            <span
              key={subject}
              className="inline-flex items-center gap-1.5 bg-violet-900/40 border border-violet-700
                text-violet-300 rounded-full px-3 py-1 text-sm font-medium"
            >
              {subject}
              <button
                type="button"
                onClick={() => removeSubject(subject)}
                aria-label={`Remove ${subject}`}
                className="text-violet-400 hover:text-white transition-colors leading-none ml-0.5"
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      )}

      <p className="text-slate-500 text-xs">{subjects.length}/6 subjects</p>
    </div>
  );
}
