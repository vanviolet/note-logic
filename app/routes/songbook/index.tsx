// ════════════════════════════════════════════════════════
// /songbook – Song Chord List Page
// ════════════════════════════════════════════════════════

import { useMemo, useState, useCallback, useEffect } from "react";
import { useSearchParams, data, useFetcher } from "react-router";
import type { Route } from "./+types/index";
import { ALL_SONGS } from "~/theory-music/songbook/index";
import type { SongDifficulty } from "~/theory-music/songbook/types";
import {
  getUserSongbookEntries,
  addUserSongbookEntry,
  deleteUserSongbookEntry,
  slugify,
} from "~/lib/json-db.server";
import { parseChordSheet } from "~/lib/chord-sheet-parser.server";
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
import { SongbookCard } from "./components/songbook-card";
import {
  filterSongs,
  paginate,
  buildPageNumbers,
  buildCollectionPageJsonLd,
  SITE_URL,
  DIFFICULTY_LABELS,
} from "./lib/songbook-utils";
import { AddSongSheet } from "./components/add-song-sheet";

// ── Constants ──────────────────────────────────────────

const PAGE_SIZE = 12;

const sortedSongs = [...ALL_SONGS].sort((a, b) =>
  a.title.localeCompare(b.title),
);

const DIFFICULTY_KEYS: SongDifficulty[] = [
  "beginner",
  "intermediate",
  "advanced",
  "expert",
];

// ── Loader ─────────────────────────────────────────────

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const query = url.searchParams.get("q") ?? "";
  const artist = url.searchParams.get("artist") ?? "all";
  const difficulty = url.searchParams.get("difficulty") ?? "all";
  const pageParam = Number(url.searchParams.get("page")) || 1;

  // Merge built-in + user-added songs
  const userSongs = await getUserSongbookEntries();
  const mergedSongs = [...sortedSongs, ...userSongs].sort((a, b) =>
    a.title.localeCompare(b.title),
  );

  const filtered = filterSongs(mergedSongs, query, artist, difficulty);
  const result = paginate(filtered, pageParam, PAGE_SIZE);

  return {
    totalSongs: mergedSongs.length,
    initialEntries: result.data,
    initialPage: result.page,
    initialTotalPages: result.totalPages,
    initialTotal: result.total,
    query,
    artist,
    difficulty,
    userSongs,
  };
}

// ── Action (server-side insert / delete) ───────────────

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const actionType = formData.get("_action") as string;

  if (actionType === "add-song") {
    const title = (formData.get("title") as string)?.trim();
    const artist = (formData.get("artist") as string)?.trim();
    const key = (formData.get("key") as string)?.trim();
    const difficulty = formData.get("difficulty") as SongDifficulty;
    const chordSheet = (formData.get("chordSheet") as string)?.trim();

    if (!title || !artist || !key || !difficulty || !chordSheet) {
      return data(
        {
          ok: false,
          error:
            "Judul, artis, kunci, difficulty, dan chord sheet wajib diisi.",
        },
        { status: 400 },
      );
    }

    const album = (formData.get("album") as string)?.trim() || undefined;
    const yearRaw = formData.get("year") as string;
    const year = yearRaw ? Number(yearRaw) : undefined;
    const capoRaw = formData.get("capo") as string;
    const capo = capoRaw ? Number(capoRaw) : 0;
    const bpmRaw = formData.get("bpm") as string;
    const bpm = bpmRaw ? Number(bpmRaw) : undefined;
    const timeSignature =
      (formData.get("timeSignature") as string)?.trim() || "4/4";
    const tuning = (formData.get("tuning") as string)?.trim() || "E A D G B E";
    const genreRaw = (formData.get("genre") as string)?.trim();
    const genre = genreRaw
      ? genreRaw
          .split(",")
          .map((g) => g.trim())
          .filter(Boolean)
      : [];
    const tagsRaw = (formData.get("tags") as string)?.trim();
    const tags = tagsRaw
      ? tagsRaw
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [];
    const strummingPatternRaw = (
      formData.get("strummingPattern") as string
    )?.trim();
    const strummingPattern = strummingPatternRaw
      ? { pattern: strummingPatternRaw, bpm }
      : undefined;
    const notes = (formData.get("notes") as string)?.trim() || undefined;

    // Parse chord sheet into sections + extract chords
    const { sections, chordsUsed } = parseChordSheet(chordSheet);

    if (sections.length === 0) {
      return data(
        { ok: false, error: "Chord sheet tidak valid atau kosong." },
        { status: 400 },
      );
    }

    try {
      await addUserSongbookEntry({
        title,
        artist,
        artistSlug: slugify(artist),
        album,
        year,
        genre,
        difficulty,
        key,
        capo,
        tuning,
        bpm,
        timeSignature,
        chordsUsed,
        strummingPattern,
        sections,
        notes,
        tags,
      });
      return data({ ok: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Gagal menyimpan.";
      return data({ ok: false, error: message }, { status: 400 });
    }
  }

  if (actionType === "delete-song") {
    const id = formData.get("id") as string;
    if (!id) {
      return data({ ok: false, error: "ID tidak valid." }, { status: 400 });
    }
    const deleted = await deleteUserSongbookEntry(id);
    if (!deleted) {
      return data(
        {
          ok: false,
          error: "Lagu tidak ditemukan atau bukan entri pengguna.",
        },
        { status: 404 },
      );
    }
    return data({ ok: true });
  }

  return data({ ok: false, error: "Aksi tidak dikenal." }, { status: 400 });
}

// ── Meta ───────────────────────────────────────────────

export function meta() {
  const title = "Songbook – Koleksi Chord Gitar | NoteLogic";
  const description =
    "Koleksi chord gitar populer lengkap dengan lirik, kunci, capo, dan pola strumming. Gratis untuk belajar gitar.";

  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: `${SITE_URL}/songbook` },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
  ];
}

