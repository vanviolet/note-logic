// ════════════════════════════════════════════════════════
// Core Music – Cross-Reference Computation
// ════════════════════════════════════════════════════════
//
// Derives computed relationships between entities at runtime:
//
//   chord → intervals it contains
//   chord → scales that list it in commonChords
//   interval → chords that use this interval
//   scale → chords listed in its commonChords
//   scale → intervals in its pattern
//
// All relations use MusicEntityRef from relations.ts.
// These are pure functions that compute lazily; no mutation
// of original entity data.
// ════════════════════════════════════════════════════════

import { DEGREE_TO_SEMITONES, type DegreeToken } from "./degrees";
import type { MusicEntityRef } from "./relations";
import { chordRef, dictionaryRef, intervalRef, scaleRef } from "./relations";

// ── Degree → Interval short name mapping ───────────────

/**
 * Maps a degree token (e.g. "1", "♭3", "#5") to its interval
 * short name (e.g. "P1", "m3", "TT").
 */
const SEMITONE_TO_SHORT: Record<number, string> = {
  0: "P1",
  1: "m2",
  2: "M2",
  3: "m3",
  4: "M3",
  5: "P4",
  6: "TT",
  7: "P5",
  8: "m6",
  9: "M6",
  10: "m7",
  11: "M7",
  12: "P8",
};

const INTERVAL_NAMES: Record<string, string> = {
  P1: "Unison",
  m2: "Minor 2nd",
  M2: "Major 2nd",
  m3: "Minor 3rd",
  M3: "Major 3rd",
  P4: "Perfect 4th",
  TT: "Tritone",
  P5: "Perfect 5th",
  m6: "Minor 6th",
  M6: "Major 6th",
  m7: "Minor 7th",
  M7: "Major 7th",
  P8: "Octave",
};

// ── Chord → Interval refs ──────────────────────────────

/**
 * Given a chord's formula (degree tokens), return the intervals
 * that compose this chord as MusicEntityRef[].
 *
 * Example: ["1", "♭3", "5", "♭7"] → refs for P1, m3, P5, m7
 */
export function chordToIntervalRefs(formula: DegreeToken[]): MusicEntityRef[] {
  const refs: MusicEntityRef[] = [];
  const seen = new Set<string>();

  for (const deg of formula) {
    const semi = DEGREE_TO_SEMITONES[deg];
    if (semi === undefined) continue;

    const normalizedSemi = semi % 12;
    const short = SEMITONE_TO_SHORT[normalizedSemi];
    if (!short || seen.has(short)) continue;

    seen.add(short);
    refs.push(
      intervalRef(short, `${short} – ${INTERVAL_NAMES[short] ?? short}`),
    );
  }

  return refs;
}

// ── Chord → Scale refs ─────────────────────────────────

/**
 * Given a chord symbol suffix (like "m7", "maj7", "dim"),
 * finds scales whose `commonChords` field includes that suffix.
 *
 * @param scalesData - pass the MASTER_SCALES record from scales.tsx
 * @param chordSymbol - the chord type suffix to search for
 */
export function chordToScaleRefs(
  scalesData: Record<string, { name: string; commonChords: string[] }>,
  chordSymbol: string,
): MusicEntityRef[] {
  const refs: MusicEntityRef[] = [];
  const norm = chordSymbol.toLowerCase();

  for (const [key, spec] of Object.entries(scalesData)) {
    const hasChord = spec.commonChords.some((c) => c.toLowerCase() === norm);
    if (hasChord) {
      refs.push(scaleRef(key, spec.name));
    }
  }

  return refs;
}

// ── Interval → Chord refs ──────────────────────────────

/**
 * Given an interval semitone value, find which chord formulas
 * include a degree that maps to this semitone.
 *
 * Returns chord refs (by symbol, not transposed per root).
 *
 * @param chordSpecs - array of { symbol, formula } from chord master data
 * @param semitone - the interval semitone (0-12)
 * @param limit - max results (default 12)
 */
export function intervalToChordRefs(
  chordSpecs: { symbol: string; formula: DegreeToken[] }[],
  semitone: number,
  limit = 12,
): MusicEntityRef[] {
  const refs: MusicEntityRef[] = [];
  const normalizedSemi = semitone % 12;

  for (const spec of chordSpecs) {
    if (refs.length >= limit) break;

    const hasInterval = spec.formula.some((deg) => {
      const s = DEGREE_TO_SEMITONES[deg];
      return s !== undefined && s % 12 === normalizedSemi;
    });

    if (hasInterval) {
      refs.push(chordRef(spec.symbol));
    }
  }

  return refs;
}

// ── Scale → Interval refs ──────────────────────────────

