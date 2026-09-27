// ════════════════════════════════════════════════════════
// Dictionary Data – Guitar Techniques (Picking, Strumming, Tapping, Vibrato, Wah)
// ════════════════════════════════════════════════════════

import type { DictionaryEntry } from "../types";

export const TECHNIQUE_ENTRIES: DictionaryEntry[] = [
  // ── Hammer-on / Pull-off ─────────────────────────────
  {
    id: "hammer-on",
    term: "Hammer-on",
    termId: "Hammer-on",
    aliases: ["h"],
    category: "technique",
    subCategory: "tapping",
    instrumentContext: "guitar",
    shortDefinition: "Mengetuk fret lebih tinggi tanpa memetik ulang.",
    detailedDefinition:
      "Hammer-on adalah teknik tangan kiri di mana jari 'menotok' senar ke fret lebih tinggi dari posisi awal tanpa memetik ulang dengan tangan kanan. Ini menghasilkan transisi legato yang halus. Pada tab, ditandai 'h' antara dua angka fret.",
    alphaTexRef: { token: "h", level: "note" },
    relatedTerms: ["pull-off", "legato", "tapping"],
    guitarTechnique: {
      howTo:
        "Petik not pertama, lalu 'pukul' fret berikutnya dengan jari lain secara cepat dan tegas tanpa memetik lagi. Kekuatan hammer menentukan volume not kedua.",
      hand: "left",
      difficulty: "beginner",
      tips: [
        "Pukul senar tepat di belakang fret wire untuk suara paling jelas",
        "Latih kekuatan setiap jari — jari kelingking biasanya paling lemah",
        "Jaga jari pertama tetap di posisi untuk referensi",
      ],
    },
    tags: ["hammer-on", "hammer", "h", "legato"],
    sortOrder: 0,
  },
  {
    id: "pull-off",
    term: "Pull-off",
    termId: "Pull-off",
    aliases: ["p"],
    category: "technique",
    subCategory: "tapping",
    instrumentContext: "guitar",
    shortDefinition:
      "Menarik jari dari fret untuk berbunyi di fret lebih rendah.",
    detailedDefinition:
      "Pull-off adalah kebalikan dari hammer-on: jari yang menekan fret 'menarik' (menyentil ke bawah) senar saat diangkat, sehingga senar berbunyi di fret yang lebih rendah tanpa petikan ulang. Pada tab ditandai 'p'.",
    alphaTexRef: { token: "h", level: "note" },
    relatedTerms: ["hammer-on", "legato", "trill"],
    guitarTechnique: {
      howTo:
        "Siapkan kedua jari di posisi. Petik not pertama (fret atas), lalu tarik jari yang menekan fret atas dengan gerakan menyentil ringan ke bawah saat mengangkat.",
      hand: "left",
      difficulty: "beginner",
      tips: [
        "Jangan hanya mengangkat jari — tarik/sentil ke bawah untuk menggetarkan senar",
        "Jari yang tetap di fret bawah harus sudah siap sebelum pull-off",
      ],
    },
    tags: ["pull-off", "pull", "p", "legato"],
    sortOrder: 1,
  },
  {
    id: "trill",
    term: "Trill",
    termId: "Trill",
    aliases: ["tr"],
    category: "technique",
    subCategory: "tapping",
    instrumentContext: "guitar",
    shortDefinition: "Alternasi cepat antara dua nada bertetangga.",
    detailedDefinition:
      "Trill adalah hammer-on dan pull-off yang dilakukan bergantian dengan sangat cepat antara dua nada. Menghasilkan efek getar/tremolo pada pitch. Speed trill bisa divariasikan: 16th, 32nd, atau 64th notes.",
    alphaTexRef: { token: "tr", level: "note" },
    relatedTerms: ["hammer-on", "pull-off", "vibrato-technique"],
    guitarTechnique: {
      howTo:
        "Tekan fret bawah, petik, lalu lakukan hammer-on ke fret atas dan pull-off kembali secara berulang dengan cepat dan konsisten.",
      hand: "left",
      difficulty: "intermediate",
      tips: [
        "Jaga ritme yang konsisten",
        "Latih di berbagai kombinasi jari: 1-2, 1-3, 1-4, 2-3, 2-4, 3-4",
      ],
    },
    tags: ["trill", "tr", "ornament", "alternation"],
    sortOrder: 2,
  },

  // ── Tapping ──────────────────────────────────────────
  {
    id: "tapping",
    term: "Tapping",
    termId: "Tapping",
    aliases: ["Right-hand tapping"],
    category: "technique",
    subCategory: "tapping",
    instrumentContext: "guitar",
    shortDefinition: "Mengetuk fretboard dengan tangan kanan.",
    detailedDefinition:
      "Tapping adalah teknik di mana jari tangan kanan (biasanya telunjuk atau tengah) mengetuk fretboard untuk menghasilkan nada, dikombinasikan dengan pull-off dan hammer-on tangan kiri. Memungkinkan interval lebar dan passage cepat yang tidak mungkin hanya dengan satu tangan.",
    alphaTexRef: { token: "tt", level: "beat" },
    relatedTerms: ["hammer-on", "pull-off", "left-hand-tap"],
    guitarTechnique: {
      howTo:
        "Tangan kiri siap di posisi. Jari tangan kanan (biasanya telunjuk) mengetuk fret dengan cepat lalu pull-off kembali. Sequencing: tap → pull-off → hammer-on → repeat.",
      hand: "both",
      difficulty: "intermediate",
      tips: [
        "Ketuk tepat di belakang fret wire",
        "Pull-off tangan kanan juga perlu menyentil senar",
        "Pastikan tangan kiri sudah siap sebelum tap",
        "Mute senar yang tidak dipakai dengan tangan kiri",
      ],
    },
    tags: ["tapping", "tap", "tt", "two-hand", "EVH"],
    sortOrder: 3,
  },
  {
    id: "left-hand-tap",
    term: "Left-Hand Tap",
    termId: "Left-hand tap",
    aliases: ["LHT"],
    category: "technique",
    subCategory: "tapping",
    instrumentContext: "guitar",
    shortDefinition: "Mengetuk fretboard hanya dengan tangan kiri.",
    detailedDefinition:
      "Left-hand tap mirip hammer-on tetapi dari posisi open string — jari langsung mengetuk fret tanpa not yang sudah berbunyi sebelumnya. Murni hanya menggunakan tenaga ketukan jari kiri.",
    alphaTexRef: { token: "lht", level: "note" },
    relatedTerms: ["tapping", "hammer-on"],
    guitarTechnique: {
      howTo:
        "Dari posisi tidak menekan senar, ketuk fret dengan tenaga cukup kuat sehingga senar berbunyi hanya dari ketukan. Tidak ada petikan tangan kanan.",
      hand: "left",
      difficulty: "intermediate",
    },
    tags: ["left hand tap", "LHT"],
    sortOrder: 4,
  },

  // ── Picking / Strumming ──────────────────────────────
  {
    id: "upstroke",
    term: "Upstroke",
    termId: "Upstroke / Petikan naik",
    aliases: ["Up pick", "su"],
    category: "technique",
    subCategory: "picking",
    instrumentContext: "guitar",
    shortDefinition: "Petikan dari senar bawah ke atas.",
    detailedDefinition:
      "Upstroke dimainkan dengan menggerakkan pick dari senar tebal ke senar tipis (dari bawah ke atas). Menghasilkan tone yang sedikit lebih ringan/cerah dibanding downstroke. Pada notasi ditandai simbol 'V'.",
    alphaTexRef: { token: "su", level: "beat" },
    relatedTerms: ["downstroke", "alternate-picking"],
    guitarTechnique: {
      howTo:
        "Gerakkan pick dari senar bass (thick) ke treble (thin). Jaga rileks — gerakan dari pergelangan, bukan lengan.",
      hand: "right",
      difficulty: "beginner",
    },
    tags: ["upstroke", "up pick", "su", "V"],
    sortOrder: 0,
  },
  {
    id: "downstroke",
    term: "Downstroke",
    termId: "Downstroke / Petikan turun",
    aliases: ["Down pick", "sd"],
    category: "technique",
    subCategory: "picking",
    instrumentContext: "guitar",
    shortDefinition: "Petikan dari senar atas ke bawah.",
    detailedDefinition:
      "Downstroke dimainkan dengan menggerakkan pick dari senar tipis ke senar tebal (dari atas ke bawah). Menghasilkan attack yang lebih tegas dan tone lebih tebal. Konsistensi downstroke penting di metal rhythm guitar.",
    alphaTexRef: { token: "sd", level: "beat" },
    relatedTerms: ["upstroke", "alternate-picking"],
    guitarTechnique: {
      howTo:
        "Gerakkan pick dari senar treble ke bass. Jaga rileks dan gunakan pergelangan tangan.",
      hand: "right",
      difficulty: "beginner",
    },
    tags: ["downstroke", "down pick", "sd", "n"],
    sortOrder: 1,
  },
  {
    id: "brush-stroke-up",
    term: "Brush Stroke Up",
    termId: "Brush stroke up",
    aliases: ["bu"],
    category: "technique",
    subCategory: "strumming",
    instrumentContext: "guitar",
    shortDefinition: "Strum ke atas dengan gerakan menyapu.",
    detailedDefinition:
      "Brush stroke up adalah teknik strumming di mana semua senar yang diinginkan disapu ke atas dalam satu gerakan. Menghasilkan efek arpeggiated cepat dengan nada bass terakhir.",
    alphaTexRef: { token: "bu", level: "beat" },
    relatedTerms: ["brush-stroke-down", "upstroke"],
    tags: ["brush up", "bu", "strum"],
    sortOrder: 0,
  },
  {
    id: "brush-stroke-down",
    term: "Brush Stroke Down",
    termId: "Brush stroke down",
    aliases: ["bd"],
    category: "technique",
    subCategory: "strumming",
    instrumentContext: "guitar",
    shortDefinition: "Strum ke bawah dengan gerakan menyapu.",
    detailedDefinition:
      "Brush stroke down menyapu semua senar yang diinginkan ke bawah. Nada treble terbunyikan duluan, bass terakhir. Lebih natural untuk strumming pattern pada umumnya.",
    alphaTexRef: { token: "bd", level: "beat" },
    relatedTerms: ["brush-stroke-up", "downstroke"],
    tags: ["brush down", "bd", "strum"],
    sortOrder: 1,
  },
  {
    id: "slap-technique",
    term: "Slap",
    termId: "Slap",
    aliases: ["s"],
    category: "technique",
    subCategory: "picking",
    instrumentContext: "guitar",
    shortDefinition: "Memukul senar dengan ibu jari untuk efek perkusif.",
    detailedDefinition:
      "Slap technique (awalnya dari bass) dilakukan dengan memukulkan ibu jari ke senar sehingga mengenai fret dan menghasilkan bunyi tajam perkusif. Sering dikombinasikan dengan pop. Umum di funk dan slap bass.",
    alphaTexRef: { token: "s", level: "beat" },
    relatedTerms: ["pop-technique", "tapping"],
    guitarTechnique: {
      howTo:
        "Pukulkan sisi ibu jari tangan kanan ke senar (biasanya bass) tepat di ujung fretboard. Senar harus membentur fret untuk bunyi khas 'slap'. Gerakan berasal dari rotasi pergelangan.",
      hand: "right",
      difficulty: "intermediate",
      tips: [
        "Gerakan rotasi pergelangan — bukan lengan",
        "Ibu jari harus segera memantul dari senar",
      ],
    },
    tags: ["slap", "s", "thumb", "funk"],
    sortOrder: 2,
  },
  {
    id: "pop-technique",
    term: "Pop",
    termId: "Pop",
    aliases: ["p (bass)"],
    category: "technique",
    subCategory: "picking",
    instrumentContext: "guitar",
    shortDefinition: "Menarik senar dan melepaskan untuk snap back.",
    detailedDefinition:
      "Pop adalah teknik menarik senar ke atas dengan jari (biasanya telunjuk atau tengah) lalu melepaskannya sehingga senar membentur fret dengan bunyi 'snap' tajam. Sering dikombinasi dengan slap.",
    alphaTexRef: { token: "p", level: "beat" },
    relatedTerms: ["slap-technique"],
    guitarTechnique: {
      howTo:
        "Kaitkan jari (telunjuk/tengah) di bawah senar, tarik ke atas dan lepaskan sehingga senar membentur fret.",
      hand: "right",
      difficulty: "intermediate",
    },
    tags: ["pop", "p", "snap", "funk"],
    sortOrder: 3,
  },
  {
    id: "pick-slide",
    term: "Pick Slide",
    termId: "Pick slide",
    aliases: ["Pick scrape"],
    category: "technique",
    subCategory: "picking",
    instrumentContext: "guitar",
    shortDefinition: "Menggesek sisi pick di sepanjang senar bass.",
    detailedDefinition:
      "Pick slide dilakukan dengan menekan sisi/permukaan pick ke senar bass (biasanya wound strings) dan menggeseknya dari posisi tinggi ke rendah atau sebaliknya. Menghasilkan efek 'skreech' metalik. Sangat umum di rock/metal.",
    alphaTexRef: { token: "psu", level: "note" },
    relatedTerms: ["slide-technique"],
    guitarTechnique: {
      howTo:
        "Tekan bagian flat/edge pick ke senar wound (4, 5, atau 6). Geser pick dari fret tinggi ke rendah (atau sebaliknya). Gunakan distortion untuk efek maksimal.",
      hand: "right",
      difficulty: "beginner",
      tips: [
        "Hanya efektif di wound strings (bukan plain strings)",
        "Kecepatan gesek mempengaruhi pitch effect",
      ],
    },
    tags: ["pick slide", "pick scrape", "psu", "psd", "noise"],
    sortOrder: 4,
  },

  // ── Arpeggio ─────────────────────────────────────────
  {
    id: "arpeggio-up",
    term: "Arpeggio Up",
    termId: "Arpeggio naik",
    aliases: ["au"],
    category: "technique",
    subCategory: "strumming",
    instrumentContext: "guitar",
    shortDefinition:
      "Chord yang dimainkan satu not berurutan dari bawah ke atas.",
    detailedDefinition:
      "Arpeggio up memainkan nada-nada chord satu per satu dari bass ke treble. Berbeda dari strum karena setiap nada terdengar terpisah dan jelas. Sering dipakai di ballad dan classical guitar.",
    alphaTexRef: { token: "au", level: "beat" },
    relatedTerms: ["arpeggio-down", "brush-stroke-up"],
    tags: ["arpeggio up", "au", "rolled chord"],
    sortOrder: 2,
  },
  {
    id: "arpeggio-down",
    term: "Arpeggio Down",
    termId: "Arpeggio turun",
    aliases: ["ad"],
    category: "technique",
    subCategory: "strumming",
    instrumentContext: "guitar",
    shortDefinition:
      "Chord yang dimainkan satu not berurutan dari atas ke bawah.",
    detailedDefinition:
      "Arpeggio down memainkan nada-nada chord satu per satu dari treble ke bass. Memberi efek 'descending roll'.",
    alphaTexRef: { token: "ad", level: "beat" },
    relatedTerms: ["arpeggio-up", "brush-stroke-down"],
    tags: ["arpeggio down", "ad", "rolled chord"],
    sortOrder: 3,
  },

  // ── Vibrato ──────────────────────────────────────────
  {
    id: "vibrato-technique",
    term: "Vibrato",
    termId: "Vibrato",
    category: "technique",
    subCategory: "vibrato",
    instrumentContext: "guitar",
    shortDefinition: "Getaran pitch yang menambah ekspresi pada nada.",
    detailedDefinition:
      "Vibrato adalah osilasi kecil pada pitch (naik-turun berulang) yang memberi kehangatan dan sustain pada nada. Pada gitar, ada dua jenis utama: classical vibrato (gerakan horizontal di sepanjang senar) dan blues/rock vibrato (bending mikro berulang). Kecepatan dan lebar vibrato menentukan karakter.",
    alphaTexRef: { token: "v", level: "beat" },
    relatedTerms: ["bend", "wide-vibrato"],
    guitarTechnique: {
      howTo:
        "Tekan fret, petik, lalu gerakkan jari yang menekan secara berulang: untuk rock vibrato, lakukan bending mikro berulang (push-release). Untuk classical, geser jari ke kiri-kanan di sepanjang senar.",
      hand: "left",
      difficulty: "intermediate",
      tips: [
        "Vibrato yang baik = konsisten dalam kecepatan dan lebar",
        "Biarkan gerakan berasal dari pergelangan/lengan bawah, bukan hanya jari",
        "Vibrato di fret tinggi lebih mudah; di fret rendah perlu lebih banyak tenaga",
        "Setiap gitaris punya 'signature vibrato' — dengarkan BB King, Hendrix, Clapton",
      ],
    },
    tags: ["vibrato", "slight vibrato", "v", "expression"],
    sortOrder: 0,
  },
  {
    id: "wide-vibrato",
    term: "Wide Vibrato",
    termId: "Vibrato lebar",
    aliases: ["vw"],
    category: "technique",
    subCategory: "vibrato",
    instrumentContext: "guitar",
    shortDefinition: "Vibrato dengan amplitudo lebar (bending lebih dalam).",
    detailedDefinition:
      "Wide vibrato menggunakan bending yang lebih dalam (mendekati setengah nada) dalam setiap osilasi. Menghasilkan efek yang lebih dramatis dan emosional. Khas di blues dan rock.",
    alphaTexRef: { token: "vw", level: "beat" },
    relatedTerms: ["vibrato-technique", "bend"],
    guitarTechnique: {
      howTo:
        "Sama seperti vibrato biasa, tetapi bending mikro lebih dalam — hampir mendekati half-step setiap kali. Butuh kekuatan jari dan kontrol lebih besar.",
      hand: "left",
      difficulty: "intermediate",
    },
    tags: ["wide vibrato", "vw", "expressive"],
    sortOrder: 1,
  },

  // ── Wah ──────────────────────────────────────────────
  {
    id: "wah-open",
    term: "Wah Open",
    termId: "Wah terbuka",
    category: "technique",
    subCategory: "wah",
    instrumentContext: "guitar",
    shortDefinition: "Posisi wah pedal terbuka (treble ditonjolkan).",
    detailedDefinition:
      "Wah open menunjukkan posisi pedal wah ditekan ke depan (toe down), menekankan frekuensi tinggi. Suara menjadi 'wah' yang terang. Ditandai 'O' pada tab/score.",
    alphaTexRef: { token: "wah-open", level: "beat" },
    relatedTerms: ["wah-close"],
    guitarTechnique: {
      howTo: "Tekan pedal wah ke depan (toe down) ke posisi penuh.",
      hand: "right",
      difficulty: "beginner",
    },
    tags: ["wah", "wah open", "O", "effect pedal"],
    sortOrder: 0,
  },
  {
    id: "wah-close",
    term: "Wah Close",
    termId: "Wah tertutup",
    category: "technique",
    subCategory: "wah",
    instrumentContext: "guitar",
    shortDefinition: "Posisi wah pedal tertutup (bass ditonjolkan).",
    detailedDefinition:
      "Wah close menunjukkan posisi pedal wah diangkat (heel down), menekankan frekuensi rendah. Suara lebih gelap/muffled. Ditandai '+' pada tab/score.",
    alphaTexRef: { token: "wah-close", level: "beat" },
    relatedTerms: ["wah-open"],
    guitarTechnique: {
      howTo: "Angkat pedal wah ke belakang (heel down) ke posisi penuh.",
      hand: "right",
      difficulty: "beginner",
    },
    tags: ["wah", "wah close", "+", "effect pedal"],
    sortOrder: 1,
  },
];
