"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  BookMarked,
  ChartBar,
  Disc3,
  ListVideo,
  SkipForward,
  GalleryVerticalEnd,
  Pin,
  PinOff,
  Trash2,
  LayoutDashboard,
} from "lucide-react";

type SeriesFormat = "anime" | "manga" | "light_novel";

interface User {
  id: string;
  displayName: string;
  email: string;
}

interface Stats {
  trackedSeries: number;
  mappingsContributed: number;
  hoursWatched: number;
  pinnedSeries?: number;
}

interface SeriesProgress {
  id: string;
  adaptationId: string;
  title: string;
  format: SeriesFormat;
  coverImage?: string | null;
  language?: string | null;
  totalUnits?: number | null;
  currentUnit: number;
  progressPercent: number;
  isPinned: boolean;
  franchiseSlug?: string | null;
  updatedAt?: string | null;
}

const UNIT_LABEL: Record<SeriesFormat, string> = {
  anime: "Episode",
  manga: "Chapter",
  light_novel: "Chapter",
};

const computePercent = (current: number, total?: number | null) =>
  total ? Math.min(100, Math.round((current / Math.max(total, 1)) * 100)) : 0;

const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/me/dashboard", { cache: "no-store" });
      if (!res.ok) {
        setUser(null);
        setStats(null);
        return;
      }
      const data = await res.json();
      setUser({
        id: data.user.id,
        displayName: data.user.displayName,
        email: data.user.email,
      });
      setStats(data.stats);
    } catch (err) {
      console.error("dashboard fetch failed", err);
      setUser(null);
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const signIn = () => {
    window.location.href = "/login?next=/dashboard";
  };

  return { user, stats, loading, signIn, refresh };
};

