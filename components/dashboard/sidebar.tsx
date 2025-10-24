'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { NAV_ITEMS } from '@/lib/constants/dashboard';
import { useUIStore } from '@/store/ui-store';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatPoints } from '@/lib/utils/format';

interface SidebarProps {
  user?: {
    username: string;
    avatar_url: string | null;
    total_points: number;
  } | null;
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen border-r border-slate-200 bg-slate-50 transition-all duration-300',
        sidebarCollapsed ? 'w-20' : 'w-64',
        'hidden lg:block'
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-slate-200 px-6">
          {!sidebarCollapsed && (
            <Link href="/dashboard" className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-brand-600" />
              <span className="text-xl font-bold text-slate-900">
                QodeBench
              </span>
            </Link>
          )}
          {sidebarCollapsed && (
            <Link href="/dashboard" className="flex items-center justify-center w-full">
              <Sparkles className="h-6 w-6 text-brand-600" />
            </Link>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                  isActive
                    ? 'bg-brand-100 text-brand-700'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900',
                  sidebarCollapsed && 'justify-center px-3'
                )}
                title={sidebarCollapsed ? item.title : undefined}
              >
                <Icon
                  className={cn(
                    'h-5 w-5 flex-shrink-0',
                    isActive ? 'text-brand-600' : 'text-slate-500'
                  )}
                />
                {!sidebarCollapsed && <span>{item.title}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Collapse button */}
        <div className="border-t border-slate-200 p-4">
          <button
            onClick={toggleSidebar}
            className={cn(
              'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition-all hover:bg-slate-100',
              sidebarCollapsed && 'justify-center'
            )}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <>
                <ChevronLeft className="h-5 w-5" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>

        {/* User profile card */}
        {user && (
          <div className="border-t border-slate-200 p-4">
            <div
              className={cn(
                'flex items-center gap-3 rounded-lg bg-white p-3 shadow-sm',
                sidebarCollapsed && 'flex-col gap-2'
              )}
            >
              <Avatar className="h-10 w-10 flex-shrink-0">
                <AvatarImage src={user.avatar_url || undefined} alt={user.username} />
                <AvatarFallback className="bg-brand-100 text-brand-700 font-semibold">
                  {user.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {!sidebarCollapsed && (
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {user.username}
                  </p>
                  <p className="text-xs text-slate-600">
                    {formatPoints(user.total_points)} points
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
