// ════════════════════════════════════════════════════════
// Songbook – Barrel Index
// ════════════════════════════════════════════════════════
//
// Re-exports types & aggregates every artist data file
// into a single `ALL_SONGS` collection.
// ════════════════════════════════════════════════════════

// ── Re-export types ────────────────────────────────────

export type {
  SongDifficulty,
  SongEntry,
  SongGenre,
  SongSection,
  SongSectionType,
  StrummingPattern,
} from "./types";

// ── Artist data ────────────────────────────────────────

import { ED_SHEERAN_SONGS } from "./data/ed-sheeran";
import { JOHN_LEGEND_SONGS } from "./data/john-legend";
import { KEANE_SONGS } from "./data/keane";
import { OASIS_SONGS } from "./data/oasis";
import { PASSENGER_SONGS } from "./data/passenger";

export {
  ED_SHEERAN_SONGS,
  JOHN_LEGEND_SONGS,
  KEANE_SONGS,
  OASIS_SONGS,
  PASSENGER_SONGS,
};

// ── Aggregate collection ───────────────────────────────

import type { SongEntry } from "./types";

export const ALL_SONGS: SongEntry[] = [
  ...KEANE_SONGS,
  ...ED_SHEERAN_SONGS,
  ...OASIS_SONGS,
  ...PASSENGER_SONGS,
  ...JOHN_LEGEND_SONGS,
];

/** Quick lookup by song id */
export const SONG_MAP: ReadonlyMap<string, SongEntry> = new Map(
  ALL_SONGS.map((s) => [s.id, s]),
);

/** Unique artists, sorted alphabetically */
export const ARTISTS: readonly string[] = [
  ...new Set(ALL_SONGS.map((s) => s.artist)),
].sort();

/** Total song count */
export const SONG_COUNT = ALL_SONGS.length;
