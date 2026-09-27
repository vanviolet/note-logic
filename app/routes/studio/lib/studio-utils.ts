import type {
  AccentMark,
  BeatEffect,
  CellPosition,
  DynamicMark,
  HarmonicType,
  NoteDuration,
  NoteEffect,
  NoteVibrato,
  PickSlideMark,
  ScoreSettings,
  SlideInMark,
  SlideOutMark,
  StudioNote,
  StudioTrack,
} from "../types";
import { TRACK_COLORS } from "../types";
import {
  NOTES_SHARP as NOTE_NAMES,
  parseScientificNote,
} from "~/theory-music/core";

export const STRING_TUNING = ["E4", "B3", "G3", "D3", "A2", "E2"] as const;

/**
 * Escape a string for use inside AlphaTex double-quoted strings.
 * Handles quotes, backslashes, and control characters.
 */
function sanitizeTexString(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r")
    .replace(/\t/g, "\\t");
}

export function toMidi(note: string) {
  const parsed = parseScientificNote(note);
  return (parsed.octave + 1) * 12 + parsed.pitchClass;
}

export function midiToScientific(midi: number) {
  const pitchClass = ((midi % 12) + 12) % 12;
  const octave = Math.floor(midi / 12) - 1;
  return `${NOTE_NAMES[pitchClass]}${octave}`;
}

export function toPitchClass(note: StudioNote) {
  const openMidi = toMidi(STRING_TUNING[note.string]);
  return (openMidi + note.fret) % 12;
}

/**
 * Returns the pitch-class name (e.g. "A", "C#") for a given open-string note + fret.
 * @param openStringNote  Scientific notation like "E4", "B3"
 * @param fret            Fret number (0-24)
 */
export function fretToNoteName(openStringNote: string, fret: number): string {
  const midi = toMidi(openStringNote) + fret;
  const pitchClass = ((midi % 12) + 12) % 12;
  return NOTE_NAMES[pitchClass];
}

export function buildCellId(position: CellPosition) {
  return `cell:${position.measure}:${position.beat}:${position.string}`;
}

export function parseCellId(id: string): CellPosition | null {
  const parts = id.split(":");
  if (parts.length !== 4 || parts[0] !== "cell") return null;

  const measure = Number(parts[1]);
  const beat = Number(parts[2]);
  const string = Number(parts[3]);

  if (
    Number.isNaN(measure) ||
    Number.isNaN(beat) ||
    Number.isNaN(string) ||
    measure < 0 ||
    beat < 0 ||
    string < 0
  ) {
    return null;
  }

  return { measure, beat, string };
}

function buildNoteLevelToken(n: StudioNote): string {
  const nfx: string[] = [];
  if (n.noteEffect === "h") nfx.push("h");
  if (n.noteEffect === "tr") {
    nfx.push(n.trillFret > 0 ? `tr (${n.trillFret} ${n.trillSpeed})` : "tr");
  }
  if (n.isPalmMute) nfx.push("pm");
  if (n.isLetRing) nfx.push("lr");
  if (n.isStaccato) nfx.push("st");
  if (n.isBend) nfx.push("b (0 4 0)");
  if (n.harmonicType && n.harmonicType !== "none") nfx.push(n.harmonicType);
  if (n.isTied) nfx.push("t");
  if (n.isGhost) nfx.push("g");
  if (n.isLeftHandTap) nfx.push("lht");
  if (n.accent && n.accent !== "none") nfx.push(n.accent);
  if (n.ornament && n.ornament !== "none") nfx.push(n.ornament);
  if (n.pickSlide === "up") nfx.push("psu");
  if (n.pickSlide === "down") nfx.push("psd");
  if (n.slideIn === "below") nfx.push("sib");
  if (n.slideIn === "above") nfx.push("sia");
  if (n.slideOut === "shift") nfx.push("ss");
  if (n.slideOut === "legato") nfx.push("sl");
  if (n.slideOut === "up") nfx.push("sou");
  if (n.slideOut === "down") nfx.push("sod");
  return nfx.length > 0 ? `{${nfx.join(" ")}}` : "";
}

function buildBeatLevelToken(n: StudioNote): string {
  const bfx: string[] = [];
  if (n.beatEffect !== "none") bfx.push(n.beatEffect);
  if (n.vibrato === "slight" && n.beatEffect !== "v") bfx.push("v");
  if (n.vibrato === "wide" && n.beatEffect !== "vw") bfx.push("vw");
  if (n.strokeType && n.strokeType !== "none") bfx.push(n.strokeType);
  if (n.arpeggioType && n.arpeggioType !== "none") bfx.push(n.arpeggioType);
  if (n.wahMode === "open") bfx.push("waho");
  if (n.wahMode === "close") bfx.push("wahc");
  if (n.tuplet && n.tuplet !== "none") bfx.push(`tu ${n.tuplet}`);
  if (n.tremoloMark && n.tremoloMark !== "none")
    bfx.push(`tp ${n.tremoloMark}`);
  if (n.graceType && n.graceType !== "none") bfx.push(`gr ${n.graceType}`);
  if (n.fermata && n.fermata !== "none") bfx.push(`fermata ${n.fermata}`);
  if (n.octaveShift && n.octaveShift !== "none")
    bfx.push(`ot ${n.octaveShift}`);
  if (n.chordName) bfx.push(`ch "${n.chordName}"`);
  if (n.beatText) bfx.push(`txt "${n.beatText}"`);
  bfx.push(`dy ${n.dynamic}`);
  return bfx.length > 0 ? ` {${bfx.join(" ")}}` : "";
}

