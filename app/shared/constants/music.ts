// ════════════════════════════════════════════════════════
// shared/constants/music.ts — Re-export Shim
// ════════════════════════════════════════════════════════
//
// All definitions have moved to ~/theory-music/core/primitives.
// This file re-exports for backwards compatibility.
// New code should import from "~/theory-music/core".
// ════════════════════════════════════════════════════════

export {
  ROOT_OCTAVES,
  NOTES_SHARP as NOTE_NAMES_SHARP,
  ROOT_FILTER_OPTIONS,
  ROOT_SHARP_OPTIONS,
  ROOT_FLAT_OPTIONS,
} from "~/theory-music/core";

export type { NoteNameSharp, RootFilterOption } from "~/theory-music/core";
