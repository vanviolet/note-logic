// Intervals generator (TypeScript)

import {
  pickName,
  rootToPc,
  type SpellMode,
  type IntervalQuality,
  type ConsonanceLevel,
} from "./core";

// Re-export core types for backward compatibility
export type { IntervalQuality, ConsonanceLevel };

export interface IntervalSongReference {
  title: string;
  artist: string;
  note?: string;
}

export interface IntervalSpec {
  name: string;
  short: string; // P1, m2, M2, ...
  semitone: number;
  number: number;
  quality: IntervalQuality;
  intervalClass: number;
  cents: number;
  ratioApprox: string;
  consonance: ConsonanceLevel;
  aliases?: string[];
  functionHints: string[];
  description: string;
  songExamples?: IntervalSongReference[];
}

export interface GeneratedInterval extends IntervalSpec {
  root: string;
  note: string;
  pitchClass: number;
  inversionName: string;
  inversionShort: string;
}

const INTERVALS: IntervalSpec[] = [
  {
    name: "Unison",
    short: "P1",
    semitone: 0,
    number: 1,
    quality: "perfect",
    intervalClass: 0,
    cents: 0,
    ratioApprox: "1:1",
    consonance: "perfect-consonance",
    aliases: ["Prime"],
    functionHints: [
      "Menegaskan identitas root atau nada target.",
      "Digunakan untuk doubling dan stabilitas ekstrem.",
    ],
    description:
      "Unison adalah dua nada dengan pitch sama persis. Dalam aransemen, unison mempertebal garis melodi dan memberikan fokus tonal paling stabil tanpa gesekan harmonik.",
    songExamples: [
      {
        title: "Smoke on the Water",
        artist: "Deep Purple",
        note: "Banyak doubling riff unison",
      },
    ],
  },
  {
    name: "Minor 2nd",
    short: "m2",
    semitone: 1,
    number: 2,
    quality: "minor",
    intervalClass: 1,
    cents: 100,
    ratioApprox: "16:15",
    consonance: "dissonance",
    functionHints: [
      "Menciptakan ketegangan paling dekat dan intens.",
      "Efektif untuk warna horror, cluster, dan chromatic approach tone.",
    ],
    description:
      "Minor second adalah langkah semitone, interval paling rapat dalam 12-TET. Karakternya sangat tegang dan biasanya menuntut resolusi, sehingga sering dipakai untuk efek dramatis.",
    songExamples: [{ title: "Jaws Theme", artist: "John Williams" }],
  },
  {
    name: "Major 2nd",
    short: "M2",
    semitone: 2,
    number: 2,
    quality: "major",
    intervalClass: 2,
    cents: 200,
    ratioApprox: "9:8",
    consonance: "dissonance",
    functionHints: [
      "Langkah melodi paling umum pada scale diatonik.",
      "Sering jadi passing tone atau extension 9 di chord modern.",
    ],
    description:
      "Major second adalah jarak satu whole-step. Walau sedikit tegang secara vertikal, secara melodik interval ini sangat natural dan menjadi fondasi pergerakan scale mayor/minor.",
    songExamples: [
      {
        title: "Happy Birthday",
        artist: "Traditional",
        note: "Awalan melodi memakai langkah M2",
      },
    ],
  },
  {
    name: "Minor 3rd",
    short: "m3",
    semitone: 3,
    number: 3,
    quality: "minor",
    intervalClass: 3,
    cents: 300,
    ratioApprox: "6:5",
    consonance: "imperfect-consonance",
    functionHints: [
      "Penentu utama kualitas chord minor.",
      "Warna emosional cenderung gelap, mellow, atau melankolis.",
    ],
    description:
      "Minor third adalah interval inti pembentuk triad minor (1–♭3–5). Karakternya emosional dan sering muncul pada melodi soulful, blues, dan lagu bernuansa sedih.",
    songExamples: [
      {
        title: "Greensleeves",
        artist: "Traditional",
        note: "Frase pembuka menonjolkan m3",
      },
    ],
  },
  {
    name: "Major 3rd",
    short: "M3",
    semitone: 4,
    number: 3,
    quality: "major",
    intervalClass: 4,
    cents: 400,
    ratioApprox: "5:4",
    consonance: "imperfect-consonance",
    functionHints: [
      "Penentu utama kualitas chord mayor.",
      "Memberi karakter cerah, terbuka, dan afirmatif.",
    ],
    description:
      "Major third adalah interval identitas chord mayor. Dalam harmoni tonal, interval ini menegaskan nuansa bright dan stabil, serta sering dipakai sebagai voice-leading target dari sus4.",
    songExamples: [
      {
        title: "When the Saints Go Marching In",
        artist: "Traditional",
        note: "Motif awal mencerminkan warna M3",
      },
    ],
  },
  {
    name: "Perfect 4th",
    short: "P4",
    semitone: 5,
    number: 4,
    quality: "perfect",
    intervalClass: 5,
    cents: 500,
    ratioApprox: "4:3",
    consonance: "perfect-consonance",
    functionHints: [
      "Stabil dalam konteks melodik dan quartal harmony.",
      "Pada sus4, interval ini menahan resolusi menuju third.",
    ],
    description:
      "Perfect fourth memiliki karakter stabil namun bisa terasa suspended dalam konteks tonal chord (terutama ketika berada di atas root sebagai sus4). Umum dipakai pada himne dan voicing kuartal.",
    songExamples: [{ title: "Here Comes the Bride", artist: "Richard Wagner" }],
  },
  {
    name: "Tritone",
    short: "TT",
    semitone: 6,
    number: 4,
    quality: "augmented",
    intervalClass: 6,
    cents: 600,
    ratioApprox: "45:32",
    consonance: "dissonance",
    aliases: ["Augmented 4th", "Diminished 5th"],
    functionHints: [
      "Sumber ketegangan utama pada dominant 7 (antara 3 dan ♭7).",
      "Dipakai pada blues, jazz altered, dan metal untuk warna agresif.",
    ],
    description:
      "Tritone membagi oktaf menjadi dua bagian sama (6 semitone) dan terkenal sebagai interval bertegangan tinggi. Dalam harmoni fungsional, tritone mendorong resolusi kuat ke tonik.",
    songExamples: [
      {
        title: "Maria",
        artist: "Leonard Bernstein",
        note: "Lompatan tritone pada motif terkenal",
      },
    ],
  },
  {
    name: "Perfect 5th",
    short: "P5",
    semitone: 7,
    number: 5,
    quality: "perfect",
    intervalClass: 5,
    cents: 700,
    ratioApprox: "3:2",
    consonance: "perfect-consonance",
    functionHints: [
      "Paling stabil setelah unison dan octave.",
      "Fondasi power chord, drone, dan open-string resonance.",
    ],
    description:
      "Perfect fifth adalah interval stabil yang sangat penting dalam harmoni dan tuning. Rasio sederhana (3:2) membuatnya terdengar kuat, jelas, dan banyak dipakai pada gitar elektrik.",
    songExamples: [
      {
        title: "Twinkle Twinkle Little Star",
        artist: "Traditional",
        note: "Kontur awal menegaskan P5",
      },
    ],
  },
  {
    name: "Minor 6th",
    short: "m6",
    semitone: 8,
    number: 6,
    quality: "minor",
    intervalClass: 4,
    cents: 800,
    ratioApprox: "8:5",
    consonance: "imperfect-consonance",
    functionHints: [
      "Memberi warna romantik gelap atau melankolis.",
      "Sering muncul sebagai inversi dari major third.",
    ],
    description:
      "Minor sixth adalah inversi dari major third. Dalam melodi, interval ini terasa emosional dan ekspresif; dalam harmoni sering dipakai untuk warna minor yang lebih lembut.",
    songExamples: [
      {
        title: "The Entertainer",
        artist: "Scott Joplin",
        note: "Frase motif menonjolkan m6",
      },
    ],
  },
  {
    name: "Major 6th",
    short: "M6",
    semitone: 9,
    number: 6,
    quality: "major",
    intervalClass: 3,
    cents: 900,
    ratioApprox: "5:3",
    consonance: "imperfect-consonance",
    functionHints: [
      "Warna hangat dan optimistis pada melodi.",
      "Umum pada chord 6 dan melodic contour klasik-pop.",
    ],
    description:
      "Major sixth adalah inversi dari minor third. Karakternya luas, hangat, dan sering dipakai untuk melodi romantik atau cinematic yang terasa uplifting.",
    songExamples: [
      { title: "My Bonnie Lies Over the Ocean", artist: "Traditional" },
    ],
  },
  {
    name: "Minor 7th",
    short: "m7",
    semitone: 10,
    number: 7,
    quality: "minor",
    intervalClass: 2,
    cents: 1000,
    ratioApprox: "9:5",
    consonance: "dissonance",
    functionHints: [
      "Sangat khas untuk chord dominant7 dan m7.",
      "Memberi warna bluesy/jazzy dengan rasa belum final.",
    ],
    description:
      "Minor seventh adalah interval penting dalam jazz dan blues harmony. Ia menciptakan rasa suspended resolution, terutama ketika dipasangkan dengan major third pada dominant chord.",
    songExamples: [
      {
        title: "Somewhere",
        artist: "Leonard Bernstein",
        note: "Lompatan m7 pada melodi",
      },
    ],
  },
  {
    name: "Major 7th",
    short: "M7",
    semitone: 11,
    number: 7,
    quality: "major",
    intervalClass: 1,
    cents: 1100,
    ratioApprox: "15:8",
    consonance: "dissonance",
    functionHints: [
      "Menciptakan tarikan kuat menuju octave/tonik.",
      "Karakter halus-tegang khas chord maj7 modern.",
    ],
    description:
      "Major seventh terdengar elegan namun tegang karena jaraknya hanya semitone dari octave. Interval ini sering dipakai dalam jazz, city pop, dan neo-soul untuk warna sophisticated.",
    songExamples: [
      {
        title: "Take On Me",
        artist: "a-ha",
        note: "Lompatan melodi mencolok mengandung warna M7",
      },
    ],
  },
  {
    name: "Octave",
    short: "P8",
    semitone: 12,
    number: 8,
    quality: "perfect",
    intervalClass: 0,
    cents: 1200,
    ratioApprox: "2:1",
    consonance: "perfect-consonance",
    functionHints: [
      "Menguatkan root atau melodi tanpa ubah identitas pitch class.",
      "Umum untuk doubling vokal, riff, dan bass-line reinforcement.",
    ],
    description:
      "Octave adalah penggandaan frekuensi (2:1) dari nada dasar. Terdengar sangat stabil dan sering dipakai untuk mempertegas energi melodi atau bass.",
    songExamples: [
      {
        title: "Somewhere Over the Rainbow",
        artist: "Judy Garland",
        note: "Melodi pembuka terkenal melompat satu octave",
      },
    ],
  },
];

