import type { LivePitchFrame } from "~/templates/hooks";
import type { GuitarStringTarget } from "../types";
import { NOTE_NAMES_SHARP } from "~/shared/constants/music";

export const GUITAR_STRING_TARGETS: GuitarStringTarget[] = [
  { id: "E2", note: "E", octave: 2, midi: 40 },
  { id: "A2", note: "A", octave: 2, midi: 45 },
  { id: "D3", note: "D", octave: 3, midi: 50 },
  { id: "G3", note: "G", octave: 3, midi: 55 },
  { id: "B3", note: "B", octave: 3, midi: 59 },
  { id: "E4", note: "E", octave: 4, midi: 64 },
];

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function midiToLabel(midi: number) {
  const pitchClass = ((midi % 12) + 12) % 12;
  const octave = Math.floor(midi / 12) - 1;
  return `${NOTE_NAMES_SHARP[pitchClass]}${octave}`;
}

export function closestTargetByMidi(midi: number) {
  return GUITAR_STRING_TARGETS.reduce((best, candidate) => {
    const bestDistance = Math.abs(best.midi - midi);
    const candidateDistance = Math.abs(candidate.midi - midi);
    return candidateDistance < bestDistance ? candidate : best;
  }, GUITAR_STRING_TARGETS[0]);
}

export function toFrameCentsAgainstTarget(
  frame: LivePitchFrame | null,
  target: GuitarStringTarget | null,
) {
  if (!frame || !target) return null;
  const semitoneDelta = frame.midi - target.midi + frame.cents / 100;
  return clamp(semitoneDelta * 100, -50, 50);
}

export function buildStringLabel(target: GuitarStringTarget) {
  return `${target.note}${target.octave}`;
}
