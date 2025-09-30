// src/app/series/[slug]/page.tsx
import Link from "next/link";
import { Metadata } from "next";
import {
  fetchFranchiseBySlug,
  fetchFranchiseMappingsBySlug,
  FranchiseWithAdaptations,
  MediumType,
  type PairKey,
} from "@/lib/queries";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Book, Tv, FileText, Calendar, Clock, Eye, Link2 } from "lucide-react";

const TABS: PairKey[] = ["anime-manga", "anime-light_novel", "manga-light_novel"];

export const dynamic = "force-dynamic";

/* ---------------- helpers ---------------- */

function groupByMedium(adaptations: FranchiseWithAdaptations["adaptations"]) {
  const groups: Record<MediumType, typeof adaptations> = {
    [MediumType.ANIME]: [],
    [MediumType.MANGA]: [],
    [MediumType.LIGHT_NOVEL]: [],
  } as Record<MediumType, typeof adaptations>;
  for (const a of adaptations || []) {
    if (groups[a.medium_type as MediumType]) {
      groups[a.medium_type as MediumType].push(a as any);
    }
  }
  return groups;
}

function show(v: unknown) {
  return v === null || v === undefined || v === "" ? "—" : String(v);
}

/* --------------- metadata ---------------- */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await fetchFranchiseBySlug(slug);
  return {
    title: data?.canonical_name ? `${data.canonical_name} – Series` : "Series",
    description: data?.description || "Franchise details and adaptations",
  };
}

/* ------------------ page ------------------ */

