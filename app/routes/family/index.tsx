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
import {
  FamilyChordTableFallback,
  FamilyChordCardFallback,
  FamilyControlsFallback,
} from "./components/family-fallbacks";
import { includeByQuery } from "./lib/family-utils";
import { lazyNamed } from "~/shared/lib/lazy";
import type { CadentialFilter, FamilyFilter } from "./types";

const FamilyControlsCard = lazyNamed(
  () => import("./components/family-controls-card"),
  "FamilyControlsCard",
);

const FamilyChordCard = lazyNamed(
  () => import("./components/family-chord-card"),
  "FamilyChordCard",
);

const FamilyChordTable = lazyNamed(
  () => import("./components/family-chord-table"),
  "FamilyChordTable",
);

export function meta(_: Route.MetaArgs) {
  return [
    { title: "NoteLogic | Harmonic Family Explorer" },
    {
      name: "description",
      content:
        "Explore harmonic family roles (Tonic, Subdominant, Dominant) in major/minor keys with progression and cadential context.",
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
  const view = (searchParams.get("view") ?? "cards") as "cards" | "table";

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

  const setView = (v: "cards" | "table") =>
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (v !== "cards") next.set("view", v);
      else next.delete("view");
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
      <Suspense
        key={`${entry.scaleType}-${entry.degree}-${entry.chord.name}`}
        fallback={<FamilyChordCardFallback />}
      >
        <FamilyChordCard entry={entry} />
      </Suspense>
    ));
  }, [filteredEntries]);

  return (
    <section className="w-full space-y-6 px-4 py-8 md:px-6 md:py-10">
      <FloatingFilterSidebar title="Family Filters">
        <Suspense fallback={<FamilyControlsFallback />}>
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
        </Suspense>
      </FloatingFilterSidebar>

      <div className="space-y-3 px-1">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Family Explorer</h1>
          <Badge variant="secondary">Harmonic Function</Badge>
        </div>
        <p className="text-muted-foreground text-sm">
          Pelajari fungsi harmonic family (Tonic, Subdominant, Dominant) di key
          mayor/minor, lengkap dengan resolution dan pola progression umum.
        </p>
        <div className="text-muted-foreground flex flex-wrap gap-2 text-xs">
          <Badge variant="outline">Total: {counts.total}</Badge>
          <Badge variant="tonic">Tonic: {counts.tonic}</Badge>
          <Badge variant="subdominant">Subdominant: {counts.subdominant}</Badge>
          <Badge variant="dominant">Dominant: {counts.dominant}</Badge>
          <Badge variant="outline">Showing: {counts.showing}</Badge>
        </div>
      </div>

      {filteredEntries.length === 0 ? (
        <div className="text-muted-foreground py-8 text-center text-sm">
          Tidak ada chord family untuk filter saat ini.
        </div>
      ) : null}

      {filteredEntries.length > 0 ? (
        <Tabs
          value={view}
          onValueChange={(value) => setView(value as "cards" | "table")}
        >
          <TabsList className="grid h-auto w-full grid-cols-2 gap-1 p-1 md:w-[320px]">
            <TabsTrigger value="cards">Cards View</TabsTrigger>
            <TabsTrigger value="table">Table View</TabsTrigger>
          </TabsList>

          <TabsContent value="cards" className="mt-4">
            <div className="grid gap-4">{familyCardElements}</div>
          </TabsContent>

          <TabsContent value="table" className="mt-4">
            <Suspense fallback={<FamilyChordTableFallback />}>
              <FamilyChordTable entries={filteredEntries} />
            </Suspense>
          </TabsContent>
        </Tabs>
      ) : null}
    </section>
  );
}
