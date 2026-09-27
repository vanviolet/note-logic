// ════════════════════════════════════════════════════════
// /knowledge/:articleId – Article Detail Page
// ════════════════════════════════════════════════════════

import { Link } from "react-router";
import type { Route } from "./+types/$articleId";
import {
  KNOWLEDGE_MAP,
  KNOWLEDGE_CATEGORY_META,
  KNOWLEDGE_LEVEL_META,
  getRelatedArticles,
} from "~/theory-music/knowledge";
import type { KnowledgeCrossRef } from "~/theory-music/knowledge";
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
  BookOpen,
  Clock,
  ExternalLink,
  Gamepad2,
  Hash,
} from "lucide-react";
import { cn } from "~/templates/lib/utils";
import { SectionRenderer } from "./components/section-renderer";
import { KnowledgeIcon } from "./components/knowledge-icon";

// ── Loader ─────────────────────────────────────────────

export function loader({ params }: Route.LoaderArgs) {
  const article = KNOWLEDGE_MAP.get(params.articleId);
  if (!article) {
    throw new Response("Artikel tidak ditemukan", { status: 404 });
  }

  const related = getRelatedArticles(article);
  return { article, related };
}

// ── Meta (dynamic SEO) ────────────────────────────────

export function meta({ data }: Route.MetaArgs) {
  if (!data?.article) {
    return [
      { title: "Artikel Tidak Ditemukan | Music Knowledge" },
      {
        name: "description",
        content: "Artikel musik yang dicari tidak ditemukan.",
      },
    ];
  }

  const { article } = data;
  return [
    { title: `${article.title} — Music Knowledge | NoteLogic` },
    { name: "description", content: article.description },
    { property: "og:title", content: article.title },
    { property: "og:description", content: article.description },
    { property: "og:type", content: "article" },
    {
      name: "keywords",
      content: article.tags.join(", "),
    },
  ];
}

// ── Cross-ref routing ──────────────────────────────────

function crossRefToHref(ref: KnowledgeCrossRef): string {
  switch (ref.type) {
    case "knowledge":
      return `/knowledge/${ref.id}`;
    case "nolopedia":
      return `/nolopedia/${ref.id}`;
    case "interval":
      return `/interval?highlight=${ref.id}`;
    case "chord":
      return `/chord/${ref.id}`;
    case "family":
      return `/family?highlight=${ref.id}`;
    default:
      return "#";
  }
}

const CROSS_REF_COLORS: Record<string, string> = {
  knowledge: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
  nolopedia: "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20",
  interval: "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20",
  chord: "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20",
  family: "bg-rose-500/10 text-rose-500 hover:bg-rose-500/20",
};

const CROSS_REF_TYPE_LABELS: Record<string, string> = {
  knowledge: "Knowledge",
  nolopedia: "Nolopedia",
  interval: "Interval",
  chord: "Chord",
  family: "Family",
};

// ── Component ──────────────────────────────────────────

