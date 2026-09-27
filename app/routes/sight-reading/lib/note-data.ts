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

export interface NoteExplanation {
  noteDisplayName: string;
  clef: ClefType;
  positionName: string;
  positionDetail: string;
  mnemonicTitle: string;
  mnemonicSentence: string;
  mnemonicHighlight: string;
  pianoGuide: string;
  guitarPositions: string[];
  fixTips: string[];
}

const TREBLE_POSITION_MAP: Record<
  string,
  {
    positionName: string;
    detail: string;
    mnemonicTitle: string;
    mnemonicSentence: string;
    mnemonicHighlight: string;
    pianoGuide: string;
    guitarPositions: string[];
    tips: string[];
  }
> = {
  C4: {
    positionName: "Garis Bantu ke-1 di Bawah (Middle C)",
    detail: "Not C4 (Middle C) berada pada garis bantu (ledger line) pertama tepat di bawah paranada Treble Clef.",
    mnemonicTitle: "Middle C (Pusat Paranada)",
    mnemonicSentence: "C4 adalah titik acuan tengah antara Treble Clef dan Bass Clef.",
    mnemonicHighlight: "C4 = Satu garis potong di bawah staff",
    pianoGuide: "Tuts C tepat di tengah keyboard piano (Middle C / MIDI 60).",
    guitarPositions: ["Senar 2 Fret 1", "Senar 3 Fret 5", "Senar 4 Fret 10"],
    tips: [
      "Ingat: Middle C selalu digambarkan dengan 1 garis kecil melintang melalui kepala not.",
      "Pada piano, ini adalah C yang berada tepat di tengah piano akustik.",
    ],
  },
  D4: {
    positionName: "Di Bawah Garis ke-1 (Space below staff)",
    detail: "Not D4 menempel tepat di bawah garis pertama (paling bawah) paranada Treble Clef tanpa garis potong.",
    mnemonicTitle: "Not di Bawah Garis 1",
    mnemonicSentence: "Satu langkah di atas Middle C4 dan menggantung di bawah garis E4.",
    mnemonicHighlight: "D4 = Menggantung di bawah Garis 1",
    pianoGuide: "Tuts putih D oktaf 4, tepat di antara 2 tuts hitam pertama di kanan Middle C.",
    guitarPositions: ["Senar 2 Fret 3", "Senar 3 Fret 7", "Senar 4 Fret 12"],
    tips: [
      "Jangan tertukar dengan D3 (open string senar 4) yang berada 1 oktaf lebih rendah.",
      "D4 menempel di bawah garis 1, satu nada sebelum garis E4.",
    ],
  },
  E4: {
    positionName: "Garis ke-1 (Garis Paling Bawah)",
    detail: "Not E4 terletak tepat di atas garis ke-1 (paling bawah) paranada Treble Clef.",
    mnemonicTitle: "Garis Treble: EGBDF",
    mnemonicSentence: "Every Good Boy Does Fine (E - G - B - D - F)",
    mnemonicHighlight: "E = Every (Garis ke-1)",
    pianoGuide: "Tuts putih E oktaf 4, di sebelah kanan tuts D4.",
    guitarPositions: ["Senar 1 Fret 0 (Open)", "Senar 2 Fret 5", "Senar 3 Fret 9"],
    tips: [
      "Garis 1 adalah huruf pertama dari akronim 'Every Good Boy Does Fine'.",
      "Pada gitar, E4 adalah senar 1 open string (senar paling tipis).",
    ],
  },
  F4: {
    positionName: "Spasi ke-1 (Spasi Paling Bawah)",
    detail: "Not F4 berada di spasi pertama, yaitu ruang antara garis 1 (E4) dan garis 2 (G4).",
    mnemonicTitle: "Spasi Treble: FACE",
    mnemonicSentence: "FACE (F - A - C - E)",
    mnemonicHighlight: "F = Huruf Pertama FACE (Spasi ke-1)",
    pianoGuide: "Tuts putih F oktaf 4, di sebelah kiri kelompok 3 tuts hitam.",
    guitarPositions: ["Senar 1 Fret 1", "Senar 2 Fret 6", "Senar 3 Fret 10"],
    tips: [
      "Spasi treble membentuk kata 'FACE'. Huruf pertama F berada di spasi paling bawah.",
    ],
  },
  G4: {
    positionName: "Garis ke-2 (Garis Kunci G)",
    detail: "Not G4 berada pada garis ke-2. Simbol Treble Clef melingkari garis ini (sehingga disebut G-Clef).",
    mnemonicTitle: "Garis Treble: EGBDF",
    mnemonicSentence: "Every Good Boy Does Fine (E - G - B - D - F)",
    mnemonicHighlight: "G = Good (Garis ke-2)",
    pianoGuide: "Tuts putih G oktaf 4.",
    guitarPositions: ["Senar 1 Fret 3", "Senar 2 Fret 8", "Senar 3 Fret 12"],
    tips: [
      "Simbol Treble Clef mulai digambar dari pusaran pada garis ke-2 (G4).",
      "G3 adalah open string senar 3, sedangkan G4 berada pada Senar 1 Fret 3.",
    ],
  },
  A4: {
    positionName: "Spasi ke-2",
    detail: "Not A4 berada di spasi ke-2, yaitu ruang antara garis 2 (G4) dan garis 3 (B4).",
    mnemonicTitle: "Spasi Treble: FACE",
    mnemonicSentence: "FACE (F - A - C - E)",
    mnemonicHighlight: "A = Huruf Kedua FACE (Spasi ke-2)",
    pianoGuide: "Tuts putih A oktaf 4 (Standard Pitch 440 Hz).",
    guitarPositions: ["Senar 1 Fret 5", "Senar 2 Fret 10"],
    tips: [
      "Spasi ke-2 adalah huruf A dari akronim FACE.",
      "A4 adalah nada patokan standar tuning internasional (440 Hz).",
    ],
  },
  B4: {
    positionName: "Garis ke-3 (Garis Tengah)",
    detail: "Not B4 terletak tepat pada garis ke-3 (garis tengah persis dari 5 garis paranada).",
    mnemonicTitle: "Garis Treble: EGBDF",
    mnemonicSentence: "Every Good Boy Does Fine (E - G - B - D - F)",
    mnemonicHighlight: "B = Boy (Garis ke-3 Tengah)",
    pianoGuide: "Tuts putih B oktaf 4, tuts sebelum C5.",
    guitarPositions: ["Senar 1 Fret 7", "Senar 2 Fret 12"],
    tips: [
      "Garis ke-3 adalah garis tengah. Tangkai not pada garis ini bisa menghadap ke atas maupun ke bawah.",
    ],
  },
  C5: {
    positionName: "Spasi ke-3",
    detail: "Not C5 berada di spasi ke-3, ruang antara garis 3 (B4) dan garis 4 (D5).",
    mnemonicTitle: "Spasi Treble: FACE",
    mnemonicSentence: "FACE (F - A - C - E)",
    mnemonicHighlight: "C = Huruf Ketiga FACE (Spasi ke-3)",
    pianoGuide: "Tuts putih C oktaf 5 (satu oktaf di atas Middle C).",
    guitarPositions: ["Senar 1 Fret 8"],
    tips: [
      "C5 adalah huruf C dari akronim FACE pada spasi ke-3.",
      "C5 berada 1 oktaf lebih tinggi dari Middle C (C4).",
    ],
  },
  D5: {
    positionName: "Garis ke-4",
    detail: "Not D5 terletak tepat pada garis ke-4 dari bawah pada paranada Treble Clef.",
    mnemonicTitle: "Garis Treble: EGBDF",
    mnemonicSentence: "Every Good Boy Does Fine (E - G - B - D - F)",
    mnemonicHighlight: "D = Does (Garis ke-4)",
    pianoGuide: "Tuts putih D oktaf 5 (di sebelah kanan C5).",
    guitarPositions: ["Senar 1 Fret 10"],
    tips: [
      "Hitung dari garis bawah: 1 (E), 2 (G), 3 (B), 4 (D) -> D5.",
      "Jangan tertukar dengan D3 (senar 4 open) atau D4 (di bawah garis 1). D5 berada tinggi pada garis ke-4!",
    ],
  },
  E5: {
    positionName: "Spasi ke-4 (Spasi Paling Atas)",
    detail: "Not E5 berada di spasi ke-4 (ruang paling atas antara garis 4 dan 5).",
    mnemonicTitle: "Spasi Treble: FACE",
    mnemonicSentence: "FACE (F - A - C - E)",
    mnemonicHighlight: "E = Huruf Terakhir FACE (Spasi ke-4)",
    pianoGuide: "Tuts putih E oktaf 5.",
    guitarPositions: ["Senar 1 Fret 12"],
    tips: [
      "Spasi ke-4 adalah huruf E terakhir dari akronim FACE.",
      "Pada gitar, E5 berada tepat di fret 12 senar 1 (oktaf dari open string senar 1).",
    ],
  },
  F5: {
    positionName: "Garis ke-5 (Garis Paling Atas)",
    detail: "Not F5 terletak tepat pada garis ke-5 (garis paling atas dari paranada).",
    mnemonicTitle: "Garis Treble: EGBDF",
    mnemonicSentence: "Every Good Boy Does Fine (E - G - B - D - F)",
    mnemonicHighlight: "F = Fine (Garis ke-5 Paling Atas)",
    pianoGuide: "Tuts putih F oktaf 5.",
    guitarPositions: ["Senar 1 Fret 13"],
    tips: [
      "Garis ke-5 adalah huruf terakhir 'Fine' pada akronim EGBDF.",
    ],
  },
  G5: {
    positionName: "Di Atas Garis ke-5",
    detail: "Not G5 menempel tepat di atas garis ke-5 (paling atas) tanpa garis bantu potong.",
    mnemonicTitle: "Not Menempel di Atas Staff",
    mnemonicSentence: "Satu langkah nada di atas garis ke-5 (F5).",
    mnemonicHighlight: "G5 = Duduk di atas garis ke-5",
    pianoGuide: "Tuts putih G oktaf 5.",
    guitarPositions: ["Senar 1 Fret 15"],
    tips: ["G5 duduk santai di atas garis paling atas paranada."],
  },
  A5: {
    positionName: "Garis Bantu ke-1 di Atas",
    detail: "Not A5 terletak pada garis bantu (ledger line) pertama di atas paranada.",
    mnemonicTitle: "Ledger Line Atas",
    mnemonicSentence: "Dua langkah di atas garis ke-5 (F5).",
    mnemonicHighlight: "A5 = 1 garis potong di atas staff",
    pianoGuide: "Tuts putih A oktaf 5.",
    guitarPositions: ["Senar 1 Fret 17"],
    tips: ["A5 adalah not tinggi dengan 1 garis kecil melintang di atas staff."],
  },
};

