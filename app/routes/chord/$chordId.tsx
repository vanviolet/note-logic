// ════════════════════════════════════════════════════════
// /chord/:chordId – Chord Detail Page
// ════════════════════════════════════════════════════════
//
// SSR: Loader runs on the server for every request, returning the
// chord entry + related chords (same root). The component receives
// data via props. Full SEO: meta tags, JSON-LD, breadcrumbs,
// canonical URL, proper 404 HTTP status, and semantic HTML.
// ════════════════════════════════════════════════════════

import { Suspense, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router";
import {
  BookOpen,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
} from "lucide-react";
import type { Route } from "./+types/$chordId";
import { CHORD_MAP, ALL_CHORDS } from "~/theory-music/chord";
import { getScalesMaster } from "~/theory-music/scales";
import {
  computeChordRelations,
  entityToRoute,
  type MusicEntityRef,
} from "~/theory-music/core";
import { getUserChordEntries } from "~/lib/json-db.server";
import { Badge } from "~/templates/components/ui/badge";
import { Button } from "~/templates/components/ui/button";
import { Separator } from "~/templates/components/ui/separator";
import { Skeleton } from "~/templates/components/ui/skeleton";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/templates/components/ui/breadcrumb";
import { useGuitarAudio } from "~/templates/hooks";
import {
  ChordDiagram,
  PianoChordDiagram,
  UkuleleChordDiagram,
} from "~/templates/components/custom/music-diagrams";
import { lazyNamed } from "~/shared/lib/lazy";
import { ChordFretboardBar } from "./components/chord-fretboard-bar";
import { ChordFingerpickingSection } from "./components/chord-fingerpicking-section";
import { notesToVexKeys } from "./components/chord-staff-renderer";
import {
  SITE_URL,
  FAMILY_LABELS,
  QUALITY_LABELS,
  buildChordJsonLd,
  buildChordBreadcrumbJsonLd,
  toPlayableChordNotes,
  degreeLabel,
  sortChords,
} from "./lib/chord-utils";

const ChordStaffRenderer = lazyNamed(
  () => import("./components/chord-staff-renderer"),
  "ChordStaffRenderer",
);

const NATURAL_ROOT_ORDER = ["C", "D", "E", "F", "G", "A", "B"] as const;

function getAdjacentTransposeRoot(root: string, direction: -1 | 1) {
  const match = /^([A-G])([#b]?)$/.exec(root);
  if (!match) return null;

  const [, letter, accidental] = match;
  const currentIndex = NATURAL_ROOT_ORDER.indexOf(
    letter as (typeof NATURAL_ROOT_ORDER)[number],
  );
  if (currentIndex === -1) return null;

  const nextIndex = currentIndex + direction;
  if (nextIndex < 0 || nextIndex >= NATURAL_ROOT_ORDER.length) return null;

  return `${NATURAL_ROOT_ORDER[nextIndex]}${accidental}`;
}

// ── Loader (runs on server per request) ────────────────

export async function loader({ params }: Route.LoaderArgs) {
  const userChords = await getUserChordEntries();

  let chord = CHORD_MAP.get(params.chordId);

  if (!chord) {
    chord = userChords.find((c) => c.id === params.chordId);
  }

  if (!chord) {
    throw new Response("Chord tidak ditemukan", { status: 404 });
  }

  const sameRootChords = sortChords([...ALL_CHORDS, ...userChords]).filter(
    (c) => c.root === chord.root,
  );
  const currentIndex = sameRootChords.findIndex((c) => c.id === chord.id);
  const prevChord = currentIndex > 0 ? sameRootChords[currentIndex - 1] : null;
  const nextChord =
    currentIndex >= 0 && currentIndex < sameRootChords.length - 1
      ? sameRootChords[currentIndex + 1]
      : null;

  const prevTransposeRoot = getAdjacentTransposeRoot(chord.root, -1);
  const nextTransposeRoot = getAdjacentTransposeRoot(chord.root, 1);

  const prevTransposedChord = prevTransposeRoot
    ? sortChords([...ALL_CHORDS, ...userChords]).find(
        (c) => c.root === prevTransposeRoot && c.symbol === chord.symbol,
      )
    : null;

  const nextTransposedChord = nextTransposeRoot
    ? sortChords([...ALL_CHORDS, ...userChords]).find(
        (c) => c.root === nextTransposeRoot && c.symbol === chord.symbol,
      )
    : null;

  // Related chords: same root, different symbol (max 8)
  const related = ALL_CHORDS.filter(
    (c) => c.root === chord!.root && c.id !== chord!.id,
  ).slice(0, 8);

  // Cross-references: intervals in this chord + scales that match
  const scalesData = getScalesMaster();
  const relations = computeChordRelations(
    chord.formula,
    chord.symbol,
    scalesData,
  );

  // VexFlow keys for staff notation
  const noteNames = chord.composed.map((t) => t.note);
  const vexKeys = notesToVexKeys(noteNames);

  return {
    chord,
    related,
    relations,
    vexKeys,
    prevChord,
    nextChord,
    prevTransposedChord,
    nextTransposedChord,
  };
}

// ── Meta (dynamic per-chord SEO) ───────────────────────

export function meta({ data }: Route.MetaArgs) {
  if (!data?.chord) {
    return [
      { title: "Chord Tidak Ditemukan | Chord Explorer" },
      {
        name: "description",
        content: "Chord yang dicari tidak ditemukan di Chord Explorer.",
      },
    ];
  }

  const { chord } = data;
  const title = `${chord.name} – ${chord.nickname} | Chord Explorer`;
  const notes = chord.composed.map((t) => t.note).join(", ");
  const description =
    `${chord.nickname}: Formula ${chord.formula.join(" ")}, Notes: ${notes}. Quality: ${chord.quality}, Family: ${chord.family}. Eksplorasi lengkap dengan diagram gitar, piano, ukulele, dan fretboard interaktif.`.slice(
      0,
      160,
    );

  const familyLabel = FAMILY_LABELS[chord.family] ?? chord.family;
  const qualityLabel = QUALITY_LABELS[chord.quality] ?? chord.quality;

  return [
    { title },
    { name: "description", content: description },
    {
      property: "og:title",
      content: `${chord.name} – ${qualityLabel} ${familyLabel}`,
    },
    { property: "og:description", content: description },
    { property: "og:type", content: "article" },
    { property: "og:url", content: `${SITE_URL}/chord/${chord.id}` },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    {
      name: "keywords",
      content: [
        chord.name,
        chord.nickname,
        ...chord.aliases,
        chord.quality,
        chord.family,
        "chord",
        "music theory",
        "guitar",
      ].join(", "),
    },
  ];
}

// ── Component ──────────────────────────────────────────

export default function ChordDetailRoute({ loaderData }: Route.ComponentProps) {
  const {
    chord,
    related,
    relations,
    vexKeys,
    prevChord,
    nextChord,
    prevTransposedChord,
    nextTransposedChord,
  } = loaderData;

  const navigate = useNavigate();

  const { ensureReady, isLoading, isReady, playStrum, error } =
    useGuitarAudio();

  const highlightedPitchClasses = useMemo(
    () => chord.pitchClasses ?? [],
    [chord],
  );

  const familyLabel = FAMILY_LABELS[chord.family] ?? chord.family;
  const qualityLabel = QUALITY_LABELS[chord.quality] ?? chord.quality;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }

      if (event.key === "ArrowLeft" && prevChord) {
        event.preventDefault();
        navigate(`/chord/${prevChord.id}`);
        return;
      }

      if (event.key === "ArrowRight" && nextChord) {
        event.preventDefault();
        navigate(`/chord/${nextChord.id}`);
        return;
      }

      if (event.key === "ArrowUp" && nextTransposedChord) {
        event.preventDefault();
        navigate(`/chord/${nextTransposedChord.id}`);
        return;
      }

      if (event.key === "ArrowDown" && prevTransposedChord) {
        event.preventDefault();
        navigate(`/chord/${prevTransposedChord.id}`);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    navigate,
    nextChord,
    nextTransposedChord,
    prevChord,
    prevTransposedChord,
  ]);

  return (
    <>
      <article className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-10 pb-20 md:pb-64 space-y-10">
        {/* ── Structured Data ─────────────────────────── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(buildChordJsonLd(chord)),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(buildChordBreadcrumbJsonLd(chord)),
          }}
        />
        <link rel="canonical" href={`${SITE_URL}/chord/${chord.id}`} />

        {/* ── Breadcrumb ──────────────────────────────── */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/chord">Chord Explorer</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{chord.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* ════════════════════════════════════════════════
            SECTION 1 – Hero: Title + Diagrams (full-width)
            ════════════════════════════════════════════════ */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          {/* Left: title, badges, audio */}
          <header className="space-y-3 min-w-0">
            <div className="flex items-center gap-2 sm:gap-3">
              {prevChord ? (
                <Button asChild type="button" variant="ghost" size="icon">
                  <Link
                    to={`/chord/${prevChord.id}`}
                    prefetch="intent"
                    aria-label={`Chord sebelumnya: ${prevChord.name}`}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Link>
                </Button>
              ) : (
                <Button type="button" variant="ghost" size="icon" disabled>
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              )}

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {chord.name}
              </h1>

              {nextChord ? (
                <Button asChild type="button" variant="ghost" size="icon">
                  <Link
                    to={`/chord/${nextChord.id}`}
                    prefetch="intent"
                    aria-label={`Chord berikutnya: ${nextChord.name}`}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Link>
                </Button>
              ) : (
                <Button type="button" variant="ghost" size="icon" disabled>
                  <ChevronRight className="h-5 w-5" />
                </Button>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Transpose</span>
              {prevTransposedChord ? (
                <Button asChild type="button" variant="ghost" size="icon">
                  <Link
                    to={`/chord/${prevTransposedChord.id}`}
                    prefetch="intent"
                    aria-label={`Transpose turun: ${prevTransposedChord.name}`}
                    title="Arrow Down"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <Button type="button" variant="ghost" size="icon" disabled>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              )}

              {nextTransposedChord ? (
                <Button asChild type="button" variant="ghost" size="icon">
                  <Link
                    to={`/chord/${nextTransposedChord.id}`}
                    prefetch="intent"
                    aria-label={`Transpose naik: ${nextTransposedChord.name}`}
                    title="Arrow Up"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <Button type="button" variant="ghost" size="icon" disabled>
                  <ChevronUp className="h-4 w-4" />
                </Button>
              )}
            </div>
            <p className="text-lg text-muted-foreground italic">
              {chord.nickname}
            </p>
            {chord.aliases.length > 0 && (
              <p className="text-sm text-muted-foreground">
                Alias:{" "}
                {chord.aliases.map((a, i) => (
                  <span key={a}>
                    {i > 0 && ", "}
                    <span className="font-medium">{a}</span>
                  </span>
                ))}
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              <Badge>{qualityLabel}</Badge>
              <Badge variant="outline">{familyLabel}</Badge>
              <Badge variant="outline">Root: {chord.root}</Badge>
              {chord.containsTritone && (
                <Badge
                  variant="secondary"
                  className="text-amber-600 dark:text-amber-400"
                >
                  Contains Tritone
                </Badge>
              )}
              <Badge variant="outline">
                Cadential: {chord.cadentialStrength}
              </Badge>
            </div>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => ensureReady()}
                disabled={isReady || isLoading}
              >
                {isReady
                  ? "Audio Ready"
                  : isLoading
                    ? "Preparing..."
                    : "Enable Audio"}
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() => playStrum(toPlayableChordNotes(chord), true)}
                disabled={isLoading}
              >
                Play Chord
              </Button>
              {error && (
                <p className="text-destructive text-xs">Audio error: {error}</p>
              )}
            </div>
          </header>

          {/* Right: Chord Diagrams */}
          <div className="flex flex-wrap items-end justify-center gap-6 shrink-0">
            <div className="flex flex-col items-center gap-1.5">
              <ChordDiagram chord={chord.name} width={110} />
              <span className="text-muted-foreground text-[11px] tracking-wide">
                Guitar
              </span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <UkuleleChordDiagram chord={chord.name} width={100} />
              <span className="text-muted-foreground text-[11px] tracking-wide">
                Ukulele
              </span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <PianoChordDiagram chord={chord.name} width={130} />
              <span className="text-muted-foreground text-[11px] tracking-wide">
                Piano
              </span>
            </div>
            {/* Staff notation (VexFlow, client-only) */}
            <div className="flex flex-col items-center gap-1.5">
              <Suspense
                fallback={
                  <Skeleton
                    className="rounded-lg"
                    style={{ width: 160, height: 200 }}
                  />
                }
              >
                <ChordStaffRenderer
                  chordName={chord.name}
                  notes={vexKeys}
                  width={160}
                  height={200}
                  showLabels={false}
                />
              </Suspense>
              <span className="text-muted-foreground text-[11px] tracking-wide">
                Staff
              </span>
            </div>
          </div>
        </div>

        <Separator />

        {/* ════════════════════════════════════════════════
            SECTION 2 – Formula & Notes (full-width highlight)
            ════════════════════════════════════════════════ */}
        <section className="rounded-xl bg-primary/5 border border-primary/10 p-5 sm:p-6 space-y-4">
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
            <span className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">
              Formula
            </span>
            <span className="text-xl font-bold tracking-wide">
              {chord.formula.join(" · ")}
            </span>
            <span className="text-muted-foreground text-xs">
              Semitones: {chord.semitonePattern.join(" · ")}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted-foreground text-xs uppercase tracking-wider font-semibold mr-1">
              Notes
            </span>
            {chord.composed.map((tone) => (
              <span
                key={`${chord.id}-${tone.degree}-${tone.note}`}
                className="inline-flex items-center gap-1 rounded-lg border border-primary/20 bg-background px-3 py-1.5 text-sm font-medium"
              >
                {tone.note}
                <span className="text-muted-foreground text-xs font-normal">
                  {degreeLabel(tone.degree)}
                </span>
                {tone.role === "tension" && (
                  <span className="text-amber-500 text-[9px]">T</span>
                )}
              </span>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════════════
            SECTION 3 – Theory Analysis (2-col grid)
            ════════════════════════════════════════════════ */}
        <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
          {/* Komponen Chord */}
          {chord.type.length > 0 && (
            <section>
              <h2 className="mb-3 text-lg font-semibold">Komponen Chord</h2>
              <div className="space-y-3">
                {chord.type.map((t) => (
                  <div key={t.name}>
                    <h3 className="text-sm font-semibold mb-0.5">{t.name}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Fungsi Harmonik */}
          {chord.functionHints.length > 0 && (
            <section>
              <h2 className="mb-3 text-lg font-semibold">Fungsi Harmonik</h2>
              <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
                {chord.functionHints.map((hint, i) => (
                  <li key={i}>{hint}</li>
                ))}
              </ul>
            </section>
          )}

          {/* Roman Numeral */}
          {chord.romanNumeralHints.length > 0 && (
            <section>
              <h2 className="mb-3 text-lg font-semibold">
                Roman Numeral Analysis
              </h2>
              <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
                {chord.romanNumeralHints.map((hint, i) => (
                  <li key={i}>{hint}</li>
                ))}
              </ul>
            </section>
          )}

          {/* Skala yang Cocok */}
          {chord.commonScales.length > 0 && (
            <section>
              <h2 className="mb-3 text-lg font-semibold">Skala yang Cocok</h2>
              <div className="flex flex-wrap gap-2">
                {chord.commonScales.map((scale) => (
                  <Badge key={scale} variant="outline">
                    {scale}
                  </Badge>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* ════════════════════════════════════════════════
            SECTION 4 – Voicing Recommendations (full-width)
            ════════════════════════════════════════════════ */}
        <section>
          <h2 className="mb-4 text-lg font-semibold">Rekomendasi Voicing</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {(["piano", "guitar", "bass"] as const).map((instrument) => (
              <div key={instrument}>
                <h3 className="text-sm font-semibold capitalize mb-3">
                  {instrument === "guitar"
                    ? "🎸 Guitar"
                    : instrument === "piano"
                      ? "🎹 Piano"
                      : "🎸 Bass"}
                </h3>
                <div className="space-y-3">
                  {(["low", "mid", "high"] as const).map((register) => {
                    const voicings =
                      chord.recommendedVoicings[instrument][register];
                    if (!voicings || voicings.length === 0) return null;
                    return (
                      <div key={register}>
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                          {register}
                        </span>
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          {voicings.map((v, i) => (
                            <span
                              key={i}
                              className="rounded bg-muted px-1.5 py-0.5 text-[11px] font-mono"
                            >
                              {v.join("–")}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════════════
            SECTION 5 – Fingerpicking Patterns (full-width, tabs)
            ════════════════════════════════════════════════ */}
        <Separator />
        <ChordFingerpickingSection
          chordName={chord.name}
          pitchClasses={highlightedPitchClasses}
        />

        {/* ════════════════════════════════════════════════
            SECTION 6 – Related Chords (full-width)
            ════════════════════════════════════════════════ */}
        {related.length > 0 && (
          <>
            <Separator />
            <section>
              <h2 className="mb-4 text-lg font-semibold">
                Chord {chord.root} Lainnya
              </h2>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3 lg:grid-cols-4">
                {related.map((rel) => (
                  <Link
                    key={rel.id}
                    to={`/chord/${rel.id}`}
                    prefetch="intent"
                    className="group flex flex-col gap-0.5 rounded-lg py-2 px-2 -mx-2 transition-colors hover:bg-muted/50"
                  >
                    <span className="font-medium text-sm group-hover:text-primary transition-colors">
                      {rel.name}
                    </span>
                    <span className="text-[11px] text-muted-foreground capitalize">
                      {rel.quality} · {rel.family}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          </>
        )}

        {/* ════════════════════════════════════════════════
            SECTION 6.5 – Cross-References (Intervals, Scales & Glossary)
            ════════════════════════════════════════════════ */}
        {(relations.intervals.length > 0 ||
          relations.scales.length > 0 ||
          relations.glossary.length > 0) && (
          <>
            <Separator />
            <section className="space-y-6">
              <h2 className="text-lg font-semibold">Relasi Teori Musik</h2>

              <div className="grid gap-x-10 gap-y-6 sm:grid-cols-2">
                {/* Intervals in this chord */}
                {relations.intervals.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold mb-2 text-muted-foreground uppercase tracking-wider">
                      Interval Pembentuk
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {relations.intervals.map((ref: MusicEntityRef) => (
                        <Link
                          key={ref.id}
                          to={entityToRoute(ref)}
                          prefetch="intent"
                          className="inline-flex items-center rounded-lg border border-primary/20 bg-background px-3 py-1.5 text-sm font-medium transition-colors hover:bg-primary/10 hover:border-primary/40"
                        >
                          {ref.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Scales that use this chord type */}
                {relations.scales.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold mb-2 text-muted-foreground uppercase tracking-wider">
                      Skala yang Cocok
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {relations.scales.map((ref: MusicEntityRef) => (
                        <Link
                          key={ref.id}
                          to={entityToRoute(ref)}
                          prefetch="intent"
                          className="inline-flex items-center rounded-lg border border-primary/20 bg-background px-3 py-1.5 text-sm font-medium transition-colors hover:bg-primary/10 hover:border-primary/40"
                        >
                          {ref.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Dictionary / Nolopedia glossary */}
                {relations.glossary.length > 0 && (
                  <div className="sm:col-span-2">
                    <h3 className="text-sm font-semibold mb-2 text-muted-foreground uppercase tracking-wider">
                      Istilah di Nolopedia
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {relations.glossary.map((ref: MusicEntityRef) => (
                        <Link
                          key={ref.id}
                          to={entityToRoute(ref)}
                          prefetch="intent"
                          className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-background px-3 py-1.5 text-sm font-medium transition-colors hover:bg-emerald-500/10 hover:border-emerald-500/40"
                        >
                          <BookOpen className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                          {ref.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          </>
        )}

        {/* ════════════════════════════════════════════════
            SECTION 7 – Cross-links & Navigation
            ════════════════════════════════════════════════ */}
        <Separator />
        <nav className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-4">
            <Link to="/chord" className="text-sm text-primary hover:underline">
              ← Kembali ke Chord Explorer
            </Link>
            <Link
              to={`/interval?root=${encodeURIComponent(chord.root)}`}
              prefetch="intent"
              className="text-sm text-primary hover:underline"
            >
              Intervals dari {chord.root} →
            </Link>
            <Link
              to={`/family?root=${encodeURIComponent(chord.root)}`}
              prefetch="intent"
              className="text-sm text-primary hover:underline"
            >
              Family {chord.root} →
            </Link>
          </div>
          <Link
            to={`/chord?root=${encodeURIComponent(chord.root)}`}
            className="text-sm text-muted-foreground hover:text-primary hover:underline"
          >
            Lihat semua chord {chord.root} →
          </Link>
        </nav>
      </article>

      {/* ── Bottom Fretboard Bar ──────────────────────── */}
      <ChordFretboardBar
        highlightedPitchClasses={highlightedPitchClasses}
        label={`${chord.name} – Guitar Fretboard`}
      />
    </>
  );
}
