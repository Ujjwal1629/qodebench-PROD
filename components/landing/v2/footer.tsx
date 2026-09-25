import Link from "next/link";
import Image from "next/image";
import { Github, Linkedin, Twitter } from "lucide-react";
import { CoursesLink } from "@/components/courses/courses-link";

const footerLinks = {
  programs: [
    { name: "All Courses", href: "/courses" },
    { name: "Playwright Test Automation", href: "/courses?syllabus=1#playwright-test-automation" },
    { name: "AI-Powered Testing", href: "/courses?syllabus=1#ai-powered-testing" },
    { name: "Reviews", href: "/#reviews" },
  ],
  platform: [
    { name: "Practice Challenges", href: "/dashboard/challenges" },
    { name: "Learning Modules", href: "/dashboard/learning" },
    { name: "Mock Interviews", href: "/dashboard/interviews" },
    { name: "Pricing", href: "/pricing" },
  ],
  company: [
    { name: "About", href: "/about" },
    { name: "Our Mission", href: "/mission" },
    { name: "Blog", href: "/blog" },
    { name: "Careers", href: "/careers" },
    { name: "Contact", href: "/contact" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms & Conditions", href: "/terms" },
    { name: "Refund & Cancellation", href: "/refund-policy" },
  ],
};

const socialLinks = [
  { name: "Twitter", href: "https://x.com/QodebenchT", icon: Twitter },
  { name: "GitHub", href: "https://github.com/Qodebench-Technologies", icon: Github },
  { name: "LinkedIn", href: "https://www.linkedin.com/company/qodebench-technologies/", icon: Linkedin },
];

export function Footer() {
  return (
    <footer className="bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-[1.6fr_1fr_1fr_1fr_1fr] gap-10 mb-14">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1 pr-6">
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/qodeb.png"
                alt="QodeBench"
                width={150}
                height={40}
                className="object-contain h-10 w-auto"
              />
            </Link>
            <p className="text-[0.875rem] text-slate-600 leading-relaxed mb-6 max-w-xs">
              Structured QA engineering courses — video lessons, written theory, Q&amp;A
              under every topic, and live doubt-clearing every weekend.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-slate-700 transition-colors"
                    aria-label={social.name}
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Link columns */}
          {(
            [
              ["Programs", footerLinks.programs],
              ["Platform", footerLinks.platform],
              ["Company", footerLinks.company],
              ["Legal", footerLinks.legal],
            ] as const
          ).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="text-slate-950 font-semibold mb-4 text-[0.8125rem] tracking-wide uppercase">
                {heading}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    {link.href === "/courses" ? (
                      <CoursesLink className="text-slate-600 hover:text-slate-950 transition-colors text-[0.875rem]">
                        {link.name}
                      </CoursesLink>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-slate-600 hover:text-slate-950 transition-colors text-[0.875rem]"
                      >
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <span className="text-[0.8125rem] text-slate-500">
            © {new Date().getFullYear()} Qodebench Technologies Pvt. Ltd. All rights reserved.
          </span>
          <span className="text-[0.8125rem] text-slate-500">
            Made for QA engineers, in India.
          </span>
        </div>
      </div>
    </footer>
  );
}
