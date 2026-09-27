// ======================================================
// Bravura / SMuFL Glyph Utility
// ======================================================

export type NoteType =
  | "doubleWhole"
  | "whole"
  | "half"
  | "quarter"
  | "eighth"
  | "sixteenth"
  | "thirtySecond";

export type AccidentalType =
  | "sharp"
  | "flat"
  | "natural"
  | "doubleSharp"
  | "doubleFlat";

export type ClefType = "treble" | "bass" | "alto" | "tenor";

// ======================================================
// GLYPH MAPS
// ======================================================

export const NOTE_HEADS = {
  doubleWhole: 0xe1d0,
  whole: 0xe1d2,
  half: 0xe1d3,
  quarter: 0xe1d5,
} as const;

export const RESTS = {
  whole: 0xe4e3,
  half: 0xe4e4,
  quarter: 0xe4e5,
  eighth: 0xe4e6,
  sixteenth: 0xe4e7,
  thirtySecond: 0xe4e8,
} as const;

export const FLAGS = {
  eighthUp: 0xe240,
  eighthDown: 0xe241,
  sixteenthUp: 0xe242,
  sixteenthDown: 0xe243,
  thirtySecondUp: 0xe244,
  thirtySecondDown: 0xe245,
} as const;

export const ACCIDENTALS: Record<AccidentalType, number> = {
  sharp: 0xe262,
  flat: 0xe260,
  natural: 0xe261,
  doubleSharp: 0xe263,
  doubleFlat: 0xe264,
};

export const CLEFS: Record<ClefType, number> = {
  treble: 0xe050,
  bass: 0xe062,
  alto: 0xe05c,
  tenor: 0xe05d,
};

export const DOT = {
  dot: 0xe1e7,
} as const;

export const TIME = {
  common: 0xe08a,
  cut: 0xe08b,
} as const;

export const ARTICULATION = {
  staccato: 0xe4a2,
  accent: 0xe4a0,
  tenuto: 0xe4a4,
} as const;

export const DYNAMICS = {
  p: 0xe520,
  f: 0xe522,
  mf: 0xe52d,
  mp: 0xe52c,
} as const;

export const BARLINES = {
  single: 0xe030,
  double: 0xe031,
  final: 0xe032,
} as const;

// ======================================================
// CORE FUNCTION
// ======================================================

export const glyph = (code: number): string => String.fromCodePoint(code);

// ======================================================
// NOTE BUILDER (HEAD + OPTIONAL FLAG)
// ======================================================

export interface BuildNoteOptions {
  type: NoteType;
  direction?: "up" | "down";
  dotted?: boolean;
}

export const getNoteHead = (type: NoteType): number => {
  switch (type) {
    case "doubleWhole":
      return NOTE_HEADS.doubleWhole;
    case "whole":
      return NOTE_HEADS.whole;
    case "half":
      return NOTE_HEADS.half;
    default:
      return NOTE_HEADS.quarter;
  }
};

export const getFlag = (
  type: NoteType,
  direction: "up" | "down" = "up",
): number | null => {
  if (type === "eighth") {
    return direction === "up" ? FLAGS.eighthUp : FLAGS.eighthDown;
  }

  if (type === "sixteenth") {
    return direction === "up" ? FLAGS.sixteenthUp : FLAGS.sixteenthDown;
  }

  if (type === "thirtySecond") {
    return direction === "up" ? FLAGS.thirtySecondUp : FLAGS.thirtySecondDown;
  }

  return null;
};

// ======================================================
// BUILD NOTE STRING (SIMPLE RENDER)
// ======================================================

export const buildNoteGlyph = (options: BuildNoteOptions): string => {
  const { type, direction = "up", dotted } = options;

  const parts: string[] = [];

  // head
  parts.push(glyph(getNoteHead(type)));

  // flag (optional)
  const flag = getFlag(type, direction);
  if (flag) {
    parts.push(glyph(flag));
  }

  // dot
  if (dotted) {
    parts.push(glyph(DOT.dot));
  }

  return parts.join("");
};

// ======================================================
// EXPORT ALL (optional)
// ======================================================

export const MUSIC_GLYPHS = {
  note: NOTE_HEADS,
  rest: RESTS,
  flag: FLAGS,
  accidental: ACCIDENTALS,
  clef: CLEFS,
  articulation: ARTICULATION,
  dynamic: DYNAMICS,
  barline: BARLINES,
  time: TIME,
};
