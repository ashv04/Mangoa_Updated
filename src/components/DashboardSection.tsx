"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  LayoutDashboard, 
  BookMarked, 
  ChartBar, 
  ListVideo, 
  Disc3, 
  SkipForward,
  GalleryVerticalEnd
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

// Mock hook interfaces - TODO: connect Supabase
interface User {
  id: string;
  displayName: string;
  email: string;
}

interface SeriesProgress {
  id: string;
  title: string;
  format: 'anime' | 'manga';
  coverImage?: string;
  totalEpisodes?: number;
  currentEpisode: number;
  progressPercent: number;
  isPinned?: boolean;
}

interface Stats {
  trackedSeries: number;
  mappingsContributed: number;
  hoursWatched: number;
}

// Mock hooks - TODO: connect Supabase
const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock authentication check
    setTimeout(() => {
      // Simulate authenticated user
      setUser({
        id: '1',
        displayName: 'Alex Chen',
        email: 'alex@example.com'
      });
      setLoading(false);
    }, 1000);
  }, []);

  const signIn = () => {
    // TODO: Trigger header auth flow
    toast.success('Sign in triggered');
  };

  return { user, loading, signIn };
};

const useSeries = () => {
  const [series, setSeries] = useState<SeriesProgress[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data loading
    setTimeout(() => {
      setSeries([
        {
          id: '1',
          title: 'Attack on Titan',
          format: 'anime',
          coverImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=280&fit=crop',
          totalEpisodes: 87,
          currentEpisode: 45,
          progressPercent: 52,
          isPinned: true
        },
        {
          id: '2',
          title: 'One Piece',
          format: 'manga',
          coverImage: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=200&h=280&fit=crop',
          totalEpisodes: 1095,
          currentEpisode: 823,
          progressPercent: 75,
          isPinned: true
        },
        {
          id: '3',
          title: 'Demon Slayer',
          format: 'anime',
          coverImage: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=200&h=280&fit=crop',
          totalEpisodes: 44,
          currentEpisode: 22,
          progressPercent: 50,
          isPinned: true
        },
        {
          id: '4',
          title: 'My Hero Academia',
          format: 'anime',
          coverImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=280&fit=crop',
          totalEpisodes: 138,
          currentEpisode: 92,
          progressPercent: 67
        },
        {
          id: '5',
          title: 'Naruto',
          format: 'manga',
          coverImage: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=200&h=280&fit=crop',
          totalEpisodes: 720,
          currentEpisode: 245,
          progressPercent: 34
        }
      ]);
      setStats({
        trackedSeries: 12,
        mappingsContributed: 8,
        hoursWatched: 156
      });
      setLoading(false);
    }, 1200);
  }, []);

  const updateProgress = (seriesId: string, newEpisode: number) => {
    setSeries(prev => prev.map(s => {
      if (s.id === seriesId) {
        const progressPercent = s.totalEpisodes 
          ? Math.round((newEpisode / s.totalEpisodes) * 100)
          : 0;
        return { ...s, currentEpisode: newEpisode, progressPercent };
      }
      return s;
    }));
    toast.success('Progress updated');
  };

  return { series, stats, loading, updateProgress };
};

