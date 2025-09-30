import { createSupabaseServer } from "@/lib/supabaseServer"

// Enums
export enum MediumType {
  MANGA = "manga",
  ANIME = "anime", 
  LIGHT_NOVEL = "light_novel",
}

export enum StatusType {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  FLAGGED = "flagged"
}

export enum RelationType {
  ADAPTATION = "adaptation",
  SEQUEL = "sequel",
  PREQUEL = "prequel",
  SIDE_STORY = "side_story",
  SPIN_OFF = "spin_off",
  ALTERNATE_VERSION = "alternate_version",
  COVER = "cover",
  OST = "ost"
}

// Core table row shapes
export interface FranchiseRow {
  id: string
  canonical_name: string
  slug: string
  description: string | null
  created_at: string
  updated_at: string
}

export interface AdaptationRow {
  id: string
  franchise_id: string
  medium_type: MediumType
  title: string
  language: string
  metadata: Record<string, any>
  updated_at: string
  created_at: string
}

export interface VolumeRow {
  id: string
  adaptation_id: string
  volume_number: string
  title: string | null
  metadata: Record<string, any> | null
  created_at: string
}

export interface MappingRow {
  id: string
  content_unit_id_a: string
  content_unit_id_b: string
  relation_type: RelationType
  confidence: number
  status: StatusType
  created_by_user_id: string
  created_at: string
}

export interface ProfileRow {
  id: string
  display_name: string | null
  avatar_url: string | null
  role: string
  reputation: number
  verified: boolean
  created_at: string
}

// Response types
export interface FranchiseWithAdaptations extends FranchiseRow {
  adaptations: AdaptationRow[]
}

export interface AdaptationWithVolumes extends AdaptationRow {
  volumes: VolumeRow[]
}

export interface PaginatedAdaptations {
  data: AdaptationRow[]
  count: number
}

export interface RecentMapping {
  id: string
  relation_type: RelationType
  confidence: number
  status: StatusType
  created_by_user_id: string
  created_at: string
  content_unit_id_a: string
  content_unit_id_b: string
}

export interface FetchAdaptationsParams {
  page: number
  pageSize: number
  medium?: MediumType
  language?: string
  sort: "recent" | "alpha"
  q?: string
}

