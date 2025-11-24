'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Lightbulb,
  MessageCircle,
  Search,
  BookOpen,
  Target,
  Send,
  Loader2,
  Bot,
  User,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  mode?: 'hint' | 'chat' | 'review' | 'explain' | 'breakdown';
  timestamp: Date;
}

interface AILearningCompanionProps {
  challengeId: string;
  challengeTitle: string;
  challengeDescription: string;
  currentCode: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export function AILearningCompanion({
  challengeId,
  challengeTitle,
  challengeDescription,
  currentCode,
  difficulty,
}: AILearningCompanionProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (mode: 'hint' | 'chat' | 'review' | 'explain' | 'breakdown', customMessage?: string) => {
    const userMessage = customMessage || inputMessage;

    if (!userMessage.trim() && mode === 'chat') return;

    // ALWAYS add user message to chat for consistent UI
    // This shows what the user requested (hint, review, etc.) as a message bubble
    if (userMessage.trim()) {
      const userMsg: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: userMessage,
        mode,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMsg]);
      setInputMessage('');
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/companion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeId,
          challengeTitle,
          challengeDescription,
          currentCode,
          difficulty,
          mode,
          message: userMessage,
          conversationHistory: messages.slice(-6), // Last 3 exchanges for context
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        mode,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        mode,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (mode: 'hint' | 'review' | 'explain' | 'breakdown') => {
    const messages: Record<string, string> = {
      hint: 'Give me a hint for this challenge',
      review: 'Review my current code and provide feedback',
      explain: 'Explain the key concepts I need to solve this',
      breakdown: 'Break down this challenge into smaller steps',
    };

    sendMessage(mode, messages[mode]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage('chat');
    }
  };

  const getModeIcon = (mode?: string) => {
    switch (mode) {
      case 'hint':
        return <Lightbulb className="h-4 w-4" />;
      case 'review':
        return <Search className="h-4 w-4" />;
      case 'explain':
        return <BookOpen className="h-4 w-4" />;
      case 'breakdown':
        return <Target className="h-4 w-4" />;
      default:
        return <MessageCircle className="h-4 w-4" />;
    }
  };

  const getModeBadge = (mode?: string) => {
    const badges: Record<string, { label: string; color: string }> = {
      hint: { label: 'Hint', color: 'bg-yellow-100 text-yellow-700' },
      review: { label: 'Review', color: 'bg-purple-100 text-purple-700' },
      explain: { label: 'Explain', color: 'bg-blue-100 text-blue-700' },
      breakdown: { label: 'Breakdown', color: 'bg-green-100 text-green-700' },
      chat: { label: 'Chat', color: 'bg-slate-100 text-slate-700' },
    };

    const badge = badges[mode || 'chat'];
    return (
      <Badge className={`text-xs ${badge.color}`}>
        {getModeIcon(mode)}
        <span className="ml-1">{badge.label}</span>
      </Badge>
    );
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="border-b border-slate-200 bg-gradient-to-r from-blue-50 to-purple-50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 p-2">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                AI Learning Companion
                <Sparkles className="h-4 w-4 text-purple-500" />
              </h3>
              <p className="text-xs text-slate-600">Your personal coding mentor</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {isExpanded && (
        <>
          {/* Quick Actions */}
          <div className="border-b border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-medium text-slate-600 mb-3">Quick Actions:</p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickAction('hint')}
                disabled={isLoading}
                className="justify-start gap-2 text-xs h-auto py-2"
              >
                <Lightbulb className="h-4 w-4 text-yellow-600" />
                <span>Get Smart Hint</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickAction('review')}
                disabled={isLoading || !currentCode.trim()}
                className="justify-start gap-2 text-xs h-auto py-2"
              >
                <Search className="h-4 w-4 text-purple-600" />
                <span>Review My Code</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickAction('explain')}
                disabled={isLoading}
                className="justify-start gap-2 text-xs h-auto py-2"
              >
                <BookOpen className="h-4 w-4 text-blue-600" />
                <span>Explain Concept</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickAction('breakdown')}
                disabled={isLoading}
                className="justify-start gap-2 text-xs h-auto py-2"
              >
                <Target className="h-4 w-4 text-green-600" />
                <span>Break It Down</span>
              </Button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <div className="rounded-full bg-blue-100 p-4 mb-4">
                  <Bot className="h-8 w-8 text-blue-600" />
                </div>
                <h4 className="font-semibold text-slate-900 mb-2">
                  Ready to help you learn!
                </h4>
                <p className="text-sm text-slate-600 max-w-xs">
                  Click a quick action above or ask me anything about the challenge.
                  I&apos;ll guide you step-by-step!
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                  )}
                  <div
                    className={`flex flex-col gap-1 max-w-[80%] ${
                      message.role === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    {message.role === 'assistant' && message.mode && (
                      <div>{getModeBadge(message.mode)}</div>
                    )}
                    <div
                      className={`rounded-lg px-4 py-2 ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-900'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-line">{message.content}</p>
                    </div>
                    <span className="text-xs text-slate-500">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  {message.role === 'user' && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                  )}
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div className="bg-slate-100 rounded-lg px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                    <span className="text-sm text-slate-600">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-slate-200 bg-white p-4">
            <div className="flex gap-2">
              <textarea
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything about the challenge..."
                className="flex-1 resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={2}
                disabled={isLoading}
              />
              <Button
                onClick={() => sendMessage('chat')}
                disabled={isLoading || !inputMessage.trim()}
                className="gap-2 self-end"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Press Enter to send, Shift + Enter for new line
            </p>
          </div>
        </>
      )}
    </div>
  );
}
