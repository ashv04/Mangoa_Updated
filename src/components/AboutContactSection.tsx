"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Send, Hand, Contact, Frame, Group } from "lucide-react";
import { toast } from "sonner";

interface AboutContactSectionProps {
  view: "about" | "contact";
  className?: string;
}

export default function AboutContactSection({ view, className = "" }: AboutContactSectionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate submission delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success("Message sent — we'll get back soon!");
    
    // Clear form
    setFormData({ name: "", email: "", message: "" });
    setErrors({});
    setIsSubmitting(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  if (view === "about") {
    return (
      <div className={`space-y-8 ${className}`}>
        <div className="space-y-4">
          <h1 className="text-4xl font-heading font-bold text-center">About Us</h1>
          <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto">
            Building tools that make knowledge accessible, searchable, and meaningful for everyone.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hand className="h-5 w-5 text-primary" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                We believe that information should be easy to find, understand, and use. Our platform combines 
                powerful search capabilities with intuitive organization to help you discover connections and 
                insights in your data that you never knew existed.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Group className="h-5 w-5 text-primary" />
                Our Team
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                We're a passionate team of developers, designers, and researchers who care deeply about 
                creating tools that empower people. Every feature we build is designed with accessibility, 
                usability, and genuine user needs in mind.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Frame className="h-5 w-5 text-primary" />
                Open Source
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed mb-4">
                This project is open source and community-driven. We welcome contributions of all kinds, 
                from code improvements to documentation updates and feature suggestions.
              </p>
              <div className="space-y-2">
                <a 
                  href="#" 
                  className="inline-block text-primary hover:text-primary/80 transition-colors"
                >
                  View Repository →
                </a>
                <br />
                <a 
                  href="#" 
                  className="inline-block text-primary hover:text-primary/80 transition-colors"
                >
                  Contribution Guidelines →
                </a>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Contact className="h-5 w-5 text-primary" />
                Get Involved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Whether you're a developer, designer, writer, or just someone with great ideas, there's a 
                place for you in our community. Join us in building something amazing together.
              </p>
              <div className="space-y-2">
                <a 
                  href="#" 
                  className="inline-block text-primary hover:text-primary/80 transition-colors"
                >
                  Join Community →
                </a>
                <br />
                <a 
                  href="#" 
                  className="inline-block text-primary hover:text-primary/80 transition-colors"
                >
                  Report Issues →
                </a>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
            <CardDescription>
              Quick answers to common questions about our platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>How do I get started?</AccordionTrigger>
                <AccordionContent>
                  Simply create an account and start exploring. Our intuitive interface makes it easy to 
                  upload, organize, and search through your content. Check out our getting started guide 
                  for detailed instructions.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Is my data secure?</AccordionTrigger>
                <AccordionContent>
                  Yes, we take data security seriously. All data is encrypted in transit and at rest, 
                  and we follow industry best practices for data protection. You maintain full control 
                  over your content and can export or delete it at any time.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Can I collaborate with others?</AccordionTrigger>
                <AccordionContent>
                  Absolutely! Our platform supports team collaboration with granular permission controls. 
                  You can share specific collections, invite team members, and work together on organizing 
                  and analyzing your content.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>What file formats are supported?</AccordionTrigger>
                <AccordionContent>
                  We support a wide range of file formats including documents (PDF, DOC, TXT), 
                  spreadsheets (XLS, CSV), presentations (PPT), images, and many more. Our smart 
                  parsing technology can extract meaningful content from most common file types.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`space-y-8 ${className}`}>
      <div className="space-y-4">
        <h1 className="text-4xl font-heading font-bold text-center">Contact Us</h1>
        <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto">
          Have a question, suggestion, or just want to say hello? We'd love to hear from you.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5 text-primary" />
              Send us a message
            </CardTitle>
            <CardDescription>
              We typically respond within 24 hours during business days.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={errors.name ? "border-destructive" : ""}
                    disabled={isSubmitting}
                    aria-describedby={errors.name ? "name-error" : undefined}
                  />
                  {errors.name && (
                    <p id="name-error" className="text-sm text-destructive" role="alert">
                      {errors.name}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={errors.email ? "border-destructive" : ""}
                    disabled={isSubmitting}
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                  {errors.email && (
                    <p id="email-error" className="text-sm text-destructive" role="alert">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Tell us what's on your mind..."
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  className={`min-h-32 resize-none ${errors.message ? "border-destructive" : ""}`}
                  disabled={isSubmitting}
                  maxLength={1000}
                  aria-describedby={errors.message ? "message-error" : "message-counter"}
                />
                <div className="flex justify-between items-center">
                  {errors.message ? (
                    <p id="message-error" className="text-sm text-destructive" role="alert">
                      {errors.message}
                    </p>
                  ) : (
                    <div />
                  )}
                  <p id="message-counter" className="text-sm text-muted-foreground">
                    {formData.message.length}/1000
                  </p>
                </div>
              </div>

              <div aria-live="polite" className="sr-only">
                {Object.keys(errors).length > 0 && 
                  `Form has ${Object.keys(errors).length} error${Object.keys(errors).length === 1 ? '' : 's'}`
                }
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Sending...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    Send Message
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}