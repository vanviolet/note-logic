// ====================================
// Types
// ====================================
import type { ScaleType, CadentialStrength, TriadQuality } from "./core";

// Re-export core types for backward compatibility
export type { ScaleType, CadentialStrength, TriadQuality };

export interface RoleInfo {
  name: string;
  description: string;
  family: "Tonic" | "Subdominant" | "Dominant";
  functionHints: string[];
  cadentialStrength: CadentialStrength;
  commonResolutions: string[];
}

export interface ComposedTone {
  degree: "1" | "b3" | "3" | "4" | "b5" | "5";
  note: string;
  semitonesFromRoot: number;
  intervalClass: number;
  role: "root" | "chord-tone";
}

export interface ScaleChord {
  name: string; // e.g., C, Dm, Edim
  quality: TriadQuality;
  symbol: string;
  formula: ComposedTone["degree"][];
  semitonePattern: number[];
  relatedSeventh: string;
  composed: ComposedTone[];
}

export interface FamilyChordEntry {
  degree: string; // I, ii, etc.
  scaleType: ScaleType;
  modeSource: "Ionian" | "Aeolian";
  role: RoleInfo["name"];
  description: RoleInfo["description"];
  family: RoleInfo["family"];
  functionHints: RoleInfo["functionHints"];
  cadentialStrength: RoleInfo["cadentialStrength"];
  commonResolutions: RoleInfo["commonResolutions"];
  progressionUse: string[];
  borrowedAlternatives: string[];
  chord: ScaleChord;
}

// ====================================
// Master Roles (Scale Degrees)
// ====================================
const chordRoles: Record<string, RoleInfo> = {
  I: {
    name: "Tonic",
    description:
      "Pusat tonalitas mayor yang paling stabil dan menjadi titik pulang utama pada progresi.",
    family: "Tonic",
    functionHints: [
      "Digunakan sebagai titik mulai dan akhir frase.",
      "Menjadi target resolusi dari dominant atau leading-tone chord.",
    ],
    cadentialStrength: "very-weak",
    commonResolutions: ["I → IV", "I → vi", "V → I"],
  },
  ii: {
    name: "Supertonic",
    description:
      "Chord minor predominant yang kuat sebagai penghubung ke area dominant, terutama dalam pola ii–V–I.",
    family: "Subdominant",
    functionHints: [
      "Mendorong gerak harmonik menuju V.",
      "Sangat umum sebagai pembuka cadence jazz/pop modern.",
    ],
    cadentialStrength: "medium",
    commonResolutions: ["ii → V", "ii → vii°", "ii → IV"],
  },
  iii: {
    name: "Mediant",
    description:
      "Chord minor yang berbagi dua nada dengan I sehingga dapat berfungsi sebagai tonic substitute dengan warna lebih lembut.",
    family: "Tonic",
    functionHints: [
      "Alternatif subtle untuk tonic.",
      "Sering dipakai untuk memperkaya progression tanpa cadential push keras.",
    ],
    cadentialStrength: "weak",
    commonResolutions: ["iii → vi", "iii → IV", "iii → ii"],
  },
  IV: {
    name: "Subdominant",
    description:
      "Chord mayor predominant yang memperluas harmoni dari tonic menuju dominant dengan rasa naik energi.",
    family: "Subdominant",
    functionHints: [
      "Menjadi jembatan klasik sebelum dominant.",
      "Pada plagal cadence dapat langsung menuju I (IV–I).",
    ],
    cadentialStrength: "medium",
    commonResolutions: ["IV → V", "IV → I", "IV → ii"],
  },
  V: {
    name: "Dominant",
    description:
      "Pusat tegangan utama dalam tonalitas mayor; memiliki dorongan resolusi kuat kembali ke I.",
    family: "Dominant",
    functionHints: [
      "Mesin cadential paling kuat (authentic cadence).",
      "Saat ditambah 7, tekanan resolusinya meningkat signifikan.",
    ],
    cadentialStrength: "very-strong",
    commonResolutions: [
      "V → I",
      "V → vi (deceptive)",
      "V → IV (retro/rock move)",
    ],
  },
  vi: {
    name: "Submediant",
    description:
      "Chord minor relatif dari I, sering menjadi tonic substitute dan memberi warna emosional lebih dalam.",
    family: "Tonic",
    functionHints: [
      "Alternatif tonic pada pop progression.",
      "Bisa menjadi titik deceptive resolution dari V.",
    ],
    cadentialStrength: "weak",
    commonResolutions: ["vi → ii", "vi → IV", "V → vi"],
  },
  "vii°": {
    name: "Leading Tone / Subtonic",
    description:
      "Chord diminished berbasis leading tone yang sangat tidak stabil dan kuat mengarah ke tonic.",
    family: "Dominant",
    functionHints: [
      "Berfungsi dominant substitute dengan karakter lebih tajam.",
      "Efektif untuk passing harmony dan approach ke I/iii.",
    ],
    cadentialStrength: "strong",
    commonResolutions: ["vii° → I", "vii° → iii", "vii° → vi"],
  },
};

