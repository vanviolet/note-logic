/**
 * Script to add learning data to all scales in scales.tsx that don't have it yet.
 * Run: node script/add-scale-learning.mjs
 */
import { readFileSync, writeFileSync } from "fs";

const FILE = "app/theory-music/scales.tsx";
let src = readFileSync(FILE, "utf-8");

// ── Learning data for each scale key ──────────────────
// Keys that already have learning data (from previous edits) are excluded.
const LEARNING_MAP = {
  // ── Melodic Minor Modes ──
  dorian_b2: {
    practiceTips: [
      "Bandingkan dengan Dorian biasa — satu-satunya perbedaan adalah b2.",
      "Mainkan di atas m7sus chord untuk merasakan warna Javanese.",
      "Latih phrase yang memainkan b2→b3 sebagai motif melodis.",
    ],
    earTrainingHint:
      "Dorian dengan opening gelap karena b2. Terasa minor tapi dengan nuansa Southeast Asian yang misterius.",
    harmonicApplications: [
      "Konteks m7 voicing di jazz fusion.",
      "Warna Southeast Asian untuk komposisi world music.",
    ],
  },
  lydian_augmented: {
    practiceTips: [
      "Fokus pada #4 dan #5 — keduanya membuat rasa floating/ethereal.",
      "Mainkan di atas maj7#5 chord untuk merasakan warna unik ini.",
      "Bandingkan dengan Lydian biasa — satu-satunya perbedaan adalah #5.",
    ],
    earTrainingHint:
      "Lydian yang bahkan lebih floating karena #5. Terdengar dreamlike dan surreal.",
    harmonicApplications: [
      "Solo di atas maj7#5 voicings.",
      "Film scoring untuk nuansa supernatural/fantasi.",
    ],
  },
  lydian_dominant: {
    practiceTips: [
      "Ini 'the jazz scale' untuk tritone substitution — pahami konsep ini.",
      "Mainkan di atas 7#11 chord — tekankan #4 sebagai color tone.",
      "Bandingkan dengan Mixolydian (only diff = #4).",
    ],
    earTrainingHint:
      "Major dan dominant, tapi dengan rasa 'melayang' dari #4. Terdengar sophisticated dan jazzy.",
    harmonicApplications: [
      "Solo di atas 7#11, 9#11, 13#11 chords.",
      "Tritone substitution context di jazz.",
      "Bartók-inspired composition.",
    ],
  },
  mixolydian_b6: {
    practiceTips: [
      "Bandingkan dengan Mixolydian biasa — satu-satunya perbedaan adalah b6.",
      "Mainkan resolusi V→i (dominant ke minor) menggunakan skala ini.",
      "Tekankan kontras 3 (major) vs b6 (dark) — inilah tension khasnya.",
    ],
    earTrainingHint:
      "Major 3rd yang cerah bertabrakan dengan b6 yang gelap — menimbulkan rasa nostalgic dan bittersweet.",
    harmonicApplications: [
      "V chord yang resolve ke minor (dominant preparation).",
      "Indian fusion context — 'Hindu scale' terkenal.",
    ],
  },
  locrian_natural2: {
    practiceTips: [
      "Ini skala utama untuk m7b5 chord di jazz — wajib kuasai.",
      "Bandingkan dengan Locrian biasa — natural 2 membuatnya lebih smooth.",
      "Latih di atas ii chord dalam minor key (e.g., Bm7b5 di key Am).",
    ],
    earTrainingHint:
      "Locrian yang lebih 'sopan' karena natural 2. Masih gelap tapi lebih playable dan cantik.",
    harmonicApplications: [
      "Solo di atas m7b5 chords (half-diminished).",
      "ii-V-i di minor key — scale untuk ii chord.",
    ],
  },
  altered: {
    practiceTips: [
      "Wajib untuk jazz: setiap V7alt chord menggunakan skala ini.",
      "Latih pattern descending — lebih natural untuk resolusi.",
      "Relate ke melodic minor: Altered = mode 7 dari melodic minor satu semitone di atas root.",
    ],
    earTrainingHint:
      "Sangat tense dan chromatic — semua tension notes hadir (b9, #9, b5, #5). Terdengar 'meledak' sebelum resolve.",
    harmonicApplications: [
      "Solo di atas 7alt, 7b9, 7#9, 7b5, 7#5 chords.",
      "V7→Imaj7 resolution yang intens di jazz.",
      "Bebop dan contemporary jazz vocabulary.",
    ],
  },

  // ── Harmonic Minor Modes ──
  harmonic_minor_mode2: {
    practiceTips: [
      "Jarang standalone — pelajari sebagai bagian dari sistem harmonic minor.",
      "Mainkan di atas m7b5 chord untuk warna yang berbeda dari Locrian ♮2.",
    ],
    earTrainingHint:
      "Locrian dengan natural 6 — sedikit lebih bright di upper structure tapi tetap gelap overall.",
    harmonicApplications: ["Konteks ii chord di harmonic minor system."],
  },
  ionian_augmented: {
    practiceTips: [
      "Mainkan di atas maj7#5 chord.",
      "Bandingkan dengan Ionian biasa — #5 satu-satunya perbedaan.",
    ],
    earTrainingHint:
      "Major yang 'aneh' karena #5. Terdengar cerah tapi dengan twist yang unexpected.",
    harmonicApplications: ["Konteks bIII chord di harmonic minor system."],
  },
  dorian_sharp4: {
    practiceTips: [
      "Kenal juga sebagai Romanian Scale — kaya tradisi musik Eastern European.",
      "Fokus pada #4 yang memberi warna lebih dramatis dari Dorian biasa.",
    ],
    earTrainingHint:
      "Dorian dengan satu nada berbeda: #4 yang memberi drama. Warna Romanian dan Klezmer.",
    harmonicApplications: [
      "Romanian folk dan Klezmer music.",
      "Konteks iv chord di harmonic minor system.",
    ],
  },
  lydian_sharp2: {
    practiceTips: [
      "Jarang dipakai standalone — pahami sebagai bagian dari harmonic minor system.",
      "Fokus pada gap #2→3 (augmented 2nd dari root).",
    ],
    earTrainingHint:
      "Lydian cerah dengan gap tonal unik di bawah (#2→3). Terdengar bright tapi 'exotic'.",
    harmonicApplications: ["Konteks bVI chord di harmonic minor system."],
  },
  ultralocrian: {
    practiceTips: [
      "Mode paling gelap — gunakan hanya untuk warna khusus.",
      "Relate ke dim7 chord context.",
    ],
    earTrainingHint:
      "Paling gelap dan diminished dari semua harmonic minor modes. Terdengar chaotic dan tense.",
    harmonicApplications: ["Konteks vii°7 chord di harmonic minor system."],
  },

  // ── Pentatonic extras ──
  egyptian_pent: {
    practiceTips: [
      "Tanpa 3rd → ambiguous major/minor. Gunakan untuk soundscape yang 'ancient'.",
      "Mode 2 dari major pentatonic — pindah posisi box saja.",
      "Cocok untuk sus2, sus4, dan 7sus4 chords.",
    ],
    earTrainingHint:
      "Terdengar open, spacious, dan ancient. Tanpa major atau minor quality — ambiguous dan misterius.",
    harmonicApplications: [
      "Komposisi bertema ancient, Egyptian, atau 'desert'.",
      "Solo di atas sus chords.",
      "World music dan ambient textures.",
    ],
  },
  man_gong_pent: {
    practiceTips: [
      "Mode 3 dari major pentatonic — shift box positions.",
      "Lebih gelap dari minor pentatonic biasa karena b6.",
    ],
    earTrainingHint:
      "Minor pentatonic yang lebih gelap — b6 menambah rasa kesedihan yang dalam.",
    harmonicApplications: [
      "Warna gelap untuk komposisi minor.",
      "Traditional Chinese music context.",
    ],
  },
  ritusen_pent: {
    practiceTips: [
      "Mode 4 dari major pentatonic — explore sebagai alternative 'pastoral' sound.",
      "Tanpa 3rd dan 7th → sangat open dan celtic.",
    ],
    earTrainingHint:
      "Terdengar pastoral, celtic, dan optimistic tanpa definisi major/minor yang jelas.",
    harmonicApplications: [
      "Celtic dan Scottish folk music.",
      "Japanese traditional music.",
      "Ambient dan pastoral compositions.",
    ],
  },

  // ── Blues extra ──
  major_blues: {
    practiceTips: [
      "Mix dengan minor blues untuk vocabulary yang lebih kaya.",
      "Chromatic passing tone b3→3 sangat ekspresif — latih slide/hammer-on.",
      "Mainkan di atas dominant 7th chords untuk country/blues feel.",
    ],
    earTrainingHint:
      "Happy blues — major pentatonic dengan 'grit' dari chromatic passing b3. Pikirkan country dan gospel.",
    harmonicApplications: [
      "Country blues dan gospel.",
      "Mixing major/minor blues untuk lead playing.",
      "Solo di atas major dan dominant chords.",
    ],
  },

  // ── Symmetric ──
  whole_tone: {
    practiceTips: [
      "Hanya 2 transposisi unik (C whole tone dan Db whole tone) — pelajari keduanya.",
      "Gunakan sebagai 'effect' bukan tonality utama — paling efektif sebagai passer.",
      "Piano: semua whole-step → fingering sangat reguler: 1-2-3-1-2-3.",
    ],
    earTrainingHint:
      "Dreamlike, mengambang, tanpa gravitasi. Tidak ada resting point. Pikirkan suara harp shimmer di film.",
    harmonicApplications: [
      "Solo di atas augmented dan 7#5 chords.",
      "Transitional passages — 'dissolve' effect.",
      "Impressionist composition (Debussy).",
    ],
  },
  diminished_hw: {
    practiceTips: [
      "Hanya 3 transposisi unik — pelajari ketiganya.",
      "Sangat kaya tension notes (b9, #9, #11, 13) — ideal untuk jazz dominant.",
      "Latih pattern simetris: H-W-H-W-H-W-H-W.",
    ],
    earTrainingHint:
      "Tension bertumpuk — terdengar 'chromatic tapi terstruktur'. Warna jazz yang sophisticated dan dark.",
    harmonicApplications: [
      "Solo di atas 7b9, 7#9, 13b9 chords.",
      "Bebop dan advanced jazz.",
      "Film score tension building.",
    ],
  },
  diminished_wh: {
    practiceTips: [
      "Dipakai di atas dim7 chord — 3 transposisi unik.",
      "Pattern simetris W-H-W-H — latih dengan awareness akan symmetry-nya.",
    ],
    earTrainingHint:
      "Similar ke H-W diminished tapi 'dimulai dari tempat berbeda'. Karakter diminished yang kuat.",
    harmonicApplications: [
      "Solo di atas dim7 dan mMaj7 chords.",
      "Messiaen dan Bartók-inspired composition.",
    ],
  },
  chromatic: {
    practiceTips: [
      "Latih ascending/descending 12 semitone sebagai warmup teknis.",
      "Piano: gunakan fingering 1-3-1-3-1-2-3-1-3-1-3-1 (standard chromatic fingering).",
      "Gitar: gunakan 4 frets per string dengan 4 jari untuk legato exercise.",
    ],
    earTrainingHint:
      "Semua 12 nada — tidak ada 'warna' tonal. Digunakan untuk efek, bukan tonalitas.",
    harmonicApplications: [
      "Chromatic passing tones di semua konteks.",
      "Teknik latihan (warmup, finger independence).",
      "Atonal dan serial composition.",
    ],
  },
  augmented_scale: {
    practiceTips: [
      "4 transposisi unik — dibangun dari 2 augmented triads.",
      "Latih alternating antara 2 augmented triads yang membentuk skala ini.",
    ],
    earTrainingHint:
      "Simetris dan 'mengambang' — rasa augmented yang kuat. Warna Coltrane-esque.",
    harmonicApplications: [
      "Solo di atas aug dan maj7#5 chords.",
      "Coltrane changes vocabulary.",
    ],
  },
  tritone_scale: {
    practiceTips: [
      "Dari 2 major triads berjarak tritone — latih kedua triad terpisah dulu.",
      "Sangat polytonal — gunakan hanya jika paham konteks harmoniknya.",
    ],
    earTrainingHint:
      "Sangat bi-tonal — 2 major triads berjarak tritone bertabrakan. Petrushka effect.",
    harmonicApplications: [
      "Stravinsky-style polytonal composition.",
      "Advanced jazz chromaticism.",
    ],
  },

  // ── Bebop ──
  bebop_dominant: {
    practiceTips: [
      "Kunci: passing tone (natural 7) harus jatuh di offbeat agar chord tones tepat di downbeat.",
      "Latih 8th note runs descending — ini konteks utama di jazz.",
      "Mainkan di atas dominant 7 chord dalam swing tempo.",
    ],
    earTrainingHint:
      "Mixolydian yang terdengar 'jazz' karena chromatic passing. 8th note lines yang smooth.",
    harmonicApplications: [
      "Solo di atas 7, 9, 13 chords di jazz.",
      "Bebop line vocabulary — ascending/descending 8th notes.",
    ],
  },
  bebop_major: {
    practiceTips: [
      "Chromatic passing b6 harus jatuh di offbeat.",
      "Latih di atas maj7 dan 6 chord context.",
    ],
    earTrainingHint:
      "Major scale yang terdengar 'jazzy' karena chromatic passing b6.",
    harmonicApplications: [
      "Solo di atas maj7 dan 6 chords.",
      "Bebop lines di konteks major.",
    ],
  },
  bebop_dorian: {
    practiceTips: [
      "Chromatic passing 3 (major 3rd) harus di offbeat.",
      "Latih di atas m7 chord context.",
    ],
    earTrainingHint:
      "Dorian yang terdengar 'jazzy' karena chromatic passing major 3rd.",
    harmonicApplications: [
      "Solo di atas m7 dan m9 chords.",
      "Minor ii-V-i bebop lines.",
    ],
  },
  bebop_locrian: {
    practiceTips: [
      "Natural 5 sebagai passing tone menjaga chord tones di downbeat.",
      "Paling jarang dipakai dari bebop scales tapi penting untuk m7b5 context.",
    ],
    earTrainingHint:
      "Locrian yang di-smooth-kan dengan natural 5 passing tone.",
    harmonicApplications: ["Solo di atas m7b5 chords dalam bebop lines."],
  },

  // ── Middle Eastern ──
  double_harmonic: {
    teachingOrder: 13,
    pianoFingering: {
      referenceRoot: "C",
      rightHandAsc: "1-2-3-1-2-3-4-5",
      leftHandAsc: "5-4-3-2-1-3-2-1",
      notes:
        "Dua augmented 2nd gaps (b2-3 dan b6-7). Stretching jari diperlukan — latih pelan.",
    },
    practiceTips: [
      "Latih augmented 2nd intervals secara terpisah — b2→3 dan b6→7.",
      "Identik dengan Raga Bhairav — explore koneksi cross-cultural.",
      "Mainkan descending untuk merasakan warna Byzantine/Arabic.",
    ],
    earTrainingHint:
      "Sangat dramatic dan 'exotic Middle-Eastern'. Dua gap augmented 2nd memberikan warna Byzantine kuat. Pikirkan Misirlou.",
    harmonicApplications: [
      "Komposisi Arabic, Byzantine, dan Middle-Eastern.",
      "Film scoring dramatic/exotic.",
      "Metal riffing dengan warna Eastern.",
    ],
  },
  maqam_hijaz: {
    practiceTips: [
      "Identik dengan Phrygian Dominant — setelah kuasai Phrygian Dom, ini otomatis bisa.",
      "Mainkan dengan ornamentasi khas Arabic: melisma, trills, dan grace notes.",
    ],
    earTrainingHint:
      "Warna spiritual Arabic yang khas. Identik dengan Phrygian Dominant — b2 + 3 + b6.",
    harmonicApplications: [
      "Musik Arabic dan Turkish classical.",
      "Oud dan ney improvisasi.",
    ],
  },
  maqam_bayati: {
    practiceTips: [
      "Identik dengan Phrygian — explore ornamentasi khas Arabic.",
      "Microtonalnya tidak captured di 12-TET — di dunia Arab, quarter-tone dipakai.",
    ],
    earTrainingHint:
      "Warna melankolis Arabic — Phrygian dalam konteks Timur Tengah. Emosional dan meditatif.",
    harmonicApplications: [
      "Musik Arabic classical dan folk.",
      "Backdrop melankolis untuk komposisi film Middle-Eastern.",
    ],
  },
  maqam_rast: {
    practiceTips: [
      "Identik dengan Mixolydian di 12-TET — explore ornamentasi Arab.",
      "Maqam 'default' Arab — ini starting point untuk belajar maqam system.",
    ],
    earTrainingHint:
      "Royal dan confident — Mixolydian dalam konteks Arab. Warna celebratory.",
    harmonicApplications: ["Musik Arabic classical.", "Andalusian music."],
  },
  maqam_saba: {
    practiceTips: [
      "Maqam paling emosional — gunakan phrasing yang ekspresif dan rubato.",
      "Dua augmented gap menciptakan drama intens — latih interval awareness.",
    ],
    earTrainingHint:
      "Paling emosional dan dramatic dari maqam Arab. Warna melankolis yang sangat dalam.",
    harmonicApplications: [
      "Ekspresi emosional dalam musik Arab.",
      "Tarab tradition (ecstasy music).",
    ],
  },
  maqam_nahawand: {
    practiceTips: [
      "Identik dengan Harmonic Minor — koneksi langsung dengan Western harmony.",
      "Mainkan dengan ornamentasi Arab untuk mendapat feel Nahawand yang autentik.",
    ],
    earTrainingHint:
      "Harmonic Minor dalam konteks Arab — dramatic dan resolving.",
    harmonicApplications: [
      "Penutup/resolusi dalam musik Arabic.",
      "Koneksi dengan harmonic minor Western.",
    ],
  },
  turkish_zirguleli: {
    practiceTips: [
      "Identik dengan Hungarian Minor — explore kedua tradisi.",
      "Dua augmented 2nd gaps — sama dengan Hungarian Minor.",
    ],
    earTrainingHint:
      "Hungarian Minor/Double Harmonic Minor dalam konteks Turkish. Sangat dramatis.",
    harmonicApplications: [
      "Turkish classical music.",
      "Klezmer dan Hungarian cross-reference.",
    ],
  },

  // ── Indian ──
  raga_bhairav: {
    practiceTips: [
      "Identik dengan Double Harmonic Major — gateway raga untuk pemula.",
      "Traditionally sung di morning hours — explore time-of-day raga theory.",
      "Ornamentasi: gunakan meend (glides) dan gamaka (oscillations).",
    ],
    earTrainingHint:
      "Serious dan devosional — warna Double Harmonic dalam konteks Indian. Morning raga feeling.",
    harmonicApplications: [
      "Indian classical improvisation.",
      "Bhajan (devotional songs).",
      "Bollywood dramatic sequences.",
    ],
  },
  raga_todi: {
    practiceTips: [
      "Raga yang sangat serius — mainkan pelan dan meditatif.",
      "b2 + #4 + b6 menciptakan warna gelap unik.",
    ],
    earTrainingHint:
      "Gelap, serius, dan meditatif. Warna yang sangat unik — tidak ada padanan langsung di Western scales.",
    harmonicApplications: [
      "Meditasi dan contemplation.",
      "Indian classical morning raga (late morning).",
    ],
  },
  raga_kafi: {
    practiceTips: [
      "Identik dengan Dorian — sangat accessible untuk pemula.",
      "Ringan dan sensual — cocok untuk thumri (semi-classical).",
    ],
    earTrainingHint:
      "Dorian dalam konteks Indian — ringan, romantic, dan accessible.",
    harmonicApplications: [
      "Semi-classical Indian music (thumri, dadra).",
      "Bollywood romantic songs.",
    ],
  },
  raga_bhairavi: {
    practiceTips: [
      "Queen of Ragas — identik dengan Phrygian.",
      "Bisa dimainkan kapan saja (tidak terikat waktu) — sangat fleksibel.",
    ],
    earTrainingHint:
      "Phrygian yang emosional dan versatile. 'Queen of Ragas' karena bisa mengekspresikan semua rasa.",
    harmonicApplications: [
      "Closing raga performances.",
      "Bhajan, ghazal, dan bollywood.",
    ],
  },
  raga_yaman: {
    practiceTips: [
      "Identik dengan Lydian — raga malam paling populer.",
      "Mulai dari Ma (#4) instead of Sa (1) untuk authentic feel.",
    ],
    earTrainingHint:
      "Lydian dalam konteks Indian — cerah, optimistic, dan meditasi malam. Rasa 'floating'.",
    harmonicApplications: [
      "Evening raga in Hindustani classical.",
      "Indian fusion music.",
    ],
  },
  raga_marwa: {
    practiceTips: [
      "Raga senja yang intens — Sa (root) jarang digunakan sebagai landing note.",
      "b2 + #4 menciptakan tension luar biasa — pelajari phrasing khas.",
    ],
    earTrainingHint:
      "Sangat tense dan intens. Root terasa 'unstable' — raga yang mengeksplorasi tension tanpa resolusi mudah.",
    harmonicApplications: [
      "Evening Indian classical performance.",
      "Exploration of tension without easy resolution.",
    ],
  },
  raga_purvi: {
    practiceTips: [
      "Mirip Marwa tapi b6 (bukan 6) — lebih gelap.",
      "Afternoon raga yang contemplative.",
    ],
    earTrainingHint:
      "Gelap dan contemplative — Marwa yang lebih introspective karena b6.",
    harmonicApplications: [
      "Afternoon Indian classical performance.",
      "Introspective, contemplative music.",
    ],
  },
  raga_asavari: {
    practiceTips: [
      "Identik dengan Natural Minor/Aeolian.",
      "Di Hindustani, pelajari phrasing dan ornamentasi yang membedakan dari Western minor.",
    ],
    earTrainingHint:
      "Natural Minor dalam konteks Indian — sedih dan emosional.",
    harmonicApplications: [
      "Indian classical minor context.",
      "Cross-reference dengan Western minor harmony.",
    ],
  },
  raga_bilawal: {
    practiceTips: [
      "Identik dengan Major/Ionian — starting point Hindustani system.",
      "Pelajari Sa-Re-Ga-Ma-Pa-Dha-Ni-Sa solfege system.",
    ],
    earTrainingHint: "Major scale dalam konteks Indian. Cerah dan upbeat.",
    harmonicApplications: [
      "Basic Hindustani classical.",
      "Cross-reference dengan Western major harmony.",
    ],
  },
  mayamalavagowla: {
    practiceTips: [
      "Identik dengan Double Harmonic/Bhairav — fundamental Carnatic raga.",
      "Starting point untuk belajar Carnatic (South Indian) music.",
    ],
    earTrainingHint:
      "Double Harmonic dalam konteks Carnatic — serious dan devosional.",
    harmonicApplications: [
      "Carnatic classical fundamental.",
      "South Indian devotional music.",
    ],
  },
  shankarabharanam: {
    practiceTips: [
      "Identik dengan Major/Ionian — fundamental Carnatic raga.",
      "Grand dan celebratory — pelajari kriti compositions dalam raga ini.",
    ],
    earTrainingHint:
      "Major scale dalam konteks Carnatic — grand dan celebratory.",
    harmonicApplications: [
      "Carnatic classical performances.",
      "South Indian devotional music.",
    ],
  },

  // ── East Asian ──
  japanese_insen: {
    practiceTips: [
      "b2 + 4 + b7 tanpa 3rd dan 6th — sangat atmospheric.",
      "Mainkan dengan sustain/delay untuk nuansa meditatif.",
    ],
    earTrainingHint:
      "Misterius, meditatif, dan atmospheric. Warna Jepang kuno — zen garden soundscape.",
    harmonicApplications: [
      "Japanese-themed composition.",
      "Ambient dan game music.",
      "Film score Asian atmosphere.",
    ],
  },
  hirajoshi: {
    practiceTips: [
      "Mudah dimainkan di gitar — hanya 5 nada dengan spacing ergonomis.",
      "Populer di rock/metal untuk warna Japanese — Eddie Van Halen sering memakainya.",
    ],
    earTrainingHint:
      "Melankolis, zen, dan elegan — rasa Jepang yang paling dikenal di context gitar modern.",
    harmonicApplications: [
      "Japanese-themed rock/metal passages.",
      "Ambient dan atmospheric music.",
    ],
  },
  iwato: {
    practiceTips: [
      "Pentatonic paling gelap — tanpa perfect 5th.",
      "Gunakan untuk rasa supranatural dan misterius.",
    ],
    earTrainingHint:
      "Sangat dark dan 'haunted'. Rasa supranatural Jepang — b2 + b5 tanpa 5th.",
    harmonicApplications: [
      "Horror dan dark atmospheric music.",
      "Japanese traditional 'dark' context.",
    ],
  },
  yo_scale: {
    practiceTips: [
      "Pentatonic 'bright' Jepang — mirip major pentatonic tanpa 3rd.",
      "Mudah diakses karena mirip dengan pola yang sudah dikenal.",
    ],
    earTrainingHint:
      "Cheerful dan folk — warna Japanese festival dan folk songs.",
    harmonicApplications: [
      "Japanese folk music (minyo).",
      "Upbeat Asian-themed compositions.",
    ],
  },
  chinese_pentatonic: {
    practiceTips: [
      "Identik dengan Major Pentatonic — explore ornamentasi khas Chinese.",
      "Gunakan grace notes dan trills untuk warna traditional Chinese.",
    ],
    earTrainingHint:
      "Major Pentatonic dalam konteks Chinese — cerah dan traditional.",
    harmonicApplications: [
      "Traditional Chinese music composition.",
      "Erhu, guqin, dan simfoni Chinese.",
    ],
  },
  chinese_jue: {
    practiceTips: [
      "Mode 3 Chinese pentatonic — mysterious dan ancient.",
      "Mirip Egyptian pentatonic — cross-cultural connection.",
    ],
    earTrainingHint:
      "Mysterious dan ancient Chinese — tanpa 3rd, ambiguous tonality.",
    harmonicApplications: [
      "Traditional Chinese music.",
      "Film score ancient/dynasty themes.",
    ],
  },
  korean_pyongjo: {
    practiceTips: [
      "Mirip Yo scale Jepang dan Ritusen — cross-cultural pentatonic connection.",
      "Serene dan peaceful — mainkan dengan rubato.",
    ],
    earTrainingHint: "Serene dan peaceful — Korean traditional folk feeling.",
    harmonicApplications: [
      "Korean traditional music (gugak).",
      "Korean folk and film music.",
    ],
  },
  balinese_pelog: {
    practiceTips: [
      "Gamelan tuning di 12-TET — perhatikan ini approximation.",
      "b2 dan b6 memberi warna exotic dan dramatis.",
    ],
    earTrainingHint:
      "Exotic dan dramatis — warna gamelan Bali/Jawa. Mirip Hirajoshi tapi lebih mysterious.",
    harmonicApplications: [
      "Gamelan-inspired composition.",
      "World fusion music.",
    ],
  },
  balinese_slendro: {
    practiceTips: [
      "Near-equidistant tuning di 12-TET — mirip Egyptian/Suspended pentatonic.",
      "Gamelan Jawa menggunakan tuning actual yang berbeda dari 12-TET.",
    ],
    earTrainingHint:
      "Open dan spacious — mirip Egyptian pentatonic. Warna gamelan Jawa yang tenang.",
    harmonicApplications: [
      "Javanese gamelan-inspired composition.",
      "World fusion dan ambient.",
    ],
  },

  // ── Hungarian/Romani/Klezmer (extras, hungarian_minor already done) ──
  hungarian_major: {
    practiceTips: [
      "Sangat exotic — #2 + #4 dalam konteks major.",
      "Rare scale — pelajari setelah menguasai basics.",
    ],
    earTrainingHint:
      "Major yang 'exotic' dan dramatic — #2 dan #4 memberi warna Hungarian/Romani.",
    harmonicApplications: [
      "Hungarian folk music.",
      "Romani dan Klezmer fusion.",
    ],
  },
  romani_scale: {
    practiceTips: [
      "#4 dan b6 memberi dramatic tension pada pola minor.",
      "Mainkan dengan vibrato dan ornamentasi ekspresif.",
    ],
    earTrainingHint:
      "Gypsy passion — minor yang sangat emosional dan dramatic. #4 memberi 'twist'.",
    harmonicApplications: [
      "Romani/Gypsy jazz.",
      "Flamenco fusion.",
      "Film score passionate scenes.",
    ],
  },
  klezmer: {
    practiceTips: [
      "Identik dengan Dorian #4 / Harmonic Minor mode 4.",
      "Gunakan ornamentasi khas klezmer: trills, grace notes, crying bends.",
    ],
    earTrainingHint:
      "Dorian dengan #4 — warna 'Jewish/Eastern European' yang distinctive. Rasa expressive dan emosional.",
    harmonicApplications: ["Klezmer music tradition.", "Jewish folk music."],
  },

  // ── Spanish/Flamenco ──
  spanish_8tone: {
    practiceTips: [
      "8 nada — mengandung major DAN minor 3rd sekaligus.",
      "Gunakan major 3rd saat ascending, minor 3rd saat descending untuk kontras.",
    ],
    earTrainingHint:
      "Sangat Spanish — kombinasi major/minor 3rd memberi warna passionate dan dramatic.",
    harmonicApplications: ["Flamenco composition.", "Latin jazz soloing."],
  },
  flamenco_scale: {
    practiceTips: [
      "Andalusian cadence (Am-G-F-E) = natural habitat skala ini.",
      "Mix Phrygian dan Phrygian Dominant di satu phrase untuk authentic flamenco.",
    ],
    earTrainingHint:
      "Paling 'flamenco' — Phrygian + major 3rd memberikan warna Andalusian yang kuat.",
    harmonicApplications: [
      "Flamenco guitar composition.",
      "Spanish guitar arrangements.",
      "Latin jazz fusion.",
    ],
  },

  // ── African ──
  ethiopian_tizita_major: {
    practiceTips: [
      "Identik dengan Major Pentatonic — explore Ethio-jazz ornamentasi.",
      "Tizita = 'kenangan' — mainkan dengan ekspresi nostalgic.",
    ],
    earTrainingHint:
      "Major Pentatonic dalam konteks Ethiopia — nostalgic dan warm.",
    harmonicApplications: [
      "Ethiopian music dan Ethio-jazz.",
      "Afro-fusion compositions.",
    ],
  },
  ethiopian_tizita_minor: {
    practiceTips: [
      "Mirip Hirajoshi — cross-cultural connection yang menarik.",
      "Warna melankolis Ethiopia — mainkan dengan rubato dan ekspresi.",
    ],
    earTrainingHint:
      "Minor pentatonic variation Ethiopia — melankolis dan emotional.",
    harmonicApplications: [
      "Ethiopian emotional music.",
      "Ethio-jazz minor context.",
    ],
  },
  ethiopian_anchihoye: {
    practiceTips: [
      "Identik dengan Minor Pentatonic — explore Ethiopian context.",
    ],
    earTrainingHint:
      "Minor Pentatonic dalam konteks Ethiopian — bluesy dan folk.",
    harmonicApplications: ["Ethiopian pop dan folk."],
  },
  west_african_pent: {
    practiceTips: [
      "Identik dengan Major Pentatonic — explore Kora tuning dan Manding tradition.",
      "Mainkan dengan pattern repetitif khas West African rhythmic tradition.",
    ],
    earTrainingHint:
      "Major Pentatonic dalam konteks West African — cerah dan celebratory. Warna Kora.",
    harmonicApplications: [
      "Manding/Griot music tradition.",
      "Afrobeat dan Highlife.",
    ],
  },

  // ── European Folk ──
  neapolitan_major: {
    practiceTips: [
      "Melodic Minor dengan b2 — warna operatic.",
      "Rare tapi penting untuk classical composition vocabulary.",
    ],
    earTrainingHint:
      "Melodic minor yang di-gelap-kan oleh b2. Warna Italian opera.",
    harmonicApplications: ["Classical composition.", "Opera dan oratorio."],
  },
  neapolitan_minor: {
    practiceTips: [
      "Harmonic Minor dengan b2 — paling gelap di European tradition.",
      "Gunakan bII chord (Neapolitan chord) sebagai signature harmonic move.",
    ],
    earTrainingHint:
      "Paling gelap di European minor — Harmonic Minor + b2 = maximum drama.",
    harmonicApplications: [
      "Neapolitan chord usage di classical.",
      "Opera dan dramatic classical pieces.",
    ],
  },
  enigmatic_scale: {
    practiceTips: [
      "Skala eksperimental Verdi — ascending chromatic quality dari #4 keatas.",
      "Tidak ada perfect 5th — sangat unusual dan challenging.",
    ],
    earTrainingHint:
      "Mysterious dan 'enigmatic' — ascending terasa semakin chromatic. Warna avant-garde.",
    harmonicApplications: [
      "Avant-garde composition.",
      "Film score mysterious themes.",
    ],
  },
  persian_scale: {
    practiceTips: [
      "Sangat intens — dua augmented 2nd gaps + b5.",
      "Gunakan untuk warna Persian/Iranian dalam composition.",
    ],
    earTrainingHint:
      "Intens, mysterious, dan 'ancient Persian'. b5 menambah darkness pada Double Harmonic-like structure.",
    harmonicApplications: [
      "Persian/Iranian-themed music.",
      "Middle-Eastern cinematic scores.",
    ],
  },
  prometheus_scale: {
    practiceTips: [
      "Skala Scriabin 6 nada — basis 'Mystic Chord'.",
      "Tanpa 5th, dengan #4 — warna floating dan mystical.",
    ],
    earTrainingHint:
      "Mystical dan floating — warna Scriabin. Tanpa gravitasi tonal karena tanpa 5th.",
    harmonicApplications: [
      "Scriabin-inspired composition.",
      "Mystical/spiritual art music.",
    ],
  },

  // ── Harmonic Major Modes ──
  harmonic_major: {
    practiceTips: [
      "Major dengan b6 — satu nada berbeda dari Ionian.",
      "Warna bittersweet — cerah tapi dengan hint darkness.",
      "Penting untuk jazz ballad vocabulary.",
    ],
    earTrainingHint:
      "Major yang 'bittersweet' — b6 menambah rasa melankolis pada brightness major.",
    harmonicApplications: [
      "Jazz ballad harmony.",
      "Classical romantic music.",
      "Film score emotional scenes.",
    ],
  },
  dorian_b5: {
    practiceTips: [
      "Mode 2 Harmonic Major — Dorian dengan b5.",
      "Warna unik untuk m7b5 context yang berbeda dari Locrian ♮2.",
    ],
    earTrainingHint:
      "Dorian yang lebih gelap karena b5 — tapi dengan natural 6 yang memberi warmth.",
    harmonicApplications: ["Alternative scale untuk m7b5 chords."],
  },
  lydian_diminished: {
    practiceTips: [
      "Lydian dengan b3 — warna minor yang sparkly.",
      "Unik: #4 + 7 memberi brightness, b3 memberi minor quality.",
    ],
    earTrainingHint:
      "Minor yang terdengar 'sparkly' karena #4 dan natural 7. Kontradiksi yang menarik.",
    harmonicApplications: [
      "mMaj7 chord context.",
      "Film score 'dark fairy tale' scenes.",
    ],
  },
  mixolydian_b2: {
    practiceTips: [
      "Mixolydian dengan b2 — dominant scale eksotis.",
      "Mirip Phrygian Dominant tapi dengan natural 6.",
    ],
    earTrainingHint:
      "Dominant tapi eksotis — b2 memberi rasa Eastern pada dominant sound.",
    harmonicApplications: [
      "Exotic dominant chord resolution.",
      "Alternative untuk Phrygian Dominant context.",
    ],
  },

  // ── Contemporary/Jazz Synthetic ──
  lydian_minor: {
    practiceTips: [
      "#4 + b6 + b7 = mix Lydian brightness dan minor darkness.",
      "Rare tapi useful sebagai color scale.",
    ],
    earTrainingHint:
      "Lydian yang jatuh ke darkness di atas — #4 cerah tapi b6/b7 memberi collapse.",
    harmonicApplications: [
      "Jazz fusion color scale.",
      "Film score ambivalent moods.",
    ],
  },
  leading_whole_tone: {
    practiceTips: [
      "Whole tone + leading tone (7) — menambah gravitasi ke tonic.",
    ],
    earTrainingHint:
      "Whole tone tapi dengan ending yang resolve — leading tone memberi pull.",
    harmonicApplications: ["Transitional passages that resolve."],
  },
  double_harmonic_minor: {
    practiceTips: [
      "Identik dengan Hungarian Minor — entry terpisah untuk cross-reference.",
      "Lihat Hungarian Minor untuk tips lengkap.",
    ],
    earTrainingHint:
      "= Hungarian Minor. Dramatic, theatrical, dua augmented 2nd gaps.",
    harmonicApplications: ["Sama dengan Hungarian Minor."],
  },
  major_locrian: {
    practiceTips: [
      "Major triad tapi b5 — sangat unusual dan rare.",
      "Gunakan sebagai color scale, bukan tonalitas utama.",
    ],
    earTrainingHint:
      "Major yang 'collapses' — b5 dan b6 membuat major brightness runtuh.",
    harmonicApplications: ["Rare jazz applications.", "Arabian fusion."],
  },
  super_lydian: {
    practiceTips: [
      "Paling bright — hampir semua nada raised.",
      "Mirip whole tone + leading tone.",
    ],
    earTrainingHint:
      "Paling floating/bright — semua nada raised seolah-olah gravity hilang.",
    harmonicApplications: ["Experimental jazz.", "Avant-garde composition."],
  },

  // ── Additional World Scales ──
  algerian: {
    practiceTips: [
      "8 nada dari tradisi Aljazair — mirip Harmonic Minor + chromatic passing.",
      "Sangat dramatis untuk North African compositional context.",
    ],
    earTrainingHint:
      "Harmonic Minor yang di-enrich dengan chromatic passing. Dramatic dan North African.",
    harmonicApplications: ["North African music.", "Rai and Chaabi."],
  },
  kumoi: {
    practiceTips: [
      "Pentatonic Jepang yang lembut — b3 + 6 memberi warmth unik.",
      "Sering terdengar di koto music — mainkan dengan arpeggio/plucking style.",
    ],
    earTrainingHint:
      "Melankolis tapi warm — minor dengan natural 6 dalam 5-note context. Koto music feel.",
    harmonicApplications: [
      "Japanese koto-inspired music.",
      "Ambient dan atmospheric.",
    ],
  },
  lydian_b7: {
    practiceTips: [
      "Alias untuk Lydian Dominant — lihat entry tersebut untuk tips lengkap.",
    ],
    earTrainingHint: "= Lydian Dominant. Major dengan #4 dan b7.",
    harmonicApplications: ["Sama dengan Lydian Dominant."],
  },
  overtone_scale: {
    practiceTips: [
      "Identik dengan Lydian Dominant — menekankan konteks overtone/acoustic.",
      "Muncul alami di overtone series — explore dengan harmonics di gitar.",
    ],
    earTrainingHint:
      "= Lydian Dominant. Terdengar 'alami' karena muncul di overtone series.",
    harmonicApplications: [
      "Spectral music dan Bartók compositions.",
      "Natural harmonics exploration.",
    ],
  },
  major_pent_b3: {
    practiceTips: [
      "Major pentatonic + b3 = country blues gold.",
      "Chromatic slide b3→3 adalah signature country guitar lick.",
    ],
    earTrainingHint:
      "Country yang 'bluesy' — major pentatonic dengan chromatic passing b3.",
    harmonicApplications: ["Country guitar soloing.", "Southern rock."],
  },
  celtic_minor: {
    practiceTips: [
      "8 nada blend Dorian + Aeolian — b6 DAN natural 6 dipakai bergantian.",
      "Khas Irish/Scottish: alternate kedua 6th untuk authenticity.",
    ],
    earTrainingHint:
      "Minor tapi dengan 'shimmer' dari alternating b6/natural 6. Warna Celtic yang khas.",
    harmonicApplications: [
      "Celtic/Irish folk music.",
      "Scottish traditional music.",
    ],
  },

  // ── Hexatonic ──
  major_hexatonic: {
    practiceTips: [
      "Major tanpa 7th — warna hangat tanpa leading tone tension.",
      "Pentatonic + satu nada ekstra — natural transition dari pentatonic.",
    ],
    earTrainingHint:
      "Major yang 'relaxed' tanpa leading tone tension. Warmth tanpa urgency.",
    harmonicApplications: [
      "Melodi folk dan pop.",
      "Transition dari pentatonic ke full scale.",
    ],
  },
  minor_hexatonic: {
    practiceTips: [
      "Natural Minor tanpa 6th — smooth tanpa b6 tension.",
      "Pentatonic minor + 2nd — graduated learning.",
    ],
    earTrainingHint:
      "Minor yang 'smooth' tanpa drama b6. Clean dan straightforward.",
    harmonicApplications: ["Pop and folk minor melodies."],
  },

  // ── Misc & Rare ──
  istrian: {
    practiceTips: [
      "6 nada dari region Istria — dark dan chromatic.",
      "Rare tapi interesting untuk exploration regional music.",
    ],
    earTrainingHint: "Dark dan chromatic — warna regional Istria yang unik.",
    harmonicApplications: ["Istrian/Croatian folk tradition."],
  },
  piongio: {
    practiceTips: [
      "8 nada Tcherepnin — mirip konsep Bebop Major.",
      "Modal tetapi dengan added chromatic variety.",
    ],
    earTrainingHint: "Major dengan added b7 — Bebop Major dengan nama berbeda.",
    harmonicApplications: ["20th century classical composition."],
  },
  two_semitone_tritone: {
    practiceTips: [
      "Simetris 6 nada — 2 kelompok 3 chromatic notes berjarak tritone.",
      "Messiaen Mode 5 — explore seri Modes of Limited Transposition.",
    ],
    earTrainingHint:
      "Sangat tense dan simetris — 2 cluster chromatic dipisahkan tritone.",
    harmonicApplications: [
      "Messiaen-inspired composition.",
      "Spectral dan contemporary classical.",
    ],
  },
};

