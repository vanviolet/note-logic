// ════════════════════════════════════════════════════════
// /scale – Scale Explorer (Knowledge/Chord Explorer layout)
// ════════════════════════════════════════════════════════

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import type { Route } from "./+types";
import {
  generateScale,
  getScaleKeys,
  getScaleFamilies,
} from "~/theory-music/scales";
import { Input } from "~/templates/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/templates/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/templates/components/ui/pagination";
import { Music, Search, Sparkles } from "lucide-react";
import { cn } from "~/templates/lib/utils";
import { ROOT_FILTER_OPTIONS } from "~/shared/constants/music";
import { includeByQuery, familyLabel } from "./lib/scale-utils";
import { lazyNamed } from "~/shared/lib/lazy";
import { buildPaginationItems } from "~/shared/lib/pagination";
import { ScaleCardSkeleton } from "./components/scale-fallbacks";
import type { DifficultyFilter, FamilyFilter } from "./types";

// ── SEO Constants ──────────────────────────────────────

const SITE_URL = "https://notelogic.app";

// ── Lazy Card ──────────────────────────────────────────

const ScaleLearningCard = lazyNamed(
  () => import("./components/scale-learning-card"),
  "ScaleLearningCard",
);

// ── Constants ──────────────────────────────────────────

const PAGE_SIZE = 12;

const FAMILY_OPTIONS: Array<{ value: FamilyFilter; label: string }> = [
  { value: "all", label: "Semua Family" },
  ...getScaleFamilies().map((f) => ({
    value: f as FamilyFilter,
    label: familyLabel(f),
  })),
];

const DIFFICULTY_OPTIONS: Array<{ value: DifficultyFilter; label: string }> = [
  { value: "all", label: "Semua Level" },
  { value: "beginner", label: "Pemula" },
  { value: "intermediate", label: "Menengah" },
  { value: "advanced", label: "Lanjutan" },
];

// ── Meta ───────────────────────────────────────────────

export function meta(_: Route.MetaArgs) {
  const title = "Scale Explorer — 100+ Skala Musik Dunia | NoteLogic";
  const description =
    "Jelajahi 100+ skala musik dari seluruh dunia — diatonic modes, pentatonic, blues, maqam, raga, dan lainnya. Lengkap dengan tips latihan, fingering piano & gitar, dan ear training hints.";

  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: `${SITE_URL}/scale` },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    {
      name: "keywords",
      content:
        "scale explorer, skala musik, music scales, diatonic modes, pentatonic, blues scale, maqam, raga, music theory, teori musik",
    },
  ];
}

// ── Component ──────────────────────────────────────────