const chordRolesMinor: Record<string, RoleInfo> = {
  i: {
    name: "Tonic",
    description:
      "Pusat tonalitas minor yang stabil, menjadi titik pulang utama dengan nuansa gelap/melankolis.",
    family: "Tonic",
    functionHints: [
      "Target resolusi utama di mode minor.",
      "Bisa diberi warna mMaj7 atau m6 tergantung konteks.",
    ],
    cadentialStrength: "very-weak",
    commonResolutions: ["i → iv", "i → VI", "V → i"],
  },
  "ii°": {
    name: "Supertonic diminished",
    description:
      "Predominant diminished yang menyiapkan gerak ke dominant atau chord fungsi transisi lain di minor key.",
    family: "Subdominant",
    functionHints: [
      "Menciptakan tegangan persiapan sebelum dominant.",
      "Sering muncul sebagai iiø pada harmoni minor 7th.",
    ],
    cadentialStrength: "medium",
    commonResolutions: ["ii° → V", "ii° → i64 → V", "ii° → III"],
  },
  III: {
    name: "Mediant",
    description:
      "Chord mayor relatif yang memberi kontras cerah dalam lingkungan minor.",
    family: "Tonic",
    functionHints: [
      "Berfungsi sebagai area istirahat alternatif.",
      "Sering dipakai untuk modulasi relatif mayor.",
    ],
    cadentialStrength: "weak",
    commonResolutions: ["III → VI", "III → iv", "III → VII"],
  },
  iv: {
    name: "Subdominant",
    description:
      "Predominant minor klasik yang menyiapkan momentum ke dominant dalam tonalitas minor.",
    family: "Subdominant",
    functionHints: [
      "Bagus untuk build-up sebelum cadence.",
      "Dapat dikombinasikan dengan ii° untuk predominant chain.",
    ],
    cadentialStrength: "medium",
    commonResolutions: ["iv → V", "iv → i", "iv → VII"],
  },
  v: {
    name: "Dominant",
    description:
      "Dominant natural-minor yang lebih lembut; dalam praktik tonal sering dinaikkan jadi V mayor agar resolusi ke i lebih kuat.",
    family: "Dominant",
    functionHints: [
      "Memberi dorongan ke i namun lebih lemah dari V mayor.",
      "Bisa menjadi warna modal (Aeolian) yang lembut.",
    ],
    cadentialStrength: "strong",
    commonResolutions: ["v → i", "v → VI", "v → iv"],
  },
  VI: {
    name: "Submediant",
    description:
      "Chord mayor pada derajat VI (interval b6 dari root), sering menjadi resting point alternatif dalam minor progression modern. Di D minor ini adalah Bb (enharmonic dari A#), kualitasnya tetap mayor.",
    family: "Tonic",
    functionHints: [
      "Warna kontras yang tetap stabil.",
      "Sering dipakai dalam progression cinematic minor.",
    ],
    cadentialStrength: "weak",
    commonResolutions: ["VI → VII", "VI → iv", "VI → ii°"],
  },
  VII: {
    name: "Subtonic",
    description:
      "Chord mayor subtonic yang umum pada Aeolian/modal, memberi gerak turun menuju III atau balik ke i.",
    family: "Dominant",
    functionHints: [
      "Dominant-like dalam konteks modal tanpa leading tone.",
      "Sering dipakai pada rock cadence (VII–i).",
    ],
    cadentialStrength: "medium",
    commonResolutions: ["VII → i", "VII → III", "VII → VI"],
  },
};

