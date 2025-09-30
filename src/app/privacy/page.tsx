import React from 'react';
import { Shield, Eye, Settings, Users, Lock, Mail, BookOpen, Heart } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-soft/20 to-teal-soft/20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-purple-200/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Shield className="h-8 w-8 text-purple-600" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-teal-400 rounded-full border-2 border-white"></div>
            </div>
            <h1 className="text-2xl font-heading font-bold text-foreground">Privacy Policy</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Hero Section */}
        <div className="relative mb-12">
          <div className="absolute -top-4 -left-4 w-8 h-8">
            <div className="w-full h-full border-l-4 border-t-4 border-purple-300 rounded-tl-lg"></div>
          </div>
          <div className="absolute -top-4 -right-4 w-8 h-8">
            <div className="w-full h-full border-r-4 border-t-4 border-purple-300 rounded-tr-lg"></div>
          </div>
          <div className="absolute -bottom-4 -left-4 w-8 h-8">
            <div className="w-full h-full border-l-4 border-b-4 border-purple-300 rounded-bl-lg"></div>
          </div>
          <div className="absolute -bottom-4 -right-4 w-8 h-8">
            <div className="w-full h-full border-r-4 border-b-4 border-purple-300 rounded-br-lg"></div>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border-2 border-purple-200/50 shadow-cozy">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-gradient-to-br from-purple-100 to-teal-100 rounded-xl">
                <Heart className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <h2 className="text-3xl font-heading font-bold text-foreground mb-3">
                  Your Privacy Matters to Our Community
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  We're fellow anime and manga enthusiasts who understand the importance of keeping your reading journey private and secure. 
                  This policy explains how we protect your data while helping you discover amazing series and connect with other fans.
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-purple-600 bg-purple-50 px-4 py-2 rounded-lg">
              <BookOpen className="h-4 w-4" />
              <span>Last updated: January 2024</span>
            </div>
          </div>
        </div>

        {/* Information We Collect Section */}
        <div className="relative mb-8">
          <div className="absolute top-0 left-0 w-6 h-6 bg-gradient-to-br from-purple-300 to-teal-300 rounded-full opacity-30"></div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-purple-200/30 shadow-lg ml-3">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Eye className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-2xl font-heading font-semibold text-foreground">Information We Collect</h3>
            </div>
            
            <div className="space-y-6">
              <div className="border-l-4 border-purple-300 pl-6">
                <h4 className="font-semibold text-foreground mb-2">Account Information</h4>
                <p className="text-muted-foreground leading-relaxed">
                  When you create an account, we collect your email address, username, and profile preferences. 
                  This helps us personalize your experience and keep your reading lists secure.
                </p>
              </div>
              
              <div className="border-l-4 border-teal-300 pl-6">
                <h4 className="font-semibold text-foreground mb-2">Reading Progress & Preferences</h4>
                <p className="text-muted-foreground leading-relaxed">
                  We track your reading progress, favorite genres, ratings, and bookmarks to provide better recommendations 
                  and sync your data across devices. <span className="text-purple-600 font-medium">TODO: Integrate with Supabase user_profiles and reading_progress tables</span>
                </p>
              </div>
              
              <div className="border-l-4 border-orange-300 pl-6">
                <h4 className="font-semibold text-foreground mb-2">Community Interactions</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Your reviews, comments, and community contributions help build our vibrant anime and manga community. 
                  You control what's public and what stays private in your settings.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* How We Use Information Section */}
        <div className="relative mb-8">
          <div className="absolute top-0 right-0 w-6 h-6 bg-gradient-to-br from-teal-300 to-purple-300 rounded-full opacity-30"></div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-teal-200/30 shadow-lg mr-3">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-teal-100 rounded-lg">
                <Settings className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="text-2xl font-heading font-semibold text-foreground">How We Use Your Information</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-xl border border-purple-200/50">
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  Personalization
                </h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  We use your preferences and reading history to recommend series you'll love and customize your dashboard experience.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-teal-50 to-white p-6 rounded-xl border border-teal-200/50">
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                  Community Features
                </h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Your profile helps other fans find and connect with you, while your reviews contribute to our community-driven ratings.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-orange-50 to-white p-6 rounded-xl border border-orange-200/50">
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  Service Improvement
                </h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Anonymous usage data helps us improve features, fix bugs, and build tools that make your anime and manga journey better.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-pink-50 to-white p-6 rounded-xl border border-pink-200/50">
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                  Communication
                </h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  We'll notify you about new chapters, community updates, and important account information (you can control these preferences).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Data Protection Section */}
        <div className="relative mb-8">
          <div className="absolute top-0 left-0 w-6 h-6 bg-gradient-to-br from-green-300 to-purple-300 rounded-full opacity-30"></div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-green-200/30 shadow-lg ml-3">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-100 rounded-lg">
                <Lock className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-2xl font-heading font-semibold text-foreground">Data Protection & Sharing</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">We Never Sell Your Data</h4>
                  <p className="text-muted-foreground text-sm">Your personal information is never sold to third parties. Period.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Secure Storage</h4>
                  <p className="text-muted-foreground text-sm">
                    All data is encrypted and stored securely using industry-standard practices. 
                    <span className="text-purple-600 font-medium">TODO: Document Supabase Row Level Security policies</span>
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex-shrink-0 w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Limited Third-Party Access</h4>
                  <p className="text-muted-foreground text-sm">We only share data with trusted service providers who help us run the platform (hosting, analytics, email). They're bound by strict privacy agreements.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Rights Section */}
        <div className="relative mb-8">
          <div className="absolute top-0 right-0 w-6 h-6 bg-gradient-to-br from-orange-300 to-teal-300 rounded-full opacity-30"></div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-orange-200/30 shadow-lg mr-3">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-2xl font-heading font-semibold text-foreground">Your Rights & Controls</h3>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl border border-purple-200">
                <div className="w-12 h-12 mx-auto mb-3 bg-purple-200 rounded-full flex items-center justify-center">
                  <Eye className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">Access</h4>
                <p className="text-muted-foreground text-sm">View all data we have about you anytime in your account settings.</p>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-br from-teal-50 to-teal-100/50 rounded-xl border border-teal-200">
                <div className="w-12 h-12 mx-auto mb-3 bg-teal-200 rounded-full flex items-center justify-center">
                  <Settings className="h-6 w-6 text-teal-600" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">Control</h4>
                <p className="text-muted-foreground text-sm">Update, correct, or delete your information whenever you want.</p>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl border border-orange-200">
                <div className="w-12 h-12 mx-auto mb-3 bg-orange-200 rounded-full flex items-center justify-center">
                  <Shield className="h-6 w-6 text-orange-600" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">Portability</h4>
                <p className="text-muted-foreground text-sm">Export your reading lists and data to take with you if you leave.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Cookies Section */}
        <div className="relative mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-purple-200/30 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-2xl font-heading font-semibold text-foreground">Cookies & Tracking</h3>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-teal-50 p-6 rounded-xl border border-purple-200/50">
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use cookies to remember your login, preferences, and reading progress. Essential cookies keep the site working, 
                while optional analytics cookies help us improve the experience. You can control these in your browser settings.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-white text-purple-600 text-sm rounded-full border border-purple-200">Essential Cookies</span>
                <span className="px-3 py-1 bg-white text-teal-600 text-sm rounded-full border border-teal-200">Analytics (Optional)</span>
                <span className="px-3 py-1 bg-white text-orange-600 text-sm rounded-full border border-orange-200">Preferences</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="relative mb-12">
          <div className="absolute -top-4 -left-4 w-8 h-8">
            <div className="w-full h-full border-l-4 border-t-4 border-teal-300 rounded-tl-lg"></div>
          </div>
          <div className="absolute -top-4 -right-4 w-8 h-8">
            <div className="w-full h-full border-r-4 border-t-4 border-teal-300 rounded-tr-lg"></div>
          </div>
          <div className="absolute -bottom-4 -left-4 w-8 h-8">
            <div className="w-full h-full border-l-4 border-b-4 border-teal-300 rounded-bl-lg"></div>
          </div>
          <div className="absolute -bottom-4 -right-4 w-8 h-8">
            <div className="w-full h-full border-r-4 border-b-4 border-teal-300 rounded-br-lg"></div>
          </div>
          
          <div className="bg-gradient-to-r from-teal-50 to-purple-50 rounded-2xl p-8 border-2 border-teal-200/50 shadow-cozy">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-gradient-to-br from-teal-100 to-purple-100 rounded-2xl">
                  <Mail className="h-10 w-10 text-teal-600" />
                </div>
              </div>
              <h3 className="text-2xl font-heading font-bold text-foreground mb-4">Questions About Your Privacy?</h3>
              <p className="text-muted-foreground leading-relaxed mb-6 max-w-2xl mx-auto">
                We're here to help! If you have any questions about this privacy policy or how we handle your data, 
                don't hesitate to reach out to our friendly community team.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/contact" 
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-purple-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
                >
                  <Mail className="h-5 w-5" />
                  Contact Us
                </a>
                <a 
                  href="/settings" 
                  className="inline-flex items-center gap-2 bg-white text-purple-600 px-6 py-3 rounded-xl font-medium border-2 border-purple-200 hover:bg-purple-50 transition-colors duration-200"
                >
                  <Settings className="h-5 w-5" />
                  Privacy Settings
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="flex justify-center space-x-4 opacity-30">
          <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
          <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
          <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
          <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
          <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}