const ContinueCard = ({ series }: { series: SeriesProgress }) => (
  <Link href={`/series/${series.id}`}>
    <Card className="group cursor-pointer transition-all hover:shadow-md hover:scale-[1.02] w-48 flex-shrink-0">
      <CardContent className="p-0">
        <div className="relative aspect-[3/4] overflow-hidden rounded-t-lg">
          {series.coverImage ? (
            <img 
              src={series.coverImage}
              alt={series.title}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <GalleryVerticalEnd className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
          <div className="absolute bottom-2 left-2">
            <Badge variant="secondary" className="text-xs">
              {series.progressPercent}%
            </Badge>
          </div>
        </div>
        <div className="p-3">
          <h4 className="font-medium text-sm line-clamp-2 mb-1">{series.title}</h4>
          <p className="text-xs text-muted-foreground">
            Episode {series.currentEpisode}
            {series.totalEpisodes && ` of ${series.totalEpisodes}`}
          </p>
        </div>
      </CardContent>
    </Card>
  </Link>
);

const ContinueSkeleton = () => (
  <Card className="w-48 flex-shrink-0">
    <CardContent className="p-0">
      <Skeleton className="aspect-[3/4] rounded-t-lg" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </CardContent>
  </Card>
);

const ProgressControls = ({ 
  currentEpisode, 
  onUpdate 
}: { 
  currentEpisode: number;
  onUpdate: (newEpisode: number) => void;
}) => (
  <div className="flex items-center gap-1">
    <Button
      variant="ghost"
      size="sm"
      className="h-6 w-6 p-0"
      onClick={() => onUpdate(Math.max(0, currentEpisode - 1))}
      disabled={currentEpisode <= 0}
      aria-label="Decrease episode"
    >
      -
    </Button>
    <span className="text-xs font-mono min-w-[2rem] text-center">
      {currentEpisode}
    </span>
    <Button
      variant="ghost"
      size="sm"
      className="h-6 w-6 p-0"
      onClick={() => onUpdate(currentEpisode + 1)}
      aria-label="Increase episode"
    >
      +
    </Button>
  </div>
);

const SeriesRow = ({ series, onUpdateProgress }: { 
  series: SeriesProgress;
  onUpdateProgress: (seriesId: string, newEpisode: number) => void;
}) => (
  <div className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
    <div className="w-12 h-16 bg-muted rounded overflow-hidden flex-shrink-0">
      {series.coverImage ? (
        <img 
          src={series.coverImage}
          alt={series.title}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <GalleryVerticalEnd className="h-4 w-4 text-muted-foreground" />
        </div>
      )}
    </div>
    
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-1">
        <Link 
          href={`/series/${series.id}`}
          className="font-medium truncate hover:underline"
        >
          {series.title}
        </Link>
        <Badge variant="outline" className="text-xs">
          {series.format}
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground">
        Episode {series.currentEpisode}
        {series.totalEpisodes && ` of ${series.totalEpisodes}`}
      </p>
    </div>

    <div className="flex items-center gap-3">
      <Badge variant="secondary" className="text-xs">
        {series.progressPercent}%
      </Badge>
      <ProgressControls
        currentEpisode={series.currentEpisode}
        onUpdate={(newEpisode) => onUpdateProgress(series.id, newEpisode)}
      />
    </div>
  </div>
);

const StatCard = ({ 
  icon, 
  title, 
  value, 
  loading 
}: { 
  icon: React.ReactNode;
  title: string;
  value?: number;
  loading: boolean;
}) => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium flex items-center gap-2">
        {icon}
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="pt-0">
      {loading ? (
        <Skeleton className="h-8 w-16" />
      ) : (
        <div className="text-2xl font-bold">{value?.toLocaleString()}</div>
      )}
    </CardContent>
  </Card>
);

const EmptyState = () => (
  <div className="text-center py-12">
    <div className="mb-6">
      <div className="w-24 h-24 bg-muted rounded-full mx-auto flex items-center justify-center mb-4">
        <BookMarked className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">Start Your Collection</h3>
      <p className="text-muted-foreground max-w-md mx-auto">
        Begin tracking your favorite anime and manga series. Search for titles or contribute new mappings to get started.
      </p>
    </div>
    <div className="flex flex-col sm:flex-row gap-3 justify-center">
      <Button asChild>
        <Link href="/browse">Search Series</Link>
      </Button>
      <Button variant="outline" asChild>
        <Link href="/contribute">Contribute Mappings</Link>
      </Button>
    </div>
  </div>
);

const UnauthenticatedState = ({ onSignIn }: { onSignIn: () => void }) => (
  <div className="text-center py-12">
    <div className="mb-6">
      <div className="w-24 h-24 bg-muted rounded-full mx-auto flex items-center justify-center mb-4">
        <LayoutDashboard className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">Welcome to Your Dashboard</h3>
      <p className="text-muted-foreground max-w-md mx-auto mb-6">
        Sign in to track your progress across anime and manga series, contribute mappings, and access your personalized dashboard.
      </p>
    </div>
    <Button onClick={onSignIn} size="lg">
      Sign In to Continue
    </Button>
  </div>
);

export default function DashboardSection() {
  const { user, loading: authLoading, signIn } = useAuth();
  const { series, stats, loading: seriesLoading, updateProgress } = useSeries();

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="space-y-8">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-6 w-32" />
          <div className="flex gap-4 overflow-hidden">
            {[...Array(4)].map((_, i) => (
              <ContinueSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show unauthenticated state if no user
  if (!user) {
    return <UnauthenticatedState onSignIn={signIn} />;
  }

  const pinnedSeries = series.filter(s => s.isPinned).slice(0, 4);
  const allSeries = series;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user.displayName}! 👋
        </h1>
        <p className="text-muted-foreground">
          Ready to continue your anime and manga journey?
        </p>
      </div>

      {/* Continue Section */}
      <section aria-labelledby="continue-heading">
        <h2 id="continue-heading" className="text-xl font-semibold mb-4 flex items-center gap-2">
          <SkipForward className="h-5 w-5" />
          Continue Watching
        </h2>
        
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {seriesLoading ? (
            [...Array(4)].map((_, i) => <ContinueSkeleton key={i} />)
          ) : pinnedSeries.length > 0 ? (
            pinnedSeries.map(series => (
              <ContinueCard key={series.id} series={series} />
            ))
          ) : (
            <div className="w-full text-center py-8 text-muted-foreground">
              <p>Pin some series to see them here for quick access</p>
            </div>
          )}
        </div>
      </section>

      {/* Stats Cards */}
      <section aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="text-xl font-semibold mb-4 flex items-center gap-2">
          <ChartBar className="h-5 w-5" />
          Your Stats
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            icon={<ListVideo className="h-4 w-4" />}
            title="Series Tracked"
            value={stats?.trackedSeries}
            loading={seriesLoading}
          />
          <StatCard
            icon={<BookMarked className="h-4 w-4" />}
            title="Mappings Contributed"
            value={stats?.mappingsContributed}
            loading={seriesLoading}
          />
          <StatCard
            icon={<Disc3 className="h-4 w-4" />}
            title="Hours Watched"
            value={stats?.hoursWatched}
            loading={seriesLoading}
          />
        </div>
      </section>

      {/* My Library */}
      <section aria-labelledby="library-heading">
        <h2 id="library-heading" className="text-xl font-semibold mb-4 flex items-center gap-2">
          <BookMarked className="h-5 w-5" />
          My Library
        </h2>
        
        {seriesLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-lg" />
            ))}
          </div>
        ) : allSeries.length > 0 ? (
          <div className="space-y-3" role="list" aria-label="Your tracked series">
            {allSeries.map(series => (
              <div key={series.id} role="listitem">
                <SeriesRow 
                  series={series} 
                  onUpdateProgress={updateProgress}
                />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </section>
    </div>
  );
}