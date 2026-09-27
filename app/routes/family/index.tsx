import { Suspense, useMemo } from "react";
import { useSearchParams } from "react-router";
import type { Route } from "./+types";
import { generateFamilyChords, type ScaleType } from "~/theory-music/family";
import { Badge } from "~/templates/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/templates/components/ui/tabs";
import { FloatingFilterSidebar } from "~/routes/components/floating-filter-sidebar";
import { includeByQuery } from "./lib/family-utils";
import { FamilyControlsCard } from "./components/family-controls-card";
import { FamilyChordCard } from "./components/family-chord-card";
import { FamilyChordTable } from "./components/family-chord-table";
import { FamilyHarmonicMap } from "./components/family-harmonic-map";
import { FamilyProgressionPlayground } from "./components/family-progression-playground";
import { FamilySongKeyFinder } from "./components/family-song-key-finder";
import { FamilyHarmonicQuiz } from "./components/family-harmonic-quiz";
import type { CadentialFilter, FamilyFilter } from "./types";
import { Sparkles, Music2, Search, Brain, LayoutGrid, Table } from "lucide-react";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "NoteLogic | Family Learn" },
    {
      name: "description",
      content:
        "Pelajari harmoni, fungsi chord family (Tonic, Subdominant, Dominant), gubah progresi, dan kulik kunci lagu secara interaktif.",
    },
  ];
}

