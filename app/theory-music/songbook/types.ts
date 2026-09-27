// ════════════════════════════════════════════════════════
// Songbook – Type Definitions
// ════════════════════════════════════════════════════════
//
// Chord sheet data model for songs.
// Lines use **ChordPro** inline format:
//   "[C]I walked across an [Am]empty land"
//
// A parser in the UI layer splits `[chord]text` tokens and
// renders chords above the corresponding lyric fragment.
//
// IMPORTANT – Copyright Notice
// ─────────────────────────────
// Chord progressions (harmonic structures) are not copyrightable.
// However, **song lyrics ARE copyrighted** by their respective
// authors / publishers. Data stored here is intended strictly
// for **personal / educational use** within this music-learning
// application. Do NOT redistribute lyrics commercially.
// ════════════════════════════════════════════════════════

// ── Song Difficulty ────────────────────────────────────

export type SongDifficulty =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "expert";

// ── Song Section Types ─────────────────────────────────

export type SongSectionType =
  | "intro"
  | "verse"
  | "pre-chorus"
  | "chorus"
  | "bridge"
  | "outro"
  | "interlude"
  | "solo"
  | "instrumental"
  | "break";

// ── Song Section ───────────────────────────────────────

export interface SongSection {
  /** Semantic type for filtering / highlighting */
  type: SongSectionType;

  /** Display label, e.g. "Verse 1", "Pre-Chorus", "Outro" */
  label: string;

  /**
   * ChordPro-formatted lines.
   *
   * Chord + lyrics : `"[C]I walked across an [Am]empty land"`
   * Chord only     : `"[C]  [Am]  [G]  [F]"`
   * Lyrics only    : `"Ooh..."`
   * Annotation     : `"(Slowly)"` or `"x2"`
   */
  lines: string[];
}

// ── Strumming Pattern ──────────────────────────────────

export interface StrummingPattern {
  /** e.g. "D DU UDU", where D=down, U=up, space=rest */
  pattern: string;
  /** Beats per minute */
  bpm?: number;
}

// ── Song Entry ─────────────────────────────────────────

export interface SongEntry {
  /** URL-safe slug, unique across all songs: `"somewhere-only-we-know"` */
  id: string;

  /** Display title */
  title: string;

  /** Artist / band name */
  artist: string;

  /** URL-safe artist slug for grouping: `"keane"` */
  artistSlug: string;

  /** Album name (optional) */
  album?: string;

  /** Release year */
  year?: number;

  /** Genre tags */
  genre: string[];

  /** Difficulty rating */
  difficulty: SongDifficulty;

  /** Displayed key, e.g. `"C"`, `"Am"`, `"G"` */
  key: string;

  /** Original key if the chart is transposed for easier playing */
  originalKey?: string;

  /** Capo fret (0 or undefined = no capo) */
  capo?: number;

  /** Standard tuning string, e.g. `"E A D G B E"` */
  tuning: string;

  /** Tempo in BPM (optional) */
  bpm?: number;

  /** Time signature, e.g. `"4/4"`, `"3/4"`, `"6/8"` */
  timeSignature?: string;

  /** Ordered list of unique chords used in the song */
  chordsUsed: string[];

  /** Strumming pattern (optional) */
  strummingPattern?: StrummingPattern;

  /** The actual chord sheet broken into labeled sections */
  sections: SongSection[];

  /** Free-form player notes / tips */
  notes?: string;

  /** Searchable tags */
  tags: string[];

  /** Sort hint within artist grouping */
  sortOrder?: number;
}

// ── Genre helpers ──────────────────────────────────────

export type SongGenre =
  | "pop"
  | "rock"
  | "alternative"
  | "indie"
  | "folk"
  | "acoustic"
  | "blues"
  | "country"
  | "jazz"
  | "r-and-b"
  | "reggae"
  | "metal"
  | "punk"
  | "classical"
  | "ballad"
  | "soul"
  | "funk"
  | "latin"
  | "hip-hop";
