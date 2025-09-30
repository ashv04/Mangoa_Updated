"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Search, BookOpen, Play, MessageSquare, Sparkles, Heart, Users, ArrowRight, Star, Zap } from "lucide-react";
import Link from "next/link";

export default function LandingSection() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Let's find your next favorite story! ✨");
    router.push("/discover");
  };

  const handleFeatureClick = (feature: string) => {
    toast.info(`Diving into ${feature} — exciting adventures ahead! 🎉`);
    router.push("/discover");
  };

  const handleContributeClick = () => {
    toast.success("Amazing! Ready to help fellow fans? 💫");
    router.push("/contribute");
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/50 pb-16 pt-12">
        {/* Background video (behind this section only) */}
        <div className="absolute inset-0 z-0 pointer-events-none select-none">
          <video
            className="h-full w-full object-cover"
            autoPlay
            muted
            playsInline
            loop
            preload="metadata"
            poster="/media/wallpaper.jpg"
            aria-hidden="true"
          >
            <source src="/media/wallpaper.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Existing soft veil (kept as-is) */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-purple-soft/50 via-card/50 to-teal-soft/50" />

        {/* NEW: bottom fade from video → white (no blur) */}
        <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-b from-transparent to-white pointer-events-none z-10" />

        {/* Content */}
        <div className="container max-w-6xl mx-auto px-4 relative z-20">
          <div className="text-center space-y-8">
            <div className="space-y-6">
              {/* 1) Chip: more visible (veil + darker text) */}
              <div className="inline-flex items-center gap-2 bg-black/15 backdrop-blur-sm drop-shadow-sm text-white/95 px-4 py-2 rounded-full text-sm font-medium">
                <Sparkles className="h-4 w-4" />
                Built by fans, for fans
              </div>

              <h1 className="text-4xl md:text-6xl font-heading font-bold text-foreground tracking-tight">
                Your Story Universe
                <br />
                <span className="text-primary">All Connected!</span>
              </h1>

              {/* 2) Tagline paragraph: higher legibility, narrower */}
              <p className="text-lg md:text-l max-w-lg mx-auto leading-relaxed text-slate-900">
                Watching an anime? Reading manga? Discover where your favorite stories continue across all formats since every fan deserves the full adventure!
              </p>
            </div>

            {/* Search Bar (unchanged by request) */}
            <div className="max-w-2xl mx-auto">
              <form onSubmit={handleSearchSubmit} className="relative">
                <div className="relative shadow-cozy">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search your favorite anime, manga, light novels..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-32 py-4 text-lg rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 placeholder:text-muted-foreground/70"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-6 py-2 rounded-xl hover:bg-primary/90 transition-all duration-200 font-medium hover:scale-105 inline-flex items-center gap-2"
                  >
                    Jump In! <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </form>
            </div>

            {/* 3) “Discover connections…” block (icons) — narrower, cleaner, higher-contrast */}
            <div className="mt-12 flex justify-center">
              <div className="w-48 h-30 bg-white/60 backdrop-blur-sm rounded-3xl flex items-center justify-center border border-white/40 shadow-sm">
                <div className="text-center space-y-3">
                  <div className="flex justify-center gap-2">
                    <BookOpen className="h-6 w-6 text-primary animate-bounce" style={{ animationDelay: "0s" }} />
                    <Play className="h-6 w-6 text-teal animate-bounce" style={{ animationDelay: "0.2s" }} />
                    <MessageSquare className="h-6 w-6 text-chart-4 animate-bounce" style={{ animationDelay: "0.4s" }} />
                  </div>
                  <p className="text-sm font-medium text-slate-800">
                    Discover connections across all your favorites!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-16 bg-gradient-to-b from-background/50 to-card/30">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              Explore Every Format 📚✨
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Whether you're team manga, anime squad, or light novel lover — we've got your back!
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Manga Card */}
            <div
              onClick={() => handleFeatureClick("Manga")}
              className="bg-manga-soft border border-border/30 rounded-3xl p-6 hover:shadow-cozy hover:-translate-y-2 transition-all duration-300 cursor-pointer group"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <BookOpen className="h-7 w-7 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="text-xl font-heading font-semibold text-foreground">Manga</h3>
                    <span className="bg-primary/15 text-primary px-3 py-1 rounded-full text-xs font-medium">
                      📖 Visual
                    </span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Love those epic manga panels? Find which anime brought them to life or discover the light novel that started it all!
                  </p>
                </div>
              </div>
            </div>

            {/* Anime Card */}
            <div
              onClick={() => handleFeatureClick("Anime")}
              className="bg-anime-soft border border-border/30 rounded-3xl p-6 hover:shadow-cozy hover:-translate-y-2 transition-all duration-300 cursor-pointer group"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 bg-gradient-to-br from-teal to-teal/80 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <Play className="h-7 w-7 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="text-xl font-heading font-semibold text-foreground">Anime</h3>
                    <span className="bg-teal/15 text-teal px-3 py-1 rounded-full text-xs font-medium">
                      📺 Motion
                    </span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Obsessed with that anime? Dive deeper with the manga source or explore the light novel for extra story content!
                  </p>
                </div>
              </div>
            </div>

            {/* Light Novels Card */}
            <div
              onClick={() => handleFeatureClick("Light Novels")}
              className="bg-novel-soft border border-border/30 rounded-3xl p-6 hover:shadow-cozy hover:-translate-y-2 transition-all duration-300 cursor-pointer group"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 bg-gradient-to-br from-chart-4 to-chart-4/80 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <MessageSquare className="h-7 w-7 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="text-xl font-heading font-semibold text-foreground">Light Novels</h3>
                    <span className="bg-chart-4/15 text-chart-4 px-3 py-1 rounded-full text-xs font-medium">
                      📝 Stories
                    </span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Found an amazing light novel? See if it got adapted into anime or manga — and never miss a part of the story!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-card/50 border-y border-border/30">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              How It Works 🎯
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to unlock your complete story universe!
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {/* Step 1 */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-3xl flex items-center justify-center mx-auto shadow-cozy">
                <Search className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
                  1. Search Your Fave 🔍
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Type in any anime, manga, or light novel you're currently obsessing over.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-teal to-teal/80 rounded-3xl flex items-center justify-center mx-auto shadow-cozy">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
                  2. Discover Magic ✨
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Watch as we reveal all the connected formats, adaptations, and hidden gems.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-chart-4 to-chart-4/80 rounded-3xl flex items-center justify-center mx-auto shadow-cozy">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
                  3. Dive Deeper! 💖
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Jump into your preferred format and experience the full story universe.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Trending */}
      <section className="py-16 bg-gradient-to-b from-background/50 to-secondary/20">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-4 inline-flex items-center gap-2">
              <Users className="h-7 w-7 text-primary" />
              What Fans Are Discovering
            </h2>
            <p className="text-muted-foreground">Latest connections mapped by our amazing community!</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { from: "Episode 12", to: "Chapter 45", series: "Popular Isekai", user: "AnimeOtaku23", badge: "🔥" },
              { from: "Volume 3", to: "Season 2", series: "Romance LN", user: "BookWorm", badge: "💕" },
              { from: "Chapter 67", to: "Episode 24", series: "Shonen Hit", user: "MangaFan", badge: "⚡" }
            ].map((item, i) => (
              <div key={i} className="bg-card border border-border/30 rounded-2xl p-4 space-y-3 shadow-cozy hover:scale-105 transition-transform duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">New Mapping!</span>
                  <span className="text-lg">{item.badge}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="bg-secondary/50 px-2 py-1 rounded-lg font-medium">{item.from}</span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    <span className="bg-accent/50 px-2 py-1 rounded-lg font-medium">{item.to}</span>
                  </div>
                  <h4 className="font-heading font-semibold text-foreground">{item.series}</h4>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="w-4 h-4 bg-gradient-to-br from-primary to-teal rounded-full" />
                    <span>by {item.user}</span>
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contribute Teaser */}
      <section className="py-16 bg-gradient-to-br from-secondary/30 to-accent/20">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="bg-gradient-to-br from-card to-card/80 border border-border/30 rounded-3xl p-8 md:p-12 text-center shadow-cozy">
            <div className="space-y-6">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-teal rounded-3xl flex items-center justify-center mx-auto">
                <Heart className="h-10 w-10 text-white animate-pulse" />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
                  Help Fellow Fans Discover More! 💫
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Know a connection we're missing? Found an amazing adaptation? Join our community and help map the anime universe together!
                </p>
              </div>
              <Link
                href="/contribute"
                className="bg-gradient-to-r from-primary to-teal text-white px-8 py-3 rounded-2xl hover:from-primary/90 hover:to-teal/90 transition-all duration-200 font-semibold text-lg inline-flex items-center gap-2 shadow-cozy hover:scale-105"
              >
                <Zap className="h-5 w-5" />
                Contribute a Mapping!
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer-adjacent Callout */}
      <section className="py-12 bg-gradient-to-r from-primary to-teal text-white">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-heading font-bold mb-4">
            Ready to Discover Together? 🌟
          </h2>
          <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto">
            Join thousands of fellow fans connecting stories across anime, manga, and light novels!
          </p>
          <button
            onClick={handleSearchSubmit}
            className="bg-white text-primary px-8 py-3 rounded-2xl hover:bg-white/95 transition-all duration-200 font-semibold inline-flex items-center gap-2 shadow-cozy hover:scale-105"
          >
            <Search className="h-5 w-5" />
            Start Exploring!
          </button>
        </div>
      </section>
    </div>
  );
}
