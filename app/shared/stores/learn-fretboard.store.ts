import { create } from "zustand";
import type { ChordEntry } from "~/theory-music/chord";
import type { FamilyChordEntry } from "~/theory-music/family";
import type { GeneratedInterval } from "~/theory-music/interval";
import { rootToPc } from "~/theory-music/music";
import type { LivePitchFrame } from "~/templates/hooks";
import { ROOT_OCTAVES } from "~/shared/constants/music";
import { normalizeNoteName } from "~/shared/lib/music-utils";

const STANDARD_TUNING = ["E2", "A2", "D3", "G3", "B3", "E4"];
const UKULELE_TUNING = ["G4", "C4", "E4", "A4"];
const DEFAULT_PANEL_HEIGHT = 360;

interface FretboardPanelState {
  // ── Selected item ──────────────────────────────────────────────────────────
  /** Unique key for the selected card (chord.name / interval.short / `${degree}-${chord.name}`) */
  selectedId: string | null;
  selectedType: "chord" | "interval" | "family" | null;
  selectedTitle: string;
  selectedSubtitle: string;

  // ── Fretboard highlight data ────────────────────────────────────────────────
  pitchClasses: number[];
  toneLabels: Partial<Record<number, string>>;

  // ── Audio playback data ─────────────────────────────────────────────────────
  /** For chord / family strumming */
  playableNotes: string[];
  /** For interval sequential playback */
  intervalNotes: { rootNote: string; targetNote: string } | null;
  /** Gap between root and target note when playing an interval */
  noteGapMs: number;

  // ── Fretboard interaction ───────────────────────────────────────────────────
  tuning: string[];
  activeNote: { stringIndex: number; fret: number } | null;
  livePitch: LivePitchFrame | null;

  // ── Piano interaction ────────────────────────────────────────────────────────
  activePianoNote: { midi: number } | null;

  // ── Ukulele interaction ─────────────────────────────────────────────────────
  ukuleleTuning: string[];
  activeUkuleleNote: { stringIndex: number; fret: number } | null;

  // ── Panel UI ────────────────────────────────────────────────────────────────
  panelHeight: number;
  isPanelOpen: boolean;
  /** Which instrument view is active in the panel */
  instrument: "guitar" | "piano" | "ukulele";

  // ── Actions ─────────────────────────────────────────────────────────────────
  selectChord: (chord: ChordEntry) => void;
  selectFamily: (entry: FamilyChordEntry) => void;
  selectInterval: (interval: GeneratedInterval) => void;
  selectScale: (scale: {
    id: string;
    root: string;
    notes: string[];
    label: string;
  }) => void;
  setTuning: (tuning: string[]) => void;
  setActiveNote: (note: { stringIndex: number; fret: number } | null) => void;
  setActivePianoNote: (note: { midi: number } | null) => void;
  setUkuleleTuning: (tuning: string[]) => void;
  setActiveUkuleleNote: (
    note: { stringIndex: number; fret: number } | null,
  ) => void;
  setLivePitch: (frame: LivePitchFrame | null) => void;
  setNoteGapMs: (ms: number) => void;
  setInstrument: (instrument: "guitar" | "piano" | "ukulele") => void;
  setPanelHeight: (height: number) => void;
  openPanel: () => void;
  closePanel: () => void;
  togglePanel: () => void;
}

/**
 * Zustand store for the shared fretboard bottom panel in learn modules.
 *
 * Calling `selectChord`, `selectFamily`, or `selectInterval` computes all
 * fretboard highlight data inline and stores it alongside panel state, so the
 * panel component reads a flat list of primitives rather than raw domain objects.
 *
 * Usage:
 *   const selectChord = useLearnFretboardStore(s => s.selectChord);
 *   // In a chord card's onClick:
 *   selectChord(chord);
 */
