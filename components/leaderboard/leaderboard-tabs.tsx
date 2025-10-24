'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface LeaderboardTabsProps {
  activeTab: 'all-time' | 'weekly';
  onTabChange: (tab: 'all-time' | 'weekly') => void;
}

export function LeaderboardTabs({ activeTab, onTabChange }: LeaderboardTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as 'all-time' | 'weekly')}>
      <TabsList>
        <TabsTrigger value="all-time">All-Time</TabsTrigger>
        <TabsTrigger value="weekly">This Week</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
