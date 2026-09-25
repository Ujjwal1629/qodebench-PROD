"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

import { WHATSAPP_CHANNEL_URL } from "@/lib/constants/contact";

export { WHATSAPP_CHANNEL_URL };

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

export function StayConnected() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    // TODO: connect to a newsletter endpoint/provider before launch.
    setSubscribed(true);
  };

  return (
    <section className="bg-slate-50 py-16 lg:py-20 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid md:grid-cols-2 bg-white rounded-xl border border-slate-200 divide-y md:divide-y-0 md:divide-x divide-slate-200 overflow-hidden">
          {/* Newsletter */}
          <div className="p-8 lg:p-10">
            <p className="text-[0.75rem] font-semibold tracking-[0.14em] uppercase text-slate-500 mb-3">
              Newsletter
            </p>
            <h3 className="font-serif text-2xl text-slate-950 mb-2">
              New lessons, straight to your inbox.
            </h3>
            <p className="text-[0.9062rem] text-slate-600 leading-relaxed mb-6">
              One email a week — new modules, batch openings and the weekend session
              schedule. No spam, unsubscribe anytime.
            </p>

            {subscribed ? (
              <div className="flex items-center gap-2.5 text-[0.875rem] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md px-4 py-3">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                You&apos;re on the list. See you in your inbox.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="flex-1 h-11 px-4 rounded-md border border-slate-300 text-[0.875rem] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                />
                <Button
                  type="submit"
                  className="h-11 px-6 bg-slate-950 hover:bg-slate-800 text-white font-semibold rounded-md shrink-0"
                >
                  Subscribe
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            )}
          </div>

          {/* WhatsApp channel */}
          <div className="p-8 lg:p-10">
            <p className="text-[0.75rem] font-semibold tracking-[0.14em] uppercase text-slate-500 mb-3">
              WhatsApp Channel
            </p>
            <h3 className="font-serif text-2xl text-slate-950 mb-2">
              Updates where you already are.
            </h3>
            <p className="text-[0.9062rem] text-slate-600 leading-relaxed mb-6">
              Follow the QodeBench channel for batch announcements and live Q&amp;A
              reminders. It&apos;s a broadcast channel — your number stays private.
            </p>

            <Button
              asChild
              variant="outline"
              className="h-11 px-6 font-semibold border-slate-300 text-slate-800 hover:bg-slate-50 rounded-md"
            >
              <a href={WHATSAPP_CHANNEL_URL} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon className="h-5 w-5 mr-2 text-[#25D366]" />
                Follow on WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
