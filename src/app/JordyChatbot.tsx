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

  // ✅ WICHTIG: Refs sauber typisieren
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

    // Demo-Antwort (später Backend-Aufruf)
    setTimeout(() => {
      const botMessage: ChatMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: `Hi! Ich bin Jordy und habe verstanden: "${userMessage.content}". In der finalen Version route ich zwischen GPT-4o-mini und Claude 3.5.`,
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

  const formatTime = (ts: Date) =>
    ts.toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit' });

  const inputBgClass = isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div
        className={`min-h-screen transition-colors duration-300 ${
          isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
        }`}
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        {/* Header */}
        <header className="border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-500 to-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">J</span>
              </div>
              <div>
                <h1 className="font-bold text-xl">Jordy</h1>
                <p className="text-sm opacity-70">Dein smarter Assistent</p>
              </div>
            </div>

            <button
              onClick={() => setIsDarkMode((v) => !v)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Theme umschalten"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </header>

        {/* Chat Container */}
        <div className="max-w-4xl mx-auto h-screen flex flex-col">
          {/* Welcome Screen */}
          {showWelcome && messages.length === 0 && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-6 p-8">
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-violet-500 to-blue-600 flex items-center justify-center">
                  <span className="text-white font-bold text-3xl">J</span>
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">Hi, ich bin Jordy</h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Dein smarter Assistent für Alltag und komplexe Aufgaben
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto text-sm">
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <div className="font-semibold text-violet-600 dark:text-violet-400">🤖 Intelligent</div>
                    <p className="text-gray-600 dark:text-gray-400">GPT + Claude Hybrid-System</p>
                  </div>
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <div className="font-semibold text-blue-600 dark:text-blue-400">🧠 Lernfähig</div>
                    <p className="text-gray-600 dark:text-gray-400">Merkt sich deine Präferenzen</p>
                  </div>
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <div className="font-semibold text-gray-600 dark:text-gray-400">💬 Vielseitig</div>
                    <p className="text-gray-600 dark:text-gray-400">Von Alltag bis Essays</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className="flex items-end space-x-2 max-w-[80%]">
                  {m.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">J</span>
                    </div>
                  )}
                  <div className="space-y-1">
                    <div
                      className={`px-4 py-3 rounded-2xl ${
                        m.role === 'user'
                          ? 'bg-gradient-to-r from-violet-500 to-blue-600 text-white'
                          : `${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} text-gray-900 dark:text-white`
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{m.content}</p>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 px-2">{formatTime(m.timestamp)}</div>
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-end space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-500 to-blue-600 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">J</span>
                  </div>
                  <div className={`px-4 py-3 rounded-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex space-x-2">
                <div className={`flex-1 border rounded-lg p-3 ${inputBgClass}`}>
                  <div className="flex items-end space-x-2">
                    <textarea
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      onInput={autoResize}
                      placeholder="Schreibe eine Nachricht..."
                      className="flex-1 resize-none outline-none bg-transparent"
                      rows={1}
                      style={{ minHeight: '24px', maxHeight: '120px' }}
                    />
                    <div className="flex space-x-1">
                      <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" aria-label="Spracheingabe (später)">
                        <Mic size={16} />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" aria-label="Audio stumm (später)">
                        <VolumeX size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="px-4 py-3 bg-gradient-to-r from-violet-500 to-blue-600 text-white rounded-lg hover:from-violet-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  aria-label="Senden"
                >
                  <Send size={20} />
                </button>
              </div>

              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                Jordy kann Fehler machen. Überprüfe wichtige Informationen.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JordyChatbot;
