'use client';

import { useEffect, useRef, useState } from 'react';
import ChatTopBar from './ChatTopBar';
import MessageList from './MessageList';
import ChatInput from './ChatInput';

export default function ChatShell({ sessionId: initialSessionId, subject, userLanguage, userName }) {
  const [messages, setMessages] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(initialSessionId);
  const [language, setLanguage] = useState(userLanguage || 'english');
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef(null);

  useEffect(() => {
    // load existing session messages if sessionId provided
    async function load() {
      if (!currentSessionId) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/session/${currentSessionId}`);
        if (res.ok) {
          const data = await res.json();
          setMessages(data.messages || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [currentSessionId]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  async function handleSend(payload) {
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: payload.text,
          sessionId: currentSessionId,
          language,
          subject,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        // append messages
        setMessages((m) => [...m, { role: 'user', content: payload.text }, { role: 'assistant', content: data.answer, citations: data.citations }]);
        if (data.sessionId) setCurrentSessionId(data.sessionId);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <ChatTopBar subject={subject} language={language} onLanguageToggle={() => setLanguage((l) => (l === 'english' ? 'roman-urdu' : 'english'))} />

      <main className="flex-1 overflow-y-auto px-4 py-6">
        {messages.length === 0 && !loading ? (
          <div className="max-w-3xl mx-auto">
            <div className="mt-24">
              <p className="text-slate-400 text-center">Ask anything about your uploaded materials</p>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            <MessageList messages={messages} loading={loading} bottomRef={bottomRef} />
          </div>
        )}
      </main>

      <ChatInput onSend={handleSend} loading={loading} />
    </div>
  );
}
