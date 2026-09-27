import { Suspense, useMemo } from "react";
import { useSearchParams } from "react-router";
import type { Route } from "./+types";
import { generateIntervals } from "~/theory-music/interval";
import { type SpellMode } from "~/theory-music/music";
import { Badge } from "~/templates/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/templates/components/ui/tabs";
import { FloatingFilterSidebar } from "~/routes/components/floating-filter-sidebar";
import { includeByQuery } from "./lib/interval-utils";
import { IntervalLearningCard } from "./components/interval-learning-card";
import { IntervalControlsCard as IntervalControls } from "./components/interval-controls-card";
import { IntervalItemTable } from "./components/interval-item-table";
import { IntervalHarmonicSpectrum } from "./components/interval-harmonic-spectrum";
import { IntervalComparator } from "./components/interval-comparator";
import { IntervalSongHookGuide } from "./components/interval-song-hook-guide";
import { IntervalEarTrainingQuiz } from "./components/interval-ear-training-quiz";
import type { FilterMode } from "./types";
import { Waves, Scale, Music, Brain, LayoutGrid } from "lucide-react";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "NoteLogic | Interval Learn" },
    {
      name: "description",
      content:
        "Pelajari jarak antar nada (interval), spektrum konsonansi, komparasi audio side-by-side, song mnemonics, dan ear training secara interaktif.",
    },
  ];
}

export default function IntervalRoute() {
  const [searchParams, setSearchParams] = useSearchParams();

  const root = searchParams.get("root") ?? "C";
  const spell = (searchParams.get("spell") ?? "auto") as SpellMode;
  const query = searchParams.get("q") ?? "";
  const filter = (searchParams.get("filter") ?? "all") as FilterMode;
  const activeTab = searchParams.get("tab") ?? "spectrum";

  const setRoot = (v: string) =>
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("root", v);
      return next;
    });

  const setSpell = (v: SpellMode) =>
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (v !== "auto") next.set("spell", v);
      else next.delete("spell");
      return next;
    });

  const setQuery = (q: string) =>
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (q) next.set("q", q);
        else next.delete("q");
        return next;
      },
      { replace: true },
    );

  const setFilter = (v: FilterMode) =>
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (v !== "all") next.set("filter", v);
      else next.delete("filter");
      return next;
    });

  const setActiveTab = (v: string) =>
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (v !== "spectrum") next.set("tab", v);
      else next.delete("tab");
      return next;
    });

  const intervals = useMemo(
    () => generateIntervals(root, { spell }),
    [root, spell],
  );

  const filteredIntervals = useMemo(() => {
    return intervals.filter((interval) => {
      if (filter !== "all" && interval.consonance !== filter) return false;
      if (query.trim() && !includeByQuery(interval, query.trim())) return false;
      return true;
    });
  }, [filter, intervals, query]);

  const counts = useMemo(() => {
    const total = intervals.length;
    const perfect = intervals.filter(
      (interval) => interval.consonance === "perfect-consonance",
    ).length;
    const imperfect = intervals.filter(
      (interval) => interval.consonance === "imperfect-consonance",
    ).length;
    const dissonance = intervals.filter(
      (interval) => interval.consonance === "dissonance",
    ).length;

    return { total, perfect, imperfect, dissonance };
  }, [intervals]);

  const intervalCardElements = useMemo(() => {
    return filteredIntervals.map((interval) => (
      <IntervalLearningCard
        key={`interval-learning-card-${interval.short}`}
        interval={interval}
      />
    ));
  }, [filteredIntervals]);

  return (
    <section className="w-full space-y-6 px-4 py-8 md:px-6 md:py-10">
      <FloatingFilterSidebar title="Filter Interval Learn">
        <IntervalControls
          root={root}
          onRootChange={setRoot}
          spell={spell}
          onSpellChange={setSpell}
          query={query}
          onQueryChange={setQuery}
          filter={filter}
          onFilterChange={setFilter}
        />
      </FloatingFilterSidebar>

      {/* Header */}
      <div className="space-y-3 px-1">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Interval Learn</h1>
          <Badge variant="secondary">Interaktif & Ear Training</Badge>
        </div>
        <p className="text-muted-foreground text-sm max-w-3xl leading-relaxed">
          Pahami jarak antar nada (interval) dari nada dasar {root}. Bandingkan konsonansi vs disonansi, dengarkan perbandingan suara, dan latih pendengaranmu dengan song mnemonics.
        </p>
        <div className="text-muted-foreground flex flex-wrap gap-2 text-xs">
          <Badge variant="outline">Total: {counts.total}</Badge>
          <Badge variant="outline">Perfect: {counts.perfect}</Badge>
          <Badge variant="outline">Imperfect: {counts.imperfect}</Badge>
          <Badge variant="outline" className="font-bold">Root Note: {root}</Badge>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid h-auto w-full grid-cols-2 sm:grid-cols-5 gap-1 p-1">
          <TabsTrigger value="spectrum" className="gap-1.5 text-xs py-2">
            <Waves className="size-3.5 text-cyan-500" />
            <span>Spektrum Konsonansi</span>
          </TabsTrigger>
          <TabsTrigger value="compare" className="gap-1.5 text-xs py-2">
            <Scale className="size-3.5 text-emerald-500" />
            <span>Komparator Side-by-Side</span>
          </TabsTrigger>
          <TabsTrigger value="songs" className="gap-1.5 text-xs py-2">
            <Music className="size-3.5 text-amber-500" />
            <span>Song Hooks & Mnemonics</span>
          </TabsTrigger>
          <TabsTrigger value="cards" className="gap-1.5 text-xs py-2">
            <LayoutGrid className="size-3.5" />
            <span>Daftar Cards</span>
          </TabsTrigger>
          <TabsTrigger value="quiz" className="gap-1.5 text-xs py-2">
            <Brain className="size-3.5 text-purple-500" />
            <span>Ear Training Test</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Spektrum Konsonansi */}
        <TabsContent value="spectrum" className="mt-2">
          <IntervalHarmonicSpectrum intervals={intervals} root={root} />
        </TabsContent>

        {/* Tab 2: Komparator Side-by-Side */}
        <TabsContent value="compare" className="mt-2">
          <IntervalComparator intervals={intervals} root={root} />
        </TabsContent>

        {/* Tab 3: Song Hooks & Mnemonics */}
        <TabsContent value="songs" className="mt-2">
          <IntervalSongHookGuide intervals={intervals} root={root} />
        </TabsContent>

        {/* Tab 4: Cards View & Table */}
        <TabsContent value="cards" className="mt-2 space-y-4">
          {filteredIntervals.length === 0 ? (
            <div className="text-muted-foreground py-8 text-center text-sm">
              Tidak ada interval untuk filter saat ini.
            </div>
          ) : (
            <div className="grid gap-4">{intervalCardElements}</div>
          )}
        </TabsContent>

        {/* Tab 5: Ear Training Quiz */}
        <TabsContent value="quiz" className="mt-2">
          <IntervalEarTrainingQuiz intervals={intervals} root={root} />
        </TabsContent>
      </Tabs>
    </section>
  );
}
