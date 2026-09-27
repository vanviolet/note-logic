// ════════════════════════════════════════════════════════
// Dictionary Data – Musical Form & Structure
// ════════════════════════════════════════════════════════

import type { DictionaryEntry } from "../types";

export const FORM_ENTRIES: DictionaryEntry[] = [
  {
    id: "verse",
    term: "Verse",
    termId: "Bait",
    category: "form",
    subCategory: "section",
    instrumentContext: "general",
    shortDefinition:
      "Bagian lagu dengan melodi yang sama tetapi lirik berbeda setiap pengulangan.",
    detailedDefinition:
      "Verse adalah bagian utama lagu yang menceritakan 'cerita'. Setiap verse biasanya memiliki pola melodi dan harmoni yang sama, tetapi lirik berubah untuk mengembangkan narasi. Dalam notasi pop/rock, verse sering ditandai dengan huruf A.",
    examples: [
      "Verse 1 dan Verse 2 dalam lagu pop memiliki melodi sama tapi lirik beda",
      "Biasanya 8 atau 16 bar",
    ],
    relatedTerms: ["chorus", "bridge", "form", "binary-form"],
    tags: ["verse", "bait", "lagu", "struktur"],
    sortOrder: 0,
  },
  {
    id: "chorus",
    term: "Chorus",
    termId: "Reff / Chorus",
    aliases: ["Refrain", "Reff"],
    category: "form",
    subCategory: "section",
    instrumentContext: "general",
    shortDefinition:
      "Bagian lagu paling mudah diingat yang diulang dengan lirik dan melodi sama.",
    detailedDefinition:
      "Chorus (reff) adalah 'hook' utama lagu — bagian paling catchy dan memorable yang diulang beberapa kali. Chorus biasanya memiliki intensitas dinamis lebih tinggi dari verse, sering naik secara harmoni atau register. Dalam analisis form, ditandai dengan huruf B.",
    examples: [
      "Bagian 'Hey Jude, don't make it bad…' pada lagu Hey Jude",
      "Biasanya 8 bar dengan hook vokal utama",
    ],
    relatedTerms: ["verse", "bridge", "hook"],
    tags: ["chorus", "reff", "refrain", "hook", "lagu"],
    sortOrder: 1,
  },
  {
    id: "bridge",
    term: "Bridge",
    termId: "Bridge / Jembatan",
    category: "form",
    subCategory: "section",
    instrumentContext: "general",
    shortDefinition:
      "Bagian kontras yang menghubungkan dua section, biasanya muncul sekali.",
    detailedDefinition:
      "Bridge adalah bagian yang memberikan variasi dan kontras terhadap verse dan chorus. Biasanya muncul hanya sekali dalam lagu (setelah chorus kedua), dengan harmoni, melodi, atau ritme yang berbeda untuk menjaga ketertarikan pendengar sebelum chorus terakhir.",
    examples: [
      "Bridge sering muncul setelah chorus kedua",
      "Menggunakan chord yang belum muncul di verse/chorus",
    ],
    relatedTerms: ["verse", "chorus", "form"],
    tags: ["bridge", "jembatan", "kontras", "lagu"],
    sortOrder: 2,
  },
  {
    id: "intro",
    term: "Intro",
    termId: "Intro / Pembukaan",
    aliases: ["Introduction"],
    category: "form",
    subCategory: "section",
    instrumentContext: "general",
    shortDefinition: "Bagian pembuka lagu sebelum verse pertama.",
    detailedDefinition:
      "Intro adalah bagian awal lagu yang memperkenalkan mood, tempo, key, dan karakter musik. Bisa berupa riff gitar, arpeggio piano, atau fade-in. Intro yang baik langsung menarik perhatian pendengar dalam beberapa detik pertama.",
    examples: [
      "Riff gitar ikonik di intro 'Smoke on the Water'",
      "Fade-in strings pada intro 'A Hard Day's Night'",
    ],
    relatedTerms: ["outro", "verse", "form"],
    tags: ["intro", "pembukaan", "awal", "lagu"],
    sortOrder: 3,
  },
  {
    id: "outro",
    term: "Outro",
    termId: "Outro / Penutup",
    aliases: ["Coda", "Ending"],
    category: "form",
    subCategory: "section",
    instrumentContext: "general",
    shortDefinition: "Bagian penutup lagu setelah section terakhir.",
    detailedDefinition:
      "Outro (juga disebut coda dalam musik klasik) adalah bagian akhir lagu yang memberi kesan 'selesai'. Bisa berupa fade-out, repeat chorus yang mengecil, cadence final, atau ending mendadak. Outro yang baik memberi resolusi emosional pada pendengar.",
    examples: [
      "Fade-out pada 'Hey Jude' — na-na-na yang berulang",
      "Ending tiba-tiba pada 'I Want You (She's So Heavy)' Beatles",
    ],
    relatedTerms: ["intro", "chorus", "cadence"],
    tags: ["outro", "coda", "ending", "penutup"],
    sortOrder: 4,
  },
  {
    id: "hook",
    term: "Hook",
    termId: "Hook / Pengait",
    category: "form",
    subCategory: "phrase",
    instrumentContext: "general",
    shortDefinition:
      "Elemen musik paling catchy yang 'mengait' pendengar dan mudah diingat.",
    detailedDefinition:
      "Hook adalah frase melodis, ritmis, atau liris yang paling memorable dalam sebuah lagu. Bisa berupa riff instrumen, frase vokal, atau bahkan efek suara. Hook yang kuat adalah alasan utama lagu menjadi populer. Lagu bisa memiliki lebih dari satu hook.",
    examples: [
      "Riff gitar '(I Can't Get No) Satisfaction' Rolling Stones",
      "Melodi vokal 'Bad Romance' Lady Gaga — 'Ra-ra-ah-ah-ah'",
      "Bass line 'Under Pressure' Queen/Bowie",
    ],
    relatedTerms: ["chorus", "riff", "motif"],
    tags: ["hook", "catchy", "memorable", "pengait"],
    sortOrder: 5,
  },
  {
    id: "riff",
    term: "Riff",
    termId: "Riff",
    category: "form",
    subCategory: "phrase",
    instrumentContext: "guitar",
    shortDefinition:
      "Pola musik pendek yang diulang sebagai fondasi lagu, biasanya dimainkan gitar atau bass.",
    detailedDefinition:
      "Riff adalah frasa musik pendek (biasanya 1-4 bar) yang diulang-ulang dan menjadi identitas utama lagu. Dalam rock dan blues, riff biasanya dimainkan oleh gitar elektrik atau bass. Riff berbeda dari lick karena riff diulang sebagai fondasi, sedangkan lick adalah frase sekali pakai dalam solo.",
    examples: [
      "'Smoke on the Water' — 0-3-5, 0-3-6-5",
      "'Seven Nation Army' — riff bass ikonik",
      "'Enter Sandman' Metallica",
    ],
    relatedTerms: ["hook", "lick", "ostinato", "motif"],
    guitarTechnique: {
      howTo:
        "Mainkan pola pendek berulang dengan presisi ritme. Riff biasanya menggunakan power chord, single notes, atau kombinasi keduanya.",
      hand: "both",
      difficulty: "beginner",
      tips: [
        "Fokus pada timing dan konsistensi — riff harus solid sebelum ditambah variasi",
        "Gunakan metronome untuk latihan riff baru",
      ],
    },
    tags: ["riff", "gitar", "bass", "pola", "berulang"],
    sortOrder: 6,
  },
  {
    id: "lick",
    term: "Lick",
    termId: "Lick",
    category: "form",
    subCategory: "phrase",
    instrumentContext: "guitar",
    shortDefinition:
      "Frase musik pendek yang digunakan dalam solo atau improvisasi.",
    detailedDefinition:
      "Lick adalah frase melodis pendek yang biasanya digunakan sekali dalam konteks solo atau improvisasi, berbeda dari riff yang diulang sebagai fondasi. Gitaris mengumpulkan 'vocabulary lick' dari berbagai genre (blues lick, jazz lick, rock lick) untuk digunakan saat improvisasi.",
    examples: [
      "Blues lick pada pentatonic minor box 1",
      "Chuck Berry intro lick — digunakan di banyak lagu rock awal",
    ],
    relatedTerms: ["riff", "solo", "improvisation"],
    guitarTechnique: {
      howTo:
        "Pelajari lick dari transkripsi solo gitaris favorit. Latih dalam berbagai key dan posisi fretboard. Kombinasikan lick yang berbeda untuk membangun solo.",
      hand: "both",
      difficulty: "intermediate",
    },
    tags: ["lick", "solo", "improvisasi", "frase"],
    sortOrder: 7,
  },
  {
    id: "motif",
    term: "Motif",
    termId: "Motif",
    aliases: ["Motive"],
    category: "form",
    subCategory: "phrase",
    instrumentContext: "general",
    shortDefinition:
      "Unit melodis/ritmis terkecil yang bisa dikenali dan dikembangkan.",
    detailedDefinition:
      "Motif adalah ide musik terpendek yang memiliki identitas — biasanya 2-8 nada dengan pola ritmis dan/atau melodis yang khas. Motif bisa dikembangkan melalui repetisi, sekuens, inversi, augmentasi, dan diminusi. Beethoven's Fifth Symphony dibuka dengan motif 4 nada paling terkenal di dunia.",
    examples: [
      "Da-da-da-daaa (Beethoven Symphony No. 5)",
      "Motif 2 nada naik di 'Ode to Joy'",
    ],
    relatedTerms: ["theme", "sequence", "hook", "riff"],
    tags: ["motif", "motive", "tema", "ide musik"],
    sortOrder: 8,
  },
  {
    id: "theme",
    term: "Theme",
    termId: "Tema",
    category: "form",
    subCategory: "phrase",
    instrumentContext: "general",
    shortDefinition:
      "Melodi atau ide musikal utama yang menjadi subjek sebuah komposisi.",
    detailedDefinition:
      "Theme adalah ide musik yang lebih panjang dari motif dan menjadi bahan utama yang dikembangkan dalam sebuah karya. Dalam sonata form, ada tema pertama dan tema kedua. Dalam variasi (theme and variations), tema disajikan dulu, lalu diubah-ubah dalam setiap variasi.",
    examples: [
      "Tema utama Star Wars oleh John Williams",
      "Theme and Variations — tema diikuti variasi 1, 2, 3, dst.",
    ],
    relatedTerms: ["motif", "variation", "form"],
    tags: ["theme", "tema", "melodi utama", "komposisi"],
    sortOrder: 9,
  },
  {
    id: "ostinato",
    term: "Ostinato",
    termId: "Ostinato",
    aliases: ["Basso ostinato"],
    category: "form",
    subCategory: "phrase",
    instrumentContext: "general",
    shortDefinition:
      "Pola musik yang diulang terus-menerus sepanjang komposisi atau section.",
    detailedDefinition:
      "Ostinato (dari bahasa Italia 'keras kepala') adalah pola melodis, ritmis, atau harmonis yang diulang berkali-kali tanpa henti. Basso ostinato (ground bass) adalah ostinato di bass line. Teknik ini sangat umum di musik Barok (Pachelbel's Canon), EDM, hip-hop, dan minimalis.",
    examples: [
      "Bass line Pachelbel Canon in D",
      "Ostinato piano dalam 'Clocks' Coldplay",
      "Loop bass dalam musik hip-hop",
    ],
    relatedTerms: ["riff", "pedal-point", "loop"],
    tags: ["ostinato", "loop", "berulang", "bass line"],
    sortOrder: 10,
  },
  {
    id: "pre-chorus",
    term: "Pre-Chorus",
    termId: "Pre-Chorus",
    aliases: ["Build", "Climb", "Channel"],
    category: "form",
    subCategory: "section",
    instrumentContext: "general",
    shortDefinition:
      "Bagian transisi antara verse dan chorus yang membangun antisipasi.",
    detailedDefinition:
      "Pre-chorus adalah section opsional yang menghubungkan verse ke chorus. Fungsinya membangun tension dan antisipasi sebelum 'payoff' di chorus. Biasanya menggunakan harmoni yang bergerak menuju dominan, melodi yang naik, atau intensitas yang meningkat.",
    examples: [
      "Bagian 'Oh-oh-oh' sebelum chorus di banyak lagu pop",
      "Biasanya 4 bar",
    ],
    relatedTerms: ["verse", "chorus", "bridge"],
    tags: ["pre-chorus", "build", "transisi", "antisipasi"],
    sortOrder: 11,
  },
  {
    id: "solo",
    term: "Solo",
    termId: "Solo",
    category: "form",
    subCategory: "section",
    instrumentContext: "general",
    shortDefinition:
      "Bagian di mana satu instrumen tampil menonjol dengan improvisasi atau melodi tertulis.",
    detailedDefinition:
      "Solo adalah section di mana satu instrumen (biasanya gitar, keyboard, atau sax) menjadi pusat perhatian, memainkan melodi improvisasi atau tertulis di atas backing harmoni. Guitar solo adalah elemen ikonik dalam rock, blues, dan jazz. Solo bisa pendek (8 bar) atau sangat panjang (multi-chorus dalam jazz).",
    examples: [
      "Guitar solo 'Comfortably Numb' Pink Floyd",
      "Sax solo 'Baker Street' Gerry Rafferty",
    ],
    relatedTerms: ["improvisation", "lick", "cadenza"],
    tags: ["solo", "gitar solo", "improvisasi"],
    sortOrder: 12,
  },
  {
    id: "improvisation",
    term: "Improvisation",
    termId: "Improvisasi",
    aliases: ["Improv"],
    category: "form",
    subCategory: "phrase",
    instrumentContext: "general",
    shortDefinition: "Menciptakan musik secara spontan saat tampil.",
    detailedDefinition:
      "Improvisasi adalah seni membuat musik secara real-time tanpa partitur yang ditentukan sebelumnya. Dalam jazz, improvisasi adalah inti dari penampilan — musisi memainkan melodi baru di atas chord progression. Dalam rock/blues, solo gitar sering diimprovisasi berdasarkan skala pentatonik atau blues.",
    examples: [
      "Jazz solo di atas 12-bar blues changes",
      "Guitar jam session",
      "Freestyle rap",
    ],
    relatedTerms: ["solo", "lick", "scale"],
    tags: ["improvisasi", "improvisation", "spontan", "jazz"],
    sortOrder: 13,
  },
  {
    id: "variation",
    term: "Variation",
    termId: "Variasi",
    category: "form",
    subCategory: "song-form",
    instrumentContext: "general",
    shortDefinition:
      "Pengulangan tema dengan perubahan melodis, harmonis, atau ritmis.",
    detailedDefinition:
      "Variation adalah teknik komposisi di mana tema atau motif disajikan ulang dengan perubahan — bisa berupa perubahan melodi, harmoni, ritme, tempo, register, instrumentasi, atau dinamika. 'Theme and Variations' adalah salah satu form tertua dalam musik Barat.",
    examples: [
      "Mozart — 12 Variasi pada 'Twinkle Twinkle Little Star'",
      "Goldberg Variations — J.S. Bach",
    ],
    relatedTerms: ["theme", "motif", "form"],
    tags: ["variasi", "variation", "tema dan variasi"],
    sortOrder: 14,
  },
  {
    id: "sonata-form",
    term: "Sonata Form",
    termId: "Bentuk Sonata",
    aliases: ["Sonata-allegro form"],
    category: "form",
    subCategory: "song-form",
    instrumentContext: "general",
    shortDefinition:
      "Struktur tiga bagian (Exposition–Development–Recapitulation) dalam musik klasik.",
    detailedDefinition:
      "Sonata form adalah struktur musik paling penting dalam era Klasik dan Romantik. Terdiri dari: (1) Exposition — menyajikan tema pertama di tonik dan tema kedua di dominan; (2) Development — mengolah dan mengembangkan tema-tema melalui modulasi; (3) Recapitulation — mengulang kedua tema dalam tonik. Biasanya diawali intro dan diakhiri coda.",
    examples: [
      "Gerakan pertama hampir semua sonata, simfoni, dan kuartet string era Klasik",
      "Beethoven Piano Sonata No. 8 'Pathétique' mvt. I",
    ],
    relatedTerms: ["binary-form", "ternary-form", "rondo", "theme"],
    tags: ["sonata form", "exposition", "development", "recapitulation"],
    sortOrder: 15,
  },
  {
    id: "twelve-bar-blues",
    term: "12-Bar Blues",
    termId: "Blues 12 Bar",
    aliases: ["Twelve-bar blues"],
    category: "form",
    subCategory: "song-form",
    instrumentContext: "guitar",
    shortDefinition:
      "Progresi chord 12 bar yang menjadi fondasi blues, rock, dan jazz.",
    detailedDefinition:
      "12-bar blues adalah progresi harmoni paling berpengaruh dalam musik populer Barat. Formatnya: I-I-I-I / IV-IV-I-I / V-IV-I-V (atau variasi). Digunakan dalam blues, rock'n'roll, jazz, country, dan R&B. Skala blues dan pentatonic minor digunakan untuk improvisasi di atasnya.",
    examples: [
      "Key of A: A7-A7-A7-A7 / D7-D7-A7-A7 / E7-D7-A7-E7",
      "'Johnny B. Goode' Chuck Berry",
      "'Red House' Jimi Hendrix",
    ],
    relatedTerms: ["key", "dominant-seventh", "scale", "improvisation"],
    guitarTechnique: {
      howTo:
        "Pelajari progresi I-IV-V dalam berbagai key. Gunakan dominant 7th chord. Improvisasi dengan minor pentatonic dan blues scale di atasnya.",
      hand: "both",
      difficulty: "beginner",
      tips: [
        "Mulai dengan key E atau A — paling mudah di gitar",
        "Dengarkan shuffle feel — triplet-based rhythm",
        "Tambahkan turnaround di bar 11-12",
      ],
    },
    tags: ["12-bar blues", "blues", "progresi", "I-IV-V"],
    sortOrder: 16,
  },
  {
    id: "aaba-form",
    term: "AABA Form",
    termId: "Bentuk AABA",
    aliases: ["32-bar form", "American popular song form"],
    category: "form",
    subCategory: "song-form",
    instrumentContext: "general",
    shortDefinition:
      "Struktur lagu 32 bar dengan pattern A-A-B-A yang umum di jazz standards.",
    detailedDefinition:
      "AABA form adalah struktur 32 bar (4 × 8 bar) yang mendominasi lagu-lagu Tin Pan Alley dan jazz standard. Section A menyajikan melodi utama (diulang 2x), B (bridge) memberikan kontras, lalu A kembali sebagai penutup. Banyak jazz standard menggunakan form ini sebagai basis improvisasi.",
    examples: [
      "'Over the Rainbow'",
      "'I Got Rhythm' George Gershwin",
      "'Fly Me to the Moon'",
    ],
    relatedTerms: ["verse", "chorus", "bridge", "form"],
    tags: ["AABA", "32-bar", "jazz standard", "song form"],
    sortOrder: 17,
  },
  {
    id: "strophic-form",
    term: "Strophic Form",
    termId: "Bentuk Strofik",
    aliases: ["AAA form", "Verse form"],
    category: "form",
    subCategory: "song-form",
    instrumentContext: "general",
    shortDefinition:
      "Struktur lagu di mana musik yang sama diulang untuk setiap bait lirik.",
    detailedDefinition:
      "Strophic form (AAA) adalah struktur paling sederhana: satu bagian musik diulang untuk setiap bait (strophe) dengan lirik berbeda. Sangat umum dalam folk song, hymn, dan lagu anak-anak. Tidak ada chorus terpisah — setiap verse menggunakan melodi yang identik.",
    examples: [
      "'Amazing Grace'",
      "'Blowin' in the Wind' Bob Dylan",
      "Kebanyakan hymn gereja",
    ],
    relatedTerms: ["verse", "binary-form", "ternary-form"],
    tags: ["strophic", "AAA", "verse form", "folk"],
    sortOrder: 18,
  },
  {
    id: "through-composed",
    term: "Through-Composed",
    termId: "Komposisi Tembus",
    aliases: ["Durchkomponiert"],
    category: "form",
    subCategory: "song-form",
    instrumentContext: "general",
    shortDefinition:
      "Komposisi tanpa pengulangan section — musik baru terus berkembang.",
    detailedDefinition:
      "Through-composed adalah bentuk di mana setiap bagian lagu memiliki musik baru tanpa pengulangan section sebelumnya. Ini kontras dengan strophic form. Biasa ditemukan dalam art song (Lied) Romantik seperti karya Schubert, dan dalam beberapa progressive rock.",
    examples: [
      "'Erlkönig' Schubert — setiap karakter memiliki musik berbeda",
      "'Bohemian Rhapsody' Queen — terus berubah tanpa verse/chorus tradisional",
    ],
    relatedTerms: ["strophic-form", "form"],
    tags: ["through-composed", "durchkomponiert", "non-repetitive"],
    sortOrder: 19,
  },
  {
    id: "coda",
    term: "Coda",
    termId: "Coda",
    category: "form",
    subCategory: "section",
    instrumentContext: "general",
    shortDefinition:
      "Bagian penutup yang ditambahkan setelah struktur utama selesai.",
    detailedDefinition:
      "Coda (dari bahasa Italia 'ekor') adalah bagian tambahan di akhir komposisi yang memberikan penutupan. Dalam notasi klasik, ditandai dengan simbol coda (𝄌). Coda bisa pendek (beberapa bar) atau panjang (section tersendiri seperti di Beethoven). Dalam pop, coda sering berupa chorus yang difade-out.",
    unicodeSymbol: "𝄌",
    bravuraSymbol: { codePoint: 0xe048, label: "Coda" },
    relatedTerms: ["outro", "cadence", "form"],
    tags: ["coda", "penutup", "ending"],
    sortOrder: 20,
  },
  {
    id: "da-capo",
    term: "Da Capo",
    termId: "Da Capo",
    aliases: ["D.C."],
    category: "notation",
    subCategory: "repeat-marks",
    instrumentContext: "general",
    shortDefinition: "Instruksi untuk kembali ke awal komposisi.",
    detailedDefinition:
      "Da Capo (D.C.) adalah istilah Italia yang berarti 'dari kepala/awal'. Ketika musisi menemui tanda D.C., mereka kembali memainkan dari bar pertama. Sering dikombinasikan dengan 'al Fine' (sampai tanda Fine/selesai) atau 'al Coda' (lalu lompat ke coda).",
    examples: ["D.C. al Fine — kembali ke awal, mainkan sampai tanda Fine"],
    relatedTerms: ["dal-segno", "coda", "form"],
    tags: ["da capo", "D.C.", "ulangi", "dari awal"],
    sortOrder: 21,
  },
  {
    id: "dal-segno",
    term: "Dal Segno",
    termId: "Dal Segno",
    aliases: ["D.S."],
    category: "notation",
    subCategory: "repeat-marks",
    instrumentContext: "general",
    shortDefinition: "Instruksi untuk kembali ke tanda segno (𝄋).",
    detailedDefinition:
      "Dal Segno (D.S.) berarti 'dari tanda'. Ketika musisi menemui D.S., mereka kembali ke posisi tanda segno (𝄋) dalam partitur. Sering dikombinasikan dengan 'al Coda' (lalu lompat ke coda setelah menemui tanda coda).",
    unicodeSymbol: "𝄋",
    bravuraSymbol: { codePoint: 0xe047, label: "Segno" },
    relatedTerms: ["da-capo", "coda", "form"],
    tags: ["dal segno", "D.S.", "segno", "ulangi"],
    sortOrder: 22,
  },
];
