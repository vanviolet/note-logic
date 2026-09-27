// ════════════════════════════════════════════════════════
// music.tsx — Re-export Shim (backwards compatibility)
// ════════════════════════════════════════════════════════
//
// All definitions have moved to ~/theory-music/core.
// This file re-exports everything so existing imports
// like `from "~/theory-music/music"` keep working.
// New code should import directly from "~/theory-music/core".
// ════════════════════════════════════════════════════════

export type { SpellMode, PitchClass } from "./core/primitives";
export type { NoteNameSharp as Note } from "./core/primitives";

export {
  PITCH_CLASSES,
  FLAT_KEYS,
  SHARP_KEYS,
  rootToPc,
  pickName,
  transpose,
  pcToName,
  ALL_NOTE_OPTIONS as NOTE_OPTIONS,
} from "./core/primitives";
export { NOTES_SHARP as NOTES } from "./core/primitives";
export { degreeColor } from "./core/colors";
