// ════════════════════════════════════════════════════════
// theory-music/core — Barrel Index
// ════════════════════════════════════════════════════════
//
// Central barrel export for ALL music primitives.
// Import from "~/theory-music/core" everywhere.
// ════════════════════════════════════════════════════════

// ── Primitives (notes, pitch classes, conversions) ─────
export {
  // Types
  type SpellMode,
  type PitchClass,
  type NoteIndex,
  type NoteNameSharp,
  type NoteNameFlat,
  type RootFilterOption,
  // Constants
  PITCH_CLASSES,
  NOTES_SHARP,
  NOTES_FLAT,
  ALL_NOTE_OPTIONS,
  ROOT_FILTER_OPTIONS,
  ROOT_SHARP_OPTIONS,
  ROOT_FLAT_OPTIONS,
  FLAT_KEYS,
  SHARP_KEYS,
  BASE_PC,
  NOTE_INDEX,
  ROOT_OCTAVES,
  // Functions
  rootToPc,
  pickName,
  transpose,
  pcToName,
  normalizeNoteName,
  parseScientificNote,
} from "./primitives";

// ── Degrees & Interval Types ───────────────────────────
export {
  // Types
  type DegreeToken,
  type SimpleScaleDegree,
  type IntervalQuality,
  type ConsonanceLevel,
  type HarmonicQuality,
  type ChordFamily,
  type CadentialStrength,
  type TriadQuality,
  type ScaleType,
  // Constants
  DEGREE_TO_SEMITONES,
  // Functions
  degreeToPitchClassOffset,
} from "./degrees";

// ── Colors ─────────────────────────────────────────────
export {
  // Types
  type ChromaticHue,
  type NoteColorClasses,
  type NoteHexColors,
  // Constants
  CHROMATIC_HUES,
  NOTE_COLOR_CLASSES,
  NOTE_DOT_COLORS,
  NOTE_HEX_COLORS,
  // Functions
  noteDotColor,
  degreeColor,
} from "./colors";

// ── Relations & Cross-References ───────────────────────
export {
  // Types
  type MusicEntityType,
  type MusicEntityRef,
  // Functions
  entityToRoute,
  chordRef,
  intervalRef,
  scaleRef,
  songRef,
  dictionaryRef,
  chordNameToId,
  chordIdToName,
} from "./relations";

// ── Cross-Reference Computation ────────────────────────
export {
  // Types
  type RelatedEntities,
  type ScaleRelatedEntities,
  // Functions
  chordToIntervalRefs,
  chordToScaleRefs,
  intervalToChordRefs,
  scaleToIntervalRefs,
  scaleToChordRefs,
  chordToDictionaryRefs,
  intervalToDictionaryRef,
  scaleToDictionaryRef,
  scaleToRelatedScaleRefs,
  computeChordRelations,
  computeScaleRelations,
} from "./cross-ref";