const BASS_POSITION_MAP: Record<
  string,
  {
    positionName: string;
    detail: string;
    mnemonicTitle: string;
    mnemonicSentence: string;
    mnemonicHighlight: string;
    pianoGuide: string;
    guitarPositions: string[];
    tips: string[];
  }
> = {
  E2: {
    positionName: "Garis Bantu ke-1 di Bawah (Bass Clef)",
    detail: "Not E2 berada pada garis bantu pertama di bawah paranada Bass Clef.",
    mnemonicTitle: "Ledger Line Bawah Bass",
    mnemonicSentence: "Nada bass rendah, setara dengan open string senar 6 gitar.",
    mnemonicHighlight: "E2 = 1 garis potong di bawah staff bass",
    pianoGuide: "Tuts putih E oktaf 2 (nada bass rendah).",
    guitarPositions: ["Senar 6 Fret 0 (Open)"],
    tips: ["E2 adalah senar 6 open string pada gitar standar."],
  },
  F2: {
    positionName: "Menempel di Bawah Garis ke-1 (Bass Clef)",
    detail: "Not F2 menempel di bawah garis pertama paranada Bass Clef.",
    mnemonicTitle: "Di Bawah Garis 1 Bass",
    mnemonicSentence: "Satu langkah di bawah garis G2.",
    mnemonicHighlight: "F2 = Di bawah Garis 1 Bass",
    pianoGuide: "Tuts putih F oktaf 2.",
    guitarPositions: ["Senar 6 Fret 1"],
    tips: ["F2 menempel di bawah garis 1 Bass Clef."],
  },
  G2: {
    positionName: "Garis ke-1 (Garis Paling Bawah Bass Clef)",
    detail: "Not G2 terletak tepat pada garis ke-1 (paling bawah) paranada Bass Clef.",
    mnemonicTitle: "Garis Bass: GBDFA",
    mnemonicSentence: "Good Boys Do Fine Always (G - B - D - F - A)",
    mnemonicHighlight: "G = Good (Garis ke-1)",
    pianoGuide: "Tuts putih G oktaf 2.",
    guitarPositions: ["Senar 6 Fret 3"],
    tips: ["Garis pertama Bass Clef adalah nada G2 ('Good')."],
  },
  A2: {
    positionName: "Spasi ke-1 (Bass Clef)",
    detail: "Not A2 berada pada spasi pertama dari bawah pada Bass Clef.",
    mnemonicTitle: "Spasi Bass: ACEG",
    mnemonicSentence: "All Cows Eat Grass (A - C - E - G)",
    mnemonicHighlight: "A = All (Spasi ke-1)",
    pianoGuide: "Tuts putih A oktaf 2.",
    guitarPositions: ["Senar 5 Fret 0 (Open)", "Senar 6 Fret 5"],
    tips: ["Spasi pertama Bass Clef adalah A2 (akronim 'All Cows Eat Grass')."],
  },
  B2: {
    positionName: "Garis ke-2 (Bass Clef)",
    detail: "Not B2 terletak pada garis ke-2 dari bawah pada Bass Clef.",
    mnemonicTitle: "Garis Bass: GBDFA",
    mnemonicSentence: "Good Boys Do Fine Always (G - B - D - F - A)",
    mnemonicHighlight: "B = Boys (Garis ke-2)",
    pianoGuide: "Tuts putih B oktaf 2.",
    guitarPositions: ["Senar 5 Fret 2", "Senar 6 Fret 7"],
    tips: ["Garis ke-2 adalah huruf B ('Boys')."],
  },
  C3: {
    positionName: "Spasi ke-2 (Bass Clef)",
    detail: "Not C3 berada pada spasi ke-2 pada Bass Clef.",
    mnemonicTitle: "Spasi Bass: ACEG",
    mnemonicSentence: "All Cows Eat Grass (A - C - E - G)",
    mnemonicHighlight: "C = Cows (Spasi ke-2)",
    pianoGuide: "Tuts putih C oktaf 3.",
    guitarPositions: ["Senar 5 Fret 3", "Senar 6 Fret 8"],
    tips: ["Spasi ke-2 Bass Clef adalah C3 ('Cows')."],
  },
  D3: {
    positionName: "Garis ke-3 (Garis Tengah Bass Clef)",
    detail: "Not D3 terletak pada garis ke-3 (tengah) pada Bass Clef.",
    mnemonicTitle: "Garis Bass: GBDFA",
    mnemonicSentence: "Good Boys Do Fine Always (G - B - D - F - A)",
    mnemonicHighlight: "D = Do (Garis ke-3)",
    pianoGuide: "Tuts putih D oktaf 3.",
    guitarPositions: ["Senar 4 Fret 0 (Open)", "Senar 5 Fret 5", "Senar 6 Fret 10"],
    tips: [
      "D3 adalah garis tengah Bass Clef dan open string senar 4 gitar.",
      "Jangan tertukar dengan D4 (Treble) atau D5 (Garis 4 Treble).",
    ],
  },
  E3: {
    positionName: "Spasi ke-3 (Bass Clef)",
    detail: "Not E3 berada pada spasi ke-3 pada Bass Clef.",
    mnemonicTitle: "Spasi Bass: ACEG",
    mnemonicSentence: "All Cows Eat Grass (A - C - E - G)",
    mnemonicHighlight: "E = Eat (Spasi ke-3)",
    pianoGuide: "Tuts putih E oktaf 3.",
    guitarPositions: ["Senar 4 Fret 2", "Senar 5 Fret 7", "Senar 6 Fret 12"],
    tips: ["Spasi ke-3 Bass Clef adalah E3 ('Eat')."],
  },
  F3: {
    positionName: "Garis ke-4 (Garis Kunci F)",
    detail: "Not F3 terletak pada garis ke-4. Dua titik pada simbol Bass Clef mengapit garis ini (F-Clef).",
    mnemonicTitle: "Garis Bass: GBDFA",
    mnemonicSentence: "Good Boys Do Fine Always (G - B - D - F - A)",
    mnemonicHighlight: "F = Fine (Garis ke-4 / F-Clef)",
    pianoGuide: "Tuts putih F oktaf 3.",
    guitarPositions: ["Senar 4 Fret 3", "Senar 5 Fret 8"],
    tips: ["Dua titik pada Bass Clef menunjukkan bahwa garis ke-4 adalah not F3."],
  },
  G3: {
    positionName: "Spasi ke-4 (Spasi Paling Atas Bass Clef)",
    detail: "Not G3 berada pada spasi ke-4 pada Bass Clef.",
    mnemonicTitle: "Spasi Bass: ACEG",
    mnemonicSentence: "All Cows Eat Grass (A - C - E - G)",
    mnemonicHighlight: "G = Grass (Spasi ke-4)",
    pianoGuide: "Tuts putih G oktaf 3.",
    guitarPositions: ["Senar 3 Fret 0 (Open)", "Senar 4 Fret 5", "Senar 5 Fret 10"],
    tips: ["G3 adalah spasi paling atas Bass Clef dan open string senar 3 gitar."],
  },
  A3: {
    positionName: "Garis ke-5 (Garis Paling Atas Bass Clef)",
    detail: "Not A3 terletak pada garis ke-5 (paling atas) Bass Clef.",
    mnemonicTitle: "Garis Bass: GBDFA",
    mnemonicSentence: "Good Boys Do Fine Always (G - B - D - F - A)",
    mnemonicHighlight: "A = Always (Garis ke-5)",
    pianoGuide: "Tuts putih A oktaf 3.",
    guitarPositions: ["Senar 3 Fret 2", "Senar 4 Fret 7", "Senar 5 Fret 12"],
    tips: ["Garis paling atas Bass Clef adalah nada A3 ('Always')."],
  },
  B3: {
    positionName: "Di Atas Garis ke-5 Bass Clef",
    detail: "Not B3 menempel tepat di atas garis ke-5 Bass Clef.",
    mnemonicTitle: "Di Atas Staff Bass",
    mnemonicSentence: "Satu langkah di bawah Middle C (C4).",
    mnemonicHighlight: "B3 = Duduk di atas garis 5 Bass",
    pianoGuide: "Tuts putih B oktaf 3 (nada tepat sebelum Middle C).",
    guitarPositions: ["Senar 2 Fret 0 (Open)", "Senar 3 Fret 4", "Senar 4 Fret 9"],
    tips: ["B3 adalah nada yang duduk di atas garis paling atas Bass Clef."],
  },
  C4: {
    positionName: "Garis Bantu ke-1 di Atas (Middle C)",
    detail: "Not C4 (Middle C) berada pada garis bantu pertama di atas paranada Bass Clef.",
    mnemonicTitle: "Middle C (Pusat Paranada)",
    mnemonicSentence: "C4 adalah titik temu antara Treble dan Bass Clef.",
    mnemonicHighlight: "C4 = 1 garis potong di atas staff bass",
    pianoGuide: "Tuts C tepat di tengah keyboard piano (Middle C / MIDI 60).",
    guitarPositions: ["Senar 2 Fret 1", "Senar 3 Fret 5", "Senar 4 Fret 10"],
    tips: [
      "Middle C digambarkan dengan 1 garis potong di atas staff pada Bass Clef, atau di bawah staff pada Treble Clef.",
    ],
  },
};

