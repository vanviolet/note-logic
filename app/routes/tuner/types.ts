export interface GuitarStringTarget {
  id: string;
  note: string;
  octave: number;
  midi: number;
}

export type TuningMode = "auto" | "manual";
