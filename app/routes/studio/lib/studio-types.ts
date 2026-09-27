import type {
  NoteDuration,
  ScoreSettings,
  StudioNote,
  StudioTrack,
} from "../types";

// ── Sidebar group ──────────────────────────────────────

export type SidebarGroup = {
  id: string;
  name: string;
  bars: number[];
  parentGroupId: string | null;
  collapsed: boolean;
};

// ── Batch edit draft ───────────────────────────────────

export type BatchEditDraft = {
  duration: "keep" | "1" | "2" | "4" | "8" | "16";
  dynamic: "keep" | "pp" | "p" | "mp" | "mf" | "f" | "ff";
  palmMute: "keep" | "on" | "off";
  deadNote: "keep" | "on" | "off";
  letRing: "keep" | "on" | "off";
  staccato: "keep" | "on" | "off";
  ghost: "keep" | "on" | "off";
  accent: "keep" | "none" | "ac" | "hac" | "ten";
  harmonic: "keep" | "none" | "nh" | "ah" | "ph" | "th" | "sh" | "fh";
};

// ── Project persistence ────────────────────────────────

export type StudioProjectSnapshot = {
  id: string;
  name: string;
  updatedAt: number;
  title: string;
  measureCount: number;
  beatsPerMeasure: number;
  timeSignatureNumerator: number;
  tempo: number;
  cellWidth: number;
  stringTuning: readonly string[];
  defaultDuration: NoteDuration;
  barNames: string[];
  barGroups?: SidebarGroup[];
  scoreSettings?: ScoreSettings;
  notes: StudioNote[];
  /** Multi-track data — when present, `notes` is the active track's snapshot */
  tracks?: StudioTrack[];
  /** Which track was active when saved */
  activeTrackId?: string;
};

// ── Parsed sidebar node key ────────────────────────────

export type ParsedSidebarNodeKey = {
  kind: string;
  measure: number;
  beat: number;
  string: number;
  raw: string;
};

export function parseSidebarNodeKey(key: string): ParsedSidebarNodeKey {
  const parts = key.split(":");
  return {
    kind: parts[0] ?? "",
    measure: Number(parts[1]),
    beat: Number(parts[2]),
    string: Number(parts[3]),
    raw: key,
  };
}