// ── Process ──────────────────────────────────────────────

let count = 0;
let failed = 0;

for (const [key, data] of Object.entries(LEARNING_MAP)) {
  // Find the scale entry: "  $key: {" or just the songExamples closing line before the next entry
  // We look for the pattern: the last }, before the next scale or section comment
  // Strategy: find "songExamples: [" inside the scale block, then find the next "}," closing the songExamples,
  // then insert learning block after songExamples.

  // Find the scale key in MASTER_SCALES — handle keys with special chars
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const keyPattern = new RegExp(`\n  ${escapedKey}: \\{`, "m");
  const keyMatch = src.match(keyPattern);
  if (!keyMatch) {
    console.log(`SKIP: Scale key '${key}' not found in MASTER_SCALES`);
    failed++;
    continue;
  }

  const keyIndex = src.indexOf(keyMatch[0]) + 1; // +1 to skip the leading \n

  // Find the end boundary: next "  }," followed by blank line + new entry or section comment
  const afterKey = src.substring(keyIndex);
  // Match the closing "  }," of this scale entry — it's followed by either:
  //   "\n\n  key:" (next scale) or "\n\n  //" (section comment) or "\n};" (end of MASTER_SCALES)
  const endMatch = afterKey.match(/\n {2}\},\n(?:\n {2}(?:\w|\/\/)|\n\};)/);
  if (!endMatch) {
    console.log(`SKIP: Could not find end of scale '${key}'`);
    failed++;
    continue;
  }

  const scaleBlock = afterKey.substring(
    0,
    endMatch.index + endMatch[0].indexOf("},") + 2,
  );

  if (scaleBlock.includes("learning:")) {
    console.log(`SKIP: Scale '${key}' already has learning data`);
    continue;
  }

  // Build the learning block
  let learningStr = "    learning: {\n";

  if (data.teachingOrder !== undefined) {
    learningStr += `      teachingOrder: ${data.teachingOrder},\n`;
  }

  if (data.pianoFingering) {
    learningStr += `      pianoFingering: {\n`;
    learningStr += `        referenceRoot: "${data.pianoFingering.referenceRoot}",\n`;
    learningStr += `        rightHandAsc: "${data.pianoFingering.rightHandAsc}",\n`;
    learningStr += `        leftHandAsc: "${data.pianoFingering.leftHandAsc}",\n`;
    if (data.pianoFingering.notes) {
      learningStr += `        notes: "${data.pianoFingering.notes}",\n`;
    }
    learningStr += `      },\n`;
  }

  if (data.guitarPositions) {
    learningStr += `      guitarPositions: [\n`;
    for (const pos of data.guitarPositions) {
      learningStr += `        { name: "${pos.name}", startFret: ${pos.startFret}, description: "${pos.description}" },\n`;
    }
    learningStr += `      ],\n`;
  }

  learningStr += `      practiceTips: [\n`;
  for (const tip of data.practiceTips) {
    learningStr += `        ${JSON.stringify(tip)},\n`;
  }
  learningStr += `      ],\n`;

  learningStr += `      earTrainingHint: ${JSON.stringify(data.earTrainingHint)},\n`;

  learningStr += `      harmonicApplications: [\n`;
  for (const app of data.harmonicApplications) {
    learningStr += `        ${JSON.stringify(app)},\n`;
  }
  learningStr += `      ],\n`;

  learningStr += `    },\n`;

  // Insert learning block before the closing "  }," of the scale entry
  const closingBracePos = keyIndex + scaleBlock.lastIndexOf("  },");
  src =
    src.substring(0, closingBracePos) +
    learningStr +
    src.substring(closingBracePos);

  count++;
  console.log(`OK: Added learning data to '${key}'`);
}

writeFileSync(FILE, src);
console.log(`\nDone: ${count} scales updated, ${failed} failed/skipped.`);
