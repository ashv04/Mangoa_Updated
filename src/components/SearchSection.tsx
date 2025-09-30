"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Filter, Grid3X3, List, BookOpen, Play, MessageSquare, Heart, Sparkles, Star } from "lucide-react";
import { toast } from "sonner";

interface SeriesCard {
  id: string;
  title: string;
  formats: string[];
  description: string;
  rating: number;
  status: string;
}

export default function SearchSection() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams?.get("q") || "");
  const [selectedFormat, setSelectedFormat] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [series, setSeries] = useState<SeriesCard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Simulate search functionality
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error("Please enter a series name to search! 🔍");
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    
    // Simulate API call
    setTimeout(() => {
      setSeries([]); // Empty results for skeleton/empty state
      setIsLoading(false);
      toast.success(`Searched for "${searchQuery}" - great choice! ✨`);
    }, 1500);
  };

  const handleFormatFilter = (format: string) => {
    setSelectedFormat(format);
    toast.info(`Filtering by ${format === "all" ? "all formats" : format} 📚`);
  };

  return (
    <div className="space-y-8">
      {/* Search Header */}
      <div className="bg-gradient-to-br from-card to-secondary/20 rounded-3xl p-6 md:p-8 border border-border/30 shadow-cozy">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground flex items-center justify-center gap-2">
              <Search className="h-8 w-8 text-primary" />
              Discover Your Next Adventure
            </h1>
            <p className="text-muted-foreground">Find connections across anime, manga, and light novels!</p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <input
                type="text"
                placeholder="Search for any anime, manga, or light novel..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="w-full pl-12 pr-32 py-4 text-lg rounded-2xl border border-border/50 bg-background/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 placeholder:text-muted-foreground/70"
              />
              <button
                onClick={handleSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary text-primary-foreground px-6 py-2 rounded-xl hover:bg-primary/90 transition-all duration-200 font-medium hover:scale-105"
              >
                Search!
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and View Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Format Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-muted-foreground mr-2">Filter by:</span>
          {[
            { key: "all", label: "All Formats", icon: Sparkles },
            { key: "manga", label: "Manga", icon: BookOpen },
            { key: "anime", label: "Anime", icon: Play },
            { key: "novel", label: "Light Novel", icon: MessageSquare }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => handleFormatFilter(key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                selectedFormat === key
                  ? "bg-primary text-primary-foreground shadow-cozy"
                  : "bg-secondary/50 text-muted-foreground hover:bg-primary/10 hover:text-primary"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground mr-2">View:</span>
          <div className="flex bg-secondary/30 rounded-xl p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-all duration-200 ${
                viewMode === "grid"
                  ? "bg-card text-primary shadow-sm"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-all duration-200 ${
                viewMode === "list"
                  ? "bg-card text-primary shadow-sm"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="space-y-6">
        {isLoading ? (
          /* Loading Skeletons */
          <div className={viewMode === "grid" ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-card border border-border/30 rounded-2xl p-4 space-y-3 shadow-cozy">
                <div className="h-32 bg-gradient-to-br from-muted to-muted/70 rounded-xl animate-pulse" />
                <div className="space-y-2">
                  <div className="h-5 bg-muted rounded-lg animate-pulse" />
                  <div className="h-4 bg-muted rounded-lg animate-pulse w-3/4" />
                  <div className="flex gap-2">
                    <div className="h-6 bg-muted rounded-full animate-pulse w-16" />
                    <div className="h-6 bg-muted rounded-full animate-pulse w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : hasSearched && series.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16 space-y-6">
            <div className="w-32 h-32 bg-gradient-to-br from-secondary/30 to-accent/20 rounded-3xl flex items-center justify-center mx-auto">
              <div className="space-y-2">
                <div className="flex justify-center gap-2">
                  <BookOpen className="h-8 w-8 text-primary/60 animate-bounce" style={{animationDelay: '0s'}} />
                  <Play className="h-8 w-8 text-teal/60 animate-bounce" style={{animationDelay: '0.2s'}} />
                  <MessageSquare className="h-8 w-8 text-chart-4/60 animate-bounce" style={{animationDelay: '0.4s'}} />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-heading font-semibold text-foreground">
                No series found yet! 🔍
              </h3>
              <p className="text-lg text-muted-foreground max-w-md mx-auto">
                Don't worry — search for your favorite anime, manga, or light novel and start tracking those amazing stories!
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <button
                  onClick={() => {
                    setSearchQuery("Attack on Titan");
                    toast.info("Try searching for a popular series! 🎯");
                  }}
                  className="bg-primary/10 text-primary px-6 py-3 rounded-2xl hover:bg-primary/20 transition-all duration-200 font-medium flex items-center gap-2"
                >
                  <Star className="h-4 w-4" />
                  Try "Attack on Titan"
                </button>
                <button
                  onClick={() => {
                    window.history.pushState({}, "", "/contribute");
                    window.location.reload();
                    toast.success("Help us add more series! 💫");
                  }}
                  className="bg-gradient-to-r from-primary to-teal text-white px-6 py-3 rounded-2xl hover:from-primary/90 hover:to-teal/90 transition-all duration-200 font-medium flex items-center gap-2 shadow-cozy hover:scale-105"
                >
                  <Heart className="h-4 w-4" />
                  Contribute a Series
                </button>
              </div>
            </div>
          </div>
        ) : !hasSearched ? (
          /* Initial State */
          <div className="text-center py-16 space-y-6">
            <div className="w-32 h-32 bg-gradient-to-br from-primary/10 to-teal/10 rounded-3xl flex items-center justify-center mx-auto">
              <Search className="h-12 w-12 text-primary" />
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-heading font-semibold text-foreground">
                Ready to discover connections? ✨
              </h3>
              <p className="text-lg text-muted-foreground max-w-md mx-auto">
                Search for any anime, manga, or light novel above and we'll show you all the related formats and adaptations!
              </p>
              <div className="grid sm:grid-cols-3 gap-4 max-w-lg mx-auto pt-4">
                {[
                  { format: "Manga", icon: BookOpen, color: "primary" },
                  { format: "Anime", icon: Play, color: "teal" },
                  { format: "Light Novel", icon: MessageSquare, color: "chart-4" }
                ].map(({ format, icon: Icon, color }) => (
                  <div key={format} className="bg-card border border-border/30 rounded-2xl p-4 text-center shadow-cozy">
                    <Icon className={`h-6 w-6 text-${color} mx-auto mb-2`} />
                    <p className="text-sm font-medium text-muted-foreground">{format}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Trending Suggestions */}
      {!hasSearched && (
        <div className="bg-gradient-to-br from-secondary/20 to-accent/10 rounded-3xl p-6 md:p-8 border border-border/30">
          <div className="text-center space-y-4">
            <h2 className="text-xl font-heading font-semibold text-foreground flex items-center justify-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Popular Among Fans
            </h2>
            <p className="text-muted-foreground">Here are some series our community loves tracking!</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 max-w-4xl mx-auto">
              {[
                "Attack on Titan", "Demon Slayer", "One Piece", "My Hero Academia",
                "Jujutsu Kaisen", "Chainsaw Man", "Spy x Family", "Tokyo Ghoul"
              ].map((title) => (
                <button
                  key={title}
                  onClick={() => {
                    setSearchQuery(title);
                    toast.info(`Great choice! ${title} is amazing! 🌟`);
                  }}
                  className="bg-card/50 hover:bg-card border border-border/30 hover:border-primary/30 rounded-xl p-3 text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-105"
                >
                  {title}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}