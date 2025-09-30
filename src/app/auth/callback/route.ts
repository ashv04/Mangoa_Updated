// src/app/auth/callback/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabaseServer";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const search = url.searchParams;

  const code = search.get("code") ?? search.get("token_hash");
  const next = search.get("redirect") || search.get("next") || "/dashboard";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? url.origin;

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=missing-code", siteUrl));
  }

  const supabase = await createSupabaseServer();

  // Create a session from the code/invite/recovery link
  const { error: exchangeErr } = await supabase.auth.exchangeCodeForSession(code);
  if (exchangeErr) {
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(exchangeErr.message)}`, siteUrl)
    );
  }

  // Populate/refresh profile
  const { data: userRes } = await supabase.auth.getUser();
  const user = userRes?.user;
  if (user) {
    const md = (user.user_metadata ?? {}) as Record<string, any>;
    const emailPart = (user.email || "user").split("@")[0];

    // Prefer the field we sent during sign-up; then fall back
    const displayName =
      md.display_name || md.full_name || emailPart;

    const avatarUrl = md.avatar_url ?? null;

    const { error: upsertErr } = await supabase
      .from("profiles")
      .upsert(
        [
          {
            id: user.id,
            display_name: displayName,
            avatar_url: avatarUrl,
            role: "user",
            reputation: 0,
            verified: false,
          },
        ],
        { onConflict: "id" }
      );

    if (upsertErr) {
      // Log to server console so we actually see it if RLS blocks updates
      console.error("profiles upsert failed:", upsertErr.message);
    }
  }

  return NextResponse.redirect(new URL(next, siteUrl));
}
