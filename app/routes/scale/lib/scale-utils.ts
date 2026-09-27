import type { ScaleInstance, ScaleFamilyType } from "~/theory-music/scales";

/**
 * Check if a ScaleInstance matches a search query.
 */
export function includeByQuery(scale: ScaleInstance, query: string): boolean {
  const q = query.toLowerCase();
  return (
    scale.scale.toLowerCase().includes(q) ||
    scale.type.toLowerCase().includes(q) ||
    scale.root.toLowerCase().includes(q) ||
    scale.description.toLowerCase().includes(q) ||
    scale.aliases.some((a) => a.toLowerCase().includes(q)) ||
    scale.genres.some((g) => g.toLowerCase().includes(q)) ||
    (scale.region?.toLowerCase().includes(q) ?? false) ||
    scale.notes.some((n) => n.toLowerCase().includes(q)) ||
    scale.degrees.some((d) => d.toLowerCase().includes(q))
  );
}

/**
 * Badge variant based on difficulty level.
 */
export function difficultyBadgeVariant(
  difficulty: ScaleInstance["difficulty"],
): "tonic" | "subdominant" | "dominant" {
  if (difficulty === "beginner") return "tonic";
  if (difficulty === "intermediate") return "subdominant";
  return "dominant";
}

/**
 * Human-readable label for difficulty.
 */
export function difficultyLabel(
  difficulty: ScaleInstance["difficulty"],
): string {
  const map: Record<string, string> = {
    beginner: "Pemula",
    intermediate: "Menengah",
    advanced: "Lanjutan",
  };
  return map[difficulty] ?? difficulty;
}

/**
 * Human-readable label for a scale family type.
 */
export function familyLabel(family: ScaleFamilyType): string {
  const map: Record<ScaleFamilyType, string> = {
    "diatonic-mode": "Diatonic Mode",
    "minor-system": "Minor System",
    pentatonic: "Pentatonic",
    blues: "Blues",
    symmetric: "Symmetric",
    "melodic-minor-mode": "Melodic Minor Mode",
    "harmonic-minor-mode": "Harmonic Minor Mode",
    "harmonic-major-mode": "Harmonic Major Mode",
    bebop: "Bebop",
    jazz: "Jazz",
    "middle-eastern": "Middle Eastern",
    indian: "Indian",
    "east-asian": "East Asian",
    african: "African",
    "european-folk": "European Folk",
    hungarian: "Hungarian",
    spanish: "Spanish",
    contemporary: "Contemporary",
    "microtonal-approx": "Microtonal Approx",
    heptatonic: "Heptatonic",
    hexatonic: "Hexatonic",
    exotic: "Exotic",
  };
  return map[family] ?? family;
}
