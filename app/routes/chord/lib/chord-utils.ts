// ════════════════════════════════════════════════════════
// Chord Explorer – Shared utilities, labels & SEO helpers
// ════════════════════════════════════════════════════════

import type {
  ChordEntry,
  ChordFamily,
  HarmonicQuality,
} from "~/theory-music/chord";
import { getChordSortWeight, getRootSortWeight } from "~/theory-music/chord";
import { ROOT_OCTAVES } from "~/shared/constants/music";
import { normalizeNoteName } from "~/shared/lib/music-utils";

export { normalizeNoteName } from "~/shared/lib/music-utils";

// ── Site URL ───────────────────────────────────────────
export const SITE_URL = "https://notelogic.app";

// ── Family labels ──────────────────────────────────────
export const FAMILY_LABELS: Record<ChordFamily, string> = {
  triad: "Triad",
  sixth: "Sixth",
  seventh: "Seventh",
  extended: "Extended",
  suspended: "Suspended",
  "added-tone": "Added Tone",
  power: "Power",
  altered: "Altered",
};

export function familyColor(family: ChordFamily) {
  switch (family) {
    case "triad":
      return "bg-blue-100 text-blue-800";
    case "sixth":
      return "bg-green-100 text-green-800";
    case "seventh":
      return "bg-yellow-100 text-yellow-800";
    case "extended":
      return "bg-purple-100 text-purple-800";
    case "suspended":
      return "bg-orange-100 text-orange-800";
    case "added-tone":
      return "bg-teal-100 text-teal-800";
    case "power":
      return "bg-red-100 text-red-800";
    case "altered":
      return "bg-indigo-100 text-indigo-800";
  }
}

// ── Quality labels ─────────────────────────────────────
export const QUALITY_LABELS: Record<HarmonicQuality, string> = {
  major: "Major",
  minor: "Minor",
  dominant: "Dominant",
  diminished: "Diminished",
  augmented: "Augmented",
  suspended: "Suspended",
  power: "Power",
  altered: "Altered",
  mixed: "Mixed",
};

export function qualityColor(quality: HarmonicQuality) {
  switch (quality) {
    case "major":
      return "bg-white text-black";
    case "minor":
      return "bg-black text-white";
    case "dominant":
      return "bg-orange-100 text-orange-800";
    case "diminished":
      return "bg-gray-100 text-gray-800";
    case "augmented":
      return "bg-purple-100 text-purple-800";
    case "suspended":
      return "bg-yellow-100 text-yellow-800";
    case "power":
      return "bg-red-100 text-red-800";
    case "altered":
      return "bg-indigo-100 text-indigo-800";
    case "mixed":
      return "bg-pink-100 text-pink-800";
  }
}

// ── SEO: JSON-LD generators ────────────────────────────

export function buildChordJsonLd(chord: ChordEntry) {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: chord.name,
    description: `${chord.nickname} — Formula: ${chord.formula.join(" ")}. Notes: ${chord.composed.map((t) => t.note).join(", ")}. Quality: ${chord.quality}, Family: ${chord.family}.`,
    url: `${SITE_URL}/chord/${chord.id}`,
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      name: "NoteLogic Chord Explorer",
      url: `${SITE_URL}/chord`,
    },
  };
}

export function buildChordBreadcrumbJsonLd(chord: ChordEntry) {
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
        name: "Chord Explorer",
        item: `${SITE_URL}/chord`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: chord.name,
      },
    ],
  };
}

export function buildChordCollectionJsonLd(totalChords: number) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Chord Explorer – Eksplorasi Chord Musik Lengkap",
    description:
      "Koleksi lengkap chord musik dengan formula, notes, voicing, diagram gitar/piano/ukulele, dan fretboard interaktif. Gratis dan open-source.",
    url: `${SITE_URL}/chord`,
    numberOfItems: totalChords,
    isPartOf: {
      "@type": "WebSite",
      name: "NoteLogic",
      url: SITE_URL,
    },
  };
}

// ── Filter helpers ─────────────────────────────────────

/** Full-text search across chord fields. */
export function includeByQuery(chord: ChordEntry, query: string): boolean {
  const q = query.toLowerCase();
  return (
    chord.name.toLowerCase().includes(q) ||
    chord.nickname.toLowerCase().includes(q) ||
    chord.aliases.some((alias) => alias.toLowerCase().includes(q)) ||
    chord.composed.some((tone) => tone.note.toLowerCase().includes(q)) ||
    chord.type.some((typeInfo) => typeInfo.name.toLowerCase().includes(q))
  );
}

/** Filter chord list by root, family, quality, and text query. */
export function filterChords(
  chords: ChordEntry[],
  query: string,
  root: string,
  family: string,
  quality: string,
): ChordEntry[] {
  let filtered = chords;

  if (root && root !== "all") {
    filtered = filtered.filter((c) => c.root === root);
  }
  if (family && family !== "all") {
    filtered = filtered.filter((c) => c.family === family);
  }
  if (quality && quality !== "all") {
    filtered = filtered.filter((c) => c.quality === quality);
  }
  if (query) {
    filtered = filtered.filter((c) => includeByQuery(c, query.trim()));
  }

  return filtered;
}

/** Sort chords: by root (C first, chromatic order), then by symbol complexity (simpler first). */
export function sortChords(chords: ChordEntry[]): ChordEntry[] {
  return [...chords].sort((a, b) => {
    const rootCmp = getRootSortWeight(a.root) - getRootSortWeight(b.root);
    if (rootCmp !== 0) return rootCmp;
    return getChordSortWeight(a.symbol) - getChordSortWeight(b.symbol);
  });
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

// ── Audio helpers ──────────────────────────────────────

export function toPlayableChordNotes(chord: ChordEntry): string[] {
  const baseOctave = ROOT_OCTAVES[chord.root] ?? 3;
  return chord.composed
    .slice(0, 6)
    .map(
      (tone, index) =>
        `${normalizeNoteName(tone.note)}${baseOctave + Math.floor(index / 2)}`,
    );
}

export function degreeLabel(degree: string) {
  if (degree === "1") return "Root/1";
  return degree;
}
