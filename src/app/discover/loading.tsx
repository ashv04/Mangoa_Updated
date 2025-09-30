import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function LoadingDiscover() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-soft/20 to-teal-soft/20 pattern-dots">
      <main className="container mx-auto px-4 py-8 space-y-10">
        <div className="text-center space-y-3">
          <Skeleton className="h-10 w-48 mx-auto rounded-full manga-card" />
          <Skeleton className="h-5 w-80 mx-auto rounded-full manga-card" />
        </div>
        <Tabs defaultValue="anime">
          <TabsList className="mb-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-teal/5" />
            <TabsTrigger value="anime" className="manga-focus position-relative">
              Anime
            </TabsTrigger>
            <TabsTrigger value="manga" className="manga-focus position-relative">
              Manga
            </TabsTrigger>
            <TabsTrigger value="light_novel" className="manga-focus position-relative">
              Light Novel
            </TabsTrigger>
          </TabsList>
          {(["anime","manga","light_novel"] as const).map((k) => (
            <TabsContent key={k} value={k} className="space-y-8 panel-slide">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Card key={i} className="manga-card chibi-bounce" style={{ animationDelay: `${i * 100}ms` }}>
                    <CardHeader className="pb-2">
                      <Skeleton className="h-5 w-2/3 rounded-lg" />
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Skeleton className="h-4 w-1/3 rounded-lg" />
                      <Skeleton className="h-6 w-24 rounded-lg" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  )
}