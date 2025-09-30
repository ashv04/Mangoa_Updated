import { NextResponse } from "next/server"
import { createSupabaseServer, createSupabaseServerAction } from "@/lib/supabaseServer"
import { resolveImagesForTitle } from "@/lib/imageResolver"

export const runtime = "nodejs"

function missingTable(error: any) {
  return error?.code === "42P01"
}

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ adaptationId: string }> }
) {
  const { adaptationId } = await ctx.params
  const supabase = await createSupabaseServer()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) return NextResponse.json({ ok: false }, { status: 401 })

  const { data, error: selectErr } = await supabase
    .from("user_series")
    .select(
      `adaptation_id, current_unit, total_units, pinned, minutes_watched,
       adaptations (
         id,
         title,
         medium_type,
         language
       )`
    )
    .eq("user_id", user.id)
    .eq("adaptation_id", adaptationId)
    .maybeSingle()

  if (selectErr) {
    if (missingTable(selectErr)) {
      return NextResponse.json({ ok: false, reason: "user_series_table_missing" }, { status: 501 })
    }
    console.error("user_series status error", selectErr.message)
    return NextResponse.json({ ok: false }, { status: 500 })
  }

  if (!data) {
    return NextResponse.json({ ok: false }, { status: 404 })
  }

  const adaptation = (data as any).adaptations
  const medium = (adaptation?.medium_type || "anime") as "anime" | "manga" | "light_novel"
  const image = adaptation
    ? await resolveImagesForTitle(adaptation.title, medium === "anime" ? "anime" : "manga")
    : { cover: null }

  return NextResponse.json({
    ok: true,
    series: {
      adaptationId: data.adaptation_id,
      currentUnit: data.current_unit ?? 0,
      totalUnits: data.total_units ?? null,
      pinned: !!data.pinned,
      minutesWatched: data.minutes_watched ?? null,
      title: adaptation?.title ?? "Untitled",
      coverImage: image.cover,
      format: medium,
    },
  })
}

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ adaptationId: string }> }
) {
  const { adaptationId } = await ctx.params
  const body = await req.json().catch(() => null)
  if (!body) {
    return NextResponse.json({ ok: false, error: "missing payload" }, { status: 400 })
  }

  const supabase = await createSupabaseServerAction()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) return NextResponse.json({ ok: false }, { status: 401 })

  const updates: Record<string, any> = { updated_at: new Date().toISOString() }
  if (typeof body.currentUnit === "number") updates.current_unit = body.currentUnit
  if (typeof body.totalUnits === "number") updates.total_units = body.totalUnits
  if (typeof body.minutesWatched === "number") updates.minutes_watched = body.minutesWatched
  if (typeof body.pinned === "boolean") updates.pinned = body.pinned

  const { error: updateErr } = await supabase
    .from("user_series")
    .update(updates)
    .eq("user_id", user.id)
    .eq("adaptation_id", adaptationId)

  if (updateErr) {
    if (missingTable(updateErr)) {
      return NextResponse.json({ ok: false, reason: "user_series_table_missing" }, { status: 501 })
    }
    console.error("user_series update failed", updateErr.message)
    return NextResponse.json({ ok: false, error: updateErr.message }, { status: 400 })
  }

  return NextResponse.json({ ok: true })
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ adaptationId: string }> }
) {
  const { adaptationId } = await ctx.params
  const supabase = await createSupabaseServerAction()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) return NextResponse.json({ ok: false }, { status: 401 })

  const { error: deleteErr } = await supabase
    .from("user_series")
    .delete()
    .eq("user_id", user.id)
    .eq("adaptation_id", adaptationId)

  if (deleteErr) {
    if (missingTable(deleteErr)) {
      return NextResponse.json({ ok: false, reason: "user_series_table_missing" }, { status: 501 })
    }
    console.error("user_series delete failed", deleteErr.message)
    return NextResponse.json({ ok: false, error: deleteErr.message }, { status: 400 })
  }

  return NextResponse.json({ ok: true })
}
