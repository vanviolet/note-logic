// ════════════════════════════════════════════════════════
// Sight Reading Module – Types
// ════════════════════════════════════════════════════════

import type { LucideIcon } from "lucide-react";

/** Clef types for staff rendering */
export type ClefType = "treble" | "bass";

/** Quiz input answering mode */
export type QuizInputMode = "choice" | "piano" | "fretboard";

/** Time signature */
export interface TimeSignature {
  beats: number;
  beatType: number;
}

/** Key signature — number of sharps (+) or flats (-) */
export type KeySignatureAccidentals = number;

/** A note in the staff context */
export interface StaffNote {
  /** VexFlow key format: "c/4", "d#/5", "bb/3" */
  key: string;
  /** Duration: "w" | "h" | "q" | "8" | "16" */
  duration: string;
  /** Display name for UI: "C4", "D#5" */
  displayName: string;
  /** MIDI number for audio playback */
  midi: number;
  /** Pitch class 0-11 */
  pitchClass: number;
  /** Octave */
  octave: number;
  /** Note letter */
  noteName: string;
  /** Whether it's a rest */
  isRest?: boolean;
}

/** A single quiz question */
export interface NoteQuizQuestion {
  /** The note displayed on staff */
  note: StaffNote;
  /** Multiple choice options (display names) */
  options: string[];
  /** Correct answer index */
  correctIdx: number;
}

/** Quiz difficulty level */
export type Difficulty = "beginner" | "intermediate" | "advanced";

/** Lesson topic */
export interface LessonTopic {
  id: string;
  title: string;
  description: string;
  clef: ClefType;
  /** Range of notes to teach (VexFlow key format) */
  noteRange: string[];
  /** Difficulty category */
  difficulty: Difficulty;
  /** Lucide icon component */
  icon: LucideIcon;
}

/** Duration lesson topic */
export interface DurationTopic {
  id: string;
  title: string;
  description: string;
  durations: {
    key: string;
    label: string;
    beats: number;
    vexDuration: string;
  }[];
  icon: LucideIcon;
}

/** Quiz session state */
export interface QuizState {
  questions: NoteQuizQuestion[];
  currentIdx: number;
  score: number;
  answers: (number | null)[];
  isComplete: boolean;
  startedAt: number;
}
