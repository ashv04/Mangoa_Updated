"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServer } from "@/lib/supabaseServer";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient as createSbClient } from "@supabase/supabase-js";

const SYMMETRIC = new Set(["equivalent", "overlaps"]);

type UnitType = "season" | "volume";
type SubunitType = "episode" | "chapter";
type Medium = "anime" | "manga" | "light_novel";

function createServiceClient() {
  // Service key is server-only; make sure it's set in your env.
  return createSbClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

async function requireModerator() {
  const s = await createSupabaseServer();
  const {
    data: { user },
  } = await s.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const { data: prof, error } = await s
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!prof || !["admin", "moderator"].includes(prof.role)) {
    throw new Error("Forbidden");
  }
  return { s, userId: user.id };
}

function canonicalize(aId: string, bId: string, relation: string) {
  if (SYMMETRIC.has(relation)) return aId < bId ? [aId, bId] : [bId, aId];
  return [aId, bId];
}

/* ----------------------------- helpers ----------------------------- */

async function getMedium(
  s: SupabaseClient,
  adaptationId: string
): Promise<Medium> {
  const { data, error } = await s
    .from("adaptations")
    .select("medium_type")
    .eq("id", adaptationId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data?.medium_type ?? null) as Medium;
}

async function getOrCreateVolumeId(
  s: SupabaseClient,
  adaptationId: string,
  volumeNumber: number
): Promise<string> {
  // try find
  {
    const { data, error } = await s
      .from("volumes")
      .select("id")
      .eq("adaptation_id", adaptationId)
      .eq("volume_number", volumeNumber)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (data?.id) return data.id;
  }
  // insert (safe due to unique index recommended earlier)
  const { data, error } = await s
    .from("volumes")
    .insert({
      adaptation_id: adaptationId,
      volume_number: volumeNumber,
      title: `Volume ${volumeNumber}`,
    })
    .select("id")
    .single();

  if (error) {
    if (/duplicate|unique|23505/i.test(error.message)) {
      const { data: again } = await s
        .from("volumes")
        .select("id")
        .eq("adaptation_id", adaptationId)
        .eq("volume_number", volumeNumber)
        .maybeSingle();
      if (again?.id) return again.id;
    }
    throw new Error(error.message);
  }
  return data.id as string;
}

type Side = {
  adaptation_id: string;
  unit_type: UnitType; // parent (season or volume)
  seq: number; // parent number (season#/volume#)
  subunit_type?: SubunitType | null; // episode or chapter
  sub_seq?: number | null; // ep#/chapter#
};

/** Create OR fetch a concrete content_unit id for a side. */
async function ensureContentUnitId(s: SupabaseClient, side: Side): Promise<string> {
  const medium = await getMedium(s, side.adaptation_id);
  const expected: SubunitType = medium === "anime" ? "episode" : "chapter";
  const num = Number(side.sub_seq ?? NaN);
  if (!Number.isFinite(num) || num <= 0) {
    throw new Error(
      `Missing/invalid ${expected} number (sub_seq) for ${medium}`
    );
  }

  if (medium === "anime") {
    // EPISODE (no volume)
    {
      const { data, error } = await s
        .from("content_units")
        .select("id")
        .eq("adaptation_id", side.adaptation_id)
        .eq("kind", "episode")
        .eq("sequence_number", num)
        .maybeSingle();
      if (error) throw new Error(error.message);
      if (data?.id) return data.id;
    }
    const { data, error } = await s
      .from("content_units")
      .insert({
        adaptation_id: side.adaptation_id,
        kind: "episode",
        sequence_number: num,
        status: "approved",
      })
      .select("id")
      .single();
    if (error) {
      if (/duplicate|unique|23505/i.test(error.message)) {
        const { data: again } = await s
          .from("content_units")
          .select("id")
          .eq("adaptation_id", side.adaptation_id)
          .eq("kind", "episode")
          .eq("sequence_number", num)
          .maybeSingle();
        if (again?.id) return again.id;
      }
      throw new Error(error.message);
    }
    return data.id as string;
  }

  // MANGA/LN: CHAPTER under a VOLUME
  const volNum = Number(side.seq ?? NaN);
  if (!Number.isFinite(volNum) || volNum <= 0) {
    throw new Error("Missing/invalid volume number (seq) for chapter");
  }
  const volumeId = await getOrCreateVolumeId(s, side.adaptation_id, volNum);

  {
    const { data, error } = await s
      .from("content_units")
      .select("id")
      .eq("adaptation_id", side.adaptation_id)
      .eq("kind", "chapter")
      .eq("volume_id", volumeId)
      .eq("sequence_number", num)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (data?.id) return data.id;
  }
  const { data, error } = await s
    .from("content_units")
    .insert({
      adaptation_id: side.adaptation_id,
      volume_id: volumeId,
      kind: "chapter",
      sequence_number: num,
      status: "approved",
    })
    .select("id")
    .single();
  if (error) {
    if (/duplicate|unique|23505/i.test(error.message)) {
      const { data: again } = await s
        .from("content_units")
        .select("id")
        .eq("adaptation_id", side.adaptation_id)
        .eq("kind", "chapter")
        .eq("volume_id", volumeId)
        .eq("sequence_number", num)
        .maybeSingle();
      if (again?.id) return again.id;
    }
    throw new Error(error.message);
  }
  return data.id as string;
}

