// ════════════════════════════════════════════════════════
// Dictionary Data – Articulation & Muting Techniques
// ════════════════════════════════════════════════════════

import type { DictionaryEntry } from "../types";

export const ARTICULATION_ENTRIES: DictionaryEntry[] = [
  // ── Staccato / Legato ────────────────────────────────
  {
    id: "staccato",
    term: "Staccato",
    termId: "Staccato",
    category: "articulation",
    subCategory: "staccato-legato",
    instrumentContext: "general",
    shortDefinition: "Not yang dimainkan pendek dan terpisah.",
    detailedDefinition:
      "Staccato (ditandai titik di atas/bawah not) menginstruksikan pemain untuk mempersingkat durasi not, biasanya sekitar separuh dari nilai aslinya, sehingga ada jeda sebelum not berikutnya. Pada gitar, ini dilakukan dengan mematikan (damping) senar segera setelah dipetik.",
    bravuraSymbol: { codePoint: 0xe4a2, label: "Staccato" },
    alphaTexRef: { token: "staccato", level: "note" },
    relatedTerms: ["legato", "tenuto"],
    guitarTechnique: {
      howTo:
        "Petik senar, lalu segera sentuh kembali senar dengan jari kiri (fret hand) atau telapak tangan kanan untuk menghentikan sustain. Tujuannya: bunyi pendek dan crisp.",
      hand: "both",
      difficulty: "beginner",
      tips: [
        "Timing release sama pentingnya dengan timing petikan",
        "Untuk chord staccato, rilekskan fret hand pressure tanpa melepas senar",
      ],
    },
    tags: ["staccato", "short", "detached", "titik", "dot"],
    sortOrder: 0,
  },
  {
    id: "legato",
    term: "Legato",
    termId: "Legato",
    category: "articulation",
    subCategory: "staccato-legato",
    instrumentContext: "general",
    shortDefinition: "Not yang dimainkan menyambung halus tanpa jeda.",
    detailedDefinition:
      "Legato berarti bermain dengan transisi halus antar nada tanpa jeda/silence. Pada gitar, legato biasanya dicapai melalui hammer-on dan pull-off sehingga nada mengalir tanpa perlu memetik setiap not.",
    relatedTerms: ["staccato", "hammer-on", "pull-off", "slur"],
    guitarTechnique: {
      howTo:
        "Mainkan nada berurutan dengan hammer-on dan pull-off tanpa memetik ulang. Jaga tekanan jari kiri agar sustain tidak putus.",
      hand: "left",
      difficulty: "intermediate",
      tips: [
        "Latih kekuatan hammer-on di setiap jari",
        "Pull-off harus menarik senar sedikit ke bawah, bukan hanya mengangkat",
      ],
    },
    tags: ["legato", "smooth", "connected", "hammer", "pull"],
    sortOrder: 1,
  },

  // ── Accent & Tenuto ──────────────────────────────────
  {
    id: "accent",
    term: "Accent",
    termId: "Aksen",
    aliases: ["ac"],
    category: "articulation",
    subCategory: "accent-tenuto",
    instrumentContext: "general",
    shortDefinition: "Not yang dimainkan lebih keras/tegas dari sekitarnya.",
    detailedDefinition:
      "Accent (>) menginstruksikan penekanan ekstra pada not tersebut. Ini memberi emphasis ritmis atau melodis. Pada gitar, ini berarti petikan lebih kuat.",
    bravuraSymbol: { codePoint: 0xe4a0, label: "Accent" },
    alphaTexRef: { token: "ac", level: "note" },
    relatedTerms: ["heavy-accent", "tenuto", "dynamic-mark"],
    guitarTechnique: {
      howTo:
        "Petik not yang diberi accent dengan tenaga ekstra dibanding not sekitarnya.",
      hand: "right",
      difficulty: "beginner",
    },
    tags: ["accent", "aksen", "ac", "emphasis", ">"],
    sortOrder: 0,
  },
  {
    id: "heavy-accent",
    term: "Heavy Accent",
    termId: "Aksen berat",
    aliases: ["Marcato", "hac"],
    category: "articulation",
    subCategory: "accent-tenuto",
    instrumentContext: "general",
    shortDefinition: "Aksen yang lebih kuat dari accent biasa.",
    detailedDefinition:
      "Heavy accent (marcato, ^) adalah bentuk aksen yang lebih intens. Not dimainkan dengan attack maksimal dan sering sedikit lebih pendek. Simbol: topi (^) di atas not.",
    alphaTexRef: { token: "hac", level: "note" },
    relatedTerms: ["accent", "fortissimo"],
    tags: ["heavy accent", "marcato", "hac", "^"],
    sortOrder: 1,
  },
  {
    id: "tenuto",
    term: "Tenuto",
    termId: "Tenuto",
    aliases: ["ten"],
    category: "articulation",
    subCategory: "accent-tenuto",
    instrumentContext: "general",
    shortDefinition: "Not dimainkan dengan durasi penuh dan sedikit ditekan.",
    detailedDefinition:
      "Tenuto (garis horizontal pendek di atas/bawah not) menginstruksikan pemain untuk menahan not selama durasi penuh dan memberi sedikit penekanan. Kebalikan dari staccato dalam hal durasi.",
    bravuraSymbol: { codePoint: 0xe4a4, label: "Tenuto" },
    alphaTexRef: { token: "ten", level: "note" },
    relatedTerms: ["staccato", "accent"],
    guitarTechnique: {
      howTo:
        "Tahan nada selama durasi penuh tanpa meredam senar. Beri sedikit tekanan ekstra saat memetik.",
      hand: "both",
      difficulty: "beginner",
    },
    tags: ["tenuto", "ten", "held", "sustained"],
    sortOrder: 2,
  },

  // ── Muting & Damping ─────────────────────────────────
  {
    id: "palm-mute",
    term: "Palm Mute",
    termId: "Palm mute",
    aliases: ["P.M.", "PM"],
    category: "articulation",
    subCategory: "mute-damp",
    instrumentContext: "guitar",
    shortDefinition:
      "Teknik meredam senar dengan telapak tangan kanan di dekat bridge.",
    detailedDefinition:
      "Palm mute (P.M.) adalah teknik di mana sisi telapak tangan kanan (atau kiri untuk pemain kidal) ditempelkan ringan pada senar di dekat bridge. Ini menghasilkan tone yang teredam, perkusif, dan 'chug'. Sangat fundamental di rock, metal, dan punk.",
    alphaTexRef: { token: "pm", level: "note" },
    relatedTerms: ["dead-note", "staccato"],
    guitarTechnique: {
      howTo:
        "Letakkan sisi telapak tangan kanan (bagian bawah kelingking) ringan di atas senar tepat di depan bridge. Posisi kritis: terlalu jauh dari bridge = mati total, terlalu dekat = tidak cukup mute. Petik seperti biasa dengan pick.",
      hand: "right",
      difficulty: "beginner",
      fretContext:
        "Efektif di semua posisi fret, terutama power chord di senar 5-6",
      tips: [
        "Eksperimen posisi tangan: geser mm demi mm dari bridge untuk menemukan sweet spot",
        "Tekanan tangan ringan saja — terlalu kuat = dead note",
        "Untuk rhythm metal, kombinasikan PM dengan downstroke yang konsisten",
        "PM bisa dikombinasi dengan aksen: lepas tangan di beat tertentu untuk efek dinamis",
      ],
    },
    tags: ["palm mute", "PM", "mute", "chug", "rhythm guitar", "metal"],
    sortOrder: 0,
  },
  {
    id: "dead-note",
    term: "Dead Note",
    termId: "Dead note / Ghost note (percussive)",
    aliases: ["Muted note", "x note"],
    category: "articulation",
    subCategory: "mute-damp",
    instrumentContext: "guitar",
    shortDefinition: "Not yang sepenuhnya diredam — hanya ada bunyi perkusif.",
    detailedDefinition:
      "Dead note (simbol 'x' pada tab) dimainkan dengan senar yang diredam sepenuhnya oleh jari tangan kiri sehingga tidak ada pitch yang jelas terdengar — hanya click perkusif. Berbeda dari ghost note yang masih memiliki pitch samar.",
    alphaTexRef: { token: "x", level: "note" },
    relatedTerms: ["palm-mute", "ghost-note"],
    guitarTechnique: {
      howTo:
        "Letakkan jari tangan kiri ringan di atas senar tanpa menekan ke fret. Petik senar — yang terdengar hanya bunyi perkusif tanpa pitch. Bisa pakai semua jari untuk mute chord penuh.",
      hand: "both",
      difficulty: "beginner",
      tips: [
        "Jangan tekan senar ke fret — hanya sentuh ringan",
        "Sangat bagus untuk rhythm funk dan percussive strumming",
      ],
    },
    tags: ["dead note", "muted", "x", "percussive"],
    sortOrder: 1,
  },
  {
    id: "ghost-note",
    term: "Ghost Note",
    termId: "Ghost note",
    aliases: ["Parenthesised note"],
    category: "articulation",
    subCategory: "mute-damp",
    instrumentContext: "general",
    shortDefinition:
      "Not yang dimainkan sangat lembut, hampir tidak terdengar.",
    detailedDefinition:
      "Ghost note (ditulis dalam tanda kurung di notasi) adalah not yang dimainkan sangat lembut sehingga lebih terasa daripada terdengar. Berbeda dari dead note: ghost note masih punya pitch, hanya sangat quiet. Penting untuk groove, terutama di funk dan jazz.",
    alphaTexRef: { token: "ghost", level: "note" },
    relatedTerms: ["dead-note", "accent"],
    guitarTechnique: {
      howTo:
        "Tekan fret seperti biasa tapi petik dengan tenaga sangat minimal. Not harus terasa tapi tidak menonjol.",
      hand: "both",
      difficulty: "intermediate",
      tips: [
        "Pada bass/gitar funk, ghost notes memberi 'percussive feel' di antara accented notes",
      ],
    },
    tags: ["ghost note", "parenthesis", "quiet", "groove"],
    sortOrder: 2,
  },
  {
    id: "let-ring",
    term: "Let Ring",
    termId: "Let ring",
    aliases: ["Laissez vibrer"],
    category: "articulation",
    subCategory: "staccato-legato",
    instrumentContext: "guitar",
    shortDefinition: "Biarkan senar berbunyi terus (sustain penuh).",
    detailedDefinition:
      "Let ring menginstruksikan pemain untuk membiarkan senar terus berbunyi, tidak diredam. Sangat umum pada arpeggio dan fingerpicking di mana beberapa not harus overlap/bertumpuk.",
    alphaTexRef: { token: "lr", level: "note" },
    relatedTerms: ["tied-note", "staccato"],
    guitarTechnique: {
      howTo:
        "Setelah memetik, jangan angkat jari kiri dan jangan damping senar. Biarkan not sustain sebanyak mungkin. Pada arpeggio, jaga semua jari tetap di posisi.",
      hand: "left",
      difficulty: "beginner",
      tips: [
        "Perlu finger independence yang baik untuk menjaga jari tetap di posisi",
      ],
    },
    tags: ["let ring", "sustain", "ring", "LR"],
    sortOrder: 2,
  },

  // ── Bend & Slide ─────────────────────────────────────
  {
    id: "bend",
    term: "Bend",
    termId: "Bend / Bending",
    category: "articulation",
    subCategory: "bend-slide",
    instrumentContext: "guitar",
    shortDefinition: "Mendorong/menarik senar untuk menaikkan pitch.",
    detailedDefinition:
      "Bend adalah teknik mendorong (atau menarik) senar ke samping pada fret tertentu untuk menaikkan pitch secara kontinu. Jenis bend: half bend (½ tone), full bend (1 tone), overbend (1½ tone). Pre-bend: bend dulu baru dipetik, lalu dilepas (release).",
    alphaTexRef: { token: "b", level: "note" },
    relatedTerms: ["vibrato-technique", "slide-technique"],
    guitarTechnique: {
      howTo:
        "Tekan fret dengan jari kiri, lalu dorong senar ke atas (senar 3-4-5-6) atau tarik ke bawah (senar 1-2) sambil tetap menekan. Gunakan 2-3 jari untuk tenaga lebih. Dengarkan target pitch dan match-kan.",
      hand: "left",
      difficulty: "intermediate",
      fretContext:
        "Paling mudah di fret 7-15, lebih sulit di fret rendah karena tension tinggi",
      tips: [
        "Selalu tahu pitch target — mainkan fret target dulu sebagai referensi",
        "Gunakan 3 jari (ring + middle + index) untuk bending kuat",
        "Senar 1-2 ditarik ke bawah, senar 3-6 didorong ke atas",
        "Latih intonasi bend agar tepat setengah atau satu tone",
      ],
    },
    tags: ["bend", "bending", "string bend", "b"],
    sortOrder: 0,
  },
  {
    id: "slide-technique",
    term: "Slide",
    termId: "Slide",
    category: "articulation",
    subCategory: "bend-slide",
    instrumentContext: "guitar",
    shortDefinition: "Menggeser jari di fretboard ke fret lain.",
    detailedDefinition:
      "Slide adalah teknik menggeser jari yang menekan senar dari satu fret ke fret lain tanpa mengangkat jari. Jenis: slide in (dari bawah/atas), shift slide (kedua not jelas), legato slide (halus), slide out (menghilang). Menghasilkan efek pitch yang mulus.",
    alphaTexRef: { token: "ss", level: "note" },
    relatedTerms: ["bend", "legato", "hammer-on"],
    guitarTechnique: {
      howTo:
        "Tekan fret awal, petik, lalu geser jari ke fret target tanpa mengangkat jari dari senar. Jaga tekanan konstan selama slide.",
      hand: "left",
      difficulty: "beginner",
      tips: [
        "Jaga tekanan konstan — terlalu ringan = bunyi putus",
        "Speed slide mempengaruhi feel: cepat = energetik, lambat = ekspresif",
        "Slide in dari bawah memberi efek 'approach'",
      ],
    },
    tags: ["slide", "shift slide", "legato slide", "glissando"],
    sortOrder: 1,
  },

  // ── Harmonics ────────────────────────────────────────
  {
    id: "natural-harmonic",
    term: "Natural Harmonic",
    termId: "Natural harmonic",
    aliases: ["NH"],
    category: "articulation",
    subCategory: "harmonic-technique",
    instrumentContext: "guitar",
    shortDefinition: "Harmonik alami pada node tertentu di senar.",
    detailedDefinition:
      "Natural harmonic dihasilkan dengan menyentuh ringan (tanpa menekan) senar tepat di atas fret tertentu (node), lalu memetik. Posisi paling jelas: fret 12 (octave), fret 7 dan 5 (fifth/fourth), fret 4 dan 9 (2 octave). Bunyi yang dihasilkan bersih, seperti lonceng.",
    alphaTexRef: { token: "nh", level: "note" },
    relatedTerms: ["artificial-harmonic", "pinch-harmonic", "harmonic-series"],
    guitarTechnique: {
      howTo:
        "Letakkan jari ringan tepat di atas fret wire (bukan di antara fret). Jangan tekan ke fretboard. Petik senar, lalu angkat jari segera. Bunyi yang keluar = harmonik (overtone).",
      hand: "both",
      difficulty: "beginner",
      fretContext: "Fret 12 (paling mudah), 7, 5, 4, 9, 3",
      tips: [
        "Posisi jari harus tepat di atas fret wire, bukan di antaranya",
        "Sentuhan harus sangat ringan",
        "Fret 12 = sama dengan open string satu oktaf lebih tinggi",
        "Sering dipakai untuk tuning gitar (harmonic fret 5 = harmonic fret 7 string berikutnya)",
      ],
    },
    tags: ["natural harmonic", "NH", "harmonik alami", "overtone", "bell tone"],
    sortOrder: 0,
  },
  {
    id: "artificial-harmonic",
    term: "Artificial Harmonic",
    termId: "Artificial harmonic",
    aliases: ["AH", "Harp harmonic"],
    category: "articulation",
    subCategory: "harmonic-technique",
    instrumentContext: "guitar",
    shortDefinition: "Harmonik yang dihasilkan di posisi fret apa pun.",
    detailedDefinition:
      "Artificial harmonic diproduksi dengan menekan fret tertentu dengan tangan kiri, lalu tangan kanan menyentuh ringan senar 12 fret di atas fret yang ditekan dan memetik. Ini memungkinkan harmonik di pitch apa pun, bukan hanya di open string nodes.",
    alphaTexRef: { token: "ah", level: "note" },
    relatedTerms: ["natural-harmonic", "pinch-harmonic"],
    guitarTechnique: {
      howTo:
        "Tekan fret X dengan tangan kiri. Tangan kanan: sentuh ringan senar tepat di atas fret X+12 dengan jari telunjuk, lalu petik senar dengan jari manis/kelingking. Angkat jari telunjuk segera setelah petik.",
      hand: "both",
      difficulty: "advanced",
      fretContext: "12 fret di atas fret yang ditekan",
      tips: [
        "Butuh teknik picking tangan kanan yang presisi",
        "Sering dipakai di fingerstyle dan classical guitar",
      ],
    },
    tags: ["artificial harmonic", "AH", "harp harmonic"],
    sortOrder: 1,
  },
  {
    id: "pinch-harmonic",
    term: "Pinch Harmonic",
    termId: "Pinch harmonic",
    aliases: ["PH", "Squeal", "Pick harmonic"],
    category: "articulation",
    subCategory: "harmonic-technique",
    instrumentContext: "guitar",
    shortDefinition: "Harmonik yang dihasilkan dengan teknik picking khusus.",
    detailedDefinition:
      "Pinch harmonic (squeal) dihasilkan dengan cara ibu jari tangan kanan menyentuh senar sesaat setelah pick memetik. Ini memunculkan overtone tinggi yang menghasilkan bunyi 'squeal' khas. Sangat ikonik di rock dan metal. Efektivitas tergantung posisi picking dan gain.",
    alphaTexRef: { token: "ph", level: "note" },
    relatedTerms: ["natural-harmonic", "artificial-harmonic"],
    guitarTechnique: {
      howTo:
        "Pegang pick sangat dekat ujung (hanya sedikit yang keluar). Petik senar — segera setelah pick menyentuh senar, bagian tebal ibu jari harus menyentuh senar juga. Ini memunculkan harmonic node. Eksperimen posisi picking (bridge/neck) untuk squeal berbeda.",
      hand: "right",
      difficulty: "intermediate",
      tips: [
        "Butuh gain/distortion agar squeal terdengar jelas",
        "Posisi picking sangat mempengaruhi nada harmonic",
        "Eksperimen: geser posisi picking beberapa cm untuk harmonic berbeda",
        "Kombinasikan dengan vibrato untuk efek maksimal",
      ],
    },
    tags: ["pinch harmonic", "PH", "squeal", "pick harmonic"],
    sortOrder: 2,
  },
  {
    id: "tap-harmonic",
    term: "Tap Harmonic",
    termId: "Tap harmonic",
    aliases: ["TH"],
    category: "articulation",
    subCategory: "harmonic-technique",
    instrumentContext: "guitar",
    shortDefinition:
      "Harmonik yang dihasilkan dengan tapping di node harmonic.",
    detailedDefinition:
      "Tap harmonic dihasilkan dengan cara mengetuk (tap) senar tepat di atas fret wire pada posisi harmonic node. Tangan kiri menekan fret, tangan kanan mengetuk 12 fret di atas. Menghasilkan harmonic tanpa perlu memetik.",
    alphaTexRef: { token: "th", level: "note" },
    relatedTerms: ["natural-harmonic", "tapping"],
    guitarTechnique: {
      howTo:
        "Tekan fret dengan tangan kiri. Tangan kanan mengetuk senar dengan cepat tepat di atas fret 12 fret di atasnya. Angkat jari kanan dengan cepat.",
      hand: "both",
      difficulty: "advanced",
    },
    tags: ["tap harmonic", "TH"],
    sortOrder: 3,
  },
  {
    id: "semi-harmonic",
    term: "Semi Harmonic",
    termId: "Semi harmonic",
    aliases: ["SH"],
    category: "articulation",
    subCategory: "harmonic-technique",
    instrumentContext: "guitar",
    shortDefinition: "Campuran antara nada normal dan harmonik.",
    detailedDefinition:
      "Semi harmonic adalah teknik di mana nada yang dihasilkan merupakan campuran fundamental dan harmonic. Dicapai dengan sentuhan jari yang tidak sepenuhnya ringan maupun sepenuhnya ditekan. Menghasilkan timbre yang unik.",
    alphaTexRef: { token: "sh", level: "note" },
    relatedTerms: ["natural-harmonic", "pinch-harmonic"],
    guitarTechnique: {
      howTo:
        "Sentuh senar di atas fret node dengan tekanan yang di antara menyentuh ringan (harmonic) dan menekan penuh (normal note).",
      hand: "left",
      difficulty: "advanced",
    },
    tags: ["semi harmonic", "SH", "partial harmonic"],
    sortOrder: 4,
  },
  {
    id: "feedback-harmonic",
    term: "Feedback Harmonic",
    termId: "Feedback harmonic",
    aliases: ["FH"],
    category: "articulation",
    subCategory: "harmonic-technique",
    instrumentContext: "guitar",
    shortDefinition: "Harmonik yang dihasilkan dari feedback amplifier.",
    detailedDefinition:
      "Feedback harmonic terjadi ketika sinyal dari amplifier kembali ke pickup gitar dan mengeksitasi senar pada frekuensi harmonik tertentu. Dicapai dengan berdiri dekat amp pada volume tinggi. Nada yang keluar tergantung posisi gitar relatif terhadap speaker.",
    alphaTexRef: { token: "fh", level: "note" },
    relatedTerms: ["natural-harmonic", "pinch-harmonic"],
    guitarTechnique: {
      howTo:
        "Gunakan gain/distortion tinggi. Berdiri dekat amplifier dan arahkan gitar ke speaker. Frekuensi feedback berubah berdasarkan posisi dan jarak.",
      hand: "both",
      difficulty: "advanced",
      tips: [
        "Kontrol feedback dengan mengubah jarak dan sudut gitar ke amp",
        "Volume harus cukup tinggi",
        "Hati-hati: bisa sangat keras dan merusak pendengaran",
      ],
    },
    tags: ["feedback harmonic", "FH", "feedback", "amp"],
    sortOrder: 5,
  },
];
