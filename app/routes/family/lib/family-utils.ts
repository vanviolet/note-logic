import type {
  CadentialStrength,
  FamilyChordEntry,
} from "~/theory-music/family";

export function includeByQuery(entry: FamilyChordEntry, query: string) {
  const q = query.toLowerCase();

  return (
    entry.degree.toLowerCase().includes(q) ||
    entry.role.toLowerCase().includes(q) ||
    entry.description.toLowerCase().includes(q) ||
    entry.family.toLowerCase().includes(q) ||
    entry.chord.name.toLowerCase().includes(q) ||
    entry.chord.relatedSeventh.toLowerCase().includes(q) ||
    entry.chord.composed.some((tone) => tone.note.toLowerCase().includes(q)) ||
    entry.functionHints.some((hint) => hint.toLowerCase().includes(q)) ||
    entry.commonResolutions.some((move) => move.toLowerCase().includes(q)) ||
    entry.progressionUse.some((prog) => prog.toLowerCase().includes(q)) ||
    entry.borrowedAlternatives.some((alt) => alt.toLowerCase().includes(q))
  );
}

export function familyBadgeVariant(
  family: FamilyChordEntry["family"],
): "tonic" | "subdominant" | "dominant" {
  if (family === "Tonic") return "tonic";
  if (family === "Subdominant") return "subdominant";
  return "dominant";
}

export function cadentialLabel(strength: CadentialStrength) {
  const map: Record<CadentialStrength, string> = {
    "very-weak": "Very Weak",
    weak: "Weak",
    medium: "Medium",
    strong: "Strong",
    "very-strong": "Very Strong",
  };

  return map[strength];
}
