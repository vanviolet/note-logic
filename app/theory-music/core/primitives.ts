// ════════════════════════════════════════════════════════
// Core Music Primitives — Single Source of Truth
// ════════════════════════════════════════════════════════
//
// ALL pitch-class constants, note names, enharmonic lookups,
// color mappings, and fundamental helpers live HERE.
//
// Every other file in the codebase must import from this module
// instead of redefining its own `BASE_PC`, `NOTE_INDEX`,
// `NOTES_SHARP`, or color maps.
// ════════════════════════════════════════════════════════

// ── Types ──────────────────────────────────────────────

export type SpellMode = "auto" | "flat" | "sharp";

export interface PitchClass {
  /** Pitch class index 0-11 (C=0 … B=11) */
  pc: number;
  /** All enharmonic names for this pitch class */
  names: string[];
}

/**
 * Full enharmonic note index.
 * Maps EVERY common spelled name (incl. flats, sharps, double accidentals)
 * to its pitch class 0-11.
 */
export type NoteIndex = Record<string, number>;

// ── 12 Pitch Classes ───────────────────────────────────

export const PITCH_CLASSES: readonly PitchClass[] = [
  { pc: 0, names: ["C", "B#"] },
  { pc: 1, names: ["C#", "Db"] },
  { pc: 2, names: ["D"] },
  { pc: 3, names: ["D#", "Eb"] },
  { pc: 4, names: ["E", "Fb"] },
  { pc: 5, names: ["F", "E#"] },
  { pc: 6, names: ["F#", "Gb"] },
  { pc: 7, names: ["G"] },
  { pc: 8, names: ["G#", "Ab"] },
  { pc: 9, names: ["A"] },
  { pc: 10, names: ["A#", "Bb"] },
  { pc: 11, names: ["B", "Cb"] },
] as const;

// ── Chromatic Note Arrays ──────────────────────────────

