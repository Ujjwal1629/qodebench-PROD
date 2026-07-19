'use client';

import { useState } from 'react';
import { Settings, HelpCircle, LogOut, Menu, Crown, Home } from 'lucide-react';
import Image from 'next/image';
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
import { getUserInitials } from '@/lib/utils/format';
import { DRAWER_NAV_GROUPS } from '@/lib/constants/dashboard';
import Link from 'next/link';

interface TopBarProps {
  pageTitle?: string;
  user?: {
    username: string;
    avatar_url: string | null;
    full_name: string | null;
    subscription_tier?: string;
    subscription_status?: string;
    is_admin?: boolean;
  } | null;
}

export function TopBar({ user }: TopBarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut();
    router.push('/signin');
  };

  // Hide admin-only items from non-admins
  const navGroups = DRAWER_NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) =>
      item.href === '/dashboard/admin/visitors' ? user?.is_admin === true : true
    ),
  })).filter((group) => group.items.length > 0);

  return (
    <header className="fixed top-0 z-30 h-16 w-full border-b border-slate-200 bg-white">
      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: hamburger + logo */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="-ml-2"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6 text-slate-700" />
          </Button>
          <Link href="/dashboard" className="flex items-center">
            <Image
              src="/qodeb.png"
              alt="QodeBench"
              width={140}
              height={36}
              className="h-9 w-auto object-contain"
              priority
            />
          </Link>
        </div>

        {/* Right: upgrade hint + user menu */}
        <div className="flex items-center gap-3">
          {user?.subscription_tier === 'free' && (
            <Button
              asChild
              size="sm"
              className="hidden sm:inline-flex bg-slate-950 hover:bg-slate-800 text-white font-medium rounded-md"
            >
              <Link href="/pricing">Enroll Now</Link>
            </Button>
          )}

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
                    {user?.subscription_tier === 'monthly' ? 'Monthly Plan' :
                      user?.subscription_tier === 'quarterly' ? 'Quarterly Plan' :
                        user?.subscription_tier === 'yearly' ? 'Yearly Plan' : 'Free Tier'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                <Home className="mr-2 h-4 w-4" />
                <span>Home</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/dashboard/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              {user?.subscription_tier === 'free' && (
                <DropdownMenuItem onClick={() => router.push('/pricing')}>
                  <Crown className="mr-2 h-4 w-4" />
                  <span>Enroll Now</span>
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

      {/* Navigation Drawer */}
      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetContent side="left" className="w-[320px] p-0">
          <div className="flex flex-col h-full">
            <div className="flex items-center px-6 h-16 border-b border-slate-200">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <Image
                src="/qodeb.png"
                alt="QodeBench"
                width={130}
                height={34}
                className="h-8 w-auto object-contain"
              />
            </div>

            <nav className="flex-1 overflow-y-auto py-4">
              {navGroups.map((group, gi) => (
                <div
                  key={group.label ?? `group-${gi}`}
                  className={cn(gi > 0 && 'mt-2 pt-4 border-t border-slate-100')}
                >
                  {group.label && (
                    <p className="px-6 pb-2 text-[11px] font-semibold tracking-[0.14em] uppercase text-slate-400">
                      {group.label}
                    </p>
                  )}
                  <div className="px-3 space-y-0.5">
                    {group.items.map((item) => {
                      const isActive =
                        item.href === '/dashboard'
                          ? pathname === '/dashboard'
                          : pathname.startsWith(item.href);
                      const Icon = item.icon;

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsMenuOpen(false)}
                          className={cn(
                            'flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors',
                            isActive
                              ? 'bg-brand-50 text-brand-700'
                              : 'text-slate-700 hover:bg-slate-100'
                          )}
                        >
                          <Icon
                            className={cn(
                              'h-5 w-5 mt-0.5 flex-shrink-0',
                              isActive ? 'text-brand-600' : 'text-slate-400'
                            )}
                          />
                          <span>
                            <span className="block text-sm font-medium">{item.title}</span>
                            <span
                              className={cn(
                                'block text-xs mt-0.5',
                                isActive ? 'text-brand-600/80' : 'text-slate-500'
                              )}
                            >
                              {item.description}
                            </span>
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
