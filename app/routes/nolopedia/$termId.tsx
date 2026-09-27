// ════════════════════════════════════════════════════════
// /nolopedia/:termId – Dictionary Entry Detail Page
// ════════════════════════════════════════════════════════
//
// SSR: Loader runs on the server for every request, returning the
// entry + related terms. The component receives data via props.
// Full SEO: meta tags, JSON-LD DefinedTerm, breadcrumbs, canonical
// URL, proper 404 HTTP status, and semantic HTML.
// ════════════════════════════════════════════════════════

import { Link } from "react-router";
import type { Route } from "./+types/$termId";
import { DICTIONARY_MAP } from "~/theory-music/dictionary/index";
import { getUserDictionaryEntries } from "~/lib/json-db.server";
import type { DictionaryEntry } from "~/theory-music/dictionary/types";
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
  CATEGORY_LABELS,
  DIFFICULTY_LABELS,
  DIFFICULTY_COLORS,
  SITE_URL,
  buildDefinedTermJsonLd,
  buildBreadcrumbJsonLd,
} from "./lib/nolopedia-utils";

// ── Loader (runs on server per request) ────────────────

export async function loader({ params }: Route.LoaderArgs) {
  // Check built-in entries first, then user entries
  let entry = DICTIONARY_MAP.get(params.termId);

  if (!entry) {
    const userEntries = await getUserDictionaryEntries();
    entry = userEntries.find((e) => e.id === params.termId);
  }

  if (!entry) {
    throw new Response("Istilah tidak ditemukan", { status: 404 });
  }

  // Resolve related terms from both sources
  const userEntries = entry.relatedTerms?.length
    ? await getUserDictionaryEntries()
    : [];
  const userMap = new Map(userEntries.map((e) => [e.id, e]));

  const related: DictionaryEntry[] = (entry.relatedTerms ?? [])
    .map((id) => DICTIONARY_MAP.get(id) ?? userMap.get(id))
    .filter((e): e is DictionaryEntry => e != null);

  return { entry, related };
}

// ── Meta (dynamic per-entry SEO) ───────────────────────

export function meta({ data }: Route.MetaArgs) {
  if (!data?.entry) {
    return [
      { title: "Istilah Tidak Ditemukan | Nolopedia" },
      {
        name: "description",
        content: "Istilah musik yang dicari tidak ditemukan.",
      },
    ];
  }

  const { entry } = data;
  const title = entry.termId
    ? `${entry.term} (${entry.termId}) | Nolopedia`
    : `${entry.term} | Nolopedia`;

  const description =
    entry.shortDefinition.length > 155
      ? `${entry.shortDefinition.slice(0, 152)}…`
      : entry.shortDefinition;

  const categoryLabel = CATEGORY_LABELS[entry.category] ?? entry.category;

  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: `${entry.term} – ${categoryLabel}` },
    { property: "og:description", content: description },
    { property: "og:type", content: "article" },
    { property: "og:url", content: `${SITE_URL}/nolopedia/${entry.id}` },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    {
      name: "keywords",
      content: [
        entry.term,
        ...(entry.aliases ?? []),
        ...(entry.tags ?? []),
        categoryLabel,
      ].join(", "),
    },
  ];
}

// ── Component ──────────────────────────────────────────

