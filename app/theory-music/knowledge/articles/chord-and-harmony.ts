// ════════════════════════════════════════════════════════
// Music Knowledge – Article: Chord & Harmony
// ════════════════════════════════════════════════════════

import type { KnowledgeArticle } from "../types";

export const ARTICLE_CHORD_AND_HARMONY: KnowledgeArticle = {
  id: "chord-and-harmony",
  title: "Teori Chord & Harmoni",
  subtitle: "Dari Triad Sederhana hingga Progresi Kompleks",
  category: "math-and-science",
  level: "beginner",
  readingTime: 14,
  description:
    "Pelajari bagaimana chord dibangun dari interval, jenis-jenis triad dan seventh chord, angka Romawi, progresi chord populer, dan prinsip voice leading yang membuat harmoni mengalir natural.",
  heroIcon: "layers",
  tags: [
    "chord",
    "harmoni",
    "triad",
    "seventh",
    "progresi",
    "voice leading",
    "roman numeral",
    "cadence",
    "diatonic",
    "substitusi",
  ],

  sections: [
    {
      id: "what-is-a-chord",
      title: "Apa Itu Chord?",
      content: `**Chord** adalah dua atau lebih nada yang berbunyi bersamaan. Dalam praktik musik Barat, chord biasanya terdiri dari minimal **3 nada** yang disusun secara **tertian** — artinya dibangun dari interval third yang ditumpuk.

**Anatomi chord dasar (triad):**
- **Root** — nada dasar yang menentukan nama chord
- **Third** — menentukan kualitas major/minor
- **Fifth** — memberikan stabilitas dan "body"

**Contoh:** Chord C Major
- Root = C
- Third = E (major third, 4 semitone dari C)
- Fifth = G (perfect fifth, 7 semitone dari C)

**Mengapa chord terdengar harmonis?**
Kembali ke deret harmonik — nada-nada dalam triad major (root, M3, P5) muncul secara natural di 6 harmonik pertama. Otak kita sudah "terprogram" untuk mengenali pola ini sebagai konsonan.

**Empat kualitas triad dasar:**

| Triad | Rumus | Interval | Contoh | Karakter |
|-------|-------|----------|--------|----------|
| Major | 1 – 3 – 5 | M3 + m3 | C-E-G | Cerah, stabil |
| Minor | 1 – b3 – 5 | m3 + M3 | C-Eb-G | Gelap, emosional |
| Diminished | 1 – b3 – b5 | m3 + m3 | C-Eb-Gb | Tegang, tidak stabil |
| Augmented | 1 – 3 – #5 | M3 + M3 | C-E-G# | Misterius, mengambang |

Dari 4 jenis triad ini, hampir seluruh harmoni musik Barat dibangun.`,
      widget: {
        type: "comparison-table",
        headers: ["Triad", "Interval Stack", "Semitone", "Contoh", "Karakter"],
        rows: [
          ["Major", "M3 + m3", "4 + 3 = 7", "C-E-G", "Cerah, stabil, kuat"],
          ["Minor", "m3 + M3", "3 + 4 = 7", "C-Eb-G", "Gelap, melankolis"],
          [
            "Diminished",
            "m3 + m3",
            "3 + 3 = 6",
            "C-Eb-Gb",
            "Tegang, ingin resolve",
          ],
          [
            "Augmented",
            "M3 + M3",
            "4 + 4 = 8",
            "C-E-G#",
            "Mengambang, dreamlike",
          ],
        ],
      },
      keyTakeaway:
        "Chord dibangun dari tumpukan interval third. Perbedaan kecil antara major third dan minor third mengubah karakter sebuah chord secara dramatis.",
    },
    {
      id: "seventh-chords",
      title: "Seventh Chords: Warna Ekstra",
      content: `Menambahkan satu nada lagi di atas triad — nada **seventh** — menghasilkan chord 4 nada yang lebih kaya dan ekspresif.

**Mengapa seventh penting?**
- Menambah **tension** yang ingin resolve
- Memberikan **warna** harmonik lebih kaya
- Esensial untuk jazz, blues, pop modern
- Dominant seventh (V7) adalah chord paling penting dalam cadence

**Jenis-jenis seventh chord:**

| Nama | Simbol | Rumus | Contoh | Konteks |
|------|--------|-------|--------|---------|
| Major 7th | Cmaj7 | 1–3–5–7 | C-E-G-B | Jazz, bossa nova; elegan |
| Dominant 7th | C7 | 1–3–5–b7 | C-E-G-Bb | Blues, rock; butuh resolusi |
| Minor 7th | Cm7 | 1–b3–5–b7 | C-Eb-G-Bb | Jazz, soul; smooth |
| Half-Dim 7th | Cm7b5 | 1–b3–b5–b7 | C-Eb-Gb-Bb | Jazz ii-V-I minor |
| Diminished 7th | Cdim7 | 1–b3–b5–bb7 | C-Eb-Gb-Bbb(A) | Dramatic, classical |
| Minor-Major 7th | CmM7 | 1–b3–5–7 | C-Eb-G-B | Misterius, film noir |

**Dominant 7th — chord terpenting:**
Chord V7 (misalnya G7 di key C) mengandung **tritone** antara third dan seventh (B dan F). Tritone ini menciptakan tension yang sangat kuat dan "menarik" resolusi ke chord I.

Tritone B-F dalam G7 resolve ke:
- B naik ke C (root dari C)
- F turun ke E (third dari C)

Inilah mengapa V7 → I terasa begitu memuaskan — tension tritone terselesaikan.

**Beyond seventh — extended chords:**
- **9th** = seventh + nada ke-9 (C9 = C-E-G-Bb-D)
- **11th** = ninth + nada ke-11 (C11 = C-E-G-Bb-D-F)
- **13th** = eleventh + nada ke-13 (C13 = C-E-G-Bb-D-F-A)

Extended chords umum di jazz dan neo-soul — memberikan warna yang sangat kaya dan sophisticated.`,
      widget: {
        type: "comparison-table",
        headers: [
          "Seventh Chord",
          "Simbol",
          "Rumus",
          "Interval Stack",
          "Karakter",
        ],
        rows: [
          ["Major 7th", "Cmaj7", "1-3-5-7", "M3+m3+M3", "Elegan, dreamy"],
          [
            "Dominant 7th",
            "C7",
            "1-3-5-b7",
            "M3+m3+m3",
            "Bluesy, butuh resolve",
          ],
          ["Minor 7th", "Cm7", "1-b3-5-b7", "m3+M3+m3", "Smooth, relaxed"],
          [
            "Half-Diminished",
            "Cm7b5",
            "1-b3-b5-b7",
            "m3+m3+M3",
            "Gelap, jazzy",
          ],
          [
            "Diminished 7th",
            "Cdim7",
            "1-b3-b5-bb7",
            "m3+m3+m3",
            "Dramatic, simetris",
          ],
          [
            "Minor-Major 7th",
            "CmM7",
            "1-b3-5-7",
            "m3+M3+M3",
            "Misterius, langka",
          ],
        ],
      },
      keyTakeaway:
        "Dominant seventh chord mengandung tritone yang menciptakan tension kuat dan menuntut resolusi ke chord I — ini adalah mesin penggerak utama harmoni tonal.",
    },
    {
      id: "roman-numeral-analysis",
      title: "Angka Romawi: Bahasa Universal Harmoni",
      content: `**Roman Numeral Analysis** adalah sistem notasi yang menunjukkan fungsi setiap chord dalam sebuah key, bukan nama spesifiknya. Ini memungkinkan kita menganalisis dan mentranspos progresi chord ke key manapun.

**Cara kerja:**
Setiap chord diatonic diberi nomor berdasarkan posisi root-nya di skala:

**Key C Major:**

| Derajat | Chord | Romawi | Fungsi |
|---------|-------|--------|--------|
| 1 | C | I | Tonic (rumah) |
| 2 | Dm | ii | Supertonic (bridge) |
| 3 | Em | iii | Mediant (tonic substitute) |
| 4 | F | IV | Subdominant (away) |
| 5 | G | V | Dominant (tension) |
| 6 | Am | vi | Submediant (tonic substitute) |
| 7 | Bdim | vii° | Leading-tone (strong pull to I) |

**Konvensi penulisan:**
- **Huruf besar** (I, IV, V) = chord major
- **Huruf kecil** (ii, iii, vi) = chord minor
- **Huruf kecil + °** (vii°) = chord diminished
- **7 di sebelah** (V7, ii7) = seventh chord

**Tiga fungsi harmoni utama:**
1. **Tonic** (I, vi, iii) — "rumah", stabil, rasa selesai
2. **Subdominant** (IV, ii) — "pergi", bergerak menjauhi rumah
3. **Dominant** (V, vii°) — "tension", ingin kembali ke rumah

**Mengapa ini berguna?**
Dengan roman numeral, progresi I-V-vi-IV berlaku di SEMUA key:
- Key C: C – G – Am – F
- Key G: G – D – Em – C
- Key E: E – B – C#m – A

Musikolog, session musician, dan arranger selalu berpikir dalam angka romawi — bukan nama chord spesifik.`,
      widget: {
        type: "comparison-table",
        headers: ["Derajat", "Major Key", "Minor Key", "Fungsi Utama"],
        rows: [
          ["I / i", "Major", "Minor", "Tonic — pusat gravitasi"],
          ["ii / ii°", "Minor", "Diminished", "Subdominant — pre-dominant"],
          ["III / iii", "Minor", "Major", "Mediant — tonic substitute"],
          ["IV / iv", "Major", "Minor", "Subdominant"],
          [
            "V / v",
            "Major",
            "Minor (atau Major lewat harmonic minor)",
            "Dominant — tension",
          ],
          ["VI / vi", "Minor", "Major", "Submediant — tonic substitute"],
          ["vii° / VII", "Diminished", "Major", "Leading-tone / subtonic"],
        ],
      },
      keyTakeaway:
        "Roman numeral analysis memungkinkan kita memahami FUNGSI chord (tonic/subdominant/dominant) secara universal — terlepas dari key spesifik.",
    },
    {
      id: "chord-progressions",
      title: "Progresi Chord Populer: Sekuens yang Menggerakkan Musik",
      content: `**Progresi chord** adalah urutan chord yang membentuk harmoni sebuah lagu. Beberapa progresi digunakan berulang kali karena efek emosional yang kuat.

**Progresi paling populer sepanjang masa:**

**1. I – V – vi – IV (The "Pop Progression")**
Digunakan di ratusan hit:
- "Let It Be" (Beatles)
- "No Woman No Cry" (Bob Marley)
- "Someone Like You" (Adele)
- "With or Without You" (U2)

Mengapa berhasil? Pergerakan I → V menciptakan momentum, vi memberikan kejutan emosional (minor setelah major), IV membawa kembali ke rasa "pulang".

**2. I – IV – V – I (The Classic)**
Progresi tertua dan paling fundamental:
- Blues 12-bar menggunakan variasi ini
- Rock 'n' roll klasik
- Musik country dan folk

**3. ii – V – I (Jazz Standard)**
Progresi paling penting dalam jazz:
- Dm7 – G7 – Cmaj7 (di key C)
- Motion by fifths: ii → V → I, masing-masing turun perfect fifth
- Hampir setiap jazz standard mengandung ii-V-I (atau variasinya)

**4. vi – IV – I – V (The Emotional)**
Dimulai dari minor — langsung emosional:
- "Numb" (Linkin Park)
- "Africa" (Toto)
- "Despacito" (Luis Fonsi)

**5. I – vi – IV – V (50s Progression / Doo-Wop)**
Nostalgia quintessential:
- "Stand By Me" (Ben E. King)
- "Every Breath You Take" (The Police)

**6. i – bVII – bVI – V (Andalusian Cadence)**
Exotic dan dramatic:
- "Hit the Road Jack" (Ray Charles)
- Flamenco, metal, dan soundtrack film

**Mengapa progresi ini berulang?**
Karena fundamental harmoni tonal: **tension and resolution**. V ingin pulang ke I, IV ingin bergerak ke V, ii mempersiapkan V. Musik adalah perjalanan "pergi" dan "pulang".`,
      widget: {
        type: "comparison-table",
        headers: ["Progresi", "Nama", "Genre", "Contoh Lagu"],
        rows: [
          [
            "I-V-vi-IV",
            "Pop Progression",
            "Pop/Rock",
            "Let It Be, Someone Like You",
          ],
          [
            "I-IV-V-I",
            "Classic/Blues",
            "Blues/Rock/Country",
            "Twist and Shout, La Bamba",
          ],
          [
            "ii-V-I",
            "Jazz Standard",
            "Jazz/Bossa",
            "Autumn Leaves, Fly Me to the Moon",
          ],
          ["vi-IV-I-V", "Emotional", "Pop/Rock", "Numb, Africa, Despacito"],
          [
            "I-vi-IV-V",
            "50s Doo-Wop",
            "Oldies/Pop",
            "Stand By Me, Every Breath You Take",
          ],
          [
            "i-bVII-bVI-V",
            "Andalusian",
            "Flamenco/Metal",
            "Hit the Road Jack, Stairway to Heaven (intro)",
          ],
          [
            "I-bVII-IV-I",
            "Mixolydian",
            "Rock/Anthemic",
            "Sweet Home Alabama, Hey Jude (coda)",
          ],
        ],
      },
      keyTakeaway:
        "Sebagian besar lagu populer menggunakan variasi dari beberapa progresi chord yang sama. Perbedaannya ada di melodi, ritme, timbre, dan lirik — bukan harmoni.",
    },
    {
      id: "voice-leading",
      title: "Voice Leading: Seni Pergerakan Halus",
      content: `**Voice leading** (atau part writing) adalah prinsip bagaimana nada-nada dalam chord bergerak ke nada-nada chord berikutnya dengan cara yang **sehalus mungkin**.

**Prinsip utama voice leading:**
1. **Common tones** — pertahankan nada yang sama antara dua chord (jangan pindahkan tanpa alasan)
2. **Stepwise motion** — gerakkan nada ke nada terdekat (step, bukan lompatan)
3. **Contrary motion** — jika bass turun, soprano idealnya naik (dan sebaliknya)
4. **Avoid parallel fifths/octaves** — aturan klasik untuk menjaga independensi suara

**Contoh: C → G (I → V) dengan voice leading baik:**
- C (root) → B (third dari G) — turun half step
- E (third) → D (fifth dari G) — turun step
- G (fifth) → G (root dari G) — common tone, stay!

**Mengapa voice leading penting?**
- Membuat transisi antar-chord terasa **smooth dan natural**
- Mencegah "lompatan" canggung yang mengejutkan telinga
- Di paduan suara/orkestra, setiap penyanyi punya bagian yang "nyanyiable"
- Di piano/gitar, inversions memungkinkan voice leading yang baik tanpa loncat-loncat posisi

**Inversions dan voice leading:**
Chord inversions ada supaya kita bisa pilih nada bass yang menghasilkan gerakan paling smooth:
- C/E (first inversion) — E di bass
- C/G (second inversion) — G di bass
- Memilih inversion yang tepat = voice leading yang baik + bass line yang melodis

**Pro tip:**
Komposer dan arranger tingkat tinggi selalu berpikir "horizontal" (gerakan setiap suara) sekaligus "vertikal" (chord yang terbentuk). Ini adalah seni menyeimbangkan melodi individual dengan harmoni keseluruhan.`,
      keyTakeaway:
        "Voice leading yang baik membuat harmoni mengalir natural — kuncinya adalah gerakkan setiap nada sehalus mungkin ke nada terdekat, pertahankan common tones.",
    },
    {
      id: "harmony-quiz",
      title: "Uji Pengetahuan: Chord & Harmoni",
      content:
        "Saatnya menguji pemahaman kamu tentang teori chord dan harmoni! Jawab pertanyaan berikut:",
      widget: {
        type: "quiz",
        questions: [
          {
            question: "Triad major dibangun dari interval:",
            options: ["m3 + m3", "M3 + m3", "M3 + M3", "m3 + M3"],
            correctIndex: 1,
            explanation:
              "Triad major = major third (4 semitone) + minor third (3 semitone). Contoh: C-E (M3) + E-G (m3) = C major.",
          },
          {
            question: "Chord V7 menciptakan tension kuat karena mengandung:",
            options: [
              "Dua oktaf",
              "Tritone antara third dan seventh",
              "Perfect fifth",
              "Minor second",
            ],
            correctIndex: 1,
            explanation:
              "Dominant seventh (V7) mengandung tritone — interval paling tidak stabil — yang 'menarik' resolusi ke chord I.",
          },
          {
            question: "Progresi ii-V-I paling umum digunakan di genre:",
            options: ["Metal", "Jazz", "Punk", "EDM"],
            correctIndex: 1,
            explanation:
              "ii-V-I adalah progresi paling fundamental di jazz — hampir setiap jazz standard mengandung progresi ini.",
          },
          {
            question:
              "Dalam Roman Numeral, huruf kecil (ii, iii, vi) menunjukkan:",
            options: [
              "Chord major",
              "Chord minor",
              "Chord diminished",
              "Chord augmented",
            ],
            correctIndex: 1,
            explanation:
              "Huruf kecil = chord minor, huruf besar = chord major. Contoh: ii = minor triad on scale degree 2.",
          },
          {
            question: "Prinsip utama voice leading adalah:",
            options: [
              "Selalu loncat ke nada tertinggi",
              "Gerakkan nada sehalus mungkin ke nada terdekat",
              "Selalu mainkan root position",
              "Semua suara bergerak ke arah yang sama",
            ],
            correctIndex: 1,
            explanation:
              "Voice leading yang baik = gerakan minimal: pertahankan common tones, gunakan stepwise motion, dan hindari lompatan besar.",
          },
        ],
      },
    },
  ],

  crossRefs: [
    {
      type: "knowledge",
      id: "math-of-music",
      label: "Matematika dalam Musik",
    },
    {
      type: "knowledge",
      id: "history-of-music",
      label: "Sejarah Musik Barat",
    },
    {
      type: "knowledge",
      id: "psychology-of-music",
      label: "Psikologi Musik (Tension & Resolution)",
    },
    { type: "nolopedia", id: "interval", label: "Interval (Nolopedia)" },
    { type: "nolopedia", id: "consonance", label: "Konsonansi" },
    { type: "nolopedia", id: "dissonance", label: "Disonansi" },
    { type: "nolopedia", id: "tritone", label: "Tritone" },
    { type: "interval", id: "M3", label: "Major Third" },
    { type: "interval", id: "m3", label: "Minor Third" },
    { type: "interval", id: "P5", label: "Perfect Fifth" },
    { type: "chord", id: "chord", label: "Chord Explorer" },
    { type: "family", id: "family", label: "Harmonic Family" },
  ],
  relatedArticles: [
    "math-of-music",
    "history-of-music",
    "psychology-of-music",
    "rhythm-and-meter",
  ],
};