/**
 * Given a scale's interval pattern (semitone offsets from root),
 * return the intervals in that scale as MusicEntityRef[].
 *
 * @param ints - array of semitone offsets, e.g. [0, 2, 4, 5, 7, 9, 11]
 */
export function scaleToIntervalRefs(ints: number[]): MusicEntityRef[] {
  return ints
    .map((semi) => {
      const normalizedSemi = semi % 12;
      const short = SEMITONE_TO_SHORT[normalizedSemi];
      if (!short) return null;
      return intervalRef(short, `${short} – ${INTERVAL_NAMES[short] ?? short}`);
    })
    .filter((ref): ref is MusicEntityRef => ref !== null);
}

// ── Scale → Chord refs ─────────────────────────────────

/**
 * Given a scale's commonChords field (chord type suffixes),
 * return them as chord refs.
 */
export function scaleToChordRefs(commonChords: string[]): MusicEntityRef[] {
  return commonChords.map((symbol) => chordRef(symbol));
}

// ── Generic related entities helper ────────────────────

export interface RelatedEntities {
  intervals: MusicEntityRef[];
  scales: MusicEntityRef[];
  chords: MusicEntityRef[];
  glossary: MusicEntityRef[];
}

// ── Chord → Dictionary refs ────────────────────────────

/**
 * Maps chord quality keywords to relevant dictionary term IDs.
 * Used to auto-link dictionary/nolopedia from chord detail.
 */
const CHORD_QUALITY_GLOSSARY: Record<string, string[]> = {
  // base terms for all chords
  _always: ["chord"],
  // quality-based
  maj: ["quality"],
  min: ["quality"],
  aug: ["augmented"],
  dim: ["diminished", "diminished-seventh"],
  sus: ["suspended"],
  add: ["add-chord"],
  // extensions
  "7": ["dominant-seventh", "extension"],
  "9": ["extended-chord", "extension"],
  "11": ["extended-chord", "extension"],
  "13": ["extended-chord", "extension"],
  maj7: ["quality"],
  // voicing markers
  "6": ["voicing"],
  alt: ["altered-chord"],
  // triads vs tetrads
  triad: ["triad"],
  tetrad: ["tetrad"],
};

/**
 * Given a chord symbol suffix, derive relevant dictionary refs.
 *
 * Example: "m7" → refs for "chord", "quality", "dominant-seventh", "extension"
 */
export function chordToDictionaryRefs(
  symbol: string,
  formulaLength: number,
): MusicEntityRef[] {
  const seen = new Set<string>();
  const refs: MusicEntityRef[] = [];
  const norm = symbol.toLowerCase();

  // Always include "chord"
  for (const id of CHORD_QUALITY_GLOSSARY._always ?? []) {
    if (!seen.has(id)) {
      seen.add(id);
      refs.push(dictionaryRef(id));
    }
  }

  // Triad vs tetrad
  if (formulaLength === 3) {
    refs.push(dictionaryRef("triad", "Triad"));
    seen.add("triad");
  } else if (formulaLength >= 4) {
    refs.push(dictionaryRef("tetrad", "Tetrad"));
    seen.add("tetrad");
  }

  // Match quality keywords
  for (const [keyword, ids] of Object.entries(CHORD_QUALITY_GLOSSARY)) {
    if (keyword === "_always" || keyword === "triad" || keyword === "tetrad")
      continue;
    if (norm.includes(keyword)) {
      for (const id of ids) {
        if (!seen.has(id)) {
          seen.add(id);
          refs.push(dictionaryRef(id));
        }
      }
    }
  }

  return refs;
}

// ── Interval → Dictionary refs ─────────────────────────

const INTERVAL_GLOSSARY: Record<string, string> = {
  P1: "perfect-unison",
  m2: "minor-second",
  M2: "major-second",
  m3: "minor-third",
  M3: "major-third",
  P4: "perfect-fourth",
  TT: "tritone",
  P5: "perfect-fifth",
  m6: "minor-sixth",
  M6: "major-sixth",
  m7: "minor-seventh",
  M7: "major-seventh",
};

/**
 * Given an interval short name (e.g. "P5"), return its dictionary ref.
 */
export function intervalToDictionaryRef(
  shortName: string,
): MusicEntityRef | null {
  const termId = INTERVAL_GLOSSARY[shortName];
  return termId
    ? dictionaryRef(termId, INTERVAL_NAMES[shortName] ?? shortName)
    : null;
}

// ── Scale → Dictionary refs ────────────────────────────