export function getNoteExplanation(
  note: StaffNote,
  clef: ClefType,
): NoteExplanation {
  const map = clef === "bass" ? BASS_POSITION_MAP : TREBLE_POSITION_MAP;
  const entry = map[note.displayName] || {
    positionName: `Not ${note.displayName} pada ${clef} clef`,
    detail: `Not ${note.displayName} memiliki frekuensi ${note.midi} MIDI.`,
    mnemonicTitle: `${clef === "treble" ? "Treble Clef" : "Bass Clef"}`,
    mnemonicSentence:
      clef === "treble"
        ? "Garis: EGBDF, Spasi: FACE"
        : "Garis: GBDFA, Spasi: ACEG",
    mnemonicHighlight: note.displayName,
    pianoGuide: `Tuts putih/hitam ${note.noteName} pada oktaf ${note.octave}.`,
    guitarPositions: [],
    tips: ["Perhatikan posisi garis atau spasi dan tanda kuncinya."],
  };

  return {
    noteDisplayName: note.displayName,
    clef,
    positionName: entry.positionName,
    positionDetail: entry.detail,
    mnemonicTitle: entry.mnemonicTitle,
    mnemonicSentence: entry.mnemonicSentence,
    mnemonicHighlight: entry.mnemonicHighlight,
    pianoGuide: entry.pianoGuide,
    guitarPositions: entry.guitarPositions,
    fixTips: entry.tips,
  };
}

