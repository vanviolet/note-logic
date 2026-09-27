// ════════════════════════════════════════════════════════
// scales.tsx — Comprehensive World Scale Database
// ════════════════════════════════════════════════════════
//
// 80+ scales from around the world, each with:
//   • semitone intervals & degree formulas
//   • cross-references to chords, intervals, dictionary
//   • genre / region / difficulty metadata
//   • guitar tab patterns (where applicable)
//   • song examples
//
// All data consumed by the scale explorer UI, cross-ref system,
// and related components.
// ════════════════════════════════════════════════════════

import {
  rootToPc,
  pickName,
  PITCH_CLASSES,
  type SpellMode,
  type SimpleScaleDegree,
} from "./core";

// Re-export for backward compatibility
type Degree = SimpleScaleDegree;

// ── Scale Family Type ──────────────────────────────────

export type ScaleFamilyType =
  | "diatonic-mode"
  | "minor-system"
  | "pentatonic"
  | "blues"
  | "symmetric"
  | "melodic-minor-mode"
  | "harmonic-minor-mode"
  | "harmonic-major-mode"
  | "bebop"
  | "jazz"
  | "middle-eastern"
  | "indian"
  | "east-asian"
  | "african"
  | "european-folk"
  | "hungarian"
  | "spanish"
  | "contemporary"
  | "microtonal-approx"
  | "heptatonic"
  | "hexatonic"
  | "exotic";

// ── Piano Scale Fingering ──────────────────────────────

export interface ScalePianoFingering {
  /** Reference root note for this fingering, e.g. "C" or "A" */
  referenceRoot: string;
  /** Right hand ascending finger numbers, e.g. "1-2-3-1-2-3-4-5" */
  rightHandAsc: string;
  /** Left hand ascending finger numbers, e.g. "5-4-3-2-1-3-2-1" */
  leftHandAsc: string;
  /** Additional fingering notes/guidance */
  notes?: string;
}

// ── Guitar Position ────────────────────────────────────

export interface ScaleGuitarPosition {
  /** Position name, e.g. "Open Position", "CAGED E-shape", "Box 1" */
  name: string;
  /** Starting fret number */
  startFret: number;
  /** Brief description of the position / fingering */
  description: string;
}

// ── Learning Data ──────────────────────────────────────

export interface ScaleLearningData {
  /** Piano fingering reference (standard key) */
  pianoFingering?: ScalePianoFingering;
  /** Guitar positions / shapes */
  guitarPositions?: ScaleGuitarPosition[];
  /** Practice tips (actionable, specific to this scale) */
  practiceTips: string[];
  /** How to recognize this scale by ear — signature sound cue */
  earTrainingHint: string;
  /** Musical contexts where this scale shines */
  harmonicApplications: string[];
  /** Pedagogical sequence: lower numbers = learn first (1-based) */
  teachingOrder?: number;
}

// ── Song Reference ─────────────────────────────────────

export interface ScaleSongReference {
  title: string;
  artist: string;
  note?: string;
}

// ── Scale Spec (master data shape) ─────────────────────

interface ScaleSpec {
  name: string;
  aliases?: string[];
  ints: number[];
  deg: Degree[];
  desc: string;
  family: ScaleFamilyType;
  region?: string;
  parentScale?: string;
  modeOf?: string;
  characteristicDegrees: Degree[];
  avoidDegrees?: Degree[];
  commonChords: string[];
  relatedScales?: string[];
  genres: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  songExamples: ScaleSongReference[];
  learning?: ScaleLearningData;
}

// ── Scale Instance (generated per root) ────────────────

export interface ScaleInstance {
  root: string;
  scale: string;
  type: string;
  description: string;
  aliases: string[];
  degrees: Degree[];
  notes: string[];
  composed: { degree: Degree; note: string }[];
  family: ScaleFamilyType;
  region?: string;
  parentScale?: string;
  modeOf?: string;
  semitonePattern: number[];
  stepFormula: string[];
  characteristicDegrees: Degree[];
  avoidDegrees: Degree[];
  commonChords: string[];
  relatedScales: string[];
  genres: string[];
  difficulty: ScaleSpec["difficulty"];
  songExamples: ScaleSongReference[];
  learning?: ScaleLearningData;
}

// ── Step Formula Helper ────────────────────────────────

function buildStepFormula(ints: number[]): string[] {
  const sorted = [...ints].sort((a, b) => a - b);
  const wrapped = [...sorted, 12];

  return wrapped.slice(1).map((v, i) => {
    const step = v - wrapped[i];
    if (step === 1) return "H";
    if (step === 2) return "W";
    if (step === 3) return "W+H";
    if (step === 4) return "W+W";
    return `${step}st`;
  });
}

// ════════════════════════════════════════════════════════
// MASTER_SCALES — 80+ Scales From Around The World
// ════════════════════════════════════════════════════════

