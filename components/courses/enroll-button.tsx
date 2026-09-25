"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

interface EnrollButtonProps {
  /** Course being enrolled in — the pricing page shows that course's details. */
  courseSlug?: string;
  label?: string;
  className?: string;
}

/**
 * Enroll CTA: logged-in users go straight to the payment/pricing page,
 * logged-out users sign in first and are redirected there after.
 */
export function EnrollButton({ courseSlug, label = "Enroll Now", className }: EnrollButtonProps) {
  const router = useRouter();
  const [checking, setChecking] = useState(false);

  const handleEnroll = async () => {
    setChecking(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const target = courseSlug
      ? `/pricing?course=${encodeURIComponent(courseSlug)}`
      : "/pricing";
    if (user) {
      router.push(target);
    } else {
      router.push(`/signin?redirect=${encodeURIComponent(target)}`);
    }
  };

  return (
    <Button
      onClick={handleEnroll}
      disabled={checking}
      className={
        className ??
        "h-11 px-6 bg-slate-950 hover:bg-slate-800 text-white font-semibold rounded-md"
      }
    >
      {checking ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          {label}
          <ArrowRight className="ml-2 h-4 w-4" />
        </>
      )}
    </Button>
  );
}