const SCALE_GLOSSARY: Record<string, string> = {
  major: "major-scale",
  ionian: "major-scale",
  "natural-minor": "natural-minor",
  natural_minor: "natural-minor",
  aeolian: "aeolian",
  "harmonic-minor": "harmonic-minor",
  harmonic_minor: "harmonic-minor",
  "melodic-minor": "melodic-minor",
  melodic_minor: "melodic-minor",
  "pentatonic-major": "pentatonic-major",
  major_pent: "pentatonic-major",
  "pentatonic-minor": "pentatonic-minor",
  minor_pent: "pentatonic-minor",
  blues: "blues-scale",
  "whole-tone": "whole-tone-scale",
  whole_tone: "whole-tone-scale",
  "octatonic-hw": "diminished-scale",
  "octatonic-wh": "diminished-scale",
  diminished_hw: "diminished-scale",
  diminished_wh: "diminished-scale",
  chromatic: "chromatic-scale",
  dorian: "dorian",
  phrygian: "phrygian",
  lydian: "lydian",
  mixolydian: "mixolydian",
  locrian: "locrian",
  // Melodic minor modes
  altered: "altered",
  lydian_dominant: "lydian",
  lydian_augmented: "lydian",
  locrian_natural2: "locrian",
  dorian_b2: "dorian",
  mixolydian_b6: "mixolydian",
  // Harmonic minor modes
  phrygian_dominant: "phrygian",
  dorian_sharp4: "dorian",
  // Harmonic major
  harmonic_major: "major-scale",
  // Middle Eastern
  double_harmonic: "scale",
  maqam_hijaz: "scale",
  maqam_bayati: "scale",
  maqam_rast: "scale",
  maqam_saba: "scale",
  maqam_nahawand: "harmonic-minor",
  // Indian
  raga_bhairav: "scale",
  raga_yaman: "lydian",
  raga_kafi: "dorian",
  raga_bhairavi: "phrygian",
  // Japanese
  japanese_insen: "scale",
  hirajoshi: "scale",
  iwato: "scale",
  // Bebop
  bebop_dominant: "scale",
  bebop_major: "scale",
  bebop_dorian: "scale",
  // Hungarian
  hungarian_minor: "scale",
  hungarian_major: "scale",
};

/**
 * Given a scale key, return its dictionary ref (if any).
 */
export function scaleToDictionaryRef(scaleKey: string): MusicEntityRef | null {
  const termId = SCALE_GLOSSARY[scaleKey.toLowerCase()];
  return termId ? dictionaryRef(termId) : null;
}

/**
 * Compute all cross-references for a chord entry.
 * This is the main entry point for the chord detail page.
 *
 * @param formula - the chord's degree formula
 * @param symbol - the chord's type/suffix (e.g. "m7", "maj7")
 * @param scalesData - the MASTER_SCALES record (pass from scales.tsx)
 */
export function computeChordRelations(
  formula: DegreeToken[],
  symbol: string,
  scalesData: Record<string, { name: string; commonChords: string[] }>,
): RelatedEntities {
  return {
    intervals: chordToIntervalRefs(formula),
    scales: chordToScaleRefs(scalesData, symbol),
    chords: [], // same-root chords are handled by the page's loader
    glossary: chordToDictionaryRefs(symbol, formula.length),
  };
}

// ── Scale → Related Scale refs ─────────────────────────

/**
 * Given a scale's relatedScales array (scale keys),
 * resolve them to MusicEntityRef[] using the scales master data.
 *
 * @param relatedScaleKeys - array of scale keys from the spec
 * @param scalesData - the MASTER_SCALES record
 */
export function scaleToRelatedScaleRefs(
  relatedScaleKeys: string[],
  scalesData: Record<string, { name: string }>,
): MusicEntityRef[] {
  return relatedScaleKeys
    .map((key) => {
      const spec = scalesData[key];
      if (!spec) return null;
      return scaleRef(key, spec.name);
    })
    .filter((ref): ref is MusicEntityRef => ref !== null);
}

// ── Scale → Full Relations ─────────────────────────────

export interface ScaleRelatedEntities extends RelatedEntities {
  relatedScales: MusicEntityRef[];
}

/**
 * Compute all cross-references for a scale entry.
 *
 * @param scaleKey - the scale's key in MASTER_SCALES
 * @param ints - the scale's semitone pattern
 * @param commonChords - the scale's common chord symbols
 * @param relatedScaleKeys - the scale's related scale keys
 * @param scalesData - the MASTER_SCALES record
 */
export function computeScaleRelations(
  scaleKey: string,
  ints: number[],
  commonChords: string[],
  relatedScaleKeys: string[],
  scalesData: Record<string, { name: string }>,
): ScaleRelatedEntities {
  const glossaryRef = scaleToDictionaryRef(scaleKey);
  return {
    intervals: scaleToIntervalRefs(ints),
    scales: [],
    chords: scaleToChordRefs(commonChords),
    glossary: glossaryRef ? [glossaryRef] : [],
    relatedScales: scaleToRelatedScaleRefs(relatedScaleKeys, scalesData),
  };
}
