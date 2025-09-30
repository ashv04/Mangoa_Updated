"use client";

import { useState } from "react";
import { ChevronRight, ChevronLeft, Heart, Sparkles, Users, Star, BookOpen, Play, MessageSquare, Zap, Award, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function ContributeSection() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    sourceTitle: "",
    sourceFormat: "",
    targetTitle: "",
    targetFormat: "",
    mappingType: "",
    sourceChapter: "",
    targetEpisode: "",
    notes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSteps = 3;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      toast.success("Great! Keep going! ✨");
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Amazing! Your mapping has been submitted! 🎉 Fellow fans will love this!");
      
      // Reset form
      setCurrentStep(1);
      setFormData({
        sourceTitle: "",
        sourceFormat: "",
        targetTitle: "",
        targetFormat: "",
        mappingType: "",
        sourceChapter: "",
        targetEpisode: "",
        notes: ""
      });
    }, 2000);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-heading font-semibold text-foreground">Tell us about the source! 📚</h3>
              <p className="text-muted-foreground">What series are you mapping from?</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Series Title</label>
                <input
                  type="text"
                  placeholder="e.g., Attack on Titan, One Piece..."
                  value={formData.sourceTitle}
                  onChange={(e) => handleInputChange("sourceTitle", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border/50 bg-background/50 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Format</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { key: "manga", label: "Manga", icon: BookOpen, color: "primary" },
                    { key: "anime", label: "Anime", icon: Play, color: "teal" },
                    { key: "novel", label: "Light Novel", icon: MessageSquare, color: "chart-4" }
                  ].map(({ key, label, icon: Icon, color }) => (
                    <button
                      key={key}
                      onClick={() => handleInputChange("sourceFormat", key)}
                      className={`p-4 rounded-xl border transition-all duration-200 flex flex-col items-center gap-2 ${
                        formData.sourceFormat === key
                          ? `border-${color} bg-${color}/10 text-${color}`
                          : "border-border/50 hover:border-primary/30 text-muted-foreground hover:text-primary"
                      }`}
                    >
                      <Icon className="h-6 w-6" />
                      <span className="text-sm font-medium">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-heading font-semibold text-foreground">Where does it connect? 🔗</h3>
              <p className="text-muted-foreground">What format are you mapping TO?</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Target Series Title</label>
                <input
                  type="text"
                  placeholder="Same series, different format..."
                  value={formData.targetTitle}
                  onChange={(e) => handleInputChange("targetTitle", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border/50 bg-background/50 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Target Format</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { key: "manga", label: "Manga", icon: BookOpen, color: "primary" },
                    { key: "anime", label: "Anime", icon: Play, color: "teal" },
                    { key: "novel", label: "Light Novel", icon: MessageSquare, color: "chart-4" }
                  ].map(({ key, label, icon: Icon, color }) => (
                    <button
                      key={key}
                      onClick={() => handleInputChange("targetFormat", key)}
                      className={`p-4 rounded-xl border transition-all duration-200 flex flex-col items-center gap-2 ${
                        formData.targetFormat === key
                          ? `border-${color} bg-${color}/10 text-${color}`
                          : "border-border/50 hover:border-primary/30 text-muted-foreground hover:text-primary"
                      }`}
                    >
                      <Icon className="h-6 w-6" />
                      <span className="text-sm font-medium">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-heading font-semibold text-foreground">Add the details! ✨</h3>
              <p className="text-muted-foreground">Help fellow fans with specific mappings</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {formData.sourceFormat === "manga" ? "Chapter/Volume" : formData.sourceFormat === "anime" ? "Episode" : "Volume/Chapter"}
                </label>
                <input
                  type="text"
                  placeholder="e.g., Chapter 45, Episode 12..."
                  value={formData.sourceChapter}
                  onChange={(e) => handleInputChange("sourceChapter", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border/50 bg-background/50 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Maps to {formData.targetFormat === "manga" ? "Chapter/Volume" : formData.targetFormat === "anime" ? "Episode" : "Volume/Chapter"}
                </label>
                <input
                  type="text"
                  placeholder="e.g., Episode 24, Chapter 67..."
                  value={formData.targetEpisode}
                  onChange={(e) => handleInputChange("targetEpisode", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border/50 bg-background/50 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Additional Notes (Optional)</label>
              <textarea
                placeholder="Any extra info for fellow fans? Plot differences, pacing notes, etc..."
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-border/50 bg-background/50 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 resize-none"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
          <Heart className="h-4 w-4 fill-current" />
          Help Fellow Fans
        </div>
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
          Contribute a Mapping! 🎯
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Know a connection we're missing? Help our community discover more story connections!
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-6 text-center">
          <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-heading font-semibold text-foreground mb-1">1,247 Contributors</h3>
          <p className="text-sm text-muted-foreground">Amazing fans helping out!</p>
        </div>
        
        <div className="bg-gradient-to-br from-teal/10 to-teal/5 border border-teal/20 rounded-2xl p-6 text-center">
          <div className="w-12 h-12 bg-teal/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Zap className="h-6 w-6 text-teal" />
          </div>
          <h3 className="font-heading font-semibold text-foreground mb-1">8,932 Mappings</h3>
          <p className="text-sm text-muted-foreground">Connections discovered!</p>
        </div>
        
        <div className="bg-gradient-to-br from-chart-4/10 to-chart-4/5 border border-chart-4/20 rounded-2xl p-6 text-center">
          <div className="w-12 h-12 bg-chart-4/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Award className="h-6 w-6 text-chart-4" />
          </div>
          <h3 className="font-heading font-semibold text-foreground mb-1">542 Series</h3>
          <p className="text-sm text-muted-foreground">Stories connected!</p>
        </div>
      </div>

      {/* Contribution Form */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-card border border-border/30 rounded-3xl shadow-cozy overflow-hidden">
          {/* Progress Bar */}
          <div className="bg-gradient-to-r from-secondary/30 to-accent/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">Step {currentStep} of {totalSteps}</span>
              <span className="text-sm font-medium text-primary">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-border/30 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-primary to-teal h-2 rounded-full transition-all duration-500"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6 md:p-8">
            {renderStepContent()}
          </div>

          {/* Navigation */}
          <div className="bg-secondary/20 p-6 flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>

            {currentStep < totalSteps ? (
              <button
                onClick={handleNext}
                className="bg-primary text-primary-foreground px-6 py-3 rounded-xl hover:bg-primary/90 transition-all duration-200 font-medium flex items-center gap-2 hover:scale-105"
              >
                Next Step
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-primary to-teal text-white px-6 py-3 rounded-xl hover:from-primary/90 hover:to-teal/90 transition-all duration-200 font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-cozy hover:scale-105"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Submit Mapping!
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Recent Contributions */}
      <div className="bg-gradient-to-br from-secondary/20 to-accent/10 rounded-3xl p-6 md:p-8 border border-border/30">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-heading font-bold text-foreground mb-2 flex items-center justify-center gap-2">
            <Star className="h-6 w-6 text-primary" />
            Recent Community Contributions
          </h2>
          <p className="text-muted-foreground">Amazing work from fellow fans!</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { from: "Manga Ch. 139", to: "Anime Ep. 87", series: "Attack on Titan", user: "TitanFan2024", time: "2 hours ago" },
            { from: "LN Vol. 12", to: "Anime S3", series: "Overlord", user: "BonesDaddy", time: "5 hours ago" },
            { from: "Anime Ep. 44", to: "Manga Ch. 201", series: "Demon Slayer", user: "HashiraHunter", time: "1 day ago" },
            { from: "Manga Ch. 1000", to: "Anime Ep. 1015", series: "One Piece", user: "PirateKing", time: "2 days ago" },
            { from: "LN Vol. 8", to: "Manga Ch. 45", series: "Re:Zero", user: "SubaruStan", time: "3 days ago" },
            { from: "Anime S2", to: "LN Vol. 5", series: "Spy x Family", user: "SpyMaster", time: "1 week ago" }
          ].map((contrib, i) => (
            <div key={i} className="bg-card/50 border border-border/30 rounded-2xl p-4 space-y-3 hover:scale-105 transition-transform duration-200">
              <div className="flex items-center justify-between">
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">New!</span>
                <span className="text-xs text-muted-foreground">{contrib.time}</span>
              </div>
              <div className="space-y-2">
                <h4 className="font-heading font-semibold text-foreground text-sm">{contrib.series}</h4>
                <div className="flex items-center gap-2 text-xs">
                  <span className="bg-secondary/50 px-2 py-1 rounded-lg font-medium">{contrib.from}</span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  <span className="bg-accent/50 px-2 py-1 rounded-lg font-medium">{contrib.to}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="w-3 h-3 bg-gradient-to-br from-primary to-teal rounded-full"></div>
                  <span>by {contrib.user}</span>
                  <Heart className="h-3 w-3 text-red-400 fill-red-400" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}