"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, SortAsc } from "lucide-react";
import * as React from "react";

export type BrowseControlsProps = {
  current: {
    page: number;
    medium?: "anime" | "manga" | "light_novel";
    language?: string;
    sort: "new" | "alpha";
  };
};

function makeUrl(next: Partial<BrowseControlsProps["current"]>, sp: URLSearchParams) {
  const p = new URLSearchParams(sp);
  if (next.medium !== undefined) p.set("medium", next.medium);
  if (next.language !== undefined) p.set("language", next.language);
  if (next.sort !== undefined) p.set("sort", next.sort);
  if (next.page !== undefined) p.set("page", String(next.page));
  return `?${p.toString()}`;
}

export function BrowseControls({ current }: BrowseControlsProps) {
  const router = useRouter();
  const sp = useSearchParams();

  const onSortChange = (value: "new" | "alpha") => {
    const url = makeUrl({ sort: value, page: 1 }, sp);
    router.push(url);
  };

  const onMediumChange = (value: string) => {
    const medium = value === "all" ? undefined : value as "anime" | "manga" | "light_novel";
    const url = makeUrl({ medium, page: 1 }, sp);
    router.push(url);
  };

  const onLanguageChange = (value: string) => {
    const language = value === "all" ? undefined : value;
    const url = makeUrl({ language, page: 1 }, sp);
    router.push(url);
  };

  const selectValue = current.sort;

  return (
    <>
      {/* Desktop Controls */}
      <div className="hidden md:flex items-center gap-3">
        <Select value={current.medium || "all"} onValueChange={onMediumChange}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Medium" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Media</SelectItem>
            <SelectItem value="anime">Anime</SelectItem>
            <SelectItem value="manga">Manga</SelectItem>
            <SelectItem value="light_novel">Light Novel</SelectItem>
          </SelectContent>
        </Select>

        <Select value={current.language || "all"} onValueChange={onLanguageChange}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Languages</SelectItem>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="ja">Japanese</SelectItem>
            <SelectItem value="ko">Korean</SelectItem>
            <SelectItem value="zh">Chinese</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sort Control - Desktop */}
      <Select value={selectValue} onValueChange={onSortChange}>
        <SelectTrigger className="hidden md:flex w-36">
          <SortAsc className="w-4 h-4 mr-2" />
          <SelectValue placeholder="Sort" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="new">Newest</SelectItem>
          <SelectItem value="alpha">A–Z</SelectItem>
        </SelectContent>
      </Select>

      {/* Mobile Filter Drawer */}
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline" className="md:hidden" aria-label="Open filters">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </DrawerTrigger>
        <DrawerContent className="p-4">
          <DrawerHeader className="px-0">
            <DrawerTitle className="font-heading">Filters & Sort</DrawerTitle>
          </DrawerHeader>
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium mb-2">Medium</div>
              <Select value={current.medium || "all"} onValueChange={onMediumChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Medium" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Media</SelectItem>
                  <SelectItem value="anime">Anime</SelectItem>
                  <SelectItem value="manga">Manga</SelectItem>
                  <SelectItem value="light_novel">Light Novel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <div className="text-sm font-medium mb-2">Language</div>
              <Select value={current.language || "all"} onValueChange={onLanguageChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Languages</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ja">Japanese</SelectItem>
                  <SelectItem value="ko">Korean</SelectItem>
                  <SelectItem value="zh">Chinese</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <div className="text-sm font-medium mb-2">Sort</div>
              <Select value={selectValue} onValueChange={onSortChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">Newest</SelectItem>
                  <SelectItem value="alpha">A–Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default BrowseControls;