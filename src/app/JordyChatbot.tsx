"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import TypingIndicator from "../components/TypingIndicator";

type ChatMessage = {
  id: number;
  role: "user" | "assistant";
  content: string;
};

export default function JordyChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      role: "user",
      content: inputValue,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.content }),
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "assistant", content: data.reply },
      ]);
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: "❌ Fehler: " + e.message,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      {/* Header */}
      <header className="p-4 border-b flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <motion.div
            className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-500 to-blue-600 flex items-center justify-center"
            animate={isLoading ? { scale: [1, 1.1, 1] } : {}}
            transition={{ repeat: Infinity, duration: 1 }}
          >
            <span className="text-white font-bold text-lg">J</span>
          </motion.div>
          <div>
            <h1 className="font-bold text-xl">Jordy</h1>
            <p className="text-sm opacity-70">Dein smarter Assistent</p>
          </div>
        </div>

        <button
          onClick={() => setIsDarkMode((d) => !d)}
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </header>

      {/* Chat */}
      <main className="flex flex-col flex-1 max-w-3xl w-full mx-auto">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl leading-relaxed ${
                  m.role === "user"
                    ? "bg-gradient-to-r from-violet-500 to-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                }`}
              >
                {m.content}
              </div>
            </motion.div>
          ))}

          {isLoading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t p-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1 border rounded-lg p-3 dark:bg-gray-800 outline-none"
              placeholder="Schreib Jordy eine Nachricht..."
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="px-4 py-3 bg-gradient-to-r from-violet-500 to-blue-600 text-white rounded-lg hover:from-violet-600 hover:to-blue-700 transition-all disabled:opacity-50"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
