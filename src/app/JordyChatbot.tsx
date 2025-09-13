'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Moon, Sun, Mic, VolumeX } from 'lucide-react';

type ChatMessage = {
  id: number;
  role: 'user' | 'assistant';
  content: string;
};

export default function JordyChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Ref für Auto-Scroll
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ✅ jetzt echter API-Call
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      role: 'user',
      content: inputValue,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.content }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'assistant',
          content:
            data?.reply ??
            'Es gab ein Problem beim Antworten. Bitte später nochmal versuchen.',
        },
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'assistant',
          content: '⚠️ Netzwerkfehler oder Server nicht erreichbar.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={
        isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-white text-gray-900'
      }
    >
      {/* Header */}
      <header className="p-4 border-b flex justify-between items-center">
        <h1 className="font-bold">Jordy</h1>
        <button
          onClick={() => setIsDarkMode((d) => !d)}
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </header>

      {/* Chat */}
      <main className="flex flex-col h-screen max-w-2xl mx-auto">
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {messages.map((m) => (
            <div
              key={m.id}
              className={m.role === 'user' ? 'text-right' : 'text-left'}
            >
              <span
                className={`inline-block px-3 py-2 rounded ${
                  m.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-black dark:bg-gray-700 dark:text-white'
                }`}
              >
                {m.content}
              </span>
            </div>
          ))}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="text-left text-gray-500 dark:text-gray-400">
              Jordy tippt…
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1 border rounded p-2 dark:bg-gray-800"
            placeholder="Schreibe eine Nachricht..."
          />
          <button
            onClick={handleSendMessage}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            <Send size={20} />
          </button>

          {/* Platzhalter Buttons */}
          <button className="p-2 text-gray-500 dark:text-gray-300">
            <Mic size={20} />
          </button>
          <button className="p-2 text-gray-500 dark:text-gray-300">
            <VolumeX size={20} />
          </button>
        </div>
      </main>
    </div>
  );
}
