// src/app/admin/approval/page.tsx
import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";
import { createSupabaseServer } from "@/lib/supabaseServer";
import {
  approveSubmission,
  rejectSubmission,
  approveAllPendingSubmissions,
  unapproveSubmission,
} from "./actions";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Row = Record<string, any>;
const show = (v: unknown) =>
  v === null || v === undefined || v === "" ? "—" : String(v);

export default async function ApprovalPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  noStore();
  const supabase = await createSupabaseServer();

  // Next 15: await searchParams
  const sp = await searchParams;
  const rawView = Array.isArray(sp?.view) ? sp.view[0] : sp?.view;
  const view = rawView === "history" ? "history" : "pending";

  // 1) Fetch submissions
  let query = supabase
    .from("mapping_submissions")
    .select("*");

  if (view === "history") {
    // Show both approved + rejected in History
    query = query.in("status", ["approved", "rejected"])
      // Multi-key ordering to surface newest decisions first
      .order("approved_at", { ascending: false, nullsFirst: false })
      .order("rejected_at", { ascending: false, nullsFirst: false })
      .order("submitted_at", { ascending: false, nullsFirst: false });
  } else {
    query = query
      .in("status", ["submitted", "pending"])
      .order("submitted_at", { ascending: false });
  }

  const { data, error } = await query;

  if (error) {
    return (
      <div className="p-6 text-red-600">
        Error loading submissions: {error.message}
      </div>
    );
  }

  const items = (data ?? []) as Row[];

  // 2) Enrich names
  const adaptationIds = new Set<string>();
  const franchiseIds = new Set<string>();
  for (const r of items) {
    if (r.adaptation_a_id) adaptationIds.add(String(r.adaptation_a_id));
    if (r.adaptation_b_id) adaptationIds.add(String(r.adaptation_b_id));
    if (r.franchise_id) franchiseIds.add(String(r.franchise_id));
  }

  const adaptationTitleById = new Map<string, string>();
  if (adaptationIds.size) {
    const { data: adaps } = await supabase
      .from("adaptations")
      .select("id, title")
      .in("id", Array.from(adaptationIds));
    for (const a of adaps ?? []) {
      adaptationTitleById.set(String(a.id), a.title ?? "Unknown adaptation");
    }
  }

  const franchiseTitleById = new Map<string, string>();
  if (franchiseIds.size) {
    const { data: frs } = await supabase
      .from("franchises")
      .select("id, canonical_name, title")
      .in("id", Array.from(franchiseIds));
    for (const f of frs ?? []) {
      franchiseTitleById.set(
        String(f.id),
        f.canonical_name ?? f.title ?? "Unknown franchise",
      );
    }
  }

  // helpers
  function makeLabel(m: Row, side: "a" | "b") {
    const adaptId = m[`adaptation_${side}_id`];
    const adaptTitle =
      (adaptId && adaptationTitleById.get(String(adaptId))) || "";

    const unit = show(m[`unit_type_${side}`]); // season / volume
    const seq =
      m[`seq_${side}`] != null ? `#${m[`seq_${side}`] as number}` : "";

    const subunit = m[`subunit_type_${side}`]; // episode / chapter / null
    const subSeq =
      m[`sub_seq_${side}`] != null ? `#${m[`sub_seq_${side}`] as number}` : "";
    const subPart =
      subunit && subSeq ? ` (${String(subunit)} ${subSeq})` : "";

    const main = [adaptTitle ? `${adaptTitle}:` : "", unit, seq]
      .filter(Boolean)
      .join(" ");

    return `${main}${subPart}`;
  }

  function statusBadgeClasses(status: string) {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      case "pending":
        return "bg-amber-100 text-amber-800";
      case "submitted":
      default:
        return "bg-slate-100 text-slate-700";
    }
  }

  function formattedWhen(m: Row) {
    if (m.status === "approved") {
      return m.approved_at ? new Date(m.approved_at).toLocaleString() : "—";
    }
    if (m.status === "rejected") {
      return m.rejected_at ? new Date(m.rejected_at).toLocaleString() : "—";
    }
    return m.submitted_at ? new Date(m.submitted_at).toLocaleString() : "—";
  }

  function whenLabel(m: Row) {
    if (m.status === "approved") return "Approved";
    if (m.status === "rejected") return "Rejected";
    return "Submitted";
  }

  return (
    <div className="p-6 space-y-5">
      {/* Tabs */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Link
            href="/admin/approval"
            className={`px-3 py-1.5 rounded border ${
              view === "pending" ? "bg-black text-white" : "bg-white"
            }`}
          >
            Pending
          </Link>
          <Link
            href="/admin/approval?view=history"
            className={`px-3 py-1.5 rounded border ${
              view === "history" ? "bg-black text-white" : "bg-white"
            }`}
          >
            History
          </Link>
        </div>

        {/* Approve ALL only on Pending */}
        {view === "pending" && (
          <form action={approveAllPendingSubmissions}>
            <button
              className="px-4 py-2 rounded border bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
              disabled={items.length === 0}
            >
              Approve All
            </button>
          </form>
        )}
      </div>

      {/* List */}
      {items.length === 0 ? (
        <p className="text-muted-foreground">
          {view === "pending" ? "No new submissions 🎉" : "No approvals or rejections yet"}
        </p>
      ) : (
        <ul className="space-y-3">
          {items.map((m) => {
            const when = formattedWhen(m);
            const conf =
              typeof m.confidence === "number" ? m.confidence.toFixed(2) : "—";
            const franchise =
              (m.franchise_id &&
                franchiseTitleById.get(String(m.franchise_id))) ||
              "Unknown franchise";
            const aLabel = makeLabel(m, "a");
            const bLabel = makeLabel(m, "b");

            return (
              <li key={m.id} className="rounded-xl border p-4 bg-white/70">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">
                      {whenLabel(m)}: {when}
                    </div>

                    <div className="font-medium flex items-center gap-2">
                      <span>
                        {franchise} • Submission #{String(m.id).slice(0, 8)}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded ${statusBadgeClasses(
                          m.status
                        )}`}
                      >
                        {m.status}
                      </span>
                      {m.relation_type ? (
                        <span className="text-xs px-2 py-0.5 rounded bg-purple-100 text-purple-700">
                          {m.relation_type}
                        </span>
                      ) : null}
                    </div>

                    <div className="text-sm text-muted-foreground">
                      A: {aLabel || "—"} {"  "}→{"  "} B: {bLabel || "—"}
                    </div>

                    {m.notes && (
                      <div className="text-sm text-muted-foreground">
                        Notes: {m.notes}
                      </div>
                    )}

                    <div className="text-xs text-muted-foreground">
                      Confidence: {conf}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {view === "pending" ? (
                      <>
                        <form action={approveSubmission}>
                          <input type="hidden" name="id" value={m.id} />
                          <button className="px-3 py-1.5 rounded border bg-green-600 text-white hover:bg-green-700">
                            Approve
                          </button>
                        </form>
                        <form action={rejectSubmission}>
                          <input type="hidden" name="id" value={m.id} />
                          <button className="px-3 py-1.5 rounded border bg-red-600 text-white hover:bg-red-700">
                            Reject
                          </button>
                        </form>
                      </>
                    ) : (
                      // Only allow unapprove if it's currently approved
                      m.status === "approved" && (
                        <form action={unapproveSubmission}>
                          <input type="hidden" name="id" value={m.id} />
                          <button className="px-3 py-1.5 rounded border">
                            Unapprove
                          </button>
                        </form>
                      )
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
