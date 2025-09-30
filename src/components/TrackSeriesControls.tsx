"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Check, Pin, PinOff } from "lucide-react";

type SeriesFormat = "anime" | "manga" | "light_novel";

interface TrackSeriesControlsProps {
  adaptationId: string;
  title: string;
  format: SeriesFormat;
  totalUnits?: number | null;
}

type Status =
  | "loading"
  | "tracked"
  | "untracked"
  | "unauthenticated"
  | "unsupported"
  | "error";

export function TrackSeriesControls({
  adaptationId,
  title,
  format,
  totalUnits,
}: TrackSeriesControlsProps) {
  const [status, setStatus] = useState<Status>("loading");
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch(`/api/me/series/${adaptationId}`, { cache: "no-store" });
        if (!active) return;
        if (res.status === 401) {
          setStatus("unauthenticated");
          return;
        }
        if (res.status === 404) {
          setStatus("untracked");
          return;
        }
        if (res.status === 501) {
          setStatus("unsupported");
          return;
        }
        if (!res.ok) {
          setStatus("error");
          return;
        }
        const data = await res.json();
        setPinned(!!data.series?.pinned);
        setStatus("tracked");
      } catch (err) {
        console.error(err);
        if (active) setStatus("error");
      }
    })();
    return () => {
      active = false;
    };
  }, [adaptationId]);

  const track = useCallback(async () => {
    try {
      const res = await fetch("/api/me/series", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adaptationId, totalUnits }),
      });
      if (res.status === 501) {
        setStatus("unsupported");
        return;
      }
      if (!res.ok) {
        throw new Error(await res.text());
      }
      setStatus("tracked");
      setPinned(false);
      toast.success(`Now tracking ${title}`);
    } catch (err) {
      console.error(err);
      toast.error("could not start tracking");
    }
  }, [adaptationId, title, totalUnits]);

  const untrack = useCallback(async () => {
    try {
      const res = await fetch(`/api/me/series/${adaptationId}`, { method: "DELETE" });
      if (res.status === 501) {
        setStatus("unsupported");
        return;
      }
      if (!res.ok && res.status !== 404) {
        throw new Error(await res.text());
      }
      setStatus("untracked");
      setPinned(false);
      toast.success(`Stopped tracking ${title}`);
    } catch (err) {
      console.error(err);
      toast.error("could not stop tracking");
    }
  }, [adaptationId, title]);

  const togglePin = useCallback(async () => {
    const nextPinned = !pinned;
    setPinned(nextPinned);
    try {
      const res = await fetch(`/api/me/series/${adaptationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pinned: nextPinned }),
      });
      if (res.status === 501) {
        setStatus("unsupported");
        return;
      }
      if (!res.ok) {
        throw new Error(await res.text());
      }
      toast.success(nextPinned ? "pinned to dashboard" : "unpinned");
    } catch (err) {
      console.error(err);
      setPinned(!nextPinned);
      toast.error("could not update pin");
    }
  }, [adaptationId, pinned]);

  if (status === "unsupported") {
    return (
      <p className="text-sm text-muted-foreground">
        tracking isn&apos;t enabled yet.
      </p>
    );
  }

  if (status === "unauthenticated") {
    return (
      <Button size="sm" asChild>
        <Link href="/login?next=/dashboard">Sign in to track</Link>
      </Button>
    );
  }

  if (status === "error") {
    return (
      <Button size="sm" variant="outline" onClick={track}>
        Retry tracking
      </Button>
    );
  }

  if (status === "tracked") {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" variant="secondary" disabled>
          <Check className="mr-1 h-3 w-3" /> Tracking
        </Button>
        <Button size="sm" variant="ghost" onClick={togglePin}>
          {pinned ? (
            <>
              <PinOff className="mr-1 h-3 w-3" /> Unpin
            </>
          ) : (
            <>
              <Pin className="mr-1 h-3 w-3" /> Pin
            </>
          )}
        </Button>
        <Button size="sm" variant="outline" onClick={untrack}>
          Stop tracking
        </Button>
      </div>
    );
  }

  return (
    <Button size="sm" onClick={track} disabled={status === "loading"}>
      Track this {format.replace("_", " ")}
    </Button>
  );
}