export default async function SeriesBySlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await fetchFranchiseBySlug(slug);

  if (!data) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 space-y-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/browse">Series</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Loading…</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="space-y-3">
            <Skeleton className="h-10 w-80" />
            <Skeleton className="h-5 w-[40ch]" />
          </div>

          <Tabs defaultValue="anime" className="w-full">
            <TabsList>
              <TabsTrigger value="anime">Anime</TabsTrigger>
              <TabsTrigger value="manga">Manga</TabsTrigger>
              <TabsTrigger value="light_novel">Light Novel</TabsTrigger>
            </TabsList>
            {["anime", "manga", "light_novel"].map((key) => (
              <TabsContent key={key} value={key} className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-lg border bg-card p-4 space-y-2 manga-card"
                  >
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-4 w-1/3" />
                    <Separator />
                    <Skeleton className="h-8 w-full" />
                  </div>
                ))}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    );
  }

  const groups = groupByMedium(data.adaptations || []);

  // Approved cross-media mappings (already grouped by helper)
  const pairs = await fetchFranchiseMappingsBySlug(data.id, { by: "id" });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="border-b border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
        <div className="container mx-auto px-4 py-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/browse">Series</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{data.canonical_name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="relative mt-4">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-2 relative">
              {data.canonical_name}
              <div className="absolute -inset-2 border-2 border-purple-300/30 rounded-lg -z-10 transform rotate-1" />
              <div className="absolute -inset-1 border border-purple-200/50 rounded-lg -z-10" />
            </h1>
            <p className="text-muted-foreground max-w-3xl">
              {data.description || "No description provided."}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="anime" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="anime" className="flex items-center gap-2">
              <Tv className="w-4 h-4" />
              Anime
            </TabsTrigger>
            <TabsTrigger value="manga" className="flex items-center gap-2">
              <Book className="w-4 h-4" />
              Manga
            </TabsTrigger>
            <TabsTrigger value="light_novel" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Light Novel
            </TabsTrigger>
          </TabsList>

          {([
            { key: MediumType.ANIME, label: "anime", icon: Tv },
            { key: MediumType.MANGA, label: "manga", icon: Book },
            { key: MediumType.LIGHT_NOVEL, label: "light_novel", icon: FileText },
          ] as const).map(({ key, label, icon: Icon }) => {
            const list = groups[key] || [];
            return (
              <TabsContent key={label} value={label} className="space-y-4">
                {list.length === 0 ? (
                  <div className="text-center py-12">
                    <Icon className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground text-lg">
                      No {label.replace("_", " ")} adaptations yet.
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Check back later for new content!
                    </p>
                  </div>
                ) : (
                  list.map((ad) => (
                    <div
                      key={ad.id}
                      className="rounded-lg border bg-card p-4 manga-card panel-border"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <h3 className="font-heading text-xl text-foreground">
                            {ad.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <Badge
                              variant="secondary"
                              className="rotate-[-1.5deg] bg-accent text-accent-foreground"
                            >
                              {ad.language || "N/A"}
                            </Badge>
                            <Badge className="bg-primary/15 text-primary border-primary/20">
                              {key}
                            </Badge>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {new Date(ad.updated_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Eye className="w-4 h-4" />
                          <span>
                            Updated {new Date(ad.updated_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <Separator className="my-4" />

                      {/* Volumes accordion (placeholder UI) */}
                      <Accordion type="single" collapsible className="w-full">
                        {(ad as any).volumes?.length ? (
                          (ad as any).volumes.map((v: any) => (
                            <AccordionItem
                              key={v.id}
                              value={v.id}
                              className="border-muted/40"
                            >
                              <AccordionTrigger className="hover:no-underline group">
                                <div className="flex items-center gap-3 flex-1">
                                  <div className="flex items-center gap-2 flex-1">
                                    <span className="font-medium text-foreground">
                                      Vol. {v.volume_number}
                                    </span>
                                    <span className="text-muted-foreground truncate">
                                      {v.title || "Untitled Volume"}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Calendar className="w-3 h-3" />
                                    {v.release_date
                                      ? new Date(v.release_date).toLocaleDateString()
                                      : "TBA"}
                                  </div>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
                                  {Array.from({ length: 6 }).map((_, i) => (
                                    <HoverCard key={i}>
                                      <HoverCardTrigger asChild>
                                        <div className="p-4 rounded-lg border border-border/50 cursor-pointer bg-card/80 hover:bg-card transition-all duration-200 hover:border-primary/30 group">
                                          <div className="flex items-center justify-between mb-2">
                                            <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                                              Scene {i + 1}
                                            </div>
                                            <Badge variant="outline" className="text-xs">
                                              Preview
                                            </Badge>
                                          </div>
                                          <div className="text-xs text-muted-foreground">
                                            Chapter {i + 1} • Page {i * 10 + 5}
                                          </div>
                                        </div>
                                      </HoverCardTrigger>
                                      <HoverCardContent
                                        className="w-80 p-4"
                                        align="start"
                                        sideOffset={8}
                                      >
                                        <div className="space-y-3">
                                          <div className="flex items-center justify-between">
                                            <div className="text-sm font-semibold text-foreground">
                                              Content Unit Details
                                            </div>
                                            <Badge variant="secondary" className="text-xs">
                                              Scene
                                            </Badge>
                                          </div>
                                          <div className="space-y-1 text-sm">
                                            <div className="flex justify-between">
                                              <span className="text-muted-foreground">
                                                Type:
                                              </span>
                                              <span className="text-foreground">Scene</span>
                                            </div>
                                            <div className="flex justify-between">
                                              <span className="text-muted-foreground">
                                                Status:
                                              </span>
                                              <span className="text-foreground">Available</span>
                                            </div>
                                            <div className="flex justify-between">
                                              <span className="text-muted-foreground">
                                                Duration:
                                              </span>
                                              <span className="text-foreground">~5 min</span>
                                            </div>
                                          </div>
                                          <Separator />
                                          <p className="text-sm text-muted-foreground">
                                            This scene contains dialogue and action sequences.
                                            Preview content will be available once processing is
                                            complete.
                                          </p>
                                        </div>
                                      </HoverCardContent>
                                    </HoverCard>
                                  ))}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          ))
                        ) : (
                          <div className="p-6 text-center">
                            <Book className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                            <p className="text-muted-foreground">No volumes available yet.</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              Volumes will appear here as they are added.
                            </p>
                          </div>
                        )}
                      </Accordion>
                    </div>
                  ))
                )}
              </TabsContent>
            );
          })}
        </Tabs>

        {/* Approved cross-media mappings */}
        <div className="mt-12">
          <div className="flex items-center gap-2 mb-3">
            <Link2 className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold">
              Cross-Media Mappings (Approved)
            </h2>
          </div>

          {!pairs ||
          (!pairs.groups["anime-manga"].length &&
            !pairs.groups["anime-light_novel"].length &&
            !pairs.groups["manga-light_novel"].length) ? (
            <p className="text-muted-foreground">No approved mappings yet.</p>
          ) : (
            <Tabs
              defaultValue={
                pairs.groups["anime-manga"].length
                  ? "anime-manga"
                  : pairs.groups["anime-light_novel"].length
                  ? "anime-light_novel"
                  : "manga-light_novel"
              }
            >
              <TabsList className="mb-4">
                <TabsTrigger value="anime-manga">Anime ↔ Manga</TabsTrigger>
                <TabsTrigger value="anime-light_novel">
                  Anime ↔ Light Novel
                </TabsTrigger>
                <TabsTrigger value="manga-light_novel">
                  Manga ↔ Light Novel
                </TabsTrigger>
              </TabsList>

              {(TABS as PairKey[]).map((key: PairKey) => (
                <TabsContent key={key} value={key} className="space-y-3">
                  {pairs.groups[key].length === 0 ? (
                    <p className="text-sm text-muted-foreground">No mappings yet.</p>
                  ) : (
                    <ul className="space-y-3">
                      {pairs.groups[key].map((m) => {
                        const when =
                          m.created_at ? new Date(m.created_at).toLocaleString() : "—";
                        const conf =
                          typeof m.confidence === "number" ? m.confidence.toFixed(2) : "—";

                        const aSeg =
                          m.a.seq != null
                            ? `${m.a.kind === "episode" ? "Ep" : "Ch"} ${m.a.seq}`
                            : "";
                        const bSeg =
                          m.b.seq != null
                            ? `${m.b.kind === "episode" ? "Ep" : "Ch"} ${m.b.seq}`
                            : "";

                        const aLabel = [
                          m.a.adaptation_title,
                          m.a.volume ? `Vol ${m.a.volume}` : "",
                          aSeg,
                        ]
                          .filter(Boolean)
                          .join(" • ");

                        const bLabel = [
                          m.b.adaptation_title,
                          m.b.volume ? `Vol ${m.b.volume}` : "",
                          bSeg,
                        ]
                          .filter(Boolean)
                          .join(" • ");

                        return (
                          <li
                            key={m.id}
                            className="rounded-lg border bg-card p-4 manga-card panel-border"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <div className="space-y-1">
                                <div className="text-xs text-muted-foreground">
                                  Approved: {when}
                                </div>
                                <div className="font-medium">
                                  {aLabel || "—"}{" "}
                                  <span className="mx-1 text-muted-foreground">→</span>{" "}
                                  {bLabel || "—"}
                                  <span className="ml-2 text-xs px-2 py-0.5 rounded bg-purple-100 text-purple-700">
                                    {m.relation_type}
                                  </span>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Confidence: {conf}
                                </div>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </TabsContent>
              ))}

            </Tabs>
          )}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/browse"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all manga-focus shadow-cozy group"
          >
            <span>← Back to Browse</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
