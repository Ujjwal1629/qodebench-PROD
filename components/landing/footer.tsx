import Link from "next/link";
import Image from "next/image";
import { Github, Linkedin, Twitter } from "lucide-react";

const footerLinks = {
  product: [
    { name: "Challenges", href: "#features" },
    { name: "Roadmap", href: "#how-it-works" },
    { name: "Mock Interviews", href: "#features" },
    { name: "Leaderboard", href: "/leaderboard" },
  ],
  resources: [
    { name: "Documentation", href: "/docs" },
    { name: "Blog", href: "/blog" },
    { name: "AI Tools Guide", href: "/guides" },
    { name: "Tutorials", href: "/tutorials" },
  ],
  company: [
    { name: "About", href: "/about" },
    { name: "Careers", href: "/careers" },
    { name: "Contact", href: "/contact" },
    { name: "Our Mission", href: "#about" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cookie Policy", href: "/cookies" },
  ],
};

const socialLinks = [
  { name: "Twitter", href: "https://twitter.com/qodebench", icon: Twitter },
  { name: "GitHub", href: "https://github.com/qodebench", icon: Github },
  { name: "LinkedIn", href: "https://linkedin.com/company/qodebench", icon: Linkedin },
];

export function Footer() {
  return (
    <footer id="about" className="bg-white border-t border-slate-200">
      <div className="container mx-auto px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-12">
          {/* Product */}
          <div>
            <h3 className="text-slate-900 font-semibold mb-4 text-sm">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-slate-600 hover:text-slate-900 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-slate-900 font-semibold mb-4 text-sm">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-slate-600 hover:text-slate-900 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-slate-900 font-semibold mb-4 text-sm">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-slate-600 hover:text-slate-900 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-slate-900 font-semibold mb-4 text-sm">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-slate-600 hover:text-slate-900 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Left: Logo and Copyright */}
            <div className="flex flex-col md:flex-row items-center gap-6">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="w-8 h-8 relative">
                  <Image
                    src="/qodebench.svg"
                    alt="QodeBench Logo"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
                <span className="text-base font-semibold text-slate-900">
                  QodeBench
                </span>
              </Link>
              <span className="text-sm text-slate-500">
                © {new Date().getFullYear()} QodeBench. All rights reserved.
              </span>
            </div>

            {/* Right: Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label={social.name}
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Status Indicator */}
          <div className="mt-6 flex items-center justify-center md:justify-start gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-sm text-slate-600">All services are online</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
