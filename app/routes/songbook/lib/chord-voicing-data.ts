// ════════════════════════════════════════════════════════
// Chord Voicing Data – Standard guitar chord shapes
// ════════════════════════════════════════════════════════
//
// Each voicing describes ONE way to play a chord on standard tuning.
// - frets:   [E,A,D,G,B,e]  –1 = muted, 0 = open, 1+ = fretted
// - fingers: [E,A,D,G,B,e]   0 = not pressed, 1-4 = finger number, 5 = thumb (rare)
// - barres:  optional array of { fret, fromString, toString } (string 1=high e, 6=low E)
// - baseFret: the fret number shown on the diagram (1 = open-position / nut visible)

export interface ChordVoicing {
  name: string;
  frets: [number, number, number, number, number, number];
  fingers: [number, number, number, number, number, number];
  barres?: { fret: number; fromString: number; toString: number }[];
  baseFret: number;
}

/**
 * Master lookup: chord name → voicing data.
 * Includes all common open, barre, and extended chord shapes.
 */
export const CHORD_VOICINGS: Record<string, ChordVoicing> = {
  // ── Major chords ─────────────────────────────────────
  C: {
    name: "C",
    frets: [-1, 3, 2, 0, 1, 0],
    fingers: [0, 3, 2, 0, 1, 0],
    baseFret: 1,
  },
  D: {
    name: "D",
    frets: [-1, -1, 0, 2, 3, 2],
    fingers: [0, 0, 0, 1, 3, 2],
    baseFret: 1,
  },
  E: {
    name: "E",
    frets: [0, 2, 2, 1, 0, 0],
    fingers: [0, 2, 3, 1, 0, 0],
    baseFret: 1,
  },
  F: {
    name: "F",
    frets: [1, 3, 3, 2, 1, 1],
    fingers: [1, 3, 4, 2, 1, 1],
    barres: [{ fret: 1, fromString: 1, toString: 6 }],
    baseFret: 1,
  },
  G: {
    name: "G",
    frets: [3, 2, 0, 0, 0, 3],
    fingers: [2, 1, 0, 0, 0, 3],
    baseFret: 1,
  },
  A: {
    name: "A",
    frets: [-1, 0, 2, 2, 2, 0],
    fingers: [0, 0, 1, 2, 3, 0],
    baseFret: 1,
  },
  B: {
    name: "B",
    frets: [-1, 2, 4, 4, 4, 2],
    fingers: [0, 1, 2, 3, 4, 1],
    barres: [{ fret: 2, fromString: 1, toString: 5 }],
    baseFret: 1,
  },

  // ── Minor chords ─────────────────────────────────────
  Cm: {
    name: "Cm",
    frets: [-1, 3, 5, 5, 4, 3],
    fingers: [0, 1, 3, 4, 2, 1],
    barres: [{ fret: 3, fromString: 1, toString: 5 }],
    baseFret: 1,
  },
  Dm: {
    name: "Dm",
    frets: [-1, -1, 0, 2, 3, 1],
    fingers: [0, 0, 0, 2, 3, 1],
    baseFret: 1,
  },
  Em: {
    name: "Em",
    frets: [0, 2, 2, 0, 0, 0],
    fingers: [0, 2, 3, 0, 0, 0],
    baseFret: 1,
  },
  Fm: {
    name: "Fm",
    frets: [1, 3, 3, 1, 1, 1],
    fingers: [1, 3, 4, 1, 1, 1],
    barres: [{ fret: 1, fromString: 1, toString: 6 }],
    baseFret: 1,
  },
  Gm: {
    name: "Gm",
    frets: [3, 5, 5, 3, 3, 3],
    fingers: [1, 3, 4, 1, 1, 1],
    barres: [{ fret: 3, fromString: 1, toString: 6 }],
    baseFret: 1,
  },
  Am: {
    name: "Am",
    frets: [-1, 0, 2, 2, 1, 0],
    fingers: [0, 0, 2, 3, 1, 0],
    baseFret: 1,
  },
  Bm: {
    name: "Bm",
    frets: [-1, 2, 4, 4, 3, 2],
    fingers: [0, 1, 3, 4, 2, 1],
    barres: [{ fret: 2, fromString: 1, toString: 5 }],
    baseFret: 1,
  },

  // ── 7th chords ───────────────────────────────────────
  C7: {
    name: "C7",
    frets: [-1, 3, 2, 3, 1, 0],
    fingers: [0, 3, 2, 4, 1, 0],
    baseFret: 1,
  },
  D7: {
    name: "D7",
    frets: [-1, -1, 0, 2, 1, 2],
    fingers: [0, 0, 0, 2, 1, 3],
    baseFret: 1,
  },
  E7: {
    name: "E7",
    frets: [0, 2, 0, 1, 0, 0],
    fingers: [0, 2, 0, 1, 0, 0],
    baseFret: 1,
  },
  F7: {
    name: "F7",
    frets: [1, 3, 1, 2, 1, 1],
    fingers: [1, 3, 1, 2, 1, 1],
    barres: [{ fret: 1, fromString: 1, toString: 6 }],
    baseFret: 1,
  },
  G7: {
    name: "G7",
    frets: [3, 2, 0, 0, 0, 1],
    fingers: [3, 2, 0, 0, 0, 1],
    baseFret: 1,
  },
  A7: {
    name: "A7",
    frets: [-1, 0, 2, 0, 2, 0],
    fingers: [0, 0, 1, 0, 2, 0],
    baseFret: 1,
  },
  B7: {
    name: "B7",
    frets: [-1, 2, 1, 2, 0, 2],
    fingers: [0, 2, 1, 3, 0, 4],
    baseFret: 1,
  },

  // ── Minor 7th chords ─────────────────────────────────
  Cm7: {
    name: "Cm7",
    frets: [-1, 3, 5, 3, 4, 3],
    fingers: [0, 1, 3, 1, 2, 1],
    barres: [{ fret: 3, fromString: 1, toString: 5 }],
    baseFret: 1,
  },
  Dm7: {
    name: "Dm7",
    frets: [-1, -1, 0, 2, 1, 1],
    fingers: [0, 0, 0, 2, 1, 1],
    baseFret: 1,
  },
  Em7: {
    name: "Em7",
    frets: [0, 2, 0, 0, 0, 0],
    fingers: [0, 1, 0, 0, 0, 0],
    baseFret: 1,
  },
  Fm7: {
    name: "Fm7",
    frets: [1, 3, 1, 1, 1, 1],
    fingers: [1, 3, 1, 1, 1, 1],
    barres: [{ fret: 1, fromString: 1, toString: 6 }],
    baseFret: 1,
  },
  Am7: {
    name: "Am7",
    frets: [-1, 0, 2, 0, 1, 0],
    fingers: [0, 0, 2, 0, 1, 0],
    baseFret: 1,
  },
  Bm7: {
    name: "Bm7",
    frets: [-1, 2, 0, 2, 3, 2],
    fingers: [0, 1, 0, 2, 4, 3],
    baseFret: 1,
  },

  // ── Major 7th chords ─────────────────────────────────
  Cmaj7: {
    name: "Cmaj7",
    frets: [-1, 3, 2, 0, 0, 0],
    fingers: [0, 3, 2, 0, 0, 0],
    baseFret: 1,
  },
  Dmaj7: {
    name: "Dmaj7",
    frets: [-1, -1, 0, 2, 2, 2],
    fingers: [0, 0, 0, 1, 2, 3],
    baseFret: 1,
  },
  Emaj7: {
    name: "Emaj7",
    frets: [0, 2, 1, 1, 0, 0],
    fingers: [0, 3, 1, 2, 0, 0],
    baseFret: 1,
  },
  Fmaj7: {
    name: "Fmaj7",
    frets: [-1, -1, 3, 2, 1, 0],
    fingers: [0, 0, 3, 2, 1, 0],
    baseFret: 1,
  },
  Gmaj7: {
    name: "Gmaj7",
    frets: [3, 2, 0, 0, 0, 2],
    fingers: [3, 2, 0, 0, 0, 1],
    baseFret: 1,
  },
  Amaj7: {
    name: "Amaj7",
    frets: [-1, 0, 2, 1, 2, 0],
    fingers: [0, 0, 3, 1, 2, 0],
    baseFret: 1,
  },

  // ── sus2 chords ──────────────────────────────────────
  Csus2: {
    name: "Csus2",
    frets: [-1, 3, 3, 0, 1, 3],
    fingers: [0, 2, 3, 0, 1, 4],
    baseFret: 1,
  },
  Dsus2: {
    name: "Dsus2",
    frets: [-1, -1, 0, 2, 3, 0],
    fingers: [0, 0, 0, 1, 2, 0],
    baseFret: 1,
  },
  Esus2: {
    name: "Esus2",
    frets: [0, 2, 4, 4, 0, 0],
    fingers: [0, 1, 3, 4, 0, 0],
    baseFret: 1,
  },
  Asus2: {
    name: "Asus2",
    frets: [-1, 0, 2, 2, 0, 0],
    fingers: [0, 0, 1, 2, 0, 0],
    baseFret: 1,
  },

  // ── sus4 chords ──────────────────────────────────────
  Csus4: {
    name: "Csus4",
    frets: [-1, 3, 3, 0, 1, 1],
    fingers: [0, 3, 4, 0, 1, 2],
    baseFret: 1,
  },
  Dsus4: {
    name: "Dsus4",
    frets: [-1, -1, 0, 2, 3, 3],
    fingers: [0, 0, 0, 1, 2, 3],
    baseFret: 1,
  },
  Esus4: {
    name: "Esus4",
    frets: [0, 2, 2, 2, 0, 0],
    fingers: [0, 2, 3, 4, 0, 0],
    baseFret: 1,
  },
  Gsus4: {
    name: "Gsus4",
    frets: [3, 3, 0, 0, 1, 3],
    fingers: [2, 3, 0, 0, 1, 4],
    baseFret: 1,
  },
  Asus4: {
    name: "Asus4",
    frets: [-1, 0, 2, 2, 3, 0],
    fingers: [0, 0, 1, 2, 3, 0],
    baseFret: 1,
  },

  // ── Dominant 7sus4 ───────────────────────────────────
  A7sus4: {
    name: "A7sus4",
    frets: [-1, 0, 2, 0, 3, 0],
    fingers: [0, 0, 1, 0, 3, 0],
    baseFret: 1,
  },
  D7sus4: {
    name: "D7sus4",
    frets: [-1, -1, 0, 2, 1, 3],
    fingers: [0, 0, 0, 2, 1, 3],
    baseFret: 1,
  },
  E7sus4: {
    name: "E7sus4",
    frets: [0, 2, 0, 2, 0, 0],
    fingers: [0, 1, 0, 2, 0, 0],
    baseFret: 1,
  },

  // ── add9 chords ──────────────────────────────────────
  Cadd9: {
    name: "Cadd9",
    frets: [-1, 3, 2, 0, 3, 0],
    fingers: [0, 2, 1, 0, 3, 0],
    baseFret: 1,
  },
  Dadd9: {
    name: "Dadd9",
    frets: [-1, -1, 0, 2, 3, 0],
    fingers: [0, 0, 0, 1, 2, 0],
    baseFret: 1,
  },
  Gadd9: {
    name: "Gadd9",
    frets: [3, 0, 0, 0, 0, 3],
    fingers: [2, 0, 0, 0, 0, 3],
    baseFret: 1,
  },
  Eadd9: {
    name: "Eadd9",
    frets: [0, 2, 2, 1, 0, 2],
    fingers: [0, 2, 3, 1, 0, 4],
    baseFret: 1,
  },

  // ── Diminished ───────────────────────────────────────
  Bdim: {
    name: "Bdim",
    frets: [-1, 2, 3, 4, 3, -1],
    fingers: [0, 1, 2, 4, 3, 0],
    baseFret: 1,
  },
  Cdim: {
    name: "Cdim",
    frets: [-1, 3, 4, 5, 4, -1],
    fingers: [0, 1, 2, 4, 3, 0],
    baseFret: 1,
  },

  // ── Augmented ────────────────────────────────────────
  Caug: {
    name: "Caug",
    frets: [-1, 3, 2, 1, 1, 0],
    fingers: [0, 4, 3, 1, 2, 0],
    baseFret: 1,
  },
  Eaug: {
    name: "Eaug",
    frets: [0, 3, 2, 1, 1, 0],
    fingers: [0, 4, 3, 1, 2, 0],
    baseFret: 1,
  },

  // ── Slash / inversion chords ─────────────────────────
  "C/B": {
    name: "C/B",
    frets: [-1, 2, 2, 0, 1, 0],
    fingers: [0, 2, 3, 0, 1, 0],
    baseFret: 1,
  },
  "C/E": {
    name: "C/E",
    frets: [0, 3, 2, 0, 1, 0],
    fingers: [0, 3, 2, 0, 1, 0],
    baseFret: 1,
  },
  "C/G": {
    name: "C/G",
    frets: [3, 3, 2, 0, 1, 0],
    fingers: [3, 4, 2, 0, 1, 0],
    baseFret: 1,
  },
  "D/F#": {
    name: "D/F#",
    frets: [2, -1, 0, 2, 3, 2],
    fingers: [1, 0, 0, 2, 4, 3],
    baseFret: 1,
  },
  "G/B": {
    name: "G/B",
    frets: [-1, 2, 0, 0, 0, 3],
    fingers: [0, 1, 0, 0, 0, 3],
    baseFret: 1,
  },
  "G/F#": {
    name: "G/F#",
    frets: [2, 2, 0, 0, 0, 3],
    fingers: [1, 2, 0, 0, 0, 3],
    baseFret: 1,
  },
  "Am/E": {
    name: "Am/E",
    frets: [0, 0, 2, 2, 1, 0],
    fingers: [0, 0, 2, 3, 1, 0],
    baseFret: 1,
  },
  "Am/G": {
    name: "Am/G",
    frets: [3, 0, 2, 2, 1, 0],
    fingers: [4, 0, 2, 3, 1, 0],
    baseFret: 1,
  },
  "Em/B": {
    name: "Em/B",
    frets: [-1, 2, 2, 0, 0, 0],
    fingers: [0, 1, 2, 0, 0, 0],
    baseFret: 1,
  },
  "Em/D": {
    name: "Em/D",
    frets: [-1, -1, 0, 0, 0, 0],
    fingers: [0, 0, 0, 0, 0, 0],
    baseFret: 1,
  },

  // ── Power chords ─────────────────────────────────────
  C5: {
    name: "C5",
    frets: [-1, 3, 5, 5, -1, -1],
    fingers: [0, 1, 3, 4, 0, 0],
    baseFret: 1,
  },
  D5: {
    name: "D5",
    frets: [-1, -1, 0, 2, 3, -1],
    fingers: [0, 0, 0, 1, 2, 0],
    baseFret: 1,
  },
  E5: {
    name: "E5",
    frets: [0, 2, 2, -1, -1, -1],
    fingers: [0, 1, 2, 0, 0, 0],
    baseFret: 1,
  },
  G5: {
    name: "G5",
    frets: [3, 5, 5, -1, -1, -1],
    fingers: [1, 3, 4, 0, 0, 0],
    baseFret: 1,
  },
  A5: {
    name: "A5",
    frets: [-1, 0, 2, 2, -1, -1],
    fingers: [0, 0, 1, 2, 0, 0],
    baseFret: 1,
  },

  // ── 9th chords ───────────────────────────────────────
  C9: {
    name: "C9",
    frets: [-1, 3, 2, 3, 3, 3],
    fingers: [0, 2, 1, 3, 3, 3],
    barres: [{ fret: 3, fromString: 1, toString: 3 }],
    baseFret: 1,
  },
  D9: {
    name: "D9",
    frets: [-1, -1, 0, 2, 1, 0],
    fingers: [0, 0, 0, 2, 1, 0],
    baseFret: 1,
  },
  G9: {
    name: "G9",
    frets: [3, 0, 0, 0, 0, 1],
    fingers: [3, 0, 0, 0, 0, 1],
    baseFret: 1,
  },

  // ── Flat / sharp key chords ──────────────────────────
  "C#": {
    name: "C#",
    frets: [-1, 4, 6, 6, 6, 4],
    fingers: [0, 1, 2, 3, 4, 1],
    barres: [{ fret: 4, fromString: 1, toString: 5 }],
    baseFret: 1,
  },
  Db: {
    name: "Db",
    frets: [-1, 4, 6, 6, 6, 4],
    fingers: [0, 1, 2, 3, 4, 1],
    barres: [{ fret: 4, fromString: 1, toString: 5 }],
    baseFret: 1,
  },
  Eb: {
    name: "Eb",
    frets: [-1, -1, 1, 3, 4, 3],
    fingers: [0, 0, 1, 2, 4, 3],
    baseFret: 1,
  },
  "F#": {
    name: "F#",
    frets: [2, 4, 4, 3, 2, 2],
    fingers: [1, 3, 4, 2, 1, 1],
    barres: [{ fret: 2, fromString: 1, toString: 6 }],
    baseFret: 1,
  },
  Gb: {
    name: "Gb",
    frets: [2, 4, 4, 3, 2, 2],
    fingers: [1, 3, 4, 2, 1, 1],
    barres: [{ fret: 2, fromString: 1, toString: 6 }],
    baseFret: 1,
  },
  Ab: {
    name: "Ab",
    frets: [4, 6, 6, 5, 4, 4],
    fingers: [1, 3, 4, 2, 1, 1],
    barres: [{ fret: 4, fromString: 1, toString: 6 }],
    baseFret: 1,
  },
  "G#": {
    name: "G#",
    frets: [4, 6, 6, 5, 4, 4],
    fingers: [1, 3, 4, 2, 1, 1],
    barres: [{ fret: 4, fromString: 1, toString: 6 }],
    baseFret: 1,
  },
  Bb: {
    name: "Bb",
    frets: [-1, 1, 3, 3, 3, 1],
    fingers: [0, 1, 2, 3, 4, 1],
    barres: [{ fret: 1, fromString: 1, toString: 5 }],
    baseFret: 1,
  },
  "A#": {
    name: "A#",
    frets: [-1, 1, 3, 3, 3, 1],
    fingers: [0, 1, 2, 3, 4, 1],
    barres: [{ fret: 1, fromString: 1, toString: 5 }],
    baseFret: 1,
  },

  // ── Sharp/flat minor chords ──────────────────────────
  "C#m": {
    name: "C#m",
    frets: [-1, 4, 6, 6, 5, 4],
    fingers: [0, 1, 3, 4, 2, 1],
    barres: [{ fret: 4, fromString: 1, toString: 5 }],
    baseFret: 1,
  },
  Dbm: {
    name: "Dbm",
    frets: [-1, 4, 6, 6, 5, 4],
    fingers: [0, 1, 3, 4, 2, 1],
    barres: [{ fret: 4, fromString: 1, toString: 5 }],
    baseFret: 1,
  },
  Ebm: {
    name: "Ebm",
    frets: [-1, -1, 1, 3, 4, 2],
    fingers: [0, 0, 1, 3, 4, 2],
    baseFret: 1,
  },
  "F#m": {
    name: "F#m",
    frets: [2, 4, 4, 2, 2, 2],
    fingers: [1, 3, 4, 1, 1, 1],
    barres: [{ fret: 2, fromString: 1, toString: 6 }],
    baseFret: 1,
  },
  Gbm: {
    name: "Gbm",
    frets: [2, 4, 4, 2, 2, 2],
    fingers: [1, 3, 4, 1, 1, 1],
    barres: [{ fret: 2, fromString: 1, toString: 6 }],
    baseFret: 1,
  },
  "G#m": {
    name: "G#m",
    frets: [4, 6, 6, 4, 4, 4],
    fingers: [1, 3, 4, 1, 1, 1],
    barres: [{ fret: 4, fromString: 1, toString: 6 }],
    baseFret: 1,
  },
  Abm: {
    name: "Abm",
    frets: [4, 6, 6, 4, 4, 4],
    fingers: [1, 3, 4, 1, 1, 1],
    barres: [{ fret: 4, fromString: 1, toString: 6 }],
    baseFret: 1,
  },
  Bbm: {
    name: "Bbm",
    frets: [-1, 1, 3, 3, 2, 1],
    fingers: [0, 1, 3, 4, 2, 1],
    barres: [{ fret: 1, fromString: 1, toString: 5 }],
    baseFret: 1,
  },
  "A#m": {
    name: "A#m",
    frets: [-1, 1, 3, 3, 2, 1],
    fingers: [0, 1, 3, 4, 2, 1],
    barres: [{ fret: 1, fromString: 1, toString: 5 }],
    baseFret: 1,
  },

  // ── Sharp/flat 7th chords ────────────────────────────
  "F#7": {
    name: "F#7",
    frets: [2, 4, 2, 3, 2, 2],
    fingers: [1, 3, 1, 2, 1, 1],
    barres: [{ fret: 2, fromString: 1, toString: 6 }],
    baseFret: 1,
  },
  Bb7: {
    name: "Bb7",
    frets: [-1, 1, 3, 1, 3, 1],
    fingers: [0, 1, 3, 1, 4, 1],
    barres: [{ fret: 1, fromString: 1, toString: 5 }],
    baseFret: 1,
  },
  Eb7: {
    name: "Eb7",
    frets: [-1, -1, 1, 3, 2, 3],
    fingers: [0, 0, 1, 3, 2, 4],
    baseFret: 1,
  },
  Ab7: {
    name: "Ab7",
    frets: [4, 6, 4, 5, 4, 4],
    fingers: [1, 3, 1, 2, 1, 1],
    barres: [{ fret: 4, fromString: 1, toString: 6 }],
    baseFret: 1,
  },

  // ── Sharp/flat minor 7 ──────────────────────────────
  "F#m7": {
    name: "F#m7",
    frets: [2, 4, 2, 2, 2, 2],
    fingers: [1, 3, 1, 1, 1, 1],
    barres: [{ fret: 2, fromString: 1, toString: 6 }],
    baseFret: 1,
  },
  "G#m7": {
    name: "G#m7",
    frets: [4, 6, 4, 4, 4, 4],
    fingers: [1, 3, 1, 1, 1, 1],
    barres: [{ fret: 4, fromString: 1, toString: 6 }],
    baseFret: 1,
  },
  Bbm7: {
    name: "Bbm7",
    frets: [-1, 1, 3, 1, 2, 1],
    fingers: [0, 1, 3, 1, 2, 1],
    barres: [{ fret: 1, fromString: 1, toString: 5 }],
    baseFret: 1,
  },
};

/**
 * Look up a chord voicing by name.
 * Returns undefined if not found.
 */
export function getChordVoicing(name: string): ChordVoicing | undefined {
  return CHORD_VOICINGS[name];
}
