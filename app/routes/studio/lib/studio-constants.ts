import {
  NOTE_COLOR_CLASSES,
  NOTE_DOT_COLORS,
  noteDotColor,
} from "~/theory-music/core";
import { toPitchClass } from "./studio-utils";
import type { StudioNote } from "../types";

/**
 * Chromatic dot colors — now sourced from core.
 * Kept as alias for backward compatibility.
 */
export const NOTE_DOT_COLOR_CLASS = NOTE_DOT_COLORS;

/** Convenience: resolve a note to its sidebar dot class. */
export function noteDotColorClass(note: StudioNote | null | undefined) {
  if (!note) return "bg-muted-foreground/40";
  const pc = ((toPitchClass(note) % 12) + 12) % 12;
  return noteDotColor(pc);
}

/** Convenience: resolve a pitch class (0-11) to its sidebar dot class. */
export function pitchClassDotColor(pitchClass: number | null | undefined) {
  return noteDotColor(pitchClass);
}

/**
 * Build all column keys for a given grid size.
 * Used to initialise collapsed-columns state so columns start closed by default.
 */
export function buildAllColumnKeys(
  measureCount: number,
  beatsPerMeasure: number,
) {
  const keys: string[] = [];
  for (let measure = 0; measure < measureCount; measure += 1) {
    for (let beat = 0; beat < beatsPerMeasure; beat += 1) {
      keys.push(`col:${measure}:${beat}`);
    }
  }
  return keys;
}

/** Re-export the color map from core so all studio code imports from one place. */
export { NOTE_COLOR_CLASSES };