const useSeries = (onChanged?: () => void) => {
  const [series, setSeries] = useState<SeriesProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [supportsTracking, setSupportsTracking] = useState(true);
  const seriesRef = useRef<SeriesProgress[]>([]);

  const fetchSeries = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/me/series", { cache: "no-store" });
      if (res.status === 501) {
        setSupportsTracking(false);
        setSeries([]);
        seriesRef.current = [];
        return;
      }
      if (!res.ok) {
        if (res.status === 401) {
          setSeries([]);
          seriesRef.current = [];
        }
        return;
      }
      const data = await res.json();
      setSupportsTracking(true);
      const mapped: SeriesProgress[] = (data.series as any[]).map((item) => ({
        id: item.adaptationId,
        adaptationId: item.adaptationId,
        title: item.title,
        format: (item.format || "anime") as SeriesFormat,
        coverImage: item.coverImage ?? null,
        language: item.language ?? null,
        totalUnits: item.totalUnits ?? null,
        currentUnit: item.currentUnit ?? 0,
        progressPercent: computePercent(item.currentUnit ?? 0, item.totalUnits ?? null),
        isPinned: !!item.isPinned,
        franchiseSlug: item.franchiseSlug ?? null,
        updatedAt: item.updatedAt ?? null,
      }));
      setSeries(mapped);
      seriesRef.current = mapped;
    } catch (err) {
      console.error("series fetch failed", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSeries();
  }, [fetchSeries]);

  const patchSeries = useCallback(
    async (adaptationId: string, payload: Record<string, unknown>) => {
      const res = await fetch(`/api/me/series/${adaptationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.status === 501) {
        setSupportsTracking(false);
        throw new Error("tracking disabled");
      }
      if (!res.ok) {
        throw new Error(await res.text());
      }
      onChanged?.();
    },
    [onChanged]
  );

  const removeRemote = useCallback(
    async (adaptationId: string) => {
      const res = await fetch(`/api/me/series/${adaptationId}`, { method: "DELETE" });
      if (res.status === 501) {
        setSupportsTracking(false);
        throw new Error("tracking disabled");
      }
      if (!res.ok && res.status !== 404) {
        throw new Error(await res.text());
      }
      onChanged?.();
    },
    [onChanged]
  );

  const updateProgress = useCallback(
    async (adaptationId: string, newUnit: number) => {
      const snapshot = seriesRef.current.map((item) => ({ ...item }));
      const next = snapshot.map((item) =>
        item.id === adaptationId
          ? {
              ...item,
              currentUnit: newUnit,
              progressPercent: computePercent(newUnit, item.totalUnits ?? null),
            }
          : item
      );
      setSeries(next);
      seriesRef.current = next;
      try {
        await patchSeries(adaptationId, { currentUnit: newUnit });
        toast.success("progress updated");
      } catch (err) {
        console.error(err);
        setSeries(snapshot);
        seriesRef.current = snapshot;
        toast.error("could not update progress");
      }
    },
    [patchSeries]
  );

  const togglePin = useCallback(
    async (adaptationId: string, nextPinned: boolean) => {
      const snapshot = seriesRef.current.map((item) => ({ ...item }));
      const next = snapshot
        .map((item) =>
          item.id === adaptationId ? { ...item, isPinned: nextPinned } : item
        )
        .sort((a, b) => Number(b.isPinned) - Number(a.isPinned));
      setSeries(next);
      seriesRef.current = next;
      try {
        await patchSeries(adaptationId, { pinned: nextPinned });
        toast.success(nextPinned ? "pinned to dashboard" : "unpinned");
      } catch (err) {
        console.error(err);
        setSeries(snapshot);
        seriesRef.current = snapshot;
        toast.error("could not update pin");
      }
    },
    [patchSeries]
  );

  const removeSeries = useCallback(
    async (adaptationId: string) => {
      const snapshot = seriesRef.current.map((item) => ({ ...item }));
      const next = snapshot.filter((item) => item.id !== adaptationId);
      setSeries(next);
      seriesRef.current = next;
      try {
        await removeRemote(adaptationId);
        toast.success("removed from library");
      } catch (err) {
        console.error(err);
        setSeries(snapshot);
        seriesRef.current = snapshot;
        toast.error("could not remove series");
      }
    },
    [removeRemote]
  );

  return {
    series,
    loading,
    supportsTracking,
    updateProgress,
    togglePin,
    removeSeries,
    refresh: fetchSeries,
  };
};

const ContinueCard = ({ series }: { series: SeriesProgress }) => {
  const unitLabel = UNIT_LABEL[series.format] || "Episode";
  const totalLabel = series.totalUnits ? ` of ${series.totalUnits}` : "";
  const href = series.franchiseSlug ? `/series/${series.franchiseSlug}` : "#";

  return (
    <Link href={href}>
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
              {unitLabel} {series.currentUnit}
              {totalLabel}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

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
  currentUnit,
  onUpdate,
}: {
  currentUnit: number;
  onUpdate: (newUnit: number) => void;
}) => (
  <div className="flex items-center gap-1">
    <Button
      variant="ghost"
      size="sm"
      className="h-6 w-6 p-0"
      onClick={() => onUpdate(Math.max(0, currentUnit - 1))}
      disabled={currentUnit <= 0}
      aria-label="Decrease progress"
    >
      -
    </Button>
    <span className="text-xs font-mono min-w-[2rem] text-center">{currentUnit}</span>
    <Button
      variant="ghost"
      size="sm"
      className="h-6 w-6 p-0"
      onClick={() => onUpdate(currentUnit + 1)}
      aria-label="Increase progress"
    >
      +
    </Button>
  </div>
);

const SeriesRow = ({
  series,
  onUpdateProgress,
  onTogglePin,
  onRemove,
}: {
  series: SeriesProgress;
  onUpdateProgress: (seriesId: string, newUnit: number) => void;
  onTogglePin: (seriesId: string, nextPinned: boolean) => void;
  onRemove: (seriesId: string) => void;
}) => {
  const unitLabel = UNIT_LABEL[series.format] || "Episode";
  const href = series.franchiseSlug ? `/series/${series.franchiseSlug}` : "#";

  return (
    <div className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent/40 transition-colors">
      <div className="w-12 h-16 bg-muted rounded overflow-hidden flex-shrink-0">
        {series.coverImage ? (
          <img src={series.coverImage} alt={series.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <GalleryVerticalEnd className="h-4 w-4 text-muted-foreground" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Link href={href} className="font-medium truncate hover:underline">
            {series.title}
          </Link>
          <Badge variant="outline" className="text-xs capitalize">
            {series.format.replace("_", " ")}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          {unitLabel} {series.currentUnit}
          {series.totalUnits ? ` of ${series.totalUnits}` : ""}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Badge variant="secondary" className="text-xs">
          {series.progressPercent}%
        </Badge>
        <ProgressControls
          currentUnit={series.currentUnit}
          onUpdate={(value) => onUpdateProgress(series.id, value)}
        />
        <div className="flex items-center gap-1">
          <Button
            variant={series.isPinned ? "secondary" : "ghost"}
            size="sm"
            className="h-8"
            onClick={() => onTogglePin(series.id, !series.isPinned)}
          >
            {series.isPinned ? (
              <PinOff className="mr-1 h-3 w-3" />
            ) : (
              <Pin className="mr-1 h-3 w-3" />
            )}
            {series.isPinned ? "Unpin" : "Pin"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-destructive"
            onClick={() => onRemove(series.id)}
            aria-label="Remove from library"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({
  icon,
  title,
  value,
  loading,
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
        <div className="text-2xl font-bold">{(value ?? 0).toLocaleString()}</div>
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
  const { user, stats: dashboardStats, loading: authLoading, signIn, refresh: refreshStats } = useAuth();
  const {
    series,
    loading: seriesLoading,
    supportsTracking,
    updateProgress,
    togglePin,
    removeSeries,
  } = useSeries(refreshStats);

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

  if (!user) {
    return <UnauthenticatedState onSignIn={signIn} />;
  }

  const pinnedSeries = series.filter((s) => s.isPinned).slice(0, 4);
  const statsLoading = seriesLoading && !dashboardStats;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user.displayName || "friend"}!</h1>
        <p className="text-muted-foreground">
          ready to continue your anime and manga journey?
        </p>
      </div>

      {!supportsTracking && (
        <Alert className="bg-amber-50 border-amber-200 text-amber-900">
          <AlertTitle>tracking isn&apos;t enabled yet</AlertTitle>
          <AlertDescription>
            <p>
              add a <code>user_series</code> table in Supabase to store personal progress. once it exists, the dashboard will sync automatically.
            </p>
            <pre className="mt-2 rounded bg-amber-100/60 p-2 text-[11px] font-mono leading-4 overflow-x-auto">
{`create table if not exists public.user_series (
  user_id uuid references profiles(id) on delete cascade,
  adaptation_id uuid references adaptations(id) on delete cascade,
  current_unit integer default 0,
  total_units integer,
  pinned boolean default false,
  minutes_watched integer,
  updated_at timestamptz default now(),
  inserted_at timestamptz default now(),
  primary key (user_id, adaptation_id)
);`}
            </pre>
          </AlertDescription>
        </Alert>
      )}

      <section aria-labelledby="continue-heading">
        <h2 id="continue-heading" className="text-xl font-semibold mb-4 flex items-center gap-2">
          <SkipForward className="h-5 w-5" />
          Continue Watching
        </h2>

        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {seriesLoading ? (
            [...Array(4)].map((_, i) => <ContinueSkeleton key={i} />)
          ) : pinnedSeries.length > 0 ? (
            pinnedSeries.map((item) => <ContinueCard key={item.id} series={item} />)
          ) : (
            <div className="w-full text-center py-8 text-muted-foreground">
              <p>Pin some series to surface them here for quick access.</p>
            </div>
          )}
        </div>
      </section>

      <section aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="text-xl font-semibold mb-4 flex items-center gap-2">
          <ChartBar className="h-5 w-5" />
          Your Stats
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            icon={<ListVideo className="h-4 w-4" />}
            title="Series Tracked"
            value={dashboardStats?.trackedSeries ?? series.length}
            loading={statsLoading}
          />
          <StatCard
            icon={<BookMarked className="h-4 w-4" />}
            title="Mappings Contributed"
            value={dashboardStats?.mappingsContributed}
            loading={statsLoading}
          />
          <StatCard
            icon={<Disc3 className="h-4 w-4" />}
            title="Hours Watched"
            value={dashboardStats?.hoursWatched}
            loading={statsLoading}
          />
        </div>
      </section>

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
        ) : series.length > 0 ? (
          <div className="space-y-3" role="list" aria-label="Your tracked series">
            {series.map((item) => (
              <div key={item.id} role="listitem">
                <SeriesRow
                  series={item}
                  onUpdateProgress={updateProgress}
                  onTogglePin={togglePin}
                  onRemove={removeSeries}
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