const MASTER_SCALES: Record<string, ScaleSpec> = {
  // ╔══════════════════════════════════════════════════════╗
  // ║  1. DIATONIC MODES (Church Modes)                   ║
  // ╚══════════════════════════════════════════════════════╝

  ionian: {
    name: "Ionian (Major)",
    aliases: ["Major Scale"],
    ints: [0, 2, 4, 5, 7, 9, 11],
    deg: ["1", "2", "3", "4", "5", "6", "7"],
    desc: "Mode mayor utama dengan karakter paling stabil, terang, dan menjadi referensi dasar tonal harmony modern.",
    family: "diatonic-mode",
    region: "Western",
    parentScale: "Major scale",
    modeOf: "Mode 1 dari major scale",
    characteristicDegrees: ["3", "7"],
    avoidDegrees: ["4"],
    commonChords: ["maj", "maj7", "6", "add9"],
    relatedScales: ["lydian", "mixolydian", "major_pent"],
    genres: ["Pop", "Rock", "Jazz", "Worship", "Film scoring tonal"],
    difficulty: "beginner",
    songExamples: [
      { title: "Let It Be", artist: "The Beatles" },
      { title: "No Woman, No Cry", artist: "Bob Marley & The Wailers" },
      {
        title: "Imagine",
        artist: "John Lennon",
        note: "Mayor diatonik kuat pada bagian verse",
      },
    ],
    learning: {
      teachingOrder: 1,
      pianoFingering: {
        referenceRoot: "C",
        rightHandAsc: "1-2-3-1-2-3-4-5",
        leftHandAsc: "5-4-3-2-1-3-2-1",
        notes:
          "Ibu jari (1) lewat bawah setelah jari 3 pada tangan kanan. Pastikan pergelangan tetap rileks dan sejajar.",
      },
      guitarPositions: [
        {
          name: "Open Position (C Major)",
          startFret: 0,
          description:
            "Gunakan jari 1-2-4 pada senar 6-1. Root C di senar 5 fret 3. Pola paling dasar untuk pemula.",
        },
        {
          name: "CAGED E-shape (G Major)",
          startFret: 2,
          description:
            "Root di senar 6. Jari 1-2-4 pattern per string, 3 notes per string di posisi 2-5.",
        },
        {
          name: "3 Notes Per String – Position 1",
          startFret: 5,
          description:
            "Pola 3nps mulai fret 5. Bagus untuk speed picking dan legato runs.",
        },
      ],
      practiceTips: [
        "Mulai pelan dengan metronome 60 BPM, naik-turun 1 oktaf. Naikkan tempo 5 BPM setelah lancar.",
        "Latih interval thirds: 1-3, 2-4, 3-5, dst. Ini membangun kelancaran melodis.",
        "Gunakan pattern berbeda setiap hari untuk menghindari 'stuck in one box'.",
        "Piano: latih hands separately dulu, lalu hands together setelah masing-masing lancar.",
      ],
      earTrainingHint:
        "Terdengar cerah, stabil, dan 'pulang'. Nyanyikan Do-Re-Mi-Fa-Sol-La-Ti-Do. Karakter happy dan resolved.",
      harmonicApplications: [
        "Basis untuk semua progresi mayor: I-IV-V, I-V-vi-IV, I-vi-IV-V.",
        "Solo di atas maj7, 6, add9 chords.",
        "Cocok untuk lagu pop, worship, folk, dan film scoring tonal.",
      ],
    },
  },

  dorian: {
    name: "Dorian",
    aliases: ["Dorian Mode"],
    ints: [0, 2, 3, 5, 7, 9, 10],
    deg: ["1", "2", "b3", "4", "5", "6", "b7"],
    desc: "Mode minor yang tetap bright karena memiliki natural 6; sangat populer untuk vamp minor modern dan improvisasi yang tidak terlalu gelap.",
    family: "diatonic-mode",
    region: "Western",
    parentScale: "Major scale",
    modeOf: "Mode 2 dari major scale",
    characteristicDegrees: ["6", "b3"],
    avoidDegrees: [],
    commonChords: ["m7", "m9", "m11"],
    relatedScales: ["natural_minor", "phrygian", "mixolydian"],
    genres: ["Jazz", "Funk", "Neo-soul", "Fusion", "Modal rock"],
    difficulty: "intermediate",
    songExamples: [
      {
        title: "Billie Jean",
        artist: "Michael Jackson",
        note: "Groove minor sering dianalisis dengan nuansa Dorian",
      },
      { title: "Oye Como Va", artist: "Santana" },
      { title: "So What", artist: "Miles Davis" },
    ],
    learning: {
      teachingOrder: 5,
      pianoFingering: {
        referenceRoot: "D",
        rightHandAsc: "1-2-3-1-2-3-4-5",
        leftHandAsc: "5-4-3-2-1-3-2-1",
        notes:
          "Sama seperti C major tapi mulai dari D. Perhatikan b3 (F natural) dan b7 (C natural) sebagai color tones.",
      },
      guitarPositions: [
        {
          name: "Open Position (D Dorian)",
          startFret: 0,
          description:
            "Root di senar 4 open. Pola sama dengan C major tapi feel minor karena root berbeda.",
        },
        {
          name: "CAGED A-shape (D Dorian)",
          startFret: 5,
          description:
            "Root di senar 5 fret 5. Box pattern yang nyaman untuk solo funk/neo-soul.",
        },
      ],
      practiceTips: [
        "Mainkan di atas Dm7 vamp — tekankan natural 6 (B) untuk merasakan karakter Dorian vs Natural Minor.",
        "Latih phrase yang naik dari b3 ke 6 — ini 'warna' khas Dorian.",
        "Coba improvisasi dengan backing track funk/neo-soul di Dm.",
      ],
      earTrainingHint:
        "Minor tapi tidak terlalu sedih — ada 'lift' dari natural 6. Bandingkan dengan natural minor: Dorian terasa lebih terang.",
      harmonicApplications: [
        "Solo di atas m7, m9, m11 chords.",
        "Vamp minor satu chord (Dm7 groove) — sangat populer di funk dan neo-soul.",
        "Progresi Im7-IV7 (minor to dominant) khas Dorian.",
      ],
    },
  },

  phrygian: {
    name: "Phrygian",
    aliases: ["Phrygian Mode"],
    ints: [0, 1, 3, 5, 7, 8, 10],
    deg: ["1", "b2", "b3", "4", "5", "b6", "b7"],
    desc: "Mode minor dengan warna gelap dan eksotis akibat b2 yang sangat menonjol; cocok untuk warna tegang, Spanish feel, dan riff berat.",
    family: "diatonic-mode",
    region: "Western / Mediterranean",
    parentScale: "Major scale",
    modeOf: "Mode 3 dari major scale",
    characteristicDegrees: ["b2", "b6"],
    avoidDegrees: [],
    commonChords: ["m", "m7"],
    relatedScales: ["phrygian_dominant", "natural_minor", "locrian"],
    genres: ["Metal", "Flamenco fusion", "Cinematic dark", "Progressive rock"],
    difficulty: "intermediate",
    songExamples: [
      { title: "Wherever I May Roam", artist: "Metallica" },
      { title: "White Rabbit", artist: "Jefferson Airplane" },
      { title: "Symphony of Destruction", artist: "Megadeth" },
    ],
    learning: {
      teachingOrder: 8,
      pianoFingering: {
        referenceRoot: "E",
        rightHandAsc: "1-2-3-1-2-3-4-5",
        leftHandAsc: "5-4-3-2-1-3-2-1",
        notes:
          "Perhatikan b2 (F) tepat di samping root — jarak setengah langkah ini memberi tension khas Phrygian.",
      },
      guitarPositions: [
        {
          name: "Open Position (E Phrygian)",
          startFret: 0,
          description:
            "Root E open string. Sangat natural di gitar — semua open strings tersedia. Ideal untuk riff metal.",
        },
        {
          name: "5th Position",
          startFret: 5,
          description:
            "Pattern yang sama dengan Am natural minor tapi dimulai dari E. Root di senar 6 fret 12 untuk posisi tinggi.",
        },
      ],
      practiceTips: [
        "Mainkan descending dari root — Phrygian paling kuat terdengar saat turun (E-F-G-A vs ascending).",
        "Latih riff berbasis b2→1 resolution — ini signature sound Phrygian di metal dan flamenco.",
        "Gunakan palm muting di gitar untuk riff-riff Phrygian berat.",
      ],
      earTrainingHint:
        "Gelap, eksotis, dan tegang. Interval b2 langsung dari root memberikan 'ancaman'. Pikirkan intro Wherever I May Roam.",
      harmonicApplications: [
        "Riff metal dan progressive rock berbasis E Phrygian.",
        "Flamenco-style chord movement: Am-G-F-E (Andalusian cadence).",
        "Solo di atas m dan m7 chords dengan nuansa gelap.",
      ],
    },
  },

  lydian: {
    name: "Lydian",
    aliases: ["Lydian Mode"],
    ints: [0, 2, 4, 6, 7, 9, 11],
    deg: ["1", "2", "3", "#4", "5", "6", "7"],
    desc: "Mode mayor dengan #4 yang menciptakan nuansa mengambang, dreamy, dan magical — sangat disukai dalam film scoring dan progressive rock.",
    family: "diatonic-mode",
    region: "Western",
    parentScale: "Major scale",
    modeOf: "Mode 4 dari major scale",
    characteristicDegrees: ["#4"],
    avoidDegrees: [],
    commonChords: ["maj7", "maj7#11", "add9"],
    relatedScales: ["ionian", "lydian_dominant", "lydian_augmented"],
    genres: ["Film score", "Progressive rock", "Jazz", "Dream pop", "Ambient"],
    difficulty: "intermediate",
    songExamples: [
      {
        title: "The Simpsons Theme",
        artist: "Danny Elfman",
        note: "Intro naik dengan warna Lydian",
      },
      { title: "Flying in a Blue Dream", artist: "Joe Satriani" },
      { title: "Freewill", artist: "Rush" },
    ],
    learning: {
      teachingOrder: 7,
      pianoFingering: {
        referenceRoot: "F",
        rightHandAsc: "1-2-3-4-1-2-3-4",
        leftHandAsc: "5-4-3-2-1-3-2-1",
        notes:
          "Di F Lydian, #4 = B natural (bukan Bb). Finger 4 jatuh di B sebelum thumb crossing.",
      },
      guitarPositions: [
        {
          name: "5th Position",
          startFret: 5,
          description:
            "Root di senar 6 fret 8 (C Lydian) atau senar 4 fret 3 (F Lydian). Pattern 3nps sangat melodis.",
        },
        {
          name: "Open Position (F Lydian)",
          startFret: 0,
          description:
            "Gunakan open strings E dan B yang naturally ada di F Lydian.",
        },
      ],
      practiceTips: [
        "Tekankan #4 dalam melodi — ini satu-satunya perbedaan dari Major. Mainkan phrase 1-2-3-#4 berulang-ulang.",
        "Improvisasi di atas Fmaj7 drone — eksplor warna dreamy #4.",
        "Dengarkan film score Joe Satriani dan Danny Elfman untuk inspirasi frasa Lydian.",
      ],
      earTrainingHint:
        "Seperti major tapi lebih 'melayang' dan dreamlike. #4 memberi rasa floating, seolah-olah tidak ada gravitasi.",
      harmonicApplications: [
        "Solo di atas maj7, maj7#11, dan add9 chords.",
        "Film scoring untuk nuansa wonder, magic, dan keindahan.",
        "Substitusi Lydian di atas konteks major (IV chord = Lydian dari I).",
      ],
    },
  },

  mixolydian: {
    name: "Mixolydian",
    aliases: ["Mixolydian Mode", "Dominant Scale"],
    ints: [0, 2, 4, 5, 7, 9, 10],
    deg: ["1", "2", "3", "4", "5", "6", "b7"],
    desc: "Mode mayor dengan b7 yang memberikan karakter dominan, bluesy, dan energik — dasar untuk dominant 7th chords dan jam blues/rock.",
    family: "diatonic-mode",
    region: "Western",
    parentScale: "Major scale",
    modeOf: "Mode 5 dari major scale",
    characteristicDegrees: ["b7"],
    avoidDegrees: [],
    commonChords: ["7", "9", "13", "sus4"],
    relatedScales: ["ionian", "dorian", "blues"],
    genres: ["Blues", "Rock", "Country", "Funk", "Gospel"],
    difficulty: "intermediate",
    songExamples: [
      { title: "Sweet Child O' Mine (verse)", artist: "Guns N' Roses" },
      { title: "Cinnamon Girl", artist: "Neil Young" },
      { title: "Norwegian Wood", artist: "The Beatles" },
    ],
    learning: {
      teachingOrder: 6,
      pianoFingering: {
        referenceRoot: "G",
        rightHandAsc: "1-2-3-1-2-3-4-5",
        leftHandAsc: "5-4-3-2-1-3-2-1",
        notes:
          "Identik dengan G major tapi b7 (F natural bukan F#). Perhatikan perbedaan ini saat bermain.",
      },
      guitarPositions: [
        {
          name: "Open Position (G Mixolydian)",
          startFret: 0,
          description:
            "Root G di senar 6 fret 3. Sama dengan G major tapi mainkan F natural bukan F#.",
        },
        {
          name: "5th Position",
          startFret: 5,
          description:
            "Root di senar 6 fret 5 (A Mixolydian). Pattern comfortable untuk blues/rock soloing.",
        },
      ],
      practiceTips: [
        "Mainkan di atas dominant 7th vamp (G7) — tekankan b7 yang memberi rasa bluesy.",
        "Latih mixing antara Mixolydian dan minor pentatonic pada backing track blues.",
        "Coba bending dari b7 ke root — sangat ekspresif di gitar.",
      ],
      earTrainingHint:
        "Seperti major tapi dengan rasa 'bluesy' dan 'tidak selesai'. b7 membuat skala tidak fully resolve.",
      harmonicApplications: [
        "Solo di atas dominant 7th, 9, 13, sus4 chords.",
        "Blues/rock jamming — sangat versatile.",
        "Progresi I7-bVII (seperti G7-F) yang khas Mixolydian rock.",
      ],
    },
  },

  aeolian: {
    name: "Aeolian",
    aliases: ["Natural Minor", "Aeolian Mode"],
    ints: [0, 2, 3, 5, 7, 8, 10],
    deg: ["1", "2", "b3", "4", "5", "b6", "b7"],
    desc: "Mode ke-6 yang identik dengan natural minor — karakter sedih, melankolis, dan sangat umum di pop, rock, metal modern.",
    family: "diatonic-mode",
    region: "Western",
    parentScale: "Major scale",
    modeOf: "Mode 6 dari major scale",
    characteristicDegrees: ["b3", "b6", "b7"],
    avoidDegrees: [],
    commonChords: ["m", "m7"],
    relatedScales: ["natural_minor", "dorian", "phrygian"],
    genres: ["Pop", "Rock", "Metal", "Ballad", "Film drama"],
    difficulty: "beginner",
    songExamples: [
      { title: "Losing My Religion", artist: "R.E.M." },
      { title: "Rolling in the Deep", artist: "Adele" },
    ],
    learning: {
      teachingOrder: 2,
      pianoFingering: {
        referenceRoot: "A",
        rightHandAsc: "1-2-3-1-2-3-4-5",
        leftHandAsc: "5-4-3-2-1-3-2-1",
        notes:
          "Fingering sama dengan C major karena menggunakan semua white keys (A minor). Mulai dari A.",
      },
      guitarPositions: [
        {
          name: "Open Position (Am)",
          startFret: 0,
          description:
            "Root A di senar 5 open. Pola paling natural untuk minor di gitar.",
        },
        {
          name: "5th Position",
          startFret: 5,
          description:
            "Root di senar 6 fret 5. Box pattern yang sering dipakai untuk solo rock/pop.",
        },
      ],
      practiceTips: [
        "Identik dengan Natural Minor — latih keduanya sebagai satu konsep.",
        "Bandingkan dengan Dorian: mainkan Am lalu D Dorian untuk dengar perbedaan b6 vs natural 6.",
        "Gunakan backing track Am untuk latih improvisasi minor basic.",
      ],
      earTrainingHint:
        "Terdengar sedih, melankolis, dan emosional. Ini adalah 'default sad scale' yang paling natural.",
      harmonicApplications: [
        "Basis lagu minor: i-iv-v, i-bVI-bVII-i, i-bVII-bVI-bVII.",
        "Solo di atas m dan m7 chords.",
        "Pop ballad dan rock minor progression.",
      ],
    },
  },

  locrian: {
    name: "Locrian",
    aliases: ["Locrian Mode"],
    ints: [0, 1, 3, 5, 6, 8, 10],
    deg: ["1", "b2", "b3", "4", "b5", "b6", "b7"],
    desc: "Mode paling gelap dan tidak stabil karena triad root-nya diminished (b5). Jarang sebagai tonalitas utama tapi penting untuk half-diminished context di jazz.",
    family: "diatonic-mode",
    region: "Western",
    parentScale: "Major scale",
    modeOf: "Mode 7 dari major scale",
    characteristicDegrees: ["b2", "b5"],
    avoidDegrees: [],
    commonChords: ["m7b5", "dim"],
    relatedScales: ["phrygian", "locrian_natural2"],
    genres: ["Jazz", "Progressive metal", "Avant-garde"],
    difficulty: "advanced",
    songExamples: [
      {
        title: "Enter Sandman (riff analysis)",
        artist: "Metallica",
        note: "Locrian feel pada beberapa riff",
      },
      { title: "YYZ", artist: "Rush" },
    ],
    learning: {
      teachingOrder: 14,
      practiceTips: [
        "Mainkan di atas m7b5 chord — ini konteks utama Locrian di jazz.",
        "Latih resolusi Locrian ke Ionian (B Locrian → C Ionian) untuk merasa relasinya.",
        "Jangan coba membangun tonal center di Locrian — pelajari sebagai 'warna' bukan 'home key'.",
      ],
      earTrainingHint:
        "Paling gelap dan tidak stabil dari semua mode. b2 + b5 membuat rasa 'collapsing'. Tidak ada resting point yang nyaman.",
      harmonicApplications: [
        "Voicing m7b5 di jazz — soloing approach.",
        "Warna gelap untuk riff progressive metal.",
        "Konektivitas modal: satu mode dari sistem major yang harus dipahami meskipun jarang standalone.",
      ],
    },
  },

  // ╔══════════════════════════════════════════════════════╗
  // ║  2. MINOR SYSTEM                                    ║
  // ╚══════════════════════════════════════════════════════╝

  natural_minor: {
    name: "Natural Minor",
    aliases: ["Aeolian Mode"],
    ints: [0, 2, 3, 5, 7, 8, 10],
    deg: ["1", "2", "b3", "4", "5", "b6", "b7"],
    desc: "Skala minor diatonik paling dasar, berkarakter sedih, mellow, dan fondasi lagu minor modern.",
    family: "minor-system",
    region: "Western",
    parentScale: "Major scale",
    modeOf: "Mode 6 dari major scale (Aeolian)",
    characteristicDegrees: ["b3", "b6", "b7"],
    avoidDegrees: [],
    commonChords: ["m", "m7"],
    relatedScales: ["aeolian", "harmonic_minor", "melodic_minor", "dorian"],
    genres: ["Pop", "Rock", "Ballad", "EDM", "Film drama"],
    difficulty: "beginner",
    songExamples: [
      { title: "All Along the Watchtower", artist: "Bob Dylan" },
      { title: "Losing My Religion", artist: "R.E.M." },
      { title: "Rolling in the Deep", artist: "Adele" },
    ],
    learning: {
      teachingOrder: 2,
      pianoFingering: {
        referenceRoot: "A",
        rightHandAsc: "1-2-3-1-2-3-4-5",
        leftHandAsc: "5-4-3-2-1-3-2-1",
        notes:
          "A natural minor = semua white keys dari A. Fingering identik dengan C major.",
      },
      guitarPositions: [
        {
          name: "Open Position (Am)",
          startFret: 0,
          description:
            "Root A senar 5 open. Pattern paling dasar, semua open strings available.",
        },
        {
          name: "5th Position",
          startFret: 5,
          description:
            "Root senar 6 fret 5. Box pattern versatile untuk soloing.",
        },
        {
          name: "12th Position",
          startFret: 12,
          description:
            "Oktaf di atas open position. Sama shape, register lebih tinggi.",
        },
      ],
      practiceTips: [
        "Latih bersama Aeolian mode karena keduanya identik — pahami sebagai satu konsep.",
        "Mainkan ascending dan descending dengan metronome, fokus ke b3 dan b6 sebagai color tones.",
        "Bandingkan dengan Dorian (natural 6 vs b6) dan Harmonic Minor (natural 7 vs b7).",
        "Piano: latih 2 oktaf hands separate lalu hands together.",
      ],
      earTrainingHint:
        "Warna sedih yang natural dan lembut. Tanpa drama harmonic minor, tanpa brightness Dorian. Ini 'default sadness'.",
      harmonicApplications: [
        "Basis semua progresi minor: i-iv-v, i-bVI-bVII, i-bVII-bVI-bVII.",
        "Solo di atas m dan m7 chords.",
        "Lagu pop/rock minor modern, EDM minor key.",
      ],
    },
  },

  harmonic_minor: {
    name: "Harmonic Minor",
    aliases: [],
    ints: [0, 2, 3, 5, 7, 8, 11],
    deg: ["1", "2", "b3", "4", "5", "b6", "7"],
    desc: "Minor scale dengan leading tone natural 7 untuk dominant V7 di tonalitas minor klasik; interval augmented 2nd antara b6-7 memberikan warna eksotis.",
    family: "minor-system",
    region: "Western / Middle-Eastern",
    parentScale: "Natural minor",
    modeOf: "Minor dengan raised 7",
    characteristicDegrees: ["7", "b6", "b3"],
    avoidDegrees: [],
    commonChords: ["mMaj7", "dim7", "m6"],
    relatedScales: ["natural_minor", "phrygian_dominant", "melodic_minor"],
    genres: [
      "Classical",
      "Neo-classical",
      "Metal",
      "Film score",
      "Middle-eastern fusion",
    ],
    difficulty: "advanced",
    songExamples: [
      { title: "Hava Nagila", artist: "Traditional" },
      { title: "Far Beyond the Sun", artist: "Yngwie Malmsteen" },
      {
        title: "Sultans of Swing",
        artist: "Dire Straits",
        note: "Beberapa frase harmonic minor approach",
      },
    ],
    learning: {
      teachingOrder: 9,
      pianoFingering: {
        referenceRoot: "A",
        rightHandAsc: "1-2-3-1-2-3-4-5",
        leftHandAsc: "5-4-3-2-1-3-2-1",
        notes:
          "Sama dengan A natural minor tapi G# (raised 7). Stretch antara F-G# (augmented 2nd) butuh perhatian khusus.",
      },
      guitarPositions: [
        {
          name: "Open Position (A Harmonic Minor)",
          startFret: 0,
          description:
            "Root A senar 5 open. Perhatikan stretch antara fret 1 (F) dan fret 4 (G#) di senar 1.",
        },
        {
          name: "5th Position",
          startFret: 5,
          description:
            "Root senar 6 fret 5. Augmented 2nd interval memerlukan stretch jari.",
        },
      ],
      practiceTips: [
        "Fokus latih interval augmented 2nd (b6-7) — ini yang membedakan dari natural minor.",
        "Mainkan V7-i resolution (E7-Am) menggunakan harmonic minor atas keduanya.",
        "Latih neo-classical runs: pattern 3 notes per string ascending/descending cepat.",
        "Piano: perhatikan peralihan F ke G# — gunakan jari 3-5 atau 3-4 tergantung konteks.",
      ],
      earTrainingHint:
        "Minor yang 'dramatis' dan 'exotic'. Gap augmented 2nd (b6-7) terdengar khas Middle-Eastern/Classical. Pikirkan Hava Nagila.",
      harmonicApplications: [
        "V7→im resolution di tonalitas minor (E7→Am).",
        "Neo-classical shredding (Yngwie style).",
        "Film score dramatic dan Middle-Eastern fusion.",
      ],
    },
  },

  melodic_minor: {
    name: "Melodic Minor (Ascending / Jazz Minor)",
    aliases: ["Jazz Minor", "Melodic Minor Ascending"],
    ints: [0, 2, 3, 5, 7, 9, 11],
    deg: ["1", "2", "b3", "4", "5", "6", "7"],
    desc: "Minor scale dengan raised 6 dan 7 — menghilangkan augmented 2nd. Dalam jazz dipakai selalu (ascending form); menghasilkan 7 modes penting termasuk Altered dan Lydian Dominant.",
    family: "minor-system",
    region: "Western",
    parentScale: "Natural minor",
    modeOf: "Minor scale with raised 6th and 7th",
    characteristicDegrees: ["b3", "6", "7"],
    avoidDegrees: [],
    commonChords: ["mMaj7", "m6", "m9"],
    relatedScales: [
      "harmonic_minor",
      "lydian_dominant",
      "altered",
      "lydian_augmented",
    ],
    genres: [
      "Jazz",
      "Fusion",
      "Classical",
      "Neo-classical metal",
      "Contemporary",
    ],
    difficulty: "advanced",
    songExamples: [
      { title: "Dolphin Dance", artist: "Herbie Hancock" },
      { title: "Stella by Starlight", artist: "Miles Davis" },
    ],
    learning: {
      teachingOrder: 10,
      pianoFingering: {
        referenceRoot: "A",
        rightHandAsc: "1-2-3-1-2-3-4-5",
        leftHandAsc: "5-4-3-2-1-3-2-1",
        notes:
          "A melodic minor ascending: A-B-C-D-E-F#-G#. Raised 6 dan 7 menghilangkan augmented 2nd gap.",
      },
      guitarPositions: [
        {
          name: "5th Position",
          startFret: 5,
          description:
            "Root senar 6 fret 5. Penting untuk jazz: pelajari sebagai 'jazz minor scale'.",
        },
      ],
      practiceTips: [
        "Di jazz, mainkan selalu ascending form (tidak turun ke natural minor). Ini 'jazz minor'.",
        "Latih semua 7 modes dari melodic minor — setiap mode penting untuk jazz.",
        "Mainkan di atas mMaj7 chord untuk merasakan warnanya.",
        "Piano: mirip major scale tapi b3 — latih transisi mental dari major ke b3.",
      ],
      earTrainingHint:
        "Minor yang 'halus' tanpa drama harmonic minor. Terdengar minor tapi smooth karena 6 dan 7 natural.",
      harmonicApplications: [
        "Solo di atas mMaj7, m6, m9 chords.",
        "Parent scale untuk Altered, Lydian Dominant, Locrian ♮2 — semua penting di jazz.",
        "Classical melodic passages (ascending vs descending traditional form).",
      ],
    },
  },

  // ╔══════════════════════════════════════════════════════╗
  // ║  3. MELODIC MINOR MODES                             ║
  // ╚══════════════════════════════════════════════════════╝

  dorian_b2: {
    name: "Dorian ♭2",
    aliases: ["Phrygian ♮6", "Javanese Scale", "Melodic Minor Mode 2"],
    ints: [0, 1, 3, 5, 7, 9, 10],
    deg: ["1", "b2", "b3", "4", "5", "6", "b7"],
    desc: "Mode ke-2 melodic minor: Dorian dengan b2. Menggabungkan rasa gelap Phrygian dengan brightnessnya natural 6.",
    family: "melodic-minor-mode",
    region: "Western / Southeast Asian",
    parentScale: "Melodic minor",
    modeOf: "Mode 2 dari melodic minor",
    characteristicDegrees: ["b2", "6"],
    avoidDegrees: [],
    commonChords: ["m7", "sus"],
    relatedScales: ["dorian", "phrygian", "melodic_minor"],
    genres: ["Jazz", "Fusion", "Contemporary classical"],
    difficulty: "advanced",
    songExamples: [{ title: "Black Narcissus", artist: "Joe Henderson" }],
    learning: {
      practiceTips: [
        "Bandingkan dengan Dorian biasa — satu-satunya perbedaan adalah b2.",
        "Mainkan di atas m7sus chord untuk merasakan warna Javanese.",
        "Latih phrase yang memainkan b2→b3 sebagai motif melodis.",
      ],
      earTrainingHint:
        "Dorian dengan opening gelap karena b2. Terasa minor tapi dengan nuansa Southeast Asian yang misterius.",
      harmonicApplications: [
        "Konteks m7 voicing di jazz fusion.",
        "Warna Southeast Asian untuk komposisi world music.",
      ],
    },
  },

  lydian_augmented: {
    name: "Lydian Augmented",
    aliases: ["Melodic Minor Mode 3"],
    ints: [0, 2, 4, 6, 8, 9, 11],
    deg: ["1", "2", "3", "#4", "#5", "6", "7"],
    desc: "Mode ke-3 melodic minor: Lydian dengan #5. Sangat terang dan floating, cocok untuk maj7#5 voicings.",
    family: "melodic-minor-mode",
    region: "Western",
    parentScale: "Melodic minor",
    modeOf: "Mode 3 dari melodic minor",
    characteristicDegrees: ["#4", "#5"],
    avoidDegrees: [],
    commonChords: ["maj7#5", "add9"],
    relatedScales: ["lydian", "whole_tone", "melodic_minor"],
    genres: ["Jazz", "Film score", "Art music", "Ambient"],
    difficulty: "advanced",
    songExamples: [{ title: "Inner Urge", artist: "Joe Henderson" }],
    learning: {
      practiceTips: [
        "Fokus pada #4 dan #5 — keduanya membuat rasa floating/ethereal.",
        "Mainkan di atas maj7#5 chord untuk merasakan warna unik ini.",
        "Bandingkan dengan Lydian biasa — satu-satunya perbedaan adalah #5.",
      ],
      earTrainingHint:
        "Lydian yang bahkan lebih floating karena #5. Terdengar dreamlike dan surreal.",
      harmonicApplications: [
        "Solo di atas maj7#5 voicings.",
        "Film scoring untuk nuansa supernatural/fantasi.",
      ],
    },
  },

  lydian_dominant: {
    name: "Lydian Dominant",
    aliases: [
      "Lydian ♭7",
      "Overtone Scale",
      "Acoustic Scale",
      "Melodic Minor Mode 4",
    ],
    ints: [0, 2, 4, 6, 7, 9, 10],
    deg: ["1", "2", "3", "#4", "5", "6", "b7"],
    desc: "Mode ke-4 melodic minor: major scale dengan #4 dan b7. Muncul alami di overtone series, ideal untuk 7#11 chords.",
    family: "melodic-minor-mode",
    region: "Western",
    parentScale: "Melodic minor",
    modeOf: "Mode 4 dari melodic minor",
    characteristicDegrees: ["#4", "b7"],
    avoidDegrees: [],
    commonChords: ["7", "7#11", "9#11", "13#11"],
    relatedScales: ["lydian", "mixolydian", "melodic_minor"],
    genres: ["Jazz", "Fusion", "Film score", "Bartókian"],
    difficulty: "advanced",
    songExamples: [
      { title: "The Saga of Harrison Crabfeathers", artist: "Steve Kuhn" },
      { title: "Blue in Green", artist: "Miles Davis" },
    ],
    learning: {
      practiceTips: [
        "Ini 'the jazz scale' untuk tritone substitution — pahami konsep ini.",
        "Mainkan di atas 7#11 chord — tekankan #4 sebagai color tone.",
        "Bandingkan dengan Mixolydian (only diff = #4).",
      ],
      earTrainingHint:
        "Major dan dominant, tapi dengan rasa 'melayang' dari #4. Terdengar sophisticated dan jazzy.",
      harmonicApplications: [
        "Solo di atas 7#11, 9#11, 13#11 chords.",
        "Tritone substitution context di jazz.",
        "Bartók-inspired composition.",
      ],
    },
  },

  mixolydian_b6: {
    name: "Mixolydian ♭6",
    aliases: ["Hindu Scale", "Aeolian Dominant", "Melodic Minor Mode 5"],
    ints: [0, 2, 4, 5, 7, 8, 10],
    deg: ["1", "2", "3", "4", "5", "b6", "b7"],
    desc: "Mode ke-5 melodic minor: Mixolydian dengan b6. Menggabungkan kecerahan major 3rd dengan kegelapan b6; cocok untuk progresi dominant yang mau resolve ke minor.",
    family: "melodic-minor-mode",
    region: "Western / Indian",
    parentScale: "Melodic minor",
    modeOf: "Mode 5 dari melodic minor",
    characteristicDegrees: ["3", "b6"],
    avoidDegrees: [],
    commonChords: ["7", "7b13"],
    relatedScales: ["mixolydian", "natural_minor", "melodic_minor"],
    genres: ["Jazz", "Indian fusion", "Film score"],
    difficulty: "advanced",
    songExamples: [
      {
        title: "Aja",
        artist: "Steely Dan",
        note: "Nuansa Hindu scale pada beberapa section",
      },
    ],
    learning: {
      practiceTips: [
        "Bandingkan dengan Mixolydian biasa — satu-satunya perbedaan adalah b6.",
        "Mainkan resolusi V→i (dominant ke minor) menggunakan skala ini.",
        "Tekankan kontras 3 (major) vs b6 (dark) — inilah tension khasnya.",
      ],
      earTrainingHint:
        "Major 3rd yang cerah bertabrakan dengan b6 yang gelap — menimbulkan rasa nostalgic dan bittersweet.",
      harmonicApplications: [
        "V chord yang resolve ke minor (dominant preparation).",
        "Indian fusion context — 'Hindu scale' terkenal.",
      ],
    },
  },

  locrian_natural2: {
    name: "Locrian ♮2",
    aliases: ["Half-Diminished Scale", "Aeolocrian", "Melodic Minor Mode 6"],
    ints: [0, 2, 3, 5, 6, 8, 10],
    deg: ["1", "2", "b3", "4", "b5", "b6", "b7"],
    desc: "Mode ke-6 melodic minor: Locrian dengan natural 2. Lebih smooth dari Locrian biasa, ideal untuk m7b5 voicings di jazz.",
    family: "melodic-minor-mode",
    region: "Western",
    parentScale: "Melodic minor",
    modeOf: "Mode 6 dari melodic minor",
    characteristicDegrees: ["2", "b5"],
    avoidDegrees: [],
    commonChords: ["m7b5"],
    relatedScales: ["locrian", "dorian", "melodic_minor"],
    genres: ["Jazz", "Fusion", "Contemporary classical"],
    difficulty: "advanced",
    songExamples: [{ title: "Passion Dance", artist: "McCoy Tyner" }],
    learning: {
      practiceTips: [
        "Ini skala utama untuk m7b5 chord di jazz — wajib kuasai.",
        "Bandingkan dengan Locrian biasa — natural 2 membuatnya lebih smooth.",
        "Latih di atas ii chord dalam minor key (e.g., Bm7b5 di key Am).",
      ],
      earTrainingHint:
        "Locrian yang lebih 'sopan' karena natural 2. Masih gelap tapi lebih playable dan cantik.",
      harmonicApplications: [
        "Solo di atas m7b5 chords (half-diminished).",
        "ii-V-i di minor key — scale untuk ii chord.",
      ],
    },
  },

  altered: {
    name: "Altered Scale",
    aliases: ["Super Locrian", "Diminished Whole Tone", "Melodic Minor Mode 7"],
    ints: [0, 1, 3, 4, 6, 8, 10],
    deg: ["1", "b2", "b3", "3", "b5", "b6", "b7"],
    desc: "Mode ke-7 melodic minor: semua tension yang mungkin (b9, #9, b5, #5) — skala utama untuk 7alt chord di jazz dan dominant resolution yang intens.",
    family: "melodic-minor-mode",
    region: "Western",
    parentScale: "Melodic minor",
    modeOf: "Mode 7 dari melodic minor",
    characteristicDegrees: ["b2", "b5"],
    avoidDegrees: [],
    commonChords: ["7alt", "7b9", "7#9", "7b5", "7#5"],
    relatedScales: ["locrian", "whole_tone", "melodic_minor", "diminished_hw"],
    genres: ["Jazz", "Fusion", "Bebop", "Contemporary"],
    difficulty: "advanced",
    songExamples: [
      { title: "Giant Steps", artist: "John Coltrane" },
      { title: "Moment's Notice", artist: "John Coltrane" },
    ],
    learning: {
      practiceTips: [
        "Wajib untuk jazz: setiap V7alt chord menggunakan skala ini.",
        "Latih pattern descending — lebih natural untuk resolusi.",
        "Relate ke melodic minor: Altered = mode 7 dari melodic minor satu semitone di atas root.",
      ],
      earTrainingHint:
        "Sangat tense dan chromatic — semua tension notes hadir (b9, #9, b5, #5). Terdengar 'meledak' sebelum resolve.",
      harmonicApplications: [
        "Solo di atas 7alt, 7b9, 7#9, 7b5, 7#5 chords.",
        "V7→Imaj7 resolution yang intens di jazz.",
        "Bebop dan contemporary jazz vocabulary.",
      ],
    },
  },

  // ╔══════════════════════════════════════════════════════╗
  // ║  4. HARMONIC MINOR MODES                            ║
  // ╚══════════════════════════════════════════════════════╝

  harmonic_minor_mode2: {
    name: "Locrian ♮6",
    aliases: ["Harmonic Minor Mode 2"],
    ints: [0, 1, 3, 5, 6, 9, 10],
    deg: ["1", "b2", "b3", "4", "b5", "6", "b7"],
    desc: "Mode ke-2 harmonic minor: Locrian dengan natural 6. Warna gelap yang unik karena b5 dan natural 6 bersamaan.",
    family: "harmonic-minor-mode",
    region: "Western",
    parentScale: "Harmonic minor",
    modeOf: "Mode 2 dari harmonic minor",
    characteristicDegrees: ["b2", "b5", "6"],
    avoidDegrees: [],
    commonChords: ["m7b5"],
    relatedScales: ["locrian", "harmonic_minor"],
    genres: ["Jazz", "Classical", "Progressive"],
    difficulty: "advanced",
    songExamples: [],
    learning: {
      practiceTips: [
        "Jarang standalone — pelajari sebagai bagian dari sistem harmonic minor.",
        "Mainkan di atas m7b5 chord untuk warna yang berbeda dari Locrian ♮2.",
      ],
      earTrainingHint:
        "Locrian dengan natural 6 — sedikit lebih bright di upper structure tapi tetap gelap overall.",
      harmonicApplications: ["Konteks ii chord di harmonic minor system."],
    },
  },

  ionian_augmented: {
    name: "Ionian Augmented",
    aliases: ["Harmonic Minor Mode 3"],
    ints: [0, 2, 4, 5, 8, 9, 11],
    deg: ["1", "2", "3", "4", "#5", "6", "7"],
    desc: "Mode ke-3 harmonic minor: Ionian dengan #5. Warna major yang aneh karena augmented fifth.",
    family: "harmonic-minor-mode",
    region: "Western",
    parentScale: "Harmonic minor",
    modeOf: "Mode 3 dari harmonic minor",
    characteristicDegrees: ["3", "#5"],
    avoidDegrees: [],
    commonChords: ["maj7#5", "aug"],
    relatedScales: ["ionian", "lydian_augmented", "harmonic_minor"],
    genres: ["Jazz", "Art music"],
    difficulty: "advanced",
    songExamples: [],
    learning: {
      practiceTips: [
        "Mainkan di atas maj7#5 chord.",
        "Bandingkan dengan Ionian biasa — #5 satu-satunya perbedaan.",
      ],
      earTrainingHint:
        "Major yang 'aneh' karena #5. Terdengar cerah tapi dengan twist yang unexpected.",
      harmonicApplications: ["Konteks bIII chord di harmonic minor system."],
    },
  },

  dorian_sharp4: {
    name: "Dorian ♯4",
    aliases: ["Romanian Scale", "Harmonic Minor Mode 4"],
    ints: [0, 2, 3, 6, 7, 9, 10],
    deg: ["1", "2", "b3", "#4", "5", "6", "b7"],
    desc: "Mode ke-4 harmonic minor: Dorian dengan #4. Warna minor yang lebih terang dan dramatis. Juga dikenal sebagai Romanian scale.",
    family: "harmonic-minor-mode",
    region: "Eastern Europe / Romania",
    parentScale: "Harmonic minor",
    modeOf: "Mode 4 dari harmonic minor",
    characteristicDegrees: ["b3", "#4", "6"],
    avoidDegrees: [],
    commonChords: ["m7", "7"],
    relatedScales: ["dorian", "hungarian_minor", "harmonic_minor"],
    genres: ["Romanian folk", "Klezmer", "Progressive", "Jazz"],
    difficulty: "advanced",
    songExamples: [{ title: "Romanian folk melodies", artist: "Traditional" }],
    learning: {
      practiceTips: [
        "Kenal juga sebagai Romanian Scale — kaya tradisi musik Eastern European.",
        "Fokus pada #4 yang memberi warna lebih dramatis dari Dorian biasa.",
      ],
      earTrainingHint:
        "Dorian dengan satu nada berbeda: #4 yang memberi drama. Warna Romanian dan Klezmer.",
      harmonicApplications: [
        "Romanian folk dan Klezmer music.",
        "Konteks iv chord di harmonic minor system.",
      ],
    },
  },

  phrygian_dominant: {
    name: "Phrygian Dominant",
    aliases: [
      "Spanish Gypsy Scale",
      "Freygish",
      "Ahava Rabbah",
      "Harmonic Minor Mode 5",
    ],
    ints: [0, 1, 4, 5, 7, 8, 10],
    deg: ["1", "b2", "3", "4", "5", "b6", "b7"],
    desc: "Mode ke-5 harmonic minor: warna dominan eksotis dengan b2 dan major 3 — sangat kuat untuk Spanish, Arabic, Jewish feel.",
    family: "harmonic-minor-mode",
    region: "Mediterranean / Middle East",
    parentScale: "Harmonic minor",
    modeOf: "Mode 5 dari harmonic minor",
    characteristicDegrees: ["b2", "3", "b6"],
    avoidDegrees: [],
    commonChords: ["7b9", "7susb9", "13b9"],
    relatedScales: ["phrygian", "harmonic_minor", "double_harmonic"],
    genres: ["Flamenco", "Metal", "Middle-eastern", "Klezmer", "Cinematic"],
    difficulty: "advanced",
    songExamples: [
      { title: "Misirlou", artist: "Dick Dale" },
      { title: "Wherever I May Roam", artist: "Metallica" },
      { title: "Hava Nagila", artist: "Traditional" },
    ],
    learning: {
      teachingOrder: 12,
      pianoFingering: {
        referenceRoot: "E",
        rightHandAsc: "1-2-3-1-2-3-4-5",
        leftHandAsc: "5-4-3-2-1-3-2-1",
        notes:
          "Perhatikan gap besar antara b2 (F) dan 3 (G#) — augmented 2nd yang memberi warna eksotis.",
      },
      guitarPositions: [
        {
          name: "5th Position",
          startFret: 5,
          description:
            "Root senar 6 fret 5 (A Phrygian Dominant). Stretch diperlukan untuk interval augmented 2nd.",
        },
        {
          name: "Open Position (E)",
          startFret: 0,
          description:
            "Open E root — sangat powerful untuk riff metal dan flamenco.",
        },
      ],
      practiceTips: [
        "Latih descending run dari root — Phrygian Dominant paling kuat terdengar saat turun.",
        "Mainkan Andalusian cadence: Am-G-F-E(7) sambil soloing Phrygian Dominant.",
        "Eksperimen mixing dengan Phrygian biasa (alternate b3 dan 3) untuk warna flamenco.",
      ],
      earTrainingHint:
        "Exotic, dramatic, dan 'Spanish'. Interval b2 ke 3 (augmented 2nd) adalah signature sound. Pikirkan Misirlou.",
      harmonicApplications: [
        "Solo di atas 7b9, 7susb9 chords.",
        "Flamenco, metal, dan Middle-Eastern composition.",
        "V chord di context harmonic minor (E Phrygian Dom = mode 5 dari A harmonic minor).",
      ],
    },
  },

  lydian_sharp2: {
    name: "Lydian ♯2",
    aliases: ["Harmonic Minor Mode 6"],
    ints: [0, 3, 4, 6, 7, 9, 11],
    deg: ["1", "#2", "3", "#4", "5", "6", "7"],
    desc: "Mode ke-6 harmonic minor: Lydian dengan #2 (augmented 2nd dari root). Warna cerah tapi dengan gap tonal unik.",
    family: "harmonic-minor-mode",
    region: "Western",
    parentScale: "Harmonic minor",
    modeOf: "Mode 6 dari harmonic minor",
    characteristicDegrees: ["#2", "#4"],
    avoidDegrees: [],
    commonChords: ["maj7", "maj7#11"],
    relatedScales: ["lydian", "harmonic_minor"],
    genres: ["Jazz", "Art music", "Contemporary classical"],
    difficulty: "advanced",
    songExamples: [],
    learning: {
      practiceTips: [
        "Jarang dipakai standalone — pahami sebagai bagian dari harmonic minor system.",
        "Fokus pada gap #2→3 (augmented 2nd dari root).",
      ],
      earTrainingHint:
        "Lydian cerah dengan gap tonal unik di bawah (#2→3). Terdengar bright tapi 'exotic'.",
      harmonicApplications: ["Konteks bVI chord di harmonic minor system."],
    },
  },

  ultralocrian: {
    name: "Ultra Locrian",
    aliases: ["Altered Diminished", "Harmonic Minor Mode 7"],
    ints: [0, 1, 3, 4, 6, 8, 9],
    deg: ["1", "b2", "b3", "3", "b5", "b6", "6"],
    desc: "Mode ke-7 harmonic minor: mode paling gelap dan paling diminished — jarang dipakai secara standalone.",
    family: "harmonic-minor-mode",
    region: "Western",
    parentScale: "Harmonic minor",
    modeOf: "Mode 7 dari harmonic minor",
    characteristicDegrees: ["b2", "b5", "b6"],
    avoidDegrees: [],
    commonChords: ["dim7"],
    relatedScales: ["locrian", "altered", "harmonic_minor"],
    genres: ["Avant-garde", "Contemporary classical"],
    difficulty: "advanced",
    songExamples: [],
    learning: {
      practiceTips: [
        "Mode paling gelap — gunakan hanya untuk warna khusus.",
        "Relate ke dim7 chord context.",
      ],
      earTrainingHint:
        "Paling gelap dan diminished dari semua harmonic minor modes. Terdengar chaotic dan tense.",
      harmonicApplications: ["Konteks vii°7 chord di harmonic minor system."],
    },
  },

  // ╔══════════════════════════════════════════════════════╗
  // ║  5. PENTATONIC SCALES                               ║
  // ╚══════════════════════════════════════════════════════╝

  major_pent: {
    name: "Major Pentatonic",
    aliases: ["Pentatonic Major"],
    ints: [0, 2, 4, 7, 9],
    deg: ["1", "2", "3", "5", "6"],
    desc: "Skala 5 nada mayor tanpa 4 dan 7 — sangat clean, singable, dan aman untuk melodi dan improvisasi pemula.",
    family: "pentatonic",
    region: "Universal",
    parentScale: "Major scale",
    modeOf: "Subset major scale",
    characteristicDegrees: ["2", "6"],
    avoidDegrees: [],
    commonChords: ["maj", "6", "add9", "sus2"],
    relatedScales: ["ionian", "minor_pent", "major_pent_b3"],
    genres: ["Country", "Pop", "Gospel", "Folk", "Rock classic"],
    difficulty: "beginner",
    songExamples: [
      { title: "My Girl", artist: "The Temptations" },
      { title: "Country Roads", artist: "John Denver" },
      { title: "Amazing Grace", artist: "Traditional" },
    ],
    learning: {
      teachingOrder: 3,
      pianoFingering: {
        referenceRoot: "C",
        rightHandAsc: "1-2-3-1-2",
        leftHandAsc: "5-3-2-1-3",
        notes:
          "Hanya 5 nada — lebih simpel dari major scale. Thumb crossing tetap di posisi 3→1.",
      },
      guitarPositions: [
        {
          name: "Box 1 (Root position)",
          startFret: 2,
          description:
            "2 nada per senar, pola box. Root di senar 6 dan 1. Pola paling natural.",
        },
        {
          name: "Box 2",
          startFret: 4,
          description:
            "Shift naik — root position kedua. Cocok untuk slide runs.",
        },
        {
          name: "Full 5-position System",
          startFret: 0,
          description:
            "Pelajari semua 5 box positions yang menutupi seluruh fretboard.",
        },
      ],
      practiceTips: [
        "Pelajari semua 5 box positions — ini investasi seumur hidup untuk gitar.",
        "Mainkan di atas maj, 6, add9 chords — tidak ada wrong notes!",
        "Latih connecting boxes: naik di Box 1, lanjut ke Box 2, dst.",
        "Piano: gunakan untuk improvisasi pemula — 5 nada = tidak ada wrong notes di atas progresi mayor.",
      ],
      earTrainingHint:
        "Terdengar happy, simple, dan 'country'. Sangat singable. Pikirkan Amazing Grace atau My Girl.",
      harmonicApplications: [
        "Solo aman di atas semua progresi mayor.",
        "Country, gospel, dan folk melodi.",
        "Mixable dengan minor pentatonic untuk warna blues/rock.",
      ],
    },
  },

  minor_pent: {
    name: "Minor Pentatonic",
    aliases: ["Pentatonic Minor"],
    ints: [0, 3, 5, 7, 10],
    deg: ["1", "b3", "4", "5", "b7"],
    desc: "Skala 5 nada minor paling populer untuk solo gitar — pattern ergonomis, aman di banyak progresi minor/blues, ekspresif untuk bending.",
    family: "pentatonic",
    region: "Universal",
    parentScale: "Natural minor",
    modeOf: "Subset minor scale",
    characteristicDegrees: ["b3", "b7"],
    avoidDegrees: [],
    commonChords: ["m", "m7", "7"],
    relatedScales: ["natural_minor", "blues", "major_pent"],
    genres: ["Blues", "Rock", "Funk", "Pop-rock", "Metal lead"],
    difficulty: "beginner",
    songExamples: [
      { title: "Stairway to Heaven (solo)", artist: "Led Zeppelin" },
      { title: "Back in Black", artist: "AC/DC" },
      { title: "Smoke on the Water", artist: "Deep Purple" },
    ],
    learning: {
      teachingOrder: 3,
      pianoFingering: {
        referenceRoot: "A",
        rightHandAsc: "1-2-3-1-2",
        leftHandAsc: "3-2-1-3-2",
        notes:
          "5 nada dari A: A-C-D-E-G. Sangat comfortable di piano, cocok untuk pemula.",
      },
      guitarPositions: [
        {
          name: "Box 1 (5th fret)",
          startFret: 5,
          description:
            "THE most famous guitar scale pattern. 2 nada per senar. Root di senar 6 dan 1.",
        },
        {
          name: "Box 2 (8th fret)",
          startFret: 8,
          description: "Shift naik — great untuk bending dan vibrato.",
        },
        {
          name: "Box 3 (10th fret)",
          startFret: 10,
          description: "Position tinggi, cocok untuk lead phrases.",
        },
        {
          name: "Full 5-box System",
          startFret: 0,
          description: "Master semua 5 boxes = kuasai seluruh fretboard.",
        },
      ],
      practiceTips: [
        "Mulai dari Box 1 di fret 5 (Am) — ini pola gitar paling penting sedunia.",
        "Latih bending: bend b3 ke major 3, bend 4 ke 5, bend b7 ke root.",
        "Mainkan di atas backing track Am blues/rock — ekspresifkan dengan vibrato.",
        "Piano: improvisasi di A minor pentatonic atas backing track — semua nada 'aman'.",
      ],
      earTrainingHint:
        "Terdengar bluesy, gritty, dan rock. Ini suara solo gitar klasik. Pikirkan Stairway to Heaven solo.",
      harmonicApplications: [
        "Solo di atas m, m7, dan bahkan dominant 7 chords.",
        "Blues/rock improvisasi dasar.",
        "Bisa dipakai di atas progresi minor DAN blues (minor pentatonic atas dominant blues).",
      ],
    },
  },

  egyptian_pent: {
    name: "Egyptian Pentatonic",
    aliases: ["Suspended Pentatonic"],
    ints: [0, 2, 5, 7, 10],
    deg: ["1", "2", "4", "5", "b7"],
    desc: "Pentatonic tanpa 3rd — tidak major maupun minor. Warna ambiguous, open, dan ancient. Mode ke-2 dari major pentatonic.",
    family: "pentatonic",
    region: "Middle East / North Africa",
    parentScale: "Major pentatonic",
    modeOf: "Mode 2 dari major pentatonic",
    characteristicDegrees: ["2", "4", "b7"],
    avoidDegrees: [],
    commonChords: ["sus2", "sus4", "7sus4"],
    relatedScales: ["major_pent", "minor_pent", "mixolydian"],
    genres: ["World music", "Ambient", "Film score", "Folk"],
    difficulty: "intermediate",
    songExamples: [
      { title: "Egyptian-inspired film scores", artist: "Various" },
    ],
    learning: {
      practiceTips: [
        "Tanpa 3rd → ambiguous major/minor. Gunakan untuk soundscape yang 'ancient'.",
        "Mode 2 dari major pentatonic — pindah posisi box saja.",
        "Cocok untuk sus2, sus4, dan 7sus4 chords.",
      ],
      earTrainingHint:
        "Terdengar open, spacious, dan ancient. Tanpa major atau minor quality — ambiguous dan misterius.",
      harmonicApplications: [
        "Komposisi bertema ancient, Egyptian, atau 'desert'.",
        "Solo di atas sus chords.",
        "World music dan ambient textures.",
      ],
    },
  },

  man_gong_pent: {
    name: "Man Gong Pentatonic",
    aliases: ["Blues Minor Pentatonic"],
    ints: [0, 3, 5, 8, 10],
    deg: ["1", "b3", "4", "b6", "b7"],
    desc: "Mode ke-3 dari major pentatonic. Karakter minor yang lebih gelap dari minor pentatonic standar karena b6.",
    family: "pentatonic",
    region: "East Asia",
    parentScale: "Major pentatonic",
    modeOf: "Mode 3 dari major pentatonic",
    characteristicDegrees: ["b3", "b6"],
    avoidDegrees: [],
    commonChords: ["m"],
    relatedScales: ["minor_pent", "natural_minor"],
    genres: ["Traditional Chinese", "Blues", "Folk"],
    difficulty: "intermediate",
    songExamples: [],
    learning: {
      practiceTips: [
        "Mode 3 dari major pentatonic — shift box positions.",
        "Lebih gelap dari minor pentatonic biasa karena b6.",
      ],
      earTrainingHint:
        "Minor pentatonic yang lebih gelap — b6 menambah rasa kesedihan yang dalam.",
      harmonicApplications: [
        "Warna gelap untuk komposisi minor.",
        "Traditional Chinese music context.",
      ],
    },
  },

  ritusen_pent: {
    name: "Ritusen Pentatonic",
    aliases: ["Ritsusen", "Scottish Pentatonic"],
    ints: [0, 2, 5, 7, 9],
    deg: ["1", "2", "4", "5", "6"],
    desc: "Pentatonic tanpa 3rd dan 7th, dengan natural 6 yang memberikan warna celtic/pastoral.",
    family: "pentatonic",
    region: "Japan / Scotland",
    parentScale: "Major pentatonic",
    modeOf: "Mode 4 dari major pentatonic",
    characteristicDegrees: ["2", "6"],
    avoidDegrees: [],
    commonChords: ["sus2", "sus4", "6"],
    relatedScales: ["major_pent", "egyptian_pent"],
    genres: ["Celtic", "Japanese traditional", "Folk"],
    difficulty: "intermediate",
    songExamples: [{ title: "Auld Lang Syne", artist: "Scottish Traditional" }],
    learning: {
      practiceTips: [
        "Mode 4 dari major pentatonic — explore sebagai alternative 'pastoral' sound.",
        "Tanpa 3rd dan 7th → sangat open dan celtic.",
      ],
      earTrainingHint:
        "Terdengar pastoral, celtic, dan optimistic tanpa definisi major/minor yang jelas.",
      harmonicApplications: [
        "Celtic dan Scottish folk music.",
        "Japanese traditional music.",
        "Ambient dan pastoral compositions.",
      ],
    },
  },

  // ╔══════════════════════════════════════════════════════╗
  // ║  6. BLUES SCALES                                    ║
  // ╚══════════════════════════════════════════════════════╝

  blues: {
    name: "Blues Scale",
    aliases: ["Minor Blues"],
    ints: [0, 3, 5, 6, 7, 10],
    deg: ["1", "b3", "4", "b5", "5", "b7"],
    desc: "Minor pentatonic dengan tambahan blue note (b5) — rasa gritty, raw, dan tegang-resolutif khas blues dan rock lead.",
    family: "blues",
    region: "America (African-American origin)",
    parentScale: "Minor pentatonic",
    modeOf: "Minor pentatonic + blue note",
    characteristicDegrees: ["b5", "b3", "b7"],
    avoidDegrees: [],
    commonChords: ["7", "9", "13", "m7"],
    relatedScales: ["minor_pent", "major_blues", "mixolydian"],
    genres: ["Blues", "Rock", "Classic rock", "Funk-blues", "Jazz-blues"],
    difficulty: "beginner",
    songExamples: [
      { title: "The Thrill Is Gone", artist: "B.B. King" },
      { title: "Johnny B. Goode", artist: "Chuck Berry" },
      { title: "Pride and Joy", artist: "Stevie Ray Vaughan" },
    ],
    learning: {
      teachingOrder: 4,
      pianoFingering: {
        referenceRoot: "A",
        rightHandAsc: "1-2-3-1-2-3",
        leftHandAsc: "3-2-1-4-3-2",
        notes:
          "6 nada: A-C-D-Eb-E-G. Chromatic b5 (Eb) adalah blue note — ekspresikan dengan grace note atau slide.",
      },
      guitarPositions: [
        {
          name: "Box 1 - Blues (5th fret)",
          startFret: 5,
          description:
            "Minor pentatonic Box 1 + tambahan b5 di senar 4 dan 3. Satu nada tambahan = warna blues.",
        },
        {
          name: "Extended Blues Box",
          startFret: 5,
          description:
            "Minor pentatonic + b5 di semua posisi box. Latih sliding dari b5 ke 5.",
        },
      ],
      practiceTips: [
        "Blue note (b5) paling efektif sebagai passing tone — jangan berhenti terlalu lama di sana.",
        "Latih slide/hammer-on dari b5 ke 5 (Eb ke E) — ini signature sound blues.",
        "Mainkan di atas 12-bar blues progression: I7-IV7-V7.",
        "Gunakan bending dari b3 ke 3 untuk mix antara minor dan major blues feel.",
      ],
      earTrainingHint:
        "Gritty, raw, dan tegang. Blue note menambah 'rasa sakit yang enak' pada minor pentatonic. Pikirkan B.B. King.",
      harmonicApplications: [
        "12-bar blues (I7-IV7-V7) — konteks utama.",
        "Rock/blues lead playing.",
        "Mix dengan major blues untuk warna yang lebih kaya.",
      ],
    },
  },

  major_blues: {
    name: "Major Blues Scale",
    aliases: ["Blues Major"],
    ints: [0, 2, 3, 4, 7, 9],
    deg: ["1", "2", "b3", "3", "5", "6"],
    desc: "Major pentatonic dengan chromatic passing tone antara 2 dan 3 — memberikan mix antara sweet major dan gritty blues.",
    family: "blues",
    region: "America",
    parentScale: "Major pentatonic",
    modeOf: "Major pentatonic + b3 blue note",
    characteristicDegrees: ["b3", "3"],
    avoidDegrees: [],
    commonChords: ["7", "6", "9", "maj"],
    relatedScales: ["major_pent", "blues", "mixolydian"],
    genres: ["Blues", "Country blues", "Gospel", "Rock-n-roll"],
    difficulty: "intermediate",
    songExamples: [
      { title: "Sweet Home Alabama", artist: "Lynyrd Skynyrd" },
      { title: "The Wind Cries Mary", artist: "Jimi Hendrix" },
    ],
    learning: {
      practiceTips: [
        "Mix dengan minor blues untuk vocabulary yang lebih kaya.",
        "Chromatic passing tone b3→3 sangat ekspresif — latih slide/hammer-on.",
        "Mainkan di atas dominant 7th chords untuk country/blues feel.",
      ],
      earTrainingHint:
        "Happy blues — major pentatonic dengan 'grit' dari chromatic passing b3. Pikirkan country dan gospel.",
      harmonicApplications: [
        "Country blues dan gospel.",
        "Mixing major/minor blues untuk lead playing.",
        "Solo di atas major dan dominant chords.",
      ],
    },
  },

  // ╔══════════════════════════════════════════════════════╗
  // ║  7. SYMMETRIC SCALES                                ║
  // ╚══════════════════════════════════════════════════════╝

  whole_tone: {
    name: "Whole Tone Scale",
    aliases: ["Augmented Scale (whole-tone)"],
    ints: [0, 2, 4, 6, 8, 10],
    deg: ["1", "2", "3", "#4", "#5", "b7"],
    desc: "Skala 6 nada simetris — semua langkah whole-tone (2 semitone). Hanya 2 transposisi unik. Karakter: mengambang, dreamlike, tanpa gravitasi tonal.",
    family: "symmetric",
    region: "Western (Impressionist)",
    parentScale: "None (symmetric)",
    characteristicDegrees: ["#4", "#5"],
    avoidDegrees: [],
    commonChords: ["aug", "7#5"],
    relatedScales: ["lydian_augmented", "altered"],
    genres: [
      "Impressionist",
      "Jazz",
      "Film score",
      "Ambient",
      "Debussy-inspired",
    ],
    difficulty: "intermediate",
    songExamples: [
      { title: "Voiles", artist: "Claude Debussy" },
      {
        title: "You Are the Sunshine of My Life (bridge)",
        artist: "Stevie Wonder",
      },
    ],
    learning: {
      practiceTips: [
        "Hanya 2 transposisi unik (C whole tone dan Db whole tone) — pelajari keduanya.",
        "Gunakan sebagai 'effect' bukan tonality utama — paling efektif sebagai passer.",
        "Piano: semua whole-step → fingering sangat reguler: 1-2-3-1-2-3.",
      ],
      earTrainingHint:
        "Dreamlike, mengambang, tanpa gravitasi. Tidak ada resting point. Pikirkan suara harp shimmer di film.",
      harmonicApplications: [
        "Solo di atas augmented dan 7#5 chords.",
        "Transitional passages — 'dissolve' effect.",
        "Impressionist composition (Debussy).",
      ],
    },
  },

  diminished_hw: {
    name: "Diminished (Half-Whole)",
    aliases: ["Octatonic H-W", "Dominant Diminished"],
    ints: [0, 1, 3, 4, 6, 7, 9, 10],
    deg: ["1", "b2", "b3", "3", "b5", "5", "6", "b7"],
    desc: "Skala 8 nada simetris H-W bergantian — used over dominant chord. 3 transposisi unik. Kaya akan tension notes (b9, #9, #11, 13).",
    family: "symmetric",
    region: "Western",
    parentScale: "None (symmetric)",
    characteristicDegrees: ["b2", "3", "b5"],
    avoidDegrees: [],
    commonChords: ["7b9", "7#9", "13b9", "dim7"],
    relatedScales: ["diminished_wh", "altered", "blues"],
    genres: ["Jazz", "Bebop", "Fusion", "Film score", "Metal (advanced)"],
    difficulty: "advanced",
    songExamples: [
      { title: "Outer Spaceways Incorporated", artist: "Sun Ra" },
      { title: "Have You Met Miss Jones?", artist: "Standard" },
    ],
    learning: {
      practiceTips: [
        "Hanya 3 transposisi unik — pelajari ketiganya.",
        "Sangat kaya tension notes (b9, #9, #11, 13) — ideal untuk jazz dominant.",
        "Latih pattern simetris: H-W-H-W-H-W-H-W.",
      ],
      earTrainingHint:
        "Tension bertumpuk — terdengar 'chromatic tapi terstruktur'. Warna jazz yang sophisticated dan dark.",
      harmonicApplications: [
        "Solo di atas 7b9, 7#9, 13b9 chords.",
        "Bebop dan advanced jazz.",
        "Film score tension building.",
      ],
    },
  },

  diminished_wh: {
    name: "Diminished (Whole-Half)",
    aliases: ["Octatonic W-H", "Diminished Scale"],
    ints: [0, 2, 3, 5, 6, 8, 9, 11],
    deg: ["1", "2", "b3", "4", "b5", "b6", "6", "7"],
    desc: "Skala 8 nada simetris W-H bergantian — used over diminished chord. Banyak digunakan Messiaen dan Bartók.",
    family: "symmetric",
    region: "Western",
    parentScale: "None (symmetric)",
    characteristicDegrees: ["b3", "b5", "7"],
    avoidDegrees: [],
    commonChords: ["dim7", "mMaj7"],
    relatedScales: ["diminished_hw", "harmonic_minor"],
    genres: ["Jazz", "Classical (20th century)", "Film score"],
    difficulty: "advanced",
    songExamples: [
      {
        title: "Modes of Limited Transposition excerpts",
        artist: "Olivier Messiaen",
      },
    ],
    learning: {
      practiceTips: [
        "Dipakai di atas dim7 chord — 3 transposisi unik.",
        "Pattern simetris W-H-W-H — latih dengan awareness akan symmetry-nya.",
      ],
      earTrainingHint:
        "Similar ke H-W diminished tapi 'dimulai dari tempat berbeda'. Karakter diminished yang kuat.",
      harmonicApplications: [
        "Solo di atas dim7 dan mMaj7 chords.",
        "Messiaen dan Bartók-inspired composition.",
      ],
    },
  },

  chromatic: {
    name: "Chromatic Scale",
    aliases: [],
    ints: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    deg: ["1", "b2", "2", "b3", "3", "4", "b5", "5", "b6", "6", "b7", "7"],
    desc: "Semua 12 semitone — referensi tonal total. Digunakan untuk teknik latihan, passing tones, dan musik atonal.",
    family: "symmetric",
    region: "Universal",
    parentScale: "None",
    characteristicDegrees: [],
    avoidDegrees: [],
    commonChords: [],
    relatedScales: [],
    genres: ["All genres (exercise)", "Atonal", "Serial"],
    difficulty: "beginner",
    songExamples: [
      { title: "Flight of the Bumblebee", artist: "Rimsky-Korsakov" },
    ],
    learning: {
      practiceTips: [
        "Latih ascending/descending 12 semitone sebagai warmup teknis.",
        "Piano: gunakan fingering 1-3-1-3-1-2-3-1-3-1-3-1 (standard chromatic fingering).",
        "Gitar: gunakan 4 frets per string dengan 4 jari untuk legato exercise.",
      ],
      earTrainingHint:
        "Semua 12 nada — tidak ada 'warna' tonal. Digunakan untuk efek, bukan tonalitas.",
      harmonicApplications: [
        "Chromatic passing tones di semua konteks.",
        "Teknik latihan (warmup, finger independence).",
        "Atonal dan serial composition.",
      ],
    },
  },

  augmented_scale: {
    name: "Augmented Scale",
    aliases: ["Symmetric Augmented", "Augmented Hexatonic"],
    ints: [0, 3, 4, 7, 8, 11],
    deg: ["1", "b3", "3", "5", "#5", "7"],
    desc: "Skala 6 nada simetris yang dibangun dari dua augmented triads berjarak minor 3rd. 4 transposisi unik.",
    family: "symmetric",
    region: "Western",
    parentScale: "None (symmetric)",
    characteristicDegrees: ["3", "#5", "7"],
    avoidDegrees: [],
    commonChords: ["aug", "maj7#5"],
    relatedScales: ["whole_tone", "lydian_augmented"],
    genres: ["Jazz", "Classical (20th century)", "Fusion"],
    difficulty: "advanced",
    songExamples: [{ title: "Central Park West", artist: "John Coltrane" }],
    learning: {
      practiceTips: [
        "4 transposisi unik — dibangun dari 2 augmented triads.",
        "Latih alternating antara 2 augmented triads yang membentuk skala ini.",
      ],
      earTrainingHint:
        "Simetris dan 'mengambang' — rasa augmented yang kuat. Warna Coltrane-esque.",
      harmonicApplications: [
        "Solo di atas aug dan maj7#5 chords.",
        "Coltrane changes vocabulary.",
      ],
    },
  },

  tritone_scale: {
    name: "Tritone Scale",
    aliases: ["Petrushka Scale"],
    ints: [0, 1, 4, 6, 7, 10],
    deg: ["1", "b2", "3", "b5", "5", "b7"],
    desc: "Skala hexatonic dari dua major triads berjarak tritone. Digunakan Stravinsky dalam Petrushka. Sangat menantang secara tonal.",
    family: "symmetric",
    region: "Western (20th century)",
    parentScale: "None (synthetic)",
    characteristicDegrees: ["b2", "3", "b5"],
    avoidDegrees: [],
    commonChords: ["7b5"],
    relatedScales: ["diminished_hw", "altered"],
    genres: ["Classical (modern)", "Jazz", "Film score"],
    difficulty: "advanced",
    songExamples: [{ title: "Petrushka", artist: "Igor Stravinsky" }],
    learning: {
      practiceTips: [
        "Dari 2 major triads berjarak tritone — latih kedua triad terpisah dulu.",
        "Sangat polytonal — gunakan hanya jika paham konteks harmoniknya.",
      ],
      earTrainingHint:
        "Sangat bi-tonal — 2 major triads berjarak tritone bertabrakan. Petrushka effect.",
      harmonicApplications: [
        "Stravinsky-style polytonal composition.",
        "Advanced jazz chromaticism.",
      ],
    },
  },

  // ╔══════════════════════════════════════════════════════╗
  // ║  8. BEBOP SCALES                                    ║
  // ╚══════════════════════════════════════════════════════╝

  bebop_dominant: {
    name: "Bebop Dominant",
    aliases: ["Bebop Scale", "Bebop Mixolydian"],
    ints: [0, 2, 4, 5, 7, 9, 10, 11],
    deg: ["1", "2", "3", "4", "5", "6", "b7", "7"],
    desc: "Mixolydian + passing natural 7 — skala 8 nada agar chord tones jatuh di beat kuat saat dimainkan dalam eighth notes.",
    family: "bebop",
    region: "America",
    parentScale: "Mixolydian",
    characteristicDegrees: ["b7", "7"],
    avoidDegrees: [],
    commonChords: ["7", "9", "13"],
    relatedScales: ["mixolydian", "bebop_major", "bebop_dorian"],
    genres: ["Bebop", "Jazz", "Swing"],
    difficulty: "advanced",
    songExamples: [
      { title: "Anthropology", artist: "Charlie Parker" },
      { title: "Donna Lee", artist: "Charlie Parker" },
    ],
    learning: {
      practiceTips: [
        "Kunci: passing tone (natural 7) harus jatuh di offbeat agar chord tones tepat di downbeat.",
        "Latih 8th note runs descending — ini konteks utama di jazz.",
        "Mainkan di atas dominant 7 chord dalam swing tempo.",
      ],
      earTrainingHint:
        "Mixolydian yang terdengar 'jazz' karena chromatic passing. 8th note lines yang smooth.",
      harmonicApplications: [
        "Solo di atas 7, 9, 13 chords di jazz.",
        "Bebop line vocabulary — ascending/descending 8th notes.",
      ],
    },
  },

  bebop_major: {
    name: "Bebop Major",
    aliases: ["Bebop Ionian"],
    ints: [0, 2, 4, 5, 7, 8, 9, 11],
    deg: ["1", "2", "3", "4", "5", "b6", "6", "7"],
    desc: "Major scale + chromatic passing tone (b6) — keeps chord tones on downbeats. Useful for maj7 and 6 contexts.",
    family: "bebop",
    region: "America",
    parentScale: "Ionian",
    characteristicDegrees: ["b6", "6"],
    avoidDegrees: [],
    commonChords: ["maj7", "6"],
    relatedScales: ["ionian", "bebop_dominant"],
    genres: ["Bebop", "Jazz"],
    difficulty: "advanced",
    songExamples: [{ title: "Joy Spring", artist: "Clifford Brown" }],
    learning: {
      practiceTips: [
        "Chromatic passing b6 harus jatuh di offbeat.",
        "Latih di atas maj7 dan 6 chord context.",
      ],
      earTrainingHint:
        "Major scale yang terdengar 'jazzy' karena chromatic passing b6.",
      harmonicApplications: [
        "Solo di atas maj7 dan 6 chords.",
        "Bebop lines di konteks major.",
      ],
    },
  },

  bebop_dorian: {
    name: "Bebop Dorian",
    aliases: ["Bebop Minor"],
    ints: [0, 2, 3, 4, 5, 7, 9, 10],
    deg: ["1", "2", "b3", "3", "4", "5", "6", "b7"],
    desc: "Dorian + chromatic passing major 3rd — skala 8 nada untuk m7 chord context di jazz.",
    family: "bebop",
    region: "America",
    parentScale: "Dorian",
    characteristicDegrees: ["b3", "3"],
    avoidDegrees: [],
    commonChords: ["m7", "m9"],
    relatedScales: ["dorian", "bebop_dominant"],
    genres: ["Bebop", "Jazz"],
    difficulty: "advanced",
    songExamples: [{ title: "So What", artist: "Miles Davis" }],
    learning: {
      practiceTips: [
        "Chromatic passing 3 (major 3rd) harus di offbeat.",
        "Latih di atas m7 chord context.",
      ],
      earTrainingHint:
        "Dorian yang terdengar 'jazzy' karena chromatic passing major 3rd.",
      harmonicApplications: [
        "Solo di atas m7 dan m9 chords.",
        "Minor ii-V-i bebop lines.",
      ],
    },
  },

  bebop_locrian: {
    name: "Bebop Half-Diminished",
    aliases: ["Bebop Locrian"],
    ints: [0, 1, 3, 5, 6, 7, 8, 10],
    deg: ["1", "b2", "b3", "4", "b5", "5", "b6", "b7"],
    desc: "Locrian + natural 5 — skala 8 nada untuk m7b5 context, keeping chord tones aligned.",
    family: "bebop",
    region: "America",
    parentScale: "Locrian",
    characteristicDegrees: ["b5", "5"],
    avoidDegrees: [],
    commonChords: ["m7b5"],
    relatedScales: ["locrian", "locrian_natural2"],
    genres: ["Bebop", "Jazz"],
    difficulty: "advanced",
    songExamples: [],
    learning: {
      practiceTips: [
        "Natural 5 sebagai passing tone menjaga chord tones di downbeat.",
        "Paling jarang dipakai dari bebop scales tapi penting untuk m7b5 context.",
      ],
      earTrainingHint:
        "Locrian yang di-smooth-kan dengan natural 5 passing tone.",
      harmonicApplications: ["Solo di atas m7b5 chords dalam bebop lines."],
    },
  },

  // ╔══════════════════════════════════════════════════════╗
  // ║  9. MIDDLE EASTERN / ARABIC / TURKISH               ║
  // ╚══════════════════════════════════════════════════════╝

  double_harmonic: {
    name: "Double Harmonic Major",
    aliases: ["Arabic Scale", "Byzantine Scale", "Gypsy Major"],
    ints: [0, 1, 4, 5, 7, 8, 11],
    deg: ["1", "b2", "3", "4", "5", "b6", "7"],
    desc: "Dua augmented 2nd gaps (b2-3 dan b6-7) menghasilkan warna yang sangat dramatic, Arabic, dan Byzantine. Skala khas Timur Tengah.",
    family: "middle-eastern",
    region: "Middle East / Eastern Mediterranean",
    parentScale: "None",
    characteristicDegrees: ["b2", "3", "b6", "7"],
    avoidDegrees: [],
    commonChords: ["maj", "7b9"],
    relatedScales: ["phrygian_dominant", "harmonic_minor", "hungarian_minor"],
    genres: ["Arabic", "Byzantine", "Middle-eastern", "Metal", "Film score"],
    difficulty: "advanced",
    songExamples: [
      { title: "Misirlou", artist: "Dick Dale" },
      { title: "Kashmir (snippets)", artist: "Led Zeppelin" },
    ],
    learning: {
      teachingOrder: 13,
      pianoFingering: {
        referenceRoot: "C",
        rightHandAsc: "1-2-3-1-2-3-4-5",
        leftHandAsc: "5-4-3-2-1-3-2-1",
        notes:
          "Dua augmented 2nd gaps (b2-3 dan b6-7). Stretching jari diperlukan — latih pelan.",
      },
      practiceTips: [
        "Latih augmented 2nd intervals secara terpisah — b2→3 dan b6→7.",
        "Identik dengan Raga Bhairav — explore koneksi cross-cultural.",
        "Mainkan descending untuk merasakan warna Byzantine/Arabic.",
      ],
      earTrainingHint:
        "Sangat dramatic dan 'exotic Middle-Eastern'. Dua gap augmented 2nd memberikan warna Byzantine kuat. Pikirkan Misirlou.",
      harmonicApplications: [
        "Komposisi Arabic, Byzantine, dan Middle-Eastern.",
        "Film scoring dramatic/exotic.",
        "Metal riffing dengan warna Eastern.",
      ],
    },
  },

  maqam_hijaz: {
    name: "Maqam Hijaz",
    aliases: ["Hijaz Scale"],
    ints: [0, 1, 4, 5, 7, 8, 10],
    deg: ["1", "b2", "3", "4", "5", "b6", "b7"],
    desc: "Salah satu maqam paling terkenal — identik dengan Phrygian Dominant. Warna spiritual dan meditatif dalam tradisi Arab & Turkish.",
    family: "middle-eastern",
    region: "Arab World / Turkey",
    parentScale: "Maqam system",
    characteristicDegrees: ["b2", "3", "b6"],
    avoidDegrees: [],
    commonChords: ["7b9"],
    relatedScales: ["phrygian_dominant", "double_harmonic"],
    genres: ["Arabic", "Turkish", "Islamic devotional", "Oud music"],
    difficulty: "intermediate",
    songExamples: [
      { title: "Lamma Bada Yatathanna", artist: "Traditional Arabic" },
    ],
    learning: {
      practiceTips: [
        "Identik dengan Phrygian Dominant — setelah kuasai Phrygian Dom, ini otomatis bisa.",
        "Mainkan dengan ornamentasi khas Arabic: melisma, trills, dan grace notes.",
      ],
      earTrainingHint:
        "Warna spiritual Arabic yang khas. Identik dengan Phrygian Dominant — b2 + 3 + b6.",
      harmonicApplications: [
        "Musik Arabic dan Turkish classical.",
        "Oud dan ney improvisasi.",
      ],
    },
  },

  maqam_bayati: {
    name: "Maqam Bayati",
    aliases: ["Bayati Scale"],
    ints: [0, 1, 3, 5, 7, 8, 10],
    deg: ["1", "b2", "b3", "4", "5", "b6", "b7"],
    desc: "Maqam Bayati mirip Phrygian natural. Salah satu maqam paling populer dalam musik Arab — warna melancholik dan meditatif.",
    family: "middle-eastern",
    region: "Arab World",
    parentScale: "Maqam system",
    characteristicDegrees: ["b2", "b3"],
    avoidDegrees: [],
    commonChords: ["m"],
    relatedScales: ["phrygian", "maqam_hijaz"],
    genres: ["Arabic classical", "Turkish folk", "Oud music"],
    difficulty: "intermediate",
    songExamples: [{ title: "Enta Omri", artist: "Umm Kulthum" }],
    learning: {
      practiceTips: [
        "Identik dengan Phrygian — explore ornamentasi khas Arabic.",
        "Microtonalnya tidak captured di 12-TET — di dunia Arab, quarter-tone dipakai.",
      ],
      earTrainingHint:
        "Warna melankolis Arabic — Phrygian dalam konteks Timur Tengah. Emosional dan meditatif.",
      harmonicApplications: [
        "Musik Arabic classical dan folk.",
        "Backdrop melankolis untuk komposisi film Middle-Eastern.",
      ],
    },
  },

  maqam_rast: {
    name: "Maqam Rast",
    aliases: ["Rast Scale"],
    ints: [0, 2, 4, 5, 7, 9, 10],
    deg: ["1", "2", "3", "4", "5", "6", "b7"],
    desc: "Maqam Rast ≈ Mixolydian pada 12-TET. Maqam 'default' dalam tradisi Arab — warna royal, confident, dan celebratory.",
    family: "middle-eastern",
    region: "Arab World / Turkey / Iran",
    parentScale: "Maqam system",
    characteristicDegrees: ["3", "b7"],
    avoidDegrees: [],
    commonChords: ["7", "maj"],
    relatedScales: ["mixolydian"],
    genres: ["Arabic", "Turkish", "Persian", "Andalusian"],
    difficulty: "intermediate",
    songExamples: [{ title: "Ya Rayah", artist: "Dahmane El Harrachi" }],
    learning: {
      practiceTips: [
        "Identik dengan Mixolydian di 12-TET — explore ornamentasi Arab.",
        "Maqam 'default' Arab — ini starting point untuk belajar maqam system.",
      ],
      earTrainingHint:
        "Royal dan confident — Mixolydian dalam konteks Arab. Warna celebratory.",
      harmonicApplications: ["Musik Arabic classical.", "Andalusian music."],
    },
  },

  maqam_saba: {
    name: "Maqam Saba",
    aliases: ["Saba Scale"],
    ints: [0, 1, 3, 4, 7, 8, 10],
    deg: ["1", "b2", "b3", "3", "5", "b6", "b7"],
    desc: "Maqam yang paling emosional dan melankolis dalam tradisi Arab — dengan dua augmented gap yang menciptakan drama intens.",
    family: "middle-eastern",
    region: "Arab World",
    parentScale: "Maqam system",
    characteristicDegrees: ["b2", "3"],
    avoidDegrees: [],
    commonChords: ["m", "dim"],
    relatedScales: ["maqam_bayati", "phrygian_dominant"],
    genres: ["Arabic maqam", "Sufi music", "Tarab tradition"],
    difficulty: "advanced",
    songExamples: [
      {
        title: "Al Atlal",
        artist: "Umm Kulthum",
        note: "Saba sections dalam masterpiece ini",
      },
    ],
    learning: {
      practiceTips: [
        "Maqam paling emosional — gunakan phrasing yang ekspresif dan rubato.",
        "Dua augmented gap menciptakan drama intens — latih interval awareness.",
      ],
      earTrainingHint:
        "Paling emosional dan dramatic dari maqam Arab. Warna melankolis yang sangat dalam.",
      harmonicApplications: [
        "Ekspresi emosional dalam musik Arab.",
        "Tarab tradition (ecstasy music).",
      ],
    },
  },

  maqam_nahawand: {
    name: "Maqam Nahawand",
    aliases: ["Nahawand Scale"],
    ints: [0, 2, 3, 5, 7, 8, 11],
    deg: ["1", "2", "b3", "4", "5", "b6", "7"],
    desc: "Maqam Nahawand ≈ Harmonic Minor pada 12-TET. Warna minor dramatis yang sering dipakai untuk penutup dan resolusi.",
    family: "middle-eastern",
    region: "Arab World",
    parentScale: "Maqam system",
    characteristicDegrees: ["b3", "7"],
    avoidDegrees: [],
    commonChords: ["m", "mMaj7"],
    relatedScales: ["harmonic_minor"],
    genres: ["Arabic", "Turkish", "Film score"],
    difficulty: "intermediate",
    songExamples: [],
    learning: {
      practiceTips: [
        "Identik dengan Harmonic Minor — koneksi langsung dengan Western harmony.",
        "Mainkan dengan ornamentasi Arab untuk mendapat feel Nahawand yang autentik.",
      ],
      earTrainingHint:
        "Harmonic Minor dalam konteks Arab — dramatic dan resolving.",
      harmonicApplications: [
        "Penutup/resolusi dalam musik Arabic.",
        "Koneksi dengan harmonic minor Western.",
      ],
    },
  },

  turkish_zirguleli: {
    name: "Zirgüleli Hijaz",
    aliases: ["Double Harmonic Minor"],
    ints: [0, 2, 3, 6, 7, 8, 11],
    deg: ["1", "2", "b3", "#4", "5", "b6", "7"],
    desc: "Skala double harmonic minor — Hungarian minor yang juga muncul di tradisi Turkish sebagai Zirgüleli Hijaz. Sangat dramatis dan ekspresif.",
    family: "middle-eastern",
    region: "Turkey / Hungary",
    parentScale: "Maqam system / Hungarian",
    characteristicDegrees: ["#4", "7", "b6"],
    avoidDegrees: [],
    commonChords: ["mMaj7", "dim"],
    relatedScales: ["hungarian_minor", "harmonic_minor"],
    genres: ["Turkish", "Hungarian", "Klezmer", "Film score"],
    difficulty: "advanced",
    songExamples: [],
    learning: {
      practiceTips: [
        "Identik dengan Hungarian Minor — explore kedua tradisi.",
        "Dua augmented 2nd gaps — sama dengan Hungarian Minor.",
      ],
      earTrainingHint:
        "Hungarian Minor/Double Harmonic Minor dalam konteks Turkish. Sangat dramatis.",
      harmonicApplications: [
        "Turkish classical music.",
        "Klezmer dan Hungarian cross-reference.",
      ],
    },
  },

  // ╔══════════════════════════════════════════════════════╗
  // ║ 10. INDIAN SCALES (Thaat / Melakarta Approximations)║
  // ╚══════════════════════════════════════════════════════╝

  raga_bhairav: {
    name: "Raga Bhairav",
    aliases: ["Thaat Bhairav", "Morning Raga"],
    ints: [0, 1, 4, 5, 7, 8, 11],
    deg: ["1", "b2", "3", "4", "5", "b6", "7"],
    desc: "Raga pagi yang serius dan devosional — identik dengan Double Harmonic Major. Gateway raga untuk pemula karena structure-nya clear.",
    family: "indian",
    region: "North India (Hindustani)",
    parentScale: "Thaat Bhairav",
    characteristicDegrees: ["b2", "3", "b6", "7"],
    avoidDegrees: [],
    commonChords: ["maj", "7b9"],
    relatedScales: ["double_harmonic", "phrygian_dominant"],
    genres: ["Indian classical", "Hindustani", "Bhajan", "Film (Bollywood)"],
    difficulty: "intermediate",
    songExamples: [{ title: "Raga Bhairav alaap", artist: "Pandit Jasraj" }],
    learning: {
      practiceTips: [
        "Identik dengan Double Harmonic Major — gateway raga untuk pemula.",
        "Traditionally sung di morning hours — explore time-of-day raga theory.",
        "Ornamentasi: gunakan meend (glides) dan gamaka (oscillations).",
      ],
      earTrainingHint:
        "Serious dan devosional — warna Double Harmonic dalam konteks Indian. Morning raga feeling.",
      harmonicApplications: [
        "Indian classical improvisation.",
        "Bhajan (devotional songs).",
        "Bollywood dramatic sequences.",
      ],
    },
  },

  raga_todi: {
    name: "Raga Todi",
    aliases: ["Thaat Todi"],
    ints: [0, 1, 3, 6, 7, 8, 11],
    deg: ["1", "b2", "b3", "#4", "5", "b6", "7"],
    desc: "Raga yang sangat serius dan meditatif — pagi hari lanjut. Todi memiliki warna gelap unik karena b2 + #4 + b6.",
    family: "indian",
    region: "North India (Hindustani)",
    parentScale: "Thaat Todi",
    characteristicDegrees: ["b2", "#4", "b6"],
    avoidDegrees: [],
    commonChords: ["m"],
    relatedScales: ["phrygian", "hungarian_minor"],
    genres: ["Indian classical", "Hindustani", "Meditative"],
    difficulty: "advanced",
    songExamples: [
      { title: "Raga Todi performance", artist: "Kishori Amonkar" },
    ],
    learning: {
      practiceTips: [
        "Raga yang sangat serius — mainkan pelan dan meditatif.",
        "b2 + #4 + b6 menciptakan warna gelap unik.",
      ],
      earTrainingHint:
        "Gelap, serius, dan meditatif. Warna yang sangat unik — tidak ada padanan langsung di Western scales.",
      harmonicApplications: [
        "Meditasi dan contemplation.",
        "Indian classical morning raga (late morning).",
      ],
    },
  },

  raga_kafi: {
    name: "Raga Kafi",
    aliases: ["Thaat Kafi"],
    ints: [0, 2, 3, 5, 7, 9, 10],
    deg: ["1", "2", "b3", "4", "5", "6", "b7"],
    desc: "Raga ringan dan sensual — ≈ Dorian. Populer untuk genre semi-classical dan lagu romantis.",
    family: "indian",
    region: "North India (Hindustani)",
    parentScale: "Thaat Kafi",
    characteristicDegrees: ["b3", "6"],
    avoidDegrees: [],
    commonChords: ["m7"],
    relatedScales: ["dorian"],
    genres: ["Indian classical", "Semi-classical", "Thumri"],
    difficulty: "intermediate",
    songExamples: [{ title: "Raga Kafi dadra", artist: "Begum Akhtar" }],
    learning: {
      practiceTips: [
        "Identik dengan Dorian — sangat accessible untuk pemula.",
        "Ringan dan sensual — cocok untuk thumri (semi-classical).",
      ],
      earTrainingHint:
        "Dorian dalam konteks Indian — ringan, romantic, dan accessible.",
      harmonicApplications: [
        "Semi-classical Indian music (thumri, dadra).",
        "Bollywood romantic songs.",
      ],
    },
  },

  raga_bhairavi: {
    name: "Raga Bhairavi",
    aliases: ["Thaat Bhairavi"],
    ints: [0, 1, 3, 5, 7, 8, 10],
    deg: ["1", "b2", "b3", "4", "5", "b6", "b7"],
    desc: "Raga penutup yang identik dengan Phrygian. Dikenal sebagai 'Queen of Ragas' — bisa dimainkan kapan saja, emosional, dan fleksibel.",
    family: "indian",
    region: "North India (Hindustani)",
    parentScale: "Thaat Bhairavi",
    characteristicDegrees: ["b2", "b6"],
    avoidDegrees: [],
    commonChords: ["m"],
    relatedScales: ["phrygian"],
    genres: ["Indian classical", "Bhajan", "Bollywood", "Ghazal"],
    difficulty: "intermediate",
    songExamples: [
      { title: "Raag Bhairavi thumri", artist: "Various classical artists" },
    ],
    learning: {
      practiceTips: [
        "Queen of Ragas — identik dengan Phrygian.",
        "Bisa dimainkan kapan saja (tidak terikat waktu) — sangat fleksibel.",
      ],
      earTrainingHint:
        "Phrygian yang emosional dan versatile. 'Queen of Ragas' karena bisa mengekspresikan semua rasa.",
      harmonicApplications: [
        "Closing raga performances.",
        "Bhajan, ghazal, dan bollywood.",
      ],
    },
  },

  raga_yaman: {
    name: "Raga Yaman",
    aliases: ["Thaat Kalyan", "Yaman Kalyan"],
    ints: [0, 2, 4, 6, 7, 9, 11],
    deg: ["1", "2", "3", "#4", "5", "6", "7"],
    desc: "Raga malam hari yang paling populer — identik dengan Lydian mode. Warna cerah, optimistic, dan meditasi malam.",
    family: "indian",
    region: "North India (Hindustani)",
    parentScale: "Thaat Kalyan",
    characteristicDegrees: ["#4"],
    avoidDegrees: [],
    commonChords: ["maj7", "maj7#11"],
    relatedScales: ["lydian"],
    genres: ["Indian classical", "Hindustani", "Fusion", "Bollywood"],
    difficulty: "intermediate",
    songExamples: [
      { title: "Raga Yaman performance", artist: "Ustad Rashid Khan" },
    ],
    learning: {
      practiceTips: [
        "Identik dengan Lydian — raga malam paling populer.",
        "Mulai dari Ma (#4) instead of Sa (1) untuk authentic feel.",
      ],
      earTrainingHint:
        "Lydian dalam konteks Indian — cerah, optimistic, dan meditasi malam. Rasa 'floating'.",
      harmonicApplications: [
        "Evening raga in Hindustani classical.",
        "Indian fusion music.",
      ],
    },
  },

  raga_marwa: {
    name: "Raga Marwa",
    aliases: ["Thaat Marwa"],
    ints: [0, 1, 4, 6, 7, 9, 11],
    deg: ["1", "b2", "3", "#4", "5", "6", "7"],
    desc: "Raga senja yang sangat intens. b2 + #4 menciptakan tension luar biasa. Sa (1) jarang digunakan sebagai resting point.",
    family: "indian",
    region: "North India (Hindustani)",
    parentScale: "Thaat Marwa",
    characteristicDegrees: ["b2", "#4"],
    avoidDegrees: [],
    commonChords: ["maj7"],
    relatedScales: ["double_harmonic", "lydian"],
    genres: ["Indian classical", "Hindustani"],
    difficulty: "advanced",
    songExamples: [],
    learning: {
      practiceTips: [
        "Raga senja yang intens — Sa (root) jarang digunakan sebagai landing note.",
        "b2 + #4 menciptakan tension luar biasa — pelajari phrasing khas.",
      ],
      earTrainingHint:
        "Sangat tense dan intens. Root terasa 'unstable' — raga yang mengeksplorasi tension tanpa resolusi mudah.",
      harmonicApplications: [
        "Evening Indian classical performance.",
        "Exploration of tension without easy resolution.",
      ],
    },
  },

  raga_purvi: {
    name: "Raga Purvi",
    aliases: ["Thaat Purvi"],
    ints: [0, 1, 4, 6, 7, 8, 11],
    deg: ["1", "b2", "3", "#4", "5", "b6", "7"],
    desc: "Raga sore hari yang serius dan contemplative. Mirip Marwa tapi dengan b6 bukan 6 — lebih gelap dan introspective.",
    family: "indian",
    region: "North India (Hindustani)",
    parentScale: "Thaat Purvi",
    characteristicDegrees: ["b2", "#4", "b6"],
    avoidDegrees: [],
    commonChords: ["maj"],
    relatedScales: ["raga_marwa", "double_harmonic"],
    genres: ["Indian classical", "Hindustani"],
    difficulty: "advanced",
    songExamples: [],
    learning: {
      practiceTips: [
        "Mirip Marwa tapi b6 (bukan 6) — lebih gelap.",
        "Afternoon raga yang contemplative.",
      ],
      earTrainingHint:
        "Gelap dan contemplative — Marwa yang lebih introspective karena b6.",
      harmonicApplications: [
        "Afternoon Indian classical performance.",
        "Introspective, contemplative music.",
      ],
    },
  },

  raga_asavari: {
    name: "Raga Asavari",
    aliases: ["Thaat Asavari"],
    ints: [0, 2, 3, 5, 7, 8, 10],
    deg: ["1", "2", "b3", "4", "5", "b6", "b7"],
    desc: "Raga minor classical — identik dengan Natural Minor / Aeolian. Warna sedih dan emosional dalam tradisi Hindustani.",
    family: "indian",
    region: "North India (Hindustani)",
    parentScale: "Thaat Asavari",
    characteristicDegrees: ["b3", "b6", "b7"],
    avoidDegrees: [],
    commonChords: ["m", "m7"],
    relatedScales: ["natural_minor", "aeolian"],
    genres: ["Indian classical", "Hindustani"],
    difficulty: "intermediate",
    songExamples: [],
    learning: {
      practiceTips: [
        "Identik dengan Natural Minor/Aeolian.",
        "Di Hindustani, pelajari phrasing dan ornamentasi yang membedakan dari Western minor.",
      ],
      earTrainingHint:
        "Natural Minor dalam konteks Indian — sedih dan emosional.",
      harmonicApplications: [
        "Indian classical minor context.",
        "Cross-reference dengan Western minor harmony.",
      ],
    },
  },

  raga_bilawal: {
    name: "Raga Bilawal",
    aliases: ["Thaat Bilawal"],
    ints: [0, 2, 4, 5, 7, 9, 11],
    deg: ["1", "2", "3", "4", "5", "6", "7"],
    desc: "Raga identik dengan Major/Ionian — thaat dasar dalam Hindustani. Warna cerah dan upbeat.",
    family: "indian",
    region: "North India (Hindustani)",
    parentScale: "Thaat Bilawal",
    characteristicDegrees: ["3", "7"],
    avoidDegrees: [],
    commonChords: ["maj", "maj7"],
    relatedScales: ["ionian"],
    genres: ["Indian classical", "Hindustani", "Devotional"],
    difficulty: "beginner",
    songExamples: [],
    learning: {
      practiceTips: [
        "Identik dengan Major/Ionian — starting point Hindustani system.",
        "Pelajari Sa-Re-Ga-Ma-Pa-Dha-Ni-Sa solfege system.",
      ],
      earTrainingHint: "Major scale dalam konteks Indian. Cerah dan upbeat.",
      harmonicApplications: [
        "Basic Hindustani classical.",
        "Cross-reference dengan Western major harmony.",
      ],
    },
  },

  // ── South Indian (Carnatic) Approximations ───────────

  mayamalavagowla: {
    name: "Mayamalavagowla",
    aliases: ["Melakarta #15"],
    ints: [0, 1, 4, 5, 7, 8, 11],
    deg: ["1", "b2", "3", "4", "5", "b6", "7"],
    desc: "Melakarta ke-15 — fundamental raga dalam Carnatic music untuk pemula. Identik dengan Double Harmonic Major / Bhairav.",
    family: "indian",
    region: "South India (Carnatic)",
    parentScale: "Melakarta system",
    characteristicDegrees: ["b2", "3", "b6", "7"],
    avoidDegrees: [],
    commonChords: ["maj"],
    relatedScales: ["double_harmonic", "raga_bhairav"],
    genres: ["Carnatic classical", "South Indian devotional"],
    difficulty: "intermediate",
    songExamples: [
      { title: "Maha Ganapathim", artist: "Traditional Carnatic" },
    ],
    learning: {
      practiceTips: [
        "Identik dengan Double Harmonic/Bhairav — fundamental Carnatic raga.",
        "Starting point untuk belajar Carnatic (South Indian) music.",
      ],
      earTrainingHint:
        "Double Harmonic dalam konteks Carnatic — serious dan devosional.",
      harmonicApplications: [
        "Carnatic classical fundamental.",
        "South Indian devotional music.",
      ],
    },
  },

  shankarabharanam: {
    name: "Shankarabharanam",
    aliases: ["Melakarta #29", "Dhira Shankarabharanam"],
    ints: [0, 2, 4, 5, 7, 9, 11],
    deg: ["1", "2", "3", "4", "5", "6", "7"],
    desc: "Melakarta ke-29 — identik dengan Major scale. Raga grand dan celebratory dalam Carnatic music.",
    family: "indian",
    region: "South India (Carnatic)",
    parentScale: "Melakarta system",
    characteristicDegrees: ["3", "7"],
    avoidDegrees: [],
    commonChords: ["maj", "maj7"],
    relatedScales: ["ionian", "raga_bilawal"],
    genres: ["Carnatic classical"],
    difficulty: "beginner",
    songExamples: [],
    learning: {
      practiceTips: [
        "Identik dengan Major/Ionian — fundamental Carnatic raga.",
        "Grand dan celebratory — pelajari kriti compositions dalam raga ini.",
      ],
      earTrainingHint:
        "Major scale dalam konteks Carnatic — grand dan celebratory.",
      harmonicApplications: [
        "Carnatic classical performances.",
        "South Indian devotional music.",
      ],
    },
  },

  // ╔══════════════════════════════════════════════════════╗
  // ║ 11. EAST ASIAN SCALES                               ║
  // ╚══════════════════════════════════════════════════════╝

  japanese_insen: {
    name: "In-Sen",
    aliases: ["Japanese Insen", "Insen Scale"],
    ints: [0, 1, 5, 7, 10],
    deg: ["1", "b2", "4", "5", "b7"],
    desc: "Pentatonic tradisional Jepang dengan interval sempit-lega — nuansa meditatif, misterius, dan atmosferik.",
    family: "east-asian",
    region: "Japan",
    parentScale: "Japanese pentatonic family",
    characteristicDegrees: ["b2", "4", "b7"],
    avoidDegrees: [],
    commonChords: ["sus", "7sus4"],
    relatedScales: ["hirajoshi", "iwato", "phrygian"],
    genres: ["Traditional Japanese", "Ambient", "Cinematic", "Game music"],
    difficulty: "intermediate",
    songExamples: [{ title: "Ghost of Tsushima OST", artist: "Ilan Eshkeri" }],
    learning: {
      practiceTips: [
        "b2 + 4 + b7 tanpa 3rd dan 6th — sangat atmospheric.",
        "Mainkan dengan sustain/delay untuk nuansa meditatif.",
      ],
      earTrainingHint:
        "Misterius, meditatif, dan atmospheric. Warna Jepang kuno — zen garden soundscape.",
      harmonicApplications: [
        "Japanese-themed composition.",
        "Ambient dan game music.",
        "Film score Asian atmosphere.",
      ],
    },
  },

  hirajoshi: {
    name: "Hirajoshi",
    aliases: ["Japanese Hirajoshi"],
    ints: [0, 2, 3, 7, 8],
    deg: ["1", "2", "b3", "5", "b6"],
    desc: "Pentatonik Jepang yang paling dikenal dalam konteks gitar modern — warna melankolis, zen, dan elegan.",
    family: "east-asian",
    region: "Japan",
    parentScale: "Japanese pentatonic family",
    characteristicDegrees: ["b3", "b6"],
    avoidDegrees: [],
    commonChords: ["m", "sus2"],
    relatedScales: ["japanese_insen", "iwato", "minor_pent"],
    genres: ["Japanese traditional", "Rock", "Metal", "Ambient"],
    difficulty: "intermediate",
    songExamples: [
      {
        title: "Eruption (Hirajoshi runs)",
        artist: "Van Halen",
        note: "Eddie Van Halen suka motif Hirajoshi",
      },
    ],
    learning: {
      practiceTips: [
        "Mudah dimainkan di gitar — hanya 5 nada dengan spacing ergonomis.",
        "Populer di rock/metal untuk warna Japanese — Eddie Van Halen sering memakainya.",
      ],
      earTrainingHint:
        "Melankolis, zen, dan elegan — rasa Jepang yang paling dikenal di context gitar modern.",
      harmonicApplications: [
        "Japanese-themed rock/metal passages.",
        "Ambient dan atmospheric music.",
      ],
    },
  },

  iwato: {
    name: "Iwato",
    aliases: ["Japanese Iwato"],
    ints: [0, 1, 5, 6, 10],
    deg: ["1", "b2", "4", "b5", "b7"],
    desc: "Pentatonik Jepang paling gelap — tanpa perfect 5th dan dengan b2 + b5 memberikan tension supranatural.",
    family: "east-asian",
    region: "Japan",
    parentScale: "Japanese pentatonic family",
    characteristicDegrees: ["b2", "b5"],
    avoidDegrees: [],
    commonChords: ["dim", "sus"],
    relatedScales: ["japanese_insen", "locrian"],
    genres: ["Japanese traditional", "Horror", "Dark ambient", "Metal"],
    difficulty: "intermediate",
    songExamples: [],
    learning: {
      practiceTips: [
        "Pentatonic paling gelap — tanpa perfect 5th.",
        "Gunakan untuk rasa supranatural dan misterius.",
      ],
      earTrainingHint:
        "Sangat dark dan 'haunted'. Rasa supranatural Jepang — b2 + b5 tanpa 5th.",
      harmonicApplications: [
        "Horror dan dark atmospheric music.",
        "Japanese traditional 'dark' context.",
      ],
    },
  },

  yo_scale: {
    name: "Yo Scale",
    aliases: ["Japanese Yo"],
    ints: [0, 2, 5, 7, 9],
    deg: ["1", "2", "4", "5", "6"],
    desc: "Pentatonik 'bright' Jepang — yang digunakan dalam lagu rakyat cheerful. Mirip major pentatonic tanpa 3rd.",
    family: "east-asian",
    region: "Japan",
    parentScale: "Japanese pentatonic family",
    characteristicDegrees: ["2", "6"],
    avoidDegrees: [],
    commonChords: ["sus2", "sus4"],
    relatedScales: ["ritusen_pent", "major_pent"],
    genres: ["Japanese folk", "Minyo", "Okinawan"],
    difficulty: "beginner",
    songExamples: [{ title: "Sakura Sakura", artist: "Traditional Japanese" }],
    learning: {
      practiceTips: [
        "Pentatonic 'bright' Jepang — mirip major pentatonic tanpa 3rd.",
        "Mudah diakses karena mirip dengan pola yang sudah dikenal.",
      ],
      earTrainingHint:
        "Cheerful dan folk — warna Japanese festival dan folk songs.",
      harmonicApplications: [
        "Japanese folk music (minyo).",
        "Upbeat Asian-themed compositions.",
      ],
    },
  },

  chinese_pentatonic: {
    name: "Chinese Pentatonic (Gong)",
    aliases: ["Gong Scale", "Chinese Major Pentatonic"],
    ints: [0, 2, 4, 7, 9],
    deg: ["1", "2", "3", "5", "6"],
    desc: "Pentatonik dasar musik tradisional China — identik dengan Major Pentatonic. Basis dari berbagai mode pentatonik China.",
    family: "east-asian",
    region: "China",
    parentScale: "Chinese pentatonic system",
    characteristicDegrees: ["3", "6"],
    avoidDegrees: [],
    commonChords: ["maj", "6"],
    relatedScales: ["major_pent"],
    genres: ["Chinese traditional", "Guqin", "Erhu", "Chinese opera"],
    difficulty: "beginner",
    songExamples: [
      { title: "Jasmine Flower (Mo Li Hua)", artist: "Traditional Chinese" },
    ],
    learning: {
      practiceTips: [
        "Identik dengan Major Pentatonic — explore ornamentasi khas Chinese.",
        "Gunakan grace notes dan trills untuk warna traditional Chinese.",
      ],
      earTrainingHint:
        "Major Pentatonic dalam konteks Chinese — cerah dan traditional.",
      harmonicApplications: [
        "Traditional Chinese music composition.",
        "Erhu, guqin, dan simfoni Chinese.",
      ],
    },
  },

  chinese_jue: {
    name: "Chinese Jue",
    aliases: ["Jue Mode"],
    ints: [0, 2, 5, 7, 10],
    deg: ["1", "2", "4", "5", "b7"],
    desc: "Mode ke-3 dari Chinese pentatonic — mirip Egyptian pentatonic. Warna mysterious dan ancient.",
    family: "east-asian",
    region: "China",
    parentScale: "Chinese pentatonic system",
    characteristicDegrees: ["4", "b7"],
    avoidDegrees: [],
    commonChords: ["sus4"],
    relatedScales: ["egyptian_pent", "chinese_pentatonic"],
    genres: ["Chinese traditional", "Film score"],
    difficulty: "intermediate",
    songExamples: [],
    learning: {
      practiceTips: [
        "Mode 3 Chinese pentatonic — mysterious dan ancient.",
        "Mirip Egyptian pentatonic — cross-cultural connection.",
      ],
      earTrainingHint:
        "Mysterious dan ancient Chinese — tanpa 3rd, ambiguous tonality.",
      harmonicApplications: [
        "Traditional Chinese music.",
        "Film score ancient/dynasty themes.",
      ],
    },
  },

  // ── Korean / Southeast Asian ─────────────────────────

  korean_pyongjo: {
    name: "Pyongjo",
    aliases: ["Korean Pyongjo"],
    ints: [0, 2, 5, 7, 9],
    deg: ["1", "2", "4", "5", "6"],
    desc: "Mode pentatonik Korea yang serene dan peaceful. Mirip Yo scale Jepang dan Ritusen.",
    family: "east-asian",
    region: "Korea",
    parentScale: "Korean pentatonic system",
    characteristicDegrees: ["2", "6"],
    avoidDegrees: [],
    commonChords: ["sus2"],
    relatedScales: ["yo_scale", "ritusen_pent"],
    genres: ["Korean traditional", "Gugak"],
    difficulty: "intermediate",
    songExamples: [{ title: "Arirang", artist: "Korean Traditional" }],
    learning: {
      practiceTips: [
        "Mirip Yo scale Jepang dan Ritusen — cross-cultural pentatonic connection.",
        "Serene dan peaceful — mainkan dengan rubato.",
      ],
      earTrainingHint: "Serene dan peaceful — Korean traditional folk feeling.",
      harmonicApplications: [
        "Korean traditional music (gugak).",
        "Korean folk and film music.",
      ],
    },
  },

  balinese_pelog: {
    name: "Pelog (Balinese)",
    aliases: ["Pelog Scale"],
    ints: [0, 1, 3, 7, 8],
    deg: ["1", "b2", "b3", "5", "b6"],
    desc: "Skala 5 nada Bali/Jawa — warna exotic dan dramatis. Pelog adalah tuning system gamelan yang di 12-TET mendekati pola ini.",
    family: "east-asian",
    region: "Indonesia (Bali/Java)",
    parentScale: "Gamelan tuning system",
    characteristicDegrees: ["b2", "b6"],
    avoidDegrees: [],
    commonChords: ["m"],
    relatedScales: ["hirajoshi", "phrygian"],
    genres: ["Gamelan", "Balinese", "World fusion"],
    difficulty: "intermediate",
    songExamples: [
      { title: "Gamelan performances", artist: "Traditional Balinese" },
    ],
    learning: {
      practiceTips: [
        "Gamelan tuning di 12-TET — perhatikan ini approximation.",
        "b2 dan b6 memberi warna exotic dan dramatis.",
      ],
      earTrainingHint:
        "Exotic dan dramatis — warna gamelan Bali/Jawa. Mirip Hirajoshi tapi lebih mysterious.",
      harmonicApplications: [
        "Gamelan-inspired composition.",
        "World fusion music.",
      ],
    },
  },

  balinese_slendro: {
    name: "Slendro (Javanese)",
    aliases: ["Slendro Scale"],
    ints: [0, 2, 5, 7, 10],
    deg: ["1", "2", "4", "5", "b7"],
    desc: "Skala 5 nada Jawa — tuning near-equidistant dalam gamelan. Approx 12-TET mirip Egyptian/Suspended pentatonic.",
    family: "east-asian",
    region: "Indonesia (Java)",
    parentScale: "Gamelan tuning system",
    characteristicDegrees: ["4", "b7"],
    avoidDegrees: [],
    commonChords: ["sus4"],
    relatedScales: ["egyptian_pent"],
    genres: ["Gamelan", "Javanese", "World fusion"],
    difficulty: "intermediate",
    songExamples: [],
    learning: {
      practiceTips: [
        "Near-equidistant tuning di 12-TET — mirip Egyptian/Suspended pentatonic.",
        "Gamelan Jawa menggunakan tuning actual yang berbeda dari 12-TET.",
      ],
      earTrainingHint:
        "Open dan spacious — mirip Egyptian pentatonic. Warna gamelan Jawa yang tenang.",
      harmonicApplications: [
        "Javanese gamelan-inspired composition.",
        "World fusion dan ambient.",
      ],
    },
  },

  // ╔══════════════════════════════════════════════════════╗
  // ║ 12. HUNGARIAN / ROMANI / KLEZMER                    ║
  // ╚══════════════════════════════════════════════════════╝

  hungarian_minor: {
    name: "Hungarian Minor",
    aliases: ["Gypsy Minor", "Double Harmonic Minor"],
    ints: [0, 2, 3, 6, 7, 8, 11],
    deg: ["1", "2", "b3", "#4", "5", "b6", "7"],
    desc: "Skala eksotis dengan 2 augmented second gaps — sangat dramatis dan teatrikal. Favorit di musik gypsy dan neo-classical metal.",
    family: "hungarian",
    region: "Eastern Europe / Hungary",
    parentScale: "Minor variant",
    characteristicDegrees: ["#4", "7", "b6"],
    avoidDegrees: [],
    commonChords: ["mMaj7", "dim"],
    relatedScales: ["harmonic_minor", "turkish_zirguleli", "hungarian_major"],
    genres: ["Gypsy", "Film score", "Progressive metal", "Neo-classical"],
    difficulty: "advanced",
    songExamples: [
      { title: "Hungarian Rhapsody No. 2", artist: "Franz Liszt" },
      { title: "Tornado of Souls", artist: "Megadeth" },
    ],
    learning: {
      teachingOrder: 15,
      pianoFingering: {
        referenceRoot: "A",
        rightHandAsc: "1-2-3-1-2-3-4-5",
        leftHandAsc: "5-4-3-2-1-3-2-1",
        notes:
          "Dua gap augmented 2nd: antara b3-#4 dan b6-7. Latih pelan karena stretching jari.",
      },
      guitarPositions: [
        {
          name: "Open Position (A Hungarian Minor)",
          startFret: 0,
          description:
            "Root A senar 5 open. Perhatikan 2 stretches di augmented 2nd gaps.",
        },
        {
          name: "5th Position",
          startFret: 5,
          description:
            "Root senar 6 fret 5. Pattern dramatis untuk neo-classical shredding.",
        },
      ],
      practiceTips: [
        "Latih augmented 2nd intervals secara terpisah sampai terbiasa.",
        "Mainkan ascending-descending pelan untuk memahami warna dramatis.",
        "Gunakan untuk ornamentasi melodis di atas progresi minor gelap.",
      ],
      earTrainingHint:
        "Sangat dramatis dan teatrikal. Dua gap augmented 2nd memberi rasa 'gypsy/Hungarian'. Pikirkan Hungarian Rhapsody Liszt.",
      harmonicApplications: [
        "Film score dramatic dan fantasy.",
        "Progressive metal dan neo-classical guitar.",
        "Klezmer dan Romani/gypsy jazz.",
      ],
    },
  },

  hungarian_major: {
    name: "Hungarian Major",
    aliases: [],
    ints: [0, 3, 4, 6, 7, 9, 10],
    deg: ["1", "#2", "3", "#4", "5", "6", "b7"],
    desc: "Variasi mayor eksotis Hungaria — major 3rd + #4 + #2 menciptakan warna yang unik dan dramatic.",
    family: "hungarian",
    region: "Hungary / Eastern Europe",
    parentScale: "Major variant",
    characteristicDegrees: ["#2", "#4"],
    avoidDegrees: [],
    commonChords: ["7", "aug"],
    relatedScales: ["hungarian_minor", "lydian_dominant"],
    genres: ["Hungarian folk", "Romani", "Klezmer"],
    difficulty: "advanced",
    songExamples: [],
    learning: {
      practiceTips: [
        "Sangat exotic — #2 + #4 dalam konteks major.",
        "Rare scale — pelajari setelah menguasai basics.",
      ],
      earTrainingHint:
        "Major yang 'exotic' dan dramatic — #2 dan #4 memberi warna Hungarian/Romani.",
      harmonicApplications: [
        "Hungarian folk music.",
        "Romani dan Klezmer fusion.",
      ],
    },
  },

  romani_scale: {
    name: "Romani Scale",
    aliases: ["Gypsy Scale"],
    ints: [0, 2, 3, 6, 7, 8, 10],
    deg: ["1", "2", "b3", "#4", "5", "b6", "b7"],
    desc: "Skala minor dramatis Romani dengan #4 dan b6 — warna emosional yang kuat untuk musik gypsy dan flamenco fusion.",
    family: "hungarian",
    region: "Romani / Europe",
    parentScale: "Minor variant",
    characteristicDegrees: ["#4", "b6"],
    avoidDegrees: [],
    commonChords: ["m", "7"],
    relatedScales: ["hungarian_minor", "dorian_sharp4"],
    genres: ["Romani", "Gypsy jazz", "Flamenco", "Klezmer"],
    difficulty: "advanced",
    songExamples: [
      { title: "Dark Eyes (Ochi Chernye)", artist: "Traditional Romani" },
    ],
    learning: {
      practiceTips: [
        "#4 dan b6 memberi dramatic tension pada pola minor.",
        "Mainkan dengan vibrato dan ornamentasi ekspresif.",
      ],
      earTrainingHint:
        "Gypsy passion — minor yang sangat emosional dan dramatic. #4 memberi 'twist'.",
      harmonicApplications: [
        "Romani/Gypsy jazz.",
        "Flamenco fusion.",
        "Film score passionate scenes.",
      ],
    },
  },

  klezmer: {
    name: "Mi Sheberach",
    aliases: ["Klezmer Scale", "Ukrainian Dorian"],
    ints: [0, 2, 3, 6, 7, 9, 10],
    deg: ["1", "2", "b3", "#4", "5", "6", "b7"],
    desc: "Skala klezmer klasik — Dorian dengan #4 (augmented 4th). Identik dengan mode ke-4 Harmonic Minor (Romanian Scale).",
    family: "hungarian",
    region: "Eastern Europe / Jewish tradition",
    parentScale: "Harmonic minor mode 4",
    characteristicDegrees: ["b3", "#4", "6"],
    avoidDegrees: [],
    commonChords: ["m7", "7"],
    relatedScales: ["dorian_sharp4", "dorian", "hungarian_minor"],
    genres: ["Klezmer", "Jewish folk", "Romani"],
    difficulty: "advanced",
    songExamples: [
      { title: "Bei Mir Bist Du Schoen", artist: "Andrews Sisters" },
    ],
    learning: {
      practiceTips: [
        "Identik dengan Dorian #4 / Harmonic Minor mode 4.",
        "Gunakan ornamentasi khas klezmer: trills, grace notes, crying bends.",
      ],
      earTrainingHint:
        "Dorian dengan #4 — warna 'Jewish/Eastern European' yang distinctive. Rasa expressive dan emosional.",
      harmonicApplications: ["Klezmer music tradition.", "Jewish folk music."],
    },
  },

  // ╔══════════════════════════════════════════════════════╗
  // ║ 13. SPANISH / FLAMENCO                              ║
  // ╚══════════════════════════════════════════════════════╝

  spanish_8tone: {
    name: "Spanish 8-Tone",
    aliases: ["Spanish Scale", "Jewish Scale"],
    ints: [0, 1, 3, 4, 5, 6, 8, 10],
    deg: ["1", "b2", "b3", "3", "4", "b5", "b6", "b7"],
    desc: "Skala 8 nada serbaguna untuk warna Spanyol — mengandung major dan minor 3rd sekaligus, plus tritone dan b2.",
    family: "spanish",
    region: "Spain",
    parentScale: "Synthetic",
    characteristicDegrees: ["b2", "3", "b5"],
    avoidDegrees: [],
    commonChords: ["7b9", "m", "7"],
    relatedScales: ["phrygian_dominant", "diminished_hw"],
    genres: ["Flamenco", "Latin jazz", "Cinematic"],
    difficulty: "advanced",
    songExamples: [],
    learning: {
      practiceTips: [
        "8 nada — mengandung major DAN minor 3rd sekaligus.",
        "Gunakan major 3rd saat ascending, minor 3rd saat descending untuk kontras.",
      ],
      earTrainingHint:
        "Sangat Spanish — kombinasi major/minor 3rd memberi warna passionate dan dramatic.",
      harmonicApplications: ["Flamenco composition.", "Latin jazz soloing."],
    },
  },

  flamenco_scale: {
    name: "Flamenco Scale",
    aliases: ["Spanish Phrygian"],
    ints: [0, 1, 3, 4, 5, 7, 8, 10],
    deg: ["1", "b2", "b3", "3", "4", "5", "b6", "b7"],
    desc: "Skala 8 nada flamenco — menggabungkan Phrygian dengan major 3rd untuk Andalusian cadence khas (bVII-bVI-V-I).",
    family: "spanish",
    region: "Spain (Andalusia)",
    parentScale: "Phrygian + Phrygian Dominant",
    characteristicDegrees: ["b2", "3", "b6"],
    avoidDegrees: [],
    commonChords: ["m", "7", "7b9"],
    relatedScales: ["phrygian", "phrygian_dominant"],
    genres: ["Flamenco", "Spanish guitar", "Latin"],
    difficulty: "advanced",
    songExamples: [
      { title: "Entre Dos Aguas", artist: "Paco de Lucia" },
      { title: "Concierto de Aranjuez", artist: "Joaquín Rodrigo" },
    ],
    learning: {
      practiceTips: [
        "Andalusian cadence (Am-G-F-E) = natural habitat skala ini.",
        "Mix Phrygian dan Phrygian Dominant di satu phrase untuk authentic flamenco.",
      ],
      earTrainingHint:
        "Paling 'flamenco' — Phrygian + major 3rd memberikan warna Andalusian yang kuat.",
      harmonicApplications: [
        "Flamenco guitar composition.",
        "Spanish guitar arrangements.",
        "Latin jazz fusion.",
      ],
    },
  },

  // ╔══════════════════════════════════════════════════════╗
  // ║ 14. AFRICAN SCALES                                  ║
  // ╚══════════════════════════════════════════════════════╝

  ethiopian_tizita_major: {
    name: "Ethiopian Tizita (Major)",
    aliases: ["Tizita Major", "Ambassel (major)"],
    ints: [0, 2, 4, 7, 9],
    deg: ["1", "2", "3", "5", "6"],
    desc: "Pentatonik mayor Ethiopia — identik dengan Major Pentatonic. Tizita berarti 'kenangan' dan menjadi basis lagu-lagu nostalgia Ethiopia.",
    family: "african",
    region: "Ethiopia",
    parentScale: "Ethiopian pentatonic system",
    characteristicDegrees: ["3", "6"],
    avoidDegrees: [],
    commonChords: ["maj", "6"],
    relatedScales: ["major_pent"],
    genres: ["Ethiopian", "Ethio-jazz", "Tizita", "African"],
    difficulty: "beginner",
    songExamples: [{ title: "Tizita", artist: "Mulatu Astatke" }],
    learning: {
      practiceTips: [
        "Identik dengan Major Pentatonic — explore Ethio-jazz ornamentasi.",
        "Tizita = 'kenangan' — mainkan dengan ekspresi nostalgic.",
      ],
      earTrainingHint:
        "Major Pentatonic dalam konteks Ethiopia — nostalgic dan warm.",
      harmonicApplications: [
        "Ethiopian music dan Ethio-jazz.",
        "Afro-fusion compositions.",
      ],
    },
  },

  ethiopian_tizita_minor: {
    name: "Ethiopian Tizita (Minor)",
    aliases: ["Tizita Minor", "Ambassel"],
    ints: [0, 2, 3, 7, 8],
    deg: ["1", "2", "b3", "5", "b6"],
    desc: "Pentatonik minor Ethiopia — warna melankolis yang mirip Hirajoshi. Banyak dipakai dalam lagu-lagu emosional Ethiopia.",
    family: "african",
    region: "Ethiopia",
    parentScale: "Ethiopian pentatonic system",
    characteristicDegrees: ["b3", "b6"],
    avoidDegrees: [],
    commonChords: ["m"],
    relatedScales: ["hirajoshi", "ethiopian_tizita_major"],
    genres: ["Ethiopian", "Ethio-jazz"],
    difficulty: "intermediate",
    songExamples: [],
    learning: {
      practiceTips: [
        "Mirip Hirajoshi — cross-cultural connection yang menarik.",
        "Warna melankolis Ethiopia — mainkan dengan rubato dan ekspresi.",
      ],
      earTrainingHint:
        "Minor pentatonic variation Ethiopia — melankolis dan emotional.",
      harmonicApplications: [
        "Ethiopian emotional music.",
        "Ethio-jazz minor context.",
      ],
    },
  },

  ethiopian_anchihoye: {
    name: "Ethiopian Anchihoye",
    aliases: ["Anchihoye Scale"],
    ints: [0, 3, 5, 7, 10],
    deg: ["1", "b3", "4", "5", "b7"],
    desc: "Pentatonik minor Ethiopia — identik dengan Minor Pentatonic. Basis banyak melodi pop/folk Ethiopia.",
    family: "african",
    region: "Ethiopia",
    parentScale: "Ethiopian pentatonic system",
    characteristicDegrees: ["b3", "b7"],
    avoidDegrees: [],
    commonChords: ["m7"],
    relatedScales: ["minor_pent"],
    genres: ["Ethiopian pop", "Ethio-jazz"],
    difficulty: "beginner",
    songExamples: [],
    learning: {
      practiceTips: [
        "Identik dengan Minor Pentatonic — explore Ethiopian context.",
      ],
      earTrainingHint:
        "Minor Pentatonic dalam konteks Ethiopian — bluesy dan folk.",
      harmonicApplications: ["Ethiopian pop dan folk."],
    },
  },

  west_african_pent: {
    name: "West African Pentatonic",
    aliases: ["Kora Tuning Scale"],
    ints: [0, 2, 4, 7, 9],
    deg: ["1", "2", "3", "5", "6"],
    desc: "Pentatonik yang identik dengan Major Pentatonic — warna cerah yang universal juga ditemui di banyak tradisi West African, termasuk tuning kora.",
    family: "african",
    region: "West Africa",
    parentScale: "Major pentatonic",
    characteristicDegrees: ["3", "6"],
    avoidDegrees: [],
    commonChords: ["maj", "6"],
    relatedScales: ["major_pent", "ethiopian_tizita_major"],
    genres: ["Manding", "Griot", "Afrobeat", "Highlife"],
    difficulty: "beginner",
    songExamples: [{ title: "Jarabi", artist: "Toumani Diabaté" }],
    learning: {
      practiceTips: [
        "Identik dengan Major Pentatonic — explore Kora tuning dan Manding tradition.",
        "Mainkan dengan pattern repetitif khas West African rhythmic tradition.",
      ],
      earTrainingHint:
        "Major Pentatonic dalam konteks West African — cerah dan celebratory. Warna Kora.",
      harmonicApplications: [
        "Manding/Griot music tradition.",
        "Afrobeat dan Highlife.",
      ],
    },
  },

  // ╔══════════════════════════════════════════════════════╗
  // ║ 15. EUROPEAN FOLK SCALES                            ║
  // ╚══════════════════════════════════════════════════════╝

  neapolitan_major: {
    name: "Neapolitan Major",
    aliases: [],
    ints: [0, 1, 3, 5, 7, 9, 11],
    deg: ["1", "b2", "b3", "4", "5", "6", "7"],
    desc: "Seperti Melodic Minor tapi dengan b2 — memberikan warna operatic Italian dengan sentuhan minor yang halus.",
    family: "european-folk",
    region: "Italy (Naples)",
    parentScale: "Neapolitan system",
    characteristicDegrees: ["b2", "b3", "7"],
    avoidDegrees: [],
    commonChords: ["mMaj7", "bII maj7"],
    relatedScales: ["melodic_minor", "neapolitan_minor"],
    genres: ["Classical", "Opera", "Film score"],
    difficulty: "advanced",
    songExamples: [],
    learning: {
      practiceTips: [
        "Melodic Minor dengan b2 — warna operatic.",
        "Rare tapi penting untuk classical composition vocabulary.",
      ],
      earTrainingHint:
        "Melodic minor yang di-gelap-kan oleh b2. Warna Italian opera.",
      harmonicApplications: ["Classical composition.", "Opera dan oratorio."],
    },
  },

  neapolitan_minor: {
    name: "Neapolitan Minor",
    aliases: [],
    ints: [0, 1, 3, 5, 7, 8, 11],
    deg: ["1", "b2", "b3", "4", "5", "b6", "7"],
    desc: "Harmonic minor dengan b2 — warna minor paling gelap dan dramatic di European tradition. Digunakan dalam opera dan oratorio.",
    family: "european-folk",
    region: "Italy (Naples)",
    parentScale: "Neapolitan system",
    characteristicDegrees: ["b2", "b6", "7"],
    avoidDegrees: [],
    commonChords: ["mMaj7", "dim7"],
    relatedScales: ["harmonic_minor", "neapolitan_major"],
    genres: ["Classical", "Opera", "Romantic period"],
    difficulty: "advanced",
    songExamples: [],
    learning: {
      practiceTips: [
        "Harmonic Minor dengan b2 — paling gelap di European tradition.",
        "Gunakan bII chord (Neapolitan chord) sebagai signature harmonic move.",
      ],
      earTrainingHint:
        "Paling gelap di European minor — Harmonic Minor + b2 = maximum drama.",
      harmonicApplications: [
        "Neapolitan chord usage di classical.",
        "Opera dan dramatic classical pieces.",
      ],
    },
  },

  enigmatic_scale: {
    name: "Enigmatic Scale",
    aliases: ["Scala Enigmatica"],
    ints: [0, 1, 4, 6, 8, 10, 11],
    deg: ["1", "b2", "3", "#4", "#5", "b7", "7"],
    desc: "Skala 7 nada eksperimental oleh Verdi — ascending chromatic dari #4 keatas, dengan b2 dan kekurangan 5th natural.",
    family: "european-folk",
    region: "Italy",
    parentScale: "Synthetic (Verdi)",
    characteristicDegrees: ["b2", "3", "#4", "#5"],
    avoidDegrees: [],
    commonChords: ["aug"],
    relatedScales: ["whole_tone", "altered"],
    genres: ["Art music", "Avant-garde", "Film score"],
    difficulty: "advanced",
    songExamples: [
      { title: "Ave Maria (Enigmatic)", artist: "Giuseppe Verdi" },
    ],
    learning: {
      practiceTips: [
        "Skala eksperimental Verdi — ascending chromatic quality dari #4 keatas.",
        "Tidak ada perfect 5th — sangat unusual dan challenging.",
      ],
      earTrainingHint:
        "Mysterious dan 'enigmatic' — ascending terasa semakin chromatic. Warna avant-garde.",
      harmonicApplications: [
        "Avant-garde composition.",
        "Film score mysterious themes.",
      ],
    },
  },

  persian_scale: {
    name: "Persian Scale",
    aliases: [],
    ints: [0, 1, 4, 5, 6, 8, 11],
    deg: ["1", "b2", "3", "4", "b5", "b6", "7"],
    desc: "Warna yang sangat intens dan mysterious — gap augmented 2nd ganda mirip Double Harmonic tapi dengan b5 yang menambah tension.",
    family: "european-folk",
    region: "Persia (Iran)",
    parentScale: "Persian tradition",
    characteristicDegrees: ["b2", "3", "b5", "7"],
    avoidDegrees: [],
    commonChords: ["maj"],
    relatedScales: ["double_harmonic", "phrygian_dominant"],
    genres: ["Persian", "Middle-eastern", "Cinematic"],
    difficulty: "advanced",
    songExamples: [],
    learning: {
      practiceTips: [
        "Sangat intens — dua augmented 2nd gaps + b5.",
        "Gunakan untuk warna Persian/Iranian dalam composition.",
      ],
      earTrainingHint:
        "Intens, mysterious, dan 'ancient Persian'. b5 menambah darkness pada Double Harmonic-like structure.",
      harmonicApplications: [
        "Persian/Iranian-themed music.",
        "Middle-Eastern cinematic scores.",
      ],
    },
  },

  prometheus_scale: {
    name: "Prometheus Scale",
    aliases: ["Mystic Scale (Scriabin)"],
    ints: [0, 2, 4, 6, 9, 10],
    deg: ["1", "2", "3", "#4", "6", "b7"],
    desc: "Skala 6 nada ciptaan Alexander Scriabin — tanpa 5th, dengan #4. Basis 'Mystic Chord' yang terkenal.",
    family: "european-folk",
    region: "Russia",
    parentScale: "Synthetic (Scriabin)",
    characteristicDegrees: ["#4", "6", "b7"],
    avoidDegrees: [],
    commonChords: ["7#11"],
    relatedScales: ["lydian_dominant", "whole_tone"],
    genres: ["Late Romantic", "Scriabin", "Art music", "Avant-garde"],
    difficulty: "advanced",
    songExamples: [
      { title: "Prometheus: The Poem of Fire", artist: "Alexander Scriabin" },
    ],
    learning: {
      practiceTips: [
        "Skala Scriabin 6 nada — basis 'Mystic Chord'.",
        "Tanpa 5th, dengan #4 — warna floating dan mystical.",
      ],
      earTrainingHint:
        "Mystical dan floating — warna Scriabin. Tanpa gravitasi tonal karena tanpa 5th.",
      harmonicApplications: [
        "Scriabin-inspired composition.",
        "Mystical/spiritual art music.",
      ],
    },
  },

  // ╔══════════════════════════════════════════════════════╗
  // ║ 16. HARMONIC MAJOR MODES                            ║
  // ╚══════════════════════════════════════════════════════╝

  harmonic_major: {
    name: "Harmonic Major",
    aliases: [],
    ints: [0, 2, 4, 5, 7, 8, 11],
    deg: ["1", "2", "3", "4", "5", "b6", "7"],
    desc: "Major scale dengan b6 — memberikan warna bittersweet yang menggabungkan brightness major dan darkness minor. Penting di jazz ballad dan romantic harmony.",
    family: "harmonic-major-mode",
    region: "Western",
    parentScale: "Major scale variant",
    characteristicDegrees: ["3", "b6", "7"],
    avoidDegrees: [],
    commonChords: ["maj7", "dim7", "7b13"],
    relatedScales: ["ionian", "harmonic_minor", "mixolydian_b6"],
    genres: ["Jazz", "Classical", "Film score", "Romantic ballad"],
    difficulty: "advanced",
    songExamples: [{ title: "Memories of Tomorrow", artist: "Keith Jarrett" }],
    learning: {
      practiceTips: [
        "Major dengan b6 — satu nada berbeda dari Ionian.",
        "Warna bittersweet — cerah tapi dengan hint darkness.",
        "Penting untuk jazz ballad vocabulary.",
      ],
      earTrainingHint:
        "Major yang 'bittersweet' — b6 menambah rasa melankolis pada brightness major.",
      harmonicApplications: [
        "Jazz ballad harmony.",
        "Classical romantic music.",
        "Film score emotional scenes.",
      ],
    },
  },

  dorian_b5: {
    name: "Dorian ♭5",
    aliases: ["Harmonic Major Mode 2"],
    ints: [0, 2, 3, 5, 6, 9, 10],
    deg: ["1", "2", "b3", "4", "b5", "6", "b7"],
    desc: "Mode ke-2 Harmonic Major — Dorian dengan b5. Warna minor yang unik untuk konteks m7b5.",
    family: "harmonic-major-mode",
    region: "Western",
    parentScale: "Harmonic Major",
    modeOf: "Mode 2 dari Harmonic Major",
    characteristicDegrees: ["b3", "b5", "6"],
    avoidDegrees: [],
    commonChords: ["m7b5"],
    relatedScales: ["dorian", "locrian_natural2"],
    genres: ["Jazz"],
    difficulty: "advanced",
    songExamples: [],
    learning: {
      practiceTips: [
        "Mode 2 Harmonic Major — Dorian dengan b5.",
        "Warna unik untuk m7b5 context yang berbeda dari Locrian ♮2.",
      ],
      earTrainingHint:
        "Dorian yang lebih gelap karena b5 — tapi dengan natural 6 yang memberi warmth.",
      harmonicApplications: ["Alternative scale untuk m7b5 chords."],
    },
  },

  lydian_diminished: {
    name: "Lydian Diminished",
    aliases: ["Harmonic Major Mode 4"],
    ints: [0, 2, 3, 6, 7, 9, 11],
    deg: ["1", "2", "b3", "#4", "5", "6", "7"],
    desc: "Lydian dengan b3 — warna minor yang sparkly karena #4 + 7. Mode ke-4 dari Harmonic Major.",
    family: "harmonic-major-mode",
    region: "Western",
    parentScale: "Harmonic Major",
    modeOf: "Mode 4 dari Harmonic Major",
    characteristicDegrees: ["b3", "#4", "7"],
    avoidDegrees: [],
    commonChords: ["mMaj7"],
    relatedScales: ["lydian", "hungarian_minor"],
    genres: ["Jazz", "Film score", "Contemporary classical"],
    difficulty: "advanced",
    songExamples: [],
    learning: {
      practiceTips: [
        "Lydian dengan b3 — warna minor yang sparkly.",
        "Unik: #4 + 7 memberi brightness, b3 memberi minor quality.",
      ],
      earTrainingHint:
        "Minor yang terdengar 'sparkly' karena #4 dan natural 7. Kontradiksi yang menarik.",
      harmonicApplications: [
        "mMaj7 chord context.",
        "Film score 'dark fairy tale' scenes.",
      ],
    },
  },

  mixolydian_b2: {
    name: "Mixolydian ♭2",
    aliases: ["Harmonic Major Mode 5"],
    ints: [0, 1, 4, 5, 7, 9, 10],
    deg: ["1", "b2", "3", "4", "5", "6", "b7"],
    desc: "Mixolydian dengan b2 — dominant scale eksotis. Mirip Phrygian Dominant tapi dengan natural 6.",
    family: "harmonic-major-mode",
    region: "Western",
    parentScale: "Harmonic Major",
    modeOf: "Mode 5 dari Harmonic Major",
    characteristicDegrees: ["b2", "3", "6"],
    avoidDegrees: [],
    commonChords: ["7", "7b9"],
    relatedScales: ["phrygian_dominant", "mixolydian"],
    genres: ["Jazz", "Classical"],
    difficulty: "advanced",
    songExamples: [],
    learning: {
      practiceTips: [
        "Mixolydian dengan b2 — dominant scale eksotis.",
        "Mirip Phrygian Dominant tapi dengan natural 6.",
      ],
      earTrainingHint:
        "Dominant tapi eksotis — b2 memberi rasa Eastern pada dominant sound.",
      harmonicApplications: [
        "Exotic dominant chord resolution.",
        "Alternative untuk Phrygian Dominant context.",
      ],
    },
  },

  // ╔══════════════════════════════════════════════════════╗
  // ║ 17. CONTEMPORARY / JAZZ SYNTHETIC                   ║
  // ╚══════════════════════════════════════════════════════╝

  lydian_minor: {
    name: "Lydian Minor",
    aliases: [],
    ints: [0, 2, 4, 6, 7, 8, 10],
    deg: ["1", "2", "3", "#4", "5", "b6", "b7"],
    desc: "Major scale dengan #4, b6, b7 — menggabungkan brightness Lydian dengan darkness b6 dan b7.",
    family: "contemporary",
    region: "Western",
    parentScale: "Synthetic",
    characteristicDegrees: ["#4", "b6", "b7"],
    avoidDegrees: [],
    commonChords: ["7#11"],
    relatedScales: ["lydian_dominant", "mixolydian_b6"],
    genres: ["Jazz", "Fusion", "Film score"],
    difficulty: "advanced",
    songExamples: [],
    learning: {
      practiceTips: [
        "#4 + b6 + b7 = mix Lydian brightness dan minor darkness.",
        "Rare tapi useful sebagai color scale.",
      ],
      earTrainingHint:
        "Lydian yang jatuh ke darkness di atas — #4 cerah tapi b6/b7 memberi collapse.",
      harmonicApplications: [
        "Jazz fusion color scale.",
        "Film score ambivalent moods.",
      ],
    },
  },

  leading_whole_tone: {
    name: "Leading Whole Tone",
    aliases: ["Lydian Augmented ♯6"],
    ints: [0, 2, 4, 6, 8, 10, 11],
    deg: ["1", "2", "3", "#4", "#5", "b7", "7"],
    desc: "Whole tone scale + leading tone (7). Menambahkan pull ke tonic pada whole tone yang biasanya tanpa gravitasi.",
    family: "contemporary",
    region: "Western",
    parentScale: "Whole tone + leading tone",
    characteristicDegrees: ["#4", "#5", "7"],
    avoidDegrees: [],
    commonChords: ["aug", "maj7#5"],
    relatedScales: ["whole_tone", "lydian_augmented"],
    genres: ["Jazz", "Art music"],
    difficulty: "advanced",
    songExamples: [],
    learning: {
      practiceTips: [
        "Whole tone + leading tone (7) — menambah gravitasi ke tonic.",
      ],
      earTrainingHint:
        "Whole tone tapi dengan ending yang resolve — leading tone memberi pull.",
      harmonicApplications: ["Transitional passages that resolve."],
    },
  },

  double_harmonic_minor: {
    name: "Double Harmonic Minor",
    aliases: ["Hungarian Minor (identical)"],
    ints: [0, 2, 3, 6, 7, 8, 11],
    deg: ["1", "2", "b3", "#4", "5", "b6", "7"],
    desc: "Dua augmented 2nd gaps dalam minor — identik dengan Hungarian Minor. Entry terpisah untuk tagging cross-referensi.",
    family: "contemporary",
    region: "Multi-regional",
    parentScale: "Minor variant",
    characteristicDegrees: ["#4", "b6", "7"],
    avoidDegrees: [],
    commonChords: ["mMaj7"],
    relatedScales: ["hungarian_minor", "harmonic_minor"],
    genres: ["Gypsy", "Neo-classical", "Film score"],
    difficulty: "advanced",
    songExamples: [],
    learning: {
      practiceTips: [
        "Identik dengan Hungarian Minor — entry terpisah untuk cross-reference.",
        "Lihat Hungarian Minor untuk tips lengkap.",
      ],
      earTrainingHint:
        "= Hungarian Minor. Dramatic, theatrical, dua augmented 2nd gaps.",
      harmonicApplications: ["Sama dengan Hungarian Minor."],
    },
  },

  major_locrian: {
    name: "Major Locrian",
    aliases: ["Arabian Scale"],
    ints: [0, 2, 4, 5, 6, 8, 10],
    deg: ["1", "2", "3", "4", "b5", "b6", "b7"],
    desc: "Major triad (1-3-5) tapi b5 dan b6 — warna major yang collapses ke darkness. Jarang dipakai tapi unik.",
    family: "contemporary",
    region: "Western / Arabian",
    parentScale: "Synthetic",
    characteristicDegrees: ["3", "b5", "b6"],
    avoidDegrees: [],
    commonChords: ["7b5"],
    relatedScales: ["locrian", "mixolydian_b6"],
    genres: ["Jazz (rare)", "Art music", "Arabian fusion"],
    difficulty: "advanced",
    songExamples: [],
    learning: {
      practiceTips: [
        "Major triad tapi b5 — sangat unusual dan rare.",
        "Gunakan sebagai color scale, bukan tonalitas utama.",
      ],
      earTrainingHint:
        "Major yang 'collapses' — b5 dan b6 membuat major brightness runtuh.",
      harmonicApplications: ["Rare jazz applications.", "Arabian fusion."],
    },
  },

  super_lydian: {
    name: "Super Lydian",
    aliases: ["Lydian ♯5 ♯2"],
    ints: [0, 2, 4, 6, 8, 10, 11],
    deg: ["1", "2", "3", "#4", "#5", "b7", "7"],
    desc: "Semua nada dinaikkan kecuali root — skala paling bright dan floating. Mirip whole tone + leading tone.",
    family: "contemporary",
    region: "Western",
    parentScale: "Synthetic",
    characteristicDegrees: ["#4", "#5", "7"],
    avoidDegrees: [],
    commonChords: ["aug", "maj7#5"],
    relatedScales: ["leading_whole_tone", "whole_tone"],
    genres: ["Jazz (rare)", "Experimental"],
    difficulty: "advanced",
    songExamples: [],
    learning: {
      practiceTips: [
        "Paling bright — hampir semua nada raised.",
        "Mirip whole tone + leading tone.",
      ],
      earTrainingHint:
        "Paling floating/bright — semua nada raised seolah-olah gravity hilang.",
      harmonicApplications: ["Experimental jazz.", "Avant-garde composition."],
    },
  },

  // ╔══════════════════════════════════════════════════════╗
  // ║ 18. ADDITIONAL WORLD SCALES                         ║
  // ╚══════════════════════════════════════════════════════╝

  algerian: {
    name: "Algerian Scale",
    aliases: [],
    ints: [0, 2, 3, 5, 6, 7, 8, 11],
    deg: ["1", "2", "b3", "4", "b5", "5", "b6", "7"],
    desc: "Skala 8 nada dari tradisi Aljazair — mirip harmonic minor + chromatic passing. Sangat dramatis dan ekspresif.",
    family: "middle-eastern",
    region: "North Africa (Algeria)",
    parentScale: "North African tradition",
    characteristicDegrees: ["b3", "b5", "7"],
    avoidDegrees: [],
    commonChords: ["m", "mMaj7", "dim"],
    relatedScales: ["harmonic_minor", "hungarian_minor"],
    genres: ["North African", "Rai", "Andalusian", "Chaabi"],
    difficulty: "advanced",
    songExamples: [],
    learning: {
      practiceTips: [
        "8 nada dari tradisi Aljazair — mirip Harmonic Minor + chromatic passing.",
        "Sangat dramatis untuk North African compositional context.",
      ],
      earTrainingHint:
        "Harmonic Minor yang di-enrich dengan chromatic passing. Dramatic dan North African.",
      harmonicApplications: ["North African music.", "Rai and Chaabi."],
    },
  },

  kumoi: {
    name: "Kumoi",
    aliases: ["Japanese Kumoi"],
    ints: [0, 2, 3, 7, 9],
    deg: ["1", "2", "b3", "5", "6"],
    desc: "Pentatonik Jepang yang lembut — mirip minor pentatonic tapi dengan natural 6 yang memberi warmth. Sering terdengar di koto music.",
    family: "east-asian",
    region: "Japan",
    parentScale: "Japanese pentatonic family",
    characteristicDegrees: ["b3", "6"],
    avoidDegrees: [],
    commonChords: ["m", "m6"],
    relatedScales: ["hirajoshi", "dorian"],
    genres: ["Japanese traditional", "Koto", "Ambient"],
    difficulty: "intermediate",
    songExamples: [
      { title: "Rokudan no Shirabe", artist: "Yatsuhashi Kengyō" },
    ],
    learning: {
      practiceTips: [
        "Pentatonic Jepang yang lembut — b3 + 6 memberi warmth unik.",
        "Sering terdengar di koto music — mainkan dengan arpeggio/plucking style.",
      ],
      earTrainingHint:
        "Melankolis tapi warm — minor dengan natural 6 dalam 5-note context. Koto music feel.",
      harmonicApplications: [
        "Japanese koto-inspired music.",
        "Ambient dan atmospheric.",
      ],
    },
  },

  lydian_b7: {
    name: "Lydian ♭7",
    aliases: ["Lydian Dominant (alias)"],
    ints: [0, 2, 4, 6, 7, 9, 10],
    deg: ["1", "2", "3", "#4", "5", "6", "b7"],
    desc: "Alias entry untuk Lydian Dominant — memastikan pencarian dari kedua nama berhasil.",
    family: "melodic-minor-mode",
    region: "Western",
    parentScale: "Melodic minor mode 4",
    modeOf: "= Lydian Dominant",
    characteristicDegrees: ["#4", "b7"],
    avoidDegrees: [],
    commonChords: ["7#11"],
    relatedScales: ["lydian_dominant"],
    genres: ["Jazz", "Fusion"],
    difficulty: "advanced",
    songExamples: [],
    learning: {
      practiceTips: [
        "Alias untuk Lydian Dominant — lihat entry tersebut untuk tips lengkap.",
      ],
      earTrainingHint: "= Lydian Dominant. Major dengan #4 dan b7.",
      harmonicApplications: ["Sama dengan Lydian Dominant."],
    },
  },

  overtone_scale: {
    name: "Overtone Scale",
    aliases: ["Acoustic Scale", "Lydian Dominant (overtone context)"],
    ints: [0, 2, 4, 6, 7, 9, 10],
    deg: ["1", "2", "3", "#4", "5", "6", "b7"],
    desc: "Skala yang muncul alami dalam overtone series — identik dengan Lydian Dominant. Nama ini menekankan konteks akustik/scientific.",
    family: "contemporary",
    region: "Universal (physics of sound)",
    parentScale: "Overtone series",
    characteristicDegrees: ["#4", "b7"],
    avoidDegrees: [],
    commonChords: ["7", "7#11"],
    relatedScales: ["lydian_dominant"],
    genres: ["Bartók", "Spectral music", "Jazz"],
    difficulty: "intermediate",
    songExamples: [
      {
        title: "Music for Strings, Percussion and Celesta",
        artist: "Béla Bartók",
      },
    ],
    learning: {
      practiceTips: [
        "Identik dengan Lydian Dominant — menekankan konteks overtone/acoustic.",
        "Muncul alami di overtone series — explore dengan harmonics di gitar.",
      ],
      earTrainingHint:
        "= Lydian Dominant. Terdengar 'alami' karena muncul di overtone series.",
      harmonicApplications: [
        "Spectral music dan Bartók compositions.",
        "Natural harmonics exploration.",
      ],
    },
  },

  major_pent_b3: {
    name: "Blues Major Pentatonic (b3 added)",
    aliases: ["Country Scale"],
    ints: [0, 2, 3, 4, 7, 9],
    deg: ["1", "2", "b3", "3", "5", "6"],
    desc: "Major pentatonic + b3 chromatic passing — memberikan warna country/blues yang khas pada soloing.",
    family: "blues",
    region: "America",
    parentScale: "Major pentatonic",
    characteristicDegrees: ["b3", "3"],
    avoidDegrees: [],
    commonChords: ["7", "6", "9"],
    relatedScales: ["major_pent", "major_blues"],
    genres: ["Country", "Country blues", "Southern rock"],
    difficulty: "intermediate",
    songExamples: [{ title: "Workin' Man Blues", artist: "Merle Haggard" }],
    learning: {
      practiceTips: [
        "Major pentatonic + b3 = country blues gold.",
        "Chromatic slide b3→3 adalah signature country guitar lick.",
      ],
      earTrainingHint:
        "Country yang 'bluesy' — major pentatonic dengan chromatic passing b3.",
      harmonicApplications: ["Country guitar soloing.", "Southern rock."],
    },
  },

  // ── Celtic / Nordic ──────────────────────────────────

  celtic_minor: {
    name: "Celtic Minor",
    aliases: ["Dorian + natural minor blend"],
    ints: [0, 2, 3, 5, 7, 8, 9, 10],
    deg: ["1", "2", "b3", "4", "5", "b6", "6", "b7"],
    desc: "Skala 8 nada yang blend antara natural minor (b6) dan Dorian (natural 6) — khas musik Celtic dimana kedua 6th sering alternated.",
    family: "european-folk",
    region: "Celtic (Ireland, Scotland, Wales)",
    parentScale: "Minor blend",
    characteristicDegrees: ["b3", "b6", "6"],
    avoidDegrees: [],
    commonChords: ["m", "m7"],
    relatedScales: ["natural_minor", "dorian"],
    genres: ["Celtic", "Irish folk", "Scottish traditional"],
    difficulty: "intermediate",
    songExamples: [{ title: "Danny Boy", artist: "Traditional Irish" }],
    learning: {
      practiceTips: [
        "8 nada blend Dorian + Aeolian — b6 DAN natural 6 dipakai bergantian.",
        "Khas Irish/Scottish: alternate kedua 6th untuk authenticity.",
      ],
      earTrainingHint:
        "Minor tapi dengan 'shimmer' dari alternating b6/natural 6. Warna Celtic yang khas.",
      harmonicApplications: [
        "Celtic/Irish folk music.",
        "Scottish traditional music.",
      ],
    },
  },

  // ╔══════════════════════════════════════════════════════╗
  // ║ 19. HEXATONIC SCALES                                ║
  // ╚══════════════════════════════════════════════════════╝

  major_hexatonic: {
    name: "Major Hexatonic",
    aliases: ["Major scale minus 7th"],
    ints: [0, 2, 4, 5, 7, 9],
    deg: ["1", "2", "3", "4", "5", "6"],
    desc: "Major scale tanpa 7th — 6 nada. Warna major yang hangat tanpa leading tone tension.",
    family: "hexatonic",
    region: "Universal",
    parentScale: "Major scale",
    characteristicDegrees: ["3", "6"],
    avoidDegrees: [],
    commonChords: ["maj", "6"],
    relatedScales: ["ionian", "major_pent"],
    genres: ["Pop", "Folk", "World"],
    difficulty: "beginner",
    songExamples: [],
    learning: {
      practiceTips: [
        "Major tanpa 7th — warna hangat tanpa leading tone tension.",
        "Pentatonic + satu nada ekstra — natural transition dari pentatonic.",
      ],
      earTrainingHint:
        "Major yang 'relaxed' tanpa leading tone tension. Warmth tanpa urgency.",
      harmonicApplications: [
        "Melodi folk dan pop.",
        "Transition dari pentatonic ke full scale.",
      ],
    },
  },

  minor_hexatonic: {
    name: "Minor Hexatonic",
    aliases: ["Minor scale minus 6th"],
    ints: [0, 2, 3, 5, 7, 10],
    deg: ["1", "2", "b3", "4", "5", "b7"],
    desc: "Natural minor tanpa 6th — 6 nada. Warna minor yang smooth tanpa b6 tension.",
    family: "hexatonic",
    region: "Universal",
    parentScale: "Natural minor",
    characteristicDegrees: ["b3", "b7"],
    avoidDegrees: [],
    commonChords: ["m", "m7"],
    relatedScales: ["natural_minor", "minor_pent"],
    genres: ["Pop", "Rock", "Folk"],
    difficulty: "beginner",
    songExamples: [],
    learning: {
      practiceTips: [
        "Natural Minor tanpa 6th — smooth tanpa b6 tension.",
        "Pentatonic minor + 2nd — graduated learning.",
      ],
      earTrainingHint:
        "Minor yang 'smooth' tanpa drama b6. Clean dan straightforward.",
      harmonicApplications: ["Pop and folk minor melodies."],
    },
  },

  // ╔══════════════════════════════════════════════════════╗
  // ║ 20. MISC & RARE SCALES                              ║
  // ╚══════════════════════════════════════════════════════╝

  istrian: {
    name: "Istrian Scale",
    aliases: [],
    ints: [0, 1, 3, 4, 6, 7],
    deg: ["1", "b2", "b3", "3", "b5", "5"],
    desc: "Skala 6 nada dari region Istria (Croatia/Slovenia/Italy) — warna dark dan chromatic yang unik.",
    family: "european-folk",
    region: "Istria (Croatia/Slovenia)",
    parentScale: "Istrian folk tradition",
    characteristicDegrees: ["b2", "3", "b5"],
    avoidDegrees: [],
    commonChords: ["dim"],
    relatedScales: ["diminished_hw"],
    genres: ["Istrian folk", "Croatian traditional"],
    difficulty: "advanced",
    songExamples: [],
    learning: {
      practiceTips: [
        "6 nada dari region Istria — dark dan chromatic.",
        "Rare tapi interesting untuk exploration regional music.",
      ],
      earTrainingHint: "Dark dan chromatic — warna regional Istria yang unik.",
      harmonicApplications: ["Istrian/Croatian folk tradition."],
    },
  },

  piongio: {
    name: "Tcherepnin Major Pentatonic",
    aliases: ["Piongio"],
    ints: [0, 2, 4, 5, 7, 9, 10, 11],
    deg: ["1", "2", "3", "4", "5", "6", "b7", "7"],
    desc: "Skala 8 nada oleh Tcherepnin — major scale + added b7. Mirip Bebop Major konsep.",
    family: "contemporary",
    region: "Western (Russian-French)",
    parentScale: "Tcherepnin system",
    characteristicDegrees: ["b7", "7"],
    avoidDegrees: [],
    commonChords: ["maj7", "7"],
    relatedScales: ["bebop_dominant", "ionian"],
    genres: ["Art music", "20th century classical"],
    difficulty: "advanced",
    songExamples: [],
    learning: {
      practiceTips: [
        "8 nada Tcherepnin — mirip konsep Bebop Major.",
        "Modal tetapi dengan added chromatic variety.",
      ],
      earTrainingHint:
        "Major dengan added b7 — Bebop Major dengan nama berbeda.",
      harmonicApplications: ["20th century classical composition."],
    },
  },

  two_semitone_tritone: {
    name: "Two-Semitone Tritone",
    aliases: ["Messiaen Mode 5 (partial)"],
    ints: [0, 1, 2, 6, 7, 8],
    deg: ["1", "b2", "2", "b5", "5", "b6"],
    desc: "Skala simetris 6 nada — dua kelompok 3 chromatic notes yang dipisahkan tritone. Warna sangat tense.",
    family: "symmetric",
    region: "Western (20th century)",
    parentScale: "Messiaen mode",
    characteristicDegrees: ["b2", "b5"],
    avoidDegrees: [],
    commonChords: [],
    relatedScales: ["tritone_scale"],
    genres: ["Contemporary classical", "Spectral", "Messiaen"],
    difficulty: "advanced",
    songExamples: [],
    learning: {
      practiceTips: [
        "Simetris 6 nada — 2 kelompok 3 chromatic notes berjarak tritone.",
        "Messiaen Mode 5 — explore seri Modes of Limited Transposition.",
      ],
      earTrainingHint:
        "Sangat tense dan simetris — 2 cluster chromatic dipisahkan tritone.",
      harmonicApplications: [
        "Messiaen-inspired composition.",
        "Spectral dan contemporary classical.",
      ],
    },
  },
};