function noteToAlphaTexToken(note: StudioNote) {
  const stringNo = note.string + 1;
  const fretToken = note.isDead ? "x" : String(note.fret);
  return `${fretToken}.${stringNo}${buildNoteLevelToken(note)}.${note.duration}${buildBeatLevelToken(note)}`;
}

export function toAlphaTex(
  notes: StudioNote[],
  tempo: number,
  measureCount: number,
  beatsPerMeasure: number,
  title = "Tab Studio Draft",
  tuning: readonly string[] = STRING_TUNING,
  timeSignatureNumerator = beatsPerMeasure,
  scoreSettings?: Partial<ScoreSettings>,
) {
  // Compute rest duration that matches the grid cell size
  // beatsPerMeasure=4,tsNum=4 → 4 (quarter); =8,4 → 8 (eighth); =16,4 → 16 (sixteenth)
  const restDuration = toStudioDuration(
    Math.round((beatsPerMeasure / Math.max(1, timeSignatureNumerator)) * 4),
  );

  const score: string[] = [];
  score.push(`\\title "${sanitizeTexString(title)}"`);
  if (scoreSettings?.subtitle)
    score.push(`\\subtitle "${sanitizeTexString(scoreSettings.subtitle)}"`);
  if (scoreSettings?.artist)
    score.push(`\\artist "${sanitizeTexString(scoreSettings.artist)}"`);
  if (scoreSettings?.album)
    score.push(`\\album "${sanitizeTexString(scoreSettings.album)}"`);
  if (scoreSettings?.words)
    score.push(`\\words "${sanitizeTexString(scoreSettings.words)}"`);
  if (scoreSettings?.music)
    score.push(`\\music "${sanitizeTexString(scoreSettings.music)}"`);
  if (scoreSettings?.copyright)
    score.push(`\\copyright "${sanitizeTexString(scoreSettings.copyright)}"`);
  score.push(`\\tempo ${tempo}`);

  const trackName = scoreSettings?.trackName ?? "Guitar";
  const instrument = scoreSettings?.instrument ?? "Acoustic Guitar Steel";

  // Use MIDI program number for instrument to avoid name-matching issues.
  // AlphaTex accepts `instrument N` (MIDI program 0-127) or `instrument percussion`.
  const midiProgram = instrumentToMidiProgram(instrument);
  if (midiProgram < 0) {
    // Percussion / drums
    score.push(
      `\\track "${sanitizeTexString(trackName)}" { instrument percussion }`,
    );
  } else {
    score.push(
      `\\track "${sanitizeTexString(trackName)}" { instrument ${midiProgram} }`,
    );
  }
  score.push(`\\tuning (${tuning.join(" ")})`);

  const capo = scoreSettings?.capo ?? 0;
  if (capo > 0) score.push(`\\capo ${capo}`);

  const ks = scoreSettings?.keySignature ?? "C";
  if (ks !== "C") score.push(`\\ks ${ks}`);

  score.push(`\\ts (${timeSignatureNumerator} 4)`);

  // Pre-index notes by measure:beat for O(1) lookup instead of O(n) filter per beat
  const noteIndex = new Map<number, StudioNote[]>();
  for (const n of notes) {
    const key = n.measure * 10000 + n.beat;
    let arr = noteIndex.get(key);
    if (!arr) {
      arr = [];
      noteIndex.set(key, arr);
    }
    arr.push(n);
  }

  const bars: string[] = [];
  for (let measure = 0; measure < measureCount; measure += 1) {
    const beats: string[] = [];

    for (let beat = 0; beat < beatsPerMeasure; beat += 1) {
      const beatNotes = noteIndex.get(measure * 10000 + beat);

      if (!beatNotes || beatNotes.length === 0) {
        beats.push(`r.${restDuration}`);
        continue;
      }

      if (beatNotes.length === 1) {
        beats.push(noteToAlphaTexToken(beatNotes[0]));
        continue;
      }

      // Chord: multiple notes on the same beat — sort by string
      beatNotes.sort((a, b) => a.string - b.string);
      const chord = beatNotes
        .map((n) => {
          const f = n.isDead ? "x" : String(n.fret);
          return `${f}.${n.string + 1}${buildNoteLevelToken(n)}`;
        })
        .join(" ");
      const first = beatNotes[0];
      beats.push(`(${chord}).${first.duration}${buildBeatLevelToken(first)}`);
    }

    bars.push(beats.join(" "));
  }

  score.push(bars.join(" | "));
  return score.join("\n");
}

/**
 * Generate multi-track AlphaTex. Each track gets its own `\track` block.
 * AlphaTex multi-track: score meta → track1 → track2 → …
 */
