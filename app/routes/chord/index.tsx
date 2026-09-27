// ════════════════════════════════════════════════════════
// /chord – Chord Explorer List Page
// ════════════════════════════════════════════════════════
//
// SSR: Server renders the full page on each request based on URL
// search params (q, root, family, quality, page). After hydration
// the client takes over for interactive search/filter/pagination.
// ════════════════════════════════════════════════════════

import {
  useMemo,
  useState,
  useCallback,
  useEffect,
  useRef,
  lazy,
  Suspense,
} from "react";
import { useSearchParams, data, useFetcher } from "react-router";
import type { Route } from "./+types/index";
import {
  ALL_CHORDS,
  CHORD_MAP,
  chordNameToId,
  type ChordEntry,
  type ChordFamily,
  type HarmonicQuality,
  type DegreeToken,
} from "~/theory-music/chord";
import {
  getUserChordEntries,
  addUserChordEntry,
  deleteUserChordEntry,
} from "~/lib/json-db.server";
import {
  ROOT_SHARP_OPTIONS,
  ROOT_FLAT_OPTIONS,
} from "~/shared/constants/music";
import { Input } from "~/templates/components/ui/input";
import { cn } from "~/templates/lib/utils";
import { Skeleton } from "~/templates/components/ui/skeleton";
import { Card } from "~/templates/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/templates/components/ui/pagination";
import { AddChordDialog } from "./components/add-chord-dialog";
import {
  SITE_URL,
  filterChords,
  sortChords,
  paginate,
  buildPageNumbers,
  buildChordCollectionJsonLd,
} from "./lib/chord-utils";

// Lazy loaded ChordCard
const LazyChordCard = lazy(() =>
  import("./components/card/card").then((m) => ({
    default: m.ChordCard,
  })),
);

// ── Loader (runs on server per request) ────────────────

const PAGE_SIZE = 24;

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const query = url.searchParams.get("q") ?? "";
  const root = url.searchParams.get("root") ?? "all";
  const pageParam = Number(url.searchParams.get("page")) || 1;

  const userChords = await getUserChordEntries();
  const mergedChords = sortChords([...ALL_CHORDS, ...userChords]);

  const filtered = filterChords(mergedChords, query, root, "all", "all");
  const result = paginate(filtered, pageParam, PAGE_SIZE);

  return {
    totalChords: mergedChords.length,
    initialChords: result.data,
    initialPage: result.page,
    initialTotalPages: result.totalPages,
    initialTotal: result.total,
    query,
    root,
    userChords,
  };
}

// ── Action (server-side insert / delete) ───────────────

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const actionType = formData.get("_action") as string;

  if (actionType === "add-chord") {
    const root = (formData.get("root") as string)?.trim();
    const symbol = (formData.get("symbol") as string) ?? "";
    const formulaRaw = (formData.get("formula") as string)?.trim();
    const notesRaw = (formData.get("notes") as string)?.trim();

    if (!root || !formulaRaw || !notesRaw) {
      return data(
        { ok: false, error: "Root, formula, dan notes wajib diisi." },
        { status: 400 },
      );
    }

    const name = `${root}${symbol}`;
    const id = chordNameToId(root, symbol);
    const nickname =
      (formData.get("nickname") as string)?.trim() || `${name} chord`;
    const aliasesRaw = (formData.get("aliases") as string)?.trim();
    const aliases = aliasesRaw
      ? aliasesRaw
          .split(",")
          .map((a) => a.trim())
          .filter(Boolean)
      : [name];

    const formula = formulaRaw.split(/\s+/).filter(Boolean) as DegreeToken[];
    const notes = notesRaw
      .split(",")
      .map((n) => n.trim())
      .filter(Boolean);

    // Check for duplicate in built-in chords
    if (CHORD_MAP.has(id)) {
      return data(
        { ok: false, error: `Chord "${name}" sudah ada di database bawaan.` },
        { status: 400 },
      );
    }

    // Build a minimal ChordEntry
    const composed = formula.map((degree, i) => ({
      degree,
      note: notes[i] ?? degree,
      semitonesFromRoot: 0,
      intervalClass: 0,
      role: "chord-tone" as const,
    }));

    const entry: ChordEntry = {
      id,
      name,
      nickname,
      root,
      symbol,
      type: [{ name: symbol || ("maj" as any), description: nickname }],
      composed,
      quality: "major" as HarmonicQuality,
      family: "triad" as ChordFamily,
      formula,
      semitonePattern: [],
      pitchClasses: [],
      tensions: [],
      alterations: [],
      containsTritone: false,
      romanNumeralHints: [],
      cadentialStrength: "medium",
      recommendedVoicings: {
        piano: { low: [], mid: [], high: [] },
        guitar: { low: [], mid: [], high: [] },
        bass: { low: [], mid: [], high: [] },
      },
      functionHints: [
        (formData.get("description") as string)?.trim() ||
          "User-contributed chord",
      ],
      commonScales: [],
      aliases,
    };

    try {
      await addUserChordEntry(entry);
      return data({ ok: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Gagal menyimpan.";
      return data({ ok: false, error: message }, { status: 400 });
    }
  }

  if (actionType === "delete-chord") {
    const id = formData.get("id") as string;
    if (!id) {
      return data({ ok: false, error: "ID tidak valid." }, { status: 400 });
    }
    const deleted = await deleteUserChordEntry(id);
    if (!deleted) {
      return data(
        {
          ok: false,
          error: "Chord tidak ditemukan atau bukan chord pengguna.",
        },
        { status: 404 },
      );
    }
    return data({ ok: true });
  }

  return data({ ok: false, error: "Aksi tidak dikenal." }, { status: 400 });
}

// ── Meta (SEO) ─────────────────────────────────────────

export function meta() {
  const title = "Chord Explorer – Koleksi Chord Musik Lengkap | NoteLogic";
  const description =
    "Eksplorasi 1000+ chord musik lengkap dengan formula, notes, diagram gitar/piano/ukulele, dan fretboard interaktif. Search, filter by root/family/quality. Gratis dan open-source.";

  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: `${SITE_URL}/chord` },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    {
      name: "keywords",
      content:
        "chord, music theory, guitar chord, piano chord, chord formula, chord explorer, chord diagram, fretboard",
    },
  ];
}

