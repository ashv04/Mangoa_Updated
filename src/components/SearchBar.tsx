// src/components/SearchBar.tsx
"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Props = {
  placeholder?: string;
  initialValue?: string;
  focusResultsOnEnterId?: string;
  className?: string;
  debounceMs?: number;
};

export function SearchBar({
  placeholder = "Search…",
  initialValue = "",
  focusResultsOnEnterId,
  className,
  debounceMs = 350,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const urlParams = useSearchParams();

  // Local, authoritative value
  const [value, setValue] = React.useState(initialValue);
  const valueRef = React.useRef(value);
  valueRef.current = value;

  const [isComposing, setIsComposing] = React.useState(false);

  // ---- POPSTATE SYNC ONLY (back/forward) ----
  React.useEffect(() => {
    const onPop = () => {
      const params = new URLSearchParams(window.location.search);
      const q = params.get("q") ?? "";
      setValue(q);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // ---- DEBOUNCED URL PUSH (no URL -> state sync) ----
  React.useEffect(() => {
    if (isComposing) return;
    const t = setTimeout(() => {
      const params = new URLSearchParams(urlParams?.toString() ?? "");
      const v = valueRef.current.trim();
      if (v) params.set("q", v);
      else params.delete("q");

      const next = params.toString() ? `${pathname}?${params}` : pathname;
      router.replace(next, { scroll: false });
    }, debounceMs);

    return () => clearTimeout(t);
  }, [value, isComposing, pathname, router, debounceMs]);

  const flushNow = React.useCallback(() => {
    const params = new URLSearchParams(urlParams?.toString() ?? "");
    const v = valueRef.current.trim();
    if (v) params.set("q", v);
    else params.delete("q");
    const next = params.toString() ? `${pathname}?${params}` : pathname;
    router.replace(next, { scroll: false });
  }, [pathname, router, urlParams]);

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      flushNow();
      if (focusResultsOnEnterId) {
        requestAnimationFrame(() =>
          document.getElementById(focusResultsOnEnterId)?.focus()
        );
      }
    }
  };

  return (
    <div className={className}>
      <input
        type="search"
        className="w-full rounded-lg border px-3 py-2 text-sm outline-none bg-background shadow-sm focus:ring-2 focus:ring-primary/40"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={flushNow}               // also flush when leaving the field
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={() => setIsComposing(false)}
        aria-label="Search series"
        autoComplete="off"
        spellCheck={false}
      />
      {value ? (
        <button
          type="button"
          className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full text-muted-foreground hover:bg-muted"
          aria-label="Clear search"
          onClick={() => setValue("")}
        >
          ×
        </button>
      ) : null}
    </div>
  );
}
