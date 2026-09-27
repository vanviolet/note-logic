// ════════════════════════════════════════════════════════
// Ukulele Chord Voicing Engine
// ════════════════════════════════════════════════════════
//
// Like the guitar voicing engine but for 4-string ukulele (GCEA tuning).
// Uses base shapes shifted by semitone to generate voicings.

// ── Types ──────────────────────────────────────────────

export interface UkuleleVoicing {
  name: string;
  frets: [number, number, number, number]; // -1=muted, 0=open, 1+=fretted
  fingers: [number, number, number, number]; // 0=not pressed, 1-4=finger
  barres?: { fret: number; fromString: number; toString: number }[];
  baseFret: number;
  positionLabel: string;
}

// ── Note helpers ───────────────────────────────────────

import { NOTE_INDEX } from "~/theory-music/core";

const CHORD_RE = /^([A-G][#b]?)(.*?)(?:\/([A-G][#b]?))?$/;

function parseChordName(name: string) {
  const m = CHORD_RE.exec(name);
  if (!m) return null;
  const rootIdx = NOTE_INDEX[m[1]];
  if (rootIdx === undefined) return null;
  return { rootIdx, quality: m[2] || "", bass: m[3] };
}

// ── Base shapes for ukulele (GCEA tuning) ──────────────

interface BaseShape {
  family: string;
  rootOffset: number; // semitone offset for root=C (pitch class)
  frets: [number, number, number, number];
  fingers: [number, number, number, number];
  barreStrings?: { fromString: number; toString: number };
}

// Major shapes
const MAJOR_SHAPES: BaseShape[] = [
  {
    family: "C-form",
    rootOffset: 0,
    frets: [0, 0, 0, 3],
    fingers: [0, 0, 0, 3],
    barreStrings: { fromString: 1, toString: 4 },
  },
  {
    family: "A-form",
    rootOffset: 9,
    frets: [2, 1, 0, 0],
    fingers: [2, 1, 0, 0],
    barreStrings: { fromString: 1, toString: 4 },
  },
  {
    family: "G-form",
    rootOffset: 7,
    frets: [0, 2, 3, 2],
    fingers: [0, 1, 3, 2],
    barreStrings: { fromString: 1, toString: 4 },
  },
  {
    family: "F-form",
    rootOffset: 5,
    frets: [2, 0, 1, 0],
    fingers: [2, 0, 1, 0],
    barreStrings: { fromString: 1, toString: 4 },
  },
  {
    family: "D-form",
    rootOffset: 2,
    frets: [2, 2, 2, 0],
    fingers: [1, 1, 1, 0],
    barreStrings: { fromString: 1, toString: 3 },
  },
];

// Minor shapes
const MINOR_SHAPES: BaseShape[] = [
  {
    family: "Am-form",
    rootOffset: 9,
    frets: [2, 0, 0, 0],
    fingers: [1, 0, 0, 0],
    barreStrings: { fromString: 1, toString: 4 },
  },
  {
    family: "Dm-form",
    rootOffset: 2,
    frets: [2, 2, 1, 0],
    fingers: [2, 3, 1, 0],
    barreStrings: { fromString: 1, toString: 4 },
  },
  {
    family: "Em-form",
    rootOffset: 4,
    frets: [0, 4, 3, 2],
    fingers: [0, 3, 2, 1],
    barreStrings: { fromString: 1, toString: 4 },
  },
];

// Dominant 7 shapes
const DOM7_SHAPES: BaseShape[] = [
  {
    family: "C7-form",
    rootOffset: 0,
    frets: [0, 0, 0, 1],
    fingers: [0, 0, 0, 1],
    barreStrings: { fromString: 1, toString: 4 },
  },
  {
    family: "A7-form",
    rootOffset: 9,
    frets: [0, 1, 0, 0],
    fingers: [0, 1, 0, 0],
    barreStrings: { fromString: 1, toString: 4 },
  },
  {
    family: "G7-form",
    rootOffset: 7,
    frets: [0, 2, 1, 2],
    fingers: [0, 2, 1, 3],
    barreStrings: { fromString: 1, toString: 4 },
  },
];

// Minor 7 shapes
const MIN7_SHAPES: BaseShape[] = [
  {
    family: "Am7-form",
    rootOffset: 9,
    frets: [0, 0, 0, 0],
    fingers: [0, 0, 0, 0],
    barreStrings: { fromString: 1, toString: 4 },
  },
  {
    family: "Dm7-form",
    rootOffset: 2,
    frets: [2, 2, 1, 3],
    fingers: [1, 2, 1, 3],
    barreStrings: { fromString: 1, toString: 4 },
  },
];

// Major 7 shapes
const MAJ7_SHAPES: BaseShape[] = [
  {
    family: "Cmaj7-form",
    rootOffset: 0,
    frets: [0, 0, 0, 2],
    fingers: [0, 0, 0, 1],
    barreStrings: { fromString: 1, toString: 4 },
  },
  {
    family: "Amaj7-form",
    rootOffset: 9,
    frets: [1, 1, 0, 0],
    fingers: [1, 2, 0, 0],
    barreStrings: { fromString: 1, toString: 4 },
  },
];

// Sus4 shapes
const SUS4_SHAPES: BaseShape[] = [
  {
    family: "Csus4-form",
    rootOffset: 0,
    frets: [0, 0, 1, 3],
    fingers: [0, 0, 1, 3],
    barreStrings: { fromString: 1, toString: 4 },
  },
];

// Sus2 shapes
const SUS2_SHAPES: BaseShape[] = [
  {
    family: "Csus2-form",
    rootOffset: 0,
    frets: [0, 2, 3, 3],
    fingers: [0, 1, 2, 3],
    barreStrings: { fromString: 1, toString: 4 },
  },
];

// Diminished shapes
const DIM_SHAPES: BaseShape[] = [
  {
    family: "dim-form",
    rootOffset: 9,
    frets: [2, 3, 2, 0],
    fingers: [1, 3, 2, 0],
    barreStrings: { fromString: 1, toString: 4 },
  },
];

// Augmented shapes
const AUG_SHAPES: BaseShape[] = [
  {
    family: "aug-form",
    rootOffset: 0,
    frets: [1, 0, 0, 3],
    fingers: [1, 0, 0, 3],
    barreStrings: { fromString: 1, toString: 4 },
  },
];

// ── Quality → shapes mapping ───────────────────────────

function getShapesForQuality(quality: string): BaseShape[] {
  const q = quality.toLowerCase().replace(/\s/g, "");

  if (q === "" || q === "maj" || q === "major") return MAJOR_SHAPES;
  if (q === "m" || q === "min" || q === "minor") return MINOR_SHAPES;
  if (q === "7" || q === "dom7") return DOM7_SHAPES;
  if (q === "m7" || q === "min7") return MIN7_SHAPES;
  if (q === "maj7" || q === "major7" || q === "M7") return MAJ7_SHAPES;
  if (q === "sus4" || q === "sus") return SUS4_SHAPES;
  if (q === "sus2") return SUS2_SHAPES;
  if (q === "dim" || q === "°" || q === "o") return DIM_SHAPES;
  if (q === "aug" || q === "+" || q === "#5") return AUG_SHAPES;

  // Fuzzy fallbacks
  if (q.includes("maj7")) return MAJ7_SHAPES;
  if (q.startsWith("m") && q.includes("7")) return MIN7_SHAPES;
  if (q.includes("sus4")) return SUS4_SHAPES;
  if (q.includes("sus2")) return SUS2_SHAPES;
  if (q.includes("dim")) return DIM_SHAPES;
  if (q.includes("aug")) return AUG_SHAPES;
  if (q.includes("7")) return DOM7_SHAPES;
  if (q.startsWith("m")) return MINOR_SHAPES;

  return MAJOR_SHAPES;
}

// ── Voicing generation engine ──────────────────────────

const MAX_FRET = 12;

function shiftShape(shape: BaseShape, shift: number): UkuleleVoicing | null {
  if (shift < 0 || shift > MAX_FRET) return null;

  const frets: [number, number, number, number] = [0, 0, 0, 0];
  const fingers: [number, number, number, number] = [...shape.fingers];

  for (let i = 0; i < 4; i++) {
    if (shape.frets[i] === -1) {
      frets[i] = -1;
    } else if (shape.frets[i] === 0) {
      frets[i] = shift === 0 ? 0 : shift;
    } else {
      frets[i] = shape.frets[i] + shift;
    }
  }

  const playedFrets = frets.filter((f) => f > 0);
  if (playedFrets.length === 0 && shift > 0) return null;
  const maxFret = playedFrets.length > 0 ? Math.max(...playedFrets) : 0;
  const minFret = playedFrets.length > 0 ? Math.min(...playedFrets) : 0;
  if (maxFret > MAX_FRET + 4) return null;
  if (maxFret - minFret > 4) return null;

  const barres: { fret: number; fromString: number; toString: number }[] = [];
  if (shift > 0 && shape.barreStrings) {
    barres.push({
      fret: shift,
      fromString: shape.barreStrings.fromString,
      toString: shape.barreStrings.toString,
    });
    for (let i = 0; i < 4; i++) {
      const stringNum = 4 - i;
      if (
        frets[i] === shift &&
        stringNum >= shape.barreStrings.fromString &&
        stringNum <= shape.barreStrings.toString
      ) {
        fingers[i] = 1;
      }
    }
  }

  const baseFret = minFret > 0 ? minFret : 1;

  return {
    name: "",
    frets,
    fingers,
    barres: barres.length > 0 ? barres : undefined,
    baseFret,
    positionLabel: "",
  };
}

const generateUkuleleVoicingsCache = new Map<string, UkuleleVoicing[]>();
const bestUkuleleVoicingCache = new Map<string, UkuleleVoicing | null>();
const allUkuleleVoicingsCache = new Map<string, UkuleleVoicing[]>();

export function generateUkuleleVoicings(chordName: string): UkuleleVoicing[] {
  const cached = generateUkuleleVoicingsCache.get(chordName);
  if (cached) return cached;

  const parsed = parseChordName(chordName);
  if (!parsed) return [];

  const { rootIdx, quality } = parsed;
  const shapes = getShapesForQuality(quality);
  const voicings: UkuleleVoicing[] = [];

  for (const shape of shapes) {
    const shift = (((rootIdx - shape.rootOffset) % 12) + 12) % 12;
    for (const extra of [0, 12]) {
      const totalShift = shift + extra;
      const voicing = shiftShape(shape, totalShift);
      if (voicing) voicings.push(voicing);
    }
  }

  voicings.sort((a, b) => {
    const aMin = Math.min(...a.frets.filter((f) => f > 0).concat(999));
    const bMin = Math.min(...b.frets.filter((f) => f > 0).concat(999));
    return aMin - bMin;
  });

  const seen = new Set<string>();
  const unique: UkuleleVoicing[] = [];
  for (const v of voicings) {
    const key = v.frets.join(",");
    if (!seen.has(key)) {
      seen.add(key);
      v.name = chordName;
      v.positionLabel = `Pos ${unique.length + 1}`;
      unique.push(v);
    }
  }

  generateUkuleleVoicingsCache.set(chordName, unique);
  return unique;
}

// ── Pre-computed overrides for common open chords ──────

const OPEN_OVERRIDES: Record<string, UkuleleVoicing> = {
  C: {
    name: "C",
    frets: [0, 0, 0, 3],
    fingers: [0, 0, 0, 3],
    baseFret: 1,
    positionLabel: "Pos 1",
  },
  D: {
    name: "D",
    frets: [2, 2, 2, 0],
    fingers: [1, 1, 2, 0],
    barres: [{ fret: 2, fromString: 2, toString: 4 }],
    baseFret: 1,
    positionLabel: "Pos 1",
  },
  E: {
    name: "E",
    frets: [1, 4, 0, 2],
    fingers: [1, 4, 0, 2],
    baseFret: 1,
    positionLabel: "Pos 1",
  },
  F: {
    name: "F",
    frets: [2, 0, 1, 0],
    fingers: [2, 0, 1, 0],
    baseFret: 1,
    positionLabel: "Pos 1",
  },
  G: {
    name: "G",
    frets: [0, 2, 3, 2],
    fingers: [0, 1, 3, 2],
    baseFret: 1,
    positionLabel: "Pos 1",
  },
  A: {
    name: "A",
    frets: [2, 1, 0, 0],
    fingers: [2, 1, 0, 0],
    baseFret: 1,
    positionLabel: "Pos 1",
  },
  B: {
    name: "B",
    frets: [4, 3, 2, 2],
    fingers: [3, 2, 1, 1],
    barres: [{ fret: 2, fromString: 1, toString: 2 }],
    baseFret: 1,
    positionLabel: "Pos 1",
  },
  Am: {
    name: "Am",
    frets: [2, 0, 0, 0],
    fingers: [1, 0, 0, 0],
    baseFret: 1,
    positionLabel: "Pos 1",
  },
  Em: {
    name: "Em",
    frets: [0, 4, 3, 2],
    fingers: [0, 3, 2, 1],
    baseFret: 1,
    positionLabel: "Pos 1",
  },
  Dm: {
    name: "Dm",
    frets: [2, 2, 1, 0],
    fingers: [2, 3, 1, 0],
    baseFret: 1,
    positionLabel: "Pos 1",
  },
  Fm: {
    name: "Fm",
    frets: [1, 0, 1, 3],
    fingers: [1, 0, 2, 4],
    baseFret: 1,
    positionLabel: "Pos 1",
  },
  Gm: {
    name: "Gm",
    frets: [0, 2, 3, 1],
    fingers: [0, 2, 3, 1],
    baseFret: 1,
    positionLabel: "Pos 1",
  },
  Bm: {
    name: "Bm",
    frets: [4, 2, 2, 2],
    fingers: [4, 1, 1, 1],
    barres: [{ fret: 2, fromString: 1, toString: 3 }],
    baseFret: 1,
    positionLabel: "Pos 1",
  },
  A7: {
    name: "A7",
    frets: [0, 1, 0, 0],
    fingers: [0, 1, 0, 0],
    baseFret: 1,
    positionLabel: "Pos 1",
  },
  C7: {
    name: "C7",
    frets: [0, 0, 0, 1],
    fingers: [0, 0, 0, 1],
    baseFret: 1,
    positionLabel: "Pos 1",
  },
  D7: {
    name: "D7",
    frets: [2, 2, 2, 3],
    fingers: [1, 1, 1, 2],
    barres: [{ fret: 2, fromString: 2, toString: 4 }],
    baseFret: 1,
    positionLabel: "Pos 1",
  },
  E7: {
    name: "E7",
    frets: [1, 2, 0, 2],
    fingers: [1, 2, 0, 3],
    baseFret: 1,
    positionLabel: "Pos 1",
  },
  G7: {
    name: "G7",
    frets: [0, 2, 1, 2],
    fingers: [0, 2, 1, 3],
    baseFret: 1,
    positionLabel: "Pos 1",
  },
  Am7: {
    name: "Am7",
    frets: [0, 0, 0, 0],
    fingers: [0, 0, 0, 0],
    baseFret: 1,
    positionLabel: "Pos 1",
  },
  Cmaj7: {
    name: "Cmaj7",
    frets: [0, 0, 0, 2],
    fingers: [0, 0, 0, 1],
    baseFret: 1,
    positionLabel: "Pos 1",
  },
};

export function getBestUkuleleVoicing(
  chordName: string,
): UkuleleVoicing | null {
  if (bestUkuleleVoicingCache.has(chordName)) {
    return bestUkuleleVoicingCache.get(chordName) ?? null;
  }
  const override = OPEN_OVERRIDES[chordName];
  if (override) {
    bestUkuleleVoicingCache.set(chordName, override);
    return override;
  }
  const voicings = generateUkuleleVoicings(chordName);
  const result = voicings[0] ?? null;
  bestUkuleleVoicingCache.set(chordName, result);
  return result;
}

export function getAllUkuleleVoicings(chordName: string): UkuleleVoicing[] {
  const cached = allUkuleleVoicingsCache.get(chordName);
  if (cached) return cached;

  const override = OPEN_OVERRIDES[chordName];
  const generated = generateUkuleleVoicings(chordName);

  if (override) {
    const overrideKey = override.frets.join(",");
    const filtered = generated.filter((v) => v.frets.join(",") !== overrideKey);
    const result = [override, ...filtered];
    allUkuleleVoicingsCache.set(chordName, result);
    return result;
  }
  allUkuleleVoicingsCache.set(chordName, generated);
  return generated;
}
