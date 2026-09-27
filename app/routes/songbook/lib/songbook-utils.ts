// ════════════════════════════════════════════════════════
// Songbook – Shared utilities, labels & SEO helpers
// ════════════════════════════════════════════════════════

import type {
  SongEntry,
  SongDifficulty,
  SongSectionType,
} from "~/theory-music/songbook/types";

// ── Site URL (used for canonical + JSON-LD) ────────────
export const SITE_URL = "https://notelogic.app";

// ── Difficulty labels ──────────────────────────────────

export const DIFFICULTY_LABELS: Record<SongDifficulty, string> = {
  beginner: "Pemula",
  intermediate: "Menengah",
  advanced: "Lanjutan",
  expert: "Ahli",
};

export const DIFFICULTY_COLORS: Record<SongDifficulty, string> = {
  beginner: "text-emerald-500 border-emerald-500/40",
  intermediate: "text-amber-500 border-amber-500/40",
  advanced: "text-rose-500 border-rose-500/40",
  expert: "text-purple-500 border-purple-500/40",
};

// ── Section type labels & colors ───────────────────────

export const SECTION_LABELS: Record<SongSectionType, string> = {
  intro: "Intro",
  verse: "Verse",
  "pre-chorus": "Pre-Chorus",
  chorus: "Chorus",
  bridge: "Bridge",
  outro: "Outro",
  interlude: "Interlude",
  solo: "Solo",
  instrumental: "Instrumental",
  break: "Break",
};

export const SECTION_COLORS: Record<SongSectionType, string> = {
  intro: "border-l-sky-500/60",
  verse: "border-l-emerald-500/60",
  "pre-chorus": "border-l-amber-500/60",
  chorus: "border-l-rose-500/60",
  bridge: "border-l-purple-500/60",
  outro: "border-l-sky-500/60",
  interlude: "border-l-slate-500/60",
  solo: "border-l-orange-500/60",
  instrumental: "border-l-indigo-500/60",
  break: "border-l-slate-400/60",
};

// ── Genre labels ───────────────────────────────────────

export const GENRE_LABELS: Record<string, string> = {
  pop: "Pop",
  rock: "Rock",
  alternative: "Alternative",
  indie: "Indie",
  folk: "Folk",
  acoustic: "Acoustic",
  blues: "Blues",
  country: "Country",
  jazz: "Jazz",
  "r-and-b": "R&B",
  reggae: "Reggae",
  metal: "Metal",
  punk: "Punk",
  classical: "Classical",
  ballad: "Ballad",
  soul: "Soul",
  funk: "Funk",
  latin: "Latin",
  "hip-hop": "Hip-Hop",
};

// ── ChordPro parser ────────────────────────────────────

export interface ChordProToken {
  chord?: string;
  text: string;
}

// ── Transpose helpers ──────────────────────────────────

const SHARP_NOTES = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
] as const;

const FLAT_NOTES = [
  "C",
  "Db",
  "D",
  "Eb",
  "E",
  "F",
  "Gb",
  "G",
  "Ab",
  "A",
  "Bb",
  "B",
] as const;

// Map every root name to its semitone index (0-11)
const NOTE_TO_INDEX: Record<string, number> = {
  C: 0,
  "C#": 1,
  Db: 1,
  D: 2,
  "D#": 3,
  Eb: 3,
  E: 4,
  Fb: 4,
  "E#": 5,
  F: 5,
  "F#": 6,
  Gb: 6,
  G: 7,
  "G#": 8,
  Ab: 8,
  A: 9,
  "A#": 10,
  Bb: 10,
  B: 11,
  Cb: 11,
  "B#": 0,
};

/**
 * Regex to parse a chord symbol into root + quality + optional slash bass.
 * Handles: C, C#m7, Db/F, A7sus4, Cmaj7, G/B, Am/E, etc.
 */
