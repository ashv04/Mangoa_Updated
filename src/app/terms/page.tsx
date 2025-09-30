import React from 'react'
import { 
  Shield, 
  Users, 
  Heart, 
  Book, 
  Star, 
  MessageCircle, 
  UserCheck,
  Scale,
  Mail,
  Sparkles
} from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-gradient-start to-bg-gradient-end">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section */}
        <div className="relative mb-12">
          <div className="absolute -top-2 -left-2 w-8 h-8 border-l-4 border-t-4 border-primary rounded-tl-lg opacity-60"></div>
          <div className="absolute -top-2 -right-2 w-8 h-8 border-r-4 border-t-4 border-teal rounded-tr-lg opacity-60"></div>
          <div className="absolute -bottom-2 -left-2 w-8 h-8 border-l-4 border-b-4 border-teal rounded-bl-lg opacity-60"></div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 border-r-4 border-b-4 border-primary rounded-br-lg opacity-60"></div>
          
          <div className="bg-card/70 backdrop-blur-sm border-2 border-primary/30 rounded-lg p-8 shadow-cozy">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Scale className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
                Terms of Service
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Welcome to our anime and manga tracking community! These terms help us create 
                a safe, respectful space for all otaku to discover, track, and discuss their 
                favorite series together.
              </p>
              <div className="flex justify-center items-center gap-2 mt-4 text-sm text-muted-foreground">
                <Sparkles className="w-4 h-4 text-teal" />
                <span>Last updated: January 2024</span>
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
            </div>
          </div>
        </div>

        {/* Terms Sections */}
        <div className="space-y-8">
          {/* Acceptance of Terms */}
          <div className="relative">
            <div className="absolute -top-1 -left-1 w-6 h-6 border-l-2 border-t-2 border-primary/40 rounded-tl-md"></div>
            <div className="absolute -top-1 -right-1 w-6 h-6 border-r-2 border-t-2 border-teal/40 rounded-tr-md"></div>
            
            <div className="bg-card/60 backdrop-blur-sm border border-border rounded-lg p-6 shadow-cozy">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <UserCheck className="w-5 h-5 text-primary" />
                </div>
                <h2 className="font-heading text-2xl font-semibold text-foreground">
                  1. Acceptance of Terms
                </h2>
              </div>
              <div className="space-y-4 text-foreground/90">
                <p>
                  By creating an account or using our anime and manga tracking platform, 
                  you're joining our community and agreeing to these terms. We've designed 
                  this service specifically for anime and manga enthusiasts who want to 
                  track their progress, discover new series, and connect with fellow fans.
                </p>
                <p>
                  If you don't agree with any part of these terms, please don't use our 
                  service. We want everyone here to feel comfortable and respected!
                </p>
              </div>
            </div>
          </div>

          {/* User Accounts & Responsibilities */}
          <div className="relative">
            <div className="absolute -bottom-1 -left-1 w-6 h-6 border-l-2 border-b-2 border-teal/40 rounded-bl-md"></div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 border-r-2 border-b-2 border-primary/40 rounded-br-md"></div>
            
            <div className="bg-card/60 backdrop-blur-sm border border-border rounded-lg p-6 shadow-cozy">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-teal/10 p-2 rounded-lg">
                  <Users className="w-5 h-5 text-teal" />
                </div>
                <h2 className="font-heading text-2xl font-semibold text-foreground">
                  2. User Accounts & Responsibilities
                </h2>
              </div>
              <div className="space-y-4 text-foreground/90">
                <p className="font-medium text-primary">Account Security:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Keep your login credentials secure and don't share your account</li>
                  <li>You're responsible for all activity under your account</li>
                  <li>Notify us immediately if you suspect unauthorized access</li>
                </ul>
                
                <p className="font-medium text-primary">Your Content:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Reviews, ratings, and comments you post represent your own opinions</li>
                  <li>Keep discussions constructive and spoiler-free (or properly tagged)</li>
                  <li>Don't impersonate others or create fake accounts</li>
                  <li>You retain ownership of your original content, but grant us permission to display it</li>
                </ul>
                
                {/* TODO: Add Supabase user profile management integration */}
                <div className="bg-muted/30 border border-border/50 rounded p-3 text-sm">
                  <p className="text-muted-foreground">
                    💡 <strong>Community Tip:</strong> Use descriptive usernames and profile pictures 
                    to help other fans recognize and connect with you!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Community Guidelines */}
          <div className="relative">
            <div className="absolute -top-1 -left-1 w-6 h-6 border-l-2 border-t-2 border-teal/40 rounded-tl-md"></div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 border-r-2 border-b-2 border-primary/40 rounded-br-md"></div>
            
            <div className="bg-card/60 backdrop-blur-sm border border-border rounded-lg p-6 shadow-cozy">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-accent/50 p-2 rounded-lg">
                  <Heart className="w-5 h-5 text-accent-foreground" />
                </div>
                <h2 className="font-heading text-2xl font-semibold text-foreground">
                  3. Community Guidelines
                </h2>
              </div>
              <div className="space-y-4 text-foreground/90">
                <p>
                  Our community thrives on mutual respect and shared passion for anime and manga. 
                  Here's how we keep it awesome for everyone:
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-purple-soft/30 border border-primary/20 rounded-lg p-4">
                    <h3 className="font-heading font-semibold text-primary mb-2 flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      Respectful Discussions
                    </h3>
                    <ul className="text-sm space-y-1">
                      <li>• Be kind and respectful in all interactions</li>
                      <li>• No harassment, hate speech, or personal attacks</li>
                      <li>• Respect different opinions about series and characters</li>
                      <li>• Keep debates friendly and constructive</li>
                    </ul>
                  </div>
                  
                  <div className="bg-teal-soft/30 border border-teal/20 rounded-lg p-4">
                    <h3 className="font-heading font-semibold text-teal mb-2 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Spoiler Policies
                    </h3>
                    <ul className="text-sm space-y-1">
                      <li>• Use spoiler tags for plot reveals</li>
                      <li>• Clearly mark spoiler content in titles</li>
                      <li>• Respect those who are still catching up</li>
                      <li>• When in doubt, tag it as a spoiler</li>
                    </ul>
                  </div>
                </div>
                
                <p className="font-medium text-primary">Content Standards:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>No illegal content or copyright infringement</li>
                  <li>No spam, self-promotion without community value, or off-topic content</li>
                  <li>Keep NSFW discussions appropriate and properly tagged</li>
                  <li>Credit creators and sources when sharing fan art or content</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Content & Intellectual Property */}
          <div className="relative">
            <div className="absolute -top-1 -right-1 w-6 h-6 border-r-2 border-t-2 border-primary/40 rounded-tr-md"></div>
            <div className="absolute -bottom-1 -left-1 w-6 h-6 border-l-2 border-b-2 border-teal/40 rounded-bl-md"></div>
            
            <div className="bg-card/60 backdrop-blur-sm border border-border rounded-lg p-6 shadow-cozy">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Book className="w-5 h-5 text-primary" />
                </div>
                <h2 className="font-heading text-2xl font-semibold text-foreground">
                  4. Content & Intellectual Property
                </h2>
              </div>
              <div className="space-y-4 text-foreground/90">
                <p>
                  We deeply respect the creators, studios, and publishers who bring us the 
                  amazing anime and manga we all love. Here's how we handle content:
                </p>
                
                <p className="font-medium text-primary">Our Platform Content:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>We provide tracking tools, metadata, and community features</li>
                  <li>Cover images and basic series information are used under fair use for identification</li>
                  <li>We don't host or distribute copyrighted anime/manga content</li>
                  <li>All streaming/reading links direct to official, licensed platforms</li>
                </ul>
                
                <p className="font-medium text-primary">User Contributions:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Reviews, ratings, and comments are your original work</li>
                  <li>Don't post extensive quotes or detailed plot summaries</li>
                  <li>Fan art and screenshots should be properly credited</li>
                  <li>Report any copyright concerns to our team</li>
                </ul>
                
                {/* TODO: Add content reporting system integration */}
                <div className="bg-accent/20 border border-accent/30 rounded p-3 text-sm">
                  <p className="text-accent-foreground">
                    🎨 <strong>Support Creators:</strong> Always use official platforms to watch/read 
                    and consider supporting creators through merchandise and official releases!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Platform Usage */}
          <div className="relative">
            <div className="absolute -top-1 -left-1 w-6 h-6 border-l-2 border-t-2 border-primary/40 rounded-tl-md"></div>
            <div className="absolute -top-1 -right-1 w-6 h-6 border-r-2 border-t-2 border-teal/40 rounded-tr-md"></div>
            
            <div className="bg-card/60 backdrop-blur-sm border border-border rounded-lg p-6 shadow-cozy">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-teal/10 p-2 rounded-lg">
                  <Star className="w-5 h-5 text-teal" />
                </div>
                <h2 className="font-heading text-2xl font-semibold text-foreground">
                  5. Platform Usage
                </h2>
              </div>
              <div className="space-y-4 text-foreground/90">
                <p>
                  Our platform is designed to enhance your anime and manga experience. 
                  Here's how to use it properly:
                </p>
                
                <p className="font-medium text-primary">Tracking Features:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Keep your progress accurate and up-to-date</li>
                  <li>Use ratings and reviews to help other community members</li>
                  <li>Don't manipulate ratings or create fake reviews</li>
                  <li>Respect the privacy settings of other users</li>
                </ul>
                
                <p className="font-medium text-primary">Community Contributions:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Help improve series information and metadata</li>
                  <li>Submit corrections and updates when you spot errors</li>
                  <li>Participate in discussions and help newcomers</li>
                  <li>Report bugs and suggest improvements</li>
                </ul>
                
                <p className="font-medium text-primary">What's Not Allowed:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Automated scraping or bulk data extraction</li>
                  <li>Circumventing rate limits or security measures</li>
                  <li>Reverse engineering or copying our platform</li>
                  <li>Using the service for commercial purposes without permission</li>
                </ul>
                
                {/* TODO: Add API rate limiting and usage monitoring */}
              </div>
            </div>
          </div>

          {/* Limitations & Disclaimers */}
          <div className="relative">
            <div className="absolute -bottom-1 -left-1 w-6 h-6 border-l-2 border-b-2 border-primary/40 rounded-bl-md"></div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 border-r-2 border-b-2 border-teal/40 rounded-br-md"></div>
            
            <div className="bg-card/60 backdrop-blur-sm border border-border rounded-lg p-6 shadow-cozy">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <h2 className="font-heading text-2xl font-semibold text-foreground">
                  6. Limitations & Disclaimers
                </h2>
              </div>
              <div className="space-y-4 text-foreground/90">
                <p>
                  We work hard to provide the best experience, but like any service, 
                  there are some important things to keep in mind:
                </p>
                
                <div className="bg-muted/20 border border-border/50 rounded-lg p-4">
                  <p className="font-medium text-primary mb-2">Service Availability:</p>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>We strive for 99.9% uptime but can't guarantee uninterrupted service</li>
                    <li>Maintenance windows may temporarily limit functionality</li>
                    <li>We're not responsible for third-party service outages</li>
                  </ul>
                </div>
                
                <div className="bg-muted/20 border border-border/50 rounded-lg p-4">
                  <p className="font-medium text-primary mb-2">Data Accuracy:</p>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Series information is sourced from multiple databases and may contain errors</li>
                    <li>User-generated content reflects individual opinions, not our views</li>
                    <li>We make best efforts to keep information current but can't guarantee accuracy</li>
                  </ul>
                </div>
                
                <p className="text-sm text-muted-foreground italic">
                  Translation: We do our best, but anime/manga data is complex and constantly changing. 
                  If you spot an error, please let us know!
                </p>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="relative">
            <div className="absolute -top-2 -left-2 w-8 h-8 border-l-4 border-t-4 border-teal rounded-tl-lg opacity-60"></div>
            <div className="absolute -top-2 -right-2 w-8 h-8 border-r-4 border-t-4 border-primary rounded-tr-lg opacity-60"></div>
            <div className="absolute -bottom-2 -left-2 w-8 h-8 border-l-4 border-b-4 border-primary rounded-bl-lg opacity-60"></div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 border-r-4 border-b-4 border-teal rounded-br-lg opacity-60"></div>
            
            <div className="bg-card/70 backdrop-blur-sm border-2 border-teal/30 rounded-lg p-8 shadow-cozy">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-teal/10 p-3 rounded-full">
                    <Mail className="w-8 h-8 text-teal" />
                  </div>
                </div>
                <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">
                  Questions or Concerns?
                </h2>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  We're here to help! Whether you have questions about these terms, 
                  need to report an issue, or just want to chat about your favorite 
                  anime, don't hesitate to reach out.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MessageCircle className="w-4 h-4 text-primary" />
                    <span>Join our community discussions</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4 text-teal" />
                    <span>Email us at legal@mangoa.com</span>
                  </div>
                </div>
                
                {/* TODO: Add contact form integration */}
                <div className="mt-6 bg-accent/20 border border-accent/30 rounded-lg p-4">
                  <p className="text-accent-foreground text-sm">
                    🌸 <strong>Made with love by fellow otaku</strong> - We understand the community 
                    because we're part of it too! These terms exist to protect everyone while 
                    keeping our platform fun and welcoming.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center">
          <div className="bg-muted/30 border border-border/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">
              These terms may be updated occasionally to reflect new features or legal requirements. 
              We'll notify active users of any significant changes. By continuing to use our service 
              after updates, you accept the revised terms.
            </p>
            <div className="flex justify-center items-center gap-2 mt-2">
              <Heart className="w-4 h-4 text-destructive" />
              <span className="text-xs text-muted-foreground">
                Built for the anime community, by the anime community
              </span>
              <Heart className="w-4 h-4 text-destructive" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
