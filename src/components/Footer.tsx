"use client";

import Link from "next/link";
import { Heart, Github, Twitter, Mail, BookOpen, Sparkles, Star } from "lucide-react";
import { FOOTER_LINKS } from "@/config/nav";

export default function Footer() {
  return (
    <footer className="relative border-t border-border/30 bg-card/50 backdrop-blur-sm mt-20">
      {/* Manga-style top accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>
      
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section with Manga Style */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-teal rounded-xl flex items-center justify-center shadow-cozy">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <Star className="absolute -top-1 -right-1 w-3 h-3 text-accent-foreground animate-pulse" />
              </div>
              <span className="font-heading font-bold text-xl text-foreground">
                Mangoa
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Your ultimate companion for tracking anime, manga, and light novels. 
              <span className="text-primary font-medium"> Built by fans, for fans! ✨</span>
            </p>
            <div className="flex gap-3">
              <a 
                href="#" 
                className="w-8 h-8 bg-primary/10 hover:bg-primary/20 rounded-lg flex items-center justify-center text-primary hover:text-primary transition-all duration-200 transform hover:scale-110"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a 
                href="#" 
                className="w-8 h-8 bg-primary/10 hover:bg-primary/20 rounded-lg flex items-center justify-center text-primary hover:text-primary transition-all duration-200 transform hover:scale-110"
              >
                <Github className="w-4 h-4" />
              </a>
              <a 
                href="#" 
                className="w-8 h-8 bg-primary/10 hover:bg-primary/20 rounded-lg flex items-center justify-center text-primary hover:text-primary transition-all duration-200 transform hover:scale-110"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Dynamic Footer Links */}
          {FOOTER_LINKS.map((section) => (
            <div key={section.title} className="space-y-4">
              <div className="relative">
                <h4 className="font-heading font-semibold text-foreground mb-3 relative">
                  {section.title}
                  {/* Manga panel accent */}
                  <div className="absolute -bottom-1 left-0 w-8 h-0.5 bg-gradient-to-r from-primary to-teal rounded-full"></div>
                </h4>
              </div>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground text-sm transition-colors flex items-center gap-2 group"
                    >
                      {link.label}
                      {link.auth && (
                        <span className="w-1.5 h-1.5 bg-accent-foreground rounded-full animate-pulse"></span>
                      )}
                      <div className="w-0 h-px bg-primary group-hover:w-4 transition-all duration-200"></div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Manga-style divider */}
        <div className="relative mb-8">
          <div className="flex items-center justify-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary/40 rounded-full"></div>
              <Sparkles className="w-4 h-4 text-primary/60" />
              <div className="w-2 h-2 bg-teal/40 rounded-full"></div>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>© 2025 Mangoa. UI built with</span>
            <Heart className="w-4 h-4 text-destructive animate-pulse" />
            <span>by Mark.</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>

        {/* Fun community message */}
        <div className="mt-6 text-center">
          <div className="inline-block bg-gradient-to-r from-purple-soft/30 to-teal-soft/30 px-4 py-2 rounded-full border border-primary/20">
            <p className="text-xs text-muted-foreground font-medium">
              Join thousands of fans tracking their anime journey!
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}