export function toMultiTrackAlphaTex(
  tracks: Array<{
    name: string;
    instrument: string;
    tuning: readonly string[];
    capo: number;
    notes: StudioNote[];
  }>,
  tempo: number,
  measureCount: number,
  beatsPerMeasure: number,
  title = "Tab Studio Draft",
  timeSignatureNumerator = beatsPerMeasure,
  scoreSettings?: Partial<ScoreSettings>,
): string {
  const restDuration = toStudioDuration(
    Math.round((beatsPerMeasure / Math.max(1, timeSignatureNumerator)) * 4),
  );

  const lines: string[] = [];

  // Score-level meta
  lines.push(`\\title "${sanitizeTexString(title)}"`);
  if (scoreSettings?.subtitle)
    lines.push(`\\subtitle "${sanitizeTexString(scoreSettings.subtitle)}"`);
  if (scoreSettings?.artist)
    lines.push(`\\artist "${sanitizeTexString(scoreSettings.artist)}"`);
  if (scoreSettings?.album)
    lines.push(`\\album "${sanitizeTexString(scoreSettings.album)}"`);
  if (scoreSettings?.words)
    lines.push(`\\words "${sanitizeTexString(scoreSettings.words)}"`);
  if (scoreSettings?.music)
    lines.push(`\\music "${sanitizeTexString(scoreSettings.music)}"`);
  if (scoreSettings?.copyright)
    lines.push(`\\copyright "${sanitizeTexString(scoreSettings.copyright)}"`);
  lines.push(`\\tempo ${tempo}`);

  for (const track of tracks) {
    const midiProgram = instrumentToMidiProgram(track.instrument);
    if (midiProgram < 0) {
      lines.push(
        `\\track "${sanitizeTexString(track.name)}" { instrument percussion }`,
      );
    } else {
      lines.push(
        `\\track "${sanitizeTexString(track.name)}" { instrument ${midiProgram} }`,
      );
    }
    lines.push(`\\tuning (${track.tuning.join(" ")})`);
    if (track.capo > 0) lines.push(`\\capo ${track.capo}`);

    const ks = scoreSettings?.keySignature ?? "C";
    if (ks !== "C") lines.push(`\\ks ${ks}`);
    lines.push(`\\ts (${timeSignatureNumerator} 4)`);

    // Index notes for O(1) lookup
    const noteIndex = new Map<number, StudioNote[]>();
    for (const n of track.notes) {
      const key = n.measure * 10000 + n.beat;
      let arr = noteIndex.get(key);
      if (!arr) {
        arr = [];
        noteIndex.set(key, arr);
      }
      arr.push(n);
    }

    const bars: string[] = [];
    for (let measure = 0; measure < measureCount; measure += 1) {
      const beats: string[] = [];
      for (let beat = 0; beat < beatsPerMeasure; beat += 1) {
        const beatNotes = noteIndex.get(measure * 10000 + beat);
        if (!beatNotes || beatNotes.length === 0) {
          beats.push(`r.${restDuration}`);
          continue;
        }
        if (beatNotes.length === 1) {
          beats.push(noteToAlphaTexToken(beatNotes[0]));
          continue;
        }
        beatNotes.sort((a, b) => a.string - b.string);
        const chord = beatNotes
          .map((n) => {
            const f = n.isDead ? "x" : String(n.fret);
            return `${f}.${n.string + 1}${buildNoteLevelToken(n)}`;
          })
          .join(" ");
        const first = beatNotes[0];
        beats.push(`(${chord}).${first.duration}${buildBeatLevelToken(first)}`);
      }
      bars.push(beats.join(" "));
    }
    lines.push(bars.join(" | "));
  }

  return lines.join("\n");
}

/** Shared extended-field defaults for new StudioNote fields */
export const NOTE_DEFAULTS = {
  isTied: false,
  isGhost: false,
  isLeftHandTap: false,
  accent: "none" as const,
  harmonicType: "none" as const,
  trillFret: 0,
  trillSpeed: 16 as 16 | 32 | 64,
  ornament: "none" as const,
  pickSlide: "none" as const,
  strokeType: "none" as const,
  arpeggioType: "none" as const,
  wahMode: "none" as const,
  tuplet: "none" as const,
  tremoloMark: "none" as const,
  graceType: "none" as const,
  fermata: "none" as const,
  octaveShift: "none" as const,
  chordName: "",
  beatText: "",
} satisfies Partial<StudioNote>;

export function createInitialNotes(): StudioNote[] {
  return [
    {
      id: "n-1",
      measure: 0,
      beat: 0,
      string: 5,
      fret: 0,
      duration: 4 as NoteDuration,
      dynamic: "mf",
      beatEffect: "none",
      noteEffect: "none",
      vibrato: "none",
      slideIn: "none",
      slideOut: "none",
      isBend: false,
      isLetRing: false,
      isPalmMute: false,
      isDead: false,
      isStaccato: false,
      ...NOTE_DEFAULTS,
    },
    {
      id: "n-2",
      measure: 0,
      beat: 1,
      string: 4,
      fret: 2,
      duration: 4 as NoteDuration,
      dynamic: "mf",
      beatEffect: "none",
      noteEffect: "none",
      vibrato: "none",
      slideIn: "none",
      slideOut: "none",
      isBend: false,
      isLetRing: false,
      isPalmMute: false,
      isDead: false,
      isStaccato: false,
      ...NOTE_DEFAULTS,
    },
    {
      id: "n-3",
      measure: 0,
      beat: 2,
      string: 3,
      fret: 2,
      duration: 4 as NoteDuration,
      dynamic: "mf",
      beatEffect: "none",
      noteEffect: "none",
      vibrato: "none",
      slideIn: "none",
      slideOut: "none",
      isBend: false,
      isLetRing: false,
      isPalmMute: false,
      isDead: false,
      isStaccato: false,
      ...NOTE_DEFAULTS,
    },
    {
      id: "n-4",
      measure: 0,
      beat: 3,
      string: 2,
      fret: 1,
      duration: 4 as NoteDuration,
      dynamic: "mf",
      beatEffect: "none",
      noteEffect: "none",
      vibrato: "none",
      slideIn: "none",
      slideOut: "none",
      isBend: false,
      isLetRing: false,
      isPalmMute: false,
      isDead: false,
      isStaccato: false,
      ...NOTE_DEFAULTS,
    },
  ];
}

