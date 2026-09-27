// ════════════════════════════════════════════════════════
// Piano Fingering – Finger assignments for piano chords
// ════════════════════════════════════════════════════════
//
// Standard piano finger numbering:
//   RH: 1=thumb, 2=index, 3=middle, 4=ring, 5=pinky
//   LH: 1=thumb, 2=index, 3=middle, 4=ring, 5=pinky
//
// Provides automatic finger assignment based on chord pitch classes.

import { NOTE_NAMES_SHARP } from "~/shared/constants/music";

// ── Types ──────────────────────────────────────────────

export type PianoHand = "RH" | "LH";

export interface PianoFingerAssignment {
  /** Pitch class (0-11) */
  pitchClass: number;
  /** Note name */
  noteName: string;
  /** Finger number 1-5 */
  finger: number;
  /** Which hand */
  hand: PianoHand;
  /** Is it a black key? */
  isBlackKey: boolean;
}

export interface PianoFingering {
  chord: string;
  rightHand: PianoFingerAssignment[];
  leftHand: PianoFingerAssignment[];
}

/** A single step in a piano arpeggio pattern */
export interface PianoArpeggioStep {
  beat: string;
  /** Pitch classes to play */
  pitchClasses: number[];
  /** Finger numbers */
  fingers: number[];
  hand: PianoHand;
}

/** A piano fingering pattern */
export interface PianoPattern {
  id: string;
  name: string;
  description: string;
  timeSignature: "4/4" | "3/4" | "6/8";
  /** Pattern steps — uses relative note indices (0=root, 1=2nd, 2=3rd, etc.) */
  steps: PianoArpeggioStep[];
}

// ── Constants ──────────────────────────────────────────

const BLACK_KEYS = new Set([1, 3, 6, 8, 10]); // C#, D#, F#, G#, A#

export const PIANO_FINGER_COLORS: Record<
  number,
  { bg: string; text: string; label: string }
> = {
  1: { bg: "#ec4899", text: "#fff", label: "1 (Jempol)" },
  2: { bg: "#3b82f6", text: "#fff", label: "2 (Telunjuk)" },
  3: { bg: "#10b981", text: "#fff", label: "3 (Tengah)" },
  4: { bg: "#f59e0b", text: "#fff", label: "4 (Manis)" },
  5: { bg: "#8b5cf6", text: "#fff", label: "5 (Kelingking)" },
};

// ── Finger Assignment Logic ────────────────────────────

/**
 * Sort pitch classes by keyboard position for natural playing order.
 * Returns sorted ascending (left to right on keyboard).
 */
function sortPitchClasses(pitchClasses: number[], root: number): number[] {
  // Map each pitch class to its distance from root (ascending semitones)
  return [...pitchClasses].sort((a, b) => {
    const da = (a - root + 12) % 12;
    const db = (b - root + 12) % 12;
    return da - db;
  });
}

/**
 * Assign right-hand fingers to chord pitch classes.
 *
 * General heuristic:
 * - 2-note: 1, 5
 * - 3-note: 1, 3, 5 (or 1, 2, 5 for tight clusters)
 * - 4-note: 1, 2, 3, 5 (or 1, 2, 4, 5)
 * - 5-note: 1, 2, 3, 4, 5
 * - 6+ notes: best effort
 */
export function getPianoRHFingering(
  pitchClasses: number[],
): PianoFingerAssignment[] {
  if (pitchClasses.length === 0) return [];

  const root = pitchClasses[0];
  const sorted = sortPitchClasses(pitchClasses, root);

  // Compute intervals between consecutive notes (in semitones)
  const intervals: number[] = [];
  for (let i = 1; i < sorted.length; i++) {
    intervals.push((((sorted[i] - sorted[i - 1]) % 12) + 12) % 12);
  }

  const n = sorted.length;
  let fingers: number[];

  switch (n) {
    case 1:
      fingers = [1];
      break;
    case 2:
      fingers = [1, 5];
      break;
    case 3: {
      // If first interval is small (≤2 semitones), use 1-2-5
      const firstInterval = intervals[0] ?? 4;
      fingers = firstInterval <= 2 ? [1, 2, 5] : [1, 3, 5];
      break;
    }
    case 4: {
      // Check span: if wide, use 1-2-3-5; if notes cluster, 1-2-4-5
      const lastInterval = intervals[intervals.length - 1] ?? 3;
      fingers = lastInterval <= 2 ? [1, 2, 3, 5] : [1, 2, 4, 5];
      break;
    }
    case 5:
      fingers = [1, 2, 3, 4, 5];
      break;
    default:
      // For 6+ notes distribute 1-5 then repeat higher fingers
      fingers = sorted.map((_, i) => Math.min(i + 1, 5));
      break;
  }

  return sorted.map((pc, i) => ({
    pitchClass: pc,
    noteName: NOTE_NAMES_SHARP[pc],
    finger: fingers[i],
    hand: "RH" as PianoHand,
    isBlackKey: BLACK_KEYS.has(pc),
  }));
}

/**
 * Assign left-hand fingers (mirror of right hand).
 * LH goes from highest note (thumb=1) to lowest note (pinky=5).
 */
export function getPianoLHFingering(
  pitchClasses: number[],
): PianoFingerAssignment[] {
  if (pitchClasses.length === 0) return [];

  const root = pitchClasses[0];
  const sorted = sortPitchClasses(pitchClasses, root);

  const n = sorted.length;
  let fingers: number[];

  switch (n) {
    case 1:
      fingers = [1];
      break;
    case 2:
      fingers = [5, 1];
      break;
    case 3:
      fingers = [5, 3, 1];
      break;
    case 4:
      fingers = [5, 4, 2, 1];
      break;
    case 5:
      fingers = [5, 4, 3, 2, 1];
      break;
    default:
      fingers = sorted.map((_, i) => Math.max(5 - i, 1));
      break;
  }

  return sorted.map((pc, i) => ({
    pitchClass: pc,
    noteName: NOTE_NAMES_SHARP[pc],
    finger: fingers[i],
    hand: "LH" as PianoHand,
    isBlackKey: BLACK_KEYS.has(pc),
  }));
}

