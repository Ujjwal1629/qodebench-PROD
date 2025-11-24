"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, User, Crown, LogOut, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const navLinks = [
  { name: "Features", href: "#features", isAnchor: true },
  { name: "Pricing", href: "#pricing", isAnchor: true },
  { name: "About", href: "/about", isAnchor: false },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<{ username: string; full_name: string | null } | null>(null);
  const [subscriptionTier, setSubscriptionTier] = useState<string>('free');
  const [loading, setLoading] = useState(true);

  // Hide navbar on dashboard and auth pages
  const shouldHideNavbar = pathname?.startsWith('/dashboard') || pathname?.startsWith('/signin') || pathname?.startsWith('/signup');

  // Check auth status
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user: currentUser } } = await supabase.auth.getUser();

      if (currentUser) {
        setUser(currentUser);

        // Fetch subscription tier and profile info
        const { data: profile } = await supabase
          .from('profiles')
          .select('username, full_name, subscription_tier, subscription_status')
          .eq('id', currentUser.id)
          .single();

        if (profile) {
          setUserProfile({ username: profile.username, full_name: profile.full_name });
          setSubscriptionTier(profile.subscription_tier || 'free');
        }
      }
      setLoading(false);
    };

    checkAuth();

    // Listen for auth changes
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        setUserProfile(null);
        setSubscriptionTier('free');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (shouldHideNavbar) {
    return null;
  }

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();

    // If we're not on the home page, navigate there first
    if (pathname !== '/') {
      router.push(`/${href}`);
      setIsMobileMenuOpen(false);
      return;
    }

    // If we're on the home page, scroll to the section
    const element = document.querySelector(href);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
      isScrolled ? "py-4 px-4 lg:px-8" : "py-0 px-0"
    }`}>
      <div
        className={`transition-all duration-500 ease-out ${
          isScrolled
            ? "max-w-7xl mx-auto bg-white/95 backdrop-blur-xl shadow-2xl shadow-slate-900/10 rounded-2xl border border-slate-200"
            : "bg-white border-b border-slate-200/50"
        }`}
      >
        <div className={`flex items-center justify-between h-20 px-8 ${isScrolled ? "" : "max-w-7xl mx-auto"}`}>
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className="h-12 w-auto relative group-hover:scale-105 transition-transform duration-300">
              <Image
                src="/qodeb.png"
                alt="QodeBench"
                width={180}
                height={48}
                className="object-contain h-12 w-auto"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              link.isAnchor ? (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className="text-sm font-medium transition-all duration-300 relative group text-slate-600 hover:text-slate-900"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-slate-900 transition-all duration-300 group-hover:w-full" />
                </a>
              ) : (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium transition-all duration-300 relative group text-slate-600 hover:text-slate-900"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-slate-900 transition-all duration-300 group-hover:w-full" />
                </Link>
              )
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            {loading ? (
              <div className="h-10 w-32 bg-slate-200 animate-pulse rounded-md" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2">
                    <User className="h-4 w-4" />
                    <span className="max-w-[150px] truncate">
                      {userProfile?.full_name || userProfile?.username || user.email?.split('@')[0]}
                    </span>
                    {subscriptionTier !== 'free' && (
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        <Crown className="h-3 w-3 mr-1" />
                        {subscriptionTier === 'beta' ? 'Beta' : 'Pro'}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{userProfile?.full_name || userProfile?.username || user.email}</span>
                      <span className="text-xs text-muted-foreground capitalize">
                        {subscriptionTier === 'free' ? 'Free Tier' : `${subscriptionTier} Plan`}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                    <User className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/dashboard/challenges')}>
                    <Code2 className="mr-2 h-4 w-4" />
                    Challenges
                  </DropdownMenuItem>
                  {subscriptionTier === 'free' && (
                    <DropdownMenuItem onClick={() => router.push('/pricing')}>
                      <Crown className="mr-2 h-4 w-4" />
                      Upgrade to Pro
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={async () => {
                      const supabase = createClient();
                      await supabase.auth.signOut();
                      router.push('/');
                      router.refresh();
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button
                  asChild
                  variant="ghost"
                  className="text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                >
                  <Link href="/signin">Login</Link>
                </Button>
                <Button
                  asChild
                  className="bg-gradient-to-r from-brand-500 to-purple-500 hover:from-brand-600 hover:to-purple-600 text-white transition-all duration-300 font-medium px-6 shadow-lg shadow-brand-500/25 hover:shadow-xl hover:shadow-brand-500/30"
                >
                  <Link href="/signup">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 transition-colors duration-300"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className={`md:hidden py-6 px-8 border-t border-slate-200 bg-white ${
            isScrolled ? "rounded-b-2xl" : ""
          }`}>
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                link.isAnchor ? (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => scrollToSection(e, link.href)}
                    className="text-base font-medium text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    {link.name}
                  </a>
                ) : (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-base font-medium text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    {link.name}
                  </Link>
                )
              ))}
              {loading ? (
                <div className="h-10 w-full bg-slate-200 animate-pulse rounded-md mt-2" />
              ) : user ? (
                <>
                  <div className="mt-2 p-4 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{userProfile?.full_name || userProfile?.username || user.email}</span>
                      {subscriptionTier !== 'free' && (
                        <Badge variant="secondary" className="bg-primary/10 text-primary">
                          <Crown className="h-3 w-3 mr-1" />
                          {subscriptionTier === 'beta' ? 'Beta' : 'Pro'}
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground capitalize">
                      {subscriptionTier === 'free' ? 'Free Tier' : `${subscriptionTier} Plan`}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      router.push('/dashboard');
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      router.push('/dashboard/challenges');
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <Code2 className="mr-2 h-4 w-4" />
                    Challenges
                  </Button>
                  {subscriptionTier === 'free' && (
                    <Button
                      className="w-full bg-gradient-to-r from-brand-500 to-purple-500 hover:from-brand-600 hover:to-purple-600 text-white"
                      onClick={() => {
                        router.push('/pricing');
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <Crown className="mr-2 h-4 w-4" />
                      Upgrade to Pro
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={async () => {
                      const supabase = createClient();
                      await supabase.auth.signOut();
                      router.push('/');
                      router.refresh();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full mt-2"
                  >
                    <Link href="/signin">Login</Link>
                  </Button>
                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-brand-500 to-purple-500 hover:from-brand-600 hover:to-purple-600 text-white"
                  >
                    <Link href="/signup">Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
