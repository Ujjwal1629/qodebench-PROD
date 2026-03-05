'use client';

import { useState } from 'react';
import { Settings, HelpCircle, LogOut, Menu, Crown, X, BookOpen } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/use-auth';
import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/store/ui-store';
import { getUserInitials } from '@/lib/utils/format';
import { MOBILE_NAV_ITEMS } from '@/lib/constants/dashboard';
import Link from 'next/link';

interface TopBarProps {
  pageTitle?: string;
  user?: {
    username: string;
    avatar_url: string | null;
    full_name: string | null;
    subscription_tier?: string;
    subscription_status?: string;
  } | null;
}

export function TopBar({ pageTitle, user }: TopBarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { sidebarCollapsed } = useUIStore();

  const handleSignOut = async () => {
    await signOut();
    router.push('/signin');
  };

  // Determine dynamic page title based on current route
  const getDynamicPageTitle = (): string => {
    if (pageTitle) return pageTitle; // Use provided title if available

    // Extract the main section from the pathname
    const pathSegments = pathname.split('/').filter(Boolean);

    if (pathSegments.length === 0 || pathSegments[0] !== 'dashboard') {
      return 'Dashboard';
    }

    if (pathSegments.length === 1) {
      return 'Dashboard'; // /dashboard root
    }

    // Map routes to titles
    const section = pathSegments[1];
    const titleMap: Record<string, string> = {
      'challenges': 'Challenges',
      'learning': 'Learning',
      'interviews': 'Mock Interviews',
      'leaderboard': 'Leaderboard',
      'rewards': 'Rewards',
      'settings': 'Settings',
      'help': 'Help & Support',
      'profile': 'Profile',
    };

    return titleMap[section] || section.charAt(0).toUpperCase() + section.slice(1);
  };

  const displayTitle = getDynamicPageTitle();

  return (
    <header
      className={cn(
        'fixed top-0 z-30 h-16 w-full border-b border-slate-200 bg-white transition-all duration-300',
        sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
      )}
    >
      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Page title */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden -ml-2"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-base font-bold text-slate-900 sm:text-lg lg:text-xl">
            {displayTitle}
          </h1>
        </div>

        {/* Right: User menu */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* User dropdown */}
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full p-0"
                suppressHydrationWarning
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={user?.avatar_url || undefined}
                    alt={user?.username || 'User'}
                  />
                  <AvatarFallback className="bg-brand-100 text-brand-700 font-semibold">
                    {getUserInitials(user?.username, user?.full_name)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">
                      {user?.full_name || user?.username || 'User'}
                    </p>
                    {user?.subscription_tier && user.subscription_tier !== 'free' && (
                      <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">
                        <Crown className="h-3 w-3 mr-1" />
                        {user.subscription_tier === 'launch_offer' ? 'Launch' : 'Pro'}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">@{user?.username}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {user?.subscription_tier === 'free' ? 'Free Tier' :
                      user?.subscription_tier === 'monthly' ? 'Monthly' :
                        user?.subscription_tier === 'monthly' ? 'Monthly Plan' :
                          user?.subscription_tier === 'quarterly' ? 'Quarterly Plan' :
                            user?.subscription_tier === 'yearly' ? 'Yearly Plan' : 'Free Tier'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/dashboard/learning')}>
                <BookOpen className="mr-2 h-4 w-4" />
                <span>Learning</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/dashboard/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              {user?.subscription_tier === 'free' && (
                <DropdownMenuItem onClick={() => router.push('/pricing')}>
                  <Crown className="mr-2 h-4 w-4" />
                  <span>Upgrade to Pro</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => router.push('/dashboard/help')}>
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Help & Support</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-[280px] p-0">
          <div className="flex flex-col h-full">
            <div className="px-6 py-4 border-b bg-gradient-to-r from-sky-500 to-blue-600">
              <SheetTitle className="text-lg font-bold text-white">Navigation</SheetTitle>
              <p className="text-xs text-sky-50 mt-1">Quick access to all sections</p>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {MOBILE_NAV_ITEMS.map((item) => {
                const isActive = item.href === '/dashboard'
                  ? pathname === '/dashboard'
                  : pathname.startsWith(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-sky-50 text-sky-700 border-l-4 border-sky-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    )}
                  >
                    <Icon className={cn('h-5 w-5', isActive ? 'text-sky-600' : 'text-gray-500')} />
                    <span>{item.title}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