// ── Component ──────────────────────────────────────────

export default function SongbookListRoute({
  loaderData,
}: Route.ComponentProps) {
  const { userSongs } = loaderData;
  const userIdSet = useMemo(
    () => new Set(userSongs.map((s) => s.id)),
    [userSongs],
  );
  const [searchParams, setSearchParams] = useSearchParams();

  // Merged songs: built-in + user (from loader)
  const mergedSongs = useMemo(
    () =>
      [...sortedSongs, ...userSongs].sort((a, b) =>
        a.title.localeCompare(b.title),
      ),
    [userSongs],
  );
  const totalSongs = mergedSongs.length;

  // Build artist slug → name map (including user songs)
  const artistSlugMap = useMemo(
    () => new Map(mergedSongs.map((s) => [s.artistSlug, s.artist])),
    [mergedSongs],
  );

  // Read state from URL
  const query = searchParams.get("q") ?? "";
  const artist = searchParams.get("artist") ?? "all";
  const difficulty = searchParams.get("difficulty") ?? "all";
  const pageParam = Number(searchParams.get("page")) || 1;

  // Debounced query
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 200);
    return () => clearTimeout(t);
  }, [query]);

  // Filter + paginate
  const filtered = useMemo(
    () => filterSongs(mergedSongs, debouncedQuery, artist, difficulty),
    [debouncedQuery, artist, difficulty, mergedSongs],
  );

  const {
    data: pageSongs,
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

  const setArtist = useCallback(
    (a: string) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (a !== "all") next.set("artist", a);
        else next.delete("artist");
        next.delete("page");
        return next;
      });
    },
    [setSearchParams],
  );

  const setDifficulty = useCallback(
    (d: string) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (d !== "all") next.set("difficulty", d);
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

  // Artist counts
  const artistCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const s of mergedSongs) {
      counts[s.artistSlug] = (counts[s.artistSlug] || 0) + 1;
    }
    return counts;
  }, [mergedSongs]);

  // Difficulty counts
  const difficultyCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const s of mergedSongs) {
      counts[s.difficulty] = (counts[s.difficulty] || 0) + 1;
    }
    return counts;
  }, [mergedSongs]);

  return (
    <article className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildCollectionPageJsonLd(totalSongs)),
        }}
      />
      <link rel="canonical" href={`${SITE_URL}/songbook`} />

      {/* Header */}
      <header className="mb-8 space-y-3">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            🎸 Songbook
          </h1>
          <AddSongSheet />
        </div>
        <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
          Koleksi chord gitar populer — {totalSongs} lagu dengan lirik, kunci,
          capo, dan pola strumming. Klik untuk melihat chord sheet lengkap.
        </p>
      </header>

      {/* Search + Filter Bar */}
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
            placeholder="Cari lagu, artis, chord, genre…"
            className="pl-9"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <Select value={artist} onValueChange={setArtist}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Semua Artis" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Artis ({totalSongs})</SelectItem>
            {[...artistSlugMap.entries()].map(([slug, name]) =>
              artistCounts[slug] ? (
                <SelectItem key={slug} value={slug}>
                  {name} ({artistCounts[slug]})
                </SelectItem>
              ) : null,
            )}
          </SelectContent>
        </Select>

        <Select value={difficulty} onValueChange={setDifficulty}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Semua Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Level</SelectItem>
            {DIFFICULTY_KEYS.map((key) =>
              difficultyCounts[key] ? (
                <SelectItem key={key} value={key}>
                  {DIFFICULTY_LABELS[key]} ({difficultyCounts[key]})
                </SelectItem>
              ) : null,
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      <p className="mb-4 text-sm text-muted-foreground">
        {total === 0
          ? "Tidak ditemukan hasil."
          : `Menampilkan ${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, total)} dari ${total} lagu`}
      </p>

      {/* Card Grid */}
      {pageSongs.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pageSongs.map((song) => (
            <div key={song.id} className="relative">
              <SongbookCard song={song} />
              {userIdSet.has(song.id) && <UserSongBadge songId={song.id} />}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 px-6 py-16 text-center">
          <p className="text-lg font-medium text-muted-foreground">
            Tidak ada lagu yang cocok
          </p>
          <p className="mt-1 text-sm text-muted-foreground/70">
            Coba ubah kata kunci atau pilih filter lain.
          </p>
        </div>
      )}

      {/* Pagination */}
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

// ── User Song Badge + Delete ──────────────────────────

function UserSongBadge({ songId }: { songId: string }) {
  const fetcher = useFetcher();
  const isDeleting = fetcher.state !== "idle";

  return (
    <div className="absolute right-2 top-2 flex items-center gap-1">
      <span className="rounded-full bg-blue-500/15 px-2 py-0.5 text-[10px] font-medium text-blue-600 dark:text-blue-400">
        User
      </span>
      <fetcher.Form method="post">
        <input type="hidden" name="_action" value="delete-song" />
        <input type="hidden" name="id" value={songId} />
        <button
          type="submit"
          disabled={isDeleting}
          className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          title="Hapus lagu"
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
