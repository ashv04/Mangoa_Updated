import Link from "next/link";
import { Heart, Users, BookOpen, Play, Star, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-gradient-start to-bg-gradient-end">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-heading font-bold text-xl text-primary">
            Mangoa
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <Link href="/browse" className="text-muted-foreground hover:text-foreground transition-colors">
              Browse
            </Link>
            <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="relative inline-block">
            <h1 className="font-heading text-5xl md:text-6xl font-bold text-foreground mb-6 relative z-10">
              About Us
            </h1>
            {/* Manga-style panel border */}
            <div className="absolute inset-0 border-4 border-primary/20 bg-white/50 rounded-2xl transform rotate-1 shadow-cozy -z-10"></div>
            <div className="absolute inset-0 border-4 border-primary/30 bg-white/30 rounded-2xl transform -rotate-1 shadow-cozy -z-20"></div>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Welcome to the ultimate destination for anime, manga, and light novel enthusiasts. 
            Track your journey, discover new series, and connect with fellow fans in our vibrant community.
          </p>
        </div>

        {/* Platform Description */}
        <section className="mb-16">
          <Card className="bg-anime-soft border-2 border-teal/20 shadow-cozy">
            <CardHeader className="text-center">
              <CardTitle className="font-heading text-3xl text-foreground flex items-center justify-center gap-3">
                <Globe className="w-8 h-8 text-teal" />
                Built by Fans, for Fans
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-lg text-muted-foreground leading-relaxed max-w-4xl mx-auto">
                Our platform was born from a shared passion for Japanese media and the need for a comprehensive 
                tracking experience. Whether you're a seasoned otaku or just starting your anime journey, 
                we provide the tools to organize, discover, and celebrate your favorite series.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Mission Statement */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl font-semibold text-foreground mb-4">Our Mission</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-teal mx-auto rounded-full"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-manga-soft border-2 border-primary/20 shadow-cozy hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader className="text-center">
                <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle className="font-heading text-xl">Passionate Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  Keep detailed records of your anime, manga, and light novel progress with 
                  intuitive tools designed for enthusiasts.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-novel-soft border-2 border-accent/30 shadow-cozy hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader className="text-center">
                <BookOpen className="w-12 h-12 text-accent-foreground mx-auto mb-4" />
                <CardTitle className="font-heading text-xl">Discovery & Exploration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  Discover hidden gems and popular series through our comprehensive database and 
                  community recommendations.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-anime-soft border-2 border-teal/20 shadow-cozy hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader className="text-center">
                <Users className="w-12 h-12 text-teal mx-auto mb-4" />
                <CardTitle className="font-heading text-xl">Community Connection</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  Connect with like-minded fans, share reviews, and engage in discussions about 
                  your favorite series.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl font-semibold text-foreground mb-4">Our Community</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-teal mx-auto rounded-full mb-6"></div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Meet the passionate individuals who make this platform possible, from developers to 
              community moderators and content contributors.
            </p>
          </div>

          {/* TODO: connect Supabase for team member data */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Skeleton Team Cards */}
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <Card key={index} className="bg-card shadow-cozy border-2 border-border/50">
                <CardHeader className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-teal/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Star className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div className="h-6 bg-muted rounded-lg animate-pulse mb-2"></div>
                  <div className="h-4 bg-muted/60 rounded-lg animate-pulse w-3/4 mx-auto"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-muted/40 rounded animate-pulse"></div>
                    <div className="h-3 bg-muted/40 rounded animate-pulse w-5/6"></div>
                    <div className="h-3 bg-muted/40 rounded animate-pulse w-4/6"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Manga-style divider */}
        <div className="relative mb-16">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t-4 border-primary/20 rounded-full"></div>
          </div>
          <div className="relative flex justify-center">
            <div className="bg-background px-6 py-2">
              <Play className="w-8 h-8 text-primary" />
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <section className="text-center">
          <Card className="bg-gradient-to-br from-primary/10 to-teal/10 border-2 border-primary/20 shadow-cozy">
            <CardHeader>
              <CardTitle className="font-heading text-3xl text-foreground mb-4">
                Ready to Start Your Journey?
              </CardTitle>
              <CardDescription className="text-lg">
                Join thousands of anime, manga, and light novel fans who are already tracking their adventures with us.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-cozy">
                <Link href="/dashboard">Join the Community</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-2 border-primary/30 hover:bg-primary/10">
                <Link href="/browse">Browse Series</Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-heading font-semibold text-lg mb-4">Mangoa</h3>
              <p className="text-muted-foreground text-sm">
                Your ultimate companion for tracking anime, manga, and light novels.
              </p>
            </div>
            <div>
              <h4 className="font-heading font-medium mb-4">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/browse" className="text-muted-foreground hover:text-foreground">Browse Series</Link></li>
                <li><Link href="/dashboard" className="text-muted-foreground hover:text-foreground">Dashboard</Link></li>
                <li><Link href="/contribute" className="text-muted-foreground hover:text-foreground">Contribute</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-heading font-medium mb-4">Community</h4>
              <ul className="space-y-2 text-sm">
                <li><span className="text-muted-foreground">Discord (Coming Soon)</span></li>
                <li><span className="text-muted-foreground">Forums (Coming Soon)</span></li>
                <li><span className="text-muted-foreground">Blog (Coming Soon)</span></li>
              </ul>
            </div>
            <div>
              <h4 className="font-heading font-medium mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/contact" className="text-muted-foreground hover:text-foreground">Contact Us</Link></li>
                <li><span className="text-muted-foreground">Help Center (Coming Soon)</span></li>
                <li><span className="text-muted-foreground">API Docs (Coming Soon)</span></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center">
            <p className="text-muted-foreground text-sm">
              © 2025 Mangoa. Built with john for the anime community.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}