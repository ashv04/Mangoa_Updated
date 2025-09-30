"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, MessageSquare, Send, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: connect Supabase for form submission
    // TODO: validate form data before submission
    // TODO: store contact form submissions in database
    
    toast.success("Message sent! We'll get back to you soon! ✨", {
      description: "Thanks for reaching out to our mangoa team!"
    });
    
    // Reset form
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: ""
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-soft/30 to-teal-soft/20">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="relative inline-block">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4 relative z-10">
              Get in Touch
            </h1>
            {/* Manga-style panel border */}
            <div className="absolute inset-0 border-4 border-primary/20 rounded-lg transform rotate-1 -z-10"></div>
            <div className="absolute inset-0 border-2 border-teal/30 rounded-lg transform -rotate-1 -z-20"></div>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Have a question, suggestion, or just want to chat about anime? 
            We'd love to hear from you! Our team is always excited to connect with fellow anime enthusiasts.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-card/80 backdrop-blur-sm rounded-2xl shadow-cozy border border-border/50 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <h2 className="font-heading text-2xl font-semibold">Send us a message</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Your Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="What should we call you?"
                      className="bg-input/50 border-border/50 focus:border-primary/50 transition-colors"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your.email@example.com"
                      className="bg-input/50 border-border/50 focus:border-primary/50 transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-sm font-medium">
                    Subject
                  </Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="What's this about?"
                    className="bg-input/50 border-border/50 focus:border-primary/50 transition-colors"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-sm font-medium">
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us what's on your mind... Favorite anime recommendations welcome! 🌸"
                    rows={6}
                    className="bg-input/50 border-border/50 focus:border-primary/50 transition-colors resize-none"
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 transition-all duration-200 hover:shadow-lg"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="bg-card/80 backdrop-blur-sm rounded-2xl shadow-cozy border border-border/50 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-teal/10 rounded-lg">
                  <Mail className="h-5 w-5 text-teal" />
                </div>
                <h3 className="font-heading text-lg font-semibold">Quick Contact</h3>
              </div>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>
                  For urgent matters or technical issues, you can also reach us directly at:
                </p>
                <div className="bg-muted/30 rounded-lg p-3 border border-border/30">
                  <p className="font-mono text-foreground">support@mangoa.dev</p>
                </div>
                <p className="text-xs">
                  We typically respond within 24 hours! 📧
                </p>
              </div>
            </div>

            {/* CTA Card */}
            <div className="bg-gradient-to-br from-primary/5 via-teal/5 to-accent/10 rounded-2xl shadow-cozy border border-border/50 p-6">
              <h3 className="font-heading text-lg font-semibold mb-3">
                New to our community?
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Discover amazing anime series and join thousands of other fans tracking their favorites!
              </p>
              <div className="space-y-2">
                <Link href="/browse">
                  <Button variant="outline" className="w-full justify-between group">
                    Browse Series
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button className="w-full justify-between group bg-primary/90 hover:bg-primary">
                    Join Community
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Decorative manga panel */}
            <div className="relative">
              <div className="bg-gradient-to-r from-peach/20 to-lavender/20 rounded-lg p-4 border-2 border-dashed border-primary/20">
                <p className="text-xs text-center text-muted-foreground font-medium">
                  "The best anime recommendations come from passionate fans!" ✨
                </p>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Bottom divider */}
        <div className="mt-16 pt-8 border-t border-border/30">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Thanks for being part of our anime-loving community! 🌸
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}