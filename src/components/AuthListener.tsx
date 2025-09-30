"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabaseBrowser";

export default function AuthListener() {
  const supabase = createSupabaseBrowser();
  const router = useRouter();

  useEffect(() => {
    const { data: { subscription } } =
      supabase.auth.onAuthStateChange((event, session) => {
        fetch("/auth/refresh", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ event, session }),
        }).finally(() => {
          router.refresh(); // ✅ re-render header on any auth change
        });
      });

    return () => subscription.unsubscribe();
  }, [supabase, router]);

  return null;
}
