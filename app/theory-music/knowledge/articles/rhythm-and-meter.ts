// ════════════════════════════════════════════════════════
// Music Knowledge – Article: Rhythm & Meter
// ════════════════════════════════════════════════════════

import type { KnowledgeArticle } from "../types";

export const ARTICLE_RHYTHM_AND_METER: KnowledgeArticle = {
  id: "rhythm-and-meter",
  title: "Ritme & Meter",
  subtitle: "Detak Jantung Musik: Beat, Groove, dan Polyrhythm",
  category: "math-and-science",
  level: "beginner",
  readingTime: 12,
  description:
    "Pahami fondasi ritmis musik — dari beat dan pulse, time signature, subdivisi, syncopation, polyrhythm, hingga hubungan tempo dengan emosi. Ritme adalah elemen musik yang paling primordial.",
  heroIcon: "metronome",
  tags: [
    "ritme",
    "meter",
    "time signature",
    "tempo",
    "BPM",
    "syncopation",
    "polyrhythm",
    "groove",
    "subdivisi",
    "swing",
  ],

  sections: [
    {
      id: "beat-and-pulse",
      title: "Beat & Pulse: Fondasi Semua Ritme",
      content: `**Beat** adalah unit waktu dasar dalam musik — detak reguler yang kita rasakan saat mengetuk kaki atau mengangguk kepala mengikuti lagu.

**Konsep fundamental:**
- **Pulse** — detak konstan yang mendasari musik (seperti detak jantung)
- **Beat** — satu ketukan dalam pulse
- **Tempo** — kecepatan beat, diukur dalam BPM (Beats Per Minute)
- **Measure/Bar** — kelompok beat yang diulang (biasanya 2, 3, 4, atau 6 beat)

**Mengapa manusia merasakan beat?**
Otak manusia memiliki kemampuan unik untuk **beat induction** — secara otomatis menemukan pola reguler dalam suara. Ini terkait dengan:
- **Motor cortex** — mengapa kita ingin bergerak mengikuti musik
- **Cerebellum** — pusat timing dan koordinasi
- **Predictive processing** — otak menikmati ritual "[prediksi → konfirmasi]"

Menariknya, meskipun banyak hewan bisa mendengar ritme, **sangat sedikit** yang bisa mengikuti beat secara tepat (manusia, beberapa burung kakaktua, dan simpanse terlatih). Ini menunjukkan bahwa sinkronisasi ritmis terkait dengan kemampuan bahasa.

**Strong beats dan weak beats:**
Dalam kelompok beat, ada hierarki:
- Beat 1 = **downbeat** (paling kuat)
- Beat 2 dan 4 = posisi yang bervariasi tergantung genre (di jazz/funk, beat 2 dan 4 ditekankan = "backbeat")
- Beat 3 (dalam 4/4) = beat kuat sekunder

Pergeseran penekanan ini mengubah *feel* musik secara drastis — coba bandingkan marching band (tekan 1 dan 3) dengan funk (tekan 2 dan 4).`,
      keyTakeaway:
        "Beat induction — kemampuan merasakan pulse reguler — adalah kemampuan unik manusia yang berbasis neuroscience. Ini fondasi dari seluruh pengalaman ritmis.",
    },
    {
      id: "time-signatures",
      title: "Time Signature: Mengatur Kelompok Beat",
      content: `**Time signature** (tanda birama) memberi tahu kita berapa beat per bar dan nada apa yang menjadi satu beat.

**Format: X/Y**
- **X** (atas) = jumlah beat per bar
- **Y** (bawah) = nilai not yang menjadi 1 beat (4 = quarter note, 8 = eighth note)

**Time signature umum:**

**Simple meter (beat dibagi 2):**
- **4/4** (Common Time) — paling umum di pop, rock, jazz, EDM. 4 beat per bar.
- **3/4** (Waltz) — 3 beat per bar. Digunakan di waltz, ballad.
- **2/4** (March) — 2 beat per bar. Polka, marching band.

**Compound meter (beat dibagi 3):**
- **6/8** — 2 grup × 3 eighth notes. Terasa "bergoyang". Banyak ballad dan folk.
- **9/8** — 3 grup × 3 eighth notes. Kurang umum, tapi ada di Baroque dan progressive.
- **12/8** — 4 grup × 3 eighth notes. Blues slow, doo-wop.

**Odd meter / asymmetric:**
- **5/4** — "Take Five" (Dave Brubeck). Terasa 3+2 atau 2+3.
- **7/8** — Pink Floyd "Money". Terasa 4+3 atau 3+4 atau 2+2+3.
- **11/8** — Progressive rock, Balkan folk. Sangat tidak biasa bagi telinga Barat.

**Perbedaan feel:**
4/4 vs 6/8 — keduanya bisa punya durasi bar yang sama, tapi feel sangat berbeda:
- 4/4: **1**-2-3-4 (square, marching)
- 6/8: **1**-2-3-**4**-5-6 (lilting, rocking)

Banyak lagu menggunakan **mixed meter** — berganti time signature sepanjang lagu, terutama di progressive rock (Dream Theater) dan musik film.`,
      widget: {
        type: "comparison-table",
        headers: ["Time Signature", "Tipe", "Feel", "Contoh Terkenal"],
        rows: [
          [
            "4/4",
            "Simple Duple",
            "Straight, universal",
            "90%+ lagu pop/rock/EDM",
          ],
          [
            "3/4",
            "Simple Triple",
            "Waltz, berputar",
            "The Blue Danube, Merry Christmas",
          ],
          ["2/4", "Simple Duple", "March, polka", "Stars and Stripes Forever"],
          [
            "6/8",
            "Compound Duple",
            "Goyang, lilting",
            "We Are the Champions, Hallelujah",
          ],
          [
            "12/8",
            "Compound Quadruple",
            "Slow blues, shuffle",
            "Slow blues standards",
          ],
          [
            "5/4",
            "Odd / Asymmetric",
            "Unik, off-balance",
            "Take Five (Dave Brubeck)",
          ],
          [
            "7/8",
            "Odd / Asymmetric",
            "Lopsided, energetic",
            "Money (Pink Floyd)",
          ],
        ],
      },
      keyTakeaway:
        "Time signature bukan hanya angka teknis — ia menentukan 'feel' dan karakter musik. 4/4 terasa stabil, 3/4 berputar, 6/8 bergoyang, dan odd meter menciptakan tension unik.",
    },
    {
      id: "subdivision-and-groove",
      title: "Subdivisi & Groove: Detail yang Membuat Musik Hidup",
      content: `**Subdivisi** adalah cara beat dibagi menjadi bagian-bagian lebih kecil. Inilah yang membedakan musik "kaku" dari musik yang "groovy".

**Level subdivisi:**
- **Beat** = quarter note (dalam 4/4)
- **Eighth notes** = beat dibagi 2
- **Sixteenth notes** = beat dibagi 4
- **Triplets** = beat dibagi 3

**Straight vs Swing:**
- **Straight eighth notes**: Du-Du-Du-Du (bagi rata 50/50)
- **Swing eighth notes**: Duu-Da-Duu-Da (bagi tidak rata, ~67/33)
- Swing feel adalah DNA jazz, blues, dan banyak musik soul/R&B

**Apa itu "groove"?**
Groove adalah **micro-timing** — deviasi halus dari grid beat yang sempurna:
- Drummer yang sedikit terlambat di beat 2 → "laid-back" feel
- Bassist yang sedikit mendahului → "pushing" feel
- Deviasi ini biasanya hanya **10-50 milidetik** tapi terasa SANGAT berbeda

**Quantize vs Human feel:**
DAW (Digital Audio Workstation) biasanya men-snap nada ke grid sempurna (quantize). Tapi musik yang terlalu sempurna terasa "robotik". Produser sering menambahkan **humanize** — deviasi acak kecil — untuk mengembalikan nuansa manusiawi.

**Ghost notes:**
Nada sangat pelan yang dimainkan di antara beat utama — terutama penting di:
- **Drum**: hi-hat ghost notes mengisi antara snare hits
- **Bass**: ghost notes menciptakan "percolating" feel funk
- **Guitar**: muted strums terdengar "chk-chk" di antara chord

James Brown, Tower of Power, dan Vulfpeck adalah contoh band yang hidup dari ghost notes dan micro-timing.`,
      keyTakeaway:
        "Groove bukan tentang bermain sempurna di grid — justru micro-timing deviasi (10-50ms) dan ghost notes lah yang membuat musik terasa hidup dan manusiawi.",
    },
    {
      id: "syncopation",
      title: "Syncopation: Kejutan Ritmis",
      content: `**Syncopation** terjadi ketika aksen ritmis jatuh di posisi yang **tidak diharapkan** — biasanya di antara beat utama (off-beat).

**Mengapa syncopation bekerja?**
Sama seperti chord deceptive cadence mengejutkan telinga secara harmonis, syncopation mengejutkan **ekspektasi ritmis** kita. Otak memprediksi aksen di beat kuat, dan saat aksen justru di beat lemah — kita merasakan energi ekstra.

**Jenis syncopation:**

**1. Off-beat syncopation:**
Aksen jatuh di "dan" (eighth note antara beat):
- Normal: **1** 2 **3** 4
- Syncopated: 1 **+** 2 **+** 3 **+** 4

**2. Anticipation:**
Nada dimainkan setengah beat **lebih awal** dari yang diharapkan — seolah "tidak sabar":
- Normal: chord berubah di beat 1
- Anticipated: chord berubah di beat 4+ dari bar sebelumnya

**3. Suspension:**
Nada dari chord sebelumnya **ditahan** melewati batas bar — menunda resolusi ritmis.

**4. Cross-rhythm:**
Pola biner (2) dimainkan di atas pola terner (3) atau sebaliknya — menciptakan tension ritmis kompleks.

**Syncopation di berbagai genre:**
- **Reggae**: guitar "skank" di off-beat, bass di beat 3 — sangat syncopated
- **Funk**: semua instrumen bermain "di antara" beat utama
- **Jazz**: comping piano/gitar sengaja menghindari beat 1 dan 3
- **Latin**: clave pattern (3-2 atau 2-3) mengatur seluruh ensemble
- **Bossa Nova**: guitar pattern terkenal syncopated — mengabungkan 3+3+2

**Tip praktik:**
Untuk merasakan syncopation, coba ini:
1. Tepuk tangan di beat 1 dan 3 (normal)
2. Pindahkan tepukan ke beat 2 dan 4 (backbeat)
3. Pindahkan ke "dan" setelah beat 2 dan 4 (off-beat) — ini syncopation!`,
      widget: {
        type: "comparison-table",
        headers: ["Genre", "Pola Ritmis Khas", "Level Syncopation"],
        rows: [
          ["March / Klasik", "Aksen di beat 1, 3 (strong beats)", "Minimal"],
          ["Rock", "Backbeat: snare di 2 dan 4", "Rendah-Sedang"],
          [
            "Funk",
            "Ghost notes, off-beat accents, 16th note grooves",
            "Tinggi",
          ],
          ["Reggae", "Guitar skank off-beat, bass di beat 3", "Tinggi"],
          ["Jazz", "Swing, comping menghindari downbeat", "Tinggi"],
          [
            "Latin / Salsa",
            "Clave 3-2 atau 2-3 mengatur seluruh band",
            "Sangat Tinggi",
          ],
          ["Bossa Nova", "Guitar: 3+3+2 grouping melawan 4/4", "Sangat Tinggi"],
        ],
      },
      keyTakeaway:
        "Syncopation adalah bumbu utama ritme — ia mengubah pola yang predictable menjadi menarik. Semakin banyak syncopation, semakin 'groovy' dan kompleks nuansanya.",
    },
    {
      id: "polyrhythm",
      title: "Polyrhythm & Metric Modulation: Dimensi Lain Ritme",
      content: `**Polyrhythm** adalah dua atau lebih pola ritmis berbeda yang dimainkan secara bersamaan. Ini adalah konsep ritmis tingkat lanjut yang umum di musik Afrika, latin, progressive, dan contemporary.

**Polyrhythm dasar:**

**3 melawan 2 (3:2):**
- Tangan kanan memainkan 3 ketukan merata
- Tangan kiri memainkan 2 ketukan merata
- Dalam waktu yang SAMA
- Mnemonic: "Pass the bread" (3 suku kata = tangan kanan, 2 tekanan = tangan kiri)
- Contoh: Hemiola di musik Baroque, gitar flamenco

**4 melawan 3 (4:3):**
- Satu tangan 4 ketukan, tangan lain 3 ketukan
- Mnemonic: "What atrocious weather" (4 suku kata vs 3 tekanan)
- Contoh: Chopin, Debussy, jazz modern

**Clave — polyrhythm yang terorganisir:**
Dalam musik Afro-Cuban, seluruh ensemble dibangun di atas pattern 2-3 atau 3-2 clave:
- Son clave: X . . X . . X . X . X .  (2-bar pattern)
- Rumba clave: sedikit berbeda timing-nya
- Setiap instrumen memiliki pola yang "mengunci" ke clave

**Metric modulation:**
Teknik di mana subdivisi dari tempo lama menjadi beat di tempo baru:
- Contoh: quarter note = 120 BPM. Jika triplet menjadi beat baru, tempo baru = 180 BPM (120 × 3/2)
- Elliott Carter memopulerkan teknik ini di musik kontemporer
- Juga digunakan di jazz (Vijay Iyer) dan progressive rock (Tool, Meshuggah)

**Polyrhythm di budaya dunia:**
- **Afrika Barat**: polyrhythm adalah fondasi — multiple drummer memainkan pattern berbeda secara bersamaan
- **India**: tala system memungkinkan pola ritmis sangat kompleks (misanya, cycle 16 beat dengan subdivisi 5+5+3+3)
- **Balkan**: aksak rhythm — pola 7/8, 9/8, 11/8 yang terasa "natural" bagi musisi lokal
- **Progressive rock**: Tool "Lateralus" menggunakan Fibonacci sequence dalam pola ritmisnya`,
      widget: {
        type: "comparison-table",
        headers: ["Polyrhythm", "Pattern", "Tradisi / Contoh"],
        rows: [
          [
            "2:3 (Hemiola)",
            "2 vs 3 dalam durasi sama",
            "Baroque, Flamenco, Blues",
          ],
          ["3:4", "3 vs 4 dalam durasi sama", "Chopin, Jazz, West African"],
          ["Son Clave (2-3)", "X..X..X.X.X.", "Salsa, Son, Mambo"],
          ["Rumba Clave (3-2)", "X..X...X.X.X", "Rumba, Afro-Cuban jazz"],
          [
            "Bell Pattern (Agogo)",
            "Pola asimetris 12/8",
            "West African ensemble",
          ],
          [
            "Tala (India)",
            "Cycle 7, 10, 16+ beat",
            "Hindustani & Carnatic music",
          ],
          [
            "Aksak (Balkan)",
            "7/8, 9/8, 11/8 pattern",
            "Bulgarian, Turkish, Greek",
          ],
        ],
      },
      keyTakeaway:
        "Polyrhythm membuka dimensi baru ritme — dua pola bisa berjalan bersamaan dan menciptakan kompleksitas yang jauh melampaui satu beat tunggal.",
    },
    {
      id: "tempo-and-expression",
      title: "Tempo & Ekspresi: Kecepatan Mengubah Segalanya",
      content: `**Tempo** — kecepatan beat — adalah salah satu parameter paling berpengaruh terhadap karakter musik. Riset menunjukkan tempo bahkan lebih berpengaruh terhadap persepsi emosi daripada major/minor!

**Istilah tempo klasik (Italia):**

| Istilah | BPM | Karakter |
|---------|-----|----------|
| Grave | 20-40 | Sangat lambat, berat, serius |
| Largo | 40-60 | Lambat, lebar, agung |
| Adagio | 60-80 | Lambat, tenang, ekspresif |
| Andante | 76-108 | Berjalan, mengalir |
| Moderato | 108-120 | Sedang, nyaman |
| Allegro | 120-156 | Cepat, ceria, energik |
| Vivace | 156-176 | Sangat cepat, hidup |
| Presto | 168-200 | Sangat cepat, bersemangat |
| Prestissimo | 200+ | Secepat mungkin |

**Tempo dan emosi:**
- **< 70 BPM**: cenderung sedih, tenang, meditatif
- **70-110 BPM**: nyaman, percakapan, ballad
- **110-140 BPM**: energik, dance, pop mainstream
- **140-170 BPM**: intense, drum & bass, punk
- **170+ BPM**: extreme, speedcore, death metal

**Rubato — kebebasan tempo:**
Dalam musik klasik dan jazz, rubato berarti **memperlambat dan mempercepat tempo** secara ekspresif tanpa mengubah tempo keseluruhan. Seperti "mencuri" waktu dari satu beat dan "mengembalikan" di beat lain.

**Click track dan modern production:**
- Studio modern hampir selalu menggunakan **click track** (metronome) untuk menjaga tempo konstan
- Tapi banyak band legendaris sengaja TIDAK menggunakan click — sedikit accelerando di chorus membuat energi naik secara natural
- "Bohemian Rhapsody" (Queen) berubah tempo secara dramatis — dari ballad ke opera ke hard rock

**Fun fact tentang tempo:**
Detak jantung rata-rata manusia saat istirahat = ~60-80 BPM. Music di rentang ini terasa "relaks" karena sinkron dengan detak jantung kita. Tempo yang jauh lebih cepat (>140 BPM) meningkatkan adrenalin.`,
      widget: {
        type: "quiz",
        questions: [
          {
            question: "Time signature 6/8 berarti:",
            options: [
              "6 beat per bar, each beat = eighth note",
              "6 bars of 8 beats",
              "Tempo 6/8 = 0.75",
              "6 notes dimainkan 8 kali",
            ],
            correctIndex: 0,
            explanation:
              "6/8 = 6 eighth notes per bar, biasanya dirasakan sebagai 2 grup × 3 eighth notes, menghasilkan feel 'compound duple'.",
          },
          {
            question: "'Swing feel' dalam jazz berarti eighth notes dimainkan:",
            options: [
              "Sangat cepat",
              "Sangat pelan",
              "Dibagi tidak rata (~67/33 alih-alih 50/50)",
              "Di oktaf yang berbeda",
            ],
            correctIndex: 2,
            explanation:
              "Swing mengubah pembagian eighth note dari rata (straight) menjadi tidak rata — note pertama lebih panjang, note kedua lebih pendek, mirip triplet feel.",
          },
          {
            question: "Polyrhythm 3:2 berarti:",
            options: [
              "Tempo 3x lebih cepat dari normal",
              "3 ketukan melawan 2 ketukan dalam durasi sama",
              "3 bar dilanjutkan 2 bar",
              "Main 3 lagu lalu 2 lagu",
            ],
            correctIndex: 1,
            explanation:
              "Polyrhythm 3:2 — satu tangan memainkan 3 ketukan merata sementara tangan lain memainkan 2 ketukan merata dalam waktu yang sama.",
          },
          {
            question: "Istilah tempo 'Allegro' berarti kecepatan sekitar:",
            options: [
              "40-60 BPM (sangat lambat)",
              "76-108 BPM (berjalan)",
              "120-156 BPM (cepat, ceria)",
              "200+ BPM (secepat mungkin)",
            ],
            correctIndex: 2,
            explanation:
              "Allegro berasal dari bahasa Italia yang berarti 'ceria/cepat', dengan tempo sekitar 120-156 BPM.",
          },
          {
            question: "Ghost notes paling penting dalam genre:",
            options: [
              "Gregorian chant",
              "Marching band",
              "Funk dan R&B",
              "Ambient music",
            ],
            correctIndex: 2,
            explanation:
              "Ghost notes — nada sangat pelan di antara beat utama — adalah DNA dari funk dan R&B groove. Mereka membuat pola ritmis terasa 'hidup'.",
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
      id: "psychology-of-music",
      label: "Psikologi Musik (Emosi & Ritme)",
    },
    {
      type: "knowledge",
      id: "history-of-music",
      label: "Sejarah Musik Barat",
    },
    {
      type: "knowledge",
      id: "world-music-systems",
      label: "Sistem Musik Dunia (Polyrhythm)",
    },
    {
      type: "knowledge",
      id: "chord-and-harmony",
      label: "Teori Chord & Harmoni",
    },
    { type: "nolopedia", id: "interval", label: "Interval" },
  ],
  relatedArticles: [
    "chord-and-harmony",
    "psychology-of-music",
    "world-music-systems",
    "math-of-music",
  ],
};
