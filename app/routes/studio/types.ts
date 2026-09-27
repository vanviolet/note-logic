export type NoteDuration = 1 | 2 | 4 | 8 | 16;

/** ppp–fff full dynamic range */
export type DynamicMark = "ppp" | "pp" | "p" | "mp" | "mf" | "f" | "ff" | "fff";

/** Harmonic techniques: nh/ah/ph/th/sh/fh */
export type HarmonicType = "none" | "nh" | "ah" | "ph" | "th" | "sh" | "fh";

/** Accent markings: ac (accent), hac (heavy), ten (tenuto) */
export type AccentMark = "none" | "ac" | "hac" | "ten";

/** Ornament markings */
export type OrnamentMark = "none" | "turn" | "iturn" | "umordent" | "lmordent";

/** Pick-slide direction: psu (up), psd (down) */
export type PickSlideMark = "none" | "up" | "down";

/** Tuplet division values */
export type TupletValue = "none" | "3" | "5" | "6" | "7";

/** Tremolo picking mark count */
export type TremoloMark = "none" | "1" | "2" | "3";

/** Grace note type: bb (before beat), ob (on beat) */
export type GraceNoteType = "none" | "bb" | "ob";

/** Wah pedal mode */
export type WahMode = "none" | "open" | "close";

/** Brush stroke direction: bu (up), bd (down) */
export type StrokeType = "none" | "bu" | "bd";

/** Arpeggio direction: au (up), ad (down) */
export type ArpeggioType = "none" | "au" | "ad";

/** Fermata duration */
export type FermataType = "none" | "short" | "medium" | "long";

/** Ottava / octave shift */
export type OctaveShift = "none" | "8va" | "8vb" | "15ma" | "15mb";

export type BeatEffect =
  | "none"
  | "v"
  | "vw"
  | "f"
  | "fo"
  | "vs"
  | "d"
  | "dd"
  | "su"
  | "sd"
  | "cre"
  | "dec"
  | "s"
  | "p"
  | "tt"
  | "slashed";

/** h = hammer-on/pull-off; tr = trill (harmonics moved to HarmonicType) */
export type NoteEffect = "none" | "h" | "tr";

export type NoteVibrato = "none" | "slight" | "wide";

export type SlideInMark = "none" | "below" | "above";

/** ss=shift, sl=legato, up=sou (out upward), down=sod (out downward) */
export type SlideOutMark = "none" | "shift" | "legato" | "up" | "down";

export type StudioNote = {
  id: string;
  measure: number;
  beat: number;
  string: number;
  fret: number;
  duration: NoteDuration;
  dynamic: DynamicMark;
  beatEffect: BeatEffect;
  noteEffect: NoteEffect;
  vibrato: NoteVibrato;
  slideIn: SlideInMark;
  slideOut: SlideOutMark;
  isBend: boolean;
  isLetRing: boolean;
  isPalmMute: boolean;
  isDead: boolean;
  isStaccato: boolean;
  // ── Extended note-level effects ──────────────────────
  isTied: boolean;
  isGhost: boolean;
  isLeftHandTap: boolean;
  accent: AccentMark;
  harmonicType: HarmonicType;
  /** Trill target fret (0 = auto / unset); used when noteEffect === "tr" */
  trillFret: number;
  /** Trill speed in subdivisions */
  trillSpeed: 16 | 32 | 64;
  ornament: OrnamentMark;
  pickSlide: PickSlideMark;
  // ── Extended beat-level effects ──────────────────────
  strokeType: StrokeType;
  arpeggioType: ArpeggioType;
  wahMode: WahMode;
  tuplet: TupletValue;
  tremoloMark: TremoloMark;
  graceType: GraceNoteType;
  fermata: FermataType;
  octaveShift: OctaveShift;
  /** Chord diagram name annotation (empty = none) */
  chordName: string;
  /** Free text annotation above beat (empty = none) */
  beatText: string;
};

export type CellPosition = {
  measure: number;
  beat: number;
  string: number;
};

/** Key signatures supported by AlphaTex `\ks` */
export type KeySignature =
  | "C"
  | "G"
  | "D"
  | "A"
  | "E"
  | "B"
  | "F#"
  | "C#"
  | "F"
  | "Bb"
  | "Eb"
  | "Ab"
  | "Db"
  | "Gb"
  | "Cb";

/**
 * Score-level and track-level metadata that maps directly to AlphaTex
 * score/structural metadata tags.
 */
export type ScoreSettings = {
  // Score-level (\title, \subtitle, \artist, \album, \words, \music, \copyright)
  subtitle: string;
  artist: string;
  album: string;
  words: string;
  music: string;
  copyright: string;
  // Track-level
  trackName: string;
  instrument: string;
  /** Capo fret (0 = no capo) */
  capo: number;
  /** Key signature */
  keySignature: KeySignature;
};

export const DEFAULT_SCORE_SETTINGS: ScoreSettings = {
  subtitle: "",
  artist: "",
  album: "",
  words: "",
  music: "",
  copyright: "",
  trackName: "Guitar",
  instrument: "Acoustic Guitar Steel",
  capo: 0,
  keySignature: "C",
};

export type ScoreSource = "editor" | "imported";

// ════════════════════════════════════════════════════════
// Multi-Track
// ════════════════════════════════════════════════════════

/** Predefined track colors for quick visual distinction. */
export const TRACK_COLORS = [
  "#f87171", // red-400
  "#60a5fa", // blue-400
  "#34d399", // emerald-400
  "#fbbf24", // amber-400
  "#a78bfa", // violet-400
  "#f472b6", // pink-400
  "#2dd4bf", // teal-400
  "#fb923c", // orange-400
] as const;

export type StudioTrack = {
  id: string;
  name: string;
  instrument: string;
  tuning: readonly string[];
  capo: number;
  volume: number; // 0–1
  isMuted: boolean;
  isSolo: boolean;
  color: string;
  notes: StudioNote[];
};

export type AlphaTabApiLike = {
  tex: (alphaTex: string) => void;
  renderScore: (score: unknown, trackIndexes?: number[]) => void;
  playPause: () => void;
  stop: () => void;
  destroy: () => void;
  activeBeatsChanged: { on: (cb: (args: any) => void) => void };
  playerReady: { on: (cb: () => void) => void };
  error: { on: (cb: (error: any) => void) => void };
};