const DYNAMIC_GAIN_MAP: Record<DynamicMark, number> = {
  ppp: 0.25,
  pp: 0.4,
  p: 0.55,
  mp: 0.7,
  mf: 0.85,
  f: 1,
  ff: 1.15,
  fff: 1.3,
};

export function dynamicToGain(dynamic: DynamicMark) {
  return DYNAMIC_GAIN_MAP[dynamic] ?? 0.85;
}

const ALLOWED_DURATIONS: NoteDuration[] = [1, 2, 4, 8, 16];

function toStudioDuration(value: number): NoteDuration {
  if (ALLOWED_DURATIONS.includes(value as NoteDuration)) {
    return value as NoteDuration;
  }

  if (value <= 1) return 1;
  if (value <= 2) return 2;
  if (value <= 4) return 4;
  if (value <= 8) return 8;
  return 16;
}

function toStudioDynamic(value: number): DynamicMark {
  if (value <= 1) return "pp";
  if (value === 2) return "p";
  if (value === 3) return "mp";
  if (value === 4) return "mf";
  if (value === 5) return "f";
  return "ff";
}

function toStudioBeatEffect(beat: any): BeatEffect {
  if (beat?.fade === 1) return "f";
  if (beat?.fade === 2) return "fo";
  if (beat?.fade === 3) return "vs";
  if (beat?.vibrato === 1) return "v";
  if (beat?.vibrato === 2) return "vw";
  if (beat?.pickStroke === 1) return "su";
  if (beat?.pickStroke === 2) return "sd";
  if (beat?.dots >= 2) return "dd";
  if (beat?.dots === 1) return "d";
  return "none";
}

function toStudioNoteEffect(note: any): NoteEffect {
  if (note?.isHammerPullOrigin || note?.isHammerPullDestination) return "h";
  if (note?.isTrill) return "tr";
  return "none";
}

function toStudioHarmonicType(note: any): HarmonicType {
  const ht = Number(note?.harmonicType ?? 0);
  if (ht === 1) return "nh";
  if (ht === 2) return "ah";
  if (ht === 3) return "ph";
  if (ht === 4) return "th";
  if (ht === 5) return "sh";
  if (ht === 6) return "fh";
  return "none";
}

function toStudioAccent(note: any): AccentMark {
  const a = Number(note?.accentuationType ?? 0);
  if (a === 1) return "ac";
  if (a === 2) return "hac";
  if (a === 3) return "ten";
  return "none";
}

function toStudioPickSlide(note: any): PickSlideMark {
  const sot = Number(note?.slideOutType ?? 0);
  if (sot === 5) return "up";
  if (sot === 6) return "down";
  return "none";
}

function toStudioVibrato(note: any): NoteVibrato {
  if (note?.vibrato === 1) return "slight";
  if (note?.vibrato === 2) return "wide";
  return "none";
}

function toStudioSlideIn(note: any): SlideInMark {
  if (note?.slideInType === 1) return "below";
  if (note?.slideInType === 2) return "above";
  return "none";
}

function toStudioSlideOut(note: any): SlideOutMark {
  const sot = Number(note?.slideOutType ?? 0);
  if (sot === 1) return "shift";
  if (sot === 2) return "legato";
  if (sot === 3) return "up";
  if (sot === 4) return "down";
  return "none";
}

export type ImportToStudioResult = {
  title: string;
  tempo: number;
  measureCount: number;
  timeSignatureNumerator: number;
  gridStepsPerMeasure: number;
  tuning: readonly string[];
  notes: StudioNote[];
  warnings: string[];
  scoreSettings: ScoreSettings;
};

const KS_FROM_ALPHATAB: Partial<Record<number, ScoreSettings["keySignature"]>> =
  {
    [-7]: "Cb",
    [-6]: "Gb",
    [-5]: "Db",
    [-4]: "Ab",
    [-3]: "Eb",
    [-2]: "Bb",
    [-1]: "F",
    [0]: "C",
    [1]: "G",
    [2]: "D",
    [3]: "A",
    [4]: "E",
    [5]: "B",
    [6]: "F#",
    [7]: "C#",
  };

/**
 * Map MIDI program number → display name (AlphaTex-compatible).
 * Names match the AlphaTex instrument parameter values table exactly.
 */
