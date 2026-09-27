// ════════════════════════════════════════════════════════
// Fingering Routine – Type Definitions
// ════════════════════════════════════════════════════════

export type Instrument = "guitar" | "piano";

/** A single note in an exercise sequence */
export interface ExerciseNote {
  /** Note name with octave, e.g. "C4", "E3" */
  note: string;
  /** MIDI number */
  midi: number;
  /** Pitch class 0-11 */
  pitchClass: number;
  /** Finger number (guitar: 0-4 fret hand, piano: 1-5) */
  finger: number;
  /** Duration in beats */
  duration: number;
  /** For guitar: string index (0-5), for piano: -1 */
  stringIndex?: number;
  /** For guitar: fret number */
  fret?: number;
}

/** An exercise definition */
export interface Exercise {
  id: string;
  name: string;
  description: string;
  instrument: Instrument;
  category: ExerciseCategory;
  difficulty: 1 | 2 | 3;
  /** Key / root note */
  key: string;
  /** BPM default */
  defaultBpm: number;
  /** The sequence of notes to play */
  notes: ExerciseNote[];
  /** Time signature */
  timeSignature: "4/4" | "3/4" | "6/8";
  /** Optional tips */
  tips?: string;
}

export type ExerciseCategory =
  | "scale"
  | "arpeggio"
  | "chord-transition"
  | "finger-independence"
  | "warm-up";

/** State for the exercise player */
export interface ExercisePlayerState {
  isPlaying: boolean;
  currentNoteIndex: number;
  bpm: number;
  loop: boolean;
  /** How many notes correctly played in mic mode */
  correctCount: number;
  totalPlayed: number;
}

/** Result from mic detection matching */
export interface MicMatchResult {
  expected: ExerciseNote;
  detected: {
    note: string;
    midi: number;
    cents: number;
    confidence: number;
  } | null;
  isCorrect: boolean;
  timestamp: number;
}

/** Difficulty label mapping */
export const DIFFICULTY_LABELS: Record<number, string> = {
  1: "Pemula",
  2: "Menengah",
  3: "Lanjutan",
};

export const DIFFICULTY_COLORS: Record<number, string> = {
  1: "text-green-600 border-green-500/30",
  2: "text-yellow-600 border-yellow-500/30",
  3: "text-red-600 border-red-500/30",
};

export const CATEGORY_LABELS: Record<ExerciseCategory, string> = {
  scale: "Tangga Nada",
  arpeggio: "Arpeggio",
  "chord-transition": "Transisi Chord",
  "finger-independence": "Independensi Jari",
  "warm-up": "Pemanasan",
};
