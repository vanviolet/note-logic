// ════════════════════════════════════════════════════════
// Dictionary Data – Scales & Modes
// ════════════════════════════════════════════════════════

import type { DictionaryEntry } from "../types";

export const SCALE_ENTRIES: DictionaryEntry[] = [
  {
    id: "scale",
    term: "Scale",
    termId: "Tangga nada",
    aliases: ["Tangga nada"],
    category: "scale",
    subCategory: "scale-general",
    instrumentContext: "general",
    shortDefinition: "Urutan nada terstruktur dalam satu oktaf.",
    detailedDefinition:
      "Scale adalah himpunan nada dengan pola interval tertentu. Scale menjadi sumber melodi, harmoni, dan identitas modal/tonal dalam musik. Contoh: major scale, minor scale, pentatonic, blues, chromatic.",
    relatedTerms: ["mode", "key", "scale-formula"],
    tags: ["scale", "tangga nada"],
    sortOrder: 0,
  },
  {
    id: "diatonic",
    term: "Diatonic",
    termId: "Diatonik",
    category: "scale",
    subCategory: "scale-general",
    instrumentContext: "general",
    shortDefinition: "Nada/chord yang berasal dari satu tangga nada tertentu.",
    detailedDefinition:
      "Diatonic berarti elemen musik masih berada di dalam koleksi nada suatu key/scale. Chord diatonic biasanya dibangun dari stacking third pada scale tersebut tanpa accidental di luar key. Contoh: dalam C major, seluruh nada putih piano adalah diatonic.",
    examples: ["Dalam C mayor: C, Dm, Em, F, G, Am, Bdim"],
    relatedTerms: ["key", "scale-degree", "functional-harmony"],
    tags: ["diatonic", "diatonik"],
    sortOrder: 1,
  },
  {
    id: "chromatic",
    term: "Chromatic",
    termId: "Kromatik",
    category: "scale",
    subCategory: "scale-general",
    instrumentContext: "general",
    shortDefinition: "Menggunakan nada di luar koleksi diatonik utama.",
    detailedDefinition:
      "Chromatic menunjuk gerak atau warna nada yang menyertakan semitone berturut-turut atau accidental di luar key saat ini. Chromatic scale berisi semua 12 nada. Sering dipakai untuk passing tone, modulation, dan reharmonisasi.",
    relatedTerms: ["accidental", "modulation", "altered"],
    tags: ["chromatic", "kromatik", "12 nada"],
    sortOrder: 2,
  },
  {
    id: "mode",
    term: "Mode",
    termId: "Modus",
    category: "scale",
    subCategory: "modes",
    instrumentContext: "general",
    shortDefinition: "Variasi scale berdasarkan pusat tonal berbeda.",
    detailedDefinition:
      "Mode (Ionian, Dorian, Phrygian, Lydian, Mixolydian, Aeolian, Locrian) adalah rotasi pola diatonik yang menghasilkan warna emosional dan fungsi harmonik berbeda walau koleksi nadanya bisa sama. Setiap mode memiliki characteristic note yang membedakannya.",
    examples: [
      "C Ionian = C major scale",
      "D Dorian = D E F G A B C",
      "E Phrygian = E F G A B C D",
    ],
    relatedTerms: ["scale", "tonic", "modal-harmony"],
    tags: [
      "mode",
      "modus",
      "ionian",
      "dorian",
      "phrygian",
      "lydian",
      "mixolydian",
      "aeolian",
      "locrian",
    ],
    sortOrder: 0,
  },
  {
    id: "scale-formula",
    term: "Scale Formula",
    termId: "Rumus tangga nada",
    category: "scale",
    subCategory: "scale-formula",
    instrumentContext: "general",
    shortDefinition: "Rumus pola interval pembentuk suatu scale.",
    detailedDefinition:
      "Scale formula menuliskan struktur langkah (W/H) atau degree relatif (1, 2, ♭3, dst) agar pola scale mudah ditransposisi ke root mana pun. Misalnya major = W-W-H-W-W-W-H, natural minor = W-H-W-W-H-W-W.",
    examples: ["Major: W-W-H-W-W-W-H", "Minor pentatonic: 1 ♭3 4 5 ♭7"],
    relatedTerms: ["formula", "degree", "scale"],
    tags: ["formula", "rumus", "pattern"],
    sortOrder: 0,
  },

  // ── Specific Scales ──────────────────────────────────
  {
    id: "major-scale",
    term: "Major Scale",
    termId: "Tangga nada mayor",
    aliases: ["Ionian"],
    category: "scale",
    subCategory: "scale-general",
    instrumentContext: "general",
    shortDefinition: "Tangga nada dengan pola W-W-H-W-W-W-H — karakter cerah.",
    detailedDefinition:
      "Major scale (mode Ionian) adalah tangga nada paling fundamental dalam musik Barat. Terdiri dari 7 nada dengan pola interval: whole–whole–half–whole–whole–whole–half. Karakter: cerah, ceria, stabil. Semua chord diatonik dan konsep harmoni fungsional dibangun dari major scale.",
    examples: [
      "C major: C D E F G A B",
      "G major: G A B C D E F#",
      "Di gitar: posisi terbuka C major dari fret 0-3",
    ],
    relatedTerms: ["natural-minor", "mode", "scale-formula", "diatonic"],
    guitarTechnique: {
      howTo:
        "Pelajari 5 posisi CAGED major scale di fretboard. Mulai dari posisi terbuka C major, lalu transposisi.",
      hand: "left",
      difficulty: "beginner",
    },
    tags: ["major scale", "ionian", "tangga nada mayor", "W-W-H-W-W-W-H"],
    sortOrder: 5,
  },
  {
    id: "natural-minor",
    term: "Natural Minor Scale",
    termId: "Tangga nada minor natural",
    aliases: ["Aeolian", "Minor scale"],
    category: "scale",
    subCategory: "scale-general",
    instrumentContext: "general",
    shortDefinition:
      "Tangga nada minor dasar dengan pola W-H-W-W-H-W-W — karakter sedih.",
    detailedDefinition:
      "Natural minor scale (mode Aeolian) memiliki pola interval: whole–half–whole–whole–half–whole–whole. Karakter: melankolis, gelap, emosional. Relative minor dari major scale dimulai dari derajat ke-6 (mis. A minor = relative dari C major). Tidak memiliki leading tone yang kuat ke tonic.",
    examples: [
      "A minor: A B C D E F G",
      "E minor: E F# G A B C D",
      "D minor: D E F G A Bb C",
    ],
    relatedTerms: ["major-scale", "harmonic-minor", "melodic-minor", "aeolian"],
    tags: [
      "natural minor",
      "aeolian",
      "minor scale",
      "tangga nada minor",
      "W-H-W-W-H-W-W",
    ],
    sortOrder: 6,
  },
  {
    id: "harmonic-minor",
    term: "Harmonic Minor Scale",
    termId: "Tangga nada minor harmonik",
    category: "scale",
    subCategory: "scale-general",
    instrumentContext: "general",
    shortDefinition:
      "Minor scale dengan derajat ke-7 dinaikkan — memberi leading tone kuat.",
    detailedDefinition:
      "Harmonic minor menaikkan derajat ke-7 dari natural minor sehingga terbentuk interval augmented second antara ♭6 dan 7, dan leading tone yang kuat ke tonic. Pola: W-H-W-W-H-WH-H (WH = 3 semitone). Warna: eksotis/timur tengah karena augmented second. Chord V menjadi major/dominant (bukan minor).",
    examples: [
      "A harmonic minor: A B C D E F G#",
      "Interval ♭6–7 (F–G#) = augmented second",
    ],
    relatedTerms: ["natural-minor", "melodic-minor", "dominant"],
    tags: [
      "harmonic minor",
      "minor harmonik",
      "raised 7th",
      "augmented second",
    ],
    sortOrder: 7,
  },
  {
    id: "melodic-minor",
    term: "Melodic Minor Scale",
    termId: "Tangga nada minor melodis",
    category: "scale",
    subCategory: "scale-general",
    instrumentContext: "general",
    shortDefinition:
      "Minor scale dengan ♯6 dan ♯7 naik, natural turun (klasik) — atau selalu ♯6♯7 (jazz).",
    detailedDefinition:
      "Melodic minor dalam tradisi klasik menaikkan derajat ke-6 dan ke-7 saat naik (menghilangkan augmented second), dan kembali ke natural minor saat turun. Dalam jazz, versi ascending dipakai selalu (disebut 'jazz minor'). Mode-mode dari melodic minor menghasilkan scale penting: Dorian ♭2, Lydian Augmented, Lydian Dominant, Mixolydian ♭6, Locrian ♮2, Altered.",
    examples: [
      "A melodic minor naik: A B C D E F# G#",
      "A melodic minor turun (klasik): A G F E D C B A",
      "Jazz minor = selalu ascending form",
    ],
    relatedTerms: ["harmonic-minor", "natural-minor", "altered"],
    tags: ["melodic minor", "jazz minor", "raised 6 7"],
    sortOrder: 8,
  },
  {
    id: "pentatonic-major",
    term: "Major Pentatonic Scale",
    termId: "Pentatonik mayor",
    category: "scale",
    subCategory: "pentatonic",
    instrumentContext: "guitar",
    shortDefinition: "Tangga nada 5 nada dari major scale tanpa derajat 4 & 7.",
    detailedDefinition:
      "Major pentatonic scale menghilangkan derajat 4 dan 7 dari major scale, menyisakan 5 nada tanpa semitone. Formula: 1-2-3-5-6. Karakter: cerah, terbuka, aman untuk improvisasi karena tidak ada 'nada salah'. Sangat populer di country, rock, pop, dan blues.",
    examples: [
      "C major pentatonic: C D E G A",
      "G major pentatonic: G A B D E",
    ],
    relatedTerms: ["pentatonic-minor", "major-scale", "blues-scale"],
    guitarTechnique: {
      howTo:
        "Pelajari 5 posisi/box pentatonic di fretboard. Box 1 pentatonic mayor dimulai dari root di string 6.",
      hand: "left",
      difficulty: "beginner",
      tips: [
        "Pentatonic mayor box 1 = pentatonic minor box 2 (relative)",
        "Sangat aman untuk solo — hampir tidak ada nada yang clash",
      ],
    },
    tags: ["pentatonic major", "pentatonik mayor", "5 nada", "country"],
    sortOrder: 9,
  },
  {
    id: "pentatonic-minor",
    term: "Minor Pentatonic Scale",
    termId: "Pentatonik minor",
    category: "scale",
    subCategory: "pentatonic",
    instrumentContext: "guitar",
    shortDefinition:
      "Tangga nada 5 nada paling populer untuk solo gitar: 1 ♭3 4 5 ♭7.",
    detailedDefinition:
      "Minor pentatonic scale adalah scale paling banyak digunakan untuk solo gitar. Formula: 1-♭3-4-5-♭7 (5 nada, tanpa semitone). Karakter: bluesy, rock, kuat. Dengan menambahkan blue note (♭5) menjadi blues scale. Posisi box 1 (root di string 6) adalah pattern pertama yang dipelajari gitaris.",
    examples: [
      "A minor pentatonic: A C D E G",
      "E minor pentatonic: E G A B D",
    ],
    relatedTerms: ["pentatonic-major", "blues-scale", "natural-minor"],
    guitarTechnique: {
      howTo:
        "Box 1: root di string 6 → pattern 2 nada per string. Ini adalah pattern solo paling dasar dan paling sering digunakan.",
      hand: "left",
      difficulty: "beginner",
      fretContext: "Box 1 Am pentatonic = fret 5-8",
      tips: [
        "Tambahkan bend di fret 7 string 3 untuk nuansa blues",
        "Hubungkan 5 box untuk menguasai seluruh fretboard",
      ],
    },
    tags: [
      "pentatonic minor",
      "pentatonik minor",
      "solo",
      "box 1",
      "blues rock",
    ],
    sortOrder: 10,
  },
  {
    id: "blues-scale",
    term: "Blues Scale",
    termId: "Tangga nada blues",
    category: "scale",
    subCategory: "pentatonic",
    instrumentContext: "guitar",
    shortDefinition: "Minor pentatonic + blue note (♭5): 1 ♭3 4 ♭5 5 ♭7.",
    detailedDefinition:
      "Blues scale adalah minor pentatonic dengan tambahan ♭5 (blue note) — nada kromatik antara 4 dan 5 yang memberi karakter 'blues' yang khas. Formula: 1-♭3-4-♭5-5-♭7 (6 nada). Blue note biasanya digunakan sebagai passing tone atau bent note, bukan nada istirahat.",
    examples: ["A blues scale: A C D D#/Eb E G", "E blues scale: E G A Bb B D"],
    relatedTerms: ["pentatonic-minor", "blue-note", "twelve-bar-blues"],
    guitarTechnique: {
      howTo:
        "Tambahkan satu nada (blue note) ke pattern minor pentatonic: di box 1, fret antara 4 dan 5 di string yang sama.",
      hand: "left",
      difficulty: "beginner",
    },
    tags: ["blues scale", "blue note", "b5", "tangga nada blues"],
    sortOrder: 11,
  },
  {
    id: "whole-tone-scale",
    term: "Whole Tone Scale",
    termId: "Tangga nada whole-tone",
    category: "scale",
    subCategory: "exotic-scale",
    instrumentContext: "general",
    shortDefinition:
      "Tangga nada simetris yang seluruhnya terdiri dari langkah whole-tone.",
    detailedDefinition:
      "Whole tone scale terdiri dari 6 nada yang semuanya berjarak whole-tone (2 semitone). Hanya ada 2 kemungkinan whole-tone scale (dimulai dari C atau dari C#). Karakter: mengambang, dreamlike, tanpa gravitasi tonal. Digunakan oleh Debussy dan dalam konteks augmented chord.",
    examples: [
      "C whole tone: C D E F# G# A#",
      "Hanya 2 transposisi unik (C dan Db)",
    ],
    relatedTerms: ["augmented", "whole-tone", "diminished-scale"],
    tags: ["whole tone scale", "simetris", "debussy", "dreamlike"],
    sortOrder: 12,
  },
  {
    id: "diminished-scale",
    term: "Diminished Scale",
    termId: "Tangga nada diminished",
    aliases: ["Octatonic scale"],
    category: "scale",
    subCategory: "exotic-scale",
    instrumentContext: "general",
    shortDefinition:
      "Tangga nada simetris 8 nada dengan pola H-W atau W-H bergantian.",
    detailedDefinition:
      "Diminished scale (octatonic) bergantian antara half-step dan whole-step (atau sebaliknya). Dua varian: half-whole (H-W, digunakan atas dominant chord) dan whole-half (W-H, digunakan atas diminished chord). Sangat simetris — hanya 3 transposisi unik. Banyak dipakai di jazz dan fusion.",
    examples: [
      "C half-whole diminished: C Db Eb E F# G A Bb",
      "C whole-half diminished: C D Eb F Gb Ab A B",
    ],
    relatedTerms: ["diminished", "whole-tone-scale", "altered"],
    tags: ["diminished scale", "octatonic", "8 nada", "simetris", "jazz"],
    sortOrder: 13,
  },
  {
    id: "chromatic-scale",
    term: "Chromatic Scale",
    termId: "Tangga nada kromatik",
    category: "scale",
    subCategory: "scale-general",
    instrumentContext: "general",
    shortDefinition: "Tangga nada dengan semua 12 semitone dalam satu oktaf.",
    detailedDefinition:
      "Chromatic scale berisi semua 12 nada, masing-masing berjarak 1 semitone. Tidak memiliki pusat tonal yang jelas. Digunakan untuk latihan teknik, passing tones, dan dalam musik atonal. Pada gitar: setiap fret berturut-turut pada satu string.",
    examples: ["C chromatic: C C# D D# E F F# G G# A A# B"],
    relatedTerms: ["chromatic", "semitone", "accidental"],
    guitarTechnique: {
      howTo:
        "Mainkan setiap fret berturut-turut pada satu string dari nut ke atas. Latihan dasar untuk kekuatan dan independensi jari (1-2-3-4).",
      hand: "left",
      difficulty: "beginner",
    },
    tags: ["chromatic scale", "12 nada", "semitone", "latihan"],
    sortOrder: 14,
  },

  // ── Modes (individual) ───────────────────────────────
  {
    id: "dorian",
    term: "Dorian Mode",
    termId: "Modus Dorian",
    category: "scale",
    subCategory: "modes",
    instrumentContext: "general",
    shortDefinition: "Mode ke-2 — minor dengan ♯6 (characteristic note).",
    detailedDefinition:
      "Dorian adalah mode kedua dari major scale. Formula: 1-2-♭3-4-5-6-♭7. Mirip natural minor tapi dengan natural 6th (bukan ♭6). Characteristic note: ♯6 (dibanding natural minor). Karakter: minor tapi lebih cerah/optimis. Sangat populer di jazz, funk, blues, dan rock.",
    examples: [
      "D Dorian: D E F G A B C (nada putih dari D)",
      "A Dorian: A B C D E F# G",
    ],
    relatedTerms: ["mode", "natural-minor", "mixolydian"],
    tags: ["dorian", "mode 2", "jazz minor", "funk", "natural 6"],
    sortOrder: 15,
  },
  {
    id: "phrygian",
    term: "Phrygian Mode",
    termId: "Modus Phrygian",
    category: "scale",
    subCategory: "modes",
    instrumentContext: "general",
    shortDefinition: "Mode ke-3 — minor dengan ♭2 (warna Spanyol/flamenco).",
    detailedDefinition:
      "Phrygian adalah mode ketiga dari major scale. Formula: 1-♭2-♭3-4-5-♭6-♭7. Characteristic note: ♭2 (semitone dari root). Karakter: gelap, eksotis, Spanyol/flamenco. Resolusi ♭2 → 1 sangat khas dan dramatis.",
    examples: [
      "E Phrygian: E F G A B C D (nada putih dari E)",
      "Phrygian dominant: 1 ♭2 3 4 5 ♭6 ♭7 (mode ke-5 harmonic minor)",
    ],
    relatedTerms: ["mode", "natural-minor", "flamenco"],
    tags: ["phrygian", "mode 3", "flamenco", "spanish", "b2"],
    sortOrder: 16,
  },
  {
    id: "lydian",
    term: "Lydian Mode",
    termId: "Modus Lydian",
    category: "scale",
    subCategory: "modes",
    instrumentContext: "general",
    shortDefinition: "Mode ke-4 — major dengan ♯4 (karakter dreamy/bright).",
    detailedDefinition:
      "Lydian adalah mode keempat dari major scale. Formula: 1-2-3-♯4-5-6-7. Mirip major scale tapi dengan raised 4th. Characteristic note: ♯4. Karakter: sangat cerah, mengambang, dreamy, magical. Banyak dipakai di film score (John Williams) dan progressive rock.",
    examples: [
      "F Lydian: F G A B C D E (nada putih dari F)",
      "C Lydian: C D E F# G A B",
    ],
    relatedTerms: ["mode", "major-scale", "mixolydian"],
    tags: ["lydian", "mode 4", "#4", "bright", "dreamy", "film score"],
    sortOrder: 17,
  },
  {
    id: "mixolydian",
    term: "Mixolydian Mode",
    termId: "Modus Mixolydian",
    category: "scale",
    subCategory: "modes",
    instrumentContext: "general",
    shortDefinition: "Mode ke-5 — major dengan ♭7 (karakter dominan/blues).",
    detailedDefinition:
      "Mixolydian adalah mode kelima dari major scale. Formula: 1-2-3-4-5-6-♭7. Mirip major scale tapi dengan flatted 7th. Characteristic note: ♭7. Karakter: major tapi dengan edge bluesy. Sangat cocok untuk dominant 7th chord, blues, rock, dan country.",
    examples: [
      "G Mixolydian: G A B C D E F (nada putih dari G)",
      "A Mixolydian: A B C# D E F# G",
    ],
    relatedTerms: ["mode", "major-scale", "dominant", "dorian"],
    tags: ["mixolydian", "mode 5", "b7", "dominant", "blues rock"],
    sortOrder: 18,
  },
  {
    id: "aeolian",
    term: "Aeolian Mode",
    termId: "Modus Aeolian",
    category: "scale",
    subCategory: "modes",
    instrumentContext: "general",
    shortDefinition: "Mode ke-6 = natural minor scale.",
    detailedDefinition:
      "Aeolian adalah mode keenam dari major scale, identik dengan natural minor scale. Formula: 1-2-♭3-4-5-♭6-♭7. Karakter: sedih, melankolis. Basis dari kebanyakan musik minor di pop, rock, dan metal. Relative minor dari major scale.",
    examples: [
      "A Aeolian: A B C D E F G (= A natural minor)",
      "E Aeolian: E F# G A B C D",
    ],
    relatedTerms: ["natural-minor", "mode", "dorian"],
    tags: ["aeolian", "mode 6", "natural minor"],
    sortOrder: 19,
  },
  {
    id: "locrian",
    term: "Locrian Mode",
    termId: "Modus Locrian",
    category: "scale",
    subCategory: "modes",
    instrumentContext: "general",
    shortDefinition: "Mode ke-7 — paling gelap, dengan ♭2 dan ♭5.",
    detailedDefinition:
      "Locrian adalah mode ketujuh dari major scale. Formula: 1-♭2-♭3-4-♭5-♭6-♭7. Mode paling gelap dan tidak stabil karena triad dari root-nya diminished (♭5). Jarang dipakai sebagai tonalitas utama, tapi muncul dalam konteks half-diminished chord (m7♭5) di jazz.",
    examples: ["B Locrian: B C D E F G A (nada putih dari B)"],
    relatedTerms: ["mode", "diminished", "phrygian"],
    tags: ["locrian", "mode 7", "b5", "b2", "diminished", "half-diminished"],
    sortOrder: 20,
  },
];