function midiProgramToInstrument(program: number): string {
  const map: Record<number, string> = {
    0: "Acoustic Grand Piano",
    1: "Bright Grand Piano",
    2: "Electric Grand Piano",
    3: "Honky tonk Piano",
    4: "Electric Piano 1",
    5: "Electric Piano 2",
    6: "Harpsichord",
    7: "Clavinet",
    8: "Celesta",
    9: "Glockenspiel",
    10: "Musicbox",
    11: "Vibraphone",
    12: "Marimba",
    13: "Xylophone",
    14: "Tubularbells",
    15: "Dulcimer",
    16: "Drawbar Organ",
    17: "Percussive Organ",
    18: "Rock Organ",
    19: "Church Organ",
    20: "Reed Organ",
    21: "Accordion",
    22: "Harmonica",
    23: "Tango Accordion",
    24: "Acoustic Guitar Nylon",
    25: "Acoustic Guitar Steel",
    26: "Electric Guitar Jazz",
    27: "Electric Guitar Clean",
    28: "Electric Guitar Muted",
    29: "Overdriven Guitar",
    30: "Distortion Guitar",
    31: "Guitar Harmonics",
    32: "Acoustic Bass",
    33: "Electric Bass Finger",
    34: "Electric Bass Pick",
    35: "Fretless Bass",
    36: "Slap Bass 1",
    37: "Slap Bass 2",
    38: "Synth Bass 1",
    39: "Synth Bass 2",
    40: "Violin",
    41: "Viola",
    42: "Cello",
    43: "Contrabass",
    44: "Tremolo Strings",
    45: "Pizzicato Strings",
    46: "Orchestral Harp",
    47: "Timpani",
    48: "String Ensemble 1",
    49: "String Ensemble 2",
    50: "Synth Strings 1",
    51: "Synth Strings 2",
    52: "Choir Aahs",
    53: "Voice Oohs",
    54: "Synth Voice",
    55: "Orchestra Hit",
    56: "Trumpet",
    57: "Trombone",
    58: "Tuba",
    59: "Muted Trumpet",
    60: "French Horn",
    61: "Brass Section",
    62: "Synth Brass 1",
    63: "Synth Brass 2",
    64: "Soprano Sax",
    65: "Alto Sax",
    66: "Tenor Sax",
    67: "Baritone Sax",
    68: "Oboe",
    69: "English Horn",
    70: "Bassoon",
    71: "Clarinet",
    72: "Piccolo",
    73: "Flute",
    74: "Recorder",
    75: "Pan Flute",
    76: "Blown bottle",
    77: "Shakuhachi",
    78: "Whistle",
    79: "Ocarina",
    80: "Lead 1 Square",
    81: "Lead 2 Sawtooth",
    82: "Lead 3 Calliope",
    83: "Lead 4 Chiff",
    84: "Lead 5 Charang",
    85: "Lead 6 Voice",
    86: "Lead 7 Fifths",
    87: "Lead 8 Bass and Lead",
  };
  return map[program] ?? "Acoustic Guitar Steel";
}

/**
 * Comprehensive instrument display-name → MIDI program mapping.
 * Includes both current AlphaTex names and legacy names from older
 * saved projects so they keep working after the naming fix.
 */
const INSTRUMENT_TO_MIDI: Record<string, number> = {
  // ── Exact AlphaTex names ──────────────────────────
  "Acoustic Grand Piano": 0,
  "Bright Grand Piano": 1,
  "Electric Grand Piano": 2,
  "Honky tonk Piano": 3,
  "Electric Piano 1": 4,
  "Electric Piano 2": 5,
  Harpsichord: 6,
  Clavinet: 7,
  Celesta: 8,
  Glockenspiel: 9,
  Musicbox: 10,
  Vibraphone: 11,
  Marimba: 12,
  Xylophone: 13,
  Tubularbells: 14,
  Dulcimer: 15,
  "Drawbar Organ": 16,
  "Percussive Organ": 17,
  "Rock Organ": 18,
  "Church Organ": 19,
  "Reed Organ": 20,
  Accordion: 21,
  Harmonica: 22,
  "Tango Accordion": 23,
  "Acoustic Guitar Nylon": 24,
  "Acoustic Guitar Steel": 25,
  "Electric Guitar Jazz": 26,
  "Electric Guitar Clean": 27,
  "Electric Guitar Muted": 28,
  "Overdriven Guitar": 29,
  "Distortion Guitar": 30,
  "Guitar Harmonics": 31,
  "Acoustic Bass": 32,
  "Electric Bass Finger": 33,
  "Electric Bass Pick": 34,
  "Fretless Bass": 35,
  "Slap Bass 1": 36,
  "Slap Bass 2": 37,
  "Synth Bass 1": 38,
  "Synth Bass 2": 39,
  Violin: 40,
  Viola: 41,
  Cello: 42,
  Contrabass: 43,
  "Tremolo Strings": 44,
  "Pizzicato Strings": 45,
  "Orchestral Harp": 46,
  Timpani: 47,
  "String Ensemble 1": 48,
  "String Ensemble 2": 49,
  "Synth Strings 1": 50,
  "Synth Strings 2": 51,
  "Choir Aahs": 52,
  "Voice Oohs": 53,
  "Synth Voice": 54,
  "Orchestra Hit": 55,
  Trumpet: 56,
  Trombone: 57,
  Tuba: 58,
  "Muted Trumpet": 59,
  "French Horn": 60,
  "Brass Section": 61,
  "Synth Brass 1": 62,
  "Synth Brass 2": 63,
  "Soprano Sax": 64,
  "Alto Sax": 65,
  "Tenor Sax": 66,
  "Baritone Sax": 67,
  Oboe: 68,
  "English Horn": 69,
  Bassoon: 70,
  Clarinet: 71,
  Piccolo: 72,
  Flute: 73,
  Recorder: 74,
  "Pan Flute": 75,
  "Blown bottle": 76,
  Shakuhachi: 77,
  Whistle: 78,
  Ocarina: 79,
  "Lead 1 Square": 80,
  "Lead 2 Sawtooth": 81,
  "Lead 3 Calliope": 82,
  "Lead 4 Chiff": 83,
  "Lead 5 Charang": 84,
  "Lead 6 Voice": 85,
  "Lead 7 Fifths": 86,
  "Lead 8 Bass and Lead": 87,
  // ── Legacy names (backward-compat with older saved projects) ──
  "Acoustic Guitar (steel)": 25,
  "Acoustic Guitar (nylon)": 24,
  "Jazz Guitar": 26,
  "Clean Guitar": 27,
  "Electric Guitar (muted)": 28,
  Harmonics: 31,
  "Electric Bass (finger)": 33,
  "Electric Bass (pick)": 34,
  "Electric Bass (fretless)": 35,
  "Honky-tonk Piano": 3,
  "Organ 1": 16,
  Clavi: 7,
  "Lead 1 (square)": 80,
  "Lead 2 (sawtooth)": 81,
  "Lead Guitar": 84,
  "12-string Guitar": 25,
  Drums: -1,
  "Drum Kit": -1,
  Saxophone: 65,
  "Bright Acoustic Piano": 1,
  "Tubular Bells": 14,
  "Music Box": 10,
};