// ====================================
// Helper: build chord tones
// ====================================
import { pickName, rootToPc, type SpellMode } from "./core";

const MINOR_FLAT_KEYS = new Set(["D", "G", "C", "F", "Bb", "Eb", "Ab"]);

const MINOR_SHARP_KEYS = new Set(["E", "B", "F#", "C#", "G#", "D#", "A#"]);

// formula chord untuk mayor & minor scale
const scaleFormulas: Record<ScaleType, number[]> = {
  major: [2, 2, 1, 2, 2, 2, 1], // Ionian
  minor: [2, 1, 2, 2, 1, 2, 2], // Aeolian
};

// chord qualities untuk mayor scale
const chordQualitiesMajor = [
  "maj",
  "min",
  "min",
  "maj",
  "maj",
  "min",
  "dim",
] as const;
const chordQualitiesMinor = [
  "min",
  "dim",
  "maj",
  "min",
  "min",
  "maj",
  "maj",
] as const;

// degree list
const degreesMajor = ["I", "ii", "iii", "IV", "V", "vi", "vii°"] as const;
const degreesMinor = ["i", "ii°", "III", "iv", "v", "VI", "VII"] as const;

// ====================================
// Generate Scale Notes
// ====================================
function generateScale(root: string, type: ScaleType = "major"): string[] {
  const rootPc = rootToPc(root);
  const intervals = scaleFormulas[type];
  const notes: string[] = [pickName(rootPc, root, "auto")];
  let currentSemi = 0;
  intervals.forEach((step) => {
    currentSemi += step;
    notes.push(pickName((rootPc + currentSemi) % 12, root, "auto"));
  });
  notes.pop(); // remove octave duplication
  return notes;
}

function qualityToSymbol(q: TriadQuality): string {
  if (q === "maj") return "";
  if (q === "min") return "m";
  return "dim";
}

function qualityToRelatedSeventh(q: TriadQuality, degree: string): string {
  if (q === "maj" && degree === "V") return "7";
  if (q === "maj") return "maj7";
  if (q === "min") return "m7";
  return "m7b5";
}

function resolveSpellMode(
  root: string,
  type: ScaleType,
  spell: SpellMode,
): SpellMode {
  if (spell !== "auto") return spell;
  if (type === "major") return "auto";
  if (MINOR_FLAT_KEYS.has(root)) return "flat";
  if (MINOR_SHARP_KEYS.has(root)) return "sharp";
  return "auto";
}

function progressionUse(type: ScaleType, degree: string): string[] {
  const majorMap: Record<string, string[]> = {
    I: ["I–V–vi–IV", "I–IV–V", "ii–V–I"],
    ii: ["ii–V–I", "vi–ii–V", "ii–IV–V"],
    iii: ["I–iii–vi", "iii–vi–ii", "iii–IV–I"],
    IV: ["I–IV–V", "IV–I (plagal)", "vi–IV–I–V"],
    V: ["V–I", "ii–V–I", "I–V–vi–IV"],
    vi: ["I–V–vi–IV", "vi–IV–I–V", "V–vi (deceptive)"],
    "vii°": ["vii°–I", "vii°–iii", "ii–vii°–I"],
  };
  const minorMap: Record<string, string[]> = {
    i: ["i–VI–III–VII", "i–iv–v", "ii°–V–i"],
    "ii°": ["ii°–V–i", "i–ii°–V", "ii°–III"],
    III: ["i–VII–VI–VII", "III–VII–i", "III–VI–VII"],
    iv: ["i–iv–v", "iv–V–i", "VI–iv–i"],
    v: ["i–v–VI–VII", "iv–v–i", "v–i"],
    VI: ["i–VI–III–VII", "VI–VII–i", "VI–iv–v"],
    VII: ["i–VII–VI", "VII–i", "III–VII–i"],
  };

  return (type === "major" ? majorMap : minorMap)[degree] ?? [];
}

