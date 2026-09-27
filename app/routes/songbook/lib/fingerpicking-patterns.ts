// ════════════════════════════════════════════════════════
// Fingerpicking Patterns – Right-hand finger assignments & patterns
// ════════════════════════════════════════════════════════
//
// Provides:
// - Standard right-hand finger-to-string mapping for any chord voicing
// - Common fingerpicking patterns (Travis, arpeggio, etc.)
// - Pattern generation based on which strings are actually played

// ── Types ──────────────────────────────────────────────

/** Right-hand finger abbreviation */
export type RHFinger = "p" | "i" | "m" | "a";

/** A single step in a fingerpicking pattern */
export interface PickStep {
  /** Sub-beat label, e.g. "1", "2", "&", "3", "4 &" */
  beat: string;
  /** String indices to pluck (0=low E / string 4 for uke, ascending) */
  strings: number[];
  /** Corresponding right-hand finger for each string */
  fingers: RHFinger[];
}

/** A complete fingerpicking pattern */
export interface FingerpickingPattern {
  id: string;
  name: string;
  /** Short Indonesian description */
  description: string;
  /** Time signature feel */
  timeSignature: "4/4" | "3/4" | "6/8";
  /** Steps in one cycle */
  steps: PickStep[];
  /** Suitable for these instrument types */
  instruments: ("guitar" | "ukulele")[];
}

/** Finger assignment for a specific chord voicing */
export interface FingerAssignment {
  /** String index (0-based, 0=lowest string) */
  stringIndex: number;
  /** Right-hand finger */
  finger: RHFinger;
  /** String label (E, A, D, G, B, e for guitar / G, C, E, A for uke) */
  stringLabel: string;
}

// ── Constants ──────────────────────────────────────────

const GUITAR_STRING_LABELS = ["E", "A", "D", "G", "B", "e"];
const UKULELE_STRING_LABELS = ["G", "C", "E", "A"];

// ── Finger Assignment Logic ────────────────────────────

/**
 * Assign right-hand fingers to strings based on which frets are played.
 * Standard classical guitar assignment:
 *   p (thumb)  → bass strings (E, A, D) — typically the root/bass note
 *   i (index)  → G string
 *   m (middle) → B string
 *   a (ring)   → high e string
 *
 * For chords that skip strings, fingers shift accordingly.
 */
export function getGuitarFingerAssignment(frets: number[]): FingerAssignment[] {
  const assignments: FingerAssignment[] = [];

  // Find playable strings (not muted)
  const playable = frets
    .map((f, i) => ({ fret: f, index: i }))
    .filter((s) => s.fret >= 0);

  if (playable.length === 0) return assignments;

  // Standard assignment: lowest 3 playable strings = thumb, rest = i, m, a
  const bassStrings = playable.filter((s) => s.index <= 2); // E, A, D
  const trebleStrings = playable.filter((s) => s.index >= 3); // G, B, e

  // Thumb gets all bass strings
  for (const s of bassStrings) {
    assignments.push({
      stringIndex: s.index,
      finger: "p",
      stringLabel: GUITAR_STRING_LABELS[s.index],
    });
  }

  // Map treble strings to i, m, a
  const trebleFingers: RHFinger[] = ["i", "m", "a"];
  for (let t = 0; t < trebleStrings.length; t++) {
    const fingerIdx = Math.min(t, trebleFingers.length - 1);
    assignments.push({
      stringIndex: trebleStrings[t].index,
      finger: trebleFingers[fingerIdx],
      stringLabel: GUITAR_STRING_LABELS[trebleStrings[t].index],
    });
  }

  return assignments.sort((a, b) => a.stringIndex - b.stringIndex);
}

/**
 * Assign right-hand fingers for ukulele.
 * Standard:
 *   p (thumb)  → G string (string 4/index 0), sometimes C
 *   i (index)  → C string or E string
 *   m (middle) → E string or A string
 *   a (ring)   → A string (highest)
 */
export function getUkuleleFingerAssignment(
  frets: number[],
): FingerAssignment[] {
  const assignments: FingerAssignment[] = [];

  const playable = frets
    .map((f, i) => ({ fret: f, index: i }))
    .filter((s) => s.fret >= 0);

  if (playable.length === 0) return assignments;

  // Standard ukulele: p=G(0), i=C(1), m=E(2), a=A(3)
  const fingerMap: RHFinger[] = ["p", "i", "m", "a"];

  for (const s of playable) {
    assignments.push({
      stringIndex: s.index,
      finger: fingerMap[s.index] ?? "a",
      stringLabel: UKULELE_STRING_LABELS[s.index],
    });
  }

  return assignments.sort((a, b) => a.stringIndex - b.stringIndex);
}

// ── Predefined Patterns ────────────────────────────────

