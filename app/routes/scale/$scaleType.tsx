// ════════════════════════════════════════════════════════
// /scale/:scaleType – Scale Detail Page
// ════════════════════════════════════════════════════════
//
// Dynamic route for each scale (e.g. /scale/dorian, /scale/blues).
// SSR loader generates the scale in C by default, but root can
// be changed via ?root= query. Full SEO with meta, JSON-LD,
// breadcrumbs, canonical URL, and 404 handling.
// ════════════════════════════════════════════════════════

import { useMemo } from "react";
import { Link, useSearchParams } from "react-router";
import type { Route } from "./+types/$scaleType";
import {
  generateScale,
  getScaleSpec,
  getScaleKeys,
} from "~/theory-music/scales";
import type { ScaleInstance } from "~/theory-music/scales";
import { Badge } from "~/templates/components/ui/badge";
import { Separator } from "~/templates/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/templates/components/ui/breadcrumb";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Ear,
  Globe,
  GraduationCap,
  Guitar,
  Lightbulb,
  Music,
  Piano,
  Sparkles,
} from "lucide-react";
import { cn } from "~/templates/lib/utils";
import { ROOT_FILTER_OPTIONS } from "~/shared/constants/music";
import {
  difficultyBadgeVariant,
  difficultyLabel,
  familyLabel,
} from "./lib/scale-utils";

// ── Constants ──────────────────────────────────────────

const SITE_URL = "https://notelogic.app";

// ── Loader ─────────────────────────────────────────────

export function loader({ params }: Route.LoaderArgs) {
  const spec = getScaleSpec(params.scaleType);
  if (!spec) {
    throw new Response("Skala tidak ditemukan", { status: 404 });
  }

  // Get all keys to find adjacent scales for prev/next navigation
  const allKeys = getScaleKeys();
  const currentIdx = allKeys.indexOf(params.scaleType);
  const prevKey = currentIdx > 0 ? allKeys[currentIdx - 1] : null;
  const nextKey =
    currentIdx < allKeys.length - 1 ? allKeys[currentIdx + 1] : null;

  const prevScale = prevKey ? getScaleSpec(prevKey) : null;
  const nextScale = nextKey ? getScaleSpec(nextKey) : null;

  // Related scales from the spec
  const relatedKeys = (spec.relatedScales ?? [])
    .map((name) => {
      // Try to find a scale key that matches the name
      return allKeys.find((k) => {
        const s = getScaleSpec(k);
        return (
          s &&
          (s.name.toLowerCase() === name.toLowerCase() ||
            k.toLowerCase() === name.toLowerCase().replace(/\s+/g, "-") ||
            k.toLowerCase() === name.toLowerCase().replace(/\s+/g, "_"))
        );
      });
    })
    .filter(Boolean) as string[];

  const relatedScales = relatedKeys
    .map((k) => getScaleSpec(k))
    .filter(Boolean)
    .slice(0, 6);

  return {
    scaleType: params.scaleType,
    spec,
    prevScale: prevScale ? { key: prevKey!, name: prevScale.name } : null,
    nextScale: nextScale ? { key: nextKey!, name: nextScale.name } : null,
    relatedScales,
  };
}

// ── Meta (dynamic SEO) ────────────────────────────────

export function meta({ data }: Route.MetaArgs) {
  if (!data?.spec) {
    return [
      { title: "Skala Tidak Ditemukan — Scale Explorer | NoteLogic" },
      {
        name: "description",
        content: "Skala musik yang dicari tidak ditemukan.",
      },
    ];
  }

  const { spec, scaleType } = data;
  const title = `${spec.name} Scale — Scale Explorer | NoteLogic`;
  const description =
    `${spec.name}: ${spec.desc} Family: ${familyLabel(spec.family)}, Difficulty: ${difficultyLabel(spec.difficulty)}. ${spec.genres.slice(0, 3).join(", ")}. Lengkap dengan tips latihan, fingering piano & gitar, dan ear training hints.`.slice(
      0,
      160,
    );

  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: `${spec.name} — Scale Explorer` },
    { property: "og:description", content: description },
    { property: "og:type", content: "article" },
    { property: "og:url", content: `${SITE_URL}/scale/${scaleType}` },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    {
      name: "keywords",
      content: [
        spec.name,
        ...(spec.aliases ?? []),
        spec.family,
        spec.region,
        ...spec.genres,
        "scale",
        "music theory",
        "skala musik",
      ]
        .filter(Boolean)
        .join(", "),
    },
  ];
}