/** Resolve an existing CU without creating new rows (used by unapprove). */
async function resolveExistingContentUnitId(
  s: SupabaseClient,
  side: Side
): Promise<string | null> {
  const medium = await getMedium(s, side.adaptation_id);
  const num = Number(side.sub_seq ?? NaN);
  if (!Number.isFinite(num) || num <= 0) return null;

  if (medium === "anime") {
    const { data } = await s
      .from("content_units")
      .select("id")
      .eq("adaptation_id", side.adaptation_id)
      .eq("kind", "episode")
      .eq("sequence_number", num)
      .maybeSingle();
    return data?.id ?? null;
  }

  const volNum = Number(side.seq ?? NaN);
  if (!Number.isFinite(volNum) || volNum <= 0) return null;

  // find volume
  const { data: vol } = await s
    .from("volumes")
    .select("id")
    .eq("adaptation_id", side.adaptation_id)
    .eq("volume_number", volNum)
    .maybeSingle();
  if (!vol?.id) return null;

  const { data } = await s
    .from("content_units")
    .select("id")
    .eq("adaptation_id", side.adaptation_id)
    .eq("kind", "chapter")
    .eq("volume_id", vol.id)
    .eq("sequence_number", num)
    .maybeSingle();
  return data?.id ?? null;
}

/* ----------------------------- actions ----------------------------- */

export async function approveSubmission(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!id) return;

  const { s, userId } = await requireModerator();
  const svc = createServiceClient(); // <-- service client

  // Read with session client is fine
  const { data: sub, error: subErr } = await s
    .from("mapping_submissions")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (subErr || !sub) throw new Error(subErr?.message || "Submission not found");

  // CREATE or fetch CUs using service client (bypass RLS)
  const cuA = await ensureContentUnitId(svc, {
    adaptation_id: sub.adaptation_a_id,
    unit_type: sub.unit_type_a,
    seq: Number(sub.seq_a),
    subunit_type: sub.subunit_type_a ?? null,
    sub_seq: sub.sub_seq_a ?? null,
  });
  const cuB = await ensureContentUnitId(svc, {
    adaptation_id: sub.adaptation_b_id,
    unit_type: sub.unit_type_b,
    seq: Number(sub.seq_b),
    subunit_type: sub.subunit_type_b ?? null,
    sub_seq: sub.sub_seq_b ?? null,
  });

  const [content_unit_id_a, content_unit_id_b] =
    canonicalize(cuA, cuB, sub.relation_type);

  // INSERT mapping with service client
  const { error: insErr } = await svc.from("pairwise_mappings").insert({
    content_unit_id_a,
    content_unit_id_b,
    relation_type: sub.relation_type,
    confidence: sub.confidence ?? 0.7,
    notes: sub.notes ?? "",
    // keep these only if your table actually has them;
    // if you still get column errors, remove them too.
    status: "approved",
    approved_by: userId,
    approved_at: new Date().toISOString(),
  });
  if (insErr && !/duplicate|unique|23505/i.test(insErr.message)) {
    throw new Error(insErr.message);
  }

  // UPDATE submission status with service client
  await svc
    .from("mapping_submissions")
    .update({
      status: "approved",
      approved_by: userId,
      approved_at: new Date().toISOString(),
    })
    .eq("id", id);

  // Revalidate as before (reads can use session client)
  const { data: fr } = await s
    .from("adaptations")
    .select("franchises!inner(slug)")
    .in("id", [sub.adaptation_a_id, sub.adaptation_b_id]);

  const slugs = new Set<string>();
  for (const row of fr ?? []) {
    const slug = (row as any).franchises?.[0]?.slug || (row as any).franchises?.slug;
    if (slug) slugs.add(slug);
  }
  for (const slug of slugs) revalidatePath(`/series/${slug}`);
  revalidatePath("/browse");
  revalidatePath("/admin/approval");
}