/**
 * Get common guitar fingerpicking patterns.
 * Patterns use generic string references that get mapped to
 * actual played strings at render time.
 *
 * Convention: "bass" = lowest played string, "bass2" = second lowest,
 * numeric 3,4,5 = G, B, e strings.
 */
export const GUITAR_PATTERNS: FingerpickingPattern[] = [
  {
    id: "travis-basic",
    name: "Travis Picking (Basic)",
    description:
      "Pola alternating bass klasik. Jempol bergantian, jari memetik treble.",
    timeSignature: "4/4",
    instruments: ["guitar"],
    steps: [
      { beat: "1", strings: [0, 4], fingers: ["p", "m"] },
      { beat: "&", strings: [3], fingers: ["i"] },
      { beat: "2", strings: [1, 5], fingers: ["p", "a"] },
      { beat: "&", strings: [3], fingers: ["i"] },
      { beat: "3", strings: [0, 4], fingers: ["p", "m"] },
      { beat: "&", strings: [3], fingers: ["i"] },
      { beat: "4", strings: [1, 5], fingers: ["p", "a"] },
      { beat: "&", strings: [3], fingers: ["i"] },
    ],
  },
  {
    id: "arpeggio-up",
    name: "Arpeggio Naik",
    description:
      "Petikan naik dari bass ke treble. Cocok untuk balada dan intro.",
    timeSignature: "4/4",
    instruments: ["guitar"],
    steps: [
      { beat: "1", strings: [0], fingers: ["p"] },
      { beat: "2", strings: [3], fingers: ["i"] },
      { beat: "3", strings: [4], fingers: ["m"] },
      { beat: "4", strings: [5], fingers: ["a"] },
    ],
  },
  {
    id: "arpeggio-down-up",
    name: "Arpeggio Naik-Turun",
    description: "Petikan naik lalu turun. Pola klasik fingerstyle.",
    timeSignature: "4/4",
    instruments: ["guitar"],
    steps: [
      { beat: "1", strings: [0], fingers: ["p"] },
      { beat: "2", strings: [3], fingers: ["i"] },
      { beat: "3", strings: [4], fingers: ["m"] },
      { beat: "4", strings: [5], fingers: ["a"] },
      { beat: "5", strings: [4], fingers: ["m"] },
      { beat: "6", strings: [3], fingers: ["i"] },
    ],
  },
  {
    id: "dust-in-wind",
    name: "Dust in the Wind",
    description:
      "Pola ikonik Kansas. Jempol bergantian dengan arpeggio treble.",
    timeSignature: "4/4",
    instruments: ["guitar"],
    steps: [
      { beat: "1", strings: [0], fingers: ["p"] },
      { beat: "&", strings: [5], fingers: ["a"] },
      { beat: "2", strings: [3], fingers: ["i"] },
      { beat: "&", strings: [4], fingers: ["m"] },
      { beat: "3", strings: [5], fingers: ["a"] },
      { beat: "&", strings: [3], fingers: ["i"] },
      { beat: "4", strings: [4], fingers: ["m"] },
      { beat: "&", strings: [3], fingers: ["i"] },
    ],
  },
  {
    id: "p-i-m-a",
    name: "p-i-m-a Klasik",
    description: "Pola dasar klasik. Jempol bass, jari satu per satu naik.",
    timeSignature: "3/4",
    instruments: ["guitar"],
    steps: [
      { beat: "1", strings: [0], fingers: ["p"] },
      { beat: "2", strings: [3], fingers: ["i"] },
      { beat: "3", strings: [4], fingers: ["m"] },
      { beat: "&", strings: [5], fingers: ["a"] },
    ],
  },
  {
    id: "pinch-pattern",
    name: "Pinch Pattern",
    description: "Jempol dan jari petik bersamaan. Karakter folk/country.",
    timeSignature: "4/4",
    instruments: ["guitar"],
    steps: [
      { beat: "1", strings: [0, 5], fingers: ["p", "a"] },
      { beat: "2", strings: [3], fingers: ["i"] },
      { beat: "3", strings: [1, 4], fingers: ["p", "m"] },
      { beat: "4", strings: [3], fingers: ["i"] },
    ],
  },
  {
    id: "waltz-3-4",
    name: "Waltz 3/4",
    description: "Pola 3/4 untuk lagu waltz. Bass lalu dua treble.",
    timeSignature: "3/4",
    instruments: ["guitar"],
    steps: [
      { beat: "1", strings: [0], fingers: ["p"] },
      { beat: "2", strings: [3, 4, 5], fingers: ["i", "m", "a"] },
      { beat: "3", strings: [3, 4, 5], fingers: ["i", "m", "a"] },
    ],
  },
];

