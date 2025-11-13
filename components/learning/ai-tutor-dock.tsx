'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { Bot, Sparkles } from 'lucide-react';
import { ChatInterface } from '@/components/learning/chat/chat-interface';

interface AITutorDockProps {
  lessonId: string;
  lessonTitle: string;
  lessonContent: string;
}

export function AITutorDock({ lessonId, lessonTitle, lessonContent }: AITutorDockProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDockExpanded, setIsDockExpanded] = useState(false);

  return (
    <>
      {/* Floating Button - Minimized State */}
      {!isDockExpanded && !isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-8 right-8 z-40 group"
          aria-label="Open AI Tutor"
        >
          <div className="relative">
            {/* Cleaner pulsing glow effect */}
            <div className="absolute -inset-2 bg-sky-500/40 rounded-full blur-lg group-hover:bg-sky-500/60 transition-all"></div>

            {/* Main button with text */}
            <div className="relative bg-gradient-to-r from-sky-500 to-blue-600 px-6 py-3.5 rounded-full shadow-xl hover:shadow-sky-500/50 transition-all hover:scale-105">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Bot className="h-6 w-6 text-white" />
                  {/* Online indicator */}
                  <div className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-green-400 rounded-full border-2 border-white"></div>
                </div>

                <div className="text-left">
                  <div className="text-white font-bold text-sm whitespace-nowrap">Ask AI Tutor</div>
                  <div className="text-sky-50 text-xs whitespace-nowrap flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    <span>Always Available</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </button>
      )}

      {/* Chat Drawer - Slides in from right */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent
          side="right"
          className="w-full sm:w-[90vw] md:w-[60vw] lg:w-[50vw] xl:w-[45vw] 2xl:w-[40vw] sm:max-w-none p-0 flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="px-6 py-4 bg-gradient-to-r from-sky-500 to-blue-600 flex-shrink-0 border-b border-sky-400/30">
            <div className="flex items-center gap-3">
              <div className="relative flex-shrink-0">
                <div className="bg-white p-2.5 rounded-xl shadow-md">
                  <Bot className="h-6 w-6 text-sky-600" />
                </div>
                {/* Online indicator */}
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-400 rounded-full border-2 border-white shadow-sm"></div>
              </div>
              <div className="flex-1 min-w-0">
                <SheetTitle className="text-base font-bold text-white flex items-center gap-2">
                  AI Senior Dev Tutor
                  <Sparkles className="h-4 w-4 flex-shrink-0" />
                </SheetTitle>
                <p className="text-xs text-sky-50 mt-0.5">
                  Teaching you like a real senior developer • Available now
                </p>
              </div>
            </div>
          </div>

          {/* Chat Interface - Takes full remaining height */}
          <div className="flex-1 overflow-hidden">
            <ChatInterface
              lessonId={lessonId}
              lessonTitle={lessonTitle}
              lessonContent={lessonContent}
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