export default function FamilyRoute() {
  const [searchParams, setSearchParams] = useSearchParams();

  const scaleType = (searchParams.get("scale") ?? "major") as ScaleType;
  const root = searchParams.get("root") ?? "C";
  const query = searchParams.get("q") ?? "";
  const familyFilter = (searchParams.get("family") ?? "all") as FamilyFilter;
  const cadentialFilter = (searchParams.get("cadential") ??
    "all") as CadentialFilter;
  const activeTab = searchParams.get("tab") ?? "map";

  const setScaleType = (v: ScaleType) =>
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("scale", v);
      return next;
    });

  const setRoot = (v: string) =>
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("root", v);
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

  const setFamilyFilter = (v: FamilyFilter) =>
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (v !== "all") next.set("family", v);
      else next.delete("family");
      return next;
    });

  const setCadentialFilter = (v: CadentialFilter) =>
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (v !== "all") next.set("cadential", v);
      else next.delete("cadential");
      return next;
    });

  const setActiveTab = (v: string) =>
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (v !== "map") next.set("tab", v);
      else next.delete("tab");
      return next;
    });

  const familyEntries = useMemo(
    () => generateFamilyChords(root, scaleType, { spell: "auto" }),
    [root, scaleType],
  );

  const filteredEntries = useMemo(() => {
    return familyEntries.filter((entry) => {
      if (familyFilter !== "all" && entry.family !== familyFilter) return false;
      if (
        cadentialFilter !== "all" &&
        entry.cadentialStrength !== cadentialFilter
      ) {
        return false;
      }
      if (query.trim().length > 0 && !includeByQuery(entry, query.trim())) {
        return false;
      }
      return true;
    });
  }, [cadentialFilter, familyEntries, familyFilter, query]);

  const counts = useMemo(() => {
    const tonic = familyEntries.filter(
      (entry) => entry.family === "Tonic",
    ).length;
    const subdominant = familyEntries.filter(
      (entry) => entry.family === "Subdominant",
    ).length;
    const dominant = familyEntries.filter(
      (entry) => entry.family === "Dominant",
    ).length;

    return {
      total: familyEntries.length,
      tonic,
      subdominant,
      dominant,
      showing: filteredEntries.length,
    };
  }, [familyEntries, filteredEntries.length]);

  const familyCardElements = useMemo(() => {
    return filteredEntries.map((entry) => (
      <FamilyChordCard
        key={`${entry.scaleType}-${entry.degree}-${entry.chord.name}`}
        entry={entry}
      />
    ));
  }, [filteredEntries]);

  return (
    <section className="w-full space-y-6 px-4 py-8 md:px-6 md:py-10">
      <FloatingFilterSidebar title="Filter Family Learn">
        <FamilyControlsCard
          scaleType={scaleType}
          onScaleTypeChange={setScaleType}
          root={root}
          onRootChange={setRoot}
          query={query}
          onQueryChange={setQuery}
          familyFilter={familyFilter}
          onFamilyFilterChange={setFamilyFilter}
          cadentialFilter={cadentialFilter}
          onCadentialFilterChange={setCadentialFilter}
        />
      </FloatingFilterSidebar>

      {/* Title & Header */}
      <div className="space-y-3 px-1">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Family Learn</h1>
          <Badge variant="secondary">Interaktif Harmoni & Mengulik</Badge>
        </div>
        <p className="text-muted-foreground text-sm max-w-3xl leading-relaxed">
          Pelajari fungsi harmonic family (Tonic, Subdominant, Dominant) di key {root} {scaleType === "major" ? "Mayor" : "Minor"}. Rangkai progresi lagu, cari nada dasar saat mengulik lagu, dan latih pendengaranmu.
        </p>
        <div className="text-muted-foreground flex flex-wrap gap-2 text-xs">
          <Badge variant="outline">Total: {counts.total}</Badge>
          <Badge variant="tonic">Tonic: {counts.tonic}</Badge>
          <Badge variant="subdominant">Subdominant: {counts.subdominant}</Badge>
          <Badge variant="dominant">Dominant: {counts.dominant}</Badge>
          <Badge variant="outline font-bold">Key: {root} {scaleType}</Badge>
        </div>
      </div>

      {/* Main Interactive Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid h-auto w-full grid-cols-2 sm:grid-cols-5 gap-1 p-1">
          <TabsTrigger value="map" className="gap-1.5 text-xs py-2">
            <Sparkles className="size-3.5 text-primary" />
            <span>Peta Harmoni</span>
          </TabsTrigger>
          <TabsTrigger value="playground" className="gap-1.5 text-xs py-2">
            <Music2 className="size-3.5 text-emerald-500" />
            <span>Kulik Progresi</span>
          </TabsTrigger>
          <TabsTrigger value="keyfinder" className="gap-1.5 text-xs py-2">
            <Search className="size-3.5 text-cyan-500" />
            <span>Pengulik Lagu</span>
          </TabsTrigger>
          <TabsTrigger value="cards" className="gap-1.5 text-xs py-2">
            <LayoutGrid className="size-3.5" />
            <span>Daftar Cards</span>
          </TabsTrigger>
          <TabsTrigger value="quiz" className="gap-1.5 text-xs py-2">
            <Brain className="size-3.5 text-amber-500" />
            <span>Kuis & Ear Test</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Peta Harmoni */}
        <TabsContent value="map" className="mt-2">
          <FamilyHarmonicMap
            entries={familyEntries}
            root={root}
            scaleType={scaleType}
          />
        </TabsContent>

        {/* Tab 2: Kulik Progresi Scratchpad */}
        <TabsContent value="playground" className="mt-2">
          <FamilyProgressionPlayground
            entries={familyEntries}
            root={root}
            scaleType={scaleType}
          />
        </TabsContent>

        {/* Tab 3: Pengulik Lagu (Key Finder) */}
        <TabsContent value="keyfinder" className="mt-2">
          <FamilySongKeyFinder />
        </TabsContent>

        {/* Tab 4: Cards View & Table */}
        <TabsContent value="cards" className="mt-2 space-y-4">
          {filteredEntries.length === 0 ? (
            <div className="text-muted-foreground py-8 text-center text-sm">
              Tidak ada chord family untuk filter saat ini.
            </div>
          ) : (
            <div className="grid gap-4">{familyCardElements}</div>
          )}
        </TabsContent>

        {/* Tab 5: Kuis & Ear Test */}
        <TabsContent value="quiz" className="mt-2">
          <FamilyHarmonicQuiz
            entries={familyEntries}
            root={root}
            scaleType={scaleType}
          />
        </TabsContent>
      </Tabs>
    </section>
  );
}
