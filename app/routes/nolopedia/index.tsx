// ════════════════════════════════════════════════════════
// /nolopedia – Music Dictionary List Page
// ════════════════════════════════════════════════════════
//
// SSR: Server renders the full page on each request based on URL
// search params (q, category, page). After hydration the client
// takes over for interactive search/filter/pagination.
// ════════════════════════════════════════════════════════

import { useMemo, useState, useCallback, useEffect } from "react";
import { useSearchParams, data, useFetcher } from "react-router";
import type { Route } from "./+types/index";
import { ALL_ENTRIES } from "~/theory-music/dictionary/index";
import type {
  DictionaryCategory,
  DictionarySubCategory,
  InstrumentContext,
} from "~/theory-music/dictionary/types";
import {
  getUserDictionaryEntries,
  addUserDictionaryEntry,
  deleteUserDictionaryEntry,
} from "~/lib/json-db.server";
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
import { NolopediaCard } from "./components/nolopedia-card";
import {
  CATEGORY_LABELS,
  CATEGORY_KEYS,
  filterEntries,
  paginate,
  buildPageNumbers,
  buildCollectionPageJsonLd,
  SITE_URL,
} from "./lib/nolopedia-utils";
import { AddEntryDialog } from "./components/add-entry-dialog";

// ── Loader (runs on server per request) ────────────────

const PAGE_SIZE = 24;

const sortedEntries = [...ALL_ENTRIES].sort((a, b) =>
  a.term.localeCompare(b.term),
);

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const query = url.searchParams.get("q") ?? "";
  const category = url.searchParams.get("category") ?? "all";
  const pageParam = Number(url.searchParams.get("page")) || 1;

  // Merge built-in + user-added entries
  const userEntries = await getUserDictionaryEntries();
  const mergedEntries = [...sortedEntries, ...userEntries].sort((a, b) =>
    a.term.localeCompare(b.term),
  );

  const filtered = filterEntries(mergedEntries, query, category);
  const result = paginate(filtered, pageParam, PAGE_SIZE);

  return {
    totalEntries: mergedEntries.length,
    categories: CATEGORY_KEYS,
    initialEntries: result.data,
    initialPage: result.page,
    initialTotalPages: result.totalPages,
    initialTotal: result.total,
    query,
    category,
    // Full user entries for client-side merge after hydration
    userEntries,
  };
}

