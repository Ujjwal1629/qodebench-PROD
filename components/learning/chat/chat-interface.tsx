'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Sparkles, Code, Lightbulb, TrendingUp, MessageSquare, GraduationCap } from 'lucide-react';
import { ChatMessage } from './chat-message';
import { ChatInput } from './chat-input';
import { ChatMode, ChatMessage as ChatMessageType } from '@/types/learning';
import { useMutation, useQuery } from '@tanstack/react-query';
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch chat history
  const { data: chatHistory, isLoading: isLoadingHistory } = useQuery({
    queryKey: ['chat-history', lessonId],
    queryFn: async () => {
      const response = await fetch(`/api/learning/chat/history?lesson_id=${lessonId}`);
      if (!response.ok) throw new Error('Failed to fetch chat history');
      return response.json() as Promise<ChatMessageType[]>;
    },
  });

  useEffect(() => {
    if (chatHistory) {
      setMessages(chatHistory);
    }
  }, [chatHistory]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
      // Start streaming
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

      if (!response.ok) throw new Error('Failed to send message');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error('No reader available');

      let accumulatedMessage = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulatedMessage += chunk;

        // Update the assistant message with accumulated content
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, message: accumulatedMessage }
              : msg
          )
        );
      }
    } catch (error) {
      console.error('Streaming error:', error);
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

  const welcomeMessage = {
    chat: `Hi! I'm your development mentor. With years of experience in web development, I'm here to help you master ${lessonTitle}. Ask me anything about the concepts, best practices, or real-world applications.`,
    example: `Ready to see how professionals implement these concepts? I'll show you production-ready code examples and explain the reasoning behind design decisions.`,
    hint: `Thinking through the quiz? I'll guide you with strategic hints that help you learn, not just find answers. Let's develop your problem-solving skills.`,
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
    <Card className="h-full w-full flex flex-col border-0 shadow-none">
      <CardHeader className="border-b bg-gradient-to-r from-purple-100 to-indigo-100 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2 font-semibold text-slate-800">
              <div className="bg-purple-700 p-2 rounded-lg shadow-sm">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              Your Development Mentor
            </CardTitle>
            <p className="text-xs text-slate-600 mt-1.5 font-medium">Professional guidance for your learning journey</p>
          </div>
        </div>

        {/* Mode Selector Pills */}
        <div className="flex gap-2 pt-4">
          {chatModes.map(({ mode, label, icon: Icon }) => (
            <button
              key={mode}
              onClick={() => setCurrentMode(mode)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                currentMode === mode
                  ? 'bg-purple-700 text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-purple-50 hover:text-purple-700 border border-purple-200 hover:border-purple-300'
              }`}
            >
              <Icon className="h-3.5 w-3.5 inline mr-1.5" />
              {label}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden bg-gradient-to-b from-white to-purple-50/10">
        {/* Messages Area */}
        <ScrollArea className="flex-1 w-full">
          <div className="space-y-4 px-6 py-4 w-full">
            {isLoadingHistory ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[450px] text-center py-8">
                <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-6 rounded-full mb-6 shadow-lg">
                  <GraduationCap className="h-14 w-14 text-white" />
                </div>
                <h3 className="font-semibold text-xl mb-3 text-slate-800">Welcome! Let's Master This Together</h3>
                <p className="text-sm text-slate-600 max-w-lg leading-relaxed mb-6">
                  {welcomeMessage[currentMode]}
                </p>

                {/* Suggested Questions */}
                <div className="w-full max-w-lg space-y-2">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">Suggested Questions</p>
                  <div className="space-y-2">
                    {getSuggestedQuestions().map((question, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestedQuestion(question)}
                        disabled={isStreaming}
                        className="w-full text-left px-4 py-3 rounded-lg border-2 border-purple-200 bg-white hover:bg-purple-50 hover:border-purple-400 transition-all text-sm text-slate-700 hover:text-purple-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Sparkles className="h-4 w-4 inline mr-2 text-purple-600" />
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
        <div className="border-t border-purple-100 p-5 bg-white shadow-sm">
          <ChatInput
            onSendMessage={handleSendMessage}
            disabled={isStreaming}
            placeholder={`Ask your mentor about ${lessonTitle.toLowerCase()}...`}
          />
          <p className="text-xs text-slate-500 mt-2.5 font-medium flex items-center gap-1">
            <span className="text-purple-600">💡</span>
            Press Enter to send • Shift+Enter for new line
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
