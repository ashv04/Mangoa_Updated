"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Menu, X, User, LogIn, BookOpen, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NAV_LINKS } from "@/config/nav";
import { createSupabaseBrowser } from "@/lib/supabaseBrowser";

export default function Header({
  signedIn = false,
  displayName,
  avatarUrl,
}: {
  signedIn?: boolean;
  displayName?: string;
  avatarUrl?: string | null;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/browse?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const handleSignOut = async () => {
    const supabase = createSupabaseBrowser();
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Manga-style top accent line */}
      <div className="w-full h-1 bg-gradient-to-r from-primary/60 via-teal/60 to-primary/60"></div>
      
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo with manga-style accent */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-teal rounded-xl flex items-center justify-center shadow-cozy group-hover:shadow-lg transition-all duration-300 transform group-hover:scale-105">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-accent-foreground animate-pulse" />
            </div>
            <span className="font-heading font-bold text-xl text-foreground group-hover:text-primary transition-colors">
              Mangoa
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted-foreground hover:text-foreground transition-colors font-medium relative group"
              >
                {link.label}
                {link.auth && (
                  <span className="absolute -top-1 -right-2 w-2 h-2 bg-accent-foreground rounded-full animate-pulse"></span>
                )}
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-200"></div>
              </Link>
            ))}
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex items-center gap-4">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="search"
                placeholder="Search series..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-64 bg-input/50 border-border/50 focus:border-primary/50 rounded-xl transition-colors"
              />
            </form>
            
            {/* Auth area */}
            <div className="flex items-center gap-2">
              {!signedIn ? (
                <>
                  <Link href="/login">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-xl"
                    >
                      <LogIn className="w-4 h-4 mr-2" />
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button 
                      size="sm" 
                      className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-cozy hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Join Us!
                    </Button>
                  </Link>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <Link href="/dashboard" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                    <div className="w-8 h-8 rounded-full bg-secondary/60 overflow-hidden flex items-center justify-center">
                      {avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={avatarUrl} alt={displayName || "avatar"} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs">{(displayName || "U").slice(0,2).toUpperCase()}</span>
                      )}
                    </div>
                    <span className="hidden xl:inline">Dashboard</span>
                  </Link>
                  <Button variant="outline" size="sm" onClick={handleSignOut} className="rounded-xl">
                    Sign out
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary/50"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/30">
            <div className="space-y-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="search"
                  placeholder="Search series..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full bg-input/50 border-border/50 focus:border-primary/50 rounded-xl"
                />
              </form>

              {/* Mobile Navigation Links */}
              <nav className="space-y-2">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-3 px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                    {link.auth && (
                      <span className="w-2 h-2 bg-accent-foreground rounded-full animate-pulse"></span>
                    )}
                  </Link>
                ))}
              </nav>

              {/* Mobile Auth Buttons */}
              <div className="flex flex-col gap-2 pt-4 border-t border-border/30">
                {!signedIn ? (
                  <>
                    <Link href="/login">
                      <Button variant="ghost" className="justify-start text-muted-foreground hover:text-foreground rounded-xl">
                        <LogIn className="w-4 h-4 mr-2" />
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/auth/signup">
                      <Button className="justify-start bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-cozy">
                        <User className="w-4 h-4 mr-2" />
                        Join Our Community!
                      </Button>
                    </Link>
                  </>
                ) : (
                  <Button variant="outline" onClick={handleSignOut} className="justify-start rounded-xl">
                    Sign out
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}