/**
 * Get full piano fingering for a chord.
 */
export function getPianoFingering(
  chordName: string,
  pitchClasses: number[],
): PianoFingering {
  return {
    chord: chordName,
    rightHand: getPianoRHFingering(pitchClasses),
    leftHand: getPianoLHFingering(pitchClasses),
  };
}

// ── Piano Arpeggio Patterns ────────────────────────────

/**
 * Patterns use relative indices into the chord's sorted pitch classes.
 * E.g. index 0 = root, 1 = 2nd note, 2 = 3rd note, etc.
 */
export const PIANO_PATTERNS: PianoPattern[] = [
  {
    id: "piano-block",
    name: "Block Chord",
    description:
      "Semua not ditekan bersamaan. Dasar untuk memahami posisi jari.",
    timeSignature: "4/4",
    steps: [
      { beat: "1", pitchClasses: [0, 1, 2], fingers: [1, 3, 5], hand: "RH" },
      {
        beat: "2",
        pitchClasses: [],
        fingers: [],
        hand: "RH",
      },
      { beat: "3", pitchClasses: [0, 1, 2], fingers: [1, 3, 5], hand: "RH" },
      {
        beat: "4",
        pitchClasses: [],
        fingers: [],
        hand: "RH",
      },
    ],
  },
  {
    id: "piano-arpeggio-up",
    name: "Arpeggio Naik",
    description:
      "Mainkan not satu per satu dari bawah ke atas. Latihan dasar arpeggio.",
    timeSignature: "4/4",
    steps: [
      { beat: "1", pitchClasses: [0], fingers: [1], hand: "RH" },
      { beat: "2", pitchClasses: [1], fingers: [3], hand: "RH" },
      { beat: "3", pitchClasses: [2], fingers: [5], hand: "RH" },
      { beat: "4", pitchClasses: [], fingers: [], hand: "RH" },
    ],
  },
  {
    id: "piano-arpeggio-down-up",
    name: "Arpeggio Naik-Turun",
    description: "Mainkan naik lalu turun kembali. Pola klasik piano.",
    timeSignature: "4/4",
    steps: [
      { beat: "1", pitchClasses: [0], fingers: [1], hand: "RH" },
      { beat: "2", pitchClasses: [1], fingers: [3], hand: "RH" },
      { beat: "3", pitchClasses: [2], fingers: [5], hand: "RH" },
      { beat: "4", pitchClasses: [1], fingers: [3], hand: "RH" },
    ],
  },
  {
    id: "piano-alberti-bass",
    name: "Alberti Bass",
    description:
      "Pola klasik: rendah-tinggi-tengah-tinggi. Banyak dipakai Mozart & Beethoven.",
    timeSignature: "4/4",
    steps: [
      { beat: "1", pitchClasses: [0], fingers: [1], hand: "LH" },
      { beat: "&", pitchClasses: [2], fingers: [5], hand: "LH" },
      { beat: "2", pitchClasses: [1], fingers: [3], hand: "LH" },
      { beat: "&", pitchClasses: [2], fingers: [5], hand: "LH" },
      { beat: "3", pitchClasses: [0], fingers: [1], hand: "LH" },
      { beat: "&", pitchClasses: [2], fingers: [5], hand: "LH" },
      { beat: "4", pitchClasses: [1], fingers: [3], hand: "LH" },
      { beat: "&", pitchClasses: [2], fingers: [5], hand: "LH" },
    ],
  },
  {
    id: "piano-waltz",
    name: "Waltz Bass",
    description: "Pola 3/4 waltz: bass-chord-chord. LH pattern klasik.",
    timeSignature: "3/4",
    steps: [
      { beat: "1", pitchClasses: [0], fingers: [5], hand: "LH" },
      { beat: "2", pitchClasses: [1, 2], fingers: [3, 1], hand: "LH" },
      { beat: "3", pitchClasses: [1, 2], fingers: [3, 1], hand: "LH" },
    ],
  },
  {
    id: "piano-broken-chord",
    name: "Broken Chord",
    description:
      "Pecahan chord bergantian RH. Untuk latihan independensi jari.",
    timeSignature: "4/4",
    steps: [
      { beat: "1", pitchClasses: [0], fingers: [1], hand: "RH" },
      { beat: "&", pitchClasses: [1], fingers: [3], hand: "RH" },
      { beat: "2", pitchClasses: [2], fingers: [5], hand: "RH" },
      { beat: "&", pitchClasses: [1], fingers: [3], hand: "RH" },
      { beat: "3", pitchClasses: [0, 2], fingers: [1, 5], hand: "RH" },
      { beat: "4", pitchClasses: [], fingers: [], hand: "RH" },
    ],
  },
];

/**
 * Resolve pattern note indices to actual pitch classes for a given chord.
 */
export function resolvePianoPattern(
  pattern: PianoPattern,
  pitchClasses: number[],
): PianoPattern {
  const root = pitchClasses[0] ?? 0;
  const sorted = sortPitchClasses(pitchClasses, root);

  return {
    ...pattern,
    steps: pattern.steps.map((step) => ({
      ...step,
      pitchClasses: step.pitchClasses.map(
        (idx) => sorted[idx % sorted.length] ?? sorted[0],
      ),
    })),
  };
}
