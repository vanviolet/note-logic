// ════════════════════════════════════════════════════════
// Music Knowledge – Article: Mathematics of Music
// ════════════════════════════════════════════════════════

import type { KnowledgeArticle } from "../types";

export const ARTICLE_MATH_OF_MUSIC: KnowledgeArticle = {
  id: "math-of-music",
  title: "Matematika dalam Musik",
  subtitle: "Dari Pythagoras hingga Equal Temperament",
  category: "math-and-science",
  level: "intermediate",
  readingTime: 12,
  description:
    "Jelajahi hubungan mendalam antara matematika dan musik — dari rasio Pythagoras, deret harmonik, hingga sistem tuning modern yang menggunakan akar pangkat dua belas.",
  heroIcon: "calculator",
  tags: [
    "pythagoras",
    "rasio",
    "frekuensi",
    "equal temperament",
    "tuning",
    "matematika",
    "harmonik",
    "overtone",
  ],

  sections: [
    {
      id: "pythagoras-discovery",
      title: "Penemuan Pythagoras: Musik adalah Angka",
      content: `Sekitar 2.500 tahun lalu, filsuf Yunani Pythagoras menemukan bahwa hubungan antara nada-nada yang harmonis dapat dinyatakan dengan rasio bilangan bulat sederhana.

Ceritanya dimulai ketika Pythagoras melewati bengkel pandai besi dan mendengar bunyi palu yang harmonis. Ia menemukan bahwa palu-palu dengan berat yang berbanding 2:1, 3:2, dan 4:3 menghasilkan interval yang indah.

**Tiga rasio fundamental Pythagoras:**
- **2:1** → Oktaf (nada yang "sama" tapi lebih tinggi)
- **3:2** → Perfect Fifth (interval paling harmonis setelah oktaf)  
- **4:3** → Perfect Fourth (komplemen dari fifth)

Penemuan ini revolusioner karena menunjukkan bahwa **keindahan musik bisa dijelaskan secara matematis**. Semakin sederhana rasio, semakin konsonan (harmonis) bunyinya.`,
      widget: {
        type: "ratio-calculator",
        ratios: [
          { label: "Unison (1:1)", ratio: 1, cents: 0 },
          { label: "Oktaf (2:1)", ratio: 2, cents: 1200 },
          { label: "Perfect Fifth (3:2)", ratio: 1.5, cents: 702 },
          { label: "Perfect Fourth (4:3)", ratio: 1.333, cents: 498 },
          { label: "Major Third (5:4)", ratio: 1.25, cents: 386 },
          { label: "Minor Third (6:5)", ratio: 1.2, cents: 316 },
          { label: "Major Sixth (5:3)", ratio: 1.667, cents: 884 },
          { label: "Minor Sixth (8:5)", ratio: 1.6, cents: 814 },
        ],
      },
      keyTakeaway:
        "Rasio yang lebih sederhana (bilangan lebih kecil) menghasilkan interval yang lebih konsonan. Ini adalah fondasi seluruh teori harmoni.",
    },
    {
      id: "harmonic-series",
      title: "Deret Harmonik: DNA Setiap Nada",
      content: `Ketika sebuah senar bergetar, ia tidak hanya menghasilkan satu frekuensi. Ia menghasilkan serangkaian frekuensi yang disebut **deret harmonik** (harmonic series / overtone series).

Jika nada dasar (fundamental) adalah **f**, maka:
- Harmonik ke-1: **f** (fundamental)
- Harmonik ke-2: **2f** (oktaf)
- Harmonik ke-3: **3f** (oktaf + perfect fifth)
- Harmonik ke-4: **4f** (dua oktaf)
- Harmonik ke-5: **5f** (dua oktaf + major third)
- Harmonik ke-6: **6f** (dua oktaf + perfect fifth)
- Harmonik ke-7: **7f** (≈ dua oktaf + minor seventh, sedikit meleset)

**Mengapa ini penting?**
Deret harmonik menjelaskan:
1. **Mengapa oktaf terdengar "sama"** — harmonik ke-2 adalah kelipatan dari fundamental
2. **Warna nada (timbre)** — setiap instrumen punya campuran harmonik yang berbeda
3. **Chord major terdengar natural** — nada-nada chord major (root, M3, P5) muncul di 6 harmonik pertama
4. **Mengapa P5 sangat konsonan** — harmonik ke-3 adalah perfect fifth`,
      widget: {
        type: "harmonic-series",
        fundamentalHz: 110,
        partials: 8,
      },
      keyTakeaway:
        "Deret harmonik adalah alasan mengapa chord major terdengar natural dan stabil — nada-nadanya sudah ada di dalam satu nada fundamental.",
    },
    {
      id: "circle-of-fifths-math",
      title: "Circle of Fifths: Spiral Tak Berujung",
      content: `Circle of Fifths adalah salah satu diagram terpenting dalam teori musik. Secara matematis, ia dibangun dengan cara menumpuk interval perfect fifth (rasio 3:2) berulang kali.

Mulai dari C, naik satu fifth:
C → G → D → A → E → B → F#/Gb → Db → Ab → Eb → Bb → F → (kembali ke C?)

**Masalahnya: Pythagorean Comma**  
Jika kita menumpuk 12 perfect fifth murni (3:2), kita TIDAK kembali tepat ke nada awal. Hasilnya meleset sekitar **23.46 cents** — disebut Pythagorean Comma.

Secara matematis: (3/2)¹² = 129.746... sedangkan 2⁷ = 128.

Ini berarti circle of fifths sebenarnya bukan lingkaran sempurna, melainkan **spiral**! Masalah ini menjadi motivasi penciptaan sistem tuning yang berbeda-beda selama berabad-abad.`,
      widget: {
        type: "circle-of-fifths",
      },
      keyTakeaway:
        "Pythagorean Comma (23.46 cents) menunjukkan bahwa secara matematis murni, 12 perfect fifth tidak membentuk lingkaran sempurna. Ini adalah 'cacat' fundamental yang memotivasi seluruh sejarah tuning.",
    },
    {
      id: "tuning-systems",
      title: "Perang Tuning: Dari Pythagorean ke Equal Temperament",
      content: `Karena Pythagorean Comma, musisi berabad-abad bereksperimen dengan berbagai sistem tuning:

**1. Pythagorean Tuning (~500 SM)**
- Dibangun dari rasio 3:2 murni
- Fifth sempurna, tapi third sangat tajam (81:64 vs ideal 5:4)
- Cocok untuk melodi monophonic

**2. Just Intonation**
- Menggunakan rasio bilangan bulat murni (5:4 untuk M3, 6:5 untuk m3)
- Chord terdengar sangat indah di satu key
- Tidak bisa modulasi — chord di key lain terdengar jelek

**3. Meantone Temperament (~1500 M)**
- Kompromi: fifth sedikit diperkecil agar third lebih baik
- Populer di era Renaissance dan Baroque
- "Wolf fifth" — satu interval yang sangat fals

**4. Well Temperament (~1700 M)**
- Setiap key bisa dimainkan, tapi setiap key punya "warna" berbeda
- Kemungkinan inilah tuning yang dipakai Bach untuk "The Well-Tempered Clavier"

**5. Equal Temperament (12-TET, modern)**
- Membagi oktaf menjadi 12 semitone yang **persis sama**
- Setiap semitone = rasio 2^(1/12) ≈ 1.05946
- Setiap semitone = 100 cents
- Bisa modulasi ke key manapun
- Tidak ada interval yang murni (kecuali oktaf)`,
      widget: {
        type: "comparison-table",
        headers: [
          "Interval",
          "Just Ratio",
          "Just Cents",
          "12-TET Cents",
          "Selisih",
        ],
        rows: [
          ["Unison", "1:1", "0", "0", "0"],
          ["Minor 2nd", "16:15", "112", "100", "−12"],
          ["Major 2nd", "9:8", "204", "200", "−4"],
          ["Minor 3rd", "6:5", "316", "300", "−16"],
          ["Major 3rd", "5:4", "386", "400", "+14"],
          ["Perfect 4th", "4:3", "498", "500", "+2"],
          ["Tritone", "√2:1", "600", "600", "0"],
          ["Perfect 5th", "3:2", "702", "700", "−2"],
          ["Minor 6th", "8:5", "814", "800", "−14"],
          ["Major 6th", "5:3", "884", "900", "+16"],
          ["Minor 7th", "9:5", "1018", "1000", "−18"],
          ["Major 7th", "15:8", "1088", "1100", "+12"],
          ["Octave", "2:1", "1200", "1200", "0"],
        ],
      },
      keyTakeaway:
        "Equal Temperament mengorbankan kemurnian interval demi fleksibilitas modulasi. Setiap interval sedikit 'fals', tapi telinga kita terbiasa.",
    },
    {
      id: "frequency-math",
      title: "Rumus Frekuensi: A4 = 440 Hz",
      content: `Dalam Equal Temperament, frekuensi setiap nada bisa dihitung dengan satu rumus:

**f = 440 × 2^((n−69)/12)**

di mana:
- **f** = frekuensi dalam Hz
- **440** = frekuensi A4 (standar tuning modern)
- **n** = nomor MIDI note (A4 = 69)
- **12** = jumlah semitone per oktaf

**Contoh:**
- C4 (Middle C): 440 × 2^((60−69)/12) = 440 × 2^(−0.75) = **261.63 Hz**
- E4: 440 × 2^((64−69)/12) = **329.63 Hz**
- G4: 440 × 2^((67−69)/12) = **392.00 Hz**

**Fun fact:** Standar A = 440 Hz baru ditetapkan tahun 1955 oleh ISO. Sebelumnya, pitch standar bervariasi antara 415 Hz (Baroque) hingga 460+ Hz (beberapa orkestra).`,
      widget: {
        type: "frequency-table",
        rows: [
          { note: "C", octave: 2, frequency: 65.41, midi: 36 },
          { note: "A", octave: 2, frequency: 110.0, midi: 45 },
          { note: "C", octave: 3, frequency: 130.81, midi: 48 },
          { note: "A", octave: 3, frequency: 220.0, midi: 57 },
          { note: "C", octave: 4, frequency: 261.63, midi: 60 },
          { note: "E", octave: 4, frequency: 329.63, midi: 64 },
          { note: "G", octave: 4, frequency: 392.0, midi: 67 },
          { note: "A", octave: 4, frequency: 440.0, midi: 69 },
          { note: "C", octave: 5, frequency: 523.25, midi: 72 },
          { note: "A", octave: 5, frequency: 880.0, midi: 81 },
          { note: "C", octave: 6, frequency: 1046.5, midi: 84 },
          { note: "A", octave: 6, frequency: 1760.0, midi: 93 },
        ],
      },
      keyTakeaway:
        "Dengan satu rumus f = 440 × 2^((n−69)/12), kita bisa menghitung frekuensi SETIAP nada dalam sistem 12-TET modern.",
    },
    {
      id: "math-quiz",
      title: "Uji Pengetahuan: Matematika Musik",
      content:
        "Saatnya menguji pemahaman kamu tentang hubungan matematika dan musik! Jawab pertanyaan berikut:",
      widget: {
        type: "quiz",
        questions: [
          {
            question: "Rasio frekuensi untuk interval Perfect Fifth adalah:",
            options: ["2:1", "3:2", "4:3", "5:4"],
            correctIndex: 1,
            explanation:
              "Perfect Fifth memiliki rasio 3:2. Ini adalah interval paling konsonan setelah oktaf (2:1) dan unison (1:1).",
          },
          {
            question: "Berapa cents satu semitone dalam Equal Temperament?",
            options: ["50 cents", "100 cents", "120 cents", "200 cents"],
            correctIndex: 1,
            explanation:
              "Dalam 12-TET, satu oktaf (1200 cents) dibagi rata menjadi 12 semitone, masing-masing 100 cents.",
          },
          {
            question: "Pythagorean Comma terjadi karena:",
            options: [
              "12 perfect fifth tidak genap 7 oktaf",
              "A4 tidak tepat 440 Hz",
              "Deret harmonik berhenti di partials ke-7",
              "Tritone tidak bisa dibagi rata",
            ],
            correctIndex: 0,
            explanation:
              "Pythagorean Comma (~23.46 cents) adalah selisih antara 12 perfect fifth murni ((3/2)¹² ≈ 129.75) dan 7 oktaf (2⁷ = 128).",
          },
          {
            question: "Harmonik ke-3 dari nada C menghasilkan interval:",
            options: [
              "Oktaf",
              "Perfect Fourth",
              "Perfect Fifth",
              "Major Third",
            ],
            correctIndex: 2,
            explanation:
              "Harmonik ke-3 (3f) adalah satu oktaf + perfect fifth di atas fundamental. Jika fundamental = C2, harmonik ke-3 ≈ G3.",
          },
          {
            question: "Dalam Equal Temperament, rasio satu semitone adalah:",
            options: ["12/√2", "2^(1/12)", "1.5", "√2"],
            correctIndex: 1,
            explanation:
              "Setiap semitone memiliki rasio 2^(1/12) ≈ 1.05946. Ini memastikan 12 semitone persis sama dengan satu oktaf (rasio 2:1).",
          },
        ],
      },
    },
  ],

  crossRefs: [
    { type: "nolopedia", id: "interval", label: "Interval (Nolopedia)" },
    { type: "nolopedia", id: "consonance", label: "Konsonansi" },
    { type: "nolopedia", id: "dissonance", label: "Disonansi" },
    { type: "nolopedia", id: "semitone", label: "Semitone" },
    { type: "nolopedia", id: "whole-tone", label: "Whole Tone" },
    { type: "nolopedia", id: "tritone", label: "Tritone" },
    { type: "interval", id: "P5", label: "Perfect Fifth" },
    { type: "interval", id: "P4", label: "Perfect Fourth" },
    { type: "interval", id: "M3", label: "Major Third" },
    { type: "knowledge", id: "history-of-music", label: "Sejarah Musik" },
    {
      type: "knowledge",
      id: "acoustics-of-sound",
      label: "Akustik & Gelombang Suara",
    },
    {
      type: "knowledge",
      id: "chord-and-harmony",
      label: "Teori Chord & Harmoni",
    },
  ],
  relatedArticles: [
    "history-of-music",
    "acoustics-of-sound",
    "chord-and-harmony",
  ],
};
