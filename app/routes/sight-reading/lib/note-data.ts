// ════════════════════════════════════════════════════════
// Sight Reading – Music Data & Note Generation
// ════════════════════════════════════════════════════════

import {
  Music,
  Music2,
  Music3,
  Music4,
  Guitar,
  Keyboard,
  Timer,
  Target,
} from "lucide-react";
import type {
  StaffNote,
  NoteQuizQuestion,
  ClefType,
  LessonTopic,
  DurationTopic,
} from "../types";

// ── Note Data ──────────────────────────────────────────

const _SHARP_NAMES = [
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

/**
 * Convert a VexFlow key (e.g. "c/4", "f#/5") to a StaffNote.
 */
export function vexKeyToStaffNote(vexKey: string, duration = "q"): StaffNote {
  const [noteRaw, octStr] = vexKey.split("/");
  const octave = parseInt(octStr, 10);

  // Normalize note name
  let noteName = noteRaw.charAt(0).toUpperCase() + noteRaw.slice(1);
  // Convert VexFlow accidentals: # stays, b stays
  noteName = noteName.replace("bb", "b");

  // Calculate pitch class
  const naturalMap: Record<string, number> = {
    C: 0,
    D: 2,
    E: 4,
    F: 5,
    G: 7,
    A: 9,
    B: 11,
  };
  let pc = naturalMap[noteName.charAt(0)] ?? 0;
  if (noteName.includes("#")) pc = (pc + 1) % 12;
  if (noteName.includes("b") && noteName.length > 1) pc = (pc + 11) % 12;

  const midi = (octave + 1) * 12 + pc;

  return {
    key: vexKey.toLowerCase(),
    duration,
    displayName: `${noteName}${octave}`,
    midi,
    pitchClass: pc,
    octave,
    noteName,
  };
}

// ── Treble Clef Notes (Middle C to G5) ─────────────────

export const TREBLE_NOTES_ALL: StaffNote[] = [
  // Ledger lines below
  "c/4",
  "d/4",
  // On staff
  "e/4",
  "f/4",
  "g/4",
  "a/4",
  "b/4",
  "c/5",
  "d/5",
  "e/5",
  "f/5",
  // Ledger lines above
  "g/5",
  "a/5",
].map((k) => vexKeyToStaffNote(k));

// ── Bass Clef Notes (E2 to Middle C) ───────────────────

export const BASS_NOTES_ALL: StaffNote[] = [
  // Ledger lines below
  "e/2",
  "f/2",
  // On staff
  "g/2",
  "a/2",
  "b/2",
  "c/3",
  "d/3",
  "e/3",
  "f/3",
  "g/3",
  "a/3",
  // Ledger lines above
  "b/3",
  "c/4",
].map((k) => vexKeyToStaffNote(k));

// ── Lesson Topics ──────────────────────────────────────

export const LESSON_TOPICS: LessonTopic[] = [
  {
    id: "treble-spaces",
    title: "Treble Clef – Spasi (FACE)",
    description:
      "Pelajari 4 not yang berada di spasi garis paranada treble: F, A, C, E. Mudah diingat dengan akronim FACE.",
    clef: "treble",
    noteRange: ["f/4", "a/4", "c/5", "e/5"],
    difficulty: "beginner",
    icon: Music,
  },
  {
    id: "treble-lines",
    title: "Treble Clef – Garis (EGBDF)",
    description:
      "Pelajari 5 not pada garis paranada treble: E, G, B, D, F. Akronim: Every Good Boy Does Fine.",
    clef: "treble",
    noteRange: ["e/4", "g/4", "b/4", "d/5", "f/5"],
    difficulty: "beginner",
    icon: Music2,
  },
  {
    id: "treble-all",
    title: "Treble Clef – Semua Not",
    description:
      "Gabungan semua not pada treble clef, termasuk ledger line di bawah (C4, D4) dan atas (G5, A5).",
    clef: "treble",
    noteRange: TREBLE_NOTES_ALL.map((n) => n.key),
    difficulty: "intermediate",
    icon: Music3,
  },
  {
    id: "bass-spaces",
    title: "Bass Clef – Spasi (ACEG)",
    description:
      "4 not di spasi garis paranada bass: A, C, E, G. Akronim: All Cows Eat Grass.",
    clef: "bass",
    noteRange: ["a/2", "c/3", "e/3", "g/3"],
    difficulty: "beginner",
    icon: Music4,
  },
  {
    id: "bass-lines",
    title: "Bass Clef – Garis (GBDFA)",
    description:
      "5 not pada garis paranada bass: G, B, D, F, A. Akronim: Good Boys Do Fine Always.",
    clef: "bass",
    noteRange: ["g/2", "b/2", "d/3", "f/3", "a/3"],
    difficulty: "beginner",
    icon: Guitar,
  },
  {
    id: "bass-all",
    title: "Bass Clef – Semua Not",
    description: "Gabungan semua not pada bass clef termasuk ledger lines.",
    clef: "bass",
    noteRange: BASS_NOTES_ALL.map((n) => n.key),
    difficulty: "intermediate",
    icon: Keyboard,
  },
  {
    id: "grand-staff",
    title: "Grand Staff – Treble & Bass",
    description:
      "Latihan membaca not pada kedua clef secara bergantian. Level lanjutan untuk persiapan membaca partitur piano.",
    clef: "treble", // will alternate
    noteRange: [
      ...TREBLE_NOTES_ALL.map((n) => n.key),
      ...BASS_NOTES_ALL.map((n) => n.key),
    ],
    difficulty: "advanced",
    icon: Keyboard,
  },
];

// ── Duration Topics ────────────────────────────────────

export const DURATION_TOPICS: DurationTopic[] = [
  {
    id: "basic-durations",
    title: "Nilai Not Dasar",
    description: "Whole, half, quarter, eighth note dan rest-nya.",
    icon: Timer,
    durations: [
      { key: "whole", label: "Whole Note", beats: 4, vexDuration: "w" },
      { key: "half", label: "Half Note", beats: 2, vexDuration: "h" },
      { key: "quarter", label: "Quarter Note", beats: 1, vexDuration: "q" },
      { key: "eighth", label: "Eighth Note", beats: 0.5, vexDuration: "8" },
    ],
  },
  {
    id: "advanced-durations",
    title: "Nilai Not Lanjutan",
    description: "Sixteenth note, dotted notes, triplet.",
    icon: Target,
    durations: [
      {
        key: "sixteenth",
        label: "Sixteenth Note",
        beats: 0.25,
        vexDuration: "16",
      },
      {
        key: "dotted-half",
        label: "Dotted Half",
        beats: 3,
        vexDuration: "hd",
      },
      {
        key: "dotted-quarter",
        label: "Dotted Quarter",
        beats: 1.5,
        vexDuration: "qd",
      },
    ],
  },
];

// ── Quiz Generation ────────────────────────────────────

/**
 * Generate N quiz questions from a given note range.
 * Each question picks a random note and creates 4 options.
 */
export function generateNoteQuiz(
  noteKeys: string[],
  count = 10,
  clef: ClefType = "treble",
): NoteQuizQuestion[] {
  const pool =
    clef === "treble"
      ? TREBLE_NOTES_ALL.filter((n) => noteKeys.includes(n.key))
      : BASS_NOTES_ALL.filter((n) => noteKeys.includes(n.key));

  // For grand-staff, merge both pools
  const fullPool =
    noteKeys.length > 13
      ? [...TREBLE_NOTES_ALL, ...BASS_NOTES_ALL].filter((n) =>
          noteKeys.includes(n.key),
        )
      : pool;

  if (fullPool.length < 4) return [];

  const questions: NoteQuizQuestion[] = [];

  for (let i = 0; i < count; i++) {
    // Pick random note
    const correctNote = fullPool[Math.floor(Math.random() * fullPool.length)];

    // Build options: correct + 3 wrong
    const wrongPool = fullPool.filter(
      (n) => n.displayName !== correctNote.displayName,
    );
    const shuffledWrong = wrongPool.sort(() => Math.random() - 0.5).slice(0, 3);
    const options = [correctNote, ...shuffledWrong].sort(
      () => Math.random() - 0.5,
    );

    const correctIdx = options.findIndex(
      (o) => o.displayName === correctNote.displayName,
    );

    questions.push({
      note: correctNote,
      options: options.map((o) => o.displayName),
      correctIdx,
    });
  }

  return questions;
}

/**
 * Get notes for a specific lesson topic.
 */
export function getNotesForTopic(topic: LessonTopic): StaffNote[] {
  const pool = topic.clef === "treble" ? TREBLE_NOTES_ALL : BASS_NOTES_ALL;

  // For grand-staff, merge
  if (topic.id === "grand-staff") {
    return [...TREBLE_NOTES_ALL, ...BASS_NOTES_ALL].filter((n) =>
      topic.noteRange.includes(n.key),
    );
  }

  return pool.filter((n) => topic.noteRange.includes(n.key));
}

/**
 * Determine clef for a given note.
 */
export function getClefForNote(note: StaffNote): ClefType {
  // Notes below middle C (C4) → bass, above → treble
  if (note.midi < 60) return "bass";
  return "treble";
}

/**
 * Format note name for VexFlow accidental.
 * Returns { noteLetter, accidental } for StaveNote construction.
 */
export function parseNoteForVex(vexKey: string): {
  letter: string;
  accidental: string | null;
} {
  const [noteRaw] = vexKey.split("/");
  const letter = noteRaw.charAt(0).toLowerCase();
  const rest = noteRaw.slice(1);

  if (rest === "#") return { letter, accidental: "#" };
  if (rest === "b") return { letter, accidental: "b" };
  if (rest === "bb") return { letter, accidental: "bb" };
  if (rest === "##") return { letter, accidental: "##" };
  return { letter, accidental: null };
}

// ── Staff Position Helpers ─────────────────────────────

/** Ledger line mnemonic data for reference/learning */
export const TREBLE_MNEMONICS = {
  lines: {
    notes: ["E4", "G4", "B4", "D5", "F5"],
    mnemonic: "Every Good Boy Does Fine",
    mnemonicId: "Elang Gagah Berdiri Diファnci",
  },
  spaces: {
    notes: ["F4", "A4", "C5", "E5"],
    mnemonic: "FACE",
    mnemonicId: "FACE (sudah mudah diingat!)",
  },
};

export const BASS_MNEMONICS = {
  lines: {
    notes: ["G2", "B2", "D3", "F3", "A3"],
    mnemonic: "Good Boys Do Fine Always",
    mnemonicId: "Gajah Besar Duduk di Fantasi Alam",
  },
  spaces: {
    notes: ["A2", "C3", "E3", "G3"],
    mnemonic: "All Cows Eat Grass",
    mnemonicId: "Aku Cinta Es Gurih",
  },
};
