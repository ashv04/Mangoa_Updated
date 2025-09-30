// src/app/api/mappings/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createSupabaseServer } from "@/lib/supabaseServer";

export const runtime = "nodejs";

const ALLOWED_REL = new Set([
  "equivalent",
  "overlaps",
  "adapts",
  "expands",
  "compresses",
]);

// For old payloads, treat equivalent/overlaps as symmetric (no-op here, just kept for parity)
function isSymmetric(rel: string) {
  return rel === "equivalent" || rel === "overlaps";
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // ===== New payload shape (preferred) =====
    // from the Contribute page
    const {
      franchise_id,
      adaptation_a_id,
      unit_type_a,
      seq_a,
      subunit_type_a = null,
      sub_seq_a = null,

      adaptation_b_id,
      unit_type_b,
      seq_b,
      subunit_type_b = null,
      sub_seq_b = null,

      relation_type = "overlaps",
      confidence = 0.7,
      notes = "",
    } = body || {};

    // ===== Legacy payload support (best-effort) =====
    // unitA_adaptation/unitB_adaptation were adaptation *titles*
    const {
      unitA_adaptation,
      unitA_seq,
      unitB_adaptation,
      unitB_seq,
    } = body || {};

    // Identify caller
    const userClient = await createSupabaseServer();
    const { data: userRes, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userRes.user) {
      return NextResponse.json(
        { ok: false, error: "Unauthenticated." },
        { status: 401 }
      );
    }
    const userId = userRes.user.id;

    // Service client (bypass RLS for inserts/lookups)
    const svc = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    );

    // If we received the new shape, validate and insert directly into mapping_submissions
    if (franchise_id && adaptation_a_id && adaptation_b_id) {
      // Basic validation
      if (!ALLOWED_REL.has(relation_type)) {
        return NextResponse.json(
          { ok: false, error: "Invalid relation_type." },
          { status: 400 }
        );
      }
      if (!(typeof confidence === "number" && confidence >= 0 && confidence <= 1)) {
        return NextResponse.json(
          { ok: false, error: "confidence must be 0..1" },
          { status: 400 }
        );
      }
      if (!(seq_a && seq_b)) {
        return NextResponse.json(
          { ok: false, error: "seq_a and seq_b are required." },
          { status: 400 }
        );
      }
      if (!unit_type_a || !unit_type_b) {
        return NextResponse.json(
          { ok: false, error: "unit_type_a and unit_type_b are required." },
          { status: 400 }
        );
      }

      const { data: inserted, error: insErr } = await svc
        .from("mapping_submissions")
        .insert({
          submitted_by: userId,
          franchise_id,
          adaptation_a_id,
          unit_type_a,
          seq_a,
          subunit_type_a,        // episode|chapter|null
          sub_seq_a,             // number|null

          adaptation_b_id,
          unit_type_b,
          seq_b,
          subunit_type_b,        // episode|chapter|null
          sub_seq_b,             // number|null

          relation_type,
          confidence,
          notes,
          status: "submitted",
          submitted_at: new Date().toISOString(),
        })
        .select("id")
        .single();

      if (insErr) {
        return NextResponse.json(
          { ok: false, error: insErr.message },
          { status: 400 }
        );
      }

      return NextResponse.json({ ok: true, id: inserted.id });
    }

    // ===== Legacy path: try to resolve adaptation titles -> adaptation IDs, then insert =====
    if (unitA_adaptation && unitA_seq && unitB_adaptation && unitB_seq) {
      // Look up the two adaptations by title
      const { data: adapts, error: aErr } = await svc
        .from("adaptations")
        .select("id,title,franchise_id,medium_type")
        .in("title", [unitA_adaptation, unitB_adaptation]);

      if (aErr) {
        return NextResponse.json({ ok: false, error: aErr.message }, { status: 400 });
      }
      const aRow = adapts?.find((r) => r.title === unitA_adaptation);
      const bRow = adapts?.find((r) => r.title === unitB_adaptation);
      if (!aRow || !bRow) {
        return NextResponse.json(
          { ok: false, error: "Could not resolve adaptations by title." },
          { status: 400 }
        );
      }

      // Derive defaults for unit/subunit from medium_type
      const unitA = aRow.medium_type === "anime" ? "season" : "volume";
      const unitB = bRow.medium_type === "anime" ? "season" : "volume";
      const subA = aRow.medium_type === "anime" ? "episode" : "chapter";
      const subB = bRow.medium_type === "anime" ? "episode" : "chapter";

      const { data: inserted, error: insErr } = await svc
        .from("mapping_submissions")
        .insert({
          submitted_by: userId,
          franchise_id: aRow.franchise_id ?? bRow.franchise_id ?? null,
          adaptation_a_id: aRow.id,
          unit_type_a: unitA,
          seq_a: Number(unitA_seq),
          subunit_type_a: subA,
          sub_seq_a: null, // unknown in legacy payload

          adaptation_b_id: bRow.id,
          unit_type_b: unitB,
          seq_b: Number(unitB_seq),
          subunit_type_b: subB,
          sub_seq_b: null, // unknown in legacy payload

          relation_type,
          confidence,
          notes,
          status: "submitted",
          submitted_at: new Date().toISOString(),
        })
        .select("id")
        .single();

      if (insErr) {
        return NextResponse.json(
          { ok: false, error: insErr.message },
          { status: 400 }
        );
      }

      return NextResponse.json({ ok: true, id: inserted.id });
    }

    // If neither new nor legacy shapes are satisfied
    return NextResponse.json(
      { ok: false, error: "Missing required fields. Use the new payload shape." },
      { status: 400 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
