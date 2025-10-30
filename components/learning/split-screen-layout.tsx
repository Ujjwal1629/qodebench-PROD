'use client';

import { ReactNode, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, MessageSquare } from 'lucide-react';

interface SplitScreenLayoutProps {
  leftPanel: ReactNode;
  rightPanel: ReactNode;
  defaultTab?: 'theory' | 'chat';
}

export function SplitScreenLayout({
  leftPanel,
  rightPanel,
  defaultTab = 'theory',
}: SplitScreenLayoutProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <>
      {/* Mobile View: Stacked Layout with Sticky Headers */}
      <div className="md:hidden overflow-y-auto h-[calc(100vh-4rem)] bg-slate-50">
        {/* Theory Section */}
        <div className="bg-white border-b-4 border-purple-200 mb-4">
          <div className="sticky top-0 z-10 bg-gradient-to-r from-sky-500 to-indigo-600 px-4 py-3 shadow-md">
            <div className="flex items-center gap-2 text-white">
              <BookOpen className="h-5 w-5" />
              <h2 className="font-semibold text-base">Learning Content</h2>
            </div>
          </div>
          <div className="p-4 min-h-[50vh]">
            {leftPanel}
          </div>
        </div>

        {/* Chat Section */}
        <div className="bg-white">
          <div className="sticky top-0 z-10 bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-3 shadow-md">
            <div className="flex items-center gap-2 text-white">
              <MessageSquare className="h-5 w-5" />
              <h2 className="font-semibold text-base">AI Development Mentor</h2>
            </div>
          </div>
          <div className="min-h-[60vh]">
            {rightPanel}
          </div>
        </div>
      </div>

      {/* Desktop View: Split Screen with Better Spacing */}
      <div className="hidden md:grid md:grid-cols-2 md:gap-1 h-[calc(100vh-4rem)] bg-slate-200">
        {/* Left Panel - Theory */}
        <div className="overflow-y-auto bg-white shadow-sm">
          <div className="px-8 py-6 max-w-4xl">
            {leftPanel}
          </div>
        </div>

        {/* Right Panel - AI Chat */}
        <div className="bg-gradient-to-br from-purple-50/40 to-indigo-50/30 flex flex-col h-full shadow-sm">
          {rightPanel}
        </div>
      </div>
    </>
  );
}
