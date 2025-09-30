// src/app/auth/signup/signup.actions.ts
"use server";

import { createSupabaseServer } from "@/lib/supabaseServer";

export type FormState = { ok: boolean; message: string };

export async function signupAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = await createSupabaseServer();

  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const display_name = String(formData.get("display_name") || "").trim();

  if (!email || !password) {
    return { ok: false, message: "Email and password are required." };
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback`,
      // ⬇️ this is the important bit
      data: { display_name },
    },
  });

  if (error) return { ok: false, message: error.message };

  return {
    ok: true,
    message:
      "Check your email to confirm your account. Once confirmed, you’ll be signed in.",
  };
}
