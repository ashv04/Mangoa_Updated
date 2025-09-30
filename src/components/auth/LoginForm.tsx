"use client";
import { useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabaseBrowser";

export default function LoginForm() {
  const supabase = createSupabaseBrowser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setMsg(error.message);
    } else {
      setMsg("Logged in!");
      // optional: redirect to dashboard/admin
      window.location.href = "/dashboard";
    }
  }

  async function onMagicLink() {
    setMsg(null);
    setLoading(true);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin;

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${siteUrl}/auth/callback`, // must be allowed in Supabase
      },
    });
    setLoading(false);
    setMsg(error ? error.message : "Check your email for a login link.");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div>
        <label className="block text-sm text-gray-600">Email</label>
        <input
          className="border rounded p-2 w-full"
          type="email" value={email} onChange={e => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label className="block text-sm text-gray-600">Password</label>
        <input
          className="border rounded p-2 w-full"
          type="password" value={password} onChange={e => setPassword(e.target.value)}
          placeholder="••••••••"
        />
      </div>
      <button
        className="bg-indigo-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Signing in…" : "Sign In"}
      </button>
      <button
        type="button"
        onClick={onMagicLink}
        className="ml-2 px-3 py-2 rounded border"
        disabled={!email || loading}
      >
        Send Magic Link
      </button>

      {msg && (
        <div className={`text-sm mt-2 ${msg.includes("!") ? "text-green-700" : "text-red-700"}`}>
          {msg}
        </div>
      )}
    </form>
  );
}
