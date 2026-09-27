// ════════════════════════════════════════════════════════
// Fingering Routine – Exercise Data
// ════════════════════════════════════════════════════════
//
// Contains all predefined exercises for guitar and piano.
// Each exercise is a sequence of notes with finger assignments.

import type { Exercise, ExerciseNote } from "../types";
import { NOTE_INDEX } from "~/theory-music/core";

// ── Helpers ────────────────────────────────────────────

function noteToMidi(note: string, octave: number): number {
  const pc = NOTE_INDEX[note] ?? 0;
  return (octave + 1) * 12 + pc;
}

function n(
  note: string,
  octave: number,
  finger: number,
  duration = 1,
  extra?: { stringIndex?: number; fret?: number },
): ExerciseNote {
  return {
    note: `${note}${octave}`,
    midi: noteToMidi(note, octave),
    pitchClass: NOTE_INDEX[note] ?? 0,
    finger,
    duration,
    ...extra,
  };
}

// ── Guitar Exercises ───────────────────────────────────

export const GUITAR_EXERCISES: Exercise[] = [
  // ── Warm-up: Chromatic ────────────────────────────
  {
    id: "g-warmup-chromatic",
    name: "Chromatic Warm-Up",
    description:
      "Latihan pemanasan kromatik di 4 fret pertama. Satu jari per fret.",
    instrument: "guitar",
    category: "warm-up",
    difficulty: 1,
    key: "E",
    defaultBpm: 80,
    timeSignature: "4/4",
    tips: "Gunakan 1 jari per fret: telunjuk (1), tengah (2), manis (3), kelingking (4). Jaga jari dekat fretboard.",
    notes: [
      // String 6 (low E)
      n("E", 2, 0, 1, { stringIndex: 0, fret: 0 }),
      n("F", 2, 1, 1, { stringIndex: 0, fret: 1 }),
      n("F#", 2, 2, 1, { stringIndex: 0, fret: 2 }),
      n("G", 2, 3, 1, { stringIndex: 0, fret: 3 }),
      // String 5 (A)
      n("A", 2, 0, 1, { stringIndex: 1, fret: 0 }),
      n("A#", 2, 1, 1, { stringIndex: 1, fret: 1 }),
      n("B", 2, 2, 1, { stringIndex: 1, fret: 2 }),
      n("C", 3, 3, 1, { stringIndex: 1, fret: 3 }),
      // String 4 (D)
      n("D", 3, 0, 1, { stringIndex: 2, fret: 0 }),
      n("D#", 3, 1, 1, { stringIndex: 2, fret: 1 }),
      n("E", 3, 2, 1, { stringIndex: 2, fret: 2 }),
      n("F", 3, 3, 1, { stringIndex: 2, fret: 3 }),
      // String 3 (G)
      n("G", 3, 0, 1, { stringIndex: 3, fret: 0 }),
      n("G#", 3, 1, 1, { stringIndex: 3, fret: 1 }),
      n("A", 3, 2, 1, { stringIndex: 3, fret: 2 }),
      n("A#", 3, 3, 1, { stringIndex: 3, fret: 3 }),
    ],
  },

  // ── Scale: C Major ────────────────────────────────
  {
    id: "g-scale-c-major",
    name: "C Major Scale (Open)",
    description: "Tangga nada C mayor posisi terbuka. Dasar untuk semua scale.",
    instrument: "guitar",
    category: "scale",
    difficulty: 1,
    key: "C",
    defaultBpm: 70,
    timeSignature: "4/4",
    tips: "Perhatikan jari mana yang menekan tiap fret. Usahakan peralihan lancar.",
    notes: [
      n("C", 3, 3, 1, { stringIndex: 1, fret: 3 }),
      n("D", 3, 0, 1, { stringIndex: 2, fret: 0 }),
      n("E", 3, 2, 1, { stringIndex: 2, fret: 2 }),
      n("F", 3, 3, 1, { stringIndex: 2, fret: 3 }),
      n("G", 3, 0, 1, { stringIndex: 3, fret: 0 }),
      n("A", 3, 2, 1, { stringIndex: 3, fret: 2 }),
      n("B", 3, 0, 1, { stringIndex: 4, fret: 0 }),
      n("C", 4, 1, 1, { stringIndex: 4, fret: 1 }),
    ],
  },

  // ── Scale: Am Pentatonic ──────────────────────────
  {
    id: "g-scale-am-penta",
    name: "Am Pentatonic (Pos. 1)",
    description: "Pentatonik minor paling populer. Wajib untuk blues & rock.",
    instrument: "guitar",
    category: "scale",
    difficulty: 1,
    key: "Am",
    defaultBpm: 80,
    timeSignature: "4/4",
    tips: "Posisi box 1: jari 1 di fret 5, jari 3 di fret 7, jari 4 di fret 8.",
    notes: [
      n("A", 2, 1, 1, { stringIndex: 0, fret: 5 }),
      n("C", 3, 4, 1, { stringIndex: 0, fret: 8 }),
      n("D", 3, 1, 1, { stringIndex: 1, fret: 5 }),
      n("E", 3, 3, 1, { stringIndex: 1, fret: 7 }),
      n("A", 3, 1, 1, { stringIndex: 2, fret: 7 }),
      n("C", 4, 1, 1, { stringIndex: 3, fret: 5 }),
      n("D", 4, 3, 1, { stringIndex: 3, fret: 7 }),
      n("E", 4, 1, 1, { stringIndex: 4, fret: 5 }),
      n("G", 4, 4, 1, { stringIndex: 4, fret: 8 }),
      n("A", 4, 1, 1, { stringIndex: 5, fret: 5 }),
    ],
  },

  // ── Arpeggio: Em ──────────────────────────────────
  {
    id: "g-arpeggio-em",
    name: "Em Arpeggio",
    description:
      "Arpeggio Em melintasi senar. Latihan koordinasi tangan kiri-kanan.",
    instrument: "guitar",
    category: "arpeggio",
    difficulty: 2,
    key: "Em",
    defaultBpm: 70,
    timeSignature: "4/4",
    notes: [
      n("E", 2, 0, 1, { stringIndex: 0, fret: 0 }),
      n("B", 2, 2, 1, { stringIndex: 1, fret: 2 }),
      n("E", 3, 2, 1, { stringIndex: 2, fret: 2 }),
      n("G", 3, 0, 1, { stringIndex: 3, fret: 0 }),
      n("B", 3, 0, 1, { stringIndex: 4, fret: 0 }),
      n("E", 4, 0, 1, { stringIndex: 5, fret: 0 }),
      n("B", 3, 0, 1, { stringIndex: 4, fret: 0 }),
      n("G", 3, 0, 1, { stringIndex: 3, fret: 0 }),
    ],
  },

  // ── Finger Independence ───────────────────────────
  {
    id: "g-independence-1324",
    name: "1-3-2-4 Pattern",
    description:
      "Pola jari 1-3-2-4 untuk melatih independensi jari manis & kelingking.",
    instrument: "guitar",
    category: "finger-independence",
    difficulty: 2,
    key: "E",
    defaultBpm: 60,
    timeSignature: "4/4",
    tips: "Mulai pelan. Pastikan tiap not jelas tanpa buzz. Tingkatkan kecepatan bertahap.",
    notes: [
      // String 6
      n("F", 2, 1, 1, { stringIndex: 0, fret: 1 }),
      n("G", 2, 3, 1, { stringIndex: 0, fret: 3 }),
      n("F#", 2, 2, 1, { stringIndex: 0, fret: 2 }),
      n("G#", 2, 4, 1, { stringIndex: 0, fret: 4 }),
      // String 5
      n("A#", 2, 1, 1, { stringIndex: 1, fret: 1 }),
      n("C", 3, 3, 1, { stringIndex: 1, fret: 3 }),
      n("B", 2, 2, 1, { stringIndex: 1, fret: 2 }),
      n("C#", 3, 4, 1, { stringIndex: 1, fret: 4 }),
      // String 4
      n("D#", 3, 1, 1, { stringIndex: 2, fret: 1 }),
      n("F", 3, 3, 1, { stringIndex: 2, fret: 3 }),
      n("E", 3, 2, 1, { stringIndex: 2, fret: 2 }),
      n("F#", 3, 4, 1, { stringIndex: 2, fret: 4 }),
    ],
  },

  // ── Chord Transition ──────────────────────────────
  {
    id: "g-transition-g-c-d",
    name: "G → C → D Transition",
    description:
      "Latihan perpindahan chord dasar. Strum chord lalu pindah posisi.",
    instrument: "guitar",
    category: "chord-transition",
    difficulty: 1,
    key: "G",
    defaultBpm: 60,
    timeSignature: "4/4",
    tips: "Fokus pada kecepatan perpindahan. Chord harus langsung bersih saat dipetik.",
    notes: [
      // G chord strum (notes from low to high)
      n("G", 2, 2, 2, { stringIndex: 0, fret: 3 }),
      n("B", 2, 1, 2, { stringIndex: 1, fret: 2 }),
      n("D", 3, 0, 2, { stringIndex: 2, fret: 0 }),
      n("G", 3, 0, 2, { stringIndex: 3, fret: 0 }),
      // C chord strum
      n("C", 3, 3, 2, { stringIndex: 1, fret: 3 }),
      n("E", 3, 2, 2, { stringIndex: 2, fret: 2 }),
      n("G", 3, 0, 2, { stringIndex: 3, fret: 0 }),
      n("C", 4, 1, 2, { stringIndex: 4, fret: 1 }),
      // D chord strum
      n("D", 3, 0, 2, { stringIndex: 2, fret: 0 }),
      n("A", 3, 2, 2, { stringIndex: 3, fret: 2 }),
      n("D", 4, 3, 2, { stringIndex: 4, fret: 3 }),
      n("F#", 4, 2, 2, { stringIndex: 5, fret: 2 }),
    ],
  },
];