// Helper functions
export async function fetchAdaptationsPaginated({
  page,
  pageSize,
  medium,
  language,
  sort,
  q,
}: FetchAdaptationsParams): Promise<PaginatedAdaptations> {
  const supabase = await createSupabaseServer();

  // Helper to apply shared filters to an adaptations query builder
  const applyShared = (qb: any) => {
    if (medium) qb = qb.eq("medium_type", medium);
    if (language) qb = qb.eq("language", language);
    // Always select franchise join so UI can link /series/[slug]
    qb = qb.select(`*, franchises:franchise_id ( id, canonical_name, slug )`);
    return qb;
  };

  // If no search text, keep the single query path (fastest)
  if (!q || !q.trim()) {
    let qb = applyShared(supabase.from("adaptations"));
    if (sort === "recent") {
      qb = qb.order("updated_at", { ascending: false });
    } else {
      qb = qb.order("title", { ascending: true });
    }
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    qb = qb.range(from, to);
    const { data, count, error } = await qb.select(`*, franchises:franchise_id ( id, canonical_name, slug )`, { count: "exact" });

    if (error) {
      console.error("Error fetching adaptations (no q):", error);
      return { data: [], count: 0 };
    }
    return { data: ((data || []) as any as AdaptationRow[]), count: count || 0 };
  }

  // --- Search path: union of (title ilike) âˆª (franchise name ilike) ---
  const like = `%${q.trim()}%`;

  // 1) title matches
  let titleQ = applyShared(supabase.from("adaptations")).ilike("title", like);
  // 2) franchise matches â†’ get matching franchise ids, then fetch adaptations IN (...)
  const { data: frHits, error: frErr } = await supabase
    .from("franchises")
    .select("id")
    .ilike("canonical_name", like);

  if (frErr) {
    console.error("Error searching franchises:", frErr);
  }

  const frIds = (frHits || []).map((r: any) => r.id);
  let frQ: any | null = null;
  if (frIds.length) {
    frQ = applyShared(supabase.from("adaptations")).in("franchise_id", frIds);
  }

  // Execute both in parallel
  const [titleRes, frRes] = await Promise.all([
    titleQ.select(`*, franchises:franchise_id ( id, canonical_name, slug )`),
    frQ ? frQ.select(`*, franchises:franchise_id ( id, canonical_name, slug )`) : Promise.resolve({ data: [] as any[], error: null }),
  ]);

  const titleErr = (titleRes as any).error;
  const frErr2 = (frRes as any).error;
  if (titleErr) console.error("Error searching adaptations by title:", titleErr);
  if (frErr2) console.error("Error fetching adaptations by franchise ids:", frErr2);

  // Merge + de-dupe by adaptation id
  const merged: AdaptationRow[] = [];
  const seen = new Set<string>();
  for (const row of (titleRes as any).data || []) {
    if (!seen.has(row.id)) {
      merged.push(row as AdaptationRow);
      seen.add(row.id);
    }
  }
  for (const row of (frRes as any).data || []) {
    if (!seen.has(row.id)) {
      merged.push(row as AdaptationRow);
      seen.add(row.id);
    }
  }

  // Sort consistently with UI choice
  if (sort === "recent") {
    merged.sort((a: any, b: any) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
  } else {
    merged.sort((a: any, b: any) => String(a.title).localeCompare(String(b.title)));
  }

  // Paginate in memory
  const total = merged.length;
  const from = (page - 1) * pageSize;
  const to = Math.min(from + pageSize, total);
  const pageRows = merged.slice(from, to);

  return { data: pageRows, count: total };
}

export async function fetchFranchiseBySlug(
  slug: string
): Promise<FranchiseWithAdaptations | null> {
  const supabase = await createSupabaseServer();

  // 1) try by slug (SAFE: .maybeSingle)
  let { data, error, status } = await supabase
    .from("franchises")
    .select(`
      id,
      canonical_name,
      slug,
      description,
      adaptations (
        id,
        medium_type,
        title,
        language,
        metadata,
        updated_at,
        volumes ( id, volume_number, title, metadata )
      )
    `)
    .eq("slug", slug)
    .maybeSingle();                 // <-- IMPORTANT

  // 2) If not found, try a â€œnameyâ€ fallback (handles /series/one%20piece)
  if (!data) {
    const guess = decodeURIComponent(slug).replace(/\s+/g, " ").trim();
    const { data: alt } = await supabase
      .from("franchises")
      .select(`
        id, canonical_name, slug, description,
        adaptations (
          id, medium_type, title, language, metadata, updated_at,
          volumes ( id, volume_number, title, metadata )
        )
      `)
      .ilike("canonical_name", guess)     // case-insensitive
      .maybeSingle();                     // <-- IMPORTANT
    data = alt ?? null;
  }

  // Ignore 0-row status; only log real errors
  if (error && status !== 406) {
    console.error("Error fetching franchise:", error);
  }

  return (data as unknown as FranchiseWithAdaptations) ?? null;
}

// fetch franchises with nested adaptations
// optional q filters by franchise name using ilike
// returns up to limit ordered by recently updated
export async function fetchFranchisesWithAdaptations(
  limit = 48,
  q?: string
): Promise<FranchiseWithAdaptations[]> {
  const supabase = await createSupabaseServer()

  let qb = supabase
    .from("franchises")
    .select(
      `id, canonical_name, slug, description, created_at, updated_at,
       adaptations (
         id, franchise_id, medium_type, title, language, metadata, updated_at, created_at
       )`
    )
    .order("updated_at", { ascending: false })
    .limit(limit)

  if (q && q.trim()) {
    qb = qb.ilike("canonical_name", `%${q.trim()}%`)
  }

  const { data, error } = await qb
  if (error) {
    console.error("Error fetching franchises with adaptations:", error)
    return []
  }
  return ((data as unknown) as FranchiseWithAdaptations[]) || []
}

export async function fetchRecentMappings(limit = 10): Promise<RecentMapping[]> {
  const supabase = await createSupabaseServer()
  
  const { data, error } = await supabase
    .from("pairwise_mappings")
    .select(`
      id,
      relation_type,
      confidence,
      status,
      created_by_user_id,
      created_at,
      content_unit_id_a,
      content_unit_id_b
    `)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching recent mappings:", error)
    return []
  }

  return (data as RecentMapping[]) || []
}

export async function fetchProfile(userId: string): Promise<ProfileRow | null> {
  const supabase = await createSupabaseServer()
  
  const { data, error } = await supabase
    .from("profiles")
    .select("id, display_name, avatar_url, role, reputation, verified")
    .eq("id", userId)
    .single()

  if (error) {
    console.error("Error fetching profile:", error)
    return null
  }

  return data as ProfileRow
}

