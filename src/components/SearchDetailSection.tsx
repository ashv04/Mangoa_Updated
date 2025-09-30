"use client";

import { useState, useCallback } from "react";
import { Heart, Plus, Minus, ChevronRight, Clock, Users, Star, ArrowUpRight, Gauge, Tally4, FileJson, RefreshCcwDot, LoaderCircle, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

// Mock hooks - TODO: connect Supabase
const useSeries = (id: string) => {
  const [loading, setLoading] = useState(true);
  const [series, setSeries] = useState(null);
  const [userProgress, setUserProgress] = useState(null);

  // Simulate loading
  setTimeout(() => {
    setLoading(false);
    setSeries({
      id,
      title: "Attack on Titan",
      originalTitle: "Shingeki no Kyojin",
      coverUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop",
      formats: ["Manga", "Anime", "Light Novel"],
      studio: "Studio Pierrot",
      author: "Hajime Isayama",
      year: 2013,
      status: "Completed",
      isFavorited: false,
      isTracked: true
    });
    setUserProgress({
      manga: { current: 139, total: 139, lastUpdated: "2024-01-15" },
      anime: { current: 87, total: 87, lastUpdated: "2024-01-20" },
      lightNovel: { current: 0, total: 0, lastUpdated: null }
    });
  }, 1000);

  const toggleFavorite = useCallback(() => {
    setSeries(prev => prev ? { ...prev, isFavorited: !prev.isFavorited } : null);
    toast.success(series?.isFavorited ? "Removed from favorites" : "Added to favorites");
  }, [series?.isFavorited]);

  const toggleTracking = useCallback(() => {
    setSeries(prev => prev ? { ...prev, isTracked: !prev.isTracked } : null);
    toast.success(series?.isTracked ? "Stopped tracking" : "Started tracking");
  }, [series?.isTracked]);

  const updateProgress = useCallback((format: string, value: number) => {
    setUserProgress(prev => prev ? {
      ...prev,
      [format]: { ...prev[format], current: value, lastUpdated: new Date().toISOString().split('T')[0] }
    } : null);
    toast.success("Progress updated");
  }, []);

  return { loading, series, userProgress, toggleFavorite, toggleTracking, updateProgress };
};

const useMappings = (seriesId: string) => {
  const [loading, setLoading] = useState(true);
  const [mappings, setMappings] = useState([]);
  const [timeline, setTimeline] = useState([]);

  // Simulate loading
  setTimeout(() => {
    setLoading(false);
    setMappings([
      { id: 1, fromFormat: "Manga", fromNumber: 1, toFormat: "Anime", toNumber: 1, contributor: "user123", votes: 15 },
      { id: 2, fromFormat: "Manga", fromNumber: 5, toFormat: "Anime", toNumber: 3, contributor: "mapper456", votes: 8 },
      { id: 3, fromFormat: "Anime", fromNumber: 25, toFormat: "Manga", toNumber: 34, contributor: "converter789", votes: 12 }
    ]);
    setTimeline([
      { position: 10, formats: { manga: 5, anime: 3 }, alignment: "high" },
      { position: 30, formats: { manga: 15, anime: 8 }, alignment: "medium" },
      { position: 60, formats: { manga: 25, anime: 15 }, alignment: "high" },
      { position: 85, formats: { manga: 34, anime: 22 }, alignment: "low" }
    ]);
  }, 1200);

  const convert = useCallback((fromFormat: string, fromNumber: number, toFormat: string) => {
    // TODO: Implement conversion logic
    return { result: Math.floor(fromNumber * 0.7), confidence: "high" };
  }, []);

  const submitMapping = useCallback((mapping: any) => {
    // TODO: Submit to Supabase
    toast.success("Mapping submitted successfully");
  }, []);

  return { loading, mappings, timeline, convert, submitMapping };
};

interface SeriesDetailSectionProps {
  seriesId: string;
}

export default function SeriesDetailSection({ seriesId }: SeriesDetailSectionProps) {
  const { loading: seriesLoading, series, userProgress, toggleFavorite, toggleTracking, updateProgress } = useSeries(seriesId);
  const { loading: mappingsLoading, mappings, timeline, convert, submitMapping } = useMappings(seriesId);
  
  const [activeTab, setActiveTab] = useState("convert");
  const [showMappingModal, setShowMappingModal] = useState(false);
  const [conversionForm, setConversionForm] = useState({
    fromFormat: "",
    fromNumber: "",
    toFormat: "",
    result: null,
    converting: false
  });

  const handleConversion = useCallback(async () => {
    if (!conversionForm.fromFormat || !conversionForm.fromNumber || !conversionForm.toFormat) return;
    
    setConversionForm(prev => ({ ...prev, converting: true }));
    
    // Simulate API call
    setTimeout(() => {
      const result = convert(conversionForm.fromFormat, parseInt(conversionForm.fromNumber), conversionForm.toFormat);
      setConversionForm(prev => ({ ...prev, result, converting: false }));
    }, 800);
  }, [conversionForm.fromFormat, conversionForm.fromNumber, conversionForm.toFormat, convert]);

  const incrementProgress = useCallback((format: string) => {
    if (!userProgress?.[format]) return;
    const current = userProgress[format].current;
    const total = userProgress[format].total;
    if (current < total) {
      updateProgress(format, current + 1);
    }
  }, [userProgress, updateProgress]);

  const decrementProgress = useCallback((format: string) => {
    if (!userProgress?.[format]) return;
    const current = userProgress[format].current;
    if (current > 0) {
      updateProgress(format, current - 1);
    }
  }, [userProgress, updateProgress]);

  if (seriesLoading) {
    return (
      <div className="space-y-8">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row gap-6">
          <Skeleton className="w-48 h-64 rounded-lg flex-shrink-0" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-20" />
            </div>
            <Skeleton className="h-6 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-24" />
            </div>
          </div>
        </div>
        
        {/* Tabs Skeleton */}
        <div className="space-y-4">
          <div className="flex gap-4 border-b">
            {["Convert", "Timeline", "Mappings", "Progress"].map(tab => (
              <Skeleton key={tab} className="h-8 w-20" />
            ))}
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!series) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Series not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Series Header */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-shrink-0">
          <img 
            src={series.coverUrl} 
            alt={series.title}
            className="w-48 h-64 object-cover rounded-lg shadow-md"
          />
        </div>
        
        <div className="flex-1 space-y-4">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground">{series.title}</h1>
            <p className="text-lg text-muted-foreground">{series.originalTitle}</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {series.formats.map((format: string) => (
              <Badge key={format} variant="secondary" className="text-sm">
                {format}
              </Badge>
            ))}
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Studio:</span>
              <span className="ml-2 font-medium">{series.studio}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Author:</span>
              <span className="ml-2 font-medium">{series.author}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Year:</span>
              <span className="ml-2 font-medium">{series.year}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Status:</span>
              <span className="ml-2 font-medium">{series.status}</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={series.isFavorited ? "default" : "outline"}
              size="sm"
              onClick={toggleFavorite}
              className="gap-2"
            >
              <Heart className={`w-4 h-4 ${series.isFavorited ? "fill-current" : ""}`} />
              {series.isFavorited ? "Favorited" : "Favorite"}
            </Button>
            <Button
              variant={series.isTracked ? "default" : "outline"}
              size="sm"
              onClick={toggleTracking}
              className="gap-2"
            >
              <Gauge className="w-4 h-4" />
              {series.isTracked ? "Tracking" : "Track"}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="convert">Convert</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="mappings">Mappings</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
        </TabsList>

        {/* Convert Tab */}
        <TabsContent value="convert" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCcwDot className="w-5 h-5" />
                Format Converter
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div className="space-y-2">
                  <label className="text-sm font-medium">From Format</label>
                  <Select value={conversionForm.fromFormat} onValueChange={(value) => setConversionForm(prev => ({ ...prev, fromFormat: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manga">Manga</SelectItem>
                      <SelectItem value="anime">Anime</SelectItem>
                      <SelectItem value="lightnovel">Light Novel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Chapter/Episode</label>
                  <Input
                    type="number"
                    placeholder="Enter number"
                    value={conversionForm.fromNumber}
                    onChange={(e) => setConversionForm(prev => ({ ...prev, fromNumber: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">To Format</label>
                  <Select value={conversionForm.toFormat} onValueChange={(value) => setConversionForm(prev => ({ ...prev, toFormat: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manga">Manga</SelectItem>
                      <SelectItem value="anime">Anime</SelectItem>
                      <SelectItem value="lightnovel">Light Novel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button onClick={handleConversion} disabled={conversionForm.converting}>
                  {conversionForm.converting ? <LoaderCircle className="w-4 h-4 animate-spin" /> : "Convert"}
                </Button>
              </div>
              
              {conversionForm.result && (
                <Card className="bg-accent">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-lg font-semibold">
                        {conversionForm.fromFormat} {conversionForm.fromNumber} ≈ {conversionForm.toFormat} {conversionForm.result.result}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Confidence: {conversionForm.result.confidence}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              <Button variant="outline" onClick={() => setShowMappingModal(true)} className="w-full gap-2">
                <Plus className="w-4 h-4" />
                Create New Mapping
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tally4 className="w-5 h-5" />
                Cross-Format Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              {mappingsLoading ? (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <Skeleton key={i} className="h-16 w-16 rounded" />
                    ))}
                  </div>
                  <Skeleton className="h-4 w-full" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <div className="absolute top-8 left-0 right-0 h-0.5 bg-border"></div>
                    <div className="flex justify-between relative">
                      {timeline.map((point, index) => (
                        <div key={index} className="flex flex-col items-center space-y-2">
                          <div
                            className={`w-4 h-4 rounded-full border-2 bg-background ${
                              point.alignment === 'high' ? 'border-green-500' :
                              point.alignment === 'medium' ? 'border-yellow-500' :
                              'border-red-500'
                            }`}
                            style={{ left: `${point.position}%` }}
                          />
                          <div className="text-xs text-center space-y-1">
                            {Object.entries(point.formats).map(([format, num]) => (
                              <div key={format} className="text-muted-foreground">
                                {format}: {num}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full border-2 border-green-500"></div>
                      High confidence
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full border-2 border-yellow-500"></div>
                      Medium confidence
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full border-2 border-red-500"></div>
                      Low confidence
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Mappings Tab */}
        <TabsContent value="mappings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileJson className="w-5 h-5" />
                Community Mappings
              </CardTitle>
            </CardHeader>
            <CardContent>
              {mappingsLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-3">
                      <div className="flex items-center gap-4">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-8" />
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-8" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-8 w-12" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : mappings.length === 0 ? (
                <div className="text-center py-8 space-y-2">
                  <p className="text-muted-foreground">No mappings available yet</p>
                  <Button variant="outline" onClick={() => setShowMappingModal(true)}>
                    Be the first to contribute
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>From</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead>Contributor</TableHead>
                      <TableHead>Votes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mappings.map((mapping) => (
                      <TableRow key={mapping.id}>
                        <TableCell>
                          {mapping.fromFormat} {mapping.fromNumber}
                        </TableCell>
                        <TableCell>
                          {mapping.toFormat} {mapping.toNumber}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {mapping.contributor}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                              <ChevronUp className="w-3 h-3" />
                            </Button>
                            <span className="text-sm font-medium">{mapping.votes}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Progress Tab */}
        <TabsContent value="progress" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gauge className="w-5 h-5" />
                Your Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {!userProgress ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Start tracking to see your progress</p>
                </div>
              ) : (
                Object.entries(userProgress).map(([format, progress]) => (
                  <div key={format} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium capitalize">{format.replace('lightnovel', 'Light Novel')}</h3>
                      <span className="text-sm text-muted-foreground">
                        {progress.current} / {progress.total}
                      </span>
                    </div>
                    
                    <Progress value={(progress.current / progress.total) * 100} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => decrementProgress(format)}
                          disabled={progress.current === 0}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="text-sm font-medium min-w-16 text-center">
                          {progress.current}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => incrementProgress(format)}
                          disabled={progress.current === progress.total}
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                      
                      {progress.lastUpdated && (
                        <span className="text-xs text-muted-foreground">
                          Updated {progress.lastUpdated}
                        </span>
                      )}
                    </div>
                    
                    {progress.current === progress.total && (
                      <Badge variant="default" className="text-xs">
                        Completed
                      </Badge>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Mapping Modal */}
      <Dialog open={showMappingModal} onOpenChange={setShowMappingModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Mapping</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">From Format</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manga">Manga</SelectItem>
                    <SelectItem value="anime">Anime</SelectItem>
                    <SelectItem value="lightnovel">Light Novel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Number</label>
                <Input type="number" placeholder="Enter number" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">To Format</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manga">Manga</SelectItem>
                    <SelectItem value="anime">Anime</SelectItem>
                    <SelectItem value="lightnovel">Light Novel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Number</label>
                <Input type="number" placeholder="Enter number" />
              </div>
            </div>
            
            <Button onClick={() => { submitMapping({}); setShowMappingModal(false); }} className="w-full">
              Submit Mapping
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Right rail component for series progress
export function SeriesProgressRail({ seriesId }: { seriesId: string }) {
  const { loading, userProgress } = useSeries(seriesId);
  
  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-8 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (!userProgress) return null;
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(userProgress).map(([format, progress]) => (
            progress.current > 0 && (
              <div key={format} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm capitalize">{format.replace('lightnovel', 'LN')}</p>
                  <p className="text-xs text-muted-foreground">
                    {progress.current} / {progress.total}
                  </p>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {Math.round((progress.current / progress.total) * 100)}%
                </Badge>
              </div>
            )
          ))}
          
          <Separator />
          
          <Button size="sm" className="w-full gap-2">
            <ArrowUpRight className="w-3 h-3" />
            Continue Reading
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mx-auto">
              <Plus className="w-6 h-6 text-accent-foreground" />
            </div>
            <div>
              <h3 className="font-medium">Contribute</h3>
              <p className="text-sm text-muted-foreground">Help improve mappings</p>
            </div>
            <Button size="sm" variant="outline" className="w-full">
              Add Mapping
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}