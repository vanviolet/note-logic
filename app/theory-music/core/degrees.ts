// ════════════════════════════════════════════════════════
// Core Music – Degree & Interval Constants
// ════════════════════════════════════════════════════════
//
// Canonical degree tokens, degree-to-semitone mapping,
// and interval quality types shared across chord.tsx,
// scales.tsx, interval.tsx, and family.tsx.
//
// This eliminates the 3+ incompatible degree type systems
// that existed before.
// ════════════════════════════════════════════════════════

// ── Degree Token ───────────────────────────────────────

/**
 * Universal degree token covering simple (1-7), chromatic (b3, #5),
 * and extended (9, 11, 13) with both ASCII and Unicode accidentals.
 */
export type DegreeToken =
  | "1"
  | "b2"
  | "♭2"
  | "2"
  | "#2"
  | "♯2"
  | "b3"
  | "♭3"
  | "3"
  | "4"
  | "#4"
  | "♯4"
  | "b5"
  | "♭5"
  | "5"
  | "#5"
  | "♯5"
  | "b6"
  | "♭6"
  | "6"
  | "bb7"
  | "𝄫7"
  | "b7"
  | "♭7"
  | "7"
  | "b9"
  | "♭9"
  | "9"
  | "#9"
  | "♯9"
  | "11"
  | "#11"
  | "♯11"
  | "b13"
  | "♭13"
  | "13"
  | "#13"
  | "♯13";

// ── Simple Scale Degree (1-7 with optional accidentals) ─

export type SimpleScaleDegree =
  | "1"
  | "2"
  | "b2"
  | "#2"
  | "b3"
  | "3"
  | "4"
  | "#4"
  | "b4"
  | "b5"
  | "5"
  | "#5"
  | "b6"
  | "6"
  | "b7"
  | "7";

// ── Degree → Semitone Mapping ──────────────────────────

/**
 * Maps every degree token (including extended) to semitones from root.
 * Extended degrees (9/11/13) are compound intervals.
 *
 * 9 = 14 semitones (octave + 2)
 * 11 = 17 semitones (octave + 5)
 * 13 = 21 semitones (octave + 9)
 */
export const DEGREE_TO_SEMITONES: Readonly<Record<DegreeToken, number>> = {
  "1": 0,
  b2: 1,
  "♭2": 1,
  "2": 2,
  "#2": 3,
  "♯2": 3,
  b3: 3,
  "♭3": 3,
  "3": 4,
  "4": 5,
  "#4": 6,
  "♯4": 6,
  b5: 6,
  "♭5": 6,
  "5": 7,
  "#5": 8,
  "♯5": 8,
  b6: 8,
  "♭6": 8,
  "6": 9,
  bb7: 9,
  "𝄫7": 9,
  b7: 10,
  "♭7": 10,
  "7": 11,
  b9: 13,
  "♭9": 13,
  "9": 14,
  "#9": 15,
  "♯9": 15,
  "11": 17,
  "#11": 18,
  "♯11": 18,
  b13: 20,
  "♭13": 20,
  "13": 21,
  "#13": 22,
  "♯13": 22,
};

/**
 * Get the pitch class offset (mod 12) for any degree token.
 */
export function degreeToPitchClassOffset(degree: DegreeToken): number {
  return DEGREE_TO_SEMITONES[degree] % 12;
}

// ── Interval Quality Types ─────────────────────────────

export type IntervalQuality =
  | "perfect"
  | "major"
  | "minor"
  | "augmented"
  | "diminished";

export type ConsonanceLevel =
  | "perfect-consonance"
  | "imperfect-consonance"
  | "dissonance";

// ── Harmonic Quality ───────────────────────────────────

export type HarmonicQuality =
  | "major"
  | "minor"
  | "dominant"
  | "diminished"
  | "augmented"
  | "suspended"
  | "power"
  | "altered"
  | "mixed";

// ── Chord Family ───────────────────────────────────────

export type ChordFamily =
  | "triad"
  | "sixth"
  | "seventh"
  | "extended"
  | "suspended"
  | "added-tone"
  | "power"
  | "altered";

// ── Cadential Strength ─────────────────────────────────

export type CadentialStrength =
  | "very-weak"
  | "weak"
  | "medium"
  | "strong"
  | "very-strong";

// ── Triad Quality (for family/diatonic) ────────────────

export type TriadQuality = "maj" | "min" | "dim" | "aug";

// ── Scale Type ─────────────────────────────────────────

export type ScaleType = "major" | "minor";