// ════════════════════════════════════════════════════════
// Generator Functions
// ════════════════════════════════════════════════════════

export function generateScale(
  root: string,
  scaleKey: keyof typeof MASTER_SCALES,
  opts: { spell?: SpellMode } = { spell: "auto" },
): ScaleInstance {
  const spec = MASTER_SCALES[scaleKey];
  if (!spec) throw new Error(`Unknown scale key: ${String(scaleKey)}`);
  const rpc = rootToPc(root);
  const notes = spec.ints.map((semi) => {
    const pc = (rpc + semi) % 12;
    return pickName(pc, root, opts.spell);
  });
  const composed = spec.deg.map((d, i) => ({ degree: d, note: notes[i] }));
  return {
    root,
    scale: spec.name,
    type: scaleKey,
    description: spec.desc,
    aliases: spec.aliases?.slice() ?? [],
    degrees: spec.deg.slice(),
    notes,
    composed,
    family: spec.family,
    region: spec.region,
    parentScale: spec.parentScale,
    modeOf: spec.modeOf,
    semitonePattern: spec.ints.slice(),
    stepFormula: buildStepFormula(spec.ints),
    characteristicDegrees: spec.characteristicDegrees.slice(),
    avoidDegrees: spec.avoidDegrees?.slice() ?? [],
    commonChords: spec.commonChords.slice(),
    relatedScales: spec.relatedScales?.slice() ?? [],
    genres: spec.genres.slice(),
    difficulty: spec.difficulty,
    songExamples: spec.songExamples.map((song) => ({ ...song })),
    learning: spec.learning,
  };
}

