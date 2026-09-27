// ════════════════════════════════════════════════════════
// Core Music Colors — Unified Chromatic Color System
// ════════════════════════════════════════════════════════
//
// Single source of truth for per-pitch-class coloring across
// the entire app: fretboard, ukulele, piano, studio, diagrams,
// chord cards, sight-reading, etc.
//
// DESIGN RULES:
// - Index 0-11 maps to C through B (chromatic)
// - Each pitch class owns ONE Tailwind hue
// - Derived maps (CSS classes, hex values, dot classes) are
//   computed from the canonical palette below.
// ════════════════════════════════════════════════════════

// ── Canonical Palette ──────────────────────────────────
//
// Defines the single hue name per pitch class.
// All derived color maps below are built from this.

export const CHROMATIC_HUES = [
  "pink", // 0  C
  "rose", // 1  C# / Db
  "orange", // 2  D
  "amber", // 3  D# / Eb
  "blue", // 4  E
  "cyan", // 5  F
  "teal", // 6  F# / Gb
  "emerald", // 7  G
  "lime", // 8  G# / Ab
  "violet", // 9  A
  "fuchsia", // 10 A# / Bb
  "sky", // 11 B
] as const;

export type ChromaticHue = (typeof CHROMATIC_HUES)[number];

// ── Tailwind Class Map (fretboard / ukulele / general) ─

export interface NoteColorClasses {
  border: string;
  text: string;
  bg: string;
  activeText: string;
}

/**
 * Tailwind class map per pitch class.
 *
 * Used by: Fretboard, UkuleleFretboard, chord cards,
 * studio grid, interval cards, etc.
 * Replaces old NOTE_COLOR_CLASSES & UKE_NOTE_COLOR_CLASSES.
 */
export const NOTE_COLOR_CLASSES: Record<number, NoteColorClasses> = {
  0: {
    border: "border-pink-500/80",
    text: "text-pink-500",
    bg: "bg-pink-500/20",
    activeText: "text-pink-100",
  },
  1: {
    border: "border-rose-500/80",
    text: "text-rose-500",
    bg: "bg-rose-500/20",
    activeText: "text-rose-100",
  },
  2: {
    border: "border-orange-500/80",
    text: "text-orange-500",
    bg: "bg-orange-500/20",
    activeText: "text-orange-100",
  },
  3: {
    border: "border-amber-500/80",
    text: "text-amber-500",
    bg: "bg-amber-500/20",
    activeText: "text-amber-100",
  },
  4: {
    border: "border-blue-500/80",
    text: "text-blue-500",
    bg: "bg-blue-500/20",
    activeText: "text-blue-100",
  },
  5: {
    border: "border-cyan-500/80",
    text: "text-cyan-500",
    bg: "bg-cyan-500/20",
    activeText: "text-cyan-100",
  },
  6: {
    border: "border-teal-500/80",
    text: "text-teal-500",
    bg: "bg-teal-500/20",
    activeText: "text-teal-100",
  },
  7: {
    border: "border-emerald-500/80",
    text: "text-emerald-500",
    bg: "bg-emerald-500/20",
    activeText: "text-emerald-100",
  },
  8: {
    border: "border-lime-500/80",
    text: "text-lime-500",
    bg: "bg-lime-500/20",
    activeText: "text-lime-100",
  },
  9: {
    border: "border-violet-500/80",
    text: "text-violet-500",
    bg: "bg-violet-500/20",
    activeText: "text-violet-100",
  },
  10: {
    border: "border-fuchsia-500/80",
    text: "text-fuchsia-500",
    bg: "bg-fuchsia-500/20",
    activeText: "text-fuchsia-100",
  },
  11: {
    border: "border-sky-500/80",
    text: "text-sky-500",
    bg: "bg-sky-500/20",
    activeText: "text-sky-100",
  },
};

// ── Dot Color Classes (sidebar / simple indicators) ────

/**
 * Simple background-only dot colors per pitch class (0-11).
 * Used in sidebar trees, tag dots, studio tree, etc.
 *
 * Replaces the old studio-constants NOTE_DOT_COLOR_CLASS
 * (which used an inconsistent rainbow mapping).
 * Now uses the same hue assignment as NOTE_COLOR_CLASSES.
 */
export const NOTE_DOT_COLORS = [
  "bg-pink-500", // 0  C
  "bg-rose-500", // 1  C#
  "bg-orange-500", // 2  D
  "bg-amber-500", // 3  D#
  "bg-blue-500", // 4  E
  "bg-cyan-500", // 5  F
  "bg-teal-500", // 6  F#
  "bg-emerald-500", // 7  G
  "bg-lime-500", // 8  G#
  "bg-violet-500", // 9  A
  "bg-fuchsia-500", // 10 A#
  "bg-sky-500", // 11 B
] as const;

/** Get dot color for a pitch class (0-11). */
export function noteDotColor(pitchClass: number | null | undefined): string {
  if (pitchClass == null) return "bg-muted-foreground/40";
  return NOTE_DOT_COLORS[((pitchClass % 12) + 12) % 12];
}

// ── Hex Color Map (SVG / Canvas contexts) ──────────────

export interface NoteHexColors {
  /** Primary fill color (e.g. for white piano keys) */
  primary: string;
  /** Darker variant (e.g. for black piano keys) */
  dark: string;
  /** Text color on filled background */
  text: string;
}

/**
 * Hex colors per pitch class for SVG/Canvas rendering.
 * Used in: PianoChordDiagram, ChordDiagram dots, etc.
 *
 * Each hue matches the Tailwind-500 value from CHROMATIC_HUES.
 */
