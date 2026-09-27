// ════════════════════════════════════════════════════════
// Music Dictionary – Shared Types
// ════════════════════════════════════════════════════════

/**
 * Top-level category that groups entries in the UI and IndexedDB indices.
 */
export type DictionaryCategory =
  | "notation"
  | "rhythm"
  | "pitch"
  | "interval"
  | "scale"
  | "chord"
  | "harmony"
  | "form"
  | "analysis"
  | "audio"
  | "dynamics"
  | "articulation"
  | "ornament"
  | "technique"
  | "effect";

/**
 * Fine-grained sub-category for faceted filtering inside each category.
 * Add new values as needed — the list is intentionally open.
 */
export type DictionarySubCategory =
  // notation
  | "note-values"
  | "rests"
  | "accidentals"
  | "clefs"
  | "barlines"
  | "time-signatures"
  | "key-signatures"
  | "repeat-marks"
  | "tuplets"
  | "ties-slurs"
  | "dots"
  | "expression-marks"
  | "staff"
  // rhythm
  | "tempo"
  | "meter"
  | "subdivision"
  | "syncopation"
  | "groove"
  | "rhythm-general"
  | "feel"
  // pitch
  | "pitch-general"
  | "frequency"
  | "octave"
  | "pitch-class"
  | "register"
  | "transposition"
  // interval
  | "interval-general"
  | "interval-quality"
  | "interval-type"
  // scale
  | "scale-general"
  | "modes"
  | "scale-formula"
  | "pentatonic"
  | "exotic-scale"
  // chord
  | "chord-general"
  | "chord-quality"
  | "chord-extension"
  | "voicing"
  | "inversion"
  | "power-chord"
  // harmony
  | "functional-harmony"
  | "cadence"
  | "modulation"
  | "consonance-dissonance"
  | "chromatic-harmony"
  | "progression"
  | "reharmonization"
  // dynamics
  | "dynamic-mark"
  | "hairpin"
  | "expression"
  // articulation
  | "staccato-legato"
  | "accent-tenuto"
  | "mute-damp"
  | "bend-slide"
  | "harmonic-technique"
  | "bowing"
  // ornament
  | "trill-mordent"
  | "turn"
  | "grace-note"
  | "tremolo"
  | "fermata"
  | "octave-shift"
  // technique (guitar-specific etc.)
  | "picking"
  | "strumming"
  | "tapping"
  | "slide"
  | "vibrato"
  | "wah"
  | "fingerstyle"
  | "string-bending"
  // effect (production / audio)
  | "reverb-delay"
  | "distortion"
  | "eq-filter"
  | "modulation-effect"
  | "compression"
  | "amp-simulation"
  // form (musical structure)
  | "song-form"
  | "section"
  | "phrase"
  // analysis
  | "set-theory"
  | "roman-numeral"
  | "counterpoint"
  | "form"
  | "cadence"
  | "texture"
  // audio / acoustics
  | "timbre"
  | "harmonic-overtone"
  | "tuning-system"
  | "digital-audio"
  | "psychoacoustics";

/**
 * Which instrument family the entry is most relevant to.
 * `"general"` means universally applicable.
 */
export type InstrumentContext =
  | "general"
  | "guitar"
  | "bass"
  | "piano"
  | "strings"
  | "brass"
  | "woodwind"
  | "percussion"
  | "voice";

/**
 * Reference to a SMuFL / Bravura glyph for visual display.
 */
export interface BravuraSymbolRef {
  /** Unicode code-point, e.g. 0xe4a2 for staccato */
  codePoint: number;
  /** Human-readable label for accessibility */
  label: string;
}

/**
 * Guitar-specific practical knowledge block.
 */
export interface GuitarTechniqueInfo {
  /** Brief how-to description */
  howTo: string;
  /** Which hand (left / right / both) */
  hand: "left" | "right" | "both";
  /** Difficulty tier for learners */
  difficulty: "beginner" | "intermediate" | "advanced";
  /** Common fret/string context, if any */
  fretContext?: string;
  /** Tips / common mistakes */
  tips?: string[];
}

/**
 * AlphaTex token info for entries that correspond to studio effects/marks.
 */
export interface AlphaTexRef {
  /** The raw AlphaTex token string, e.g. "pm", "h", "tr" */
  token: string;
  /** Whether this is a beat-level or note-level effect */
  level: "beat" | "note";
}

/**
 * A single dictionary entry — the core data shape persisted in IndexedDB.
 *
 * Design goals:
 * - Flat & JSON-serialisable (no class instances, no functions)
 * - Enough metadata for rich search, filter, and pagination
 * - Optional deep-dive fields for instrument-specific knowledge
 */
export interface DictionaryEntry {
  /** Stable, URL-friendly slug. Also the IndexedDB primary key. */
  id: string;

  /** Canonical English term */
  term: string;

  /** Bahasa Indonesia translation (if applicable) */
  termId?: string;

  /** Alternative names / abbreviations */
  aliases?: string[];

  /** Primary grouping */
  category: DictionaryCategory;

  /** Fine-grained grouping */
  subCategory: DictionarySubCategory;

  /** Instrument relevance */
  instrumentContext: InstrumentContext;

  /** One-liner used in cards / tooltips */
  shortDefinition: string;

  /** Longer explanation (supports markdown) */
  detailedDefinition: string;

  /** Concrete examples */
  examples?: string[];

  /** IDs of related entries */
  relatedTerms?: string[];

  /** Bravura / SMuFL symbol, if any */
  bravuraSymbol?: BravuraSymbolRef;

  /** Unicode text symbol fallback (for non-Bravura contexts) */
  unicodeSymbol?: string;

  /** AlphaTex mapping (for studio integration) */
  alphaTexRef?: AlphaTexRef;

  /** Guitar how-to block */
  guitarTechnique?: GuitarTechniqueInfo;

  /**
   * Free-form tags for full-text/tag-based search.
   * e.g. ["palm mute", "PM", "right hand", "metal"]
   */
  tags?: string[];

  /**
   * Sort weight inside its sub-category (lower = first).
   * Defaults to 0 when omitted.
   */
  sortOrder?: number;
}

// ════════════════════════════════════════════════════════
// IndexedDB Schema Constants
// ════════════════════════════════════════════════════════

export const DICTIONARY_DB_NAME = "MusicDictionaryDB";
export const DICTIONARY_DB_VERSION = 1;
export const DICTIONARY_STORE_NAME = "entries";

/**
 * Index definitions for the object-store.
 * Key = index name, Value = keyPath (supports compound via array).
 */
export const DICTIONARY_INDEXES = {
  byCategory: "category",
  bySubCategory: "subCategory",
  byCategoryAndSub: ["category", "subCategory"],
  byInstrument: "instrumentContext",
  byTerm: "term",
} as const;
