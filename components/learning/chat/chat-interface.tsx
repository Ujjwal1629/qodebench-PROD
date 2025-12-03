'use client';

import { useState, useEffect, useRef } from 'react';
import { Loader2, Sparkles, Code, Lightbulb, MessageSquare, Bot } from 'lucide-react';
import { ChatMessage } from './chat-message';
import { ChatInput } from './chat-input';
import { ChatMode, ChatMessage as ChatMessageType } from '@/types/learning';
import { useQuery } from '@tanstack/react-query';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ChatInterfaceProps {
  lessonId: string;
  lessonTitle: string;
  lessonContent: string;
}

const chatModes: Array<{ mode: ChatMode; label: string; icon: any; description: string }> = [
  { mode: 'chat', label: 'Chat', icon: MessageSquare, description: 'General discussion' },
  { mode: 'example', label: 'Examples', icon: Code, description: 'Get code examples' },
  { mode: 'hint', label: 'Hints', icon: Lightbulb, description: 'Quiz hints' },
];

export function ChatInterface({ lessonId, lessonTitle, lessonContent }: ChatInterfaceProps) {
  const [currentMode, setCurrentMode] = useState<ChatMode>('chat');
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [shouldLoadHistory, setShouldLoadHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // OPTIMIZED: Lazy load chat history - only fetch when user interacts
  // This prevents unnecessary API calls on page load
  const { data: chatHistory, isLoading: isLoadingHistory } = useQuery({
    queryKey: ['chat-history', lessonId],
    queryFn: async () => {
      const response = await fetch(`/api/learning/chat/history?lesson_id=${lessonId}`);
      if (!response.ok) throw new Error('Failed to fetch chat history');
      return response.json() as Promise<ChatMessageType[]>;
    },
    enabled: shouldLoadHistory, // Only fetch when explicitly enabled
  });

  // Load history once when component becomes interactive
  useEffect(() => {
    // Set a small delay to avoid loading on initial render
    // Only load if user stays on the page (component mounted for > 500ms)
    const timer = setTimeout(() => {
      setShouldLoadHistory(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (chatHistory) {
      setMessages(chatHistory);
    }
  }, [chatHistory]);

  // Optimized scroll - only auto-scroll if user is near bottom
  const scrollToBottom = () => {
    const scrollArea = messagesEndRef.current?.parentElement;
    if (!scrollArea) return;

    const isNearBottom = scrollArea.scrollHeight - scrollArea.scrollTop - scrollArea.clientHeight < 100;

    if (isNearBottom || isStreaming) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    // Debounce scroll updates during streaming
    const timeoutId = setTimeout(() => {
      scrollToBottom();
    }, 50); // Small delay to batch multiple updates

    return () => clearTimeout(timeoutId);
  }, [messages, isStreaming]);

  const handleSendMessage = async (message: string) => {
    if (isStreaming) return; // Prevent sending while streaming

    // Add user message immediately
    const userMessage: ChatMessageType = {
      id: `temp-user-${Date.now()}`,
      user_id: '',
      lesson_id: lessonId,
      message: message,
      role: 'user',
      mode: currentMode,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsStreaming(true);

    // Create a placeholder for assistant message
    const assistantMessageId = `temp-assistant-${Date.now()}`;
    const assistantMessage: ChatMessageType = {
      id: assistantMessageId,
      user_id: '',
      lesson_id: lessonId,
      message: '',
      role: 'assistant',
      mode: currentMode,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, assistantMessage]);

    try {
      // Get full response at once (like AI Senior Dev)
      const response = await fetch('/api/learning/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lesson_id: lessonId,
          message,
          mode: currentMode,
          lesson_context: lessonContent,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle daily limit error
        if (response.status === 429 && data.requiresUpgrade) {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId
                ? { ...msg, message: `⚠️ ${data.error}\n\nUpgrade to get unlimited AI assistance!` }
                : msg
            )
          );
        } else {
          throw new Error(data.error || 'Failed to send message');
        }
        return;
      }

      // Update with full response at once
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? { ...msg, message: data.message || data.response || '' }
            : msg
        )
      );
    } catch (error) {
      console.error('Chat error:', error);
      // Update message with error
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? { ...msg, message: 'Sorry, I encountered an error. Please try again.' }
            : msg
        )
      );
    } finally {
      setIsStreaming(false);
    }
  };

  const welcomeMessage: Record<ChatMode, string> = {
    chat: `Hi! I'm your development mentor. With years of experience in web development, I'm here to help you master ${lessonTitle}. Ask me anything about the concepts, best practices, or real-world applications.`,
    example: `Ready to see how professionals implement these concepts? I'll show you production-ready code examples and explain the reasoning behind design decisions.`,
    hint: `Thinking through the quiz? I'll guide you with strategic hints that help you learn, not just find answers. Let's develop your problem-solving skills.`,
    explain: `Hi! I'm your development mentor. With years of experience in web development, I'm here to help you master ${lessonTitle}. Ask me anything about the concepts, best practices, or real-world applications.`,
    progress: `Hi! I'm your development mentor. With years of experience in web development, I'm here to help you master ${lessonTitle}. Ask me anything about the concepts, best practices, or real-world applications.`,
  };

  // Generate suggested questions based on lesson title
  const getSuggestedQuestions = (): string[] => {
    const baseQuestions = [
      `What are the best practices for ${lessonTitle}?`,
      `Can you show me a real-world example of ${lessonTitle}?`,
      `What common mistakes should I avoid with ${lessonTitle}?`,
    ];

    if (currentMode === 'example') {
      return [
        `Show me a professional code example`,
        `How would this be used in production?`,
        `What are some advanced techniques?`,
      ];
    } else if (currentMode === 'hint') {
      return [
        `Give me a hint for the current quiz`,
        `Help me understand the concept better`,
        `What should I focus on?`,
      ];
    }

    return baseQuestions;
  };

  const handleSuggestedQuestion = (question: string) => {
    handleSendMessage(question);
  };

  return (
    <div className="h-full w-full flex flex-col bg-white">
      {/* Mode Selector Pills - Clean design without duplicate header */}
      <div className="border-b border-gray-200 bg-gray-50/50 px-6 py-3 flex-shrink-0">
        <div className="flex gap-2">
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
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-b from-white to-gray-50/50">
        {/* Messages Area */}
        <ScrollArea className="flex-1 w-full">
          <div className="space-y-4 px-6 py-4 w-full">
            {isLoadingHistory ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-sky-600" />
                  <p className="text-sm text-gray-600 font-medium">Loading chat history...</p>
                </div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[280px] text-center py-6">
                <div className="relative mb-5">
                  <div className="bg-gradient-to-br from-sky-500 to-blue-600 p-6 rounded-2xl shadow-xl">
                    <Bot className="h-12 w-12 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-400 rounded-full border-2 border-white shadow-sm"></div>
                </div>
                <h3 className="font-bold text-lg mb-2 text-gray-900 flex items-center gap-2 justify-center">
                  Ready to Learn? Let's Go!
                  <Sparkles className="h-5 w-5 text-purple-500" />
                </h3>
                <p className="text-sm text-gray-600 max-w-md leading-relaxed mb-5">
                  {welcomeMessage[currentMode]}
                </p>

                {/* Suggested Questions */}
                <div className="w-full max-w-lg space-y-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Quick Questions:</p>
                  <div className="space-y-2">
                    {getSuggestedQuestions().map((question, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestedQuestion(question)}
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
              {messages.map((msg, index) => {
                const isLastMessage = index === messages.length - 1;
                const isCurrentlyStreaming = isStreaming && msg.role === 'assistant' && isLastMessage;

                return (
                  <ChatMessage
                    key={msg.id}
                    message={msg.message || ''}
                    role={msg.role}
                    timestamp={msg.created_at}
                    isStreaming={isCurrentlyStreaming}
                  />
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t border-sky-100 p-5 bg-gradient-to-b from-white to-gray-50">
          <ChatInput
            onSendMessage={handleSendMessage}
            disabled={isStreaming}
            placeholder={isStreaming ? "Tutor is typing..." : `Ask your senior dev tutor about ${lessonTitle.toLowerCase()}...`}
          />
          <div className="flex items-center justify-center gap-2 mt-3">
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
