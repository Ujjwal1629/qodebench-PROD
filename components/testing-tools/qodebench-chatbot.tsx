'use client';

import { useState, useEffect, useRef } from 'react';
import { Sparkles, Code, Lightbulb, MessageSquare, Bot, RotateCcw } from 'lucide-react';
import { ChatMessage } from '@/components/learning/chat/chat-message';
import { ChatInput } from '@/components/learning/chat/chat-input';
import { ChatMode } from '@/types/learning';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: string;
  message: string;
  role: 'user' | 'assistant';
  created_at: string;
}

const TOPICS = 'JavaScript, TypeScript, React, web development and QA automation';

const chatModes: Array<{ mode: ChatMode; label: string; icon: any }> = [
  { mode: 'chat', label: 'Chat', icon: MessageSquare },
  { mode: 'example', label: 'Examples', icon: Code },
  { mode: 'hint', label: 'Hints', icon: Lightbulb },
];

const welcomeMessage: Partial<Record<ChatMode, string>> = {
  chat: `Hi! I'm your development mentor. Ask me anything about ${TOPICS} — concepts, best practices, or real-world applications.`,
  example: `Ready to see how professionals implement these concepts? I'll show you production-ready code examples and explain the reasoning behind design decisions.`,
  hint: `Stuck on something? I'll guide you with strategic hints that help you learn, not just find answers. Let's develop your problem-solving skills.`,
};

const suggestedQuestions: Partial<Record<ChatMode, string[]>> = {
  chat: [
    'What is the difference between let, const and var in JavaScript?',
    'Why should I use TypeScript over JavaScript?',
    'How do I start with Playwright for test automation?',
  ],
  example: [
    'Show me a professional code example',
    'How would this be used in production?',
    'What are some advanced techniques?',
  ],
  hint: [
    'Give me a hint for writing my first test',
    'Help me understand async/await better',
    'What should I focus on?',
  ],
};

export function QodeBenchChatbot() {
  const [currentMode, setCurrentMode] = useState<ChatMode>('chat');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
    return () => clearTimeout(timeoutId);
  }, [messages, isStreaming]);

  const handleSendMessage = async (message: string) => {
    if (isStreaming) return;

    const now = Date.now();
    const assistantMessageId = `assistant-${now}`;

    setMessages((prev) => [
      ...prev,
      { id: `user-${now}`, message, role: 'user', created_at: new Date().toISOString() },
      { id: assistantMessageId, message: '', role: 'assistant', created_at: new Date().toISOString() },
    ]);
    setIsStreaming(true);

    const setAssistantMessage = (text: string) =>
      setMessages((prev) =>
        prev.map((msg) => (msg.id === assistantMessageId ? { ...msg, message: text } : msg))
      );

    try {
      const response = await fetch('/api/qodebench-chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, mode: currentMode }),
      });

      const data = await response.json();

      if (!response.ok) {
        setAssistantMessage(`⚠️ ${data.error || 'Failed to send message'}`);
        return;
      }

      setAssistantMessage(data.message || '');
    } catch (error) {
      console.error('Chat error:', error);
      setAssistantMessage('Sorry, I encountered an error. Please try again.');
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-white">
      {/* Mode Selector Pills */}
      <div className="border-b border-gray-200 bg-gray-50/50 px-4 sm:px-6 py-3 flex-shrink-0">
        <div className="flex items-center gap-2">
          {chatModes.map(({ mode, label, icon: Icon }) => (
            <button
              key={mode}
              onClick={() => setCurrentMode(mode)}
              className={`px-5 py-3 md:px-4 md:py-2 rounded-lg text-xs font-medium transition-all min-h-[44px] ${
                currentMode === mode
                  ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 hover:border-sky-300'
              }`}
            >
              <Icon className="h-3.5 w-3.5 inline mr-1.5" />
              {label}
            </button>
          ))}
          {messages.length > 0 && (
            <button
              onClick={() => setMessages([])}
              disabled={isStreaming}
              className="ml-auto flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">New chat</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-b from-white to-gray-50/50">
        {/* Messages Area */}
        <ScrollArea className="flex-1 w-full">
          <div className="space-y-4 px-4 sm:px-6 py-4 w-full">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[280px] text-center py-6">
                <div className="relative mb-5">
                  <div className="bg-gradient-to-br from-sky-500 to-blue-600 p-6 rounded-2xl shadow-xl">
                    <Bot className="h-12 w-12 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-400 rounded-full border-2 border-white shadow-sm"></div>
                </div>
                <h3 className="font-bold text-lg mb-2 text-gray-900 flex items-center gap-2 justify-center">
                  Ready to Learn? Let&apos;s Go!
                  <Sparkles className="h-5 w-5 text-purple-500" />
                </h3>
                <p className="text-sm text-gray-600 max-w-md leading-relaxed mb-5">
                  {welcomeMessage[currentMode]}
                </p>

                {/* Suggested Questions */}
                <div className="w-full max-w-lg space-y-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Quick Questions:</p>
                  <div className="space-y-2">
                    {(suggestedQuestions[currentMode] || []).map((question) => (
                      <button
                        key={question}
                        onClick={() => handleSendMessage(question)}
                        disabled={isStreaming}
                        className="w-full text-left px-4 py-3 rounded-xl border-2 border-sky-200 bg-white hover:bg-sky-50 hover:border-sky-400 transition-all text-sm text-gray-700 hover:text-sky-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed group"
                      >
                        <Sparkles className="h-4 w-4 inline mr-2 text-gray-400 group-hover:text-sky-500" />
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg, index) => (
                  <ChatMessage
                    key={msg.id}
                    message={msg.message}
                    role={msg.role}
                    timestamp={msg.created_at}
                    isStreaming={isStreaming && msg.role === 'assistant' && index === messages.length - 1}
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t border-sky-100 p-4 sm:p-5 bg-gradient-to-b from-white to-gray-50">
          <ChatInput
            onSendMessage={handleSendMessage}
            disabled={isStreaming}
            placeholder={isStreaming ? 'Tutor is typing...' : 'Ask your senior dev tutor anything...'}
          />
          <div className="hidden sm:flex items-center justify-center gap-2 mt-3">
            <div className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono shadow-sm">
                Enter
              </kbd>
              <span className="text-xs text-gray-500">to send</span>
            </div>
            <span className="text-gray-300">•</span>
            <div className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono shadow-sm">
                Shift+Enter
              </kbd>
              <span className="text-xs text-gray-500">new line</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