export async function rejectSubmission(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!id) return;

  const { userId } = await requireModerator();
  const svc = createServiceClient(); // use service key to bypass RLS

  const { data, error } = await svc
    .from("mapping_submissions")
    .update({
      status: "rejected",
      rejected_by: userId,
      rejected_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("id, status")   // force returning row so we can verify
    .maybeSingle();

  if (error) throw new Error(`Reject failed: ${error.message}`);
  if (!data) throw new Error("Reject failed: not found or no permission.");

  // Refresh both tabs (queue + history)
  revalidatePath("/admin/approval");
  revalidatePath("/admin/approval?view=history");
}

export async function approveAllPendingSubmissions() {
  const { s, userId } = await requireModerator();
  const svc = createServiceClient();

  const { data: subs } = await s
    .from("mapping_submissions")
    .select("*")
    .in("status", ["submitted", "pending"]);

  if (!subs?.length) {
    revalidatePath("/admin/approval");
    return;
  }

  for (const sub of subs) {
    try {
      const cuA = await ensureContentUnitId(svc, {
        adaptation_id: sub.adaptation_a_id,
        unit_type: sub.unit_type_a,
        seq: Number(sub.seq_a),
        subunit_type: sub.subunit_type_a ?? null,
        sub_seq: sub.sub_seq_a ?? null,
      });
      const cuB = await ensureContentUnitId(svc, {
        adaptation_id: sub.adaptation_b_id,
        unit_type: sub.unit_type_b,
        seq: Number(sub.seq_b),
        subunit_type: sub.subunit_type_b ?? null,
        sub_seq: sub.sub_seq_b ?? null,
      });
      const [aId, bId] = canonicalize(cuA, cuB, sub.relation_type);

      await svc.from("pairwise_mappings").insert({
        content_unit_id_a: aId,
        content_unit_id_b: bId,
        relation_type: sub.relation_type,
        confidence: sub.confidence ?? 0.7,
        notes: sub.notes ?? "",
        status: "approved",
        approved_by: userId,
        approved_at: new Date().toISOString(),

        // ❌ remove all denormalized fields here too
      });
    } catch {
      // ignore bad rows and continue
    }
  }

  await svc
    .from("mapping_submissions")
    .update({
      status: "approved",
      approved_by: userId,
      approved_at: new Date().toISOString(),
    })
    .in("id", subs.map((x: any) => x.id));

  // revalidate (unchanged)
  const { data: fr } = await s
    .from("adaptations")
    .select("franchises!inner(slug)")
    .in("id", [
      ...new Set(subs.flatMap((x: any) => [x.adaptation_a_id, x.adaptation_b_id])),
    ] as string[]);

  const slugs = new Set<string>();
  for (const row of fr ?? []) {
    const slug = (row as any).franchises?.[0]?.slug || (row as any).franchises?.slug;
    if (slug) slugs.add(slug);
  }
  for (const slug of slugs) revalidatePath(`/series/${slug}`);
  revalidatePath("/browse");
  revalidatePath("/admin/approval");
}

export async function unapproveSubmission(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!id) return;

  const { s } = await requireModerator();
  const svc = createServiceClient();

  const { data: sub } = await s
    .from("mapping_submissions")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!sub) return;

  // resolve existing (read-only is fine with session client)
  const cuA = await resolveExistingContentUnitId(s, {
    adaptation_id: sub.adaptation_a_id,
    unit_type: sub.unit_type_a,
    seq: Number(sub.seq_a),
    subunit_type: sub.subunit_type_a ?? null,
    sub_seq: sub.sub_seq_a ?? null,
  });
  const cuB = await resolveExistingContentUnitId(s, {
    adaptation_id: sub.adaptation_b_id,
    unit_type: sub.unit_type_b,
    seq: Number(sub.seq_b),
    subunit_type: sub.subunit_type_b ?? null,
    sub_seq: sub.sub_seq_b ?? null,
  });

  if (cuA && cuB) {
    const [aId, bId] = canonicalize(cuA, cuB, sub.relation_type);
    await svc
      .from("pairwise_mappings")
      .delete()
      .eq("content_unit_id_a", aId)
      .eq("content_unit_id_b", bId)
      .eq("relation_type", sub.relation_type);
  }

  await svc
    .from("mapping_submissions")
    .update({ status: "submitted", approved_by: null, approved_at: null })
    .eq("id", id);

  revalidatePath("/admin/approval");
}