export const NOTE_HEX_COLORS: Record<number, NoteHexColors> = {
  0: { primary: "#ec4899", dark: "#db2777", text: "#fff" }, // pink
  1: { primary: "#f43f5e", dark: "#e11d48", text: "#fff" }, // rose
  2: { primary: "#f97316", dark: "#ea580c", text: "#fff" }, // orange
  3: { primary: "#f59e0b", dark: "#d97706", text: "#fff" }, // amber
  4: { primary: "#3b82f6", dark: "#2563eb", text: "#fff" }, // blue
  5: { primary: "#06b6d4", dark: "#0891b2", text: "#fff" }, // cyan
  6: { primary: "#14b8a6", dark: "#0d9488", text: "#fff" }, // teal
  7: { primary: "#10b981", dark: "#059669", text: "#fff" }, // emerald
  8: { primary: "#84cc16", dark: "#65a30d", text: "#fff" }, // lime
  9: { primary: "#8b5cf6", dark: "#7c3aed", text: "#fff" }, // violet
  10: { primary: "#d946ef", dark: "#c026d3", text: "#fff" }, // fuchsia
  11: { primary: "#0ea5e9", dark: "#0284c7", text: "#fff" }, // sky
};

// ── Degree Color Classes ───────────────────────────────

/**
 * Tailwind classes for scale-degree badges / labels.
 * Used in chord detail pages, interval cards, family cards, etc.
 */
export function degreeColor(degree: string): string {
  const map: Record<string, string> = {
    "1": "bg-sky-100 text-sky-900 border-transparent",
    "2": "bg-emerald-100 text-emerald-900 border-transparent",
    "3": "bg-amber-100 text-amber-900 border-transparent",
    "4": "bg-indigo-100 text-indigo-900 border-transparent",
    "5": "bg-fuchsia-100 text-fuchsia-900 border-transparent",
    "6": "bg-rose-100 text-rose-900 border-transparent",
    "7": "bg-teal-100 text-teal-900 border-transparent",
    b2: "bg-emerald-200 text-emerald-950 border-transparent",
    "♭2": "bg-emerald-200 text-emerald-950 border-transparent",
    b3: "bg-amber-200 text-amber-950 border-transparent",
    "♭3": "bg-amber-200 text-amber-950 border-transparent",
    b5: "bg-fuchsia-200 text-fuchsia-950 border-transparent",
    "♭5": "bg-fuchsia-200 text-fuchsia-950 border-transparent",
    b6: "bg-rose-200 text-rose-950 border-transparent",
    "♭6": "bg-rose-200 text-rose-950 border-transparent",
    b7: "bg-teal-200 text-teal-950 border-transparent",
    "♭7": "bg-teal-200 text-teal-950 border-transparent",
    bb7: "bg-teal-300 text-teal-950 border-transparent",
    "𝄫7": "bg-teal-300 text-teal-950 border-transparent",
    b9: "bg-lime-200 text-lime-950 border-transparent",
    "♭9": "bg-lime-200 text-lime-950 border-transparent",
    b13: "bg-pink-200 text-pink-950 border-transparent",
    "♭13": "bg-pink-200 text-pink-950 border-transparent",
    "#2": "bg-emerald-300 text-emerald-950 border-transparent",
    "♯2": "bg-emerald-300 text-emerald-950 border-transparent",
    "#4": "bg-indigo-300 text-indigo-950 border-transparent",
    "♯4": "bg-indigo-300 text-indigo-950 border-transparent",
    "#5": "bg-fuchsia-300 text-fuchsia-950 border-transparent",
    "♯5": "bg-fuchsia-300 text-fuchsia-950 border-transparent",
    "#9": "bg-lime-300 text-lime-950 border-transparent",
    "♯9": "bg-lime-300 text-lime-950 border-transparent",
    "#11": "bg-violet-200 text-violet-950 border-transparent",
    "♯11": "bg-violet-200 text-violet-950 border-transparent",
    "#13": "bg-pink-300 text-pink-950 border-transparent",
    "♯13": "bg-pink-300 text-pink-950 border-transparent",
    "9": "bg-lime-100 text-lime-900 border-transparent",
    "11": "bg-violet-100 text-violet-900 border-transparent",
    "13": "bg-pink-100 text-pink-900 border-transparent",
  };
  return map[degree] ?? "bg-muted text-foreground border-border";
}

export function degreeColorText(degree: string): string {
  const map: Record<string, string> = {
    "1": "text-sky-900",
    "2": "text-emerald-900",
    "3": "text-amber-900",
    "4": "text-indigo-900",
    "5": "text-fuchsia-900",
    "6": "text-rose-900",
    "7": "text-teal-900",
    b2: "text-emerald-950",
    "♭2": "text-emerald-950",
    b3: "text-amber-950",
    "♭3": "text-amber-950",
    b5: "text-fuchsia-950",
    "♭5": "text-fuchsia-950",
    b6: "text-rose-950",
    "♭6": "text-rose-950",
    b7: "text-teal-950",
    "♭7": "text-teal-950",
    bb7: "text-teal-950", // no separate color for double-flat
    "𝄫7": "text-teal-950",
    b9: "text-lime-950",
    "♭9": "text-lime-950",
    b13: "text-pink-950",
    "♭13": "text-pink-950",
    "#2": "text-emerald-300",
    "♯2": "text-emerald-300",
    "#4": "text-indigo-300",
    "♯4": "text-indigo-300",
    "#5": "text-fuchsia-300",
    "♯5": "text-fuchsia-300",
    "#9": "text-lime-300",
    "♯9": "text-lime-300",
    "#11": "text-violet-200",
    "♯11": "text-violet-200",
    "#13": "text-pink-300",
    "♯13": "text-pink-300",
    "9": "text-lime-900",
    "11": "text-violet-900",
    "13": "text-pink-900",
  };
  return map[degree] ?? "text-foreground";
}