// ── Card Skeleton Fallback ─────────────────────────────

function CardSkeleton() {
  return (
    <Card className="h-full p-5">
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-4 w-40" />
        <div className="flex gap-1">
          <Skeleton className="h-6 w-12 rounded-md" />
          <Skeleton className="h-6 w-12 rounded-md" />
          <Skeleton className="h-6 w-12 rounded-md" />
        </div>
        <Skeleton className="h-3 w-full" />
      </div>
    </Card>
  );
}

// ── Component ──────────────────────────────────────────

export default function ChordListRoute({ loaderData }: Route.ComponentProps) {
  const { userChords } = loaderData;
  const userIdSet = useMemo(
    () => new Set(userChords.map((c) => c.id)),
    [userChords],
  );
  const [searchParams, setSearchParams] = useSearchParams();

  // Merged + sorted chords
  const mergedChords = useMemo(
    () => sortChords([...ALL_CHORDS, ...userChords]),
    [userChords],
  );
  const totalChords = mergedChords.length;

  // Read state from URL
  const root = searchParams.get("root") ?? "all";
  const pageParam = Number(searchParams.get("page")) || 1;

  // Sharp/flat preference (local state, not in URL)
  const [accidental, setAccidental] = useState<"sharp" | "flat">("sharp");
  const rootOptions =
    accidental === "sharp" ? ROOT_SHARP_OPTIONS : ROOT_FLAT_OPTIONS;

  // ── Local search input (uncontrolled from URL to avoid lag) ──
  const urlQuery = searchParams.get("q") ?? "";
  const [localQuery, setLocalQuery] = useState(urlQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(urlQuery);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setLocalQuery(val);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
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
    },
    [setSearchParams],
  );

  // Sync URL → local when URL query changes externally
  useEffect(() => {
    setLocalQuery(urlQuery);
    setDebouncedQuery(urlQuery);
  }, [urlQuery]);

  // Filter + paginate
  const filtered = useMemo(
    () => filterChords(mergedChords, debouncedQuery, root, "all", "all"),
    [mergedChords, debouncedQuery, root],
  );

  const {
    data: pageChords,
    page,
    totalPages,
    total,
  } = useMemo(
    () => paginate(filtered, pageParam, PAGE_SIZE),
    [filtered, pageParam],
  );

  const pageNumbers = useMemo(
    () => buildPageNumbers(page, totalPages),
    [page, totalPages],
  );

  // Root counts for radio badges
  const rootCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const c of mergedChords) {
      counts[c.root] = (counts[c.root] || 0) + 1;
    }
    return counts;
  }, [mergedChords]);

  // URL setters
  const setRoot = useCallback(
    (v: string) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (v !== "all") next.set("root", v);
        else next.delete("root");
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

  // Key that changes when filter data changes → re-mount lazy cards
  const filterKey = `${debouncedQuery}|${root}|${page}`;

  return (
    <article className="px-4 py-8 sm:px-6 lg:px-10">
      {/* ── JSON-LD Structured Data ─────────────────── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildChordCollectionJsonLd(totalChords)),
        }}
      />
      <link rel="canonical" href={`${SITE_URL}/chord`} />

      {/* ── Hero / Header ───────────────────────────── */}
      <header className="mb-6 space-y-2">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Chord Explorer
          </h1>
          <AddChordDialog />
        </div>
        <p className="text-muted-foreground max-w-2xl text-sm sm:text-base">
          Eksplorasi {totalChords}+ chord musik lengkap — cari berdasarkan root,
          lalu klik untuk detail formula, voicing, diagram, dan fretboard
          interaktif.
        </p>
      </header>

      {/* ── Search + Sharp/Flat Toggle ─────────────── */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative shrink-0 sm:w-72">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
          <Input
            type="search"
            placeholder="Cari chord, alias, notes…"
            className="pl-9"
            value={localQuery}
            onChange={handleSearchChange}
          />
        </div>

        {/* Sharp / Flat radio */}
        <div className="flex items-center rounded-md border border-border p-0.5 gap-0.5 bg-muted/30">
          <button
            type="button"
            onClick={() => {
              setAccidental("sharp");
              if (root !== "all") setRoot("all");
            }}
            className={cn(
              "rounded px-3 py-1 text-xs font-medium transition-colors",
              accidental === "sharp"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Sharp ♯
          </button>
          <button
            type="button"
            onClick={() => {
              setAccidental("flat");
              if (root !== "all") setRoot("all");
            }}
            className={cn(
              "rounded px-3 py-1 text-xs font-medium transition-colors",
              accidental === "flat"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Flat ♭
          </button>
        </div>
      </div>

      {/* ── Root Filter Radio Cards ─────────────────── */}
      <div className="mb-5 flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => setRoot("all")}
          className={cn(
            "inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",
            root === "all"
              ? "border-primary bg-primary text-primary-foreground shadow-sm"
              : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground",
          )}
        >
          All
          <span className="text-[10px] opacity-70">{totalChords}</span>
        </button>
        {rootOptions.map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRoot(r === root ? "all" : r)}
            className={cn(
              "inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",
              root === r
                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {r}
            <span className="text-[10px] opacity-70">{rootCounts[r] ?? 0}</span>
          </button>
        ))}
      </div>

      {/* ── Results count ───────────────────────────── */}
      <p className="mb-4 text-sm text-muted-foreground">
        {total === 0
          ? "Tidak ditemukan chord yang cocok."
          : `Menampilkan ${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, total)} dari ${total} chord`}
      </p>

      {/* ── Card Grid (lazy) ──────────────────────── */}
      {pageChords.length > 0 ? (
        <div
          key={filterKey}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {pageChords.map((chord) => (
            <div key={chord.id} className="relative">
              <Suspense fallback={<CardSkeleton />}>
                <LazyChordCard chord={chord} />
              </Suspense>
              {userIdSet.has(chord.id) && <UserChordBadge chordId={chord.id} />}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 px-6 py-16 text-center">
          <p className="text-lg font-medium text-muted-foreground">
            Tidak ada chord yang cocok
          </p>
          <p className="mt-1 text-sm text-muted-foreground/70">
            Coba ubah kata kunci atau pilih filter lain.
          </p>
        </div>
      )}

      {/* ── Pagination ──────────────────────────────── */}
      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage(Math.max(1, page - 1))}
                className={
                  page <= 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>

            {pageNumbers.map((p, i) =>
              p === null ? (
                <PaginationItem key={`e-${i}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={p}>
                  <PaginationLink
                    isActive={p === page}
                    onClick={() => setPage(p)}
                    className="cursor-pointer"
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              ),
            )}

            <PaginationItem>
              <PaginationNext
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                className={
                  page >= totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </article>
  );
}

// ── User Chord Badge + Delete ──────────────────────────

function UserChordBadge({ chordId }: { chordId: string }) {
  const fetcher = useFetcher();
  const isDeleting = fetcher.state !== "idle";

  return (
    <div className="absolute right-2 top-2 flex items-center gap-1 z-10">
      <span className="rounded-full bg-blue-500/15 px-2 py-0.5 text-[10px] font-medium text-blue-600 dark:text-blue-400">
        User
      </span>
      <fetcher.Form method="post">
        <input type="hidden" name="_action" value="delete-chord" />
        <input type="hidden" name="id" value={chordId} />
        <button
          type="submit"
          disabled={isDeleting}
          className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          title="Hapus chord"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-3.5 w-3.5"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </fetcher.Form>
    </div>
  );
}
