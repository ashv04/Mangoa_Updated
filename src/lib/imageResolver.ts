// server util to resolve cover and banner images for a title
// tries anilist (no key) first, then optional tmdb fallback for anime

export type ResolvedImages = {
  cover: string | null
  banner: string | null
  logo?: string | null
}

async function fetchAniList(title: string, type: "ANIME" | "MANGA"): Promise<ResolvedImages | null> {
  const query = `
    query ($search: String, $type: MediaType) {
      Media(search: $search, type: $type) {
        id
        coverImage { extraLarge large color }
        bannerImage
      }
    }
  `
  const res = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables: { search: title, type } }),
    // cache for a day
    next: { revalidate: 86400 },
  })
  if (!res.ok) return null
  const data = await res.json().catch(() => null)
  const m = data?.data?.Media
  if (!m) return null
  return {
    cover: m.coverImage?.extraLarge || m.coverImage?.large || null,
    banner: m.bannerImage || null,
  }
}

async function fetchTMDB(title: string): Promise<ResolvedImages | null> {
  const key = process.env.TMDB_API_KEY
  if (!key) return null
  const isV4 = key.startsWith("ey") || key.includes(".")
  const authHeaders = isV4
    ? { Authorization: `Bearer ${key}`, accept: "application/json" }
    : { accept: "application/json" }
  const apikey = isV4 ? "" : `&api_key=${encodeURIComponent(key)}`
  try {
    const search = await fetch(
      `https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(title)}&include_adult=false&language=en-US&page=1${apikey}`,
      { headers: authHeaders as any, next: { revalidate: 86400 } }
    )
    if (!search.ok) return null
    const j = await search.json()
    const first = j?.results?.[0]
    if (!first) return null
    const images = await fetch(`https://api.themoviedb.org/3/tv/${first.id}/images?include_image_language=en,null${apikey}`, {
      headers: authHeaders as any,
      next: { revalidate: 86400 },
    })
    if (!images.ok) return null
    const img = await images.json()
    const poster = img?.posters?.[0]?.file_path
    const backdrop = img?.backdrops?.[0]?.file_path
    const logo = img?.logos?.[0]?.file_path
    const base = "https://image.tmdb.org/t/p"
    return {
      cover: poster ? `${base}/w500${poster}` : null,
      banner: backdrop ? `${base}/w780${backdrop}` : null,
      logo: logo ? `${base}/w300${logo}` : null,
    }
  } catch {
    return null
  }
}

async function fetchKitsuManga(title: string): Promise<ResolvedImages | null> {
  try {
    const res = await fetch(
      `https://kitsu.io/api/edge/manga?filter[text]=${encodeURIComponent(title)}&page[limit]=1`,
      { headers: { accept: "application/vnd.api+json" }, next: { revalidate: 86400 } }
    )
    if (!res.ok) return null
    const j = await res.json()
    const first = j?.data?.[0]?.attributes
    if (!first) return null
    const cover = first.posterImage?.original || first.posterImage?.large || null
    const banner = first.coverImage?.original || first.coverImage?.large || null
    return { cover, banner }
  } catch {
    return null
  }
}

export async function resolveImagesForTitle(title: string, medium: "anime" | "manga"): Promise<ResolvedImages> {
  // try anilist first
  const a = await fetchAniList(title, medium === "anime" ? "ANIME" : "MANGA")
  if (a?.cover || a?.banner) return a
  // optional fallback for anime
  if (medium === "anime") {
    const t = await fetchTMDB(title)
    if (t) return t
  } else {
    // manga fallback via kitsu
    const k = await fetchKitsuManga(title)
    if (k) return k
  }
  return { cover: null, banner: null }
}
