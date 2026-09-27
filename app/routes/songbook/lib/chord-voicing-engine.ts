// ════════════════════════════════════════════════════════
// Chord Voicing Engine – Algorithmic multi-position generator
// ════════════════════════════════════════════════════════
//
// Instead of hardcoding every chord, we define BASE SHAPES (CAGED system)
// per chord quality, then shift them up the neck to generate voicings at
// every playable fret position.
//
// This means ANY chord name (e.g. "G#maj7", "Dbm9", "A#6") will always
// produce at least one voicing, and most chords get 4-6+ positions.

// ── Types ──────────────────────────────────────────────

export interface ChordVoicing {
  name: string;
  frets: [number, number, number, number, number, number];
  fingers: [number, number, number, number, number, number];
  barres?: { fret: number; fromString: number; toString: number }[];
  baseFret: number;
  /** Human label like "Position 1", "Position 2" */
  positionLabel: string;
}

// ── Note helpers (from core) ───────────────────────────

import { NOTE_INDEX } from "~/theory-music/core";

/**
 * Parse a chord name → { root semitone index, quality suffix, bass note? }
 */
const CHORD_RE = /^([A-G][#b]?)(.*?)(?:\/([A-G][#b]?))?$/;

function parseChordName(name: string) {
  const m = CHORD_RE.exec(name);
  if (!m) return null;
  const rootIdx = NOTE_INDEX[m[1]];
  if (rootIdx === undefined) return null;
  return { rootIdx, quality: m[2] || "", bass: m[3] };
}

// ── Base shapes ────────────────────────────────────────
// Each base shape is defined at a ROOT of 0 (C) or the natural open-chord
// root. The `rootOffset` is the semitone of the shape's natural root.
// To produce a voicing for root R we shift by (R - rootOffset) mod 12 frets.
//
// frets: -1 = muted, 0+ = fret number (relative to baseFret)
// We store them as "open-position" templates; the engine adds the shift.

interface BaseShape {
  /** Name of shape family, e.g. "E-form", "A-form" */
  family: string;
  /** Semitone index of the natural root for this shape */
  rootOffset: number;
  /** Fret pattern at open position */
  frets: [number, number, number, number, number, number];
  /** Finger pattern */
  fingers: [number, number, number, number, number, number];
  /** Which strings are part of a barre (relative to shift=0) */
  barreStrings?: { fromString: number; toString: number };
  /** Does this shape use a barre even at its home position? */
  needsBarreAtHome?: boolean;
  /** Maximum practical fret (shift) */
  maxShift?: number;
}

// ── Shape database per quality ─────────────────────────

const MAJOR_SHAPES: BaseShape[] = [
  {
    family: "E-form",
    rootOffset: 4, // E
    frets: [0, 2, 2, 1, 0, 0],
    fingers: [0, 2, 3, 1, 0, 0],
    barreStrings: { fromString: 1, toString: 6 },
  },
  {
    family: "A-form",
    rootOffset: 9, // A
    frets: [-1, 0, 2, 2, 2, 0],
    fingers: [0, 0, 1, 2, 3, 0],
    barreStrings: { fromString: 1, toString: 5 },
  },
  {
    family: "C-form",
    rootOffset: 0, // C
    frets: [-1, 3, 2, 0, 1, 0],
    fingers: [0, 3, 2, 0, 1, 0],
    barreStrings: { fromString: 1, toString: 5 },
  },
  {
    family: "G-form",
    rootOffset: 7, // G
    frets: [3, 2, 0, 0, 0, 3],
    fingers: [2, 1, 0, 0, 0, 3],
    barreStrings: { fromString: 1, toString: 6 },
  },
  {
    family: "D-form",
    rootOffset: 2, // D
    frets: [-1, -1, 0, 2, 3, 2],
    fingers: [0, 0, 0, 1, 3, 2],
    barreStrings: { fromString: 1, toString: 4 },
  },
];

const MINOR_SHAPES: BaseShape[] = [
  {
    family: "Em-form",
    rootOffset: 4, // E
    frets: [0, 2, 2, 0, 0, 0],
    fingers: [0, 2, 3, 0, 0, 0],
    barreStrings: { fromString: 1, toString: 6 },
  },
  {
    family: "Am-form",
    rootOffset: 9, // A
    frets: [-1, 0, 2, 2, 1, 0],
    fingers: [0, 0, 2, 3, 1, 0],
    barreStrings: { fromString: 1, toString: 5 },
  },
  {
    family: "Dm-form",
    rootOffset: 2, // D
    frets: [-1, -1, 0, 2, 3, 1],
    fingers: [0, 0, 0, 2, 3, 1],
    barreStrings: { fromString: 1, toString: 4 },
  },
];

const DOM7_SHAPES: BaseShape[] = [
  {
    family: "E7-form",
    rootOffset: 4,
    frets: [0, 2, 0, 1, 0, 0],
    fingers: [0, 2, 0, 1, 0, 0],
    barreStrings: { fromString: 1, toString: 6 },
  },
  {
    family: "A7-form",
    rootOffset: 9,
    frets: [-1, 0, 2, 0, 2, 0],
    fingers: [0, 0, 1, 0, 2, 0],
    barreStrings: { fromString: 1, toString: 5 },
  },
  {
    family: "D7-form",
    rootOffset: 2,
    frets: [-1, -1, 0, 2, 1, 2],
    fingers: [0, 0, 0, 2, 1, 3],
    barreStrings: { fromString: 1, toString: 4 },
  },
];

const MIN7_SHAPES: BaseShape[] = [
  {
    family: "Em7-form",
    rootOffset: 4,
    frets: [0, 2, 0, 0, 0, 0],
    fingers: [0, 1, 0, 0, 0, 0],
    barreStrings: { fromString: 1, toString: 6 },
  },
  {
    family: "Am7-form",
    rootOffset: 9,
    frets: [-1, 0, 2, 0, 1, 0],
    fingers: [0, 0, 2, 0, 1, 0],
    barreStrings: { fromString: 1, toString: 5 },
  },
  {
    family: "Dm7-form",
    rootOffset: 2,
    frets: [-1, -1, 0, 2, 1, 1],
    fingers: [0, 0, 0, 2, 1, 1],
    barreStrings: { fromString: 1, toString: 4 },
  },
];

const MAJ7_SHAPES: BaseShape[] = [
  {
    family: "Cmaj7-form",
    rootOffset: 0,
    frets: [-1, 3, 2, 0, 0, 0],
    fingers: [0, 3, 2, 0, 0, 0],
    barreStrings: { fromString: 1, toString: 5 },
  },
  {
    family: "Amaj7-form",
    rootOffset: 9,
    frets: [-1, 0, 2, 1, 2, 0],
    fingers: [0, 0, 3, 1, 2, 0],
    barreStrings: { fromString: 1, toString: 5 },
  },
  {
    family: "Emaj7-form",
    rootOffset: 4,
    frets: [0, 2, 1, 1, 0, 0],
    fingers: [0, 3, 1, 2, 0, 0],
    barreStrings: { fromString: 1, toString: 6 },
  },
];

const SUS4_SHAPES: BaseShape[] = [
  {
    family: "Esus4-form",
    rootOffset: 4,
    frets: [0, 2, 2, 2, 0, 0],
    fingers: [0, 2, 3, 4, 0, 0],
    barreStrings: { fromString: 1, toString: 6 },
  },
  {
    family: "Asus4-form",
    rootOffset: 9,
    frets: [-1, 0, 2, 2, 3, 0],
    fingers: [0, 0, 1, 2, 3, 0],
    barreStrings: { fromString: 1, toString: 5 },
  },
];

const SUS2_SHAPES: BaseShape[] = [
  {
    family: "Asus2-form",
    rootOffset: 9,
    frets: [-1, 0, 2, 2, 0, 0],
    fingers: [0, 0, 1, 2, 0, 0],
    barreStrings: { fromString: 1, toString: 5 },
  },
  {
    family: "Esus2-form",
    rootOffset: 4,
    frets: [0, 2, 4, 4, 0, 0],
    fingers: [0, 1, 3, 4, 0, 0],
    barreStrings: { fromString: 1, toString: 6 },
  },
];

const DIM_SHAPES: BaseShape[] = [
  {
    family: "dim-form",
    rootOffset: 9,
    frets: [-1, 0, 1, 2, 1, -1],
    fingers: [0, 0, 1, 3, 2, 0],
    barreStrings: { fromString: 2, toString: 5 },
  },
];

const AUG_SHAPES: BaseShape[] = [
  {
    family: "aug-form",
    rootOffset: 4,
    frets: [0, 3, 2, 1, 1, 0],
    fingers: [0, 4, 3, 1, 2, 0],
    barreStrings: { fromString: 1, toString: 6 },
  },
];

const ADD9_SHAPES: BaseShape[] = [
  {
    family: "Cadd9-form",
    rootOffset: 0,
    frets: [-1, 3, 2, 0, 3, 0],
    fingers: [0, 2, 1, 0, 3, 0],
    barreStrings: { fromString: 1, toString: 5 },
  },
  {
    family: "Aadd9-form",
    rootOffset: 9,
    frets: [-1, 0, 2, 4, 2, 0],
    fingers: [0, 0, 1, 3, 2, 0],
    barreStrings: { fromString: 1, toString: 5 },
  },
];

const POWER_SHAPES: BaseShape[] = [
  {
    family: "E5-form",
    rootOffset: 4,
    frets: [0, 2, 2, -1, -1, -1],
    fingers: [0, 1, 2, 0, 0, 0],
    barreStrings: { fromString: 4, toString: 6 },
  },
  {
    family: "A5-form",
    rootOffset: 9,
    frets: [-1, 0, 2, 2, -1, -1],
    fingers: [0, 0, 1, 2, 0, 0],
    barreStrings: { fromString: 3, toString: 5 },
  },
];

const DOM7SUS4_SHAPES: BaseShape[] = [
  {
    family: "E7sus4-form",
    rootOffset: 4,
    frets: [0, 2, 0, 2, 0, 0],
    fingers: [0, 1, 0, 2, 0, 0],
    barreStrings: { fromString: 1, toString: 6 },
  },
  {
    family: "A7sus4-form",
    rootOffset: 9,
    frets: [-1, 0, 2, 0, 3, 0],
    fingers: [0, 0, 1, 0, 3, 0],
    barreStrings: { fromString: 1, toString: 5 },
  },
];

const DOM9_SHAPES: BaseShape[] = [
  {
    family: "A9-form",
    rootOffset: 9,
    frets: [-1, 0, 2, 1, 2, 0],
    fingers: [0, 0, 2, 1, 3, 0],
    barreStrings: { fromString: 1, toString: 5 },
  },
];

const MIN6_SHAPES: BaseShape[] = [
  {
    family: "Em6-form",
    rootOffset: 4,
    frets: [0, 2, 2, 0, 2, 0],
    fingers: [0, 1, 2, 0, 3, 0],
    barreStrings: { fromString: 1, toString: 6 },
  },
];

const MAJ6_SHAPES: BaseShape[] = [
  {
    family: "E6-form",
    rootOffset: 4,
    frets: [0, 2, 2, 1, 2, 0],
    fingers: [0, 2, 3, 1, 4, 0],
    barreStrings: { fromString: 1, toString: 6 },
  },
  {
    family: "A6-form",
    rootOffset: 9,
    frets: [-1, 0, 2, 2, 2, 2],
    fingers: [0, 0, 1, 2, 3, 4],
    barreStrings: { fromString: 1, toString: 5 },
  },
];

// ── Quality → shapes mapping ───────────────────────────

function getShapesForQuality(quality: string): BaseShape[] {
  const q = quality.toLowerCase().replace(/\s/g, "");

  // Exact matches first
  if (q === "" || q === "maj" || q === "major") return MAJOR_SHAPES;
  if (q === "m" || q === "min" || q === "minor") return MINOR_SHAPES;
  if (q === "7" || q === "dom7") return DOM7_SHAPES;
  if (q === "m7" || q === "min7") return MIN7_SHAPES;
  if (q === "maj7" || q === "major7" || q === "M7") return MAJ7_SHAPES;
  if (q === "sus4" || q === "sus") return SUS4_SHAPES;
  if (q === "sus2") return SUS2_SHAPES;
  if (q === "dim" || q === "°" || q === "o") return DIM_SHAPES;
  if (q === "aug" || q === "+" || q === "#5") return AUG_SHAPES;
  if (q === "add9" || q === "add2") return ADD9_SHAPES;
  if (q === "5") return POWER_SHAPES;
  if (q === "7sus4") return DOM7SUS4_SHAPES;
  if (q === "9") return DOM9_SHAPES;
  if (q === "6") return MAJ6_SHAPES;
  if (q === "m6" || q === "min6") return MIN6_SHAPES;

  // Partial / fuzzy fallbacks
  if (q.startsWith("m") && q.includes("7")) return MIN7_SHAPES;
  if (q.includes("maj7")) return MAJ7_SHAPES;
  if (q.includes("sus4")) return SUS4_SHAPES;
  if (q.includes("sus2")) return SUS2_SHAPES;
  if (q.includes("7sus")) return DOM7SUS4_SHAPES;
  if (q.includes("dim")) return DIM_SHAPES;
  if (q.includes("aug")) return AUG_SHAPES;
  if (q.includes("add9") || q.includes("add2")) return ADD9_SHAPES;
  if (q.includes("7")) return DOM7_SHAPES;
  if (q.includes("9")) return DOM9_SHAPES;
  if (q.includes("6")) return MAJ6_SHAPES;
  if (q.startsWith("m")) return MINOR_SHAPES;

  // Ultimate fallback: major shapes
  return MAJOR_SHAPES;
}

// ── Voicing generation engine ──────────────────────────

const MAX_FRET = 16;

function shiftShape(shape: BaseShape, shift: number): ChordVoicing | null {
  if (shift < 0 || shift > MAX_FRET) return null;

  const frets: [number, number, number, number, number, number] = [
    0, 0, 0, 0, 0, 0,
  ];
  const fingers: [number, number, number, number, number, number] = [
    ...shape.fingers,
  ];

  for (let i = 0; i < 6; i++) {
    if (shape.frets[i] === -1) {
      frets[i] = -1;
    } else if (shape.frets[i] === 0) {
      if (shift === 0) {
        frets[i] = 0;
      } else {
        // Open strings get caught by the barre
        frets[i] = shift;
      }
    } else {
      frets[i] = shape.frets[i] + shift;
    }
  }

  // Check that max fret is playable (≤ MAX_FRET + 4)
  const maxFret = Math.max(...frets.filter((f) => f > 0));
  const minFret = Math.min(...frets.filter((f) => f > 0));
  if (maxFret > MAX_FRET + 4) return null;
  // Check span is ≤ 5 frets (human hand limit)
  if (maxFret - minFret > 4) return null;
  // Ensure at least one fretted note
  if (frets.every((f) => f <= 0)) return null;

  // Compute barres
  const barres: { fret: number; fromString: number; toString: number }[] = [];
  if (shift > 0 && shape.barreStrings) {
    barres.push({
      fret: shift,
      fromString: shape.barreStrings.fromString,
      toString: shape.barreStrings.toString,
    });
    // Update fingers: barre finger = 1
    for (let i = 0; i < 6; i++) {
      const stringNum = 6 - i; // 6=low E, 1=high e
      if (
        frets[i] === shift &&
        stringNum >= shape.barreStrings.fromString &&
        stringNum <= shape.barreStrings.toString
      ) {
        fingers[i] = 1;
      }
    }
  }

  // Compute baseFret for display
  const baseFret = minFret > 0 ? minFret : 1;

  return {
    name: "", // set by caller
    frets,
    fingers,
    barres: barres.length > 0 ? barres : undefined,
    baseFret,
    positionLabel: "",
  };
}

/**
 * Generate ALL playable voicings for a chord name.
 * Returns an array sorted by fret position (ascending).
 */
export function generateVoicings(chordName: string): ChordVoicing[] {
  const parsed = parseChordName(chordName);
  if (!parsed) return [];

  const { rootIdx, quality } = parsed;
  // We ignore the bass note for voicing generation (slash chords use the
  // nearest matching shape and the player adjusts the bass manually)
  const shapes = getShapesForQuality(quality);
  const voicings: ChordVoicing[] = [];

  for (const shape of shapes) {
    // How many semitones to shift this shape to reach our root
    const shift = (((rootIdx - shape.rootOffset) % 12) + 12) % 12;

    // Generate at shift, shift+12 (octave up)
    for (const extra of [0, 12]) {
      const totalShift = shift + extra;
      const voicing = shiftShape(shape, totalShift);
      if (voicing) {
        voicings.push(voicing);
      }
    }
  }

  // Sort by lowest fretted position
  voicings.sort((a, b) => {
    const aMin = Math.min(...a.frets.filter((f) => f > 0));
    const bMin = Math.min(...b.frets.filter((f) => f > 0));
    return aMin - bMin;
  });

  // Deduplicate (same frets)
  const seen = new Set<string>();
  const unique: ChordVoicing[] = [];
  for (const v of voicings) {
    const key = v.frets.join(",");
    if (!seen.has(key)) {
      seen.add(key);
      v.name = chordName;
      v.positionLabel = `Pos ${unique.length + 1}`;
      unique.push(v);
    }
  }

  return unique;
}

/**
 * Get the first (most common / open-position) voicing for a chord.
 * Never returns undefined — always generates at least a basic shape.
 */
export function getChordVoicing(chordName: string): ChordVoicing | null {
  const voicings = generateVoicings(chordName);
  return voicings[0] ?? null;
}

/**
 * Get ALL voicings for a chord, for the multi-position selector.
 */
export function getAllVoicings(chordName: string): ChordVoicing[] {
  return generateVoicings(chordName);
}

// ── Pre-computed overrides for common open chords ──────
// These are exact "textbook" voicings that override the generated ones
// for the best-known open-position chords.

const OPEN_OVERRIDES: Record<string, ChordVoicing> = {
  C: {
    name: "C",
    frets: [-1, 3, 2, 0, 1, 0],
    fingers: [0, 3, 2, 0, 1, 0],
    baseFret: 1,
    positionLabel: "Pos 1",
  },
  D: {
    name: "D",
    frets: [-1, -1, 0, 2, 3, 2],
    fingers: [0, 0, 0, 1, 3, 2],
    baseFret: 1,
    positionLabel: "Pos 1",
  },
  E: {
    name: "E",
    frets: [0, 2, 2, 1, 0, 0],
    fingers: [0, 2, 3, 1, 0, 0],
    baseFret: 1,
    positionLabel: "Pos 1",
  },
  F: {
    name: "F",
    frets: [1, 3, 3, 2, 1, 1],
    fingers: [1, 3, 4, 2, 1, 1],
    barres: [{ fret: 1, fromString: 1, toString: 6 }],
    baseFret: 1,
    positionLabel: "Pos 1",
  },
  G: {
    name: "G",
    frets: [3, 2, 0, 0, 0, 3],
    fingers: [2, 1, 0, 0, 0, 3],
    baseFret: 1,
    positionLabel: "Pos 1",
  },
  A: {
    name: "A",
    frets: [-1, 0, 2, 2, 2, 0],
    fingers: [0, 0, 1, 2, 3, 0],
    baseFret: 1,
    positionLabel: "Pos 1",
  },
  B: {
    name: "B",
    frets: [-1, 2, 4, 4, 4, 2],
    fingers: [0, 1, 2, 3, 4, 1],
    barres: [{ fret: 2, fromString: 1, toString: 5 }],
    baseFret: 1,
    positionLabel: "Pos 1",
  },
  Am: {
    name: "Am",
    frets: [-1, 0, 2, 2, 1, 0],
    fingers: [0, 0, 2, 3, 1, 0],
    baseFret: 1,
    positionLabel: "Pos 1",
  },
  Em: {
    name: "Em",
    frets: [0, 2, 2, 0, 0, 0],
    fingers: [0, 2, 3, 0, 0, 0],
    baseFret: 1,
    positionLabel: "Pos 1",
  },
  Dm: {
    name: "Dm",
    frets: [-1, -1, 0, 2, 3, 1],
    fingers: [0, 0, 0, 2, 3, 1],
    baseFret: 1,
    positionLabel: "Pos 1",
  },
  A7: {
    name: "A7",
    frets: [-1, 0, 2, 0, 2, 0],
    fingers: [0, 0, 1, 0, 2, 0],
    baseFret: 1,
    positionLabel: "Pos 1",
  },
  E7: {
    name: "E7",
    frets: [0, 2, 0, 1, 0, 0],
    fingers: [0, 2, 0, 1, 0, 0],
    baseFret: 1,
    positionLabel: "Pos 1",
  },
  D7: {
    name: "D7",
    frets: [-1, -1, 0, 2, 1, 2],
    fingers: [0, 0, 0, 2, 1, 3],
    baseFret: 1,
    positionLabel: "Pos 1",
  },
  G7: {
    name: "G7",
    frets: [3, 2, 0, 0, 0, 1],
    fingers: [3, 2, 0, 0, 0, 1],
    baseFret: 1,
    positionLabel: "Pos 1",
  },
  C7: {
    name: "C7",
    frets: [-1, 3, 2, 3, 1, 0],
    fingers: [0, 3, 2, 4, 1, 0],
    baseFret: 1,
    positionLabel: "Pos 1",
  },
  Am7: {
    name: "Am7",
    frets: [-1, 0, 2, 0, 1, 0],
    fingers: [0, 0, 2, 0, 1, 0],
    baseFret: 1,
    positionLabel: "Pos 1",
  },
  Em7: {
    name: "Em7",
    frets: [0, 2, 0, 0, 0, 0],
    fingers: [0, 1, 0, 0, 0, 0],
    baseFret: 1,
    positionLabel: "Pos 1",
  },
  Dm7: {
    name: "Dm7",
    frets: [-1, -1, 0, 2, 1, 1],
    fingers: [0, 0, 0, 2, 1, 1],
    baseFret: 1,
    positionLabel: "Pos 1",
  },
  Cmaj7: {
    name: "Cmaj7",
    frets: [-1, 3, 2, 0, 0, 0],
    fingers: [0, 3, 2, 0, 0, 0],
    baseFret: 1,
    positionLabel: "Pos 1",
  },
  Fmaj7: {
    name: "Fmaj7",
    frets: [-1, -1, 3, 2, 1, 0],
    fingers: [0, 0, 3, 2, 1, 0],
    baseFret: 1,
    positionLabel: "Pos 1",
  },
  A7sus4: {
    name: "A7sus4",
    frets: [-1, 0, 2, 0, 3, 0],
    fingers: [0, 0, 1, 0, 3, 0],
    baseFret: 1,
    positionLabel: "Pos 1",
  },
  Dsus4: {
    name: "Dsus4",
    frets: [-1, -1, 0, 2, 3, 3],
    fingers: [0, 0, 0, 1, 2, 3],
    baseFret: 1,
    positionLabel: "Pos 1",
  },
  Dsus2: {
    name: "Dsus2",
    frets: [-1, -1, 0, 2, 3, 0],
    fingers: [0, 0, 0, 1, 2, 0],
    baseFret: 1,
    positionLabel: "Pos 1",
  },
  Asus4: {
    name: "Asus4",
    frets: [-1, 0, 2, 2, 3, 0],
    fingers: [0, 0, 1, 2, 3, 0],
    baseFret: 1,
    positionLabel: "Pos 1",
  },
  Asus2: {
    name: "Asus2",
    frets: [-1, 0, 2, 2, 0, 0],
    fingers: [0, 0, 1, 2, 0, 0],
    baseFret: 1,
    positionLabel: "Pos 1",
  },
  Cadd9: {
    name: "Cadd9",
    frets: [-1, 3, 2, 0, 3, 0],
    fingers: [0, 2, 1, 0, 3, 0],
    baseFret: 1,
    positionLabel: "Pos 1",
  },
  "C/B": {
    name: "C/B",
    frets: [-1, 2, 2, 0, 1, 0],
    fingers: [0, 2, 3, 0, 1, 0],
    baseFret: 1,
    positionLabel: "Pos 1",
  },
  "C/E": {
    name: "C/E",
    frets: [0, 3, 2, 0, 1, 0],
    fingers: [0, 3, 2, 0, 1, 0],
    baseFret: 1,
    positionLabel: "Pos 1",
  },
  "C/G": {
    name: "C/G",
    frets: [3, 3, 2, 0, 1, 0],
    fingers: [3, 4, 2, 0, 1, 0],
    baseFret: 1,
    positionLabel: "Pos 1",
  },
  "D/F#": {
    name: "D/F#",
    frets: [2, -1, 0, 2, 3, 2],
    fingers: [1, 0, 0, 2, 4, 3],
    baseFret: 1,
    positionLabel: "Pos 1",
  },
  "G/B": {
    name: "G/B",
    frets: [-1, 2, 0, 0, 0, 3],
    fingers: [0, 1, 0, 0, 0, 3],
    baseFret: 1,
    positionLabel: "Pos 1",
  },
  "G/F#": {
    name: "G/F#",
    frets: [2, 2, 0, 0, 0, 3],
    fingers: [1, 2, 0, 0, 0, 3],
    baseFret: 1,
    positionLabel: "Pos 1",
  },
  "Am/E": {
    name: "Am/E",
    frets: [0, 0, 2, 2, 1, 0],
    fingers: [0, 0, 2, 3, 1, 0],
    baseFret: 1,
    positionLabel: "Pos 1",
  },
};

/**
 * Get the best voicing with open-chord overrides applied first.
 * This is used as the "primary" voicing shown by default.
 */
export function getBestVoicing(chordName: string): ChordVoicing | null {
  const override = OPEN_OVERRIDES[chordName];
  if (override) return override;
  return getChordVoicing(chordName);
}

/**
 * Get all voicings, with the override (if any) as the first entry.
 */
export function getAllVoicingsWithOverride(chordName: string): ChordVoicing[] {
  const override = OPEN_OVERRIDES[chordName];
  const generated = generateVoicings(chordName);

  if (override) {
    // Remove any generated voicing that matches the override
    const overrideKey = override.frets.join(",");
    const filtered = generated.filter((v) => v.frets.join(",") !== overrideKey);
    return [override, ...filtered];
  }
  return generated;
}
