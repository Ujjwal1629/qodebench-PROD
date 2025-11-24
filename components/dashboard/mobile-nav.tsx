'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { MOBILE_NAV_ITEMS } from '@/lib/constants/dashboard';

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white lg:hidden">
      <div className="flex items-center justify-around">
        {MOBILE_NAV_ITEMS.map((item) => {
          // For Dashboard, match exact path. For others, match if path starts with href
          const isActive = item.href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={true}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-3 text-xs font-medium transition-colors',
                isActive
                  ? 'text-brand-600'
                  : 'text-slate-600 hover:text-slate-900'
              )}
            >
              <Icon
                className={cn(
                  'h-5 w-5',
                  isActive ? 'text-brand-600' : 'text-slate-500'
                )}
              />
              <span className="max-w-[60px] truncate">{item.title}</span>
              {isActive && (
                <div className="absolute bottom-0 left-1/2 h-0.5 w-12 -translate-x-1/2 rounded-t-full bg-brand-600" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
