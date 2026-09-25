"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface CoursesLinkProps {
  /** Where logged-out visitors go. Defaults to the public catalog. */
  href?: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * Courses entry point: logged-in users land on their dashboard course list,
 * logged-out visitors see the public marketing catalog.
 *
 * Resolves auth on the client so the surrounding page stays static.
 */
export function CoursesLink({ href = "/courses", className, children }: CoursesLinkProps) {
  const [target, setTarget] = useState(href);

  useEffect(() => {
    let active = true;

    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (active && user) setTarget("/dashboard/courses");
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) setTarget(session?.user ? "/dashboard/courses" : href);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [href]);

  return (
    <Link href={target} className={className}>
      {children}
    </Link>
  );
}
