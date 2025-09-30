// src/app/browse/page.tsx
import Link from "next/link"
import { Suspense } from "react"
import {
  fetchAdaptationsPaginated,
  fetchFranchisesByIds,
  MediumType,
  type AdaptationRow,
} from "@/lib/queries"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Pagination, PaginationContent, PaginationItem,
  PaginationLink, PaginationNext, PaginationPrevious
} from "@/components/ui/pagination"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import BrowseControls from "@/components/BrowseControls"
import { SearchBar } from "@/components/SearchBar"

export const dynamic = "force-dynamic"

const PAGE_SIZE = 24

function badgeClasses(m: MediumType) {
  if (m === MediumType.ANIME) return "bg-teal/15 text-teal border-teal/30"
  if (m === MediumType.MANGA) return "bg-primary/15 text-primary border-primary/30"
  return "bg-accent/20 text-accent-foreground border-accent/30"
}

// ✅ make parser accept a resolved object
function parseParams(sp: Record<string, string | string[] | undefined>) {
  const get = (k: string) => {
    const v = sp[k]
    return Array.isArray(v) ? v[0] : v
  }

  const pageStr = get("page") ?? "1"
  const parsed = Number.parseInt(String(pageStr), 10)
  const page = Number.isFinite(parsed) && parsed > 0 ? parsed : 1

  const mediumRaw = String(get("medium") ?? "")
  const medium = (["anime", "manga", "light_novel"] as const).includes(mediumRaw as any)
    ? (mediumRaw as "anime" | "manga" | "light_novel")
    : undefined

  const language = get("language") ? String(get("language")) : undefined

  const sortRaw = String(get("sort") ?? "new")
  const sort = (sortRaw === "alpha" ? "alpha" : "new") as "new" | "alpha"

  const q = get("q") ? String(get("q")) : undefined

  return { page, medium, language, sort, q }
}

async function AdaptationsGrid({
  page, medium, language, sort, q,
}: {
  page: number
  medium?: "anime" | "manga" | "light_novel"
  language?: string
  sort: "new" | "alpha"
  q?: string
}) {
  let data: AdaptationRow[] = []
  let count = 0

  try {
    const res = await fetchAdaptationsPaginated({
      page,
      pageSize: PAGE_SIZE,
      medium: (medium as MediumType | undefined),
      language,
      sort: sort === "new" ? "recent" : "alpha",
      q,
    })
    data = res?.data ?? []
    count = Number(res?.count ?? 0)
  } catch (e) {
    console.error("fetchAdaptationsPaginated failed:", e)
  }

  let franchiseMap: Record<string, { slug: string }> = {}
  if (data.length) {
    try {
      const franchiseIds = Array.from(new Set(data.map(a => a.franchise_id)))
      franchiseMap = await fetchFranchisesByIds(franchiseIds) as any
    } catch (e) {
      console.error("fetchFranchisesByIds failed:", e)
      franchiseMap = {}
    }
  }

  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE))

  if (!data.length) {
    const base = `?page=1${medium ? `&medium=${medium}` : ""}${language ? `&language=${language}` : ""}${sort ? `&sort=${sort}` : ""}${q ? `&q=${encodeURIComponent(q)}` : ""}`
    return (
      <div className="text-center text-muted-foreground space-y-4">
        <p>No results{q ? ` for “${q}”` : ""}. Try adjusting filters.</p>
        <div className="flex gap-3 justify-center">
          <Link href={base} className="underline">Clear search</Link>
          <Link href="/discover" className="underline">Discover</Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <div id="results" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {data.map((a: AdaptationRow, idx: number) => {
          const f = franchiseMap[a.franchise_id]
          const chrome = idx % 2 === 0 ? "panel-border" : "manga-panel"
          return (
            <Link key={a.id} href={f ? `/series/${f.slug}` : "#"} className="focus:outline-none manga-focus">
              <Card className={`manga-card ${chrome} h-full transition`}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base line-clamp-1">{a.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{a.language || "N/A"}</span>
                  <Badge className={badgeClasses(a.medium_type as MediumType)}>{a.medium_type}</Badge>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      <div className="mt-8 flex justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href={`?page=${Math.max(1, page - 1)}${medium ? `&medium=${medium}` : ""}${language ? `&language=${language}` : ""}${sort ? `&sort=${sort}` : ""}${q ? `&q=${encodeURIComponent(q)}` : ""}`} aria-disabled={page <= 1} />
            </PaginationItem>
            {Array.from({ length: totalPages }).slice(0, 7).map((_, i) => {
              const p = i + 1
              return (
                <PaginationItem key={p}>
                  <PaginationLink isActive={p === page} href={`?page=${p}${medium ? `&medium=${medium}` : ""}${language ? `&language=${language}` : ""}${sort ? `&sort=${sort}` : ""}${q ? `&q=${encodeURIComponent(q)}` : ""}`}>
                    {p}
                  </PaginationLink>
                </PaginationItem>
              )
            })}
            <PaginationItem>
              <PaginationNext href={`?page=${Math.min(totalPages, page + 1)}${medium ? `&medium=${medium}` : ""}${language ? `&language=${language}` : ""}${sort ? `&sort=${sort}` : ""}${q ? `&q=${encodeURIComponent(q)}` : ""}`} aria-disabled={page >= totalPages} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </>
  )
}

function GridSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {Array.from({ length: 12 }).map((_, i) => (
          <Card key={i} className="manga-card panel-border">
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-2/3" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-6 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ✅ accept searchParams as Promise and await it
export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const sp = await searchParams
  const { page, medium, language, sort, q } = parseParams(sp)
  const suspenseKey = JSON.stringify({ page, medium, language, sort, q })

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-gradient-start to-bg-gradient-end">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="relative mb-6">
          <div className="bg-card rounded-lg p-6 shadow-cozy panel-border">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="w-full md:w-auto">
                <h1 className="font-heading text-3xl md:text-4xl font-bold">Browse</h1>
                <p className="text-muted-foreground">Filter by medium and language. Sort and paginate results.</p>
              </div>
              <div className="md:hidden">
                <BrowseControls current={{ page, medium, language, sort }} />
              </div>
            </div>
            <div className="mt-4">
              <SearchBar placeholder="Search series..." initialValue={q || ""} focusResultsOnEnterId="results" />
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <aside className="md:col-span-3">
            <div className="bg-card rounded-lg p-4 shadow-cozy panel-border sticky top-4">
              <div className="hidden md:block">
                <BrowseControls current={{ page, medium, language, sort }} />
              </div>
            </div>
          </aside>
          <section className="md:col-span-9">
            <Suspense key={suspenseKey} fallback={<GridSkeleton />}>
              <AdaptationsGrid page={page} medium={medium} language={language} sort={sort} q={q} />
            </Suspense>
          </section>
        </div>

        <div className="mt-10 text-center text-muted-foreground">
          Looking for something specific? Try exploring on the <Link href="/discover" className="underline">Discover</Link> page.
        </div>
      </div>
    </div>
  )
}
