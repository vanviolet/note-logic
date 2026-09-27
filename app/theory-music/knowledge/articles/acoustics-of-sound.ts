// ════════════════════════════════════════════════════════
// Music Knowledge – Article: Acoustics of Sound
// ════════════════════════════════════════════════════════

import type { KnowledgeArticle } from "../types";

export const ARTICLE_ACOUSTICS_OF_SOUND: KnowledgeArticle = {
  id: "acoustics-of-sound",
  title: "Akustik & Gelombang Suara",
  subtitle: "Bagaimana Suara Bekerja dari Sumber ke Telinga",
  category: "acoustics",
  level: "beginner",
  readingTime: 10,
  description:
    "Pahami fondasi fisika suara — dari getaran, frekuensi, amplitudo, hingga bagaimana telinga manusia menerjemahkan gelombang udara menjadi persepsi musik.",
  heroIcon: "audio-waveform",
  tags: [
    "akustik",
    "gelombang",
    "frekuensi",
    "amplitudo",
    "timbre",
    "resonansi",
    "desibel",
    "telinga",
    "overtone",
  ],

  sections: [
    {
      id: "what-is-sound",
      title: "Apa Itu Suara?",
      content: `Suara adalah **getaran mekanis** yang merambat melalui medium (udara, air, benda padat) sebagai gelombang tekanan.

Ketika senar gitar dipetik:
1. Senar **bergetar** bolak-balik
2. Getaran **menekan** dan **meregangkan** molekul udara di sekitarnya
3. Tekanan ini merambat sebagai **gelombang longitudinal**
4. Gelombang mencapai **telinga** dan menggetarkan gendang telinga
5. Otak menerjemahkan getaran menjadi **persepsi suara**

**Empat properti utama suara:**

| Properti | Fisika | Persepsi |
|----------|--------|----------|
| Frekuensi | Jumlah getaran/detik (Hz) | Pitch (tinggi-rendah) |
| Amplitudo | Besar getaran | Volume (keras-pelan) |
| Waveform | Bentuk gelombang | Timbre (warna suara) |
| Durasi | Panjang gelombang dalam waktu | Panjang nada |

**Kecepatan suara di udara:** ~343 m/s (pada 20°C)
— artinya petir yang terlihat 3 detik sebelum terdengar berjarak ~1 km.`,
      keyTakeaway:
        "Suara bukan properti benda, melainkan gelombang tekanan yang merambat lewat udara. Tanpa medium, tidak ada suara (di luar angkasa = hening total).",
    },
    {
      id: "frequency-and-pitch",
      title: "Frekuensi & Pitch: Mengapa A Berbeda dari C",
      content: `**Frekuensi** (Hertz/Hz) = jumlah siklus getaran per detik.

- Frekuensi **rendah** → nada **bass** (contoh: Open E gitar = 82 Hz)
- Frekuensi **tinggi** → nada **treble** (contoh: E4 = 330 Hz)

**Rentang pendengaran manusia:** ~20 Hz – 20.000 Hz
- Di bawah 20 Hz: infrasonik (bisa "dirasakan" tapi tidak "didengar")
- Di atas 20 kHz: ultrasonik (anjing bisa dengar hingga ~65 kHz)

**Hubungan frekuensi dan pitch:**
- Pitch naik **satu oktaf** = frekuensi **×2**
- A3 = 220 Hz → A4 = 440 Hz → A5 = 880 Hz
- Hubungan ini **logaritmik**: telinga menilai jarak nada berdasarkan rasio, bukan selisih

**Mengapa skala frekuensi logaritmik?**
Telinga manusia merespons perubahan frekuensi secara proporsional. Kenaikan dari 100 Hz ke 200 Hz (×2) terdengar sama dengan kenaikan dari 1000 Hz ke 2000 Hz (×2), meskipun selisih absolutnya 100 Hz vs 1000 Hz.`,
      widget: {
        type: "frequency-table",
        rows: [
          { note: "E", octave: 2, frequency: 82.41, midi: 40 },
          { note: "A", octave: 2, frequency: 110.0, midi: 45 },
          { note: "D", octave: 3, frequency: 146.83, midi: 50 },
          { note: "G", octave: 3, frequency: 196.0, midi: 55 },
          { note: "B", octave: 3, frequency: 246.94, midi: 59 },
          { note: "E", octave: 4, frequency: 329.63, midi: 64 },
          { note: "A", octave: 4, frequency: 440.0, midi: 69 },
          { note: "E", octave: 5, frequency: 659.26, midi: 76 },
          { note: "A", octave: 5, frequency: 880.0, midi: 81 },
          { note: "E", octave: 6, frequency: 1318.51, midi: 88 },
        ],
      },
      keyTakeaway:
        "Telinga kita mendengar pitch secara logaritmik: setiap oktaf = frekuensi ×2. Inilah mengapa 12 semitone yang sama rata (equal temperament) menggunakan rumus eksponensial, bukan linear.",
    },
    {
      id: "amplitude-and-volume",
      title: "Amplitudo & Volume: Desibel Explained",
      content: `**Amplitudo** = besar getaran dari posisi istirahat. Semakin besar amplitudo, semakin keras suara.

**Skala Desibel (dB):**
dB menggunakan skala logaritmik karena telinga merespons tekanan suara secara proporsional.

Rumus: dB = 20 × log₁₀(p/p₀)

di mana p₀ = threshold of hearing (20 μPa).

**Referensi level:**
- **0 dB** — ambang pendengaran (sangat sunyi)
- **30 dB** — perpustakaan, bisikan
- **60 dB** — percakapan normal
- **85 dB** — lalu lintas kota padat (batas aman paparan lama)
- **100 dB** — konser rock
- **120 dB** — ambang nyeri
- **140 dB** — jet take-off (bisa merusak telinga langsung)

**Aturan praktis:**
- Kenaikan **+10 dB** ≈ terasa **2× lebih keras**
- Kenaikan **+3 dB** = daya akustik **×2** (tapi terasa sedikit lebih keras)

**Hearing damage:**
Paparan 85+ dB selama lebih dari 8 jam/hari bisa menyebabkan kerusakan pendengaran permanen. Musisi profesional wajib menggunakan ear protection!`,
      widget: {
        type: "comparison-table",
        headers: ["Level (dB)", "Contoh", "Waktu Aman"],
        rows: [
          ["0", "Ambang pendengaran", "∞"],
          ["30", "Bisikan, perpustakaan", "∞"],
          ["60", "Percakapan normal", "∞"],
          ["70", "Vacuum cleaner", "∞"],
          ["85", "Lalu lintas padat", "8 jam"],
          ["95", "Motorcycle", "47 menit"],
          ["100", "Konser rock", "15 menit"],
          ["110", "Rock concert (di depan speaker)", "2 menit"],
          ["120", "Ambang rasa sakit", "Bahaya!"],
          ["140", "Jet takeoff (dekat)", "Kerusakan langsung"],
        ],
      },
      keyTakeaway:
        "Volume mengikuti skala logaritmik (dB). Paparan di atas 85 dB dalam waktu lama bisa merusak pendengaran secara permanen — musisi HARUS pakai earplug!",
    },
    {
      id: "timbre",
      title: "Timbre: Mengapa Gitar Tidak Terdengar Seperti Piano",
      content: `Gitar dan piano bisa memainkan nada A4 (440 Hz) yang sama, tapi suaranya berbeda. Perbedaan ini disebut **timbre** (warna suara).

**Apa yang menentukan timbre?**
Setiap instrumen menghasilkan **campuran harmonik** yang berbeda:

- **Gitar nylon**: harmonik genap dan ganjil seimbang; attack empuk
- **Piano**: harmonik sangat kaya; attack tajam lalu sustain panjang
- **Flute**: hampir hanya fundamental (sinus murni); harmonik sangat lemah  
- **Oboe**: harmonik ganjil kuat; suara "nasal"
- **Violin**: harmonik kuat sampai ke-10+; bowing menciptakan variasi

**Komponen timbre:**
1. **Spectral content** — harmonik mana saja yang hadir dan seberapa kuat
2. **Attack** — bagaimana suara dimulai (tajam vs empuk)
3. **Sustain & decay** — bagaimana suara berkembang dan pudar
4. **Formant** — puncak frekuensi khas instrumen/suara manusia

**Digital synthesis** memanfaatkan pemahaman ini:
- **Additive synthesis**: menjumlahkan gelombang sinus individual
- **Subtractive synthesis**: memulai dari gelombang kaya harmonik, lalu menyaring
- **FM synthesis**: menggunakan satu gelombang untuk memodulasi frekuensi gelombang lain
- **Sampling**: merekam dan memutar ulang suara instrumen asli`,
      keyTakeaway:
        "Timbre ditentukan oleh campuran harmonik yang unik untuk setiap instrumen. Synthesizer meniru ini dengan memanipulasi harmonik secara matematis.",
    },
    {
      id: "resonance",
      title: "Resonansi: Mengapa Gitar Punya Body",
      content: `**Resonansi** terjadi ketika suatu benda bergetar secara simpatik pada frekuensi naturalnya.

**Contoh dalam musik:**
- **Body gitar** meresonansikan getaran senar, memperbesar volume
- **Senar simpatik** pada sitar bergetar tanpa dipetik saat senar lain dimainkan
- **Pedal sustain piano** — melepas damper sehingga semua senar bisa beresonansi
- **Vokal overtone singing** — penyanyi memperkuat harmonik tertentu menggunakan rongga mulut sebagai resonator

**Resonansi ruangan:**
Setiap ruangan punya frekuensi resonansi berdasarkan dimensinya:
- **Standing waves** terbentuk di ruangan kotak
- **Room modes** bisa memperkuat atau melemahkan frekuensi tertentu
- Studios rekaman professional didesain untuk meminimalkan efek ini

**Fun fact:**
Nikola Tesla pernah berkata bahwa resonansi bisa menghancurkan jembatan — dan ini benar! Jembatan Tacoma Narrows (1940) runtuh karena resonansi angin sesuai frekuensi naturalnya.`,
      widget: {
        type: "quiz",
        questions: [
          {
            question: "Timbre ditentukan terutama oleh:",
            options: [
              "Frekuensi fundamental saja",
              "Amplitudo nada",
              "Campuran harmonik yang unik",
              "Durasi nada",
            ],
            correctIndex: 2,
            explanation:
              "Timbre ditentukan oleh campuran harmonik (overtone) yang berbeda untuk setiap instrumen, plus karakteristik attack/decay.",
          },
          {
            question: "Rentang pendengaran manusia normal adalah:",
            options: [
              "1 Hz – 100 Hz",
              "20 Hz – 20.000 Hz",
              "100 Hz – 10.000 Hz",
              "440 Hz – 880 Hz",
            ],
            correctIndex: 1,
            explanation:
              "Telinga manusia bisa mendengar frekuensi antara ~20 Hz (sangat rendah) hingga ~20.000 Hz (sangat tinggi). Kemampuan ini menurun seiring usia.",
          },
          {
            question: "Kenaikan 10 dB terasa berapa kali lebih keras?",
            options: [
              "1.5× lebih keras",
              "2× lebih keras",
              "5× lebih keras",
              "10× lebih keras",
            ],
            correctIndex: 1,
            explanation:
              "Secara persepsi, kenaikan ~10 dB terasa sekitar 2× lebih keras. Namun secara energi akustik, 10 dB = daya ×10.",
          },
        ],
      },
      keyTakeaway:
        "Resonansi adalah fenomena fisik yang menjelaskan mengapa instrumen akustik membutuhkan body/ruang — ia memperkuat suara secara alami tanpa listrik.",
    },
  ],

  crossRefs: [
    { type: "knowledge", id: "math-of-music", label: "Matematika dalam Musik" },
    {
      type: "knowledge",
      id: "psychology-of-music",
      label: "Psikologi Musik",
    },
    { type: "nolopedia", id: "semitone", label: "Semitone" },
    { type: "nolopedia", id: "interval", label: "Interval" },
    { type: "interval", id: "P5", label: "Perfect Fifth" },
    { type: "interval", id: "P8", label: "Octave" },
  ],
  relatedArticles: ["math-of-music", "psychology-of-music"],
};