// ── Piano Exercises ────────────────────────────────────

export const PIANO_EXERCISES: Exercise[] = [
  // ── Warm-up: 5-finger ─────────────────────────────
  {
    id: "p-warmup-5finger",
    name: "5-Finger Warm-Up (C)",
    description:
      "Latihan dasar 5 jari di posisi C. Setiap jari menekan 1 tuts.",
    instrument: "piano",
    category: "warm-up",
    difficulty: 1,
    key: "C",
    defaultBpm: 80,
    timeSignature: "4/4",
    tips: "Posisikan jari melengkung di atas tuts. Jangan tegang. Jaga pergelangan tangan rileks.",
    notes: [
      n("C", 4, 1, 1),
      n("D", 4, 2, 1),
      n("E", 4, 3, 1),
      n("F", 4, 4, 1),
      n("G", 4, 5, 1),
      n("F", 4, 4, 1),
      n("E", 4, 3, 1),
      n("D", 4, 2, 1),
    ],
  },

  // ── Scale: C Major ────────────────────────────────
  {
    id: "p-scale-c-major",
    name: "C Major Scale (1 Oktaf)",
    description:
      "Tangga nada C mayor satu oktaf. Perhatikan crossing thumb (1-2-3-1-2-3-4-5).",
    instrument: "piano",
    category: "scale",
    difficulty: 1,
    key: "C",
    defaultBpm: 70,
    timeSignature: "4/4",
    tips: "Jempol (1) crossing di bawah setelah jari 3 menekan E. Ini teknik kunci untuk semua scale.",
    notes: [
      n("C", 4, 1, 1),
      n("D", 4, 2, 1),
      n("E", 4, 3, 1),
      n("F", 4, 1, 1), // thumb crosses under
      n("G", 4, 2, 1),
      n("A", 4, 3, 1),
      n("B", 4, 4, 1),
      n("C", 5, 5, 1),
    ],
  },

  // ── Scale: G Major ────────────────────────────────
  {
    id: "p-scale-g-major",
    name: "G Major Scale (1 Oktaf)",
    description:
      "Tangga nada G mayor. Ada satu sharp (F#). Latih crossing yang sama.",
    instrument: "piano",
    category: "scale",
    difficulty: 2,
    key: "G",
    defaultBpm: 70,
    timeSignature: "4/4",
    notes: [
      n("G", 4, 1, 1),
      n("A", 4, 2, 1),
      n("B", 4, 3, 1),
      n("C", 5, 1, 1),
      n("D", 5, 2, 1),
      n("E", 5, 3, 1),
      n("F#", 5, 4, 1),
      n("G", 5, 5, 1),
    ],
  },

  // ── Arpeggio: C Major ─────────────────────────────
  {
    id: "p-arpeggio-c-major",
    name: "C Major Arpeggio",
    description:
      "Arpeggio C-E-G-C naik satu oktaf lalu turun. Latihan dasar arpeggio piano.",
    instrument: "piano",
    category: "arpeggio",
    difficulty: 2,
    key: "C",
    defaultBpm: 60,
    timeSignature: "3/4",
    tips: "Thumb crossing sebelum C5. Pastikan setiap not rata volume-nya.",
    notes: [
      n("C", 4, 1, 1),
      n("E", 4, 2, 1),
      n("G", 4, 3, 1),
      n("C", 5, 5, 1),
      n("G", 4, 3, 1),
      n("E", 4, 2, 1),
    ],
  },

  // ── Finger Independence: 3-4-5 ────────────────────
  {
    id: "p-independence-345",
    name: "Jari 3-4-5 Independence",
    description:
      "Latihan khusus jari tengah, manis, dan kelingking yang paling lemah.",
    instrument: "piano",
    category: "finger-independence",
    difficulty: 2,
    key: "C",
    defaultBpm: 60,
    timeSignature: "4/4",
    tips: "Jaga jari 1 dan 2 tetap di atas tuts meskipun tidak menekan. Fokus pada kekuatan jari 4 & 5.",
    notes: [
      n("E", 4, 3, 1),
      n("F", 4, 4, 1),
      n("G", 4, 5, 1),
      n("F", 4, 4, 1),
      n("E", 4, 3, 1),
      n("G", 4, 5, 1),
      n("F", 4, 4, 1),
      n("E", 4, 3, 1),
    ],
  },

  // ── Chord Transition ──────────────────────────────
  {
    id: "p-transition-c-f-g",
    name: "C → F → G Block Chords",
    description:
      "Latihan transisi chord blok I-IV-V. Dasar harmoni untuk semua genre.",
    instrument: "piano",
    category: "chord-transition",
    difficulty: 1,
    key: "C",
    defaultBpm: 50,
    timeSignature: "4/4",
    tips: "Tekan semua not bersamaan. Lepas bersih sebelum pindah ke chord berikut.",
    notes: [
      // C chord
      n("C", 4, 1, 2),
      n("E", 4, 3, 2),
      n("G", 4, 5, 2),
      // Rest/transition beat
      n("C", 4, 1, 1),
      // F chord
      n("F", 4, 1, 2),
      n("A", 4, 3, 2),
      n("C", 5, 5, 2),
      // Rest/transition beat
      n("F", 4, 1, 1),
      // G chord
      n("G", 4, 1, 2),
      n("B", 4, 3, 2),
      n("D", 5, 5, 2),
      // Rest
      n("G", 4, 1, 1),
    ],
  },

  // ── Hanon #1 ──────────────────────────────────────
  {
    id: "p-hanon-1",
    name: "Hanon #1",
    description:
      "Latihan Hanon klasik nomor 1. Pola naik jari 1-2-3-4-5 dengan variasi.",
    instrument: "piano",
    category: "finger-independence",
    difficulty: 3,
    key: "C",
    defaultBpm: 60,
    timeSignature: "4/4",
    tips: "Mulai pelan, tingkatkan bertahap. Semua not harus volume sama (even). Metronome wajib.",
    notes: [
      n("C", 4, 1, 1),
      n("E", 4, 3, 1),
      n("F", 4, 4, 1),
      n("G", 4, 5, 1),
      n("A", 4, 1, 1),
      n("G", 4, 5, 1),
      n("F", 4, 4, 1),
      n("E", 4, 3, 1),
      n("D", 4, 2, 1),
      n("F", 4, 4, 1),
      n("G", 4, 5, 1),
      n("A", 4, 1, 1),
      n("B", 4, 2, 1),
      n("A", 4, 1, 1),
      n("G", 4, 5, 1),
      n("F", 4, 4, 1),
    ],
  },
];

// ── Combined ───────────────────────────────────────────

export const ALL_EXERCISES: Exercise[] = [
  ...GUITAR_EXERCISES,
  ...PIANO_EXERCISES,
];

export function getExercisesForInstrument(
  instrument: "guitar" | "piano",
): Exercise[] {
  return ALL_EXERCISES.filter((e) => e.instrument === instrument);
}
