'use client';

import { useState, useRef, useEffect, memo } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot, User, ArrowDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface ChatMessageProps {
  message: string;
  role: 'user' | 'assistant';
  timestamp?: string;
  isStreaming?: boolean;
}

// Memoized component to prevent unnecessary re-renders during streaming
export const ChatMessage = memo(function ChatMessage({ message, role, timestamp, isStreaming = false }: ChatMessageProps) {
  const isAssistant = role === 'assistant';
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      const container = scrollContainerRef.current;
      if (!container || !isAssistant) return;

      const hasScroll = container.scrollHeight > container.clientHeight;
      const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 10;

      setShowScrollIndicator(hasScroll && !isAtBottom);
    };

    checkScroll();
    const container = scrollContainerRef.current;
    container?.addEventListener('scroll', checkScroll);

    // Check on content change
    const observer = new MutationObserver(checkScroll);
    if (container) {
      observer.observe(container, { childList: true, subtree: true });
    }

    return () => {
      container?.removeEventListener('scroll', checkScroll);
      observer.disconnect();
    };
  }, [message, isAssistant]);

  const scrollToBottom = () => {
    scrollContainerRef.current?.scrollTo({
      top: scrollContainerRef.current.scrollHeight,
      behavior: 'smooth',
    });
  };

  return (
    <div className={`flex gap-3 w-full ${isAssistant ? 'items-start' : 'items-start flex-row-reverse'}`}>
      {/* Avatar with animated Bot icon for assistant */}
      {isAssistant ? (
        <div className="flex-shrink-0 relative">
          <div className="bg-gradient-to-br from-sky-500 to-purple-600 p-2 rounded-xl relative shadow-md">
            <Bot className="h-5 w-5 text-white" />
            <div className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 bg-green-500 rounded-full border border-white"></div>
          </div>
        </div>
      ) : (
        <Avatar className="flex-shrink-0 shadow-sm">
          <AvatarFallback className="bg-gradient-to-br from-sky-500 to-blue-600 text-white">
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}

      <div className={`flex-1 space-y-2 ${isAssistant ? '' : 'flex flex-col items-end'} min-w-0 overflow-hidden`}>
        <div
          className={`rounded-2xl overflow-hidden relative ${
            isAssistant
              ? 'bg-white border border-gray-200 w-full shadow-sm'
              : 'bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-md ml-auto max-w-[85%]'
          }`}
        >
          <div
            ref={scrollContainerRef}
            className={`max-h-[600px] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-sky-300 scrollbar-track-sky-50 hover:scrollbar-thumb-sky-400 w-full ${isAssistant ? 'px-5 py-4' : 'px-4 py-3'}`}
          >
            {isStreaming && !message ? (
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-sky-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-sky-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-sky-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <p className="text-sm text-gray-700 font-medium">Tutor is typing...</p>
              </div>
            ) : isAssistant ? (
              <div className="w-full max-w-full prose prose-sm prose-pre:my-3 prose-pre:bg-slate-950 prose-pre:text-slate-50 prose-pre:max-h-[400px] prose-pre:overflow-auto break-words"
              >
                <ReactMarkdown
                  components={{
                    code({ node, inline, className, children, ...props }: any) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <div className="w-full overflow-hidden">
                          <SyntaxHighlighter
                            style={vscDarkPlus}
                            language={match[1]}
                            PreTag="div"
                            customStyle={{
                              margin: 0,
                              borderRadius: '0.375rem',
                              maxHeight: '400px',
                            }}
                            wrapLongLines={true}
                            {...props}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        </div>
                      ) : (
                        <code className={`${className} break-words`} {...props}>
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {message}
                </ReactMarkdown>
                {isStreaming && message && (
                  <span className="inline-block w-2 h-4 bg-sky-600 ml-1 animate-cursor"></span>
                )}
              </div>
            ) : (
              <p className="text-sm leading-relaxed whitespace-pre-wrap break-words w-full">
                {message}
              </p>
            )}
          </div>

          {/* Scroll Down Indicator with Gradient Fade */}
          {showScrollIndicator && isAssistant && (
            <>
              {/* Gradient fade to indicate more content */}
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>

              {/* Scroll down button */}
              <div className="absolute bottom-2 right-2 flex flex-col items-center z-10">
                <div className="bg-sky-600 text-white text-xs font-medium px-2 py-1 rounded-md shadow-sm mb-1 whitespace-nowrap">
                  More below ↓
                </div>
                <button
                  onClick={scrollToBottom}
                  className="bg-gradient-to-br from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white rounded-full p-2.5 shadow-lg transition-all hover:scale-110 animate-bounce"
                  aria-label="Scroll to see more"
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
              </div>
            </>
          )}
        </div>
        {timestamp && (
          <span className="text-xs text-muted-foreground px-1">
            {new Date(timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        )}
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for memo
  // Only re-render if these props actually changed
  return (
    prevProps.message === nextProps.message &&
    prevProps.role === nextProps.role &&
    prevProps.timestamp === nextProps.timestamp &&
    prevProps.isStreaming === nextProps.isStreaming
  );
});
