// ════════════════════════════════════════════════════════
// Music Knowledge – Article: Psychology of Music
// ════════════════════════════════════════════════════════

import type { KnowledgeArticle } from "../types";

export const ARTICLE_PSYCHOLOGY_OF_MUSIC: KnowledgeArticle = {
  id: "psychology-of-music",
  title: "Psikologi Musik",
  subtitle: "Mengapa Musik Menggerakkan Emosi dan Otak",
  category: "psychology",
  level: "beginner",
  readingTime: 11,
  description:
    "Eksplorasi ilmiah mengapa musik bisa membuat kita menangis, semangat, atau merinding — dari neuroscience, efek dopamin, hingga fenomena musik yang 'terdengar sedih'.",
  heroIcon: "brain",
  tags: [
    "psikologi",
    "otak",
    "emosi",
    "dopamin",
    "major",
    "minor",
    "frisson",
    "mozart effect",
    "terapi musik",
    "neuroplastisitas",
  ],

  sections: [
    {
      id: "music-and-brain",
      title: "Musik & Otak: Seluruh Otak Bekerja",
      content: `Musik adalah salah satu sedikit aktivitas yang mengaktifkan **hampir seluruh bagian otak** secara bersamaan:

**Area otak yang aktif saat mendengar musik:**
- **Auditory cortex** (temporal lobe) — memproses pitch, timbre, ritme
- **Motor cortex** — menyinkronkan gerakan (kenapa kita mengetuk kaki ikut irama)
- **Prefrontal cortex** — menganalisis struktur dan ekspektasi
- **Limbic system (amygdala, hippocampus)** — respons emosional dan memori
- **Cerebellum** — timing dan koordinasi ritmis
- **Corpus callosum** — komunikasi antar belahan otak (terutama pada musisi terlatih)

**Musisi vs Non-Musisi:**
Riset menunjukkan otak musisi memiliki:
- Corpus callosum lebih tebal (komunikasi otak kiri-kanan lebih cepat)
- Gray matter lebih banyak di area motorik dan auditori
- Working memory lebih kuat

**Neuroplastisitas:**
Belajar musik secara aktif melatih otak untuk "rewiring" jalur neural — inilah mengapa latihan musik pada anak-anak terkait dengan peningkatan kemampuan matematika, bahasa, dan spatial reasoning.`,
      keyTakeaway:
        "Musik adalah workout terlengkap untuk otak — tidak ada aktivitas lain yang mengaktifkan sebanyak itu area otak secara bersamaan.",
    },
    {
      id: "emotion-tension-resolution",
      title: "Emosi: Tension & Resolution",
      content: `Mengapa musik tertentu membuat kita merinding, sedih, atau gembira? Jawabannya: **expectation dan violation**.

**Teori Utama — Huron's ITPRA:**
1. **Imagination** — kita membayangkan apa yang akan terjadi
2. **Tension** — anticipation terbangun (chord dominant → kita "tahu" resolusi akan datang)
3. **Prediction** — otak memprediksi nada/chord selanjutnya
4. **Reaction** — respons cepat saat sound tiba
5. **Appraisal** — evaluasi sadar: terkejut? puas? kecewa?

**Dopamin & Chills:**
- Penelitian dari McGill University (2011) membuktikan bahwa musik memicu pelepasan **dopamin** — neurotransmitter "hadiah" yang sama dengan makanan, seks, dan drugs
- Dopamin dilepaskan dua kali: saat **anticipation** (menjelang bagian favorit) DAN saat **peak** (klimaks musik)
- Fenomena **"frisson"** (merinding) terjadi ketika resolusi melanggar atau melampaui prediksi kita

**Contoh dalam harmoni:**
- V → I (authentic cadence) — prediksi terpenuhi → rasa puas
- V → vi (deceptive cadence) — prediksi dilanggar → terkejut!
- ♭VII → I (Picardy third, modal mixolydian) — resolusi tak terduga → "epic" feeling`,
      widget: {
        type: "comparison-table",
        headers: ["Progression", "Nama", "Efek Emosional"],
        rows: [
          ["V → I", "Authentic Cadence", "Puas, selesai, stabil"],
          ["V → vi", "Deceptive Cadence", "Terkejut, melankolis"],
          ["IV → I", "Plagal Cadence", "Tenang, 'amen'"],
          ["iv → I", "Minor Plagal", "Bittersweet, nostalgia"],
          ["V → ?", "Half Cadence", "Menggantung, tegang"],
          [
            "I → ♭VII → IV → I",
            "Mixolydian Cadence",
            "Epic, anthemic (musik rock)",
          ],
          [
            "i → VII → VI → V",
            "Andalusian Cadence",
            "Eksotis, misterius, flamenco",
          ],
        ],
      },
      keyTakeaway:
        "Emosi dalam musik datang dari permainan antara prediksi dan kejutan. Chord progression yang 'terasa benar' memuaskan karena otak berhasil memprediksi resolusi.",
    },
    {
      id: "listen-cadences",
      title: "Dengarkan: Cadence dalam Aksi",
      content: `Tekan **Play** untuk mendengar perbedaan dua cadence dalam progresi **4 bar penuh**.

Kedua bagian menggunakan progresi **I–vi–IV–V** yang identik selama 3 bar pertama, lalu berakhir berbeda:
- **Authentic Cadence** (V → I) — terasa puas, selesai, dan stabil
- **Deceptive Cadence** (V → vi) — terasa mengejutkan dan melankolis

Perhatikan bagaimana **satu chord terakhir** mengubah seluruh karakter emosional progresi meskipun 75% identik.`,
      widget: {
        type: "alphatex-player",
        title: "Authentic vs Deceptive Cadence (Full Progression)",
        tex: `\\title "Tension & Resolution"
\\subtitle "Authentic vs Deceptive Cadence"
\\tempo 72
\\ts 4 4
\\chord "C" 0 1 0 2 3 x
\\chord "F" 1 1 2 3 3 x
\\chord "G" 3 0 0 0 2 3
\\chord "Am" 0 1 2 2 0 x
\\track "Guitar" "Gtr."
  \\staff{score tabs} \\tuning (E4 B3 G3 D3 A2 E2) \\instrument acousticguitarsteel
\\section "A" "Authentic (V - I)"
:2 (0.1 1.2 0.3 2.4 3.5){ch "C" bd} (1.1 1.2 2.3 3.4 3.5){ch "F" bd} | (0.1 1.2 2.3 2.4 0.5){ch "Am" bd} (3.1 0.2 0.3 0.4 2.5 3.6){ch "G" bd} |
(0.1 1.2 0.3 2.4 3.5){ch "C" bd} (1.1 1.2 2.3 3.4 3.5){ch "F" bd} | (3.1 0.2 0.3 0.4 2.5 3.6){ch "G" bd} (0.1 1.2 0.3 2.4 3.5){ch "C" bd} |
r.1 |
\\section "B" "Deceptive (V - vi)"
:2 (0.1 1.2 0.3 2.4 3.5){ch "C" bd} (1.1 1.2 2.3 3.4 3.5){ch "F" bd} | (0.1 1.2 2.3 2.4 0.5){ch "Am" bd} (3.1 0.2 0.3 0.4 2.5 3.6){ch "G" bd} |
(0.1 1.2 0.3 2.4 3.5){ch "C" bd} (1.1 1.2 2.3 3.4 3.5){ch "F" bd} | (3.1 0.2 0.3 0.4 2.5 3.6){ch "G" bd} (0.1 1.2 2.3 2.4 0.5){ch "Am" bd} |`,
        description:
          "Progresi I–vi–IV–V masing-masing 4 bar. Authentic: resolusi ke I (C). Deceptive: kejutan ke vi (Am). 75% identik — hanya 1 chord berbeda.",
      },
      keyTakeaway:
        "Satu chord berbeda di akhir progresi bisa mengubah seluruh emosi — dari rasa puas menjadi kejutan melankolis.",
    },
    {
      id: "major-vs-minor",
      title: "Major vs Minor: Mengapa Minor Terdengar 'Sedih'?",
      content: `Persepsi bahwa major = happy dan minor = sad bukan universal, tetapi sangat kuat di budaya Barat. Beberapa teori:

**1. Spectral Theory (Bowling et al., 2010):**
- Analisis spectral menunjukkan bahwa **suara bicara sedih** memiliki pola interval mirip **minor third** (frekuensi F0 yang menurun)
- Suara bicara gembira memiliki pola mirip **major third**
- Otak secara tidak sadar menghubungkan minor = sedih karena asosiasi dengan suara manusia

**2. Cultural Conditioning:**
- Di budaya Barat, minor key digunakan untuk lagu sedih selama berabad-abad → asosiasi menjadi otomatis
- Di beberapa tradisi musik (Balkan, Middle Eastern), minor modes justru digunakan untuk perayaan!
- Riset pada anak-anak menunjukkan bahwa asosiasi major-happy/minor-sad **baru muncul sekitar usia 6-8 tahun** (bukan bawaan lahir)

**3. Acoustic Roughness:**
- Minor third (316 cents) sedikit lebih "rough" daripada major third (386 cents)
- Roughness ini menimbulkan sensasi **tension** yang lebih tinggi

**Yang lebih penting dari major/minor:**
- **Tempo** — fast = upbeat, slow = sad (lebih berpengaruh dari mode!)
- **Register** — nada tinggi = ringan/ceria, rendah = gelap/serius
- **Rhythm** — syncopation = energi, straight = formal
- **Dynamics** — loud = intense, soft = intimate`,
      widget: {
        type: "quiz",
        questions: [
          {
            question: "Dopamin saat mendengar musik dilepaskan pada:",
            options: [
              "Hanya saat klimaks musik",
              "Hanya saat awal lagu",
              "Saat anticipation DAN saat klimaks",
              "Tidak ada pelepasan dopamin saat mendengar musik",
            ],
            correctIndex: 2,
            explanation:
              "Riset McGill (2011) menunjukkan pelepasan dopamin terjadi dua kali: saat anticipation (sebelum bagian favorit) DAN saat peak/klimaks.",
          },
          {
            question:
              "Asosiasi minor = sedih pada anak-anak mulai muncul di usia:",
            options: ["Lahir", "2-3 tahun", "6-8 tahun", "12+ tahun"],
            correctIndex: 2,
            explanation:
              "Riset cross-cultural menunjukkan bahwa asosiasi emotif major-minor bukan bawaan tetapi dipelajari, muncul stabil sekitar usia 6-8 tahun.",
          },
          {
            question: "Yang paling berpengaruh terhadap persepsi emosi musik:",
            options: [
              "Major vs minor saja",
              "Tempo (cepat/lambat)",
              "Hanya volume",
              "Jumlah instrumen",
            ],
            correctIndex: 1,
            explanation:
              "Meskipun mode penting, riset menunjukkan tempo memiliki pengaruh lebih besar terhadap persepsi emosi daripada major/minor saja.",
          },
        ],
      },
      keyTakeaway:
        "Major = happy dan minor = sad BUKAN universal — ini sebagian besar dipelajari secara kultural. Tempo seringkali lebih menentukan emosi daripada mode.",
    },
    {
      id: "listen-major-minor",
      title: "Dengarkan: Major vs Minor",
      content: `Melodi **8 bar** dimainkan dua kali — pertama dalam **C Major**, lalu dalam **C Minor**.

Perhatikan bagaimana menurunkan nada ketiga (E → E♭) dan keenam (A → A♭) mengubah karakter keseluruhan dari **ceria** menjadi **melankolis**, meskipun kontur melodinya sama persis.

Ini mendemonstrasikan kekuatan **interval third** (major vs minor) dalam membentuk persepsi emosi musik kita — hanya 2 nada berubah dari total 7, tapi dampak emosionalnya drastis.`,
      widget: {
        type: "alphatex-player",
        title: "Major vs Minor: Melodi 8 Bar",
        tex: `\\title "Major vs Minor"
\\subtitle "Melodi Sama, Nuansa Berbeda"
\\tempo 88
\\ts 4 4
\\track "Guitar" "Gtr."
  \\staff{score tabs} \\tuning (E4 B3 G3 D3 A2 E2) \\instrument acousticguitarsteel
\\section "A" "C Major"
:4 1.2 0.1 3.1 0.1 | 1.1 0.1 3.2 1.2 | :2 0.1 :4 3.2 1.2 | :2 1.2 3.2 |
:4 0.1 3.1 5.1 3.1 | 1.1 3.1 0.1 3.2 | :2 0.1 :4 3.2 1.2 | :1 1.2 |
r.1 |
\\section "B" "C Minor"
:4 1.2 4.2 3.1 4.2 | 1.1 4.2 3.2 1.2 | :2 4.2 :4 3.2 1.2 | :2 1.2 3.2 |
:4 4.2 3.1 4.1 3.1 | 1.1 3.1 4.2 3.2 | :2 4.2 :4 3.2 1.2 | :1 1.2 |`,
        description:
          "Melodi 8 bar identik dimainkan dalam C Major lalu C Minor. E→E♭ dan A→A♭ mengubah seluruh karakter emosional.",
      },
      keyTakeaway:
        "Perubahan antara major dan minor hanyalah satu interval — major third vs minor third — tetapi dampak emosionalnya sangat besar.",
    },
    {
      id: "mozart-effect",
      title: "Mozart Effect & Mitos Populer",
      content: `**Mozart Effect** — mitos paling viral di psikologi musik:

**Fakta:** Pada 1993, Rauscher et al. mempublikasikan bahwa mahasiswa yang mendengar sonata Mozart K.448 mengalami peningkatan skor tugas spatial-temporal selama ~10-15 menit.

**Distorsi media:** "Mendengar Mozart membuat bayi lebih pintar!" → banyak negara bagian AS mendistribusikan CD klasik ke rumah sakit!

**Realitas:**
- Efek sangat kecil dan sementara (~10 menit)
- Bisa digantikan oleh audio APAPUN yang menyenangkan (bahkan Stephen King audiobook!)
- Yang sebenarnya terjadi: stimulasi → arousal → sedikit peningkatan kognitif sementara
- **Bukan** efek spesifik Mozart atau musik klasik

**Yang BENAR tentang musik dan kognisi:**
- **Belajar MEMAINKAN musik** (bukan hanya mendengar) benar-benar meningkatkan kognitif
- Latihan musik selama minimum 1-2 tahun terkait peningkatan:
  - Working memory
  - Kemampuan bahasa
  - Impulse control
  - Mathematical reasoning
- **Musik sebagai terapi** (music therapy) efektif untuk: stroke recovery, Parkinson, Alzheimer, PTSD, depresi`,
      keyTakeaway:
        "Mozart Effect adalah mitos yang dilebih-lebihkan. Yang benar-benar meningkatkan kognisi adalah BELAJAR MEMAINKAN musik secara aktif — bukan hanya mendengar.",
    },
    {
      id: "music-therapy",
      title: "Musik sebagai Terapi: Ilmu di Balik Healing",
      content: `**Music therapy** adalah penggunaan musik yang terstruktur oleh terapis bersertifikat untuk tujuan klinis. Ini BUKAN pseudoscience — didukung oleh ratusan studi.

**Aplikasi klinis yang terbukti:**

**Neurologi:**
- **Stroke rehabilitation**: Rhythmic Auditory Stimulation (RAS) membantu pasien berjalan kembali dengan menggunakan beat sebagai pacer
- **Parkinson**: Ritme music membantu mengatasi freezing of gait
- **Alzheimer**: Pasien yang lupa nama keluarga masih bisa menyanyikan lagu dari masa muda — musik disimpan di area otak yang berbeda dari memori deklaratif

**Psikiatri:**
- **PTSD**: Musik membantu processing emosi traumatik dalam lingkungan aman
- **Depresi**: Active music making meningkatkan dopamin dan serotonin
- **Autisme**: Improvisasi musik membantu komunikasi non-verbal

**Fisiologi:**
- Mendengar musik yang disukai menurunkan **cortisol** (hormon stress) hingga 25%
- Bernyanyi — terutama dalam grup — meningkatkan **oxytocin** (bonding hormone)  
- Tempo 60-80 BPM bisa memperlambat detak jantung dan menurunkan tekanan darah

**Playlist untuk belajar?**
Riset suggest: musik **tanpa lirik**, **tempo sedang** (~60-80 BPM), **konsisten** (tidak ada surprise dinamis). Genre terbaik bervariasi per individu — yang penting familiar dan pleasant.`,
      keyTakeaway:
        "Music therapy adalah bidang klinis serius, bukan pseudoscience. Musik mengubah neurochemistry otak — menurunkan cortisol, meningkatkan dopamin, dan membantu rehabilitasi neurologis.",
    },
  ],

  crossRefs: [
    { type: "knowledge", id: "math-of-music", label: "Matematika dalam Musik" },
    {
      type: "knowledge",
      id: "acoustics-of-sound",
      label: "Akustik & Gelombang Suara",
    },
    {
      type: "knowledge",
      id: "history-of-music",
      label: "Sejarah Musik",
    },
    { type: "nolopedia", id: "consonance", label: "Konsonansi" },
    { type: "nolopedia", id: "dissonance", label: "Disonansi" },
    { type: "interval", id: "m3", label: "Minor Third" },
    { type: "interval", id: "M3", label: "Major Third" },
    { type: "family", id: "family", label: "Harmonic Family" },
  ],
  relatedArticles: [
    "acoustics-of-sound",
    "math-of-music",
    "world-music-systems",
    "rhythm-and-meter",
  ],
};
