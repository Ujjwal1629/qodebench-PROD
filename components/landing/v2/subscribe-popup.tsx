"use client";

import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import {
  WHATSAPP_CHANNEL_URL,
  WhatsAppIcon,
} from "@/components/landing/v2/stay-connected";

const SEEN_KEY = "qb-subscribe-popup-seen";
const SHOW_AFTER_MS = 9000;

export function SubscribePopup() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(SEEN_KEY)) return;

    let timer: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;

    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      // Only new, logged-out visitors get the popup
      if (user || cancelled) return;
      timer = setTimeout(() => setOpen(true), SHOW_AFTER_MS);
    });

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, []);

  const dismiss = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) localStorage.setItem(SEEN_KEY, "1");
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    // TODO: connect to a newsletter endpoint/provider before launch.
    setSubscribed(true);
    localStorage.setItem(SEEN_KEY, "1");
  };

  return (
    <Dialog open={open} onOpenChange={dismiss}>
      <DialogContent className="max-w-md p-0 gap-0 overflow-hidden rounded-xl">
        {/* Top band */}
        <div className="bg-white px-7 pt-7 pb-5 border-b border-slate-100">
          <p className="text-[11px] font-semibold tracking-[0.16em] uppercase text-brand-600 mb-2">
            Stay in the loop
          </p>
          <DialogTitle className="font-serif text-[22px] leading-snug text-slate-950 font-normal">
            New lessons, batch openings and live Q&amp;A schedules.
          </DialogTitle>
        </div>

        <div className="px-7 py-6">
          {subscribed ? (
            <div className="flex items-center gap-2.5 text-[14px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md px-4 py-3 mb-5">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              You&apos;re on the list. See you in your inbox.
            </div>
          ) : (
            <>
              <p className="text-[13.5px] text-slate-600 leading-relaxed mb-4">
                One email a week — no spam, unsubscribe anytime.
              </p>
              <form onSubmit={handleSubscribe} className="flex gap-2.5 mb-5">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="flex-1 h-10 px-3.5 rounded-md border border-slate-300 text-[13.5px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                />
                <Button
                  type="submit"
                  className="h-10 px-5 bg-slate-950 hover:bg-slate-800 text-white font-semibold rounded-md shrink-0"
                >
                  Subscribe
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              </form>
            </>
          )}

          <div className="flex items-center gap-3 mb-5">
            <span className="h-px flex-1 bg-slate-200" />
            <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
              or
            </span>
            <span className="h-px flex-1 bg-slate-200" />
          </div>

          <Button
            asChild
            variant="outline"
            className="w-full h-10 font-semibold border-slate-300 text-slate-800 hover:bg-slate-50 rounded-md"
          >
            <a href={WHATSAPP_CHANNEL_URL} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon className="h-5 w-5 mr-2 text-[#25D366]" />
              Follow on WhatsApp
            </a>
          </Button>

          <p className="text-[11.5px] text-slate-400 mt-4 text-center">
            Batch announcements and live session reminders. Your number stays private.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
