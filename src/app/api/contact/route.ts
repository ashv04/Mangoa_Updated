import { NextResponse } from "next/server"
import { createSupabaseService } from "@/lib/supabaseService"

export const runtime = "nodejs"

// simple email check
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// write contact message to supabase
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null)
    if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })

    const name = String(body.name || "").trim()
    const email = String(body.email || "").trim().toLowerCase()
    const subject = body.subject ? String(body.subject).trim() : null
    const message = String(body.message || "").trim()

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 })
    }

    const supabase = createSupabaseService()
    const { error } = await supabase.from("contacts").insert([
      { name, email, subject, message },
    ])
    if (error) {
      console.error("contact insert error:", error.message)
      return NextResponse.json({ error: "Failed to store message" }, { status: 500 })
    }
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    console.error("contact POST crashed:", e?.message || e)
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 })
  }
}