// ── Action (server-side insert / delete) ───────────────

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const actionType = formData.get("_action") as string;

  if (actionType === "add-entry") {
    const term = (formData.get("term") as string)?.trim();
    const category = formData.get("category") as DictionaryCategory;
    const shortDefinition = (formData.get("shortDefinition") as string)?.trim();

    if (!term || !category || !shortDefinition) {
      return data(
        {
          ok: false,
          error: "Term, kategori, dan definisi singkat wajib diisi.",
        },
        { status: 400 },
      );
    }

    const termId = (formData.get("termId") as string)?.trim() || undefined;
    const instrumentContext =
      (formData.get("instrumentContext") as InstrumentContext) || "general";
    const detailedDefinition =
      (formData.get("detailedDefinition") as string)?.trim() || "";
    const examplesRaw = (formData.get("examples") as string)?.trim();
    const examples = examplesRaw
      ? examplesRaw
          .split("\n")
          .map((l) => l.trim())
          .filter(Boolean)
      : undefined;
    const tagsRaw = (formData.get("tags") as string)?.trim();
    const tags = tagsRaw
      ? tagsRaw
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : undefined;
    const aliasesRaw = (formData.get("aliases") as string)?.trim();
    const aliases = aliasesRaw
      ? aliasesRaw
          .split(",")
          .map((a) => a.trim())
          .filter(Boolean)
      : undefined;

    // Derive a sensible subCategory from the category
    const subCategoryMap: Record<DictionaryCategory, DictionarySubCategory> = {
      notation: "note-values",
      rhythm: "rhythm-general",
      pitch: "pitch-general",
      interval: "interval-general",
      scale: "scale-general",
      chord: "chord-general",
      harmony: "functional-harmony",
      form: "song-form",
      analysis: "roman-numeral",
      audio: "digital-audio",
      dynamics: "dynamic-mark",
      articulation: "staccato-legato",
      ornament: "trill-mordent",
      technique: "picking",
      effect: "reverb-delay",
    };

    try {
      await addUserDictionaryEntry({
        term,
        termId,
        aliases,
        category,
        subCategory: subCategoryMap[category],
        instrumentContext,
        shortDefinition,
        detailedDefinition,
        examples,
        tags,
      });
      return data({ ok: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Gagal menyimpan.";
      return data({ ok: false, error: message }, { status: 400 });
    }
  }

  if (actionType === "delete-entry") {
    const id = formData.get("id") as string;
    if (!id) {
      return data({ ok: false, error: "ID tidak valid." }, { status: 400 });
    }
    const deleted = await deleteUserDictionaryEntry(id);
    if (!deleted) {
      return data(
        {
          ok: false,
          error: "Entri tidak ditemukan atau bukan entri pengguna.",
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
  const title = "Nolopedia – Kamus Teori Musik Lengkap | NoteLogic";
  const description =
    "Ensiklopedia interaktif teori musik dengan 170+ entri: pitch, chord, skala, ritme, teknik gitar, dinamika, artikulasi, ornamen, dan banyak lagi. Gratis dan open-source.";

  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: `${SITE_URL}/nolopedia` },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
  ];
}

// ── Component ──────────────────────────────────────────

export default function NolopediaListRoute({
  loaderData,
}: Route.ComponentProps) {
  const { userEntries } = loaderData;
  const userIdSet = useMemo(
    () => new Set(userEntries.map((e) => e.id)),
    [userEntries],
  );
  const [searchParams, setSearchParams] = useSearchParams();

  // Merged entries: built-in + user (from loader)
  const mergedEntries = useMemo(
    () =>
      [...sortedEntries, ...userEntries].sort((a, b) =>
        a.term.localeCompare(b.term),
      ),
    [userEntries],
  );
  const totalEntries = mergedEntries.length;

  // Read state from URL
  const query = searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? "all";
  const pageParam = Number(searchParams.get("page")) || 1;

  // Debounced query for performance
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 200);
    return () => clearTimeout(t);
  }, [query]);

  // Filter + paginate (client-side for instant interactivity)
  const filtered = useMemo(
    () => filterEntries(mergedEntries, debouncedQuery, category),
    [debouncedQuery, category, mergedEntries],
  );

  const {
    data: pageEntries,
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

  // URL setters
  const setQuery = useCallback(
    (q: string) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (q) next.set("q", q);
          else next.delete("q");
          next.delete("page");
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const setCategory = useCallback(
    (c: string) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (c !== "all") next.set("category", c);
        else next.delete("category");
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

  // Category counts for UI
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: mergedEntries.length };
    for (const e of mergedEntries) {
      counts[e.category] = (counts[e.category] || 0) + 1;
    }
    return counts;
  }, [mergedEntries]);

  return (
    <article className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* ── JSON-LD Structured Data ─────────────────── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildCollectionPageJsonLd(totalEntries)),
        }}
      />
      <link rel="canonical" href={`${SITE_URL}/nolopedia`} />

      {/* ── Hero / Header ───────────────────────────── */}
      <header className="mb-8 space-y-3">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Nolopedia
          </h1>
          <AddEntryDialog />
        </div>
        <p className="text-muted-foreground max-w-2xl text-base sm:text-lg">
          Kamus teori musik interaktif — {totalEntries} istilah mencakup pitch,
          chord, skala, ritme, teknik gitar, dinamika, dan lainnya. Klik untuk
          detail lengkap.
        </p>
      </header>

      {/* ── Search + Filter Bar ─────────────────────── */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-sm">
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
            placeholder="Cari istilah, alias, tag…"
            className="pl-9"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full sm:w-52">
            <SelectValue placeholder="Semua Kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              Semua Kategori ({categoryCounts.all})
            </SelectItem>
            {CATEGORY_KEYS.map((key) =>
              categoryCounts[key] ? (
                <SelectItem key={key} value={key}>
                  {CATEGORY_LABELS[key]} ({categoryCounts[key]})
                </SelectItem>
              ) : null,
            )}
          </SelectContent>
        </Select>
      </div>

      {/* ── Results count ───────────────────────────── */}
      <p className="mb-4 text-sm text-muted-foreground">
        {total === 0
          ? "Tidak ditemukan hasil."
          : `Menampilkan ${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, total)} dari ${total} istilah`}
      </p>

      {/* ── Card Grid ───────────────────────────────── */}
      {pageEntries.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pageEntries.map((entry) => (
            <div key={entry.id} className="relative">
              <NolopediaCard entry={entry} />
              {userIdSet.has(entry.id) && <UserEntryBadge entryId={entry.id} />}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 px-6 py-16 text-center">
          <p className="text-lg font-medium text-muted-foreground">
            Tidak ada istilah yang cocok
          </p>
          <p className="mt-1 text-sm text-muted-foreground/70">
            Coba ubah kata kunci atau pilih kategori lain.
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

// ── User Entry Badge + Delete ──────────────────────────

function UserEntryBadge({ entryId }: { entryId: string }) {
  const fetcher = useFetcher();
  const isDeleting = fetcher.state !== "idle";

  return (
    <div className="absolute right-2 top-2 flex items-center gap-1">
      <span className="rounded-full bg-blue-500/15 px-2 py-0.5 text-[10px] font-medium text-blue-600 dark:text-blue-400">
        User
      </span>
      <fetcher.Form method="post">
        <input type="hidden" name="_action" value="delete-entry" />
        <input type="hidden" name="id" value={entryId} />
        <button
          type="submit"
          disabled={isDeleting}
          className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          title="Hapus entri"
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