/**
 * Resolve an instrument display name to its MIDI program number.
 * Falls back to 25 (Acoustic Guitar Steel) for unknown names.
 */
function instrumentToMidiProgram(name: string): number {
  const direct = INSTRUMENT_TO_MIDI[name];
  if (direct !== undefined) return direct;

  // Case-insensitive fallback
  const lower = name.toLowerCase();
  for (const [key, value] of Object.entries(INSTRUMENT_TO_MIDI)) {
    if (key.toLowerCase() === lower) return value;
  }

  return 25; // Default: Acoustic Guitar Steel
}

export function importScoreToStudio(
  score: unknown,
  trackIndex?: number,
): ImportToStudioResult {
  const model = score as any;
  const warnings: string[] = [];

  const tracks: any[] = Array.isArray(model?.tracks) ? model.tracks : [];
  const safeTrackIndex =
    typeof trackIndex === "number" &&
    Number.isFinite(trackIndex) &&
    trackIndex >= 0 &&
    trackIndex < tracks.length
      ? Math.floor(trackIndex)
      : undefined;

  const track =
    (safeTrackIndex !== undefined ? tracks[safeTrackIndex] : undefined) ??
    tracks.find(
      (item) => Array.isArray(item?.staves) && item.staves.length > 0,
    ) ??
    tracks[0];
  const staff = Array.isArray(track?.staves) ? track.staves[0] : undefined;

  const tuningValues: number[] = Array.isArray(staff?.tuning)
    ? staff.tuning
    : [];
  // alphaTab staff.tuning is HIGH-to-LOW (index 0 = top TAB line = highest/thinnest)
  // This matches our STRING_TUNING format — no reversal needed
  const tuning =
    tuningValues.length > 0
      ? tuningValues.map((midi: number) => midiToScientific(Number(midi)))
      : [...STRING_TUNING];

  const masterBars: any[] = Array.isArray(model?.masterBars)
    ? model.masterBars
    : [];
  const firstMasterBar = masterBars[0];

  const numerator = Number(firstMasterBar?.timeSignatureNumerator ?? 4);
  const denominator = Number(firstMasterBar?.timeSignatureDenominator ?? 4);
  if (denominator !== 4) {
    warnings.push(
      `Time signature denominator ${denominator} disederhanakan ke /4`,
    );
  }

  const timeSignatureNumerator = Math.max(
    1,
    Math.min(16, Number.isFinite(numerator) ? numerator : 4),
  );
  const bars: any[] = Array.isArray(staff?.bars) ? staff.bars : [];

  const cellMap = new Map<string, StudioNote>();

  // ── Determine grid resolution via collision testing ──
  // Try each standard grid (quarter → eighth → sixteenth).
  // Pick the SMALLEST grid where <5% of notes collide (same cell+string).
  // This correctly handles multi-voice interleaving (Canon: 2 voices of
  // quarter notes offset by half-beat → grid=4 has 50% collisions, grid=8 has 0%).
  const TICKS_PER_QUARTER = 960;
  const barTicks = timeSignatureNumerator * TICKS_PER_QUARTER;

  const standardMultipliers = [1, 2, 4]; // quarter, eighth, sixteenth
  // Per-level collision thresholds: coarser grids need stricter fit,
  // finer grids can tolerate more quantization because the piece is
  // fundamentally at a coarser rhythm with occasional ornamental bars.
  const collisionThresholds = [0.1, 0.4, 1.0]; // quarter ≤10%, eighth ≤40%, sixteenth always
  let gridStepsPerMeasure = timeSignatureNumerator * 4; // fallback: sixteenth
  for (const mult of standardMultipliers) {
    const grid = timeSignatureNumerator * mult;
    const ct = barTicks / grid;

    // Check how many bars have temporal collisions at this grid resolution.
    // A collision = two distinct playbackStart values mapping to the same cell.
    // Allow up to 10% of bars to collide (outlier ornamental bars).
    let barsWithCollision = 0;
    let barsChecked = 0;
    bars.forEach((bar: any) => {
      const positionsInBar = new Set<number>();
      const voices: any[] = Array.isArray(bar?.voices) ? bar.voices : [];
      voices.forEach((voice: any) => {
        const beats: any[] = Array.isArray(voice?.beats) ? voice.beats : [];
        beats.forEach((beat: any) => {
          if (beat?.isRest) return;
          if (beat?.graceType && Number(beat.graceType) !== 0) return;
          const beatNotes: any[] = Array.isArray(beat?.notes) ? beat.notes : [];
          if (beatNotes.length === 0) return;

          const ps = Number(beat?.playbackStart);
          if (Number.isFinite(ps) && ps >= 0) {
            positionsInBar.add(ps);
          }
        });
      });

      if (positionsInBar.size === 0) return;
      barsChecked++;

      const cellSet = new Set<number>();
      for (const ps of positionsInBar) {
        const cell = Math.min(grid - 1, Math.max(0, Math.round(ps / ct)));
        cellSet.add(cell);
      }
      if (cellSet.size < positionsInBar.size) {
        barsWithCollision++;
      }
    });

    const collisionRate = barsChecked > 0 ? barsWithCollision / barsChecked : 0;
    const idx = standardMultipliers.indexOf(mult);
    const threshold = collisionThresholds[idx] ?? 1.0;
    if (collisionRate <= threshold) {
      gridStepsPerMeasure = grid;
      break;
    }
  }

  const cellTicks = barTicks / gridStepsPerMeasure;
  const cellDuration = toStudioDuration(Math.round(3840 / cellTicks));

  // ── Map GP beats to grid cells ──
  bars.forEach((bar, measure) => {
    const voices: any[] = Array.isArray(bar?.voices) ? bar.voices : [];
    voices.forEach((voice) => {
      const beats: any[] = Array.isArray(voice?.beats) ? voice.beats : [];
      beats.forEach((beat, beatOrder) => {
        const beatNotes: any[] = Array.isArray(beat?.notes) ? beat.notes : [];
        if (beatNotes.length === 0 || beat?.isRest) return;
        // Skip grace notes — they don't occupy a real grid cell
        if (beat?.graceType && Number(beat.graceType) !== 0) return;

        // Compute grid cell from bar-relative playbackStart
        let beatIndex: number;
        const pbStart = Number(beat?.playbackStart);
        if (Number.isFinite(pbStart) && pbStart >= 0) {
          // Use round for best-fit quantization (handles dotted note positions)
          beatIndex = Math.min(
            gridStepsPerMeasure - 1,
            Math.max(0, Math.round(pbStart / cellTicks)),
          );
        } else {
          // Fallback: sequential index
          const rawIdx = Number.isFinite(beat?.index)
            ? Number(beat.index)
            : beatOrder;
          beatIndex = Math.min(gridStepsPerMeasure - 1, Math.max(0, rawIdx));
        }

        const dynamic = toStudioDynamic(Number(beat?.dynamics ?? 4));
        const beatEffect = toStudioBeatEffect(beat);

        beatNotes.forEach((note) => {
          const importedString = Number(note?.string);
          const fret = Number(note?.fret);
          if (!Number.isFinite(importedString) || !Number.isFinite(fret)) {
            return;
          }

          // alphaTab note.string is 1-based where 1 = lowest/thickest string
          // Our index is 0-based where 0 = highest/thinnest (HIGH-to-LOW)
          const stringIndex = tuning.length - importedString;
          if (stringIndex < 0 || stringIndex >= tuning.length) return;

          const key = `${measure}:${beatIndex}:${stringIndex}`;
          if (cellMap.has(key)) return;

          const studioNote: StudioNote = {
            id: `n-import-${measure}-${beatIndex}-${stringIndex}`,
            measure,
            beat: beatIndex,
            string: stringIndex,
            fret: Math.max(0, Math.min(24, fret)),
            duration: cellDuration,
            dynamic,
            beatEffect,
            noteEffect: toStudioNoteEffect(note),
            vibrato: toStudioVibrato(note),
            slideIn: toStudioSlideIn(note),
            slideOut: toStudioSlideOut(note),
            isBend: Boolean(note?.hasBend || (note?.bendType ?? 0) > 0),
            isLetRing: Boolean(note?.isLetRing),
            isPalmMute: Boolean(note?.isPalmMute),
            isDead: Boolean(note?.isDead),
            isStaccato: Boolean(note?.isStaccato),
            isTied: Boolean(note?.isTieDestination),
            isGhost: Boolean(note?.isGhost),
            isLeftHandTap: Boolean(note?.isLeftHandTapped),
            accent: toStudioAccent(note),
            harmonicType: toStudioHarmonicType(note),
            trillFret: Number.isFinite(note?.trillValue)
              ? Number(note.trillValue)
              : 0,
            trillSpeed: 16,
            ornament: "none",
            pickSlide: toStudioPickSlide(note),
            strokeType: "none",
            arpeggioType: "none",
            wahMode: "none",
            tuplet: "none",
            tremoloMark: "none",
            graceType: "none",
            fermata: "none",
            octaveShift: "none",
            chordName: "",
            beatText: "",
          };

          cellMap.set(key, studioNote);
        });
      });
    });
  });

  const notes = Array.from(cellMap.values()).sort((a, b) => {
    if (a.measure !== b.measure) return a.measure - b.measure;
    if (a.beat !== b.beat) return a.beat - b.beat;
    return a.string - b.string;
  });

  const maxMeasureFromNotes =
    notes.length > 0 ? Math.max(...notes.map((note) => note.measure)) + 1 : 1;

  const measureCount = Math.max(
    1,
    Array.isArray(masterBars) && masterBars.length > 0
      ? masterBars.length
      : bars.length > 0
        ? bars.length
        : maxMeasureFromNotes,
  );

  const title =
    typeof model?.title === "string" && model.title.trim().length > 0
      ? model.title
      : "Imported GP";

  const tempo = Math.max(
    30,
    Math.min(260, Number.isFinite(model?.tempo) ? Number(model.tempo) : 96),
  );

  // ── Extract score & track metadata ──────────────────
  const ksRaw = Number(masterBars[0]?.keySignature ?? 0);
  const keySignature: ScoreSettings["keySignature"] =
    KS_FROM_ALPHATAB[ksRaw] ?? "C";

  const capoRaw = Number(staff?.capo ?? 0);
  const capo =
    Number.isFinite(capoRaw) && capoRaw > 0 ? Math.min(12, capoRaw) : 0;

  const midiProgram = Number(track?.playbackInfo?.program ?? 25);
  const instrument = midiProgramToInstrument(
    Number.isFinite(midiProgram) ? midiProgram : 25,
  );

  const trackName =
    typeof track?.name === "string" && track.name.trim().length > 0
      ? track.name.trim()
      : "Guitar";

  const scoreSettings: ScoreSettings = {
    subtitle: typeof model?.subTitle === "string" ? model.subTitle.trim() : "",
    artist: typeof model?.artist === "string" ? model.artist.trim() : "",
    album: typeof model?.album === "string" ? model.album.trim() : "",
    words: typeof model?.words === "string" ? model.words.trim() : "",
    music: typeof model?.music === "string" ? model.music.trim() : "",
    copyright:
      typeof model?.copyright === "string" ? model.copyright.trim() : "",
    trackName,
    instrument,
    capo,
    keySignature,
  };

  return {
    title,
    tempo,
    measureCount,
    timeSignatureNumerator,
    gridStepsPerMeasure,
    tuning,
    notes,
    warnings,
    scoreSettings,
  };
}

