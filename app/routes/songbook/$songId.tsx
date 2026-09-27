// ════════════════════════════════════════════════════════
// /songbook/:songId – Chord Sheet Detail Page
// ════════════════════════════════════════════════════════

import { Link } from "react-router";
import { useState, useRef, useCallback, useEffect } from "react";
import type { Route } from "./+types/$songId";
import { SONG_MAP, ALL_SONGS } from "~/theory-music/songbook/index";
import { getUserSongbookEntries } from "~/lib/json-db.server";
import type { SongEntry } from "~/theory-music/songbook/types";
import { Badge } from "~/templates/components/ui/badge";
import { Button } from "~/templates/components/ui/button";
import { Separator } from "~/templates/components/ui/separator";
import { Slider } from "~/templates/components/ui/slider";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/templates/components/ui/breadcrumb";
import {
  DIFFICULTY_LABELS,
  DIFFICULTY_COLORS,
  GENRE_LABELS,
  SITE_URL,
  buildSongJsonLd,
  buildBreadcrumbJsonLd,
  transposeChord,
  transposeKey,
} from "./lib/songbook-utils";
import { SectionBlock } from "./components/section-block";
import { ChordDiagram } from "./components/chord-diagram";

// ── Inline SVG icons (avoid extra dependency) ──────────

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M8 5.14v14l11-7-11-7z" />
    </svg>
  );
}

function PauseIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
    </svg>
  );
}

// ── Loader ─────────────────────────────────────────────

export async function loader({ params }: Route.LoaderArgs) {
  // Check built-in songs first, then user songs
  let song = SONG_MAP.get(params.songId);

  if (!song) {
    const userSongs = await getUserSongbookEntries();
    song = userSongs.find((s) => s.id === params.songId);
  }

  if (!song) {
    throw new Response("Lagu tidak ditemukan", { status: 404 });
  }

  // Related songs: same artist or same key (from both sources)
  const userSongs = await getUserSongbookEntries();
  const allMerged = [...ALL_SONGS, ...userSongs];

  const related: SongEntry[] = allMerged
    .filter(
      (s) =>
        s.id !== song.id &&
        (s.artistSlug === song.artistSlug || s.key === song.key),
    )
    .slice(0, 4);

  return { song, related };
}

// ── Meta ───────────────────────────────────────────────

export function meta({ data }: Route.MetaArgs) {
  if (!data?.song) {
    return [
      { title: "Lagu Tidak Ditemukan | Songbook" },
      {
        name: "description",
        content: "Chord lagu yang dicari tidak ditemukan.",
      },
    ];
  }

  const { song } = data;
  const title = `${song.title} – ${song.artist} | Chord Gitar | Songbook`;
  const description = `Chord gitar ${song.title} oleh ${song.artist}. Key: ${song.key}${song.capo ? `, Capo: fret ${song.capo}` : ""}. ${song.chordsUsed.length} chord digunakan: ${song.chordsUsed.slice(0, 6).join(", ")}.`;

  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: `${song.title} – ${song.artist}` },
    { property: "og:description", content: description },
    { property: "og:type", content: "article" },
    { property: "og:url", content: `${SITE_URL}/songbook/${song.id}` },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    {
      name: "keywords",
      content: [
        `chord ${song.title}`,
        song.artist,
        "chord gitar",
        ...song.chordsUsed,
        ...song.genre,
        ...song.tags,
      ].join(", "),
    },
  ];
}

// ── Component ──────────────────────────────────────────