export default function ScaleExplorerPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL state
  const urlQuery = searchParams.get("q") ?? "";
  const root = searchParams.get("root") ?? "C";
  const familyFilter = (searchParams.get("family") ?? "all") as FamilyFilter;
  const difficultyFilter = (searchParams.get("difficulty") ??
    "all") as DifficultyFilter;
  const pageParam = Math.max(1, Number(searchParams.get("page") ?? "1"));

  // Local search for debounce
  const [localQuery, setLocalQuery] = useState(urlQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(urlQuery);

  // Debounced search
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setLocalQuery(val);
      const timer = setTimeout(() => {
        setDebouncedQuery(val);
        setSearchParams(
          (prev) => {
            const next = new URLSearchParams(prev);
            if (val) next.set("q", val);
            else next.delete("q");
            next.delete("page");
            return next;
          },
          { replace: true },
        );
      }, 300);
      return () => clearTimeout(timer);
    },
    [setSearchParams],
  );

  // Sync URL → local when URL query changes externally
  useEffect(() => {
    setLocalQuery(urlQuery);
    setDebouncedQuery(urlQuery);
  }, [urlQuery]);

  // ── Generate all scale instances ──
  const allScales = useMemo(() => {
    const keys = getScaleKeys();
    return keys.map((key) =>
      generateScale(root, key as Parameters<typeof generateScale>[1], {
        spell: "auto",
      }),
    );
  }, [root]);

  // ── Filter ──
  const filteredScales = useMemo(() => {
    return allScales.filter((scale) => {
      if (familyFilter !== "all" && scale.family !== familyFilter) return false;
      if (difficultyFilter !== "all" && scale.difficulty !== difficultyFilter)
        return false;
      if (
        debouncedQuery.trim() &&
        !includeByQuery(scale, debouncedQuery.trim())
      )
        return false;
      return true;
    });
  }, [allScales, familyFilter, difficultyFilter, debouncedQuery]);

  // ── Counts ──
  const counts = useMemo(() => {
    const beginner = allScales.filter(
      (s) => s.difficulty === "beginner",
    ).length;
    const intermediate = allScales.filter(
      (s) => s.difficulty === "intermediate",
    ).length;
    const advanced = allScales.filter(
      (s) => s.difficulty === "advanced",
    ).length;
    return { total: allScales.length, beginner, intermediate, advanced };
  }, [allScales]);

  // ── Pagination ──
  const totalPages = Math.max(1, Math.ceil(filteredScales.length / PAGE_SIZE));
  const safePage = Math.min(pageParam, totalPages);
  const paginatedScales = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filteredScales.slice(start, start + PAGE_SIZE);
  }, [filteredScales, safePage]);
  const paginationItems = useMemo(
    () => buildPaginationItems(safePage, totalPages),
    [safePage, totalPages],
  );

  // ── URL Setters ──
  const setRoot = useCallback(
    (v: string) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (v !== "C") next.set("root", v);
        else next.delete("root");
        next.delete("page");
        return next;
      });
    },
    [setSearchParams],
  );

  const setFamilyFilter = useCallback(
    (v: string) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (v !== "all") next.set("family", v);
        else next.delete("family");
        next.delete("page");
        return next;
      });
    },
    [setSearchParams],
  );

  const setDifficultyFilter = useCallback(
    (v: string) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (v !== "all") next.set("difficulty", v);
        else next.delete("difficulty");
        next.delete("page");
        return next;
      });
    },
    [setSearchParams],
  );

  const setPage = useCallback(
    (p: number) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (p > 1) next.set("page", String(p));
        else next.delete("page");
        return next;
      });
    },
    [setSearchParams],
  );

  const filterKey = `${debouncedQuery}|${root}|${familyFilter}|${difficultyFilter}|${safePage}`;

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 md:px-6">
      {/* ── JSON-LD Structured Data ─────────────────── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Scale Explorer — NoteLogic",
            description: "Jelajahi 100+ skala musik dari seluruh dunia.",
            url: `${SITE_URL}/scale`,
            numberOfItems: counts.total,
            isPartOf: {
              "@type": "WebSite",
              name: "NoteLogic",
              url: SITE_URL,
            },
          }),
        }}
      />
      <link rel="canonical" href={`${SITE_URL}/scale`} />

      {/* ── Hero ───────────────────────────────────────── */}
      <div className="mb-10 space-y-3 text-center">
        <div className="flex items-center justify-center gap-3">
          <Sparkles className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Scale Explorer
          </h1>
        </div>
        <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
          Jelajahi 100+ skala dari seluruh dunia — diatonic modes, pentatonic,
          blues, maqam, raga, dan lainnya. Lengkap dengan tips latihan,
          fingering piano &amp; gitar, dan ear training.
        </p>
      </div>

      {/* ── Filters ────────────────────────────────────── */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Cari skala, alias, region, genre…"
            className="pl-10"
            value={localQuery}
            onChange={handleSearchChange}
          />
        </div>
        <Select value={familyFilter} onValueChange={setFamilyFilter}>
          <SelectTrigger className="w-full sm:w-52">
            <SelectValue placeholder="Family" />
          </SelectTrigger>
          <SelectContent>
            {FAMILY_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Level" />
          </SelectTrigger>
          <SelectContent>
            {DIFFICULTY_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* ── Root Filter Buttons ────────────────────────── */}
      <div className="mb-5 flex flex-wrap gap-1.5">
        {ROOT_FILTER_OPTIONS.map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRoot(r === root ? "C" : r)}
            className={cn(
              "inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",
              root === r
                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {r}
          </button>
        ))}
      </div>

      {/* ── Results Count ──────────────────────────────── */}
      <p className="mb-4 text-sm text-muted-foreground">
        {filteredScales.length === 0
          ? "Tidak ditemukan skala yang cocok."
          : `Menampilkan ${(safePage - 1) * PAGE_SIZE + 1}–${Math.min(safePage * PAGE_SIZE, filteredScales.length)} dari ${filteredScales.length} skala`}
      </p>

      {/* ── Card Grid ──────────────────────────────────── */}
      {paginatedScales.length > 0 ? (
        <div key={filterKey} className="grid gap-5 md:grid-cols-2">
          {paginatedScales.map((scale) => (
            <Suspense
              key={`${scale.type}-${scale.root}`}
              fallback={<ScaleCardSkeleton />}
            >
              <ScaleLearningCard scale={scale} />
            </Suspense>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 px-6 py-16 text-center">
          <Music className="mb-4 h-12 w-12 text-muted-foreground/40" />
          <p className="text-lg font-medium text-muted-foreground">
            Tidak ada skala yang cocok
          </p>
          <p className="mt-1 text-sm text-muted-foreground/70">
            Coba ubah kata kunci, root, atau filter lain.
          </p>
        </div>
      )}

      {/* ── Pagination ─────────────────────────────────── */}
      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage(Math.max(1, safePage - 1))}
                className={
                  safePage <= 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>

            {paginationItems.map((item, i) =>
              item === "ellipsis" ? (
                <PaginationItem key={`e-${i}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={item}>
                  <PaginationLink
                    isActive={item === safePage}
                    onClick={() => setPage(item)}
                    className="cursor-pointer"
                  >
                    {item}
                  </PaginationLink>
                </PaginationItem>
              ),
            )}

            <PaginationItem>
              <PaginationNext
                onClick={() => setPage(Math.min(totalPages, safePage + 1))}
                className={
                  safePage >= totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* ── Stats Footer ───────────────────────────────── */}
      <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
        <span>{counts.total} skala</span>
        <span>·</span>
        <span>{counts.beginner} pemula</span>
        <span>·</span>
        <span>{counts.intermediate} menengah</span>
        <span>·</span>
        <span>{counts.advanced} lanjutan</span>
      </div>
    </section>
  );
}
