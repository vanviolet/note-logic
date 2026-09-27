// ════════════════════════════════════════════════════════
// Nolopedia – Shared utilities, labels & SEO helpers
// ════════════════════════════════════════════════════════

import type {
  DictionaryCategory,
  DictionaryEntry,
} from "~/theory-music/dictionary/types";

// ── Site URL (used for canonical + JSON-LD) ────────────
export const SITE_URL = "https://notelogic.app";

// ── Category labels ────────────────────────────────────
export const CATEGORY_LABELS: Record<DictionaryCategory, string> = {
  notation: "Notasi",
  rhythm: "Ritme",
  pitch: "Pitch",
  interval: "Interval",
  scale: "Skala",
  chord: "Chord",
  harmony: "Harmoni",
  form: "Bentuk",
  analysis: "Analisis",
  audio: "Audio & Akustik",
  dynamics: "Dinamika",
  articulation: "Artikulasi",
  ornament: "Ornamen & Efek",
  technique: "Teknik Gitar",
  effect: "Efek Produksi",
};

export const CATEGORY_KEYS = Object.keys(
  CATEGORY_LABELS,
) as DictionaryCategory[];

// ── Difficulty labels ──────────────────────────────────
export const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: "Pemula",
  intermediate: "Menengah",
  advanced: "Lanjutan",
};

export const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: "text-emerald-500",
  intermediate: "text-amber-500",
  advanced: "text-rose-500",
};

// ── SEO: JSON-LD generators ───────────────────────────

/**
 * JSON-LD DefinedTerm for a single dictionary entry.
 * @see https://schema.org/DefinedTerm
 */
export function buildDefinedTermJsonLd(entry: DictionaryEntry) {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: entry.term,
    description: entry.shortDefinition,
    url: `${SITE_URL}/nolopedia/${entry.id}`,
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      name: "Nolopedia – Kamus Teori Musik",
      url: `${SITE_URL}/nolopedia`,
    },
  };
}

/**
 * JSON-LD BreadcrumbList for detail pages.
 * @see https://schema.org/BreadcrumbList
 */
export function buildBreadcrumbJsonLd(entry: DictionaryEntry) {
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
        name: "Nolopedia",
        item: `${SITE_URL}/nolopedia`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: entry.term,
      },
    ],
  };
}

/**
 * JSON-LD CollectionPage for the list page.
 * @see https://schema.org/CollectionPage
 */
export function buildCollectionPageJsonLd(totalEntries: number) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Nolopedia – Kamus Teori Musik Lengkap",
    description:
      "Ensiklopedia interaktif teori musik dengan 170+ entri mencakup pitch, chord, skala, ritme, teknik gitar, dinamika, dan lainnya.",
    url: `${SITE_URL}/nolopedia`,
    numberOfItems: totalEntries,
    isPartOf: {
      "@type": "WebSite",
      name: "NoteLogic",
      url: SITE_URL,
    },
  };
}

// ── Search / filter helpers ────────────────────────────

/** Client-side full-text filter across term, aliases, tags, definition. */
export function filterEntries(
  entries: DictionaryEntry[],
  query: string,
  category: string,
): DictionaryEntry[] {
  let filtered = entries;

  if (category && category !== "all") {
    filtered = filtered.filter((e) => e.category === category);
  }

  if (query) {
    const lc = query.toLowerCase();
    filtered = filtered.filter((e) => {
      if (e.term.toLowerCase().includes(lc)) return true;
      if (e.termId?.toLowerCase().includes(lc)) return true;
      if (e.aliases?.some((a) => a.toLowerCase().includes(lc))) return true;
      if (e.tags?.some((t) => t.toLowerCase().includes(lc))) return true;
      if (e.shortDefinition.toLowerCase().includes(lc)) return true;
      return false;
    });
  }

  return filtered;
}

/** Paginate an array with consistent shape. */
export function paginate<T>(
  items: T[],
  page: number,
  pageSize: number,
): { data: T[]; total: number; page: number; totalPages: number } {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  return {
    data: items.slice(start, start + pageSize),
    total,
    page: safePage,
    totalPages,
  };
}

/** Build page number array with ellipsis markers (null). */
export function buildPageNumbers(
  current: number,
  total: number,
): (number | null)[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | null)[] = [1];

  if (current > 3) pages.push(null);

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push(null);

  pages.push(total);
  return pages;
}
