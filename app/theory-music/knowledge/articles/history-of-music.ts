// ════════════════════════════════════════════════════════
// Music Knowledge – Article: History of Music
// ════════════════════════════════════════════════════════

import type { KnowledgeArticle } from "../types";

export const ARTICLE_HISTORY_OF_MUSIC: KnowledgeArticle = {
  id: "history-of-music",
  title: "Sejarah Musik Barat",
  subtitle: "Dari Nyanyian Gregorian hingga Era Digital",
  category: "history",
  level: "beginner",
  readingTime: 15,
  description:
    "Perjalanan musik Barat selama 1.000+ tahun — dari chant monophonic di gereja abad pertengahan, revolusi polifoni, era klasik heroik, hingga eksperimen elektronik abad ke-21.",
  heroIcon: "scroll",
  tags: [
    "sejarah",
    "era musik",
    "baroque",
    "klasik",
    "romantik",
    "medieval",
    "modern",
    "elektronik",
    "bach",
    "beethoven",
    "mozart",
    "debussy",
  ],

  sections: [
    {
      id: "medieval",
      title: "Era Medieval (500–1400): Kelahiran Notasi",
      content: `Musik Barat tertulis dimulai dari **Gregorian Chant** — nyanyian monophonic (satu melodi tanpa harmoni) yang digunakan dalam liturgi Gereja Katolik.

**Tonggak penting:**
- **Guido d'Arezzo (~1000 M)** menciptakan sistem solmisasi (do-re-mi) dan staff 4 garis — cikal bakal notasi modern
- **Organum (~900 M)** — eksperimen pertama polifoni, menambahkan suara kedua yang berjalan paralel (biasanya di interval perfect fifth atau fourth)
- **Ars Nova (~1300 M)** — Philippe de Vitry memperkenalkan ritme kompleks dan notasi yang lebih presisi

**Ciri khas:**
- Modal (menggunakan modes Gregorian, bukan major/minor)
- Teks sakral (Latin)
- Tanpa instrumen (a cappella) atau dengan drone sederhana
- Tekstur monophonic → berkembang ke polyphonic sederhana

Fakta menarik: Istilah "Gregorian" berasal dari Paus Gregorius I (abad ke-6), meskipun banyak chant sebenarnya ditulis setelah masanya.`,
      widget: {
        type: "timeline",
        events: [
          {
            year: "~500",
            title: "Gregorian Chant",
            description:
              "Nyanyian monophonic sakral; fondasi musik Barat tertulis",
            era: "Medieval",
          },
          {
            year: "~900",
            title: "Organum",
            description:
              "Eksperimen polifoni pertama; suara paralel di perfect fifth",
            era: "Medieval",
          },
          {
            year: "~1000",
            title: "Guido d'Arezzo",
            description: "Sistem solmisasi (do-re-mi) dan staff notation",
            era: "Medieval",
          },
          {
            year: "~1300",
            title: "Ars Nova",
            description: "Notasi ritmis presisi oleh Philippe de Vitry",
            era: "Medieval",
          },
          {
            year: "~1400",
            title: "Era Renaissance Dimulai",
            description:
              "Polifoni semakin kompleks; humanisme mempengaruhi seni",
            era: "Renaissance",
          },
          {
            year: "~1600",
            title: "Era Baroque Dimulai",
            description: "Tonalitas major/minor, basso continuo, opera lahir",
            era: "Baroque",
          },
          {
            year: "1722",
            title: "Well-Tempered Clavier",
            description: "Bach menulis 48 preludes & fugues di semua 24 key",
            era: "Baroque",
          },
          {
            year: "~1750",
            title: "Era Classical",
            description: "Struktur formal (sonata form), Haydn, Mozart",
            era: "Classical",
          },
          {
            year: "1808",
            title: "Beethoven Symphony No.5",
            description: "Simbol transisi dari Classical ke Romantic era",
            era: "Romantic",
          },
          {
            year: "~1900",
            title: "Impressionism & 20th Century",
            description:
              "Debussy melepas tonalitas tradisional; atonalisme Schoenberg",
            era: "Modern",
          },
          {
            year: "1951",
            title: "Musik Elektronik",
            description: "Stockhausen & Cologne studio; synthesizer pertama",
            era: "Contemporary",
          },
          {
            year: "~1980",
            title: "Era Digital & MIDI",
            description:
              "MIDI protocol (1983), sampling, DAW, produksi musik digital",
            era: "Contemporary",
          },
        ],
      },
      keyTakeaway:
        "Seluruh sistem notasi modern — clef, staff, note values — berakar dari solusi praktis yang diciptakan biksu abad pertengahan untuk mengajar nyanyian.",
    },
    {
      id: "renaissance",
      title: "Era Renaissance (1400–1600): Polifoni Mencapai Puncak",
      content: `Renaissance ("kelahiran kembali") membawa perubahan besar dalam musik:

**Komposer penting:**
- **Josquin des Prez** — "Michelangelo-nya musik"; master polifoni imitatif
- **Palestrina** — menyempurnakan polifoni vokal untuk Gereja Katolik
- **William Byrd** — komposer Inggris; musik sakral dan sekuler

**Perkembangan kunci:**
- **Polifoni imitatif**: Setiap suara "meniru" melodi yang dimulai oleh suara lain (cikal bakal fugue)
- **Teks sekuler**: Madrigal (Italia), Chanson (Prancis) — musik bukan lagi monopoli gereja
- **Harmoni vertikal mulai diperhatikan**: Transisi dari berpikir "horizontal" (melodi per suara) ke "vertikal" (chord)
- **Pengaruh cetak**: Percetakan Gutenberg (~1450) membuat penyebaran partitur jauh lebih mudah

**Tuning:** Just Intonation dan Meantone Temperament mulai digunakan untuk mengakomodasi third yang lebih indah.`,
      keyTakeaway:
        "Renaissance adalah transisi dari pemikiran melodis horizontal (setiap suara independen) ke kesadaran harmoni vertikal (chord). Ini fondasi seluruh musik tonal.",
    },
    {
      id: "baroque",
      title: "Era Baroque (1600–1750): Lahirnya Tonalitas",
      content: `Era Baroque mengubah musik secara fundamental:

**Revolusi:**
1. **Tonalitas major/minor** menggantikan system modal medieval
2. **Basso continuo**: instrumen bass + chord menyediakan pondasi harmoni (cikal bakal chord chart modern!)
3. **Opera lahir** di Florence (~1600) — Claudio Monteverdi menjadi pionirnya
4. **Ornamentasi mewah** — trills, mordents, turns menjadi ciri khas

**Komposer legendaris:**
- **J.S. Bach (1685–1750)** — puncak counterpoint; "The Well-Tempered Clavier" membuktikan kemungkinan bermain di semua 24 key
- **Handel (1685–1759)** — opera dan oratorio monumental ("Messiah")
- **Vivaldi (1678–1741)** — concerto form; "The Four Seasons"

**Hubungan dengan matematika:**
Bach secara sadar menggunakan struktur matematis: fugue = tema yang di-transformasi secara sistematis (transposisi, inversi, retrograde, augmentasi).

**Chord progression** yang hierarkis (I-IV-V-I) mulai mapan di era ini.`,
      widget: {
        type: "comparison-table",
        headers: ["Aspek", "Medieval/Renaissance", "Baroque"],
        rows: [
          ["Sistem nada", "Modal (modes)", "Tonal (major/minor)"],
          ["Tekstur", "Polifoni imitatif", "Homophonic + basso continuo"],
          ["Harmoni", "Kebetulan vertikal", "Progression sadar (I-IV-V-I)"],
          ["Instrumen", "Vokal dominan", "Keyboard, strings, continuo"],
          ["Ornamen", "Minimal", "Sangat mewah (trills, mordents)"],
          ["Dinamika", "Rata", "Terraced dynamics (piano/forte)"],
        ],
      },
      keyTakeaway:
        "Baroque membangun fondasi SEMUA musik modern: tonalitas major/minor, chord progression, dan konsep bahwa harmoni bergerak dari tension ke resolution.",
    },
    {
      id: "classical-romantic",
      title: "Classical & Romantic (1750–1900): Emosi Heroik",
      content: `**Era Classical (1750–1820):**
Reaksi terhadap kerumitan Baroque — mencari kejelasan, keseimbangan, dan struktur formal.

- **Sonata Form** menjadi blueprint: Exposition → Development → Recapitulation
- **Haydn** — "Bapak String Quartet" dan simfoni
- **Mozart** — melodi yang sempurna, opera genius
- **Beethoven** — jembatan ke Romantik; simfoni sebagai pernyataan emosi besar

**Era Romantic (1820–1900):**
Emosi, individualitas, dan kebebasan ekspresi menjadi prioritas.

- **Chromaticism meningkat** — lebih banyak nada di luar key (modulasi, alterasi)
- **Orkestra membesar** — dari ~40 musisi ke 100+
- **Piano menjadi raja** — Chopin, Liszt mendominasi dengan virtuositas
- **Program music** — musik yang menceritakan kisah (Berlioz "Symphonie Fantastique")
- **Wagner** — leitmotif, chromatic harmony extrem, opera sebagai "total artwork"
- **Late Romantic** — Mahler, Strauss mendorong tonalitas ke ambang batas

Menjelang 1900, harmoni semakin chromatic hingga konsep "key center" mulai kabur — membuka jalan ke abad 20.`,
      keyTakeaway:
        "Romantic era mendorong harmoni kromatik hingga batas maksimal tonalitas tradisional. Dari sini lahir musik modern yang melepaskan diri dari major/minor.",
    },
    {
      id: "modern-contemporary",
      title: "Abad 20 & Era Digital: Revolusi Tanpa Batas",
      content: `Abad 20 menghasilkan ledakan eksperimen yang mengubah definisi "musik" itu sendiri:

**Impressionism (~1890–1920):**
- **Debussy** — whole-tone scale, parallelism, harmoni "mengambang"
- **Ravel** — orkestrasi cemerlang, jazz influence

**Atonalisme & Serialisme:**
- **Schoenberg** — 12-tone row: setiap komposisi menggunakan semua 12 nada chromatic secara setara
- **Webern, Berg** — serial technique yang diperluas ke ritme, dinamika, timbre

**Eksperimen Radikal:**
- **John Cage "4'33"" (1952)** — "musik" tanpa nada; pertanyaan: apa itu musik?
- **Minimalism** — Steve Reich, Philip Glass: pola repetitif yang berubah perlahan
- **Musique Concrètie** — merekam dan memanipulasi suara nyata sebagai material musik

**Era Digital:**
- **1983: MIDI** — standar komunikasi universal antar instrumen digital
- **1990an: DAW** — Digital Audio Workstation memungkinkan produksi musik di komputer biasa
- **2000an+** — Auto-Tune, virtual instruments, AI music generation
- **Streaming** mengubah distribusi dan konsumsi musik secara fundamental

Hari ini, siapa pun dengan laptop dan koneksi internet bisa membuat, merekam, dan mendistribusikan musik ke seluruh dunia.`,
      widget: {
        type: "quiz",
        questions: [
          {
            question:
              "Siapa komposer yang menulis 'The Well-Tempered Clavier'?",
            options: ["Mozart", "Beethoven", "J.S. Bach", "Handel"],
            correctIndex: 2,
            explanation:
              "Bach menulis The Well-Tempered Clavier (1722 & 1742) — 48 preludes dan fugues di semua 24 major dan minor keys.",
          },
          {
            question: "Sonata Form terdiri dari urutan:",
            options: [
              "Verse → Chorus → Bridge",
              "Exposition → Development → Recapitulation",
              "Theme → Variation → Coda",
              "A → B → A → B",
            ],
            correctIndex: 1,
            explanation:
              "Sonata Form: Exposition (tema utama), Development (eksplorasi dan transformasi), Recapitulation (kembali ke tema).",
          },
          {
            question: "12-tone technique dikembangkan oleh:",
            options: ["Debussy", "Wagner", "Schoenberg", "Stravinsky"],
            correctIndex: 2,
            explanation:
              "Arnold Schoenberg mengembangkan teknik 12 nada (dodecaphony) sekitar 1921-1923 sebagai sistem komposisi yang menghindari hierarki tonal.",
          },
          {
            question: "MIDI protocol pertama kali distandarisasi tahun:",
            options: ["1975", "1983", "1991", "2000"],
            correctIndex: 1,
            explanation:
              "MIDI 1.0 distandarisasi tahun 1983, memungkinkan instrumen digital dari berbagai produsen saling berkomunikasi.",
          },
        ],
      },
    },
  ],

  crossRefs: [
    { type: "knowledge", id: "math-of-music", label: "Matematika dalam Musik" },
    {
      type: "knowledge",
      id: "psychology-of-music",
      label: "Psikologi Musik",
    },
    { type: "nolopedia", id: "consonance", label: "Konsonansi" },
    { type: "nolopedia", id: "dissonance", label: "Disonansi" },
    { type: "nolopedia", id: "interval", label: "Interval" },
    { type: "family", id: "family", label: "Harmonic Family" },
    { type: "chord", id: "chord", label: "Chord Explorer" },
  ],
  relatedArticles: [
    "math-of-music",
    "acoustics-of-sound",
    "psychology-of-music",
    "chord-and-harmony",
  ],
};
