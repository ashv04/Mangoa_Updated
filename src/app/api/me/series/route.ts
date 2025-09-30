import { NextResponse } from "next/server"
import { createSupabaseServer, createSupabaseServerAction } from "@/lib/supabaseServer"
import { resolveImagesForTitle } from "@/lib/imageResolver"

export const runtime = "nodejs"

function missingTable(error: any) {
  return error?.code === "42P01"
}

export async function GET() {
  const supabase = await createSupabaseServer()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }

  const { data, error: seriesErr } = await supabase
    .from("user_series")
    .select(
      `adaptation_id, current_unit, total_units, pinned, minutes_watched, updated_at,
       adaptations (
         id,
         title,
         medium_type,
         language,
         franchise_id,
         franchises ( slug, canonical_name )
       )`
    )
    .eq("user_id", user.id)
    .order("pinned", { ascending: false })
    .order("updated_at", { ascending: false })

  if (seriesErr) {
    if (missingTable(seriesErr)) {
      return NextResponse.json(
        {
          ok: false,
          reason: "user_series_table_missing",
        },
        { status: 501 }
      )
    }
    console.error("user_series query failed", seriesErr.message)
    return NextResponse.json({ ok: false }, { status: 500 })
  }

  const rows = data ?? []
  const series = await Promise.all(
    rows.map(async (row) => {
      const adaptation = (row as any).adaptations
      const medium = (adaptation?.medium_type || "anime") as
        | "anime"
        | "manga"
        | "light_novel"
      const image = adaptation
        ? await resolveImagesForTitle(adaptation.title, medium === "anime" ? "anime" : "manga")
        : { cover: null }
      const totalUnits = row.total_units ?? null
      const currentUnit = row.current_unit ?? 0
      const progressPercent = totalUnits
        ? Math.min(100, Math.round((currentUnit / Math.max(totalUnits, 1)) * 100))
        : 0

      const franchise = adaptation?.franchises
      const franchiseSlug = franchise?.slug ?? null

      return {
        adaptationId: row.adaptation_id,
        title: adaptation?.title ?? "Untitled",
        format: medium,
        language: adaptation?.language ?? null,
        coverImage: image.cover,
        currentUnit,
        totalUnits,
        progressPercent,
        isPinned: !!row.pinned,
        franchiseSlug,
        updatedAt: row.updated_at,
        minutesWatched: row.minutes_watched ?? null,
      }
    })
  )

  const minutesTotal = rows.reduce((sum, row) => {
    if (typeof row.minutes_watched === "number") {
      return sum + row.minutes_watched
    }
    const adaptation = (row as any).adaptations
    const perUnit = adaptation?.medium_type === "anime" ? 24 : 5
    return sum + (row.current_unit || 0) * perUnit
  }, 0)

  return NextResponse.json({
    ok: true,
    series,
    stats: {
      trackedSeries: series.length,
      pinnedSeries: series.filter((item) => item.isPinned).length,
      hoursWatched: minutesTotal > 0 ? Math.max(0, Math.round(minutesTotal / 60)) : 0,
    },
  })
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  if (!body?.adaptationId) {
    return NextResponse.json({ ok: false, error: "adaptationId required" }, { status: 400 })
  }

  const supabase = await createSupabaseServerAction()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }

  const payload = {
    user_id: user.id,
    adaptation_id: body.adaptationId,
    current_unit: body.currentUnit ?? 0,
    total_units: body.totalUnits ?? null,
    pinned: !!body.pinned && body.pinned === true,
    minutes_watched: body.minutesWatched ?? null,
  }

  const { error: upsertErr } = await supabase
    .from("user_series")
    .upsert(payload, { onConflict: "user_id,adaptation_id" })

  if (upsertErr) {
    if (missingTable(upsertErr)) {
      return NextResponse.json(
        {
          ok: false,
          reason: "user_series_table_missing",
        },
        { status: 501 }
      )
    }
    console.error("user_series upsert failed", upsertErr.message)
    return NextResponse.json({ ok: false, error: upsertErr.message }, { status: 400 })
  }

  return NextResponse.json({ ok: true })
}

export async function DELETE() {
  return NextResponse.json({ ok: false }, { status: 405 })
}

