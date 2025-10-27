"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { name: "Features", href: "#features" },
  { name: "Challenges", href: "#how-it-works" },
  { name: "Pricing", href: "#pricing" },
  { name: "About", href: "#about" },
];

export function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Hide navbar on dashboard and auth pages
  const shouldHideNavbar = pathname?.startsWith('/dashboard') || pathname?.startsWith('/signin') || pathname?.startsWith('/signup');

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
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className="text-sm font-medium transition-all duration-300 relative group text-slate-600 hover:text-slate-900"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-slate-900 transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
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
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className="text-base font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                  {link.name}
                </a>
              ))}
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
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
