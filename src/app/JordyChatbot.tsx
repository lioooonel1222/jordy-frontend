'use client';

import React, {
  useState,
  useRef,
  useEffect,
  KeyboardEvent,
  ChangeEvent,
  FormEvent,
} from 'react';
import { Send, Moon, Sun } from 'lucide-react';

type ChatMessage = {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

const JordyChatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // ✅ Force Cast, kein "never" mehr möglich
  const messagesEndRef = useRef<HTMLDivElement>(null!);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      (messagesEndRef.current as HTMLDivElement).scrollIntoView({
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    const userMessage: ChatMessage = {
      id: Date.now(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setTimeout(() => {
      const botMessage: ChatMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: `Hi! Ich bin Jordy und habe verstanden: "${userMessage.content}"`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const autoResize = (e: FormEvent<HTMLTextAreaElement>) => {
    const el = e.currentTarget;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  };

  return (
    <div className={isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-white text-gray-900'}>
      <header className="p-4 border-b flex justify-between items-center">
        <h1 className="font-bold">Jordy</h1>
        <button onClick={() => setIsDarkMode((d) => !d)}>
          {isDarkMode ? <Sun /> : <Moon />}
        </button>
      </header>

      <main className="max-w-2xl mx-auto h-screen flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {messages.map((m) => (
            <div key={m.id} className={m.role === 'user' ? 'text-right' : 'text-left'}>
              <span className="inline-block px-3 py-2 rounded bg-gray-200 dark:bg-gray-700">
                {m.content}
              </span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t flex space-x-2">
          <textarea
            value={inputValue}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onInput={autoResize}
            className="flex-1 border rounded p-2 resize-none"
            placeholder="Schreibe eine Nachricht..."
          />
          <button
            onClick={handleSendMessage}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            <Send />
          </button>
        </div>
      </main>
    </div>
  );
};

export default JordyChatbot;
