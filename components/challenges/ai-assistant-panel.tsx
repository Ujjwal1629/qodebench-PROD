'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, X, Send, Loader2, Lightbulb, MessageCircle, Search, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIAssistantPanelProps {
  onClose: () => void;
  challengeId: string;
  challengeTitle: string;
  challengeDescription: string;
  currentCode: string;
  difficulty: string;
}

export function AIAssistantPanel({
  onClose,
  challengeId,
  challengeTitle,
  challengeDescription,
  currentCode,
  difficulty,
}: AIAssistantPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hintsUnlocked, setHintsUnlocked] = useState<number>(0);
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

    setIsLoading(true);

    // Add user message to chat (only for chat mode)
    if (mode === 'chat' && userMessage.trim()) {
      const userMsg: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: userMessage,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInputMessage('');
    }

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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage('chat');
    }
  };

  const getHint = () => {
    const hintLevels = [
      'Give me a hint about the general approach',
      'Provide a more specific hint about implementation',
      'Show me what I might be missing',
    ];
    const message = hintLevels[hintsUnlocked] || 'Give me another hint';
    setHintsUnlocked((prev) => prev + 1);
    sendMessage('hint', message);
  };

  const reviewCode = () => {
    sendMessage('review', 'Review my current code and suggest improvements');
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-[450px] bg-white border-t-2 border-gray-200 shadow-2xl z-50">
      {/* Modern Header with Gradient */}
      <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-sky-50 to-blue-50 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="bg-sky-500 p-2 rounded-lg">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">Your AI Development Mentor</h3>
            <p className="text-xs text-gray-600">Ready to help you solve this challenge</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Clean Modern Tabs */}
      <Tabs defaultValue="chat" className="h-[calc(100%-68px)]">
        <TabsList className="border-b border-gray-200 bg-white px-6 rounded-none w-full justify-start h-12">
          <TabsTrigger
            value="chat"
            className="data-[state=active]:bg-sky-50 data-[state=active]:text-sky-700 data-[state=active]:border-b-2 data-[state=active]:border-sky-500 rounded-t-lg px-4 py-2 text-gray-600 font-medium transition-all"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Chat
          </TabsTrigger>
          <TabsTrigger
            value="hints"
            className="data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700 data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-t-lg px-4 py-2 text-gray-600 font-medium transition-all"
          >
            <Lightbulb className="h-4 w-4 mr-2" />
            Hints
          </TabsTrigger>
          <TabsTrigger
            value="review"
            className="data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700 data-[state=active]:border-b-2 data-[state=active]:border-purple-500 rounded-t-lg px-4 py-2 text-gray-600 font-medium transition-all"
          >
            <Search className="h-4 w-4 mr-2" />
            Code Review
          </TabsTrigger>
        </TabsList>

        {/* Chat Tab - Modern Message UI */}
        <TabsContent value="chat" className="h-[calc(100%-48px)] m-0 p-0">
          <div className="flex flex-col h-full bg-gradient-to-b from-white to-gray-50">
            <ScrollArea className="flex-1 p-6">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-12">
                  <div className="bg-sky-100 p-4 rounded-full mb-4">
                    <Sparkles className="h-8 w-8 text-sky-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Start a conversation</h4>
                  <p className="text-sm text-gray-600 text-center max-w-sm">
                    Ask me anything about this challenge. I'm here to help you understand, debug, and improve your code.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.role === 'assistant' && (
                        <div className="flex-shrink-0">
                          <div className="bg-sky-500 p-2 rounded-lg">
                            <Bot className="h-4 w-4 text-white" />
                          </div>
                        </div>
                      )}
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                          msg.role === 'user'
                            ? 'bg-sky-500 text-white'
                            : 'bg-white text-gray-900 border border-gray-200'
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{msg.content}</div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex gap-3 justify-start">
                      <div className="flex-shrink-0">
                        <div className="bg-sky-500 p-2 rounded-lg">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                      </div>
                      <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </ScrollArea>

            {/* Modern Input Area */}
            <div className="border-t border-gray-200 p-4 bg-white">
              <div className="flex gap-3">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask your mentor anything..."
                  className="flex-1 resize-none border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                  rows={2}
                  disabled={isLoading}
                />
                <Button
                  onClick={() => sendMessage('chat')}
                  disabled={isLoading || !inputMessage.trim()}
                  size="lg"
                  className="bg-sky-500 hover:bg-sky-600 rounded-xl px-6 shadow-md transition-all hover:shadow-lg"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Press <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs font-mono">Enter</kbd> to send • <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs font-mono">Shift+Enter</kbd> for new line
              </p>
            </div>
          </div>
        </TabsContent>

        {/* Hints Tab - Modern Card Design */}
        <TabsContent value="hints" className="h-[calc(100%-48px)] m-0 p-6 bg-gradient-to-b from-white to-amber-50">
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-amber-900 text-sm mb-1">Progressive Hints</h4>
                  <p className="text-sm text-amber-700">
                    Get step-by-step guidance without spoiling the solution
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={getHint}
              disabled={isLoading}
              className="w-full justify-start bg-amber-500 hover:bg-amber-600 text-white rounded-xl py-6 shadow-md transition-all hover:shadow-lg"
            >
              <Lightbulb className="h-5 w-5 mr-3" />
              <span className="font-medium">
                {isLoading ? 'Getting hint...' : `Get Hint ${hintsUnlocked + 1}`}
              </span>
            </Button>

            <ScrollArea className="h-[240px]">
              <div className="space-y-3">
                {messages
                  .filter((msg) => msg.role === 'assistant')
                  .map((msg, index) => (
                    <div key={msg.id} className="bg-white border border-amber-200 rounded-xl p-4 shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="bg-amber-100 text-amber-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {index + 1}
                        </div>
                        <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap flex-1">
                          {msg.content}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </ScrollArea>
          </div>
        </TabsContent>

        {/* Code Review Tab - Modern Review UI */}
        <TabsContent value="review" className="h-[calc(100%-48px)] m-0 p-6 bg-gradient-to-b from-white to-purple-50">
          <div className="space-y-4">
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Search className="h-5 w-5 text-purple-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-purple-900 text-sm mb-1">AI Code Review</h4>
                  <p className="text-sm text-purple-700">
                    Get expert feedback on your code quality and best practices
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={reviewCode}
              disabled={isLoading || !currentCode.trim()}
              className="w-full justify-start bg-purple-500 hover:bg-purple-600 text-white rounded-xl py-6 shadow-md transition-all hover:shadow-lg disabled:opacity-50"
            >
              <Search className="h-5 w-5 mr-3" />
              <span className="font-medium">
                {isLoading ? 'Reviewing code...' : 'Review My Code'}
              </span>
            </Button>

            {!currentCode.trim() && (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-600">Write some code first to get a review</p>
              </div>
            )}

            <ScrollArea className="h-[240px]">
              <div className="space-y-3">
                {messages
                  .filter((msg) => msg.role === 'assistant')
                  .map((msg) => (
                    <div key={msg.id} className="bg-white border border-purple-200 rounded-xl p-4 shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="bg-purple-500 p-2 rounded-lg flex-shrink-0">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                        <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap flex-1">
                          {msg.content}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </ScrollArea>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