const INVERSION_MAP: Record<string, { name: string; short: string }> = {
  P1: { name: "Perfect Octave", short: "P8" },
  m2: { name: "Major 7th", short: "M7" },
  M2: { name: "Minor 7th", short: "m7" },
  m3: { name: "Major 6th", short: "M6" },
  M3: { name: "Minor 6th", short: "m6" },
  P4: { name: "Perfect 5th", short: "P5" },
  TT: { name: "Tritone", short: "TT" },
  P5: { name: "Perfect 4th", short: "P4" },
  m6: { name: "Major 3rd", short: "M3" },
  M6: { name: "Minor 3rd", short: "m3" },
  m7: { name: "Major 2nd", short: "M2" },
  M7: { name: "Minor 2nd", short: "m2" },
  P8: { name: "Perfect Unison", short: "P1" },
};

export function generateIntervals(
  root: string,
  opts: { spell?: SpellMode } = { spell: "auto" },
): GeneratedInterval[] {
  const rpc = rootToPc(root);

  return INTERVALS.map((interval) => {
    const pc = (rpc + (interval.semitone % 12)) % 12;
    const note = pickName(pc, root, opts.spell ?? "auto");
    const inversion = INVERSION_MAP[interval.short] ?? {
      name: "Unknown inversion",
      short: "?",
    };

    return {
      ...interval,
      root,
      note,
      pitchClass: pc,
      inversionName: inversion.name,
      inversionShort: inversion.short,
    };
  });
}

export function getIntervalByShort(short: string): IntervalSpec | undefined {
  return INTERVALS.find((it) => it.short.toLowerCase() === short.toLowerCase());
}

export function getIntervalsMaster(): IntervalSpec[] {
  return INTERVALS.map((it) => ({ ...it }));
}
