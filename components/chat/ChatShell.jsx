"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ChatTopBar from "./ChatTopBar";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";

export default function ChatShell({
  sessionId: initialSessionId,
  subject,
  userLanguage,
  userName,
}) {
  const [messages, setMessages] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(initialSessionId);
  const [language, setLanguage] = useState(userLanguage || "english");
  const [loading, setLoading] = useState(false);
  const [streamingText, setStreamingText] = useState("");

  const bottomRef = useRef(null);
  const router = useRouter();

  // Load existing session messages
  useEffect(() => {
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
  }, []);

  // Auto scroll
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading, streamingText]);

  // Typing effect helper
  function typeText(text, onUpdate, onDone) {
    let i = 0;
    const interval = setInterval(() => {
      i++;
      onUpdate(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        onDone();
      }
    }, 8);
    return interval;
  }

  async function handleSend(payload) {
    const userMessage = {
      role: "user",
      content: payload.text,
      timestamp: new Date().toISOString(),
    };

    // Fix #3 — append user message immediately
    setMessages((m) => [...m, userMessage]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: payload.text,
          sessionId: currentSessionId,
          language,
          subject,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        const newSessionId = data.sessionId?.toString();

        // Update URL with sessionId for history persistence — Fix #1
        if (!currentSessionId && newSessionId) {
          setCurrentSessionId(newSessionId);
          router.replace(
            `/chat/${newSessionId}?subject=${encodeURIComponent(subject)}`,
          );
        }

        setLoading(false);

        // Fix #6 — typing effect
        typeText(
          data.answer,
          (partial) => setStreamingText(partial),
          () => {
            setStreamingText("");
            setMessages((m) => [
              ...m,
              {
                role: "assistant",
                content: data.answer,
                citations: data.citations,
                timestamp: new Date().toISOString(),
              },
            ]);
          },
        );
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-screen bg-slate-900">
      <ChatTopBar
        subject={subject}
        language={language}
        onLanguageToggle={() =>
          setLanguage((l) => (l === "english" ? "roman-urdu" : "english"))
        }
      />

      <main className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto">
          {messages.length === 0 && !loading && !streamingText ? (
            <div className="mt-24 text-center">
              <p className="text-slate-400">
                Ask anything about your uploaded materials
              </p>
            </div>
          ) : (
            <MessageList
              messages={messages}
              loading={loading}
              streamingText={streamingText}
              bottomRef={bottomRef}
            />
          )}
        </div>
      </main>

      <ChatInput onSend={handleSend} loading={loading || !!streamingText} />
    </div>
  );
}
