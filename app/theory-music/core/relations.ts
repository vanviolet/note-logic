// ════════════════════════════════════════════════════════
// Core Music – Cross-Reference & Relation System
// ════════════════════════════════════════════════════════
//
// Provides typed references that link entities across
// the music theory domain: chord ↔ interval, chord ↔ scale,
// song ↔ chord, dictionary ↔ theory entity, etc.
//
// This enables features like:
// - Click a chord in songbook → navigate to chord detail
// - From chord detail → see which intervals compose it
// - From chord detail → see which scales contain it
// - From interval page → see which chords use this interval
// ════════════════════════════════════════════════════════

// ── Entity Types ───────────────────────────────────────

/**
 * All linkable entity types in the system.
 * Used as discriminator for cross-references.
 */
export type MusicEntityType =
  | "chord"
  | "interval"
  | "scale"
  | "family-chord"
  | "song"
  | "dictionary"
  | "note";

// ── Entity Reference ───────────────────────────────────

/**
 * A typed reference to any music entity.
 * Lightweight pointer that can be resolved at runtime.
 */
export interface MusicEntityRef {
  /** The entity type */
  type: MusicEntityType;
  /** The entity's unique ID (slug) */
  id: string;
  /** Optional display label */
  label?: string;
}

// ── Route Helpers ──────────────────────────────────────

/**
 * Resolve an entity reference to its app route path.
 * This is the single place that maps entity types to routes.
 */
export function entityToRoute(ref: MusicEntityRef): string {
  switch (ref.type) {
    case "chord":
      return `/chord/${ref.id}`;
    case "interval":
      return `/interval?highlight=${ref.id}`;
    case "scale":
      return `/family?highlight=${ref.id}`;
    case "family-chord":
      return `/family?chord=${ref.id}`;
    case "song":
      return `/songbook/${ref.id}`;
    case "dictionary":
      return `/nolopedia/${ref.id}`;
    case "note":
      return `/chord?root=${ref.id}`;
    default:
      return "#";
  }
}

/**
 * Build a chord entity reference from a chord name.
 * Converts "C#m7" → { type: "chord", id: "c-sharp-m7", label: "C#m7" }
 */
export function chordRef(chordName: string, chordId?: string): MusicEntityRef {
  return {
    type: "chord",
    id: chordId ?? chordNameToId(chordName),
    label: chordName,
  };
}

/**
 * Build an interval entity reference.
 */
export function intervalRef(shortName: string, label?: string): MusicEntityRef {
  return {
    type: "interval",
    id: shortName.toLowerCase().replace(/\s+/g, "-"),
    label: label ?? shortName,
  };
}

/**
 * Build a scale entity reference.
 */
export function scaleRef(scaleKey: string, label?: string): MusicEntityRef {
  return {
    type: "scale",
    id: scaleKey,
    label: label ?? scaleKey,
  };
}

/**
 * Build a song entity reference.
 */
export function songRef(songId: string, title?: string): MusicEntityRef {
  return {
    type: "song",
    id: songId,
    label: title ?? songId,
  };
}

/**
 * Build a dictionary entity reference.
 */
export function dictionaryRef(termId: string, label?: string): MusicEntityRef {
  return {
    type: "dictionary",
    id: termId,
    label: label ?? termId,
  };
}

// ── ID Helpers ─────────────────────────────────────────

/**
 * Convert a chord name to a URL-friendly ID.
 * "C#m7" → "c-sharp-m7"
 * "Bbmaj7" → "bb-maj7"
 */
export function chordNameToId(name: string): string {
  return name
    .replace(/#/g, "-sharp")
    .replace(/♯/g, "-sharp")
    .replace(/♭/g, "b")
    .replace(/\s+/g, "-")
    .toLowerCase();
}

/**
 * Resolve an ID back to a display chord name (best effort).
 * "c-sharp-m7" → "C#m7"
 */
export function chordIdToName(id: string): string {
  return id
    .replace(/-sharp/g, "#")
    .replace(/^([a-g])(b?)/, (_, letter, flat) => letter.toUpperCase() + flat);
}