/** Sharp-spelled chromatic notes (C through B) */
export const NOTES_SHARP = [
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
export type NoteNameSharp = (typeof NOTES_SHARP)[number];

/** Flat-spelled chromatic notes */
export const NOTES_FLAT = [
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
export type NoteNameFlat = (typeof NOTES_FLAT)[number];

/** All root note options including enharmonic equivalents */
export const ALL_NOTE_OPTIONS: readonly string[] = [
  "C",
  "C#",
  "Db",
  "D",
  "D#",
  "Eb",
  "E",
  "Fb",
  "F",
  "E#",
  "F#",
  "Gb",
  "G",
  "G#",
  "Ab",
  "A",
  "A#",
  "Bb",
  "B",
  "Cb",
  "B#",
];

/** Root options with both sharps and flats */
export const ROOT_FILTER_OPTIONS = [
  "C",
  "C#",
  "Db",
  "D",
  "D#",
  "Eb",
  "E",
  "F",
  "F#",
  "Gb",
  "G",
  "G#",
  "Ab",
  "A",
  "A#",
  "Bb",
  "B",
  "Cb",
] as const;
export type RootFilterOption = (typeof ROOT_FILTER_OPTIONS)[number];

/** Root options (sharp only) */
export const ROOT_SHARP_OPTIONS = NOTES_SHARP;

/** Root options (flat only) */
export const ROOT_FLAT_OPTIONS = NOTES_FLAT;

// ── Key Sets ───────────────────────────────────────────

export const FLAT_KEYS = new Set(["F", "Bb", "Eb", "Ab", "Db", "Gb", "Cb"]);
export const SHARP_KEYS = new Set(["G", "D", "A", "E", "B", "F#", "C#"]);

// ── Base Pitch Class Map (letter → pc) ─────────────────
//
// This replaces ALL the `BASE_PC` / `baseMap` duplicates scattered
// across fretboard.tsx, ukulele-fretboard.tsx, studio-utils.ts, music.tsx.

export const BASE_PC: Readonly<Record<string, number>> = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
};

// ── Full Enharmonic Note Index ─────────────────────────
//
// This replaces ALL the `NOTE_INDEX` duplicates across
// chord-voicing-engine.ts, piano-chord-diagram.tsx,
// ukulele-voicing-engine.ts, exercise-data.ts.

export const NOTE_INDEX: NoteIndex = {
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

// ── Root Octave Mapping ────────────────────────────────

/**
 * Root note → base octave for playable note generation.
 * Lower notes (E-B) use octave 2 to stay in guitar range.
 */
export const ROOT_OCTAVES: Readonly<Record<string, number>> = {
  C: 3,
  "C#": 3,
  Db: 3,
  D: 3,
  "D#": 3,
  Eb: 3,
  E: 2,
  F: 2,
  "F#": 2,
  Gb: 2,
  G: 2,
  "G#": 2,
  Ab: 2,
  A: 2,
  "A#": 2,
  Bb: 2,
  B: 2,
  Cb: 2,
};

// ── Core Functions ─────────────────────────────────────

/**
 * Convert any spelled note name to pitch class 0-11.
 *
 * Tries the PITCH_CLASSES lookup first, then falls back to
 * manual letter + accidental parsing.
 */
export function rootToPc(root: string): number {
  // Fast path: exact match in NOTE_INDEX
  const direct = NOTE_INDEX[root];
  if (direct !== undefined) return direct;

  // Slow path: manual parse (handles exotic spellings)
  const base = root[0]?.toUpperCase();
  let pc = BASE_PC[base ?? "C"] ?? 0;
  for (const ch of root.slice(1)) {
    if (ch === "#" || ch === "♯") pc = (pc + 1) % 12;
    else if (ch === "b" || ch === "♭") pc = (pc + 11) % 12;
  }
  return pc;
}

/**
 * Choose an enharmonic name for a pitch class based on context/preference.
 */
export function pickName(
  pc: number,
  root: string,
  spell: SpellMode = "auto",
): string {
  const rec = PITCH_CLASSES.find((p) => p.pc === pc);
  const names = rec ? rec.names : [];
  if (names.length === 0) return "";
  if (names.length === 1) return names[0];
  if (spell === "flat") return names.find((n) => n.includes("b")) ?? names[0];
  if (spell === "sharp") return names.find((n) => n.includes("#")) ?? names[0];
  if (root.includes("b") || FLAT_KEYS.has(root))
    return names.find((n) => n.includes("b")) ?? names[0];
  if (root.includes("#") || SHARP_KEYS.has(root))
    return names.find((n) => n.includes("#")) ?? names[0];
  return names[0];
}

/**
 * Simple chromatic transposition using sharp spellings.
 */
export function transpose(note: string, semitone: number): string {
  const idx = NOTES_SHARP.indexOf(note as NoteNameSharp);
  if (idx === -1) return note;
  return NOTES_SHARP[(idx + ((semitone % 12) + 12)) % 12];
}

/**
 * Pitch class → spelled name (convenience wrapper for pickName).
 */
export function pcToName(
  pc: number,
  root: string,
  spell: SpellMode = "auto",
): string {
  return pickName(((pc % 12) + 12) % 12, root, spell);
}

/**
 * Normalizes Unicode accidentals to ASCII equivalents.
 * ♯ → #, ♭ → b
 */
export function normalizeNoteName(note: string): string {
  return note.replace(/♯/g, "#").replace(/♭/g, "b");
}

/**
 * Parse a scientific-pitch notation string like "E4", "Bb3", "C#5"
 * into { pitchClass, octave }.
 */
export function parseScientificNote(input: string): {
  pitchClass: number;
  octave: number;
} {
  const normalized = normalizeNoteName(input);
  const match = normalized.match(/^([A-Ga-g])([#b]*)(-?\d+)$/);
  if (!match) return { pitchClass: 0, octave: 4 };

  const letter = match[1].toUpperCase();
  const accidental = match[2] ?? "";
  const octave = Number(match[3]);

  let pitchClass = BASE_PC[letter] ?? 0;
  for (const ch of accidental) {
    if (ch === "#") pitchClass = (pitchClass + 1) % 12;
    if (ch === "b") pitchClass = (pitchClass + 11) % 12;
  }
  return { pitchClass: ((pitchClass % 12) + 12) % 12, octave };
}