export async function fetchFranchisesByIds(ids: string[]): Promise<Record<string, FranchiseRow>> {
  if (!ids.length) return {}
  const supabase = await createSupabaseServer()
  const { data, error } = await supabase
    .from("franchises")
    .select("id, canonical_name, slug, description, created_at, updated_at")
    .in("id", ids)

  if (error) {
    console.error("Error fetching franchises by ids:", error)
    return {}
  }

  const map: Record<string, FranchiseRow> = {}
  for (const f of (data as FranchiseRow[]) || []) {
    map[f.id] = f
  }
  return map
}

// TODO: Add image URL helpers when API routes are ready
// TODO: Add franchise cover image resolution
// TODO: Add adaptation thumbnail resolution
// TODO: Add profile avatar URL resolution

// â€¦ your existing enums/types/exports stay as-is â€¦

/* ------------------------------------------------------------------ */
/* View: franchise_mappings_flat                                      */
/* ------------------------------------------------------------------ */

export type FlatMapping = {
  mapping_id: string
  relation_type: "equivalent" | "overlaps" | "adapts" | "expands" | "compresses"
  confidence: number | null
  created_at: string
  status: "approved"

  // A side
  a_content_unit_id: string
  a_adaptation_id: string
  a_adaptation_title: string
  a_medium: "anime" | "manga" | "light_novel"
  a_kind: "episode" | "chapter"
  a_seq: number
  a_volume_number: number | null

  // B side
  b_content_unit_id: string
  b_adaptation_id: string
  b_adaptation_title: string
  b_medium: "anime" | "manga" | "light_novel"
  b_kind: "episode" | "chapter"
  b_seq: number
  b_volume_number: number | null

  // Franchise
  franchise_id: string
  franchise_slug: string
  franchise_name: string
}

export type PairKey = "anime-manga" | "anime-light_novel" | "manga-light_novel"

export interface ApprovedMapping {
  id: string
  relation_type: FlatMapping["relation_type"]
  confidence: number
  a: {
    medium: FlatMapping["a_medium"]
    adaptation_id: string
    adaptation_title: string
    seq: number
    kind: FlatMapping["a_kind"]
    volume: number | null
  }
  b: {
    medium: FlatMapping["b_medium"]
    adaptation_id: string
    adaptation_title: string
    seq: number
    kind: FlatMapping["b_kind"]
    volume: number | null
  }
  created_at: string
}

export interface FranchisePairs {
  franchise: { id: string; slug: string; name: string }
  groups: Record<PairKey, ApprovedMapping[]>
}

function toPairKey(a: FlatMapping["a_medium"], b: FlatMapping["b_medium"]): PairKey | null {
  const set = new Set([a, b])
  if (set.has("anime") && set.has("manga")) return "anime-manga"
  if (set.has("anime") && set.has("light_novel")) return "anime-light_novel"
  if (set.has("manga") && set.has("light_novel")) return "manga-light_novel"
  return null
}

/**
 * Fetch all approved mappings for a franchise from the flat view,
 * grouped into the three cross-medium tabs.
 *
 * Pass { by: "id" } to filter on franchise_id (recommended).
 */