function borrowedAlternatives(type: ScaleType, degree: string): string[] {
  const majorMap: Record<string, string[]> = {
    I: ["Imaj7", "I6", "Iadd9"],
    ii: ["II7 (secondary dominant)", "ii7"],
    iii: ["III7 (chromatic mediant)", "iii7"],
    IV: ["iv (borrowed from parallel minor)", "IVmaj7"],
    V: ["V7", "Vsus4", "V7alt"],
    vi: ["VI (borrowed major)", "vi7"],
    "vii°": ["viiø7", "V/iii"],
  };
  const minorMap: Record<string, string[]> = {
    i: ["iMaj7", "i6"],
    "ii°": ["iiø7", "II (Neapolitan context)"],
    III: ["IIImaj7", "III+"],
    iv: ["IV (raised 6 melodic minor context)", "iv7"],
    v: ["V major (harmonic minor)", "V7"],
    VI: ["vi° (chromatic passing)", "VImaj7"],
    VII: ["vii° (raised leading-tone)", "VII7 modal"],
  };

  return (type === "major" ? majorMap : minorMap)[degree] ?? [];
}

// ====================================
// Generate Chords in Scale
// ====================================
export function generateFamilyChords(
  root = "C",
  type: ScaleType = "major",
  opts: { spell?: SpellMode } = { spell: "auto" },
): FamilyChordEntry[] {
  const resolvedSpell = resolveSpellMode(root, type, opts.spell ?? "auto");

  const scale = generateScale(root, type).map((n) => {
    const pc = rootToPc(n);
    return pickName(pc, root, resolvedSpell);
  });
  const result: FamilyChordEntry[] = [];

  const degrees = type === "major" ? degreesMajor : degreesMinor;
  const qualities: ReadonlyArray<TriadQuality> =
    type === "major" ? chordQualitiesMajor : chordQualitiesMinor;
  const roles = type === "major" ? chordRoles : chordRolesMinor;

  degrees.forEach((degree, i) => {
    const role = roles[degree];
    const quality = qualities[i];
    const chordRoot = scale[i];

    // formula chord triad
    let intervals: number[] = [];
    if (quality === "maj") intervals = [0, 4, 7];
    if (quality === "min") intervals = [0, 3, 7];
    if (quality === "dim") intervals = [0, 3, 6];

    const chordRootPc = rootToPc(chordRoot);
    const chordNotes = intervals.map((semi) =>
      pickName((chordRootPc + semi) % 12, root, resolvedSpell),
    );
    const chordDegrees = intervals.map<ComposedTone["degree"]>((semi) => {
      if (semi === 0) return "1";
      if (semi === 3) return "b3";
      if (semi === 4) return "3";
      if (semi === 5) return "4";
      if (semi === 6) return "b5";
      return "5"; // 7
    });

    result.push({
      degree,
      scaleType: type,
      modeSource: type === "major" ? "Ionian" : "Aeolian",
      role: role.name,
      description: role.description,
      family: role.family,
      functionHints: role.functionHints,
      cadentialStrength: role.cadentialStrength,
      commonResolutions: role.commonResolutions,
      progressionUse: progressionUse(type, degree),
      borrowedAlternatives: borrowedAlternatives(type, degree),
      chord: {
        name: chordRoot + qualityToSymbol(quality),
        quality,
        symbol: qualityToSymbol(quality),
        formula: chordDegrees,
        semitonePattern: intervals,
        relatedSeventh: qualityToRelatedSeventh(quality, degree),
        composed: chordNotes.map((n, idx) => ({
          degree: chordDegrees[idx],
          note: n,
          semitonesFromRoot: intervals[idx],
          intervalClass: intervals[idx] % 12,
          role: intervals[idx] === 0 ? "root" : "chord-tone",
        })),
      },
    });
  });

  return result;
}

// ====================================
// Contoh Penggunaan
// ====================================
// console.log("Family Chords C Major:");
// console.log(generateFamilyChords("C", "major"));

// console.log("Family Chords A Minor:");
// console.log(generateFamilyChords("A", "minor"));
