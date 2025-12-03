'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Send, Loader2, Lightbulb, Search, MessageCircle, Sparkles, X, User } from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIMentorDockProps {
  challengeId: string;
  challengeTitle: string;
  challengeDescription: string;
  currentCode: string;
  difficulty: string;
}

const SUGGESTED_QUESTIONS = [
  "What's the approach for this?",
  "Explain this concept",
  "Common mistakes to avoid?",
  "Show me an example",
];

export function AIMentorDock({
  challengeId,
  challengeTitle,
  challengeDescription,
  currentCode,
  difficulty,
}: AIMentorDockProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isDockExpanded, setIsDockExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (mode: 'chat' | 'hint' | 'review', customMessage?: string) => {
    const userMessage = customMessage || inputMessage;
    if (!userMessage.trim() && mode === 'chat') return;

    // Open chat drawer to show the conversation
    if (mode === 'hint' || mode === 'review') {
      setIsChatOpen(true);
    }

    // ALWAYS add user message to chat for consistent UI
    // This shows what the user requested (hint, review, etc.) as a message bubble
    if (userMessage.trim()) {
      const userMsg: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: userMessage,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMsg]);
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
          conversationHistory: messages.slice(-6),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle daily limit error
        if (response.status === 429 && data.requiresUpgrade) {
          toast.error(data.error || 'Daily AI limit reached. Upgrade for unlimited access!', {
            duration: 5000,
          });
          // Show error in chat too
          const errorMsg: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: `⚠️ ${data.error}\n\nUpgrade to get unlimited AI assistance!`,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, errorMsg]);
        } else {
          toast.error(data.error || 'Failed to get AI response. Please try again.');
        }
        return;
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setIsChatOpen(true);
    setTimeout(() => {
      sendMessage('chat', question);
    }, 300);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage('chat');
    }
  };

  return (
    <>
      {/* Floating Button - Minimized State */}
      {!isDockExpanded && (
        <button
          onClick={() => setIsDockExpanded(true)}
          className="fixed bottom-4 lg:bottom-8 right-3 lg:right-8 group z-40"
        >
          <div className="relative">
            {/* Pulsing glow effect - more prominent */}
            <div className="absolute -inset-2 lg:-inset-3 bg-gradient-to-r from-sky-400 via-blue-500 to-purple-500 rounded-full opacity-60 blur-xl group-hover:opacity-90 animate-pulse"></div>

            {/* Main button with text */}
            <div className="relative bg-gradient-to-r from-sky-500 via-blue-600 to-purple-600 px-3 py-2.5 lg:px-6 lg:py-4 rounded-full shadow-2xl hover:shadow-sky-500/50 transition-all hover:scale-105 border-white/20">
              <div className="flex items-center gap-2 lg:gap-3">
                <div className="relative">
                  <Bot className="h-5 w-5 lg:h-7 lg:w-7 text-white" />
                  {/* Online indicator */}
                  <div className="absolute -top-0.5 -right-0.5 lg:-top-1 lg:-right-1 h-2 w-2 lg:h-3 lg:w-3 bg-green-400 rounded-full border-2 border-white animate-pulse shadow-lg shadow-green-500/50"></div>
                </div>

                <div className="text-left">
                  <div className="text-white font-bold text-xs lg:text-sm whitespace-nowrap">Ask AI Senior Dev</div>
                  <div className="text-sky-100 text-[10px] lg:text-xs whitespace-nowrap flex items-center gap-1">
                    <Sparkles className="h-2.5 w-2.5 lg:h-3 lg:w-3" />
                    <span>Always Available</span>
                  </div>
                </div>

                {/* Message count badge */}
                {messages.length > 0 && (
                  <div className="bg-red-500 text-white text-[10px] lg:text-xs font-bold rounded-full w-5 h-5 lg:w-6 lg:h-6 flex items-center justify-center shadow-lg ml-1 lg:ml-2 animate-bounce">
                    {messages.length}
                  </div>
                )}
              </div>

              {/* Shimmer effect */}
              <div className="absolute inset-0 rounded-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer"></div>
              </div>
            </div>

            {/* Animated arrow pointing to button */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="text-sky-500 animate-bounce">
                <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </button>
      )}

      {/* Expanded Dock */}
      {isDockExpanded && (
        <div className="fixed bottom-16 lg:bottom-8 right-3 lg:right-8 w-[280px] sm:w-[320px] z-40">
          <div
            className="relative backdrop-blur-md bg-white/95 border border-white/40 rounded-2xl shadow-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(240,249,255,0.95) 100%)',
            }}
          >
            {/* Header with close button */}
            <div className="relative bg-gradient-to-r from-sky-500 to-blue-600 p-4">
              <div className="absolute inset-0 bg-gradient-to-r from-sky-400/20 to-blue-500/20 animate-pulse"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-white/30 rounded-full blur animate-pulse"></div>
                    <div className="relative bg-white p-2 rounded-full">
                      <Bot className="h-5 w-5 text-sky-600" />
                    </div>
                    {/* Online indicator */}
                    <div className="absolute -top-0.5 -right-0.5 h-3 w-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      AI Senior Developer
                      <Sparkles className="h-3 w-3" />
                    </h3>
                    <p className="text-xs text-sky-100">Senior Dev Assistant • Available</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsDockExpanded(false)}
                  className="text-white/80 hover:text-white transition-colors hover:bg-white/10 rounded-lg p-1"
                  title="Minimize"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-4 space-y-2">
              <Button
                onClick={() => sendMessage('hint', 'Give me a hint about the general approach')}
                disabled={isLoading}
                className="w-full justify-start bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white shadow-md transition-all"
                size="sm"
              >
                <Lightbulb className="h-4 w-4 mr-2" />
                {isLoading ? 'Getting hint...' : 'Get a Hint'}
              </Button>

              <Button
                onClick={() => {
                  if (!currentCode.trim() || currentCode.trim().length < 20) {
                    toast.error('Please write some code first!', {
                      description: 'Write at least 20 characters of code before requesting a review.'
                    });
                    return;
                  }
                  sendMessage('review', 'Review my current code');
                }}
                disabled={isLoading || !currentCode.trim()}
                variant="outline"
                className="w-full justify-start border-2 border-purple-200 text-purple-700 hover:bg-purple-50 shadow-sm transition-all"
                size="sm"
              >
                <Search className="h-4 w-4 mr-2" />
                Review My Code
              </Button>

              <Button
                onClick={() => setIsChatOpen(true)}
                variant="outline"
                className="w-full justify-start border-2 border-sky-200 text-sky-700 hover:bg-sky-50 shadow-sm transition-all"
                size="sm"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Open Chat
              </Button>
            </div>

            {/* Tips Section */}
            <div className="px-4 pb-4">
              <div className="bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-200 rounded-xl p-3">
                <div className="flex items-start gap-2">
                  <Sparkles className="h-4 w-4 text-sky-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-sky-900 mb-1">Quick Access</p>
                    <p className="text-xs text-sky-700 leading-relaxed">
                      Get hints, code reviews, or open chat for questions.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Message Count Badge */}
            {messages.length > 0 && (
              <div className="absolute top-2 right-2">
                <div className="bg-green-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
                  {messages.length}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Chat Drawer - Slides in from right - Responsive width */}
      <Sheet open={isChatOpen} onOpenChange={setIsChatOpen}>
        <SheetContent side="right" className="w-full sm:w-[95vw] md:w-[60vw] lg:w-[50vw] xl:w-[45vw] 2xl:max-w-[800px] p-0 flex flex-col">
          <SheetHeader className="px-6 py-4 border-b bg-gradient-to-r from-sky-50 via-blue-50 to-purple-50">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-sky-500 to-purple-600 p-2.5 rounded-xl relative">
                <Bot className="h-6 w-6 text-white" />
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div>
                <SheetTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
                  AI Senior Developer
                  <Sparkles className="h-4 w-4 text-purple-500" />
                </SheetTitle>
                <p className="text-xs text-gray-600 mt-0.5">
                  Ask about this challenge • Code reviews, hints, explanations
                </p>
              </div>
            </div>
          </SheetHeader>

          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Messages Area */}
            <ScrollArea className="flex-1 p-6">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-12">
                  <div className="bg-gradient-to-br from-sky-100 via-blue-100 to-purple-100 p-6 rounded-full mb-6 relative">
                    <Sparkles className="h-12 w-12 text-sky-600" />
                    <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                    Senior Dev Assistant
                    <Bot className="h-5 w-5 text-sky-600" />
                  </h4>
                  <p className="text-sm text-gray-600 text-center max-w-sm mb-6 leading-relaxed">
                    Ask questions, get code reviews, or request hints for this challenge.
                  </p>

                  {/* Suggested Questions */}
                  <div className="w-full space-y-2">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                      Quick questions:
                    </p>
                    {SUGGESTED_QUESTIONS.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestedQuestion(question)}
                        disabled={isLoading}
                        className="w-full text-left px-4 py-3 bg-white border-2 border-gray-200 hover:border-sky-400 hover:bg-sky-50 rounded-xl transition-all text-sm text-gray-700 hover:text-sky-700 group disabled:opacity-50"
                      >
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-gray-400 group-hover:text-sky-500" />
                          <span>{question}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.role === 'assistant' && (
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                          <Bot className="h-5 w-5 text-white" />
                        </div>
                      )}
                      <div
                        className={`flex flex-col gap-1 max-w-[80%] ${
                          msg.role === 'user' ? 'items-end' : 'items-start'
                        }`}
                      >
                        <div
                          className={`rounded-lg px-4 py-2 ${
                            msg.role === 'user'
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-100 text-slate-900'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-line">{msg.content}</p>
                        </div>
                        <span className="text-xs text-slate-500">
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      {msg.role === 'user' && (
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                          <User className="h-5 w-5 text-white" />
                        </div>
                      )}
                    </div>
                  ))}
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
              )}
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t border-gray-200 p-4 bg-gradient-to-b from-white to-gray-50">
              <div className="flex gap-3">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask about this challenge..."
                  className="flex-1 resize-none border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-300 transition-all bg-white"
                  rows={2}
                  disabled={isLoading}
                />
                <Button
                  onClick={() => sendMessage('chat')}
                  disabled={isLoading || !inputMessage.trim()}
                  size="lg"
                  className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 rounded-xl px-6 shadow-md transition-all hover:shadow-lg disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </Button>
              </div>
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
        </SheetContent>
      </Sheet>
    </>
  );
}