export const useLearnFretboardStore = create<FretboardPanelState>((set) => ({
  selectedId: null,
  selectedType: null,
  selectedTitle: "",
  selectedSubtitle: "",
  pitchClasses: [],
  toneLabels: {},
  playableNotes: [],
  intervalNotes: null,
  noteGapMs: 440,
  tuning: STANDARD_TUNING,
  activeNote: null,
  activePianoNote: null,
  ukuleleTuning: UKULELE_TUNING,
  activeUkuleleNote: null,
  livePitch: null,
  panelHeight: DEFAULT_PANEL_HEIGHT,
  isPanelOpen: false,
  instrument: "guitar",

  selectChord: (chord) => {
    const toneLabels: Partial<Record<number, string>> = {};
    chord.composed.forEach((tone) => {
      toneLabels[tone.intervalClass] = `${tone.note} (${
        tone.degree === "1" ? "Root/1" : tone.degree
      })`;
    });

    const baseOctave = ROOT_OCTAVES[chord.root] ?? 3;
    const playableNotes = chord.composed
      .slice(0, 6)
      .map(
        (tone, index) =>
          `${normalizeNoteName(tone.note)}${baseOctave + Math.floor(index / 2)}`,
      );

    set({
      selectedId: chord.name,
      selectedType: "chord",
      selectedTitle: chord.name,
      selectedSubtitle: `${chord.quality} · ${chord.family}`,
      pitchClasses: chord.pitchClasses,
      toneLabels,
      playableNotes,
      intervalNotes: null,
      activeNote: null,
      isPanelOpen: true,
    });
  },

  selectFamily: (entry) => {
    const rootTone = entry.chord.composed.find((tone) => tone.degree === "1");
    const rootName = rootTone?.note ?? entry.chord.composed[0]?.note ?? "C";
    const rootPc = rootToPc(rootName);

    const pitchClasses = entry.chord.semitonePattern.map(
      (semi) => (rootPc + semi) % 12,
    );

    const toneLabels: Partial<Record<number, string>> = {};
    entry.chord.composed.forEach((tone) => {
      const absolutePc = (rootPc + tone.semitonesFromRoot) % 12;
      toneLabels[absolutePc] = `${tone.note} (${tone.degree})`;
    });

    const baseOctave = ROOT_OCTAVES[rootName] ?? 3;
    const playableNotes = entry.chord.composed
      .slice(0, 6)
      .map(
        (tone, index) =>
          `${normalizeNoteName(tone.note)}${baseOctave + Math.floor(index / 2)}`,
      );

    set({
      selectedId: `${entry.degree}-${entry.chord.name}`,
      selectedType: "family",
      selectedTitle: `${entry.degree} · ${entry.chord.name}`,
      selectedSubtitle: `${entry.family} · ${entry.role}`,
      pitchClasses,
      toneLabels,
      playableNotes,
      intervalNotes: null,
      activeNote: null,
      isPanelOpen: true,
    });
  },

  selectInterval: (interval) => {
    const rootPitchClass = rootToPc(interval.root);
    const targetPitchClass = interval.pitchClass;
    const pitchClasses = Array.from(
      new Set([rootPitchClass, targetPitchClass]),
    );

    const toneLabels: Partial<Record<number, string>> = {
      [rootPitchClass]: `Root (${interval.root})`,
      [targetPitchClass]: `${interval.short} (${interval.note})`,
    };

    const baseOctave = ROOT_OCTAVES[interval.root] ?? 3;
    const targetOctave = baseOctave + (interval.semitone >= 12 ? 1 : 0);
    const intervalNotes = {
      rootNote: `${normalizeNoteName(interval.root)}${baseOctave}`,
      targetNote: `${normalizeNoteName(interval.note)}${targetOctave}`,
    };

    set({
      selectedId: interval.short,
      selectedType: "interval",
      selectedTitle: interval.name,
      selectedSubtitle: `${interval.short} · ${interval.root} → ${interval.note}`,
      pitchClasses,
      toneLabels,
      playableNotes: [],
      intervalNotes,
      activeNote: null,
      isPanelOpen: true,
    });
  },

  selectScale: (scale) => {
    const pitchClasses = scale.notes.map((n) => rootToPc(n));
    const toneLabels: Partial<Record<number, string>> = {};
    scale.notes.forEach((note) => {
      toneLabels[rootToPc(note)] = note;
    });

    const baseOctave = ROOT_OCTAVES[scale.root] ?? 3;
    const playableNotes = scale.notes.map(
      (note, i) =>
        `${normalizeNoteName(note)}${baseOctave + Math.floor(i / 7)}`,
    );

    set({
      selectedId: scale.id,
      selectedType: "chord",
      selectedTitle: scale.label,
      selectedSubtitle: `Root: ${scale.root} · ${scale.notes.join(" ")}`,
      pitchClasses,
      toneLabels,
      playableNotes,
      intervalNotes: null,
      activeNote: null,
      isPanelOpen: true,
    });
  },

  setTuning: (tuning) => set({ tuning }),
  setActiveNote: (activeNote) => set({ activeNote }),
  setActivePianoNote: (activePianoNote) => set({ activePianoNote }),
  setUkuleleTuning: (ukuleleTuning) => set({ ukuleleTuning }),
  setActiveUkuleleNote: (activeUkuleleNote) => set({ activeUkuleleNote }),
  setLivePitch: (livePitch) => set({ livePitch }),
  setNoteGapMs: (noteGapMs) => set({ noteGapMs }),
  setInstrument: (instrument) => set({ instrument }),
  setPanelHeight: (panelHeight) => set({ panelHeight }),
  openPanel: () => set({ isPanelOpen: true }),
  closePanel: () => set({ isPanelOpen: false }),
  togglePanel: () => set((s) => ({ isPanelOpen: !s.isPanelOpen })),
}));
