'use client';

import { useEffect, useRef, useState } from 'react';

export default function ChatInput({ onSend, loading }) {
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = 'auto';
    textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + 'px';
  }, [text]);

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  async function submit() {
    if (!text.trim() || loading) return;
    const payload = { text: text.trim() };
    setText('');
    await onSend(payload);
  }

  return (
    <div className="bg-slate-800 border-t border-slate-700 px-4 py-3">
      <div className="flex gap-3 items-end">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="Ask a question or paste text from your PDF..."
          className="flex-1 min-h-10 max-h-40 resize-none px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
        <button
          onClick={submit}
          disabled={!text.trim() || loading}
          className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white"
          aria-label="Send"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M22 2l-7 20  -4-9-9-4 20-7z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
