// ════════════════════════════════════════════════════════
// Music Knowledge – Article: World Music Systems
// ════════════════════════════════════════════════════════

import type { KnowledgeArticle } from "../types";

export const ARTICLE_WORLD_MUSIC_SYSTEMS: KnowledgeArticle = {
  id: "world-music-systems",
  title: "Sistem Musik Dunia",
  subtitle: "12 Nada Bukan Satu-satunya Jawaban",
  category: "culture",
  level: "intermediate",
  readingTime: 18,
  description:
    "Jelajahi sistem musik non-Barat — dari 22-shruti India, maqam Arab, gamelan Jawa pelog/slendro, hingga pentatonic Tiongkok. Setiap tradisi punya logika dan keindahannya sendiri.",
  heroIcon: "globe",
  tags: [
    "gamelan",
    "raga",
    "maqam",
    "pentatonic",
    "slendro",
    "pelog",
    "quarter tone",
    "microtonal",
    "world music",
    "budaya",
  ],

  sections: [
    {
      id: "beyond-12",
      title: "Di Luar 12 Nada: Mengapa?",
      content: `Sistem musik Barat membagi oktaf menjadi **12 semitone** (12-TET). Tapi ini BUKAN kebenaran universal.

Banyak tradisi musik menggunakan pembagian lain:
- **India**: 22 shruti (micro-intervals) dalam satu oktaf
- **Arab/Turki**: 24 quarter tones (maqam system)
- **Jawa/Bali**: 5 nada (slendro) atau 7 nada (pelog) — tidak equal temperament
- **Tiongkok**: pentatonic 5 nada sebagai fondasi
- **Thailand**: 7-TET (7 nada equal dalam satu oktaf)
- **Afrika**: poliritme lebih penting dari skala nada

**Mengapa berbeda?**
Setiap sistem tumbuh dari:
1. **Tradisi vokal** lokal — cara orang berbicara dan menyanyi mempengaruhi interval yang "natural"
2. **Instrumen khas** — konstruksi instrumen menentukan nada yang tersedia
3. **Konteks spiritual/sosial** — musik sakral vs hiburan memiliki aturan berbeda
4. **Filosofi & kosmologi** — hubungan musik dengan alam semesta

Tidak ada sistem yang "lebih benar" — semuanya valid secara matematis dan musikal.`,
      widget: {
        type: "comparison-table",
        headers: ["Tradisi", "Nada/Oktaf", "Temperament", "Ciri Khas"],
        rows: [
          ["Barat (12-TET)", "12", "Equal", "Modulasi bebas, harmoni vertikal"],
          [
            "India (Raga)",
            "22 shruti",
            "Unequal (Just)",
            "Melodi + ornamen, rasa/mood per raga",
          ],
          [
            "Arab (Maqam)",
            "24 quarter",
            "Unequal",
            "Quarter tones, improvisasi taqasim",
          ],
          [
            "Jawa (Slendro)",
            "5",
            "Near-equal",
            "Gamelan, setiap set unik tuning-nya",
          ],
          ["Jawa (Pelog)", "7", "Unequal", "Interval besar & kecil bergantian"],
          [
            "Tiongkok",
            "5 (pentatonic)",
            "Pythagorean",
            "5 nada pokok + ornamen",
          ],
          [
            "Thailand",
            "7",
            "Equal (7-TET)",
            "7 nada sama rata; ~171 cents/step",
          ],
        ],
      },
      keyTakeaway:
        "12 nada equal temperament hanya SATU dari banyak pilihan pembagian oktaf. Setiap tradisi punya sistem yang valid dan indah secara musikal.",
    },
    {
      id: "indian-raga",
      title: "Raga India: Musik sebagai Ilmu Emosi",
      content: `Sistem musik India adalah salah satu yang paling sophisticated di dunia, berkembang selama 3.000+ tahun.

**Konsep fundamental:**
- **Shruti** — 22 micro-intervals dalam satu oktaf (lebih halus dari 12-TET Barat)
- **Svara** — 7 nada pokok: Sa, Re, Ga, Ma, Pa, Dha, Ni (mirip do-re-mi)
- **Raga** — framework melodis yang menentukan nada, naik/turun, ornamen, dan MOOD
- **Tala** — siklus ritmis (mirip time signature tapi lebih kompleks)

**Raga bukan sekadar scale:**
Raga terikat pada:
- **Waktu hari** — Raga Bhairav untuk subuh, Raga Yaman untuk malam
- **Musim** — Raga Megh untuk monsun
- **Emosi (rasa)** — 9 rasa: Shringara (cinta), Karuna (kasihan), Veera (heroik), dll.
- **Gerakan spesifik** — urutan naik (aroha) bisa berbeda dari turun (avaroha)

**Ornamen (gamaka):**
Nada dalam musik India tidak "flat" seperti Barat. Setiap note diberi ornamen kompleks:
- **Meend** — glide panjang antar nada
- **Andolan** — oscillation lambat di sekitar nada
- **Kan** — grace notes cepat
- **Murki** — cluster ornamen berkecepatan tinggi

**Perbandingan dengan Barat:**

Musik Barat menekankan **harmoni vertikal** (chord). Musik India menekankan **melodi horizontal** (raga) + **ritme** (tala). Kedua pendekatan menghasilkan musik yang equally complex tapi di dimensi berbeda.`,
      keyTakeaway:
        "Raga bukan sekadar scale — ia adalah framework melodis lengkap yang menentukan mood, waktu hari, ornamentasi, dan aturan gerakan. Satu raga bisa menjadi sumber jam-jam improvisasi.",
    },
    {
      id: "listen-raga",
      title: "Dengarkan: Raga Yaman (Malam)",
      content: `Tekan **Play** untuk mendengar **Raga Yaman lengkap** — pertunjukan 3 bagian tradisional: Alap, Gat, dan Jhala.

Dalam 12-TET Barat, Raga Yaman berpadanan dengan **Lydian mode** (C–D–E–F#–G–A–B). Ciri khasnya: nada keempat dinaikkan (F → F#), menciptakan karakter cerah dan melayang.

- **Alap** — eksplorasi lambat tanpa ritme tetap, membangun mood raga dari register bawah ke atas
- **Gat** — bagian ritmis utama, tema melodis yang menonjolkan karakter F# (Ma tivra)
- **Jhala** — klimaks cepat dengan pola repetitif berenergi tinggi, menuju resolusi akhir`,
      widget: {
        type: "alphatex-player",
        title: "Raga Yaman: Alap, Gat & Jhala (Full)",
        tex: `\\title "Raga Yaman"
\\subtitle "Raga Malam — Alap, Gat & Jhala"
\\tempo 66
\\ts 4 4
\\track "Sitar" "Sit."
  \\staff{score tabs} \\tuning (E4 B3 G3 D3 A2 E2) \\instrument acousticguitarnylon
\\section "A" "Alap (Eksplorasi Lambat)"
:2 0.3 0.2 | :4 1.2 3.2 :2 0.1 | :4 2.1 0.1 3.2 1.2 | :2 0.2 0.3 |
:4 1.2 3.2 0.1 2.1 | :2 3.1 :4 2.1 0.1 | :4 3.2 1.2 :2 0.2 | :1 1.2 |
\\section "B" "Gat (Tema Ritmis)"
:8 1.2 3.2 0.1 2.1 :4 3.1 5.1 | :8 7.1 5.1 3.1 2.1 :4 0.1 3.2 |
:8 0.1 2.1 3.1 5.1 :4 7.1 8.1 | :8 7.1 5.1 :4 3.1 2.1 0.1 |
:8 3.2 1.2 0.2 2.3 :4 0.3 2.3 | :8 0.2 1.2 3.2 0.1 :2 1.2 |
:8 3.2 0.1 2.1 0.1 :4 3.2 1.2 | :4 0.2 2.3 :2 0.3 |
\\section "C" "Jhala (Klimaks Cepat)"
:16 5.1 3.1 5.1 0.1 3.1 0.1 3.2 0.1 :8 3.1 5.1 :4 7.1 |
:16 8.1 7.1 5.1 3.1 5.1 3.1 0.1 3.2 :8 0.1 3.2 :4 1.2 |
:8 3.2 0.1 2.1 3.1 5.1 3.1 2.1 0.1 | :4 3.2 1.2 :2 1.2 |`,
        description:
          "Raga Yaman lengkap (20 bar): Alap meditasi lambat → Gat tema ritmis → Jhala klimaks cepat. Lydian mode C–D–E–F#–G–A–B.",
      },
      keyTakeaway:
        "Raga Yaman menggunakan raised 4th (F#) yang menciptakan karakter cerah dan melayang — cocok dengan suasana malam yang romantis. Alap-Gat-Jhala adalah struktur tradisional pertunjukan raga.",
    },
    {
      id: "maqam",
      title: "Maqam Arab: Quarter Tones & Improvisasi",
      content: `**Maqam** (jamak: maqamat) adalah sistem melodi Arab yang menggunakan **quarter tones** — nada yang berada tepat di antara dua nada piano.

**Struktur:**
- Oktaf dibagi menjadi **24 quarter tones** (bukan 12 semitone)
- Setiap quarter tone ≈ 50 cents (vs 100 cents per semitone di 12-TET)
- Maqam dibangun dari tetrachords (**jins**) — kelompok 4 nada yang disambung

**Maqam populer:**
- **Maqam Rast** — "major scale" versi Arab, tapi dengan nada ke-3 yang sedikit lebih rendah (neutral third, ~350 cents)
- **Maqam Bayati** — melankolis, sangat populer di lagu-lagu cinta
- **Maqam Hijaz** — eksotis, diidentifikasi Barat sebagai "suara Timur Tengah" (mengandung augmented second)
- **Maqam Saba** — sedih, sering untuk ratapan (tiga interval kecil berturut-turut)

**Taqasim:**
Improvisasi instrumental solo yang mengeksplorasi sebuah maqam — dimulai dari jins bawah, naik ke atas, modulasi ke maqam terkait, lalu kembali. Ini setara dengan "jazz solo" dalam konteks Arab.

**Quarter tone di dunia modern:**
Beberapa komposer kontemporer (Ligeti, Haas, Saariaho) menggunakan quarter tones untuk menghasilkan warna harmoni baru yang tidak mungkin dalam 12-TET.`,
      widget: {
        type: "comparison-table",
        headers: ["Maqam", "Karakter", "Konteks Penggunaan"],
        rows: [
          ["Rast", "Hangat, natural, seimbang", "Dasar; pembuka pertunjukan"],
          [
            "Bayati",
            "Melankolis, intim, tender",
            "Lagu cinta, musik devosional",
          ],
          [
            "Hijaz",
            "Eksotis, spiritual, intens",
            "Musik sakral, suasana dramatis",
          ],
          ["Saba", "Sangat sedih, menyayat", "Ratapan, kesedihan mendalam"],
          ["Nahawand", "Mirip minor Barat", "Lagu pop Arab modern"],
          ["Kurd", "Gelap, misterius", "Musik Sufi, improvisasi mendalam"],
        ],
      },
      keyTakeaway:
        "Quarter tones bukan 'fals' — mereka adalah nada presisi yang sudah digunakan dalam musik Arab selama ribuan tahun. Neutral third (~350 cents) menciptakan warna yang tidak bisa direproduksi piano Barat.",
    },
    {
      id: "listen-maqam",
      title: "Dengarkan: Maqam Hijaz",
      content: `Tekan **Play** untuk mendengar **Taqasim Maqam Hijaz lengkap** — improvisasi instrumental yang mengeksplorasi seluruh jangkauan maqam dalam 3 bagian.

Ciri khas Hijaz adalah **augmented second** (E♭ → F#) — interval 1,5 langkah yang menciptakan karakter eksotis dan dramatis.

- **Jins Hijaz** — eksplorasi register rendah, memperkenalkan interval khas E♭–F# secara berlahan
- **Sayr** — perjalanan naik melalui seluruh maqam, modulasi antar tetrachord, lalu kembali
- **Qaflah** — klimaks di register tinggi diikuti resolusi dramatis ke nada dasar D`,
      widget: {
        type: "alphatex-player",
        title: "Maqam Hijaz: Taqasim Lengkap",
        tex: `\\title "Maqam Hijaz"
\\subtitle "Taqasim Lengkap — Jins, Sayr & Qaflah"
\\tempo 76
\\ts 4 4
\\track "Oud" "Oud"
  \\staff{score tabs} \\tuning (E4 B3 G3 D3 A2 E2) \\instrument acousticguitarnylon
\\section "A" "Jins Hijaz (Register Rendah)"
:4 0.4 1.4 :2 4.4 | :8 4.4 1.4 :4 0.4 :2 0.4 |
:4 0.4 1.4 4.4 0.3 | :8 2.3 0.3 :4 4.4 :2 0.4 |
\\section "B" "Sayr (Eksplorasi Naik)"
:8 0.4 1.4 4.4 0.3 :4 2.3 3.3 | :8 1.2 3.2 :4 4.2 :2 2.1 |
:8 3.1 2.1 4.2 3.2 :4 1.2 3.3 | :8 2.3 0.3 :4 4.4 :2 0.4 |
:8 1.4 4.4 0.3 2.3 :4 3.3 1.2 | :4 3.2 4.2 :2 2.1 |
:8 2.1 4.2 3.2 1.2 :4 3.3 2.3 | :4 0.3 4.4 :2 0.4 |
\\section "C" "Qaflah (Klimaks & Resolusi)"
:8 3.2 4.2 2.1 3.1 :4 5.1 6.1 | :8 8.1 6.1 5.1 3.1 :4 2.1 4.2 |
:8 3.2 1.2 3.3 2.3 :4 0.3 4.4 | :4 1.4 0.4 :2 0.4 |
:8 0.4 1.4 4.4 0.3 :4 4.4 1.4 | :1 0.4 |`,
        description:
          "Taqasim Hijaz lengkap (18 bar): dari register rendah D3 naik ke D5, lalu resolusi kembali ke D3. Augmented second E♭–F# terdengar di setiap bagian.",
      },
      keyTakeaway:
        "Augmented second (1,5 langkah) dalam Maqam Hijaz menciptakan karakter dramatis yang instantly recognizable. Taqasim mengeksplorasi maqam dari bawah ke atas lalu kembali.",
    },
    {
      id: "gamelan",
      title: "Gamelan Jawa & Bali: Setiap Ensemble Unik",
      content: `**Gamelan** — ensemble perkusi logam dari Jawa dan Bali — memiliki salah satu sistem tuning paling unik di dunia.

**Dua laras utama:**
- **Slendro** — 5 nada yang mendekati pembagian equal (seperti 5-TET, ~240 cents/step)
- **Pelog** — 7 nada dengan interval yang TIDAK equal (campuran step besar dan kecil)

**Keunikan fundamental:**
Tidak ada standar pitch universal! Setiap set gamelan di-tune **secara unik** oleh pembuatnya. Gamelan di Keraton Yogyakarta punya tuning berbeda dari Keraton Solo. Musisi harus beradaptasi dengan setiap instrumen.

**Beating & Ombak:**
Instrumen gamelan sengaja di-tune sedikit berbeda dalam pasangan (mirip chorus effect). Hasilnya adalah **ombak** — gelombang suara yang "berdenyut" indah. Ini BUKAN cacat tuning — ini fitur akustik yang disengaja!

**Konsep filosofis:**
- **Pathet** — mirip mode/raga; menentukan nada hierarki dan mood
- **Irama** — level tempo/density yang berubah dalam pertunjukan
- **Colotomic structure** — instrumen besar (gong) menandai siklus besar, instrumen kecil mengisi ornamen

**Pengaruh global:**
Claude Debussy mendengar gamelan di Paris Exposition 1889 dan sangat terpengaruh. Parallelism, whole-tone scale, dan "static harmony" dalam musiknya terinspirasi dari gamelan Jawa.`,
      keyTakeaway:
        "Gamelan menunjukkan bahwa 'tuning sempurna' itu relatif — ombak (beating) yang sengaja diciptakan justru menjadi keindahan khas yang membedakan gamelan dari instrumen manapun di dunia.",
    },
    {
      id: "listen-gamelan",
      title: "Dengarkan: Pola Gamelan Jawa (Slendro)",
      content: `Tekan **Play** untuk mendengar **Lancaran Manyura lengkap** — bentuk pertunjukan gamelan Jawa dalam 4 bagian tradisional.

Gamelan slendro menggunakan **5 nada** yang mendekati pembagian equal (C–D–E–G–A dalam 12-TET).

- **Buka** — panggilan pembuka oleh instrumen solo yang membangun kerangka melodi
- **Balungan** — melodi pokok lambat 2 siklus oleh saron/demung, ditandai gong di tiap akhir siklus
- **Elaborasi** — pola **kotekan** cepat oleh peking, ornamen interlocking 2 siklus
- **Suwuk** — penutup yang memperlambat tempo dan berakhir dengan gong final`,
      widget: {
        type: "alphatex-player",
        title: "Lancaran Manyura: Gamelan Lengkap",
        tex: `\\title "Lancaran Manyura"
\\subtitle "Gamelan Jawa — Laras Slendro"
\\tempo 80
\\ts 4 4
\\track "Saron" "Srn."
  \\staff{score tabs} \\tuning (E4 B3 G3 D3 A2 E2) \\instrument 11
\\section "A" "Buka (Pembuka)"
:2 0.1 3.1 | :4 5.1 3.1 0.1 3.2 | :2 1.2 0.1 | :1 3.1 |
\\section "B" "Balungan (Melodi Pokok)"
:2 0.1 3.1 | 5.1 3.1 | 0.1 3.2 | 1.2 3.1 |
3.1 5.1 | 3.1 0.1 | 3.2 1.2 | 0.1 3.1 |
\\section "C" "Elaborasi (Peking)"
:8 0.1 3.2 0.1 3.1 0.1 3.1 5.1 3.1 | 5.1 3.1 5.1 8.1 5.1 3.1 0.1 3.1 |
0.1 3.2 1.2 3.2 0.1 3.2 0.1 3.1 | 0.1 3.2 1.2 0.3 1.2 3.2 0.1 3.1 |
3.1 0.1 3.1 5.1 3.1 5.1 8.1 5.1 | 3.1 0.1 3.1 5.1 3.1 0.1 3.2 0.1 |
3.2 1.2 3.2 0.1 3.2 1.2 0.3 1.2 | 0.1 3.2 0.1 3.1 0.1 3.2 0.1 3.1 |
\\section "D" "Suwuk (Penutup)"
:4 5.1 3.1 0.1 3.2 | :2 1.2 :4 3.2 0.1 | :2 3.1 0.1 | :1 3.1 |`,
        description:
          "Lancaran Manyura lengkap (24 bar): Buka → Balungan 2 siklus → Elaborasi kotekan 2 siklus → Suwuk. Slendro (C–D–E–G–A).",
      },
      keyTakeaway:
        "Gamelan bukan sekedar melodi — ia adalah anyaman suara berlapis dengan struktur siklis. Buka membuka, Balungan memberi kerangka, Elaborasi mengisi ornamen, Suwuk menutup.",
    },
    {
      id: "listen-chinese",
      title: "Dengarkan: Wu Sheng (五声) — Pentatonic Tiongkok",
      content: `Tekan **Play** untuk mendengar **Chun Yu (Spring Rain)** — komposisi lengkap bergaya musik tradisional Tiongkok dalam 4 bagian.

Musik Tiongkok dibangun di atas **Wu Sheng** (五声): Gong (宫), Shang (商), Jiao (角), Zhi (征), Yu (羽) = C–D–E–G–A.

- **Xu (序)** — pembuka lambat dan meditatif, memperkenalkan suasana
- **Qi (起)** — tema utama yang mengalir, banyak gerakan step-wise turun khas Tiongkok
- **Cheng (承)** — pengembangan tema ke register tinggi, lebih dramatis
- **He (合)** — resolusi tenang, kembali ke register tengah dan berakhir pada Gong (C)`,
      widget: {
        type: "alphatex-player",
        title: "Chun Yu (春雨): Komposisi Wu Sheng",
        tex: `\\title "Chun Yu (Spring Rain)"
\\subtitle "Wu Sheng — Xu, Qi, Cheng & He"
\\tempo 72
\\ts 4 4
\\track "Guzheng" "Gz."
  \\staff{score tabs} \\tuning (E4 B3 G3 D3 A2 E2) \\instrument acousticguitarnylon
\\section "A" "Xu (Pembuka Lambat)"
:2 3.1 0.1 | :4 3.2 1.2 :2 0.3 | :4 2.3 0.3 :2 1.2 | :1 3.2 |
\\section "B" "Qi (Tema Utama)"
:8 0.1 3.2 1.2 3.2 :4 0.1 3.1 | :8 5.1 3.1 0.1 3.2 :2 1.2 |
:8 3.2 0.1 3.1 0.1 :4 3.1 5.1 | :8 3.1 0.1 3.2 1.2 :2 3.2 |
:8 0.3 2.3 1.2 3.2 :4 0.1 3.2 | :4 1.2 0.3 :2 2.3 |
:8 0.3 2.3 1.2 0.1 :4 3.1 0.1 | :4 3.2 1.2 :2 1.2 |
\\section "C" "Cheng (Pengembangan)"
:8 0.1 3.1 5.1 3.1 :4 8.1 5.1 | :8 3.1 0.1 3.2 1.2 :2 3.2 |
:8 1.2 3.2 0.1 3.1 :4 5.1 3.1 | :8 0.1 3.2 :4 1.2 :2 0.3 |
\\section "D" "He (Resolusi)"
:8 2.3 0.3 1.2 3.2 :4 0.1 3.2 | :4 1.2 0.3 :2 1.2 |
:8 3.2 1.2 0.3 2.3 :4 0.3 1.2 | :1 1.2 |`,
        description:
          "Chun Yu (20 bar): komposisi Wu Sheng lengkap. Alur mengalir dengan gerakan turun dominan, tanpa semitone, murni pentatonic C–D–E–G–A.",
      },
      keyTakeaway:
        "Musik Tiongkok membuktikan bahwa 5 nada sederhana dapat menghasilkan komposisi ekspresif penuh — kuncinya ada di struktur Xu-Qi-Cheng-He dan kontur melodi turun khas.",
    },
    {
      id: "pentatonic-universal",
      title: "Pentatonic: Skala yang Universal",
      content: `**Pentatonic scale** (skala 5 nada) muncul secara independen di hampir SETIAP budaya musik di dunia. Mengapa?

**Major Pentatonic:** C – D – E – G – A (skip F dan B)
**Minor Pentatonic:** A – C – D – E – G (relatif minor)

**Mengapa universal?**
1. **Harmonik alami**: nada-nada pentatonic muncul di overtone series awal
2. **Tidak ada semitone**: 0 half-step = 0 strong dissonance = sangat aman
3. **Vokal natural**: rentang 5 nada sesuai dengan nyaman untuk suara manusia
4. **Bobby McFerrin experiment**: Dalam TED Talk viral, McFerrin menunjukkan audience bisa memprediksi nada pentatonic secara instingtif — tanpa training!

**Pentatonic di berbagai budaya:**
- **Tiongkok**: Wu sheng (宫商角征羽) — fondasi musik tradisional Tiongkok
- **Jepang**: Yo scale (mirip major pentatonic) dan In scale (minor pentatonic + variasi)
- **Skotlandia/Irlandia**: Folk music berbasis pentatonic
- **Afrika Barat**: Banyak tradisi vokal menggunakan pentatonic
- **Blues/Rock**: Minor pentatonic + blue note = blues scale
- **Gamelan Slendro**: 5 nada mendekati equal-spaced pentatonic

**Fun fact:** Pentatonic dipertimbangkan untuk jadi bahasa musik yang dikirim ke luar angkasa (dalam Voyager Golden Record menggunakan musik dari berbagai budaya, banyak yang pentatonic).`,
      widget: {
        type: "quiz",
        questions: [
          {
            question: "Mengapa pentatonic muncul di hampir semua budaya?",
            options: [
              "Karena disebarkan dari satu bangsa",
              "Karena tidak punya semitone dan muncul natural di overtone series",
              "Karena hanya punya 5 nada (mudah diingat)",
              "Karena piano punya 5 tuts hitam",
            ],
            correctIndex: 1,
            explanation:
              "Pentatonic universal karena nada-nadanya muncul di deret harmonik alami DAN tidak mengandung semitone (yang menghasilkan dissonance kuat).",
          },
          {
            question: "Quarter tones dalam maqam berarti:",
            options: [
              "Nada yang dimainkan seperempat durasi",
              "Nada yang berada di antara dua nada piano (~50 cents)",
              "Nada yang dimainkan oleh 4 instrumen",
              "Nada yang volumenya 1/4",
            ],
            correctIndex: 1,
            explanation:
              "Quarter tone ≈ 50 cents, tepat di antara dua semitone. Ini memungkinkan maqam memiliki 24 nada per oktaf, bukan 12.",
          },
          {
            question: "Ombak pada gamelan adalah:",
            options: [
              "Cacat tuning yang tidak disengaja",
              "Beating yang sengaja diciptakan dari pasangan instrumen",
              "Ritme gelombang laut",
              "Teknik memukul instrumen",
            ],
            correctIndex: 1,
            explanation:
              "Ombak (pulsation/beating) sengaja diciptakan dengan men-tune pasangan instrumen sedikit berbeda. Ini menghasilkan suara bergetar khas gamelan.",
          },
          {
            question: "Debussy terpengaruh oleh gamelan Jawa saat:",
            options: [
              "Berkunjung ke Jawa tahun 1870",
              "Paris Exposition 1889",
              "Belajar di Konservatorium Jakarta",
              "Membaca buku tentang musik Asia",
            ],
            correctIndex: 1,
            explanation:
              "Claude Debussy mendengar gamelan Jawa di Exposition Universelle di Paris tahun 1889, yang sangat mempengaruhi gaya komposisinya.",
          },
        ],
      },
      keyTakeaway:
        "Pentatonic adalah skala paling universal di dunia — muncul secara independen di hampir setiap budaya karena hubungannya yang natural dengan deret harmonik.",
    },
    {
      id: "listen-pentatonic",
      title: "Dengarkan: Pentatonic dalam Aksi",
      content: `Tekan **Play** untuk mendengar **komposisi folk pentatonic lengkap** (20 bar) — membuktikan bahwa hanya 5 nada bisa membentuk lagu utuh.

Melodi menggunakan **pentatonic mayor** (C–D–E–G–A) — tanpa semitone, tanpa disonansi kuat.

- **Tema Utama** — melodi 8 bar yang natural dan mudah diikuti, bergerak naik dari register rendah
- **Variasi** — pengembangan tema yang lebih cepat dan dinamis, menjangkau register tinggi (C5)
- **Penutup** — resolusi tenang yang kembali ke nada dasar C

Cobalah bersenandung mengikuti — Anda akan menemukan bahwa prediksi Anda soal "nada selanjutnya" hampir selalu benar!`,
      widget: {
        type: "alphatex-player",
        title: "Pentatonic Folk: Komposisi Lengkap",
        tex: `\\title "Pentatonic Folk"
\\subtitle "5 Nada Universal — Melodi Dunia"
\\tempo 100
\\ts 4 4
\\track "Guitar" "Gtr."
  \\staff{score tabs} \\tuning (E4 B3 G3 D3 A2 E2) \\instrument acousticguitarsteel
\\section "A" "Tema Utama"
:4 1.2 3.2 0.1 3.1 | 5.1 3.1 0.1 3.2 | 0.3 2.3 1.2 3.2 | :2 0.1 3.1 |
:8 5.1 3.1 0.1 3.2 :4 1.2 3.2 | :8 0.1 3.1 :4 5.1 :2 3.1 | :4 0.1 3.2 1.2 3.2 | :1 1.2 |
\\section "B" "Variasi"
:8 3.1 0.1 3.1 5.1 :4 8.1 5.1 | :8 3.1 0.1 :4 3.2 :2 1.2 |
:8 0.3 2.3 1.2 3.2 :4 0.1 3.1 | :8 5.1 3.1 :4 0.1 :2 3.2 |
:8 1.2 3.2 0.1 3.1 5.1 3.1 0.1 3.2 | :4 1.2 0.3 :2 2.3 |
:8 0.3 2.3 1.2 3.2 0.1 3.1 5.1 3.1 | :4 0.1 3.2 :2 1.2 |
\\section "C" "Penutup"
:4 1.2 3.2 :2 0.1 | :4 3.2 1.2 :2 0.3 | :4 2.3 0.3 1.2 3.2 | :1 1.2 |`,
        description:
          "Komposisi folk pentatonic lengkap (20 bar): Tema → Variasi → Penutup. Murni pentatonic mayor C–D–E–G–A, tanpa semitone.",
      },
      keyTakeaway:
        "Pentatonic terdengar natural karena berasal dari overtone series. 5 nada cukup untuk komposisi lengkap — bukti universalitas skala ini di setiap budaya.",
    },
  ],

  crossRefs: [
    { type: "knowledge", id: "math-of-music", label: "Matematika dalam Musik" },
    {
      type: "knowledge",
      id: "history-of-music",
      label: "Sejarah Musik Barat",
    },
    {
      type: "knowledge",
      id: "psychology-of-music",
      label: "Psikologi Musik",
    },
    {
      type: "knowledge",
      id: "acoustics-of-sound",
      label: "Akustik & Gelombang Suara",
    },
    { type: "nolopedia", id: "interval", label: "Interval" },
    { type: "interval", id: "P5", label: "Perfect Fifth" },
    { type: "interval", id: "M3", label: "Major Third" },
    { type: "interval", id: "m3", label: "Minor Third" },
  ],
  relatedArticles: [
    "math-of-music",
    "history-of-music",
    "psychology-of-music",
    "acoustics-of-sound",
    "rhythm-and-meter",
  ],
};
