// ════════════════════════════════════════════════════════
// Chord Sheet Parser
// ════════════════════════════════════════════════════════
//
// Parses a plain-text chord sheet into SongSection[] and
// extracts chordsUsed[]. Used by the add-song server action.
//
// ⚠️  .server.ts — only used server-side.
// ════════════════════════════════════════════════════════

import type {
  SongSection,
  SongSectionType,
} from "~/theory-music/songbook/types";

/** Known section-type keywords (case-insensitive). */
const SECTION_TYPES: Record<string, SongSectionType> = {
  intro: "intro",
  verse: "verse",
  "pre-chorus": "pre-chorus",
  prechorus: "pre-chorus",
  chorus: "chorus",
  bridge: "bridge",
  outro: "outro",
  interlude: "interlude",
  solo: "solo",
  instrumental: "instrumental",
  break: "break",
};

/**
 * Detect whether a line is a section header.
 *
 * Supported formats:
 *   `[Intro]`
 *   `[Verse 1]`
 *   `[Pre-Chorus]`
 *   `[Chorus: Repeated]`
 *
 * Returns `{ type, label }` or `null`.
 */
function parseSectionHeader(
  line: string,
): { type: SongSectionType; label: string } | null {
  const trimmed = line.trim();

  // Match lines that are ONLY a section header like [Verse 1]
  // (not ChordPro chords like [Am]text)
  const m = trimmed.match(/^\[([^\]]+)\]$/);
  if (!m) return null;

  const raw = m[1].trim();

  // Try to match against known types
  // e.g. "Verse 1" → type="verse", label="Verse 1"
  // e.g. "Pre-Chorus" → type="pre-chorus", label="Pre-Chorus"
  for (const [keyword, type] of Object.entries(SECTION_TYPES)) {
    if (raw.toLowerCase().startsWith(keyword)) {
      return { type, label: raw };
    }
  }

  // Fallback: treat unknown headers as verse
  return { type: "verse", label: raw };
}

/**
 * Extract unique chord names from a ChordPro line.
 * e.g. `"[C]I walked [Am]across"` → ["C", "Am"]
 */
function extractChords(line: string): string[] {
  const matches = line.matchAll(/\[([A-G][^\]]*)\]/g);
  return [...matches].map((m) => m[1]);
}

/**
 * Parse a raw chord sheet text into `SongSection[]` and `chordsUsed[]`.
 *
 * Format:
 *   Lines starting with a solo `[SectionHeader]` create a new section.
 *   All other lines are added to the current section as ChordPro lines.
 *   If no section header appears before the first lines, they go into
 *   a default "Verse" section.
 */
export function parseChordSheet(text: string): {
  sections: SongSection[];
  chordsUsed: string[];
} {
  const lines = text.split("\n");
  const sections: SongSection[] = [];
  const allChords = new Set<string>();

  let currentSection: SongSection | null = null;

  for (const line of lines) {
    const header = parseSectionHeader(line);

    if (header) {
      // Start a new section
      currentSection = {
        type: header.type,
        label: header.label,
        lines: [],
      };
      sections.push(currentSection);
    } else {
      // Ensure we have a section
      if (!currentSection) {
        currentSection = {
          type: "verse",
          label: "Verse",
          lines: [],
        };
        sections.push(currentSection);
      }

      // Only add non-empty lines (but preserve intentional spacing)
      const trimmed = line.trimEnd();
      if (trimmed.length > 0) {
        currentSection.lines.push(trimmed);

        // Extract chords
        for (const chord of extractChords(trimmed)) {
          allChords.add(chord);
        }
      }
    }
  }

  return {
    sections,
    chordsUsed: [...allChords],
  };
}
