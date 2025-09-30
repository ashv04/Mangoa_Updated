// src/app/api/me/role/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabaseServer";
import { createSupabaseService } from "@/lib/supabaseService";

export const dynamic = "force-dynamic";

export async function GET() {
  // Read who is signed in from cookies (anon client)
  const supa = await createSupabaseServer();
  const { data: { user } } = await supa.auth.getUser();
  if (!user) return NextResponse.json({ role: null });

  // Fetch role with service client (bypass RLS safely on the server)
  const admin = createSupabaseService();
  const { data } = await admin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  return NextResponse.json({ role: data?.role ?? null });
}
