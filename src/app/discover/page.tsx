import Link from "next/link"
import { Suspense } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchFranchisesWithAdaptations, MediumType, type FranchiseWithAdaptations, type AdaptationRow } from "@/lib/queries"
import { SearchBar } from "@/components/SearchBar"

export const dynamic = "force-dynamic"

function badgeClasses(m: MediumType) {
  if (m === MediumType.ANIME) return "bg-teal/15 text-teal border-teal/30"
  if (m === MediumType.MANGA) return "bg-primary/15 text-primary border-primary/30"
  return "bg-accent/20 text-accent-foreground border-accent/30"
}

function AdaptationCard({ a, slug }: { a: AdaptationRow; slug: string }) {
  return (
    <Link href={`/series/${slug}`} className="block focus:outline-none manga-focus">
      <Card className="manga-card panel-border h-full transition will-change-transform">
        <CardHeader className="pb-2">
          <CardTitle className="text-base line-clamp-1">{a.title}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground flex items-center justify-between">
          <span>{a.language || "N/A"}</span>
          <Badge className={badgeClasses(a.medium_type)}>{a.medium_type}</Badge>
        </CardContent>
      </Card>
    </Link>
  )
}

async function DiscoverContent({ q }: { q?: string }) {
  const franchises = await fetchFranchisesWithAdaptations(48, q)
  const grouped: Record<MediumType, Array<{ a: AdaptationRow; slug: string }>> = {
    [MediumType.ANIME]: [],
    [MediumType.MANGA]: [],
    [MediumType.LIGHT_NOVEL]: [],
  }
  for (const f of franchises) {
    for (const a of (f.adaptations || []) as FranchiseWithAdaptations["adaptations"]) {
      grouped[a.medium_type as MediumType].push({ a: a as AdaptationRow, slug: f.slug })
    }
  }

  const tabs: Array<{ key: MediumType; label: string }> = [
    { key: MediumType.ANIME, label: "anime" },
    { key: MediumType.MANGA, label: "manga" },
    { key: MediumType.LIGHT_NOVEL, label: "light_novel" },
  ]

  return (
    <Tabs defaultValue="anime" className="w-full">
      <TabsList className="mb-6">
        <TabsTrigger value="anime">Anime</TabsTrigger>
        <TabsTrigger value="manga">Manga</TabsTrigger>
        <TabsTrigger value="light_novel">Light Novel</TabsTrigger>
      </TabsList>

      {tabs.map(({ key, label }) => {
        const items = grouped[key]
        const top = items.slice(0, 8)
        const rest = items.slice(8, 28)
        return (
          <TabsContent key={label} value={label} className="space-y-8">
            {/* Carousel */}
            <div className="relative">
              <Carousel className="px-12">
                <CarouselContent>
                  {top.length ? (
                    top.map(({ a, slug }) => (
                      <CarouselItem key={a.id} className="basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                        <AdaptationCard a={a} slug={slug} />
                      </CarouselItem>
                    ))
                  ) : (
                    Array.from({ length: 6 }).map((_, i) => (
                      <CarouselItem key={i} className="basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                        <Card className="manga-card h-full">
                          <CardHeader className="pb-2">
                            <Skeleton className="h-5 w-3/4" />
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <Skeleton className="h-4 w-1/3" />
                            <Skeleton className="h-6 w-24" />
                          </CardContent>
                        </Card>
                      </CarouselItem>
                    ))
                  )}
                </CarouselContent>
                <CarouselPrevious aria-label="Previous" />
                <CarouselNext aria-label="Next" />
              </Carousel>
            </div>

            <Separator className="my-2" />

            {/* Staggered Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 items-start">
              {rest.length ? (
                rest.map(({ a, slug }, idx) => (
                  <div key={a.id} className={idx % 3 === 0 ? "translate-y-1" : idx % 3 === 1 ? "-translate-y-1" : "translate-y-0"}>
                    <AdaptationCard a={a} slug={slug} />
                  </div>
                ))
              ) : (
                Array.from({ length: 8 }).map((_, i) => (
                  <Card key={i} className="manga-card">
                    <CardHeader className="pb-2">
                      <Skeleton className="h-5 w-2/3" />
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-6 w-24" />
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {items.length === 0 && (
              <div className="text-center text-muted-foreground">
                {q ? (
                  <>
                    No matches for “{q}”.
                    <Link href="/discover" className="ml-2 underline">Clear search</Link>
                  </>
                ) : (
                  <>
                    No items yet. Try browsing all series.
                    <Link href="/browse" className="ml-2 underline">Go to Browse</Link>
                  </>
                )}
              </div>
            )}
          </TabsContent>
        )
      })}
    </Tabs>
  )
}

export default async function DiscoverPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const raw = searchParams?.q
  const q = typeof raw === "string" ? raw : Array.isArray(raw) ? raw[0] : undefined
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-soft/20 to-teal-soft/20">
      <main className="container mx-auto px-4 py-8 space-y-10">
        <div className="text-center space-y-2">
          <h1 className="font-heading text-4xl md:text-5xl font-bold">Discover</h1>
          <p className="text-muted-foreground">Explore anime, manga, and light novels.</p>
        </div>
        <div className="max-w-2xl mx-auto">
          {/* client search bar with debounce; updates ?q= */}
          <SearchBar placeholder="Search series..." initialValue={q || ""} />
        </div>
        <Suspense
          fallback={
            <div className="space-y-8">
              <Tabs defaultValue="anime">
                <TabsList className="mb-6">
                  <TabsTrigger value="anime">Anime</TabsTrigger>
                  <TabsTrigger value="manga">Manga</TabsTrigger>
                  <TabsTrigger value="light_novel">Light Novel</TabsTrigger>
                </TabsList>
                {(["anime", "manga", "light_novel"] as const).map((v) => (
                  <TabsContent key={v} value={v} className="space-y-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <Card key={i} className="manga-card">
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
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          }
        >
          {/* @ts-expect-error Async Server Component */}
          <DiscoverContent q={q} />
        </Suspense>
      </main>
    </div>
  )
}