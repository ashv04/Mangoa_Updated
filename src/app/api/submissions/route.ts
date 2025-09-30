import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabaseServer";

export const runtime = "nodejs";

type UnitType = "volume" | "season";
type SubUnit = "episode" | "chapter" | null | undefined;
type Relation =
  | "equivalent"
  | "overlaps"
  | "adapts"
  | "expands"
  | "compresses";

type Body = {
  franchise_id?: string;

  adaptation_a_id?: string;
  unit_type_a?: UnitType;
  seq_a?: number | string;
  subunit_type_a?: SubUnit;
  sub_seq_a?: number | string | null;

  adaptation_b_id?: string;
  unit_type_b?: UnitType;
  seq_b?: number | string;
  subunit_type_b?: SubUnit;
  sub_seq_b?: number | string | null;

  relation_type?: Relation;
  confidence?: number;
  notes?: string;
};

const ALLOWED_REL = new Set<Relation>([
  "equivalent",
  "overlaps",
  "adapts",
  "expands",
  "compresses",
]);

const isUnitType = (v: unknown): v is UnitType =>
  v === "volume" || v === "season";
const isSubUnit = (v: unknown): v is Exclude<SubUnit, undefined> =>
  v === "episode" || v === "chapter" || v === null || v === "";

export async function POST(req: Request) {
  try {
    const body: Body = await req.json();
    const {
      franchise_id,

      adaptation_a_id,
      unit_type_a,
      seq_a,
      subunit_type_a,
      sub_seq_a,

      adaptation_b_id,
      unit_type_b,
      seq_b,
      subunit_type_b,
      sub_seq_b,

      relation_type = "overlaps",
      confidence = 0.7,
      notes = "",
    } = body || {};

    // Auth
    const supabase = await createSupabaseServer();
    const { data: userRes, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userRes.user) {
      return NextResponse.json({ ok: false, error: "Not authenticated" }, { status: 401 });
    }
    const userId = userRes.user.id;

    // Basic validation
    if (!franchise_id) return NextResponse.json({ ok: false, error: "franchise_id required." }, { status: 400 });
    if (!adaptation_a_id || !adaptation_b_id)
      return NextResponse.json({ ok: false, error: "adaptation_a_id and adaptation_b_id required." }, { status: 400 });
    if (!isUnitType(unit_type_a) || !isUnitType(unit_type_b))
      return NextResponse.json({ ok: false, error: "unit_type_a/unit_type_b must be 'volume' or 'season'." }, { status: 400 });

    const nSeqA = Number(seq_a);
    const nSeqB = Number(seq_b);
    if (!(nSeqA > 0) || !(nSeqB > 0))
      return NextResponse.json({ ok: false, error: "seq_a and seq_b must be positive numbers." }, { status: 400 });

    if (!ALLOWED_REL.has(relation_type))
      return NextResponse.json({ ok: false, error: "Invalid relation_type." }, { status: 400 });

    if (!(typeof confidence === "number" && confidence >= 0 && confidence <= 1))
      return NextResponse.json({ ok: false, error: "confidence must be in [0,1]." }, { status: 400 });

    // Sub-unit validation (optional)
    if (!isSubUnit(subunit_type_a) || !isSubUnit(subunit_type_b))
      return NextResponse.json({ ok: false, error: "subunit_type_* must be 'episode'|'chapter' or omitted." }, { status: 400 });

    const nSubSeqA =
      sub_seq_a === "" || sub_seq_a === null || sub_seq_a === undefined
        ? null
        : Number(sub_seq_a);
    const nSubSeqB =
      sub_seq_b === "" || sub_seq_b === null || sub_seq_b === undefined
        ? null
        : Number(sub_seq_b);

    if (nSubSeqA !== null && !(nSubSeqA > 0))
      return NextResponse.json({ ok: false, error: "sub_seq_a must be a positive number when provided." }, { status: 400 });

    if (nSubSeqB !== null && !(nSubSeqB > 0))
      return NextResponse.json({ ok: false, error: "sub_seq_b must be a positive number when provided." }, { status: 400 });

    // Insert into mapping_submissions
    const payload: Record<string, any> = {
      submitted_by: userId,
      franchise_id,

      adaptation_a_id,
      unit_type_a,
      seq_a: nSeqA,
      subunit_type_a: subunit_type_a || null,
      sub_seq_a: nSubSeqA,

      adaptation_b_id,
      unit_type_b,
      seq_b: nSeqB,
      subunit_type_b: subunit_type_b || null,
      sub_seq_b: nSubSeqB,

      relation_type,
      confidence,
      notes: notes || "",
      status: "submitted",
      submitted_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("mapping_submissions")
      .insert(payload)
      .select("id")
      .single();

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true, id: data?.id ?? null });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? "Unknown error" }, { status: 500 });
  }
}
