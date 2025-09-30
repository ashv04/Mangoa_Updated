import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabaseServer";
import { createSupabaseService } from "@/lib/supabaseService";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const anon = await createSupabaseServer();
  const { data: { user } } = await anon.auth.getUser();
  if (!user) return NextResponse.json({ authenticated: false, role: null });

  const svc = createSupabaseService();
  const { data, error } = await svc
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  return NextResponse.json({
    authenticated: true,
    userId: user.id,
    role: data?.role ?? null,
    svcError: error?.message ?? null,
  });
}