// ════════════════════════════════════════════════════════
// importAllTracksToStudio — parse ALL tracks from a GP score
// ════════════════════════════════════════════════════════

export type ImportAllTracksResult = {
  title: string;
  tempo: number;
  measureCount: number;
  timeSignatureNumerator: number;
  gridStepsPerMeasure: number;
  /** Tracks mapped to StudioTrack format (with colors & notes) */
  tracks: StudioTrack[];
  /** Warnings aggregated from all track imports */
  warnings: string[];
  /** Score-level settings (from the first track, without track-specific overrides) */
  scoreSettings: ScoreSettings;
};

/**
 * Imports **all** tracks from a parsed GP score (alphaTab model) and returns
 * them as `StudioTrack[]`. Each track gets its own color, instrument, tuning,
 * capo, and notes. Score-level metadata (title, tempo, time signature) is
 * derived from the first track import.
 */
export function importAllTracksToStudio(score: unknown): ImportAllTracksResult {
  const model = score as any;
  const rawTracks: any[] = Array.isArray(model?.tracks) ? model.tracks : [];
  const trackCount = Math.max(1, rawTracks.length);

  const studioTracks: StudioTrack[] = [];
  const allWarnings: string[] = [];
  let scoreMeta: ImportToStudioResult | null = null;

  for (let i = 0; i < trackCount; i++) {
    const imported = importScoreToStudio(score, i);

    // Use the first track's import as the canonical score-level metadata
    if (i === 0) scoreMeta = imported;

    // Collect warnings (prefixed with track index for clarity)
    for (const w of imported.warnings) {
      allWarnings.push(`Track ${i + 1}: ${w}`);
    }

    const track: StudioTrack = {
      id: `track-${crypto.randomUUID()}`,
      name: imported.scoreSettings.trackName || `Track ${i + 1}`,
      instrument: imported.scoreSettings.instrument,
      tuning: imported.tuning,
      capo: imported.scoreSettings.capo,
      volume: 0.8,
      isMuted: false,
      isSolo: false,
      color: TRACK_COLORS[i % TRACK_COLORS.length],
      notes: imported.notes,
    };

    studioTracks.push(track);
  }

  // If the score had zero parseable tracks, return a single empty track
  if (studioTracks.length === 0) {
    const fallback = importScoreToStudio(score, 0);
    scoreMeta = fallback;
    studioTracks.push({
      id: `track-${crypto.randomUUID()}`,
      name: "Guitar",
      instrument: "Acoustic Guitar Steel",
      tuning: [...STRING_TUNING],
      capo: 0,
      volume: 0.8,
      isMuted: false,
      isSolo: false,
      color: TRACK_COLORS[0],
      notes: fallback.notes,
    });
  }

  const meta = scoreMeta!;
  return {
    title: meta.title,
    tempo: meta.tempo,
    measureCount: meta.measureCount,
    timeSignatureNumerator: meta.timeSignatureNumerator,
    gridStepsPerMeasure: meta.gridStepsPerMeasure,
    tracks: studioTracks,
    warnings: allWarnings,
    scoreSettings: meta.scoreSettings,
  };
}