export default function NolopediaDetailRoute({
  loaderData,
}: Route.ComponentProps) {
  const { entry, related } = loaderData;

  const categoryLabel = CATEGORY_LABELS[entry.category] ?? entry.category;

  return (
    <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      {/* ── JSON-LD Structured Data ─────────────────── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildDefinedTermJsonLd(entry)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildBreadcrumbJsonLd(entry)),
        }}
      />
      <link rel="canonical" href={`${SITE_URL}/nolopedia/${entry.id}`} />

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
              <Link to="/nolopedia">Nolopedia</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{entry.term}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* ── Header ──────────────────────────────────── */}
      <header className="mb-6 space-y-3">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {entry.term}
        </h1>

        {entry.termId && (
          <p className="text-lg text-muted-foreground italic">{entry.termId}</p>
        )}

        {/* Aliases */}
        {entry.aliases && entry.aliases.length > 0 && (
          <p className="text-sm text-muted-foreground">
            Alias:{" "}
            {entry.aliases.map((a, i) => (
              <span key={a}>
                {i > 0 && ", "}
                <span className="font-medium">{a}</span>
              </span>
            ))}
          </p>
        )}

        {/* Badges: category + subcategory + instrument */}
        <div className="flex flex-wrap gap-2">
          <Badge>{categoryLabel}</Badge>
          <Badge variant="outline">{entry.subCategory}</Badge>
          {entry.instrumentContext !== "general" && (
            <Badge variant="subdominant">
              {entry.instrumentContext === "guitar"
                ? "🎸 Gitar"
                : entry.instrumentContext}
            </Badge>
          )}
        </div>
      </header>

      <Separator className="mb-6" />

      {/* ── Short Definition (highlighted) ──────────── */}
      <section className="mb-6 rounded-lg bg-primary/5 border border-primary/10 p-4">
        <p className="text-base font-medium leading-relaxed">
          {entry.shortDefinition}
        </p>
      </section>

      {/* ── Detailed Definition ─────────────────────── */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">Penjelasan</h2>
        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
          {entry.detailedDefinition}
        </p>
      </section>

      {/* ── Examples ────────────────────────────────── */}
      {entry.examples && entry.examples.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-xl font-semibold">Contoh</h2>
          <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
            {entry.examples.map((ex, i) => (
              <li key={i}>{ex}</li>
            ))}
          </ul>
        </section>
      )}

      {/* ── Bravura Symbol ──────────────────────────── */}
      {entry.bravuraSymbol && (
        <section className="mb-8">
          <h2 className="mb-3 text-xl font-semibold">Simbol Notasi</h2>
          <div className="flex items-center gap-4 rounded-lg border border-border bg-card p-4">
            <span
              className="text-5xl leading-none"
              style={{ fontFamily: "Bravura, serif" }}
              aria-label={entry.bravuraSymbol.label}
            >
              {String.fromCodePoint(entry.bravuraSymbol.codePoint)}
            </span>
            <div>
              <p className="text-sm font-medium">{entry.bravuraSymbol.label}</p>
              <p className="text-xs text-muted-foreground">
                U+
                {entry.bravuraSymbol.codePoint
                  .toString(16)
                  .toUpperCase()
                  .padStart(4, "0")}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ── AlphaTex Reference ──────────────────────── */}
      {entry.alphaTexRef && (
        <section className="mb-8">
          <h2 className="mb-3 text-xl font-semibold">AlphaTex (Studio)</h2>
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-3">
              <code className="rounded bg-muted px-2.5 py-1 font-mono text-sm font-semibold text-primary">
                {entry.alphaTexRef.token}
              </code>
              <Badge variant="outline" className="text-xs">
                {entry.alphaTexRef.level === "beat"
                  ? "Beat-level"
                  : "Note-level"}
              </Badge>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Token yang digunakan di AlphaTex untuk mengaplikasikan efek ini di
              studio.
            </p>
          </div>
        </section>
      )}

      {/* ── Guitar Technique ────────────────────────── */}
      {entry.guitarTechnique && (
        <section className="mb-8">
          <h2 className="mb-3 text-xl font-semibold">
            🎸 Cara Memainkan di Gitar
          </h2>
          <div className="space-y-4 rounded-lg border border-border bg-card p-5">
            {/* Difficulty + hand */}
            <div className="flex flex-wrap gap-2">
              <Badge
                variant="outline"
                className={
                  DIFFICULTY_COLORS[entry.guitarTechnique.difficulty] ?? ""
                }
              >
                {DIFFICULTY_LABELS[entry.guitarTechnique.difficulty] ??
                  entry.guitarTechnique.difficulty}
              </Badge>
              <Badge variant="outline">
                Tangan:{" "}
                {entry.guitarTechnique.hand === "left"
                  ? "Kiri"
                  : entry.guitarTechnique.hand === "right"
                    ? "Kanan"
                    : "Kedua tangan"}
              </Badge>
            </div>

            {/* How to */}
            <div>
              <h3 className="mb-1 text-sm font-semibold">Cara:</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {entry.guitarTechnique.howTo}
              </p>
            </div>

            {/* Fret context */}
            {entry.guitarTechnique.fretContext && (
              <div>
                <h3 className="mb-1 text-sm font-semibold">Konteks Fret:</h3>
                <p className="text-sm text-muted-foreground">
                  {entry.guitarTechnique.fretContext}
                </p>
              </div>
            )}

            {/* Tips */}
            {entry.guitarTechnique.tips &&
              entry.guitarTechnique.tips.length > 0 && (
                <div>
                  <h3 className="mb-1 text-sm font-semibold">Tips:</h3>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                    {entry.guitarTechnique.tips.map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
          </div>
        </section>
      )}

      {/* ── Unicode Symbol ──────────────────────────── */}
      {entry.unicodeSymbol && (
        <section className="mb-8">
          <h2 className="mb-3 text-xl font-semibold">Simbol Unicode</h2>
          <span className="text-4xl">{entry.unicodeSymbol}</span>
        </section>
      )}

      {/* ── Tags ────────────────────────────────────── */}
      {entry.tags && entry.tags.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-xl font-semibold">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {entry.tags.map((tag) => (
              <Link
                key={tag}
                to={`/nolopedia?q=${encodeURIComponent(tag)}`}
                className="inline-block rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Related Terms ───────────────────────────── */}
      {related.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-xl font-semibold">Istilah Terkait</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {related.map((rel) => (
              <Link
                key={rel.id}
                to={`/nolopedia/${rel.id}`}
                prefetch="intent"
                className="group flex flex-col gap-1 rounded-lg border border-border bg-card p-3.5 transition-colors hover:border-primary/40"
              >
                <span className="font-medium text-sm group-hover:text-primary transition-colors">
                  {rel.term}
                </span>
                <span className="text-xs text-muted-foreground line-clamp-2">
                  {rel.shortDefinition}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Back link ───────────────────────────────── */}
      <Separator className="mb-6" />
      <nav className="flex items-center justify-between">
        <Link to="/nolopedia" className="text-sm text-primary hover:underline">
          ← Kembali ke Nolopedia
        </Link>
        <Link
          to={`/nolopedia?category=${entry.category}`}
          className="text-sm text-muted-foreground hover:text-primary hover:underline"
        >
          Lihat semua {categoryLabel}
        </Link>
      </nav>
    </article>
  );
}
