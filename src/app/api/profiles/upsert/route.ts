import { NextResponse } from "next/server"
import { createSupabaseServer } from "@/lib/supabaseServer"

export const runtime = "nodejs"

export async function POST() {
  const supabase = await createSupabaseServer()
  const { data: { user }, error: uerr } = await supabase.auth.getUser()
  if (uerr || !user) return NextResponse.json({ ok: false }, { status: 401 })

  const md = (user.user_metadata ?? {}) as Record<string, any>
  const emailPart = (user.email || "user").split("@")[0]
  const displayName = md.display_name || md.full_name || emailPart
  const avatarUrl = md.avatar_url ?? null

  const { error } = await supabase
    .from("profiles")
    .upsert([
      {
        id: user.id,
        display_name: displayName,
        avatar_url: avatarUrl,
        role: "user",
        reputation: 0,
        verified: false,
      },
    ], { onConflict: "id" })

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true })
}

