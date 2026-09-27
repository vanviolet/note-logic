import type {
  ConsonanceLevel,
  GeneratedInterval,
} from "~/theory-music/interval";

export function includeByQuery(interval: GeneratedInterval, query: string) {
  const q = query.toLowerCase();
  return (
    interval.name.toLowerCase().includes(q) ||
    interval.short.toLowerCase().includes(q) ||
    interval.note.toLowerCase().includes(q) ||
    interval.inversionName.toLowerCase().includes(q) ||
    interval.aliases?.some((alias) => alias.toLowerCase().includes(q)) ||
    false
  );
}

export function consonancePillVariant(
  consonance: ConsonanceLevel,
): "tonic" | "subdominant" | "dominant" {
  if (consonance === "perfect-consonance") return "tonic";
  if (consonance === "imperfect-consonance") return "subdominant";
  return "dominant";
}