export function generateAllScales(
  opts: { roots?: string[]; spell?: SpellMode } = {},
): ScaleInstance[] {
  const roots = opts.roots ?? PITCH_CLASSES.map((p) => p.names[0]);
  const out: ScaleInstance[] = [];
  for (const r of roots) {
    for (const key of Object.keys(MASTER_SCALES) as Array<
      keyof typeof MASTER_SCALES
    >) {
      out.push(generateScale(r, key, { spell: opts.spell ?? "auto" }));
    }
  }
  return out;
}

/**
 * Read-only accessor for the master scale definitions.
 * Used by cross-reference computation to find scale↔chord relations.
 */
export function getScalesMaster(): Record<
  string,
  {
    name: string;
    commonChords: string[];
    ints: number[];
    family: string;
    relatedScales: string[];
  }
> {
  const result: Record<
    string,
    {
      name: string;
      commonChords: string[];
      ints: number[];
      family: string;
      relatedScales: string[];
    }
  > = {};
  for (const [key, spec] of Object.entries(MASTER_SCALES)) {
    result[key] = {
      name: spec.name,
      commonChords: spec.commonChords,
      ints: spec.ints,
      family: spec.family,
      relatedScales: spec.relatedScales ?? [],
    };
  }
  return result;
}

/**
 * Get all scale keys available in MASTER_SCALES.
 */