export default function SongbookDetailRoute({
  loaderData,
}: Route.ComponentProps) {
  const { song, related } = loaderData;

  // ── Transpose state ──────────────────────────────────
  const [transpose, setTranspose] = useState(0);
  const currentKey =
    transpose !== 0 ? transposeKey(song.key, transpose) : song.key;
  const transposedChords =
    transpose !== 0
      ? song.chordsUsed.map((c) => transposeChord(c, transpose))
      : song.chordsUsed;

  // ── Auto-scroll state ────────────────────────────────
  const [scrolling, setScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(1.5); // px per frame tick
  const rafRef = useRef<number | null>(null);

  const startScroll = useCallback(() => {
    setScrolling(true);
  }, []);

  const stopScroll = useCallback(() => {
    setScrolling(false);
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!scrolling) return;
    let lastTime = 0;
    const step = (time: number) => {
      if (lastTime) {
        // ~60fps → normalize to actual delta
        const delta = (time - lastTime) / 16.67;
        window.scrollBy(0, scrollSpeed * delta);
      }
      lastTime = time;
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [scrolling, scrollSpeed]);

  // Reset transpose when song changes
  useEffect(() => {
    setTranspose(0);
    stopScroll();
  }, [song.id, stopScroll]);

  return (
    <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildSongJsonLd(song)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildBreadcrumbJsonLd(song)),
        }}
      />
      <link rel="canonical" href={`${SITE_URL}/songbook/${song.id}`} />

      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/songbook">Songbook</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{song.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* ── Header ──────────────────────────────────── */}
      <header className="mb-6 space-y-3">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {song.title}
        </h1>

        <p className="text-lg text-muted-foreground">
          <Link
            to={`/songbook?artist=${song.artistSlug}`}
            className="hover:text-primary transition-colors hover:underline"
          >
            {song.artist}
          </Link>
          {song.album && (
            <span className="text-muted-foreground/60">
              {" "}
              · {song.album}
              {song.year ? ` (${song.year})` : ""}
            </span>
          )}
        </p>

        {/* Badges: difficulty + genres */}
        <div className="flex flex-wrap gap-2">
          <Badge
            variant="outline"
            className={DIFFICULTY_COLORS[song.difficulty]}
          >
            {DIFFICULTY_LABELS[song.difficulty]}
          </Badge>
          {song.genre.map((g) => (
            <Badge key={g} variant="outline">
              {GENRE_LABELS[g] ?? g}
            </Badge>
          ))}
        </div>
      </header>

      <Separator className="mb-6" />

      {/* ── Song Info Panel ─────────────────────────── */}
      <section className="mb-6 grid grid-cols-2 gap-3 rounded-lg border border-border bg-card/50 p-4 sm:grid-cols-4">
        <InfoItem label="Key" value={currentKey} highlight={transpose !== 0} />
        {song.originalKey && (
          <InfoItem label="Original Key" value={song.originalKey} />
        )}
        <InfoItem
          label="Capo"
          value={song.capo ? `Fret ${song.capo}` : "Tidak"}
        />
        {song.bpm && <InfoItem label="BPM" value={String(song.bpm)} />}
        {song.timeSignature && (
          <InfoItem label="Time Sig." value={song.timeSignature} />
        )}
        <InfoItem label="Tuning" value={song.tuning} />
      </section>

      {/* ── Transpose + Auto-Scroll Toolbar ─────────── */}
      <section className="mb-6 flex flex-col gap-3 rounded-lg border border-border bg-card/50 p-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Transpose controls */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Transpose
          </span>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => setTranspose((t) => (t - 1 < -11 ? 0 : t - 1))}
              aria-label="Transpose down"
            >
              <span className="text-base leading-none">−</span>
            </Button>
            <span
              className={`min-w-12 text-center font-mono text-sm font-bold ${
                transpose !== 0 ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {transpose > 0 ? `+${transpose}` : transpose}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => setTranspose((t) => (t + 1 > 11 ? 0 : t + 1))}
              aria-label="Transpose up"
            >
              <span className="text-base leading-none">+</span>
            </Button>
            {transpose !== 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="ml-1 h-7 text-xs"
                onClick={() => setTranspose(0)}
              >
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Auto-scroll controls */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Auto-scroll
          </span>
          <Button
            variant={scrolling ? "default" : "outline"}
            size="sm"
            className="h-8 gap-1.5 text-xs"
            onClick={scrolling ? stopScroll : startScroll}
          >
            {scrolling ? (
              <>
                <PauseIcon className="size-3.5" /> Pause
              </>
            ) : (
              <>
                <PlayIcon className="size-3.5" /> Play
              </>
            )}
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground">Slow</span>
            <Slider
              min={0.3}
              max={5}
              step={0.1}
              value={[scrollSpeed]}
              onValueChange={([v]) => setScrollSpeed(v)}
              className="w-20"
            />
            <span className="text-[10px] text-muted-foreground">Fast</span>
          </div>
        </div>
      </section>

      {/* ── Chords Used + Diagrams ──────────────────── */}
      <section className="mb-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Chord yang digunakan
        </h2>
        <div className="flex flex-wrap gap-3">
          {transposedChords.map((chord, i) => (
            <div
              key={song.chordsUsed[i]}
              className="flex flex-col items-center gap-1"
            >
              <ChordDiagram chord={chord} width={100} />
            </div>
          ))}
        </div>
      </section>

      {/* ── Strumming Pattern ───────────────────────── */}
      {song.strummingPattern && (
        <section className="mb-6">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Pola Strumming
          </h2>
          <div className="inline-flex items-center gap-3 rounded-lg border border-border bg-card/50 px-4 py-2.5">
            <span className="font-mono text-lg font-bold tracking-widest text-foreground">
              {song.strummingPattern.pattern}
            </span>
            {song.strummingPattern.bpm && (
              <span className="text-xs text-muted-foreground">
                ♩ {song.strummingPattern.bpm} bpm
              </span>
            )}
          </div>
        </section>
      )}

      {/* ── Notes / Tips ────────────────────────────── */}
      {song.notes && (
        <section className="mb-6 rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
          <p className="text-sm leading-relaxed text-muted-foreground">
            <span className="mr-1.5 font-semibold text-amber-600 dark:text-amber-400">
              💡 Tips:
            </span>
            {song.notes}
          </p>
        </section>
      )}

      <Separator className="mb-6" />

      {/* ── Section Navigation ──────────────────────── */}
      <nav className="mb-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Bagian Lagu
        </h2>
        <div className="flex flex-wrap gap-1.5">
          {song.sections.map((section, i) => (
            <a
              key={i}
              href={`#section-${i}`}
              className="inline-block rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground"
            >
              {section.label}
            </a>
          ))}
        </div>
      </nav>

      {/* ── Chord Sheet ─────────────────────────────── */}
      <div className="space-y-4">
        {song.sections.map((section, i) => (
          <SectionBlock
            key={i}
            section={section}
            index={i}
            transpose={transpose}
          />
        ))}
      </div>

      {/* ── Tags ────────────────────────────────────── */}
      {song.tags.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Tags
          </h2>
          <div className="flex flex-wrap gap-2">
            {song.tags.map((tag) => (
              <Link
                key={tag}
                to={`/songbook?q=${encodeURIComponent(tag)}`}
                className="inline-block rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground"
              >
                {tag}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Related Songs ───────────────────────────── */}
      {related.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Lagu Terkait
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {related.map((rel) => (
              <Link
                key={rel.id}
                to={`/songbook/${rel.id}`}
                prefetch="intent"
                className="group flex flex-col gap-1 rounded-lg border border-border bg-card p-3.5 transition-colors hover:border-primary/40"
              >
                <span className="text-sm font-medium transition-colors group-hover:text-primary">
                  {rel.title}
                </span>
                <span className="text-xs text-muted-foreground">
                  {rel.artist} · Key: {rel.key}
                  {rel.capo ? ` · Capo ${rel.capo}` : ""}
                </span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {rel.chordsUsed.slice(0, 5).map((c) => (
                    <span
                      key={c}
                      className="rounded bg-primary/10 px-1 py-0.5 font-mono text-[10px] font-semibold text-primary"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Back link ───────────────────────────────── */}
      <Separator className="mt-8 mb-6" />
      <nav className="flex items-center justify-between">
        <Link to="/songbook" className="text-sm text-primary hover:underline">
          ← Kembali ke Songbook
        </Link>
        <Link
          to={`/songbook?artist=${song.artistSlug}`}
          className="text-sm text-muted-foreground hover:text-primary hover:underline"
        >
          Lihat semua {song.artist}
        </Link>
      </nav>
    </article>
  );
}

// ── Helper component ───────────────────────────────────

function InfoItem({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
        {label}
      </span>
      <span
        className={`font-mono text-sm font-bold ${
          highlight ? "text-primary" : "text-foreground"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
