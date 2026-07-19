"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, User, Crown, LogOut, BookOpen, ArrowRight } from "lucide-react";
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
  { name: "Courses", href: "/courses", isAnchor: false },
  { name: "Reviews", href: "#reviews", isAnchor: true },
  { name: "Pricing", href: "/pricing", isAnchor: false },
  { name: "About", href: "/about", isAnchor: false },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<{ username: string; full_name: string | null } | null>(null);
  const [subscriptionTier, setSubscriptionTier] = useState<string>("free");
  const [loading, setLoading] = useState(true);

  const shouldHideNavbar =
    pathname?.startsWith("/dashboard") ||
    pathname?.startsWith("/signin") ||
    pathname?.startsWith("/signup");

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      if (currentUser) {
        setUser(currentUser);

        const { data: profile } = await supabase
          .from("profiles")
          .select("username, full_name, subscription_tier, subscription_status")
          .eq("id", currentUser.id)
          .single();

        if (profile) {
          setUserProfile({ username: profile.username, full_name: profile.full_name });
          setSubscriptionTier(profile.subscription_tier || "free");
        }
      }
      setLoading(false);
    };

    checkAuth();

    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        setUserProfile(null);
        setSubscriptionTier("free");
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

    if (pathname !== "/") {
      router.push(`/${href}`);
      setIsMobileMenuOpen(false);
      return;
    }

    const element = document.querySelector(href);
    if (element) {
      const offset = 90;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Announcement bar — collapses on scroll */}
      <div
        className={`bg-slate-950 text-white overflow-hidden transition-all duration-300 ${
          isScrolled ? "max-h-0" : "max-h-12"
        }`}
      >
        <Link
          href="/courses"
          className="flex items-center justify-center gap-2 px-4 py-2.5 text-[13px] font-medium tracking-wide hover:bg-slate-900 transition-colors"
        >
          <span className="hidden sm:inline text-slate-400">New batch —</span>
          <span>Playwright Automation + AI Testing is now live</span>
          <span className="text-brand-400 inline-flex items-center gap-1">
            Explore <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </Link>
      </div>

      {/* Main nav */}
      <nav
        className={`bg-white border-b border-slate-200 transition-shadow duration-300 ${
          isScrolled ? "shadow-[0_1px_12px_rgba(15,23,42,0.08)]" : ""
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px]">
            {/* Logo */}
            <Link href="/" className="flex items-center shrink-0">
              <Image
                src="/qodeb.png"
                alt="QodeBench"
                width={168}
                height={44}
                className="object-contain h-11 w-auto"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) =>
                link.isAnchor ? (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => scrollToSection(e, link.href)}
                    className="text-[14px] font-medium text-slate-700 hover:text-slate-950 transition-colors"
                  >
                    {link.name}
                  </a>
                ) : (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-[14px] font-medium text-slate-700 hover:text-slate-950 transition-colors"
                  >
                    {link.name}
                  </Link>
                )
              )}
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-3">
              {loading ? (
                <div className="h-10 w-32 bg-slate-100 animate-pulse rounded-md" />
              ) : user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="gap-2">
                      <User className="h-4 w-4" />
                      <span className="max-w-[150px] truncate">
                        {userProfile?.full_name || userProfile?.username || user.email?.split("@")[0]}
                      </span>
                      {subscriptionTier !== "free" && (
                        <Badge variant="secondary" className="bg-primary/10 text-primary">
                          <Crown className="h-3 w-3 mr-1" />
                          {subscriptionTier === "launch_offer" ? "Launch" : "Pro"}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {userProfile?.full_name || userProfile?.username || user.email}
                        </span>
                        <span className="text-xs text-muted-foreground capitalize">
                          {subscriptionTier === "free" ? "Free Tier" : `${subscriptionTier} Plan`}
                        </span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                      <BookOpen className="mr-2 h-4 w-4" />
                      Dashboard
                    </DropdownMenuItem>
                    {subscriptionTier === "free" && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.push("/pricing")}>
                          <Crown className="mr-2 h-4 w-4" />
                          Upgrade
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={async () => {
                        const supabase = createClient();
                        await supabase.auth.signOut();
                        router.push("/");
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
                    className="text-slate-700 hover:text-slate-950 hover:bg-slate-100 font-medium"
                  >
                    <Link href="/signin">Sign in</Link>
                  </Button>
                  <Button
                    asChild
                    className="bg-slate-950 hover:bg-slate-800 text-white font-medium px-5 rounded-md"
                  >
                    <Link href="/signup">Start Learning</Link>
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-slate-700 hover:text-slate-950 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-6 px-6 border-t border-slate-200 bg-white">
            <div className="flex flex-col gap-5">
              {navLinks.map((link) =>
                link.isAnchor ? (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => scrollToSection(e, link.href)}
                    className="text-base font-medium text-slate-700 hover:text-slate-950 transition-colors"
                  >
                    {link.name}
                  </a>
                ) : (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-base font-medium text-slate-700 hover:text-slate-950 transition-colors"
                  >
                    {link.name}
                  </Link>
                )
              )}
              {loading ? (
                <div className="h-10 w-full bg-slate-100 animate-pulse rounded-md mt-2" />
              ) : user ? (
                <>
                  <div className="mt-2 p-4 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">
                        {userProfile?.full_name || userProfile?.username || user.email}
                      </span>
                      {subscriptionTier !== "free" && (
                        <Badge variant="secondary" className="bg-primary/10 text-primary">
                          <Crown className="h-3 w-3 mr-1" />
                          Pro
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground capitalize">
                      {subscriptionTier === "free" ? "Free Tier" : `${subscriptionTier} Plan`}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      router.push("/dashboard");
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={async () => {
                      const supabase = createClient();
                      await supabase.auth.signOut();
                      router.push("/");
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
                  <Button asChild variant="outline" className="w-full mt-2">
                    <Link href="/signin">Sign in</Link>
                  </Button>
                  <Button asChild className="w-full bg-slate-950 hover:bg-slate-800 text-white">
                    <Link href="/signup">Start Learning</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
