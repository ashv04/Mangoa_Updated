// src/app/login/page.tsx
"use client";

import { useMemo, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabaseBrowser";

// suspense wrapper to satisfy useSearchParams requirement
export default function LoginPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-md p-6">loading…</div>}>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const supabase = useMemo(() => createSupabaseBrowser(), []);
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/dashboard";

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // keep only if there is no db trigger to auto create profiles
  async function upsertProfile() {
    try {
      await fetch("/api/profiles/upsert", { method: "POST" });
    } catch {}
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);

    try {
      // sign in or sign up in the browser
      let session = null as any;

      if (mode === "signup") {
        const siteUrl =
          process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${siteUrl}/auth/callback`,
          },
        });
        if (error) throw error;
        session = data.session; // may be null when email confirmation is required
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        session = data.session;
      }

      // if email confirmation is required, ask user to check email
      if (mode === "signup" && !session) {
        setErr(null);
        alert("Check your email to confirm your account. Then sign in.");
        return;
      }

      // sync server cookies so rsc can see the session
      await fetch("/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event: "SIGNED_IN", session }),
      });

      // 3) (optional) ensure profile exists if you don't have a DB trigger
      await upsertProfile().catch(() => {});

      // route based on role. admins/mods to admin, others to next
      // After you POST to /auth/refresh and (optionally) upsertProfile()
      let dest = next;
      try {
        const res = await fetch("/api/me/role", { cache: "no-store" });
        const { role } = await res.json();
        if (role === "admin" || role === "moderator") {
          dest = "/admin/approval";
        }
      } catch {
        /* fall back to `next` */
      }

      router.replace(dest);
      router.refresh();
    } catch (e: any) {
      setErr(e?.message ?? "Authentication failed");
    } finally {
      setBusy(false);
    }
  }

  async function handleSignOut() {
    setBusy(true);
    setErr(null);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      await fetch("/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event: "SIGNED_OUT", session: null }),
      });

      router.replace("/");
      router.refresh();
    } catch (e: any) {
      setErr(e?.message ?? "Sign out failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-semibold mb-4 text-center">Welcome</h1>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          className="w-full border rounded p-2"
          type="email"
          placeholder="email@domain.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <input
          className="w-full border rounded p-2"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
        />

        <button className="w-full rounded p-2 border" disabled={busy} type="submit">
          {busy ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"}
        </button>

        {err && <p className="text-red-600 text-sm">{err}</p>}
      </form>

      <div className="flex items-center justify-between mt-4 text-sm">
        <button className="underline" onClick={() => setMode(mode === "signup" ? "signin" : "signup")}>
          {mode === "signup" ? "Have an account? Sign in" : "New here? Create an account"}
        </button>

        <button className="underline" onClick={handleSignOut}>
          Sign out
        </button>
      </div>
    </div>
  );
}