// ── JSON-LD structured data ────────────────────────────

function buildScaleJsonLd(spec: ReturnType<typeof getScaleSpec>, url: string) {
  if (!spec) return null;
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOccupationalCredential",
    name: `${spec.name} Scale`,
    description: spec.desc,
    url,
    educationalLevel: spec.difficulty,
    about: {
      "@type": "Thing",
      name: spec.name,
      alternateName: spec.aliases,
    },
    isPartOf: {
      "@type": "WebPage",
      name: "Scale Explorer — NoteLogic",
      url: `${SITE_URL}/scale`,
    },
  };
}

function buildBreadcrumbJsonLd(scaleName: string, scaleType: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Scale Explorer",
        item: `${SITE_URL}/scale`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: scaleName,
        item: `${SITE_URL}/scale/${scaleType}`,
      },
    ],
  };
}

// ── Component ──────────────────────────────────────────

export default function ScaleDetailPage({ loaderData }: Route.ComponentProps) {
  const { spec, scaleType, prevScale, nextScale, relatedScales } = loaderData;
  const [searchParams, setSearchParams] = useSearchParams();

  const root = searchParams.get("root") ?? "C";

  // Generate the scale instance for the selected root
  const scale: ScaleInstance = useMemo(
    () =>
      generateScale(root, scaleType as Parameters<typeof generateScale>[1], {
        spell: "auto",
      }),
    [root, scaleType],
  );

  const learning = scale.learning;
  const canonicalUrl = `${SITE_URL}/scale/${scaleType}`;

  const setRoot = (v: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (v !== "C") next.set("root", v);
      else next.delete("root");
      return next;
    });
  };

  return (
    <article className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* ── JSON-LD ─────────────────────────────────── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildScaleJsonLd(spec, canonicalUrl)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildBreadcrumbJsonLd(spec.name, scaleType)),
        }}
      />
      <link rel="canonical" href={canonicalUrl} />

      {/* ── Breadcrumb ──────────────────────────────── */}
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
              <Link to="/scale">Scale Explorer</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{spec.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* ── Hero Header ─────────────────────────────── */}
      <header className="mb-8 space-y-4">
        <Link
          to="/scale"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Kembali ke Scale Explorer
        </Link>

        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <Music className="h-7 w-7 text-primary" />
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {scale.scale}
            </h1>
            <p className="text-lg text-muted-foreground">
              {scale.root} · {scale.notes.join(" – ")}
            </p>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={difficultyBadgeVariant(scale.difficulty)}>
            {difficultyLabel(scale.difficulty)}
          </Badge>
          <span className="text-xs font-medium text-muted-foreground">
            {familyLabel(scale.family)}
          </span>
          {scale.region && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Globe className="h-3 w-3" />
              {scale.region}
            </span>
          )}
          {scale.aliases.length > 0 && (
            <span className="text-xs text-muted-foreground">
              Alias: {scale.aliases.join(", ")}
            </span>
          )}
        </div>

        {/* Description */}
        <div className="rounded-lg bg-primary/5 border border-primary/10 p-4">
          <p className="text-sm leading-relaxed">{scale.description}</p>
        </div>
      </header>

      {/* ── Root Selector ───────────────────────────── */}
      <section className="mb-8">
        <h2 className="mb-3 text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Pilih Root Note
        </h2>
        <div className="flex flex-wrap gap-1.5">
          {ROOT_FILTER_OPTIONS.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRoot(r)}
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
      </section>

      {/* ── Notes / Composed ────────────────────────── */}
      <section className="mb-8">
        <h2 className="mb-3 flex items-center gap-1.5 text-sm font-medium uppercase tracking-wider text-muted-foreground">
          <Sparkles className="size-3.5" /> Nada dalam {scale.root}{" "}
          {scale.scale}
        </h2>
        <div className="flex flex-wrap gap-2">
          {scale.composed.map((c, i) => (
            <div
              key={`${scale.type}-note-${c.degree}`}
              className={cn(
                "flex flex-col items-center rounded-lg border px-3 py-2 min-w-12",
                i === 0
                  ? "border-primary/50 bg-primary/10"
                  : "border-border/60 bg-muted/20",
              )}
            >
              <span className="text-lg font-bold">{c.note}</span>
              <span className="text-[10px] text-muted-foreground">
                {c.degree}
              </span>
            </div>
          ))}
        </div>
      </section>

      <Separator className="mb-8" />

      {/* ── Scale Anatomy ───────────────────────────── */}
      <div className="mb-8 grid gap-8 md:grid-cols-2">
        <section className="space-y-5">
          <h2 className="flex items-center gap-1.5 text-sm font-medium uppercase tracking-wider text-muted-foreground">
            <Music className="size-3.5" /> Anatomi Skala
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
              <span className="text-muted-foreground">Formula</span>
              <span className="font-medium">{scale.degrees.join(" – ")}</span>
              <span className="text-muted-foreground">Interval Pattern</span>
              <span className="font-mono text-xs font-medium">
                {scale.stepFormula.join(" - ")}
              </span>
              <span className="text-muted-foreground">Semitone Pattern</span>
              <span className="font-mono text-xs font-medium">
                {scale.semitonePattern.join(", ")}
              </span>
              {scale.modeOf && (
                <>
                  <span className="text-muted-foreground">Mode Of</span>
                  <span className="font-medium">{scale.modeOf}</span>
                </>
              )}
              {scale.parentScale && (
                <>
                  <span className="text-muted-foreground">Parent Scale</span>
                  <span className="font-medium">{scale.parentScale}</span>
                </>
              )}
            </div>

            {/* Characteristic Degrees */}
            {scale.characteristicDegrees.length > 0 && (
              <div>
                <p className="text-muted-foreground text-xs mb-1.5">
                  Characteristic Degrees
                </p>
                <div className="flex flex-wrap gap-1">
                  {scale.characteristicDegrees.map((d) => (
                    <Badge
                      key={`char-${d}`}
                      variant="secondary"
                      className="text-[10px]"
                    >
                      {d}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Avoid Degrees */}
            {scale.avoidDegrees.length > 0 && (
              <div>
                <p className="text-muted-foreground text-xs mb-1.5">
                  Avoid Degrees
                </p>
                <div className="flex flex-wrap gap-1">
                  {scale.avoidDegrees.map((d) => (
                    <Badge
                      key={`avoid-${d}`}
                      variant="destructive"
                      className="text-[10px]"
                    >
                      {d}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Common Chords */}
            {scale.commonChords.length > 0 && (
              <div>
                <p className="text-muted-foreground text-xs mb-1.5">
                  Common Chords
                </p>
                <div className="flex flex-wrap gap-1">
                  {scale.commonChords.map((ch) => (
                    <Badge
                      key={`chord-${ch}`}
                      variant="outline"
                      className="text-[10px]"
                    >
                      {ch}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Genres */}
            {scale.genres.length > 0 && (
              <div>
                <p className="text-muted-foreground text-xs mb-1.5">Genres</p>
                <div className="flex flex-wrap gap-1">
                  {scale.genres.map((g) => (
                    <Badge
                      key={`genre-${g}`}
                      variant="outline"
                      className="text-[10px]"
                    >
                      {g}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── Learning Content ──────────────────────── */}
        <section className="space-y-5">
          {/* Ear Training */}
          {learning?.earTrainingHint && (
            <div className="space-y-1.5">
              <h2 className="flex items-center gap-1.5 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                <Ear className="size-3.5" /> Ear Training
              </h2>
              <div className="rounded-lg border border-border/60 bg-muted/20 px-4 py-3">
                <p className="text-sm italic leading-relaxed text-muted-foreground">
                  {learning.earTrainingHint}
                </p>
              </div>
            </div>
          )}

          {/* Practice Tips */}
          {learning?.practiceTips && learning.practiceTips.length > 0 && (
            <div className="space-y-1.5">
              <h2 className="flex items-center gap-1.5 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                <Lightbulb className="size-3.5" /> Tips Latihan
              </h2>
              <ul className="text-muted-foreground list-disc space-y-1.5 pl-4 text-sm">
                {learning.practiceTips.map((tip, i) => (
                  <li key={`tip-${i}`}>{tip}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Harmonic Applications */}
          {learning?.harmonicApplications &&
            learning.harmonicApplications.length > 0 && (
              <div className="space-y-1.5">
                <h2 className="flex items-center gap-1.5 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                  <GraduationCap className="size-3.5" /> Harmonic Applications
                </h2>
                <ul className="text-muted-foreground list-disc space-y-1.5 pl-4 text-sm">
                  {learning.harmonicApplications.map((app, i) => (
                    <li key={`app-${i}`}>{app}</li>
                  ))}
                </ul>
              </div>
            )}
        </section>
      </div>

      {/* ── Piano Fingering ─────────────────────────── */}
      {learning?.pianoFingering && (
        <>
          <Separator className="mb-8" />
          <section className="mb-8 space-y-3">
            <h2 className="flex items-center gap-1.5 text-sm font-medium uppercase tracking-wider text-muted-foreground">
              <Piano className="size-3.5" /> Piano Fingering
            </h2>
            <div className="rounded-xl border border-border/60 bg-muted/10 p-5">
              <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
                <span className="text-muted-foreground">Reference Root</span>
                <span className="font-medium">
                  {learning.pianoFingering.referenceRoot}
                </span>
                <span className="text-muted-foreground">Tangan Kanan ↑</span>
                <span className="font-mono text-sm font-medium">
                  {learning.pianoFingering.rightHandAsc}
                </span>
                <span className="text-muted-foreground">Tangan Kiri ↑</span>
                <span className="font-mono text-sm font-medium">
                  {learning.pianoFingering.leftHandAsc}
                </span>
              </div>
              {learning.pianoFingering.notes && (
                <p className="text-muted-foreground mt-3 text-sm italic border-t border-border/40 pt-3">
                  {learning.pianoFingering.notes}
                </p>
              )}
            </div>
          </section>
        </>
      )}

      {/* ── Guitar Positions ────────────────────────── */}
      {learning?.guitarPositions && learning.guitarPositions.length > 0 && (
        <>
          <Separator className="mb-8" />
          <section className="mb-8 space-y-3">
            <h2 className="flex items-center gap-1.5 text-sm font-medium uppercase tracking-wider text-muted-foreground">
              <Guitar className="size-3.5" /> Posisi Gitar
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {learning.guitarPositions.map((pos, i) => (
                <div
                  key={`gpos-${i}`}
                  className="rounded-xl border border-border/60 bg-muted/10 p-4"
                >
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="font-medium">{pos.name}</span>
                    <Badge variant="outline" className="text-[10px]">
                      Fret {pos.startFret}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {pos.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* ── Song Examples ───────────────────────────── */}
      {scale.songExamples.length > 0 && (
        <>
          <Separator className="mb-8" />
          <section className="mb-8 space-y-3">
            <h2 className="flex items-center gap-1.5 text-sm font-medium uppercase tracking-wider text-muted-foreground">
              <BookOpen className="size-3.5" /> Contoh Lagu
            </h2>
            <div className="space-y-2">
              {scale.songExamples.map((song) => (
                <div
                  key={`song-${song.title}`}
                  className="flex items-baseline gap-2 rounded-lg border border-border/40 bg-muted/10 px-4 py-2.5"
                >
                  <span className="font-medium text-sm">{song.title}</span>
                  <span className="text-muted-foreground text-sm">
                    · {song.artist}
                  </span>
                  {song.note && (
                    <span className="text-muted-foreground/70 text-xs ml-auto">
                      {song.note}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* ── Related Scales ──────────────────────────── */}
      {relatedScales.length > 0 && (
        <>
          <Separator className="mb-8" />
          <section className="mb-8 space-y-3">
            <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Related Scales
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {relatedScales.map((rs) => (
                <Link
                  key={rs!.key}
                  to={`/scale/${rs!.key}`}
                  prefetch="intent"
                  className="group rounded-xl border border-border/50 p-4 transition-all hover:border-primary/30 hover:bg-muted/30"
                >
                  <p className="font-medium group-hover:text-primary transition-colors">
                    {rs!.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {familyLabel(rs!.family)} ·{" "}
                    {difficultyLabel(rs!.difficulty)}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        </>
      )}

      <Separator className="mb-6" />

      {/* ── Prev / Next Navigation ──────────────────── */}
      <nav className="flex items-center justify-between gap-4">
        {prevScale ? (
          <Link
            to={`/scale/${prevScale.key}`}
            prefetch="intent"
            className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <div className="text-left">
              <p className="text-[10px] uppercase tracking-wider">Sebelumnya</p>
              <p className="font-medium group-hover:text-primary transition-colors">
                {prevScale.name}
              </p>
            </div>
          </Link>
        ) : (
          <div />
        )}
        {nextScale ? (
          <Link
            to={`/scale/${nextScale.key}`}
            prefetch="intent"
            className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wider">
                Selanjutnya
              </p>
              <p className="font-medium group-hover:text-primary transition-colors">
                {nextScale.name}
              </p>
            </div>
            <ArrowRight className="h-4 w-4" />
          </Link>
        ) : (
          <div />
        )}
      </nav>
    </article>
  );
}
