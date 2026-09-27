import { Suspense, useMemo } from "react";
import { useSearchParams } from "react-router";
import type { Route } from "./+types";
import {
  IntervalControlsFallback,
  IntervalItemTableFallback,
  IntervalLearningCardFallback,
} from "./components/interval-fallbacks";
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
import { lazyNamed } from "~/shared/lib/lazy";
import type { FilterMode } from "./types";

const IntervalLearningCard = lazyNamed(
  () => import("./components/interval-learning-card"),
  "IntervalLearningCard",
);

const IntervalControls = lazyNamed(
  () => import("./components/interval-controls-card"),
  "IntervalControlsCard",
);

const IntervalItemTable = lazyNamed(
  () => import("./components/interval-item-table"),
  "IntervalItemTable",
);

export function meta(_: Route.MetaArgs) {
  return [
    { title: "NoteLogic | Interval Explorer" },
    {
      name: "description",
      content:
        "Interactive interval learning page with root-based generation, consonance filters, and guided explanation cards.",
    },
  ];
}

export default function IntervalRoute() {
  const [searchParams, setSearchParams] = useSearchParams();

  const root = searchParams.get("root") ?? "C";
  const spell = (searchParams.get("spell") ?? "auto") as SpellMode;
  const query = searchParams.get("q") ?? "";
  const filter = (searchParams.get("filter") ?? "all") as FilterMode;
  const view = (searchParams.get("view") ?? "cards") as "cards" | "table";

  const setView = (v: "cards" | "table") =>
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (v !== "cards") next.set("view", v);
      else next.delete("view");
      return next;
    });

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
      <Suspense
        key={`interval-learning-card-${interval.short}`}
        fallback={<IntervalLearningCardFallback />}
      >
        <IntervalLearningCard interval={interval} />
      </Suspense>
    ));
  }, [filteredIntervals]);

  return (
    <section className="w-full space-y-6 px-4 py-8 md:px-6 md:py-10">
      <FloatingFilterSidebar title="Interval Filters">
        <Suspense fallback={<IntervalControlsFallback />}>
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
        </Suspense>
      </FloatingFilterSidebar>

      <div className="space-y-3 px-1">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Interval Explorer
          </h1>
          <Badge variant="secondary">Interactive Learning</Badge>
        </div>
        <p className="text-muted-foreground text-sm">
          Pelajari interval dari root pilihanmu. Fokuskan ke konsonan atau
          disonan dengan kartu belajar lengkap per interval.
        </p>
        <div className="text-muted-foreground flex flex-wrap gap-2 text-xs">
          <Badge variant="outline">Total: {counts.total}</Badge>
          <Badge variant="outline">Perfect: {counts.perfect}</Badge>
          <Badge variant="outline">Imperfect: {counts.imperfect}</Badge>
          <Badge variant="outline">Dissonance: {counts.dissonance}</Badge>
          <Badge variant="outline">Showing: {filteredIntervals.length}</Badge>
        </div>
      </div>

      {filteredIntervals.length === 0 ? (
        <div className="text-muted-foreground py-8 text-center text-sm">
          Tidak ada interval untuk filter saat ini.
        </div>
      ) : (
        <Tabs
          value={view}
          onValueChange={(v) => setView(v as "cards" | "table")}
        >
          <TabsList className="grid h-auto w-full grid-cols-2 gap-1 p-1 md:w-60">
            <TabsTrigger value="cards">Cards View</TabsTrigger>
            <TabsTrigger value="table">Table View</TabsTrigger>
          </TabsList>

          <TabsContent value="cards" className="mt-4">
            <div className="grid gap-4">{intervalCardElements}</div>
          </TabsContent>

          <TabsContent value="table" className="mt-4">
            <Suspense fallback={<IntervalItemTableFallback />}>
              <IntervalItemTable intervals={filteredIntervals} />
            </Suspense>
          </TabsContent>
        </Tabs>
      )}
    </section>
  );
}
