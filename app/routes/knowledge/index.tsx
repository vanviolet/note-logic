// ════════════════════════════════════════════════════════
// /knowledge – Article List Page
// ════════════════════════════════════════════════════════

import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router";
import type { Route } from "./+types/index";
import {
  ALL_KNOWLEDGE_ARTICLES,
  KNOWLEDGE_CATEGORY_META,
  KNOWLEDGE_LEVEL_META,
  searchKnowledge,
} from "~/theory-music/knowledge";
import type {
  KnowledgeArticle,
  KnowledgeCategory,
} from "~/theory-music/knowledge";
import { Input } from "~/templates/components/ui/input";
import { Badge } from "~/templates/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/templates/components/ui/select";
import { BookOpen, Clock, Search, Sparkles, ArrowRight } from "lucide-react";
import { cn } from "~/templates/lib/utils";
import { KnowledgeIcon } from "./components/knowledge-icon";

// ── Meta ───────────────────────────────────────────────

export function meta(_args: Route.MetaArgs) {
  return [
    { title: "Music Knowledge — NoteLogic" },
    {
      name: "description",
      content:
        "Artikel interaktif tentang matematika musik, sejarah, akustik, psikologi, dan tradisi musik dunia.",
    },
  ];
}

// ── Component ──────────────────────────────────────────

type CategoryFilter = "all" | KnowledgeCategory;

const CATEGORY_OPTIONS: Array<{ value: CategoryFilter; label: string }> = [
  { value: "all", label: "Semua Kategori" },
  ...Object.entries(KNOWLEDGE_CATEGORY_META).map(([key, meta]) => ({
    value: key as KnowledgeCategory,
    label: meta.label,
  })),
];

export default function KnowledgeListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const initialCategory = (searchParams.get("category") ??
    "all") as CategoryFilter;

  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<CategoryFilter>(initialCategory);

  const filtered = useMemo(() => {
    let results: KnowledgeArticle[] = ALL_KNOWLEDGE_ARTICLES;

    if (category !== "all") {
      results = results.filter((a) => a.category === category);
    }

    if (query.trim()) {
      const ids = new Set(searchKnowledge(query).map((a) => a.id));
      results = results.filter((a) => ids.has(a.id));
    }

    return results;
  }, [query, category]);

  const handleQueryChange = (value: string) => {
    setQuery(value);
    const next = new URLSearchParams(searchParams);
    if (value) next.set("q", value);
    else next.delete("q");
    setSearchParams(next, { replace: true });
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value as CategoryFilter);
    const next = new URLSearchParams(searchParams);
    if (value !== "all") next.set("category", value);
    else next.delete("category");
    setSearchParams(next, { replace: true });
  };

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 md:px-6">
      {/* ── Hero ── */}
      <div className="mb-10 space-y-3 text-center">
        <div className="flex items-center justify-center gap-3">
          <Sparkles className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Music Knowledge
          </h1>
        </div>
        <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
          Artikel interaktif tentang matematika, sejarah, sains, psikologi, dan
          tradisi musik dunia. Setiap artikel dilengkapi widget interaktif dan
          quiz.
        </p>
      </div>

      {/* ── Filters ── */}
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari artikel..."
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={category} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-full sm:w-56">
            <SelectValue placeholder="Kategori" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORY_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* ── Article Grid ── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <BookOpen className="mb-4 h-12 w-12 text-muted-foreground/40" />
          <p className="text-muted-foreground text-lg">
            Tidak ada artikel yang cocok.
          </p>
          <p className="text-muted-foreground/60 text-sm">
            Coba ubah kata kunci atau kategori filter.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filtered.map((article) => (
            <KnowledgeCard key={article.id} article={article} />
          ))}
        </div>
      )}

      {/* ── Stats ── */}
      <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
        <span>{ALL_KNOWLEDGE_ARTICLES.length} artikel</span>
        <span>·</span>
        <span>
          {ALL_KNOWLEDGE_ARTICLES.reduce((s, a) => s + a.readingTime, 0)} menit
          total bacaan
        </span>
        <span>·</span>
        <span>
          {ALL_KNOWLEDGE_ARTICLES.reduce(
            (s, a) =>
              s +
              a.sections.reduce(
                (ss, sec) =>
                  ss +
                  (sec.widget?.type === "quiz"
                    ? sec.widget.questions.length
                    : 0),
                0,
              ),
            0,
          )}{" "}
          pertanyaan quiz
        </span>
      </div>
    </section>
  );
}

// ── Article Card Component ─────────────────────────────

function KnowledgeCard({ article }: { article: KnowledgeArticle }) {
  const catMeta = KNOWLEDGE_CATEGORY_META[article.category];
  const levelMeta = KNOWLEDGE_LEVEL_META[article.level];

  return (
    <Link
      to={`/knowledge/${article.id}`}
      prefetch="intent"
      className={cn(
        "group relative flex flex-col rounded-xl border border-border/50 p-6",
        "transition-all duration-200 hover:border-primary/30 hover:bg-muted/30",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
      )}
    >
      {/* Icon + Title */}
      <div className="mb-3 flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <KnowledgeIcon
            name={article.heroIcon}
            className="h-5 w-5 text-primary"
          />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-semibold tracking-tight group-hover:text-primary transition-colors">
            {article.title}
          </h2>
          <p className="text-muted-foreground/70 text-sm">{article.subtitle}</p>
        </div>
      </div>

      {/* Description */}
      <p className="text-muted-foreground mb-4 line-clamp-3 text-sm leading-relaxed">
        {article.description}
      </p>

      {/* Badges */}
      <div className="mt-auto flex flex-wrap items-center gap-2">
        <Badge variant={levelMeta.variant}>{levelMeta.label}</Badge>
        <span className={cn("text-xs font-medium", catMeta.color)}>
          {catMeta.label}
        </span>
        <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          {article.readingTime} min
        </span>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <BookOpen className="h-3 w-3" />
          {article.sections.length} bagian
        </span>
      </div>

      {/* Hover arrow */}
      <ArrowRight className="absolute bottom-6 right-6 h-4 w-4 text-primary opacity-0 transition-opacity group-hover:opacity-100" />
    </Link>
  );
}
