// ════════════════════════════════════════════════════════
// Dictionary Data – Audio & Acoustics Concepts
// ════════════════════════════════════════════════════════

import type { DictionaryEntry } from "../types";

export const AUDIO_ENTRIES: DictionaryEntry[] = [
  {
    id: "timbre",
    term: "Timbre",
    termId: "Timbre / Warna nada",
    aliases: ["Warna nada", "Tone color"],
    category: "audio",
    subCategory: "timbre",
    instrumentContext: "general",
    shortDefinition:
      "Kualitas suara yang membedakan instrumen satu dari lainnya.",
    detailedDefinition:
      "Timbre adalah karakteristik sonik yang memungkinkan kita membedakan antara piano, gitar, dan violin meskipun memainkan nada dan volume yang sama. Ditentukan oleh komposisi harmonik (overtone series), envelope (attack–decay–sustain–release), dan noise/transient di awal bunyi.",
    relatedTerms: [
      "harmonic-series",
      "overtone",
      "attack-decay-sustain-release",
    ],
    tags: ["timbre", "warna nada", "tone color", "tone quality"],
    sortOrder: 0,
  },
  {
    id: "harmonic-series",
    term: "Harmonic Series",
    termId: "Deret harmonik",
    aliases: ["Overtone series"],
    category: "audio",
    subCategory: "harmonic-overtone",
    instrumentContext: "general",
    shortDefinition: "Deret frekuensi alami yang dihasilkan benda bergetar.",
    detailedDefinition:
      "Ketika senar atau kolom udara bergetar, ia menghasilkan frekuensi dasar (fundamental/f₁) beserta kelipatan integer-nya: f₂=2f₁ (oktaf), f₃=3f₁ (oktaf+fifth), f₄=4f₁ (2 oktaf), dst. Harmonik ini menentukan timbre instrumen. Pada gitar, harmonik alami bisa dimainkan di fret 12 (2nd harmonic), 7 (3rd), 5 (4th), dst.",
    examples: [
      "Fundamental A₂=110 Hz → harmonik: 220, 330, 440, 550, 660 Hz …",
    ],
    relatedTerms: ["overtone", "fundamental", "natural-harmonic"],
    guitarTechnique: {
      howTo:
        "Sentuh senar ringan (tanpa menekan) tepat di atas fret wire fret 12, 7, atau 5, lalu petik. Jari harus segera diangkat setelah senar dipetik.",
      hand: "both",
      difficulty: "beginner",
      fretContext:
        "Fret 12 = 2nd harmonic (oktaf), fret 7 = 3rd (oktaf+fifth), fret 5 = 4th (2 oktaf)",
    },
    tags: [
      "harmonic series",
      "overtone series",
      "partials",
      "fundamental",
      "natural harmonic",
    ],
    sortOrder: 0,
  },
  {
    id: "overtone",
    term: "Overtone",
    termId: "Nada atas / Overtone",
    aliases: ["Partial", "Nada atas"],
    category: "audio",
    subCategory: "harmonic-overtone",
    instrumentContext: "general",
    shortDefinition:
      "Frekuensi di atas fundamental yang menyusun timbre sebuah bunyi.",
    detailedDefinition:
      "Overtone adalah semua frekuensi di atas fundamental. 1st overtone = 2nd harmonic = frekuensi 2× fundamental. Jumlah dan kekuatan relatif overtone menentukan 'warna' suara. Inharmonicity (overtone yang tidak tepat kelipatan) memberikan karakter khas piano dan lonceng.",
    relatedTerms: ["harmonic-series", "timbre"],
    tags: ["overtone", "partial", "upper partial"],
    sortOrder: 1,
  },
  {
    id: "fundamental",
    term: "Fundamental Frequency",
    termId: "Frekuensi dasar",
    aliases: ["f₁", "First harmonic"],
    category: "audio",
    subCategory: "harmonic-overtone",
    instrumentContext: "general",
    shortDefinition:
      "Frekuensi getaran terendah — menentukan pitch yang kita dengar.",
    detailedDefinition:
      "Fundamental (harmonik pertama) adalah frekuensi getaran terendah dari sebuah benda bergetar. Ini menentukan 'nada' yang kita persepsi. Meskipun overtone juga hadir, otak kita mengenali pitch berdasarkan fundamental. Panjang senar, tegangan, dan massa menentukan frekuensi fundamental.",
    relatedTerms: ["harmonic-series", "frequency", "pitch"],
    tags: ["fundamental", "f1", "first harmonic", "lowest frequency"],
    sortOrder: 2,
  },
  {
    id: "attack-decay-sustain-release",
    term: "ADSR Envelope",
    termId: "ADSR (Attack–Decay–Sustain–Release)",
    aliases: ["ADSR", "Envelope"],
    category: "audio",
    subCategory: "timbre",
    instrumentContext: "general",
    shortDefinition:
      "Empat fase volume bunyi: serangan, peluruhan, sustain, pelepasan.",
    detailedDefinition:
      "ADSR envelope mendeskripsikan bagaimana volume bunyi berubah terhadap waktu. Attack: seberapa cepat suara mencapai puncak. Decay: seberapa cepat turun ke level sustain. Sustain: level volume selama not ditahan. Release: seberapa cepat suara menghilang setelah dilepas. Gitar: attack cepat, decay sedang, sustain tergantung teknik, release tergantung muting.",
    relatedTerms: ["timbre"],
    tags: ["ADSR", "envelope", "attack", "decay", "sustain", "release"],
    sortOrder: 1,
  },
  {
    id: "resonance",
    term: "Resonance",
    termId: "Resonansi",
    category: "audio",
    subCategory: "timbre",
    instrumentContext: "general",
    shortDefinition:
      "Penguatan bunyi ketika frekuensi cocok dengan frekuensi alami medium.",
    detailedDefinition:
      "Resonance terjadi ketika getaran pada frekuensi tertentu dikuatkan oleh medium (body gitar, ruang, kolom udara). Body gitar memiliki beberapa resonant frequencies yang menguatkan overtone tertentu, memberi karakter tone unik. Rosette/soundhole pada akustik dan body shape pada elektrik mempengaruhi resonance.",
    relatedTerms: ["harmonic-series", "timbre"],
    tags: ["resonance", "resonansi", "body resonance"],
    sortOrder: 2,
  },
  {
    id: "equal-temperament",
    term: "Equal Temperament",
    termId: "Temperamen sama rata",
    aliases: ["12-TET", "12-tone equal temperament"],
    category: "audio",
    subCategory: "tuning-system",
    instrumentContext: "general",
    shortDefinition:
      "Sistem tuning di mana oktaf dibagi menjadi 12 interval yang sama.",
    detailedDefinition:
      "Equal temperament membagi oktaf menjadi 12 semitone dengan rasio frekuensi yang sama: ¹²√2 ≈ 1.05946. Ini berarti setiap semitone sedikit 'out of tune' dari interval just intonation, tetapi memungkinkan bermain di semua key tanpa re-tuning. Standar modern sejak abad ke-18.",
    examples: ["A4=440 Hz → A#4 = 440 × ¹²√2 ≈ 466.16 Hz → B4 ≈ 493.88 Hz"],
    relatedTerms: ["just-intonation", "cents", "frequency"],
    tags: ["equal temperament", "12-TET", "tuning system", "well-tempered"],
    sortOrder: 0,
  },
  {
    id: "just-intonation",
    term: "Just Intonation",
    termId: "Intonasi murni",
    aliases: ["Pure intonation"],
    category: "audio",
    subCategory: "tuning-system",
    instrumentContext: "general",
    shortDefinition:
      "Sistem tuning berdasarkan rasio frekuensi bilangan bulat.",
    detailedDefinition:
      "Just intonation menggunakan rasio bilangan bulat kecil untuk interval: oktaf = 2:1, fifth = 3:2, fourth = 4:3, major third = 5:4. Menghasilkan interval yang lebih 'murni' dan harmonis, tetapi hanya bekerja di satu key — modulasi membutuhkan re-tuning. Dipakai di paduan suara a cappella dan beberapa musik tradisional.",
    relatedTerms: ["equal-temperament", "harmonic-series"],
    tags: ["just intonation", "pure tuning", "ratio"],
    sortOrder: 1,
  },
  {
    id: "cents",
    term: "Cents",
    termId: "Cents (satuan interval)",
    category: "audio",
    subCategory: "tuning-system",
    instrumentContext: "general",
    shortDefinition:
      "Satuan logaritmik: 1 semitone = 100 cents, 1 oktaf = 1200 cents.",
    detailedDefinition:
      "Cents adalah satuan ukuran interval berbasis logaritmik. 1 semitone equal temperament = 100 cents. Memungkinkan pengukuran presisi untuk deviasi tuning. Pada tuner, ±0 cents = in tune, ±50 cents = exactly between two semitones. Manusia umumnya bisa mendengar perbedaan ≥5 cents.",
    relatedTerms: ["equal-temperament", "frequency", "tuning"],
    tags: ["cents", "tuning", "measurement", "deviation"],
    sortOrder: 2,
  },

  // ── Additional Audio Concepts ────────────────────────
  {
    id: "sampling-rate",
    term: "Sampling Rate",
    termId: "Sample rate",
    aliases: ["Sample rate", "Fs"],
    category: "audio",
    subCategory: "digital-audio",
    instrumentContext: "general",
    shortDefinition:
      "Jumlah sample per detik saat mengkonversi audio analog ke digital.",
    detailedDefinition:
      "Sampling rate menentukan berapa kali per detik sinyal audio analog di-capture (sample) untuk representasi digital. Diukur dalam Hz atau kHz. Standar CD = 44.1 kHz (44,100 sample/detik). Menurut teorema Nyquist, sampling rate harus minimal 2× frekuensi tertinggi yang ingin direproduksi (manusia dengar ≤20 kHz → sampling rate ≥40 kHz).",
    examples: [
      "CD quality: 44.1 kHz",
      "Professional audio: 48 kHz, 96 kHz, atau 192 kHz",
      "Telepon: 8 kHz",
    ],
    relatedTerms: ["bit-depth", "nyquist", "frequency"],
    tags: ["sampling rate", "sample rate", "44.1 kHz", "digital", "kHz"],
    sortOrder: 3,
  },
  {
    id: "bit-depth",
    term: "Bit Depth",
    termId: "Kedalaman bit",
    aliases: ["Resolution"],
    category: "audio",
    subCategory: "digital-audio",
    instrumentContext: "general",
    shortDefinition:
      "Jumlah bit per sample — menentukan dynamic range dan presisi audio digital.",
    detailedDefinition:
      "Bit depth menentukan berapa banyak level amplitudo yang bisa direpresentasikan per sample. Semakin tinggi bit depth, semakin besar dynamic range dan semakin rendah noise floor. 16-bit ≈ 96 dB dynamic range (standar CD). 24-bit ≈ 144 dB (professional). 32-bit float dipakai untuk mixing internal.",
    examples: [
      "16-bit: standar CD (96 dB dynamic range)",
      "24-bit: professional recording (144 dB)",
      "32-bit float: DAW mixing internal",
    ],
    relatedTerms: ["sampling-rate", "dynamic-range"],
    tags: ["bit depth", "16-bit", "24-bit", "dynamic range", "resolution"],
    sortOrder: 4,
  },
  {
    id: "nyquist",
    term: "Nyquist Theorem",
    termId: "Teorema Nyquist",
    aliases: ["Nyquist-Shannon", "Nyquist frequency"],
    category: "audio",
    subCategory: "digital-audio",
    instrumentContext: "general",
    shortDefinition:
      "Frekuensi tertinggi yang bisa direproduksi = ½ sampling rate.",
    detailedDefinition:
      "Teorema Nyquist-Shannon menyatakan bahwa untuk mereproduksi sinyal dengan akurat secara digital, sampling rate harus minimal 2× frekuensi tertinggi sinyal (Nyquist rate). Frekuensi di atas Nyquist frequency (½ sampling rate) akan mengalami aliasing — artefak audio yang merusak. Inilah mengapa CD 44.1 kHz bisa mereproduksi hingga ~22 kHz.",
    examples: [
      "Sampling rate 44.1 kHz → Nyquist freq = 22.05 kHz",
      "Manusia dengar ≤20 kHz → 44.1 kHz sudah cukup",
    ],
    relatedTerms: ["sampling-rate", "frequency", "aliasing"],
    tags: ["nyquist", "sampling theorem", "aliasing", "22 kHz"],
    sortOrder: 5,
  },
  {
    id: "dynamic-range",
    term: "Dynamic Range",
    termId: "Rentang dinamik",
    category: "audio",
    subCategory: "digital-audio",
    instrumentContext: "general",
    shortDefinition:
      "Rasio antara suara terkeras dan terlemah yang bisa direproduksi (dB).",
    detailedDefinition:
      "Dynamic range adalah rentang antara level sinyal terkeras (sebelum clipping) dan noise floor terkecil dalam sebuah sistem audio. Diukur dalam desibel (dB). Dynamic range yang besar berarti bisa merekam whisper dan fortissimo dalam satu take. CD 16-bit ≈ 96 dB, telinga manusia ≈ 120 dB.",
    examples: [
      "CD (16-bit): ~96 dB",
      "Vinyl: ~55-70 dB",
      "Telinga manusia: ~120 dB (threshold of hearing → threshold of pain)",
    ],
    relatedTerms: ["bit-depth", "compressor", "dynamic-mark"],
    tags: ["dynamic range", "rentang dinamik", "dB", "headroom"],
    sortOrder: 6,
  },
];
