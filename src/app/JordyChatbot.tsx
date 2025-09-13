'use client';

import React, {
  useState,
  useRef,
  useEffect,
  KeyboardEvent,
  ChangeEvent,
  FormEvent,
} from 'react';
import { Send, Moon, Sun, Mic, VolumeX } from 'lucide-react';

type ChatMessage = {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

const JordyChatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  // ✅ ref explizit typisiert
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setShowWelcome(false);

    // Demo-Antwort
    setTimeout(() => {
      const botMessage: ChatMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: `Hi! Ich bin Jordy und habe verstanden: "${userMessage.content}".`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
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
    <div className={isDarkMode ? 'dark' : ''}>
      <div
        className={`min-h-screen transition-colors duration-300 ${
          isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
        }`}
      >
        {/* Header */}
        <header className="border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between">
          <h1 className="font-bold text-xl">Jordy</h1>
          <button onClick={() => setIsDarkMode((v) => !v)}>
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </header>

        {/* Chat */}
        <main className="max-w-2xl mx-auto p-4 flex flex-col h-screen">
          <div className="flex-1 overflow-y-auto space-y-2">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <span
                  className={`px-4 py-2 rounded-lg ${
                    m.role === 'user'
                      ? 'bg-gradient-to-r from-violet-500 to-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  {m.content}
                </span>
              </div>
            ))}
            {isLoading && (
              <div className="text-gray-500 text-sm">Jordy tippt …</div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-2 flex space-x-2">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onInput={autoResize}
              className="flex-1 border rounded-lg p-2 resize-none outline-none"
              placeholder="Schreibe eine Nachricht..."
              rows={1}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="px-4 py-2 bg-gradient-to-r from-violet-500 to-blue-600 text-white rounded-lg disabled:opacity-50"
            >
              <Send size={20} />
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default JordyChatbot;