export const UKULELE_PATTERNS: FingerpickingPattern[] = [
  {
    id: "uke-arpeggio-up",
    name: "Arpeggio Naik",
    description: "Petikan naik sederhana dari bass ke treble.",
    timeSignature: "4/4",
    instruments: ["ukulele"],
    steps: [
      { beat: "1", strings: [0], fingers: ["p"] },
      { beat: "2", strings: [1], fingers: ["i"] },
      { beat: "3", strings: [2], fingers: ["m"] },
      { beat: "4", strings: [3], fingers: ["a"] },
    ],
  },
  {
    id: "uke-arpeggio-down-up",
    name: "Arpeggio Naik-Turun",
    description: "Petikan naik lalu turun. Smooth & serbaguna.",
    timeSignature: "4/4",
    instruments: ["ukulele"],
    steps: [
      { beat: "1", strings: [0], fingers: ["p"] },
      { beat: "2", strings: [1], fingers: ["i"] },
      { beat: "3", strings: [2], fingers: ["m"] },
      { beat: "4", strings: [3], fingers: ["a"] },
      { beat: "5", strings: [2], fingers: ["m"] },
      { beat: "6", strings: [1], fingers: ["i"] },
    ],
  },
  {
    id: "uke-pinch",
    name: "Pinch & Roll",
    description: "Jempol dan jari bersamaan lalu roll. Cocok untuk balada.",
    timeSignature: "4/4",
    instruments: ["ukulele"],
    steps: [
      { beat: "1", strings: [0, 3], fingers: ["p", "a"] },
      { beat: "2", strings: [1], fingers: ["i"] },
      { beat: "3", strings: [2], fingers: ["m"] },
      { beat: "4", strings: [1], fingers: ["i"] },
    ],
  },
  {
    id: "uke-travis",
    name: "Travis Style",
    description: "Adaptasi Travis picking untuk ukulele. Jempol bergantian.",
    timeSignature: "4/4",
    instruments: ["ukulele"],
    steps: [
      { beat: "1", strings: [0, 2], fingers: ["p", "m"] },
      { beat: "&", strings: [1], fingers: ["i"] },
      { beat: "2", strings: [3], fingers: ["a"] },
      { beat: "&", strings: [1], fingers: ["i"] },
      { beat: "3", strings: [0, 2], fingers: ["p", "m"] },
      { beat: "&", strings: [1], fingers: ["i"] },
      { beat: "4", strings: [3], fingers: ["a"] },
      { beat: "&", strings: [1], fingers: ["i"] },
    ],
  },
  {
    id: "uke-waltz",
    name: "Waltz 3/4",
    description: "Pola 3/4 untuk lagu waltz di ukulele.",
    timeSignature: "3/4",
    instruments: ["ukulele"],
    steps: [
      { beat: "1", strings: [0], fingers: ["p"] },
      { beat: "2", strings: [1, 2, 3], fingers: ["i", "m", "a"] },
      { beat: "3", strings: [1, 2, 3], fingers: ["i", "m", "a"] },
    ],
  },
];

// ── Helpers ────────────────────────────────────────────

/**
 * Map pattern string indices to actual playable strings for a voicing.
 * Pattern indices use: 0=lowest bass, 1=2nd bass, etc. for bass;
 * 3=G, 4=B, 5=e for treble (guitar).
 *
 * For muted strings we find the nearest playable string.
 */
export function resolvePatternForVoicing(
  pattern: FingerpickingPattern,
  frets: number[],
): FingerpickingPattern {
  const playable = frets
    .map((f, i) => ({ fret: f, index: i }))
    .filter((s) => s.fret >= 0);

  if (playable.length === 0) return pattern;

  const resolvedSteps = pattern.steps.map((step) => ({
    ...step,
    strings: step.strings.map((s) => {
      // If string index is playable, use it directly
      if (frets[s] !== undefined && frets[s] >= 0) return s;
      // Find nearest playable string
      let nearest = playable[0].index;
      let minDist = Math.abs(s - nearest);
      for (const p of playable) {
        const dist = Math.abs(s - p.index);
        if (dist < minDist) {
          minDist = dist;
          nearest = p.index;
        }
      }
      return nearest;
    }),
  }));

  return { ...pattern, steps: resolvedSteps };
}

/** Colors for each right-hand finger for visualization */
export const FINGER_COLORS: Record<
  RHFinger,
  { bg: string; text: string; label: string }
> = {
  p: { bg: "#ec4899", text: "#fff", label: "Thumb (Jempol)" },
  i: { bg: "#3b82f6", text: "#fff", label: "Index (Telunjuk)" },
  m: { bg: "#10b981", text: "#fff", label: "Middle (Tengah)" },
  a: { bg: "#f59e0b", text: "#fff", label: "Ring (Manis)" },
};
