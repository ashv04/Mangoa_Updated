import { Search, BookOpen, Users, Star, MessageCircle, Settings, Heart, HelpCircle, ChevronRight, Sparkles, Coffee } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

export default function HelpPage() {
  const quickActions = [
    {
      icon: BookOpen,
      title: "Browse Series",
      description: "Discover new anime and manga to track",
      href: "/discover",
      color: "bg-purple-soft"
    },
    {
      icon: Users,
      title: "Join Community", 
      description: "Connect with other fans and share recommendations",
      href: "/contribute",
      color: "bg-teal-soft"
    },
    {
      icon: Star,
      title: "Rate & Review",
      description: "Share your thoughts on series you've watched",
      href: "/dashboard",
      color: "bg-peach"
    },
    {
      icon: Settings,
      title: "Customize Profile",
      description: "Set up your preferences and privacy settings", 
      href: "/settings",
      color: "bg-lavender"
    }
  ]

  const faqSections = [
    {
      title: "Getting Started",
      icon: Sparkles,
      questions: [
        {
          question: "How do I create an account?",
          answer: "Click the 'Sign Up' button in the header and fill out the registration form with your email, username, and password. You'll receive a confirmation email to activate your account."
        },
        {
          question: "What can I track on this platform?",
          answer: "You can track anime series, manga chapters, and light novels. Mark them as watching/reading, completed, on-hold, dropped, or plan to watch/read. Rate and review your favorites!"
        },
        {
          question: "Is this service free to use?",
          answer: "Yes! Our core tracking features are completely free. We're passionate fans building tools for the community. Optional premium features may be added in the future."
        },
        {
          question: "How do I find new series to watch?",
          answer: "Use our search page to browse by genre, year, studio, or rating. Check out trending series, seasonal anime, or get personalized recommendations based on your watching history."
        }
      ]
    },
    {
      title: "Tracking Progress",
      icon: BookOpen, 
      questions: [
        {
          question: "How do I mark episodes as watched?",
          answer: "Visit a series page and use the progress tracker. You can increment episode by episode, or jump to a specific episode number. Your progress syncs automatically across all your devices."
        },
        {
          question: "Can I track manga chapters?",
          answer: "Absolutely! Add manga to your list and track chapters just like anime episodes. We support both ongoing series and completed manga with full chapter counts."
        },
        {
          question: "What do the different status options mean?",
          answer: "Watching/Reading (currently following), Completed (finished the series), On-Hold (paused temporarily), Dropped (stopped watching), Plan to Watch/Read (added to your backlog)."
        },
        {
          question: "Can I import my list from other sites?",
          answer: "We're working on import tools for MyAnimeList, AniList, and other popular tracking sites. This feature will be available soon - stay tuned for updates!"
        }
      ]
    },
    {
      title: "Community Features", 
      icon: Users,
      questions: [
        {
          question: "How do reviews and ratings work?",
          answer: "Rate series from 1-10 stars and write detailed reviews to share with the community. Your ratings help generate personalized recommendations for other users."
        },
        {
          question: "Can I see what my friends are watching?",
          answer: "Yes! Add friends to see their currently watching lists, recent activities, and get recommendations based on shared tastes. Perfect for finding your next binge together."
        },
        {
          question: "How do I contribute series information?",
          answer: "Visit our contribute page to submit new series, update episode counts, add missing information, or suggest corrections. Community contributions keep our database accurate and up-to-date."
        },
        {
          question: "Are there discussion forums?",
          answer: "We're planning episode discussion threads, series reviews, and community forums. For now, you can share thoughts through reviews and connect with other fans through friend features."
        }
      ]
    },
    {
      title: "Troubleshooting",
      icon: HelpCircle,
      questions: [
        {
          question: "My progress isn't syncing properly",
          answer: "Try refreshing the page first. If issues persist, check your internet connection and try logging out and back in. Contact support if the problem continues."
        },
        {
          question: "I can't find a series I'm looking for",
          answer: "Our database is constantly growing! If a series is missing, you can suggest it through our contribute page. We prioritize adding popular and recently aired series first."
        },
        {
          question: "The site is running slowly",
          answer: "Clear your browser cache and cookies. If you're on mobile, try closing other apps to free up memory. We're constantly optimizing performance for better user experience."
        },
        {
          question: "How do I change my privacy settings?",
          answer: "Go to Settings and click on Privacy. You can control who sees your lists, reviews, and activity. Choose between public, friends-only, or private visibility for different aspects of your profile."
        }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-purple-soft/30">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-4 h-4 bg-primary/20 rounded-full animate-pulse" />
        <div className="absolute top-40 right-20 w-3 h-3 bg-teal/30 rounded-full animate-pulse delay-1000" />
        <div className="absolute bottom-40 left-1/4 w-2 h-2 bg-chart-3/40 rounded-full animate-pulse delay-2000" />
        <div className="absolute bottom-20 right-1/3 w-3 h-3 bg-primary/30 rounded-full animate-pulse delay-500" />
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
            <Heart className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Help Center</span>
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          
          <h1 className="font-heading text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-teal bg-clip-text text-transparent">
            How can we help you?
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Welcome to your anime & manga tracking companion! Whether you're a seasoned otaku or just getting started, 
            we're here to help you make the most of your journey through the world of Japanese media.
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Search help topics..."
              className="pl-10 bg-card/80 backdrop-blur border-primary/20 focus:border-primary/40 rounded-full"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="font-heading text-2xl font-semibold mb-2">Quick Actions</h2>
            <p className="text-muted-foreground">Get started with these common tasks</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Card key={index} className={`group hover:shadow-cozy transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-primary/20 ${action.color}/50 backdrop-blur-sm manga-panel`}>
                <CardHeader className="text-center pb-3">
                  <div className={`w-12 h-12 ${action.color} rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}>
                    <action.icon className="w-6 h-6 text-foreground" />
                  </div>
                  <CardTitle className="text-lg font-semibold">{action.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center pt-0">
                  <CardDescription className="text-sm mb-4">{action.description}</CardDescription>
                  <div className="flex items-center justify-center text-primary group-hover:translate-x-1 transition-transform duration-200">
                    <span className="text-sm font-medium">Get Started</span>
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ Sections */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-semibold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find answers to common questions about tracking your anime and manga journey
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {faqSections.map((section, sectionIndex) => (
              <Card key={sectionIndex} className="manga-panel border-2 border-primary/10 hover:border-primary/20 transition-colors duration-300 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <section.icon className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle className="text-xl font-semibold">{section.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible>
                    {section.questions.map((faq, faqIndex) => (
                      <AccordionItem key={faqIndex} value={`${sectionIndex}-${faqIndex}`} className="border-primary/10">
                        <AccordionTrigger className="text-left hover:text-primary transition-colors duration-200">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Contact Support */}
        <section>
          <Card className="manga-panel border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-teal/5 backdrop-blur-sm">
            <CardContent className="text-center py-12">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-8 h-8 text-primary" />
              </div>
              
              <h3 className="font-heading text-2xl font-semibold mb-4">Still need help?</h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Can't find what you're looking for? Our community and support team are here to help! 
                We're all passionate fans just like you.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-cozy">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contact Support
                </Button>
                <Button variant="outline" className="border-primary/20 hover:bg-primary/5">
                  <Users className="w-4 h-4 mr-2" />
                  Join Community Discord
                </Button>
              </div>

              <div className="mt-8 pt-6 border-t border-primary/20">
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Coffee className="w-4 h-4" />
                  <span>Built with love by anime fans, for anime fans</span>
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* TODO Comments for Database Integration */}
        {/* TODO: Connect help search to Supabase full-text search */}
        {/* TODO: Add help article views tracking */}
        {/* TODO: Implement user feedback system for help articles */}
        {/* TODO: Add dynamic FAQ based on user issues */}
        {/* TODO: Connect contact form to support ticket system */}
      </div>
    </div>
  )
}