export function getScaleKeys(): string[] {
  return Object.keys(MASTER_SCALES);
}

/**
 * Get the full ScaleSpec for a given key.
 * Useful for detail views or cross-reference enrichment.
 */
export function getScaleSpec(
  key: string,
): (ScaleSpec & { key: string }) | null {
  const spec = MASTER_SCALES[key];
  if (!spec) return null;
  return { ...spec, key };
}

/**
 * Get all scale families available.
 */
export function getScaleFamilies(): ScaleFamilyType[] {
  const families = new Set<ScaleFamilyType>();
  for (const spec of Object.values(MASTER_SCALES)) {
    families.add(spec.family);
  }
  return Array.from(families);
}

/**
 * Get scales filtered by family.
 */
export function getScalesByFamily(
  family: ScaleFamilyType,
): { key: string; name: string; ints: number[]; difficulty: string }[] {
  return Object.entries(MASTER_SCALES)
    .filter(([, spec]) => spec.family === family)
    .map(([key, spec]) => ({
      key,
      name: spec.name,
      ints: spec.ints,
      difficulty: spec.difficulty,
    }));
}

/**
 * Get scales filtered by difficulty.
 */
export function getScalesByDifficulty(
  difficulty: "beginner" | "intermediate" | "advanced",
): { key: string; name: string; family: string }[] {
  return Object.entries(MASTER_SCALES)
    .filter(([, spec]) => spec.difficulty === difficulty)
    .map(([key, spec]) => ({
      key,
      name: spec.name,
      family: spec.family,
    }));
}

/**
 * Search scales by keyword (name, aliases, genres, region).
 */
export function searchScales(
  query: string,
): { key: string; name: string; aliases: string[]; family: string }[] {
  const q = query.toLowerCase();
  return Object.entries(MASTER_SCALES)
    .filter(([key, spec]) => {
      return (
        key.includes(q) ||
        spec.name.toLowerCase().includes(q) ||
        spec.aliases?.some((a) => a.toLowerCase().includes(q)) ||
        spec.genres.some((g) => g.toLowerCase().includes(q)) ||
        spec.region?.toLowerCase().includes(q) ||
        spec.desc.toLowerCase().includes(q)
      );
    })
    .map(([key, spec]) => ({
      key,
      name: spec.name,
      aliases: spec.aliases ?? [],
      family: spec.family,
    }));
}

/**
 * Get total count of scales in the master database.
 */
export function getScaleCount(): number {
  return Object.keys(MASTER_SCALES).length;
}