const CHORD_RE = /^([A-G][#b]?)(.*?)(?:\/([A-G][#b]?))?$/;

function transposeNote(
  note: string,
  semitones: number,
  preferFlat: boolean,
): string {
  const idx = NOTE_TO_INDEX[note];
  if (idx === undefined) return note; // unknown, return as-is
  const newIdx = (((idx + semitones) % 12) + 12) % 12;
  return preferFlat ? FLAT_NOTES[newIdx] : SHARP_NOTES[newIdx];
}

/**
 * Transpose a chord symbol by the given number of semitones.
 *
 * Examples:
 *   transposeChord("Am", 2)  → "Bm"
 *   transposeChord("G/B", 3) → "Bb/D"
 *   transposeChord("F#m7", -2) → "Em7"
 */
export function transposeChord(chord: string, semitones: number): string {
  if (semitones === 0) return chord;

  const m = CHORD_RE.exec(chord);
  if (!m) return chord; // not a recognized chord, return as-is

  const [, root, quality, bass] = m;
  // Use flats if the original root is a flat note
  const preferFlat = root.includes("b");

  let result = transposeNote(root, semitones, preferFlat) + quality;
  if (bass) {
    result += `/${transposeNote(bass, semitones, preferFlat)}`;
  }
  return result;
}

/**
 * Transpose a musical key string (e.g. "C", "F#m", "Bb") by semitones.
 */
export function transposeKey(key: string, semitones: number): string {
  return transposeChord(key, semitones);
}

/**
 * Parse a ChordPro line into tokens.
 *
 * Input:  `"[C]I walked across an [Am]empty land"`
 * Output: `[{ chord: "C", text: "I walked across an " }, { chord: "Am", text: "empty land" }]`
 *
 * Lines without any `[...]` markers return a single token with just text.
 */
export function parseChordProLine(line: string): ChordProToken[] {
  const tokens: ChordProToken[] = [];
  const regex = /\[([^\]]+)\]/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  // Text before the first chord (if any)
  const firstMatch = regex.exec(line);
  if (!firstMatch) {
    // No chords at all — plain text line
    return [{ text: line }];
  }

  // Any leading text before first chord
  if (firstMatch.index > 0) {
    tokens.push({ text: line.slice(0, firstMatch.index) });
  }

  // First chord
  lastIndex = firstMatch.index + firstMatch[0].length;
  regex.lastIndex = lastIndex;

  // Find next chord to delimit text for current chord
  match = regex.exec(line);
  if (match) {
    tokens.push({
      chord: firstMatch[1],
      text: line.slice(lastIndex, match.index),
    });
  } else {
    // No more chords — rest of line belongs to first chord
    tokens.push({
      chord: firstMatch[1],
      text: line.slice(lastIndex),
    });
    return tokens;
  }

  // Continue processing remaining chords
  while (match) {
    const currentChord = match[1];
    lastIndex = match.index + match[0].length;
    regex.lastIndex = lastIndex;
    const nextMatch = regex.exec(line);
    if (nextMatch) {
      tokens.push({
        chord: currentChord,
        text: line.slice(lastIndex, nextMatch.index),
      });
      match = nextMatch;
    } else {
      tokens.push({
        chord: currentChord,
        text: line.slice(lastIndex),
      });
      break;
    }
  }

  return tokens;
}

/**
 * Returns true if a line is "chord-only" (no lyrics, just chords, optional
 * whitespace and short annotations like "x2").
 */
export function isChordOnlyLine(line: string): boolean {
  const withoutChords = line.replace(/\[[^\]]+\]/g, "").trim();
  // Pure chord-only or chord + short repeat marker (x2, x4 etc.)
  return (
    /\[/.test(line) &&
    (withoutChords.length === 0 || /^x\d+$/i.test(withoutChords))
  );
}

// ── Search / filter helpers ────────────────────────────

/** Client-side filter across title, artist, genre, key, tags. */
export function filterSongs(
  songs: SongEntry[],
  query: string,
  artist: string,
  difficulty: string,
): SongEntry[] {
  let filtered = songs;

  if (artist && artist !== "all") {
    filtered = filtered.filter((s) => s.artistSlug === artist);
  }

  if (difficulty && difficulty !== "all") {
    filtered = filtered.filter((s) => s.difficulty === difficulty);
  }

  if (query) {
    const lc = query.toLowerCase();
    filtered = filtered.filter((s) => {
      if (s.title.toLowerCase().includes(lc)) return true;
      if (s.artist.toLowerCase().includes(lc)) return true;
      if (s.genre.some((g) => g.toLowerCase().includes(lc))) return true;
      if (s.key.toLowerCase().includes(lc)) return true;
      if (s.tags.some((t) => t.toLowerCase().includes(lc))) return true;
      if (s.chordsUsed.some((c) => c.toLowerCase().includes(lc))) return true;
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

// ── SEO: JSON-LD generators ───────────────────────────

export function buildSongJsonLd(song: SongEntry) {
  return {
    "@context": "https://schema.org",
    "@type": "MusicComposition",
    name: song.title,
    composer: {
      "@type": "Person",
      name: song.artist,
    },
    musicalKey: song.key,
    ...(song.album && {
      includedIn: {
        "@type": "MusicAlbum",
        name: song.album,
      },
    }),
    url: `${SITE_URL}/songbook/${song.id}`,
  };
}

export function buildBreadcrumbJsonLd(song: SongEntry) {
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
        name: "Songbook",
        item: `${SITE_URL}/songbook`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${song.title} – ${song.artist}`,
      },
    ],
  };
}

export function buildCollectionPageJsonLd(totalSongs: number) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Songbook – Koleksi Chord Gitar | NoteLogic",
    description: `Koleksi ${totalSongs} chord gitar populer lengkap dengan lirik, kunci, capo, dan pola strumming.`,
    url: `${SITE_URL}/songbook`,
    numberOfItems: totalSongs,
    isPartOf: {
      "@type": "WebSite",
      name: "NoteLogic",
      url: SITE_URL,
    },
  };
}
