"use client";

import { useEffect, useMemo, useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabaseBrowser";

type Medium = "manga" | "anime" | "light_novel";
type UnitType = "volume" | "season";
type SubUnitType = "episode" | "chapter";

type Franchise = { id: string; title: string };
type Adaptation = { id: string; title: string; medium_type: Medium; franchise_id: string };

const RELS = ["equivalent", "overlaps", "adapts", "expands", "compresses"] as const;
const UNIT_OPTS: UnitType[] = ["volume", "season"];

export default function ContributePage() {
  const supabase = useMemo(() => createSupabaseBrowser(), []);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<null | { ok: boolean; msg: string }>(null);

  // dropdown data
  const [franchises, setFranchises] = useState<Franchise[]>([]);
  const [adaps, setAdaps] = useState<Adaptation[]>([]);

  // chosen values
  const [franchiseId, setFranchiseId] = useState("");
  const [mediumA, setMediumA] = useState<Medium | "">("");
  const [unitA, setUnitA] = useState<UnitType | "">("");
  const [seqA, setSeqA] = useState<number | "">("");
  const [subUnitA, setSubUnitA] = useState<SubUnitType | "">("");
  const [subSeqA, setSubSeqA] = useState<number | "">("");

  const [mediumB, setMediumB] = useState<Medium | "">("");
  const [unitB, setUnitB] = useState<UnitType | "">("");
  const [seqB, setSeqB] = useState<number | "">("");
  const [subUnitB, setSubUnitB] = useState<SubUnitType | "">("");
  const [subSeqB, setSubSeqB] = useState<number | "">("");

  const [relation, setRelation] = useState<typeof RELS[number]>("overlaps");
  const [confidence, setConfidence] = useState<number>(0.7);
  const [notes, setNotes] = useState("");

  // load franchises once
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("franchises")
        .select("id, canonical_name")
        .order("canonical_name");
      if (error) { console.error("franchises error", error); return; }
      setFranchises((data ?? []).map((f: any) => ({ id: f.id, title: f.canonical_name })));
    })();
  }, [supabase]);

  // load adaptations for the chosen franchise
  useEffect(() => {
    if (!franchiseId) {
      setAdaps([]);
      // reset selections
      setMediumA(""); setUnitA(""); setSeqA(""); setSubUnitA(""); setSubSeqA("");
      setMediumB(""); setUnitB(""); setSeqB(""); setSubUnitB(""); setSubSeqB("");
      return;
    }
    (async () => {
      const { data, error } = await supabase
        .from("adaptations")
        .select("id,title,medium_type,franchise_id")
        .eq("franchise_id", franchiseId)
        .order("title");
      if (!error && data) setAdaps(data as Adaptation[]);
    })();
  }, [franchiseId, supabase]);

  // which mediums exist for this franchise?
  const mediumsAvailable = useMemo(() => {
    return Array.from(new Set(adaps.map(a => a.medium_type))) as Medium[];
  }, [adaps]);

  // sensible defaults when a medium is selected
  useEffect(() => {
    if (!mediumA) { setUnitA(""); setSubUnitA(""); return; }
    if (mediumA === "anime") { setUnitA("season"); setSubUnitA("episode"); }
    else { setUnitA("volume"); setSubUnitA("chapter"); }
  }, [mediumA]);
  useEffect(() => {
    if (!mediumB) { setUnitB(""); setSubUnitB(""); return; }
    if (mediumB === "anime") { setUnitB("season"); setSubUnitB("episode"); }
    else { setUnitB("volume"); setSubUnitB("chapter"); }
  }, [mediumB]);

  // find adaptation id for a given medium (assuming one per franchise)
  const adaptationIdFor = (m: Medium | ""): string | null => {
    if (!m) return null;
    const row = adaps.find(a => a.medium_type === m);
    return row?.id ?? null;
    };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      // basic form validation
      if (!franchiseId) throw new Error("Pick a franchise.");
      if (!mediumA || !unitA || !seqA) throw new Error("Complete Medium A / Unit A / Part A.");
      if (!mediumB || !unitB || !seqB) throw new Error("Complete Medium B / Unit B / Part B.");
      if (mediumA === mediumB) throw new Error("Medium A and Medium B must be different.");
      if (Number(seqA) <= 0 || Number(seqB) <= 0) throw new Error("Part numbers must be positive.");

      // sub-unit numbers are optional; if given, must be positive
      if (subSeqA !== "" && Number(subSeqA) <= 0) throw new Error("Episode/Chapter A must be positive.");
      if (subSeqB !== "" && Number(subSeqB) <= 0) throw new Error("Episode/Chapter B must be positive.");

      const adaptation_a_id = adaptationIdFor(mediumA);
      const adaptation_b_id = adaptationIdFor(mediumB);
      if (!adaptation_a_id || !adaptation_b_id) {
        throw new Error("No adaptation found for one of the selected mediums in this franchise.");
      }

      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          franchise_id: franchiseId,

          adaptation_a_id,
          unit_type_a: unitA,
          seq_a: Number(seqA),
          // NEW sub-unit A
          subunit_type_a: subUnitA || null,
          sub_seq_a: subSeqA === "" ? null : Number(subSeqA),

          adaptation_b_id,
          unit_type_b: unitB,
          seq_b: Number(seqB),
          // NEW sub-unit B
          subunit_type_b: subUnitB || null,
          sub_seq_b: subSeqB === "" ? null : Number(subSeqB),

          relation_type: relation,
          confidence,
          notes,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.ok) {
        throw new Error(json.error || "Failed to submit");
      }

      setStatus({ ok: true, msg: "Submitted for approval ✅" });
      // reset only the numbers/notes so they can add more quickly
      setSeqA(""); setSubSeqA("");
      setSeqB(""); setSubSeqB("");
      setNotes("");
    } catch (err: any) {
      setStatus({ ok: false, msg: err?.message ?? "Something went wrong" });
    } finally {
      setLoading(false);
    }
  }

  const subUnitLabel = (m: Medium | ""): string =>
    m === "anime" ? "Episode" : m ? "Chapter" : "Episode/Chapter";

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow space-y-4">
      <h1 className="text-2xl font-semibold">Contribute a Mapping</h1>

      <form onSubmit={onSubmit} className="space-y-4">
        {/* Franchise */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Franchise</label>
          <select
            className="border rounded p-2 w-full"
            value={franchiseId}
            onChange={(e) => setFranchiseId(e.target.value)}
            required
          >
            <option value="">— Select a franchise —</option>
            {franchises.map(f => (
              <option key={f.id} value={f.id}>{f.title}</option>
            ))}
          </select>
        </div>

        {/* A side */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Medium A</label>
            <select
              className="border rounded p-2 w-full"
              value={mediumA}
              onChange={(e) => setMediumA(e.target.value as Medium)}
              disabled={!franchiseId}
              required
            >
              <option value="">— Select —</option>
              {mediumsAvailable.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Unit A</label>
            <select
              className="border rounded p-2 w-full"
              value={unitA}
              onChange={(e) => setUnitA(e.target.value as UnitType)}
              disabled={!mediumA}
              required
            >
              <option value="">— Select —</option>
              {UNIT_OPTS.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Part A (number)</label>
            <input
              type="number"
              min={1}
              className="border rounded p-2 w-full"
              value={seqA}
              onChange={(e) => setSeqA(e.target.value === "" ? "" : Number(e.target.value))}
              disabled={!unitA}
              required
            />
          </div>

          {/* Sub-unit A */}
          <div className="sm:col-span-1">
            <label className="block text-sm text-gray-600 mb-1">{subUnitLabel(mediumA)} A</label>
            <select
              className="border rounded p-2 w-full"
              value={subUnitA}
              onChange={(e) => setSubUnitA(e.target.value as SubUnitType)}
              disabled={!mediumA}
            >
              <option value="">
                — {subUnitLabel(mediumA)} —
              </option>
              {mediumA === "anime" ? (
                <option value="episode">episode</option>
              ) : (
                <option value="chapter">chapter</option>
              )}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm text-gray-600 mb-1">
              {subUnitLabel(mediumA)} A (number)
            </label>
            <input
              type="number"
              min={1}
              className="border rounded p-2 w-full"
              value={subSeqA}
              onChange={(e) => setSubSeqA(e.target.value === "" ? "" : Number(e.target.value))}
              disabled={!subUnitA}
              placeholder={`Optional ${subUnitLabel(mediumA)} number`}
            />
          </div>
        </div>

        {/* B side */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Medium B</label>
            <select
              className="border rounded p-2 w-full"
              value={mediumB}
              onChange={(e) => setMediumB(e.target.value as Medium)}
              disabled={!franchiseId}
              required
            >
              <option value="">— Select —</option>
              {mediumsAvailable.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Unit B</label>
            <select
              className="border rounded p-2 w-full"
              value={unitB}
              onChange={(e) => setUnitB(e.target.value as UnitType)}
              disabled={!mediumB}
              required
            >
              <option value="">— Select —</option>
              {UNIT_OPTS.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Part B (number)</label>
            <input
              type="number"
              min={1}
              className="border rounded p-2 w-full"
              value={seqB}
              onChange={(e) => setSeqB(e.target.value === "" ? "" : Number(e.target.value))}
              disabled={!unitB}
              required
            />
          </div>

          {/* Sub-unit B */}
          <div className="sm:col-span-1">
            <label className="block text-sm text-gray-600 mb-1">{subUnitLabel(mediumB)} B</label>
            <select
              className="border rounded p-2 w-full"
              value={subUnitB}
              onChange={(e) => setSubUnitB(e.target.value as SubUnitType)}
              disabled={!mediumB}
            >
              <option value="">
                — {subUnitLabel(mediumB)} —
              </option>
              {mediumB === "anime" ? (
                <option value="episode">episode</option>
              ) : (
                <option value="chapter">chapter</option>
              )}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm text-gray-600 mb-1">
              {subUnitLabel(mediumB)} B (number)
            </label>
            <input
              type="number"
              min={1}
              className="border rounded p-2 w-full"
              value={subSeqB}
              onChange={(e) => setSubSeqB(e.target.value === "" ? "" : Number(e.target.value))}
              disabled={!subUnitB}
              placeholder={`Optional ${subUnitLabel(mediumB)} number`}
            />
          </div>
        </div>

        {/* relation / confidence / notes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Relation</label>
            <select
              className="border rounded p-2 w-full"
              value={relation}
              onChange={(e) => setRelation(e.target.value as typeof RELS[number])}
            >
              {RELS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Confidence (0–1)</label>
            <input
              type="number" step="0.1" min="0" max="1"
              className="border rounded p-2 w-full"
              value={confidence}
              onChange={(e) => setConfidence(Number(e.target.value))}
            />
          </div>
          <div className="sm:col-span-1">
            <label className="block text-sm text-gray-600 mb-1">Notes</label>
            <input
              className="border rounded p-2 w-full"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="optional"
            />
          </div>
        </div>

        <button disabled={loading} className="bg-indigo-600 text-white px-4 py-2 rounded">
          {loading ? "Submitting…" : "Submit"}
        </button>
      </form>

      {status && (
        <div className={`p-2 rounded ${status.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
          {status.msg}
        </div>
      )}
    </div>
  );
}
