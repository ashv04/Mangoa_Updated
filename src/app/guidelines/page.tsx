import Link from 'next/link'
import { Shield, Heart, Users, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function FanGuidelinesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[--color-bg-gradient-start] to-[--color-bg-gradient-end] py-12">
      <div className="container max-w-4xl mx-auto px-6">
        {/* Page Title with Manga Panel Border */}
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-200 to-pink-200 rounded-2xl transform rotate-1 opacity-20"></div>
          <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-8 border-4 border-purple-300 shadow-cozy">
            <div className="flex items-center gap-4 mb-4">
              <Shield className="w-8 h-8 text-purple-600" />
              <h1 className="font-heading text-4xl font-bold text-foreground">
                Fan Guidelines
              </h1>
            </div>
            <p className="text-lg text-muted-foreground font-medium">
              Building a welcoming community for all anime, manga, and novel fans! 
              These guidelines help us create a space where everyone can share their passion safely and respectfully.
            </p>
          </div>
        </div>

        {/* Guidelines Sections */}
        <div className="grid gap-8">
          {/* Community Standards */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-100 to-purple-100 rounded-2xl transform -rotate-1 opacity-40 group-hover:opacity-60 transition-opacity"></div>
            <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl p-8 border-2 border-purple-200 shadow-cozy hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <Users className="w-7 h-7 text-teal-600" />
                <h2 className="font-heading text-2xl font-semibold text-foreground">
                  Community Standards
                </h2>
              </div>
              <div className="space-y-4 text-foreground">
                <p className="text-base leading-relaxed">
                  Our community thrives on respect, kindness, and shared passion for Japanese media. We welcome fans of all experience levels and backgrounds.
                </p>
                <div className="bg-teal-soft rounded-lg p-4">
                  <h4 className="font-medium mb-2 text-foreground">Key Principles:</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Be respectful in discussions and reviews</li>
                    <li>• Welcome newcomers and help them discover great series</li>
                    <li>• Keep spoilers properly tagged and warned</li>
                    <li>• Celebrate diverse tastes and recommendations</li>
                  </ul>
                </div>
                {/* TODO: connect Supabase - fetch community standards from database */}
              </div>
            </div>
          </div>

          {/* Contribution Guidelines */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl transform rotate-1 opacity-40 group-hover:opacity-60 transition-opacity"></div>
            <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl p-8 border-2 border-purple-200 shadow-cozy hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <Star className="w-7 h-7 text-purple-600" />
                <h2 className="font-heading text-2xl font-semibold text-foreground">
                  Contribution Guidelines
                </h2>
              </div>
              <div className="space-y-4 text-foreground">
                <p className="text-base leading-relaxed">
                  Help us build the most comprehensive anime and manga database! Your contributions make our community stronger and more complete.
                </p>
                <div className="bg-purple-soft rounded-lg p-4">
                  <h4 className="font-medium mb-2 text-foreground">How to Contribute:</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Add missing series with accurate information</li>
                    <li>• Write thoughtful reviews and recommendations</li>
                    <li>• Update series status and release information</li>
                    <li>• Report errors or outdated content</li>
                  </ul>
                </div>
                {/* TODO: connect Supabase - fetch contribution guidelines and requirements */}
              </div>
            </div>
          </div>

          {/* Content Policy */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-2xl transform -rotate-1 opacity-40 group-hover:opacity-60 transition-opacity"></div>
            <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl p-8 border-2 border-purple-200 shadow-cozy hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <Shield className="w-7 h-7 text-orange-600" />
                <h2 className="font-heading text-2xl font-semibold text-foreground">
                  Content Policy
                </h2>
              </div>
              <div className="space-y-4 text-foreground">
                <p className="text-base leading-relaxed">
                  We maintain high standards for content quality while keeping our platform safe and enjoyable for all ages and backgrounds.
                </p>
                <div className="bg-peach rounded-lg p-4">
                  <h4 className="font-medium mb-2 text-foreground">Content Standards:</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Keep descriptions and reviews appropriate for all ages</li>
                    <li>• Use content warnings for mature themes</li>
                    <li>• Ensure accuracy in series information and metadata</li>
                    <li>• Respect copyright and use fair use guidelines</li>
                  </ul>
                </div>
                {/* TODO: connect Supabase - fetch detailed content policies and moderation rules */}
              </div>
            </div>
          </div>

          {/* Respect & Kindness */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl transform rotate-1 opacity-40 group-hover:opacity-60 transition-opacity"></div>
            <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl p-8 border-2 border-purple-200 shadow-cozy hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <Heart className="w-7 h-7 text-pink-600" />
                <h2 className="font-heading text-2xl font-semibold text-foreground">
                  Respect & Kindness
                </h2>
              </div>
              <div className="space-y-4 text-foreground">
                <p className="text-base leading-relaxed">
                  At the heart of our community is respect for each other. We believe every fan deserves to enjoy their hobbies in a supportive environment.
                </p>
                <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-4 border border-pink-200">
                  <h4 className="font-medium mb-2 text-foreground">Our Promise:</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Zero tolerance for harassment or discrimination</li>
                    <li>• Constructive feedback and helpful discussions</li>
                    <li>• Support for fans exploring new genres and series</li>
                    <li>• Creating lasting friendships through shared interests</li>
                  </ul>
                </div>
                {/* TODO: connect Supabase - fetch community values and enforcement policies */}
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-200 to-teal-200 rounded-2xl transform rotate-1 opacity-30"></div>
            <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-8 border-2 border-purple-300 shadow-cozy">
              <h3 className="font-heading text-2xl font-semibold text-foreground mb-4">
                Ready to Join Our Community? ✨
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Whether you're here to discover your next favorite series or share recommendations with fellow fans, 
                we're excited to have you as part of our growing community!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  asChild 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-2 rounded-xl font-medium transition-all duration-200 shadow-cozy hover:shadow-lg"
                >
                  <Link href="/contribute">
                    Start Contributing
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  asChild 
                  className="border-2 border-purple-300 text-foreground hover:bg-purple-50 px-8 py-2 rounded-xl font-medium transition-all duration-200"
                >
                  <Link href="/browse">
                    Browse Series
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}