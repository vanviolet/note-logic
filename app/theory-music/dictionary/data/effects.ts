// ════════════════════════════════════════════════════════
// Dictionary Data – Effects (Production / Audio)
// ════════════════════════════════════════════════════════

import type { DictionaryEntry } from "../types";

export const EFFECT_ENTRIES: DictionaryEntry[] = [
  {
    id: "reverb",
    term: "Reverb",
    termId: "Reverb / Gema",
    aliases: ["Reverberation"],
    category: "effect",
    subCategory: "reverb-delay",
    instrumentContext: "general",
    shortDefinition: "Efek yang mensimulasikan pantulan suara dalam ruangan.",
    detailedDefinition:
      "Reverb (reverberation) adalah efek audio yang menirukan pantulan suara di lingkungan fisik — dari kamar kecil hingga katedral besar. Jenis utama: room, hall, plate, spring, dan shimmer reverb. Parameter penting: decay time, pre-delay, mix (wet/dry), dan damping.",
    examples: [
      "Spring reverb pada amplifier Fender — suara surf rock klasik",
      "Hall reverb pada vokal ballad",
      "Plate reverb pada snare drum",
    ],
    relatedTerms: ["delay", "resonance"],
    tags: ["reverb", "gema", "efek", "ruangan", "hall", "spring"],
    sortOrder: 0,
  },
  {
    id: "delay",
    term: "Delay",
    termId: "Delay / Tunda",
    aliases: ["Echo"],
    category: "effect",
    subCategory: "reverb-delay",
    instrumentContext: "general",
    shortDefinition:
      "Efek yang mengulang sinyal audio setelah jeda waktu tertentu.",
    detailedDefinition:
      "Delay merekam sinyal input dan memainkannya kembali setelah interval waktu (biasanya sinkron BPM). Jenis utama: slapback (sangat pendek), analog delay (warm), digital delay (presisi), tape delay (vintage), dan ping-pong delay (stereo bergantian). Parameter: time, feedback, mix.",
    examples: [
      "Slapback delay pada rockabilly — 75-150ms",
      "Dotted-eighth delay pada The Edge (U2)",
      "Long feedback delay pada ambient/shoegaze",
    ],
    relatedTerms: ["reverb", "tempo"],
    tags: ["delay", "echo", "efek", "tunda", "slapback"],
    sortOrder: 1,
  },
  {
    id: "distortion",
    term: "Distortion",
    termId: "Distorsi",
    aliases: ["Dist"],
    category: "effect",
    subCategory: "distortion",
    instrumentContext: "guitar",
    shortDefinition:
      "Efek yang menambah gain berlebih untuk suara gitar berkarakter 'kasar' dan sustain panjang.",
    detailedDefinition:
      "Distortion mengklip sinyal gitar secara agresif untuk menghasilkan suara overdriven yang penuh harmonic. Dibedakan dari overdrive (clip ringan, responsif terhadap pick attack) dan fuzz (clip ekstrem, tone tebal). Distortion adalah suara dasar genre rock, metal, dan punk.",
    examples: [
      "Boss DS-1 — distortion pedal paling populer",
      "High-gain distortion pada Mesa Boogie untuk metal",
    ],
    relatedTerms: ["overdrive", "fuzz", "gain"],
    guitarTechnique: {
      howTo:
        "Hubungkan pedal distortion antara gitar dan amp, atau gunakan channel gain pada amp. Atur knob gain/drive, tone, dan volume sesuai genre.",
      hand: "both",
      difficulty: "beginner",
      tips: [
        "Gain tinggi = lebih banyak noise. Gunakan noise gate untuk menjaga sinyal bersih saat diam.",
        "Dengan distortion tinggi, palm mute sangat penting untuk kontrol.",
      ],
    },
    tags: ["distortion", "distorsi", "gain", "clip", "rock", "metal"],
    sortOrder: 2,
  },
  {
    id: "overdrive",
    term: "Overdrive",
    termId: "Overdrive",
    aliases: ["OD"],
    category: "effect",
    subCategory: "distortion",
    instrumentContext: "guitar",
    shortDefinition:
      "Efek yang meniru suara amp tube yang di-push keras — clip lembut dan responsif.",
    detailedDefinition:
      "Overdrive meniru karakter amp tabung (tube) yang didorong melampaui clean headroom. Hasilnya soft clipping yang terdengar hangat, dinamis (merespons pick attack), dan harmonik genap yang musical. Berbeda dari distortion (hard clip) dan fuzz (transistor clip).",
    examples: [
      "Tube Screamer (Ibanez TS-9) — overdrive paling ikonik",
      "Blues Breaker — suara blues klasik",
      "Klon Centaur — transparent overdrive legendaris",
    ],
    relatedTerms: ["distortion", "fuzz", "gain"],
    guitarTechnique: {
      howTo:
        "Atur drive rendah-sedang untuk menambah warmth pada clean tone. Overdrive juga sering digunakan sebagai boost di depan amp yang sudah breakup.",
      hand: "both",
      difficulty: "beginner",
    },
    tags: ["overdrive", "OD", "tube screamer", "blues", "warm"],
    sortOrder: 3,
  },
  {
    id: "fuzz",
    term: "Fuzz",
    termId: "Fuzz",
    category: "effect",
    subCategory: "distortion",
    instrumentContext: "guitar",
    shortDefinition:
      "Efek distorsi ekstrem yang menghasilkan suara tebal, buzzy, dan vintage.",
    detailedDefinition:
      "Fuzz adalah efek gain tertua (1960-an), menggunakan transistor untuk mengklip sinyal secara ekstrem. Hasilnya suara sangat tebal dan buzzy dengan sustain panjang. Jenis utama: germanium fuzz (warmer, dynamic) dan silicon fuzz (lebih agresif, stabil). Ikonik dalam psych rock dan classic rock.",
    examples: [
      "Fuzz Face — Jimi Hendrix 'Purple Haze'",
      "Big Muff — suara grunge Smashing Pumpkins",
      "Tone Bender — Led Zeppelin, Rolling Stones",
    ],
    relatedTerms: ["distortion", "overdrive"],
    tags: ["fuzz", "vintage", "hendrix", "psychedelic"],
    sortOrder: 4,
  },
  {
    id: "chorus-effect",
    term: "Chorus (Effect)",
    termId: "Efek Chorus",
    category: "effect",
    subCategory: "modulation-effect",
    instrumentContext: "guitar",
    shortDefinition:
      "Efek modulasi yang menggandakan sinyal dengan sedikit detuning untuk suara lebih tebal.",
    detailedDefinition:
      "Chorus effect membuat salinan sinyal, sedikit melambatkan dan men-detune-nya secara bergelombang (LFO), lalu mencampurnya dengan sinyal asli. Hasilnya terdengar seperti beberapa instrumen bermain bersamaan. Sangat populer di clean tone 80-an (The Police, The Cure).",
    examples: [
      "Boss CE-1 / CE-2 — chorus pedal ikonik",
      "'Come As You Are' Nirvana — chorus pada clean guitar",
    ],
    relatedTerms: ["flanger", "phaser"],
    tags: ["chorus", "efek modulasi", "80s", "clean"],
    sortOrder: 5,
  },
  {
    id: "flanger",
    term: "Flanger",
    termId: "Flanger",
    category: "effect",
    subCategory: "modulation-effect",
    instrumentContext: "guitar",
    shortDefinition:
      "Efek modulasi yang menghasilkan suara berputar 'jet plane' dengan sweep metalik.",
    detailedDefinition:
      "Flanger mirip chorus tapi menggunakan delay time sangat pendek (1-20ms) dengan feedback, menciptakan efek comb filter yang bergerak — terdengar seperti suara jet pesawat. Sangat dramatis dan ikonik dalam rock progresif dan metal.",
    examples: [
      "'Unchained' Van Halen — flanger pada riff",
      "'Barracuda' Heart — intro gitar",
    ],
    relatedTerms: ["chorus-effect", "phaser"],
    tags: ["flanger", "jet", "modulasi", "sweep"],
    sortOrder: 6,
  },
  {
    id: "phaser",
    term: "Phaser",
    termId: "Phaser",
    aliases: ["Phase shifter"],
    category: "effect",
    subCategory: "modulation-effect",
    instrumentContext: "guitar",
    shortDefinition:
      "Efek modulasi yang membuat suara bergelombang dengan menggeser fase sinyal.",
    detailedDefinition:
      "Phaser membuat salinan sinyal, menggeser fase-nya menggunakan all-pass filter, lalu mencampurnya kembali. Hasilnya notch dan peak yang bergerak (sweep), menciptakan efek 'whooshy' yang lebih halus dari flanger. Parameter utama: rate (speed) dan depth.",
    examples: [
      "MXR Phase 90 — Eddie Van Halen 'Eruption' intro",
      "'Have a Cigar' Pink Floyd — phaser pada gitar",
    ],
    relatedTerms: ["flanger", "chorus-effect"],
    tags: ["phaser", "phase", "modulasi", "Van Halen"],
    sortOrder: 7,
  },
  {
    id: "compressor",
    term: "Compressor",
    termId: "Kompressor",
    aliases: ["Comp"],
    category: "effect",
    subCategory: "compression",
    instrumentContext: "guitar",
    shortDefinition:
      "Efek yang meratakan dinamika — mengurangi perbedaan antara suara keras dan pelan.",
    detailedDefinition:
      "Compressor mengurangi dynamic range sinyal: suara yang terlalu keras ditekan, suara pelan terangkat. Hasilnya tone lebih rata, sustain lebih panjang, dan attack lebih konsisten. Sangat penting untuk country chicken-picking, funk, dan studio recording. Parameter: threshold, ratio, attack, release.",
    examples: [
      "Country guitar clean — sustain panjang dan rata dari compressor",
      "Funk rhythm guitar — attack konsisten setiap strum",
      "Compressor pada bass untuk suara rata di mix",
    ],
    relatedTerms: ["gain", "dynamic-mark"],
    guitarTechnique: {
      howTo:
        "Letakkan compressor di awal signal chain (sebelum drive). Atur threshold dan ratio sesuai kebutuhan — ratio rendah (2:1) untuk subtle compression, tinggi (∞:1) untuk limiting.",
      hand: "both",
      difficulty: "intermediate",
    },
    tags: ["compressor", "kompresi", "dinamika", "sustain"],
    sortOrder: 8,
  },
  {
    id: "wah-pedal",
    term: "Wah Pedal",
    termId: "Pedal Wah",
    aliases: ["Wah-wah", "Cry Baby"],
    category: "effect",
    subCategory: "eq-filter",
    instrumentContext: "guitar",
    shortDefinition:
      "Pedal ekspresi yang menggeser frekuensi bandpass filter untuk efek 'wah-wah'.",
    detailedDefinition:
      "Wah pedal adalah bandpass filter yang frekuensi tengahnya dikendalikan oleh gerakan kaki pemain. Menginjak ke depan = frekuensi naik ('wah'), ke belakang = turun. Hasilnya suara ekspresif yang meniru bunyi manusia berkata 'wah'. Bisa digunakan sebagai efek ritmis atau untuk mewarnai solo.",
    examples: [
      "Dunlop Cry Baby — wah paling populer",
      "'Voodoo Child' Hendrix — wah ikonik",
      "'Shaft' Isaac Hayes — wah funk",
    ],
    relatedTerms: ["wah-open", "wah-close", "phaser"],
    guitarTechnique: {
      howTo:
        "Letakkan kaki di pedal. Ayunkan maju-mundur sinkron dengan beat atau frase melodi. Bisa juga di-park pada posisi tertentu untuk tone warna tertentu.",
      hand: "right",
      difficulty: "intermediate",
      tips: [
        "Coba sync gerakan wah dengan pola ritme — wah ritmis sangat efektif di funk",
        "Wah sebelum distortion menghasilkan suara yang lebih fokus, setelah distortion lebih dramatis",
      ],
    },
    tags: ["wah", "wah-wah", "pedal", "cry baby", "hendrix"],
    sortOrder: 9,
  },
  {
    id: "eq",
    term: "Equalizer",
    termId: "Equalizer (EQ)",
    aliases: ["EQ"],
    category: "effect",
    subCategory: "eq-filter",
    instrumentContext: "general",
    shortDefinition:
      "Alat untuk mengatur boost/cut pada frekuensi tertentu dalam sinyal audio.",
    detailedDefinition:
      "Equalizer (EQ) memungkinkan kontrol presisi atas spektrum frekuensi suara. Tipe utama: graphic EQ (slider per band), parametric EQ (freq, gain, Q per band), dan shelving EQ (low/high shelf). EQ digunakan di setiap tahap audio: gitar → amp → mix → mastering.",
    examples: [
      "Cut di 400 Hz untuk mengurangi suara 'boxy'",
      "Boost di 3-5 kHz untuk presence gitar",
      "Low shelf cut pada bass untuk ruang di mix",
    ],
    relatedTerms: ["timbre", "resonance"],
    tags: ["EQ", "equalizer", "frekuensi", "mixing", "tone"],
    sortOrder: 10,
  },
  {
    id: "looper",
    term: "Looper",
    termId: "Looper",
    aliases: ["Loop pedal", "Loop station"],
    category: "effect",
    subCategory: "reverb-delay",
    instrumentContext: "guitar",
    shortDefinition:
      "Perangkat yang merekam dan memutar ulang frase secara real-time untuk layering.",
    detailedDefinition:
      "Looper merekam audio secara real-time dan langsung memainkannya kembali secara berulang (loop). Musisi bisa melapisi (layer) beberapa track di atas satu sama lain — chord, melodi, perkusi. Sangat berguna untuk latihan solo dan penampilan one-man-band.",
    examples: [
      "Ed Sheeran — looper untuk layering gitar, beatbox, dan vokal di panggung",
      "Boss RC-30 Loop Station",
    ],
    relatedTerms: ["delay", "ostinato"],
    tags: ["looper", "loop", "pedal", "real-time", "layering"],
    sortOrder: 11,
  },
  {
    id: "capo",
    term: "Capo",
    termId: "Capo",
    aliases: ["Capotasto"],
    category: "technique",
    subCategory: "fingerstyle",
    instrumentContext: "guitar",
    shortDefinition:
      "Alat yang dijepit pada fret gitar untuk menaikkan pitch semua senar sekaligus.",
    detailedDefinition:
      "Capo (capotasto) adalah clamp yang dipasang pada fret tertentu, secara efektif memendekkan panjang senar dan menaikkan pitch semua senar. Ini memungkinkan gitaris bermain di key berbeda menggunakan bentuk chord yang sama. Capo di fret 2 dengan bentuk D menjadi E. Sangat umum di folk, pop, dan akustik.",
    examples: [
      "Capo fret 2 + bentuk G = key A",
      "'Wonderwall' Oasis — capo fret 2",
      "'Hotel California' Eagles — capo fret 7",
    ],
    relatedTerms: ["key", "chord"],
    guitarTechnique: {
      howTo:
        "Jepit capo tepat di belakang fret wire (bukan di atasnya). Pastikan semua senar tertekan rata dan tidak ada buzz.",
      hand: "left",
      difficulty: "beginner",
      tips: [
        "Capo mengubah key tapi bukan fingering — berguna saat bermain bersama penyanyi dengan range berbeda",
        "Periksa tuning setelah memasang capo — beberapa capo menarik senar sedikit out of tune",
      ],
    },
    tags: ["capo", "capotasto", "transpose", "key change"],
    sortOrder: 12,
  },
  {
    id: "gain",
    term: "Gain",
    termId: "Gain",
    category: "effect",
    subCategory: "distortion",
    instrumentContext: "guitar",
    shortDefinition:
      "Penguatan sinyal audio — pada gitar sering berarti level overdrive/distortion.",
    detailedDefinition:
      "Gain secara teknis adalah amplifikasi sinyal (dinyatakan dalam dB). Dalam konteks gitar, 'gain' biasanya merujuk ke seberapa keras preamp di-push — gain rendah = clean tone, gain sedang = crunch/overdrive, gain tinggi = distortion/high-gain. Gain berbeda dari volume (yang mengontrol output akhir).",
    examples: [
      "Channel clean = gain rendah",
      "Channel crunch = gain sedang",
      "Channel lead = gain tinggi untuk solo",
    ],
    relatedTerms: ["distortion", "overdrive", "volume-swell"],
    tags: ["gain", "preamp", "overdrive", "volume", "amp"],
    sortOrder: 13,
  },
];