export async function fetchFranchiseMappingsBySlug(
  slugOrId: string,
  opts?: { by?: "slug" | "id" }
): Promise<FranchisePairs | null> {
  const supabase = await createSupabaseServer();
  const column = opts?.by === "id" ? "franchise_id" : "franchise_slug";

  const { data, error } = await supabase
    .from("franchise_mappings_flat")
    .select("*")
    .eq(column, slugOrId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("fetchFranchiseMappingsBySlug:", error.message);
    return null;
  }

  const rows = (data || []) as FlatMapping[];
  if (!rows.length) {
    return {
      franchise: {
        id: opts?.by === "id" ? slugOrId : "",
        slug: opts?.by === "id" ? "" : slugOrId,
        name: (opts?.by === "id" ? "" : slugOrId.replace(/-/g, " ")),
      },
      groups: {
        "anime-manga": [],
        "anime-light_novel": [],
        "manga-light_novel": [],
      },
    };
  }

  // normalize direction so buckets are stable
  const normalized = rows.map((r) => {
    const want = [r.a_medium, r.b_medium].sort().join("_");
    const have = `${r.a_medium}_${r.b_medium}`;
    if (want === have) return r;
    return {
      ...r,
      a_content_unit_id: r.b_content_unit_id,
      a_adaptation_id: r.b_adaptation_id,
      a_adaptation_title: r.b_adaptation_title,
      a_medium: r.b_medium,
      a_kind: r.b_kind,
      a_seq: r.b_seq,
      a_volume_number: r.b_volume_number,

      b_content_unit_id: r.a_content_unit_id,
      b_adaptation_id: r.a_adaptation_id,
      b_adaptation_title: r.a_adaptation_title,
      b_medium: r.a_medium,
      b_kind: r.a_kind,
      b_seq: r.a_seq,
      b_volume_number: r.a_volume_number,
    } as FlatMapping;
  });

  const groups: Record<PairKey, ApprovedMapping[]> = {
    "anime-manga": [],
    "anime-light_novel": [],
    "manga-light_novel": [],
  };

  for (const r of normalized) {
    const set = new Set([r.a_medium, r.b_medium]);
    const key =
      set.has("anime") && set.has("manga")
        ? "anime-manga"
        : set.has("anime") && set.has("light_novel")
        ? "anime-light_novel"
        : set.has("manga") && set.has("light_novel")
        ? "manga-light_novel"
        : null;
    if (!key) continue;

    groups[key].push({
      id: r.mapping_id,
      relation_type: r.relation_type,
      confidence: Number(r.confidence ?? 0.7),
      created_at: r.created_at,
      a: {
        medium: r.a_medium,
        adaptation_id: r.a_adaptation_id,
        adaptation_title: r.a_adaptation_title,
        seq: r.a_seq,
        kind: r.a_kind,
        volume: r.a_volume_number,
      },
      b: {
        medium: r.b_medium,
        adaptation_id: r.b_adaptation_id,
        adaptation_title: r.b_adaptation_title,
        seq: r.b_seq,
        kind: r.b_kind,
        volume: r.b_volume_number,
      },
    });
  }

  const first = normalized[0];
  return {
    franchise: {
      id: first.franchise_id,
      slug: first.franchise_slug,
      name: first.franchise_name,
    },
    groups,
  };
}

/* ------------------------------------------------------------------ */
/* Browse cards â€“ franchises that have any approved mapping            */
/* ------------------------------------------------------------------ */

export interface MappedFranchiseCard {
  id: string
  slug: string
  name: string
  mapping_count: number
}

/** Use the flat view; aggregate in JS for simplicity */
export async function fetchMappedFranchises(opts?: {
  q?: string
  limit?: number
  offset?: number
  sort?: "alpha" | "recent"
}): Promise<MappedFranchiseCard[]> {
  const supabase = await createSupabaseServer()
  const limit = opts?.limit ?? 24
  const offset = opts?.offset ?? 0

  let q1 = supabase
    .from("franchise_mappings_flat")
    .select("franchise_id, franchise_slug, franchise_name, created_at")

  if (opts?.q && opts.q.trim()) {
    q1 = q1.ilike("franchise_name", `%${opts.q.trim()}%`)
  }

  if (opts?.sort === "recent") {
    q1 = q1.order("created_at", { ascending: false })
  } else {
    q1 = q1.order("franchise_name", { ascending: true })
  }

  const { data, error } = await q1.range(offset, offset + limit * 5 - 1)
  if (error || !data) return []

  const byFr: Record<string, MappedFranchiseCard> = {}
  for (const r of data as any[]) {
    const id = r.franchise_id as string
    if (!byFr[id]) {
      byFr[id] = {
        id,
        slug: r.franchise_slug as string,
        name: r.franchise_name as string,
        mapping_count: 0,
      }
    }
    byFr[id].mapping_count++
  }

  let rows = Object.values(byFr)
  if (opts?.sort === "recent") {
    // leave in incoming order (recent)
  } else {
    rows = rows.sort((a, b) => a.name.localeCompare(b.name))
  }
  return rows.slice(0, limit)
}

// ===== Unified Search (accent- & case-insensitive) =====
export interface UnifiedSearchRow {
  object_id: string;
  kind: "franchise" | "adaptation";
  title: string | null;
  medium_type: "anime" | "manga" | "light_novel" | null;
  language: string | null;
  slug: string | null;               // route target: /series/:slug
  franchise_name: string | null;
  franchise_id: string | null;
  updated_at: string | null;
}

export async function searchSite(q: string, limit = 20): Promise<UnifiedSearchRow[]> {
  const supabase = await createSupabaseServer();
  const { data, error } = await supabase.rpc("search_unified", { q, lim: limit });
  if (error) {
    console.error("searchSite error:", error);
    return [];
  }
  return (data as UnifiedSearchRow[]) ?? [];
}


