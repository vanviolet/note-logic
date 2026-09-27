import type {
  CadentialStrength,
  FamilyChordEntry,
  ScaleType,
} from "~/theory-music/family";

export type FamilyFilter = "all" | FamilyChordEntry["family"];

export type CadentialFilter = "all" | CadentialStrength;

export type ScaleFilter = ScaleType;