export default function KnowledgeArticlePage({
  loaderData,
}: Route.ComponentProps) {
  const { article, related } = loaderData;
  const catMeta = KNOWLEDGE_CATEGORY_META[article.category];
  const levelMeta = KNOWLEDGE_LEVEL_META[article.level];

  // Group cross-refs by type
  const refsByType = article.crossRefs.reduce(
    (acc, ref) => {
      const group = acc[ref.type] ?? [];
      group.push(ref);
      acc[ref.type] = group;
      return acc;
    },
    {} as Record<string, KnowledgeCrossRef[]>,
  );

  return (
    <article className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
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
              <Link to="/knowledge">Music Knowledge</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{article.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* ── Hero Header ─────────────────────────────── */}
      <header className="mb-8 space-y-4">
        {/* Back link */}
        <Link
          to="/knowledge"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Kembali ke daftar artikel
        </Link>

        {/* Icon + Title */}
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <KnowledgeIcon
              name={article.heroIcon}
              className="h-7 w-7 text-primary"
            />
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {article.title}
            </h1>
            <p className="text-lg text-muted-foreground">{article.subtitle}</p>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={levelMeta.variant}>{levelMeta.label}</Badge>
          <span className={cn("text-xs font-medium", catMeta.color)}>
            {catMeta.label}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {article.readingTime} menit
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <BookOpen className="h-3 w-3" />
            {article.sections.length} bagian
          </span>
        </div>

        {/* Description highlight */}
        <div className="rounded-lg bg-primary/5 border border-primary/10 p-4">
          <p className="text-sm leading-relaxed">{article.description}</p>
        </div>
      </header>

      <Separator className="mb-8" />

      {/* ── Table of Contents ───────────────────────── */}
      <nav className="mb-10 rounded-lg border border-border/50 bg-muted/20 p-5">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          <Hash className="mr-1.5 inline h-3.5 w-3.5" />
          Daftar Isi
        </h2>
        <ol className="space-y-1.5">
          {article.sections.map((section, i) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className="flex items-baseline gap-2 rounded-md px-2 py-1 text-sm transition-colors hover:bg-muted/40 hover:text-foreground"
              >
                <span className="shrink-0 text-xs font-mono text-primary/50">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-muted-foreground hover:text-foreground">
                  {section.title}
                </span>
                {section.widget && (
                  <span className="ml-auto flex items-center gap-1 text-[10px] text-primary/40">
                    <Gamepad2 className="h-3 w-3" /> interaktif
                  </span>
                )}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {/* ── Article Sections ────────────────────────── */}
      <div className="space-y-12">
        {article.sections.map((section, i) => (
          <SectionRenderer key={section.id} section={section} index={i} />
        ))}
      </div>

      <Separator className="my-10" />

      {/* ── Cross-References ────────────────────────── */}
      {article.crossRefs.length > 0 && (
        <section className="mb-10 space-y-4">
          <h2 className="text-xl font-bold">
            <ExternalLink className="mr-2 inline h-5 w-5 text-primary/60" />
            Referensi Silang
          </h2>
          <p className="text-sm text-muted-foreground">
            Topik terkait di modul lain yang berkaitan dengan artikel ini.
          </p>
          <div className="space-y-3">
            {Object.entries(refsByType).map(([type, refs]) => (
              <div key={type}>
                <h3 className="mb-2 text-sm font-semibold text-muted-foreground">
                  {CROSS_REF_TYPE_LABELS[type] ?? type}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {refs.map((ref) => (
                    <Link
                      key={`${ref.type}-${ref.id}`}
                      to={crossRefToHref(ref)}
                      prefetch="intent"
                      className={cn(
                        "inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                        CROSS_REF_COLORS[ref.type] ??
                          "bg-muted text-muted-foreground hover:bg-muted/80",
                      )}
                    >
                      {ref.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Related Articles ────────────────────────── */}
      {related.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold">Artikel Terkait</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {related.map((rel) => {
              const relCat = KNOWLEDGE_CATEGORY_META[rel.category];
              return (
                <Link
                  key={rel.id}
                  to={`/knowledge/${rel.id}`}
                  prefetch="intent"
                  className={cn(
                    "group flex items-start gap-3 rounded-lg border border-border/50 p-4",
                    "transition-all hover:border-primary/30 hover:bg-muted/20",
                  )}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <KnowledgeIcon
                      name={rel.heroIcon}
                      className="h-5 w-5 text-primary"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold group-hover:text-primary transition-colors">
                      {rel.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {rel.description}
                    </p>
                    <span
                      className={cn("text-[10px] font-medium", relCat.color)}
                    >
                      {relCat.label}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Tags ────────────────────────────────────── */}
      <div className="mt-10 flex flex-wrap gap-1.5">
        {article.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-muted/50 px-2 py-0.5 text-[10px] text-muted-foreground"
          >
            #{tag}
          </span>
        ))}
      </div>
    </article>
  );
}
