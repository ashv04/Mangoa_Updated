// src/app/auth/refresh/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServerAction } from "@/lib/supabaseServer";

export const runtime = "nodejs"; // cookie mutations require Node runtime

export async function POST(req: Request) {
  const { event, session } = await req.json();

  // ⬇️ await the async factory
  const supabase = await createSupabaseServerAction();

  if (event === "SIGNED_IN" && session) {
    await supabase.auth.setSession(session);
  }
  if (event === "SIGNED_OUT") {
    await supabase.auth.signOut();
  }

  return NextResponse.json({ ok: true });
}
