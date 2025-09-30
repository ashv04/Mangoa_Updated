import { NextResponse } from "next/server"
import { createSupabaseServer } from "@/lib/supabaseServer"

export const runtime = "nodejs"

// returns basic dashboard stats for the signed in user
export async function GET() {
  const s = await createSupabaseServer()
  const { data: { user }, error } = await s.auth.getUser()
  if (error || !user) return NextResponse.json({ ok: false }, { status: 401 })

  // profile
  const { data: prof } = await s
    .from("profiles")
    .select("display_name, reputation")
    .eq("id", user.id)
    .maybeSingle()

  // contributions: try both possible columns for safety
  let contributed = 0
  try {
    const { count } = await s
      .from("mapping_submissions")
      .select("id", { count: "exact", head: true })
      .eq("submitted_by", user.id)
    contributed = count ?? 0
  } catch {}
  if (!contributed) {
    const { count } = await s
      .from("mapping_submissions")
      .select("id", { count: "exact", head: true })
      .eq("created_by_user_id", user.id)
    contributed = count ?? 0
  }

  let trackedSeries = 0
  let pinnedSeries = 0
  let totalMinutes = 0

  try {
    const { data: trackedRows, error: trackedError } = await s
      .from("user_series")
      .select(
        "current_unit,total_units,pinned,minutes_watched,adaptations ( id, medium_type )"
      )
      .eq("user_id", user.id)

    if (!trackedError && Array.isArray(trackedRows)) {
      trackedSeries = trackedRows.length
      pinnedSeries = trackedRows.filter((row) => row.pinned).length
      for (const row of trackedRows as any[]) {
        const ad = (row as any).adaptations
        const medium = Array.isArray(ad) ? ad?.[0]?.medium_type : ad?.medium_type
        const minutes =
          typeof row.minutes_watched === "number"
            ? row.minutes_watched
            : (row.current_unit || 0) * (medium === "anime" ? 24 : 5)
        totalMinutes += minutes
      }
    } else if (trackedError?.code !== "42P01") {
      console.error("user_series fetch failed", trackedError?.message)
    }
  } catch (err) {
    console.error("user_series aggregation error", err)
  }

  const stats = {
    trackedSeries,
    pinnedSeries,
    mappingsContributed: contributed,
    hoursWatched:
      totalMinutes > 0
        ? Math.max(0, Math.round(totalMinutes / 60))
        : prof?.reputation
        ? Math.max(0, Math.floor(Number(prof.reputation)))
        : 0,
  }

  return NextResponse.json({
    ok: true,
    user: { id: user.id, email: user.email, displayName: prof?.display_name ?? user.email?.split("@")[0] },
    stats,
  })
}
