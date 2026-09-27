// chords-array-generator.ts

// ===================== Types =====================
import {
  pickName,
  rootToPc,
  DEGREE_TO_SEMITONES,
  type SpellMode,
  type DegreeToken,
  type HarmonicQuality,
  type ChordFamily,
  type CadentialStrength,
} from "./core";

// Re-export core types so existing consumers keep working
export type { DegreeToken, HarmonicQuality, ChordFamily, CadentialStrength };

export type TypeToken =
  | "maj"
  | "m"
  | "dim"
  | "aug"
  | "5"
  | "sus2"
  | "sus4"
  | "add2"
  | "add4"
  | "add9"
  | "add11"
  | "add13"
  | "6"
  | "m6"
  | "7"
  | "maj7"
  | "m7"
  | "mMaj7"
  | "dim7"
  | "m7b5"
  | "9"
  | "m9"
  | "maj9"
  | "11"
  | "m11"
  | "maj11"
  | "13"
  | "m13"
  | "maj13"
  // color components used alongside base tokens
  | "#11"
  | "#5"
  | "b5"
  | "maj7#11"
  | "7#11"
  | "maj7#5"
  | "maj7b5"
  | "m9b5"
  | "7sus4"
  | "7sus2"
  | "9sus4"
  | "13sus4"
  | "7b5"
  | "7#5"
  | "7b9"
  | "7#9"
  | "9b5"
  | "9#5"
  | "9b9"
  | "9#9"
  | "13b9"
  | "13#9"
  | "13b5"
  | "13#5"
  | "7alt"
  | "sus2add9"
  | "sus4add9";

export interface TypeInfo {
  name: TypeToken;
  description: string;
}

export type InstrumentRegister = "low" | "mid" | "high";

export interface InstrumentVoicingRecommendation {
  low: DegreeToken[][];
  mid: DegreeToken[][];
  high: DegreeToken[][];
}

export interface RecommendedVoicings {
  piano: InstrumentVoicingRecommendation;
  guitar: InstrumentVoicingRecommendation;
  bass: InstrumentVoicingRecommendation;
}

export interface ComposedDegree {
  degree: DegreeToken;
  note: string; // spelled note name like C, Db, etc
  semitonesFromRoot: number;
  intervalClass: number;
  role: "chord-tone" | "tension";
}

export interface ChordEntry {
  id: string; // URL-friendly slug, e.g. "c-sharp-m7"
  name: string; // e.g. Cmaj7
  nickname: string; // human-friendly
  root: string; // root spelling used
  symbol: string; // suffix symbol ("", "m", "maj7", ...)
  type: TypeInfo[]; // components from TYPE_MASTER
  composed: ComposedDegree[]; // degrees + notes
  quality: HarmonicQuality;
  family: ChordFamily;
  formula: DegreeToken[];
  semitonePattern: number[];
  pitchClasses: number[];
  tensions: DegreeToken[];
  alterations: DegreeToken[];
  containsTritone: boolean;
  romanNumeralHints: string[];
  cadentialStrength: CadentialStrength;
  recommendedVoicings: RecommendedVoicings;
  functionHints: string[];
  commonScales: string[];
  aliases: string[];
}

export interface GenerateChordArrayOptions {
  roots?: string[];
  spell?: SpellMode;
  includeBasicMaj?: boolean;
}

// ===================== PITCH / SPELLING =====================

// DEGREE_TO_SEMITONES is imported from core

// pickName and rootToPc are imported from core

function degreesToNotes(
  root: string,
  degrees: DegreeToken[],
  spell: SpellMode = "auto",
): string[] {
  const rpc = rootToPc(root);
  return degrees.map((d) => {
    const semi = DEGREE_TO_SEMITONES[d];
    const pc = (rpc + (semi % 12)) % 12;
    return pickName(pc, root, spell);
  });
}

// ===================== MASTER TYPES (for “type” array) =====================
// Ini adalah “komponen” yang akan ditampilkan pada field `type`.
// Kita pakai ini sebagai label & deskripsi (bukan penggabung matematika).
const TYPE_MASTER: Record<TypeToken, { name: string; description: string }> = {
  // triads & power
  maj: {
    name: "maj",
    description:
      "Triad mayor dengan rumus 1–3–5. Interval mayor third (1→3) memberi karakter terang, stabil, dan paling umum dipakai sebagai pusat tonal (fungsi tonik) di banyak progresi pop, rock, jazz, dan klasik.",
  },
  m: {
    name: "m",
    description:
      "Triad minor dengan rumus 1–♭3–5. Penurunan derajat ke-3 menjadi ♭3 menciptakan warna lebih gelap/melankolis. Dalam harmoni diatonik, minor sering muncul sebagai tonik relatif, submediant, atau predominant tergantung konteks kunci.",
  },
  dim: {
    name: "dim",
    description:
      "Triad diminished (1–♭3–♭5). Karena memiliki tritone antara 1 dan ♭5, chord ini terdengar tegang dan tidak stabil; sangat efektif untuk leading movement, passing chord, atau persiapan resolusi ke chord mayor/minor terdekat.",
  },
  aug: {
    name: "aug",
    description:
      "Triad augmented (1–3–♯5). Kenaikan nada ke-5 menghasilkan simetri yang memberi efek ambigu dan mengambang. Umum dipakai sebagai warna transisi, modulasi halus, atau dominant substitute dengan warna modern.",
  },
  5: {
    name: "5",
    description:
      "Power chord (1–5) tanpa nada ketiga, sehingga tidak terdengar jelas mayor atau minor. Sifat netral ini membuatnya sangat fleksibel untuk distorsi tinggi (rock/metal) dan layering harmonik tanpa bentrok warna third.",
  },

  // suspensions & adds
  sus2: {
    name: "sus2",
    description:
      "Suspended 2 (1–2–5): nada ketiga diganti dengan derajat 2. Hasilnya terdengar terbuka, ringan, dan lebih netral dibanding triad penuh. Sering dipakai untuk texture chord progression yang modern dan airy.",
  },
  sus4: {
    name: "sus4",
    description:
      "Suspended 4 (1–4–5): nada ketiga diganti dengan derajat 4. Secara tradisional, sus4 punya dorongan resolusi kuat kembali ke derajat 3, sehingga sangat efektif untuk build-up dan release dalam progresi.",
  },
  add2: {
    name: "add2",
    description:
      "Add2 (1–2–3–5): triad mayor dengan tambahan derajat 2 dalam register dasar. Menambah warna lembut tanpa fungsi dominan tambahan seperti chord 7. Cocok untuk pop/folk dan voicing gitar terbuka.",
  },
  add4: {
    name: "add4",
    description:
      "Add4 (1–3–4–5): triad mayor dengan tambahan derajat 4. Memberi gesekan ringan terhadap nada 3, sehingga warna harmoninya kaya namun tetap tidak setegang sus murni atau dominant extension.",
  },
  add9: {
    name: "add9",
    description:
      "Add9 (1–3–5–9): triad mayor ditambah 9 tanpa menyertakan ♭7/7. Karakter hasilnya luas, berkilau, dan modern; lazim dipakai untuk ambience, ballad, dan harmonic pad.",
  },
  add11: {
    name: "add11",
    description:
      "Add11 (1–3–5–11): triad mayor dengan tambahan 11. Warna ini dapat menghasilkan ketegangan lembut terhadap nada 3; biasanya ditata dalam voicing yang memberi jarak agar benturan interval tetap musikal.",
  },
  add13: {
    name: "add13",
    description:
      "Add13 (1–3–5–13): triad mayor dengan tambahan 13. Menambahkan rasa luas dan jazzy tanpa kewajiban fungsi dominan penuh. Efektif sebagai warna substitusi untuk chord mayor biasa.",
  },
  // color components
  "#11": {
    name: "#11",
    description:
      "Alterasi ♯11 (raised 11th). Umumnya diasosiasikan dengan warna Lydian pada chord mayor atau dominant tertentu. Memberi karakter terang, modern, dan sedikit floating tanpa terasa terlalu gelap.",
  },
  "#5": {
    name: "#5",
    description:
      "Alterasi ♯5 (augmented fifth). Menggeser stabilitas perfect fifth menjadi warna lebih tegang/ambigu. Banyak digunakan pada dominant altered atau major augmented untuk transisi harmonik dramatis.",
  },
  b5: {
    name: "b5",
    description:
      "Alterasi ♭5 (diminished fifth/tritone dari root). Menambah disonansi kuat dan dorongan resolusi. Sangat umum pada diminished, half-diminished, dan varian dominant altered.",
  },

  // sixth & sevenths
  6: {
    name: "6",
    description:
      "Major 6 chord (1–3–5–6). Sering dipakai sebagai alternatif halus untuk maj7 karena terdengar hangat dan vintage. Dalam banyak aransemen, chord ini menjaga stabilitas tonik sambil menambah warna lembut.",
  },
  m6: {
    name: "m6",
    description:
      "Minor 6 chord (1–♭3–5–6). Mencampur warna minor dengan extension 6 yang relatif terang. Sering dipakai dalam jazz, film score, dan warna modal minor yang ingin terdengar lebih kaya dari minor triad biasa.",
  },
  7: {
    name: "7",
    description:
      "Dominant 7 (1–3–5–♭7). Ini adalah chord fungsional paling penting untuk tegangan-resolusi karena memuat tritone internal (3 ke ♭7) yang kuat mendorong resolusi ke tonik atau target cadence.",
  },
  maj7: {
    name: "maj7",
    description:
      "Major 7 (1–3–5–7). Karakternya halus, elegan, dan stabil, lazim dipakai sebagai warna tonik modern pada jazz, city pop, neo-soul, dan ballad. Dibanding triad mayor, kesannya lebih sophisticated.",
  },
  m7: {
    name: "m7",
    description:
      "Minor 7 (1–♭3–5–♭7). Chord minor dengan extension natural yang sangat umum dalam progresi ii–V–I, modal vamp, dan neo-soul. Fleksibel sebagai predominant atau modal center tergantung konteks.",
  },
  mMaj7: {
    name: "mMaj7",
    description:
      "Minor Major 7 (1–♭3–5–7). Kontras antara ♭3 dan 7 memberi warna sinematik, misterius, dan dramatik. Sering muncul di harmonic minor harmony, soundtrack, dan chord warna untuk momen tegang.",
  },
  dim7: {
    name: "dim7",
    description:
      "Fully diminished 7 (1–♭3–♭5–𝄫7). Struktur simetris (bertumpuk minor third) membuat inversinya saling setara, sehingga sangat efektif sebagai passing chord, leading tone diminished, dan modulasi cepat.",
  },
  m7b5: {
    name: "m7b5",
    description:
      "Half-diminished (1–♭3–♭5–♭7), juga ditulis ø7. Umum pada derajat ii di kunci minor (iiø7–V7–i). Warna tegang namun lebih terbuka daripada dim7 penuh.",
  },

  // extended
  9: {
    name: "9",
    description:
      "Dominant 9: secara praktik adalah dominant 7 dengan tambahan 9 (1–3–5–♭7–9). Memberi ketegangan dominan yang lebih kaya, sering dipakai untuk cadence yang lebih jazzy dan penuh warna.",
  },
  m9: {
    name: "m9",
    description:
      "Minor 9 (1–♭3–5–♭7–9). Salah satu voicing favorit untuk warna smooth, soulful, dan atmosferik. Menjaga karakter minor sambil memberi ekstensi atas yang lebih luas dan modern.",
  },
  maj9: {
    name: "maj9",
    description:
      "Major 9 (1–3–5–7–9). Kombinasi stabilitas major 7 dan kilau 9 menjadikannya chord tonik premium di banyak genre modern, terutama jazz, fusion, neo-soul, dan pop cinematic.",
  },
  11: {
    name: "11",
    description:
      "Dominant 11 menambahkan 11 di atas struktur dominant (umumnya 1–3–5–♭7–9–11). Memberi kepadatan harmonik tinggi; dalam praktik voicing sering dilakukan omit/selective tones agar tetap jelas.",
  },
  m11: {
    name: "m11",
    description:
      "Minor 11 (1–♭3–5–♭7–9–11). Chord ini sangat khas untuk texture modal dan ambient karena menggabungkan minor foundation dengan lapisan extension yang lembut dan luas.",
  },
  maj11: {
    name: "maj11",
    description:
      "Major 11 (1–3–5–7–9–11). Secara teori lengkap, namun pada praktik sering memerlukan voicing hati-hati agar benturan 3 dan 11 tetap musikal. Cocok untuk warna complex harmony.",
  },
  13: {
    name: "13",
    description:
      "Dominant 13 memperluas dominant family hingga derajat 13 (praktik: 1–3–♭7 plus extension terpilih). Warna ini sering terdengar kaya, funky, dan siap resolusi ke chord target.",
  },
  m13: {
    name: "m13",
    description:
      "Minor 13 menambahkan lapisan 13 pada chord minor extended. Karakternya lebar, sophisticated, dan sangat cocok untuk jazz modern, R&B, dan progressi dengan voice-leading halus.",
  },
  maj13: {
    name: "maj13",
    description:
      "Major 13 menghadirkan spektrum penuh warna mayor modern (1–3–5–7 + extension). Umumnya dipakai sebagai chord pusat yang kaya tanpa kehilangan kesan elegan dan stabil.",
  },

  // lydian & colors
  "maj7#11": {
    name: "maj7#11",
    description:
      "Major 7 dengan ♯11, sering diasosiasikan dengan sonoritas Lydian (1–3–5–7–♯11). Memberi warna terang, dreamy, dan modern, sangat populer pada jazz kontemporer dan film scoring.",
  },
  "7#11": {
    name: "7#11",
    description:
      "Dominant 7 dengan ♯11 menambahkan ketegangan berwarna Lydian dominant. Umumnya dipakai untuk dominant non-diatonik, secondary dominant, atau substitusi dengan warna lebih tajam.",
  },
  "maj7#5": {
    name: "maj7#5",
    description:
      "Major 7 augmented 5 (1–3–♯5–7). Kombinasi stabilitas mayor 7 dan ketegangan ♯5 membuatnya terdengar ambigu namun mewah. Cocok untuk transisi dan reharmonisasi kreatif.",
  },
  maj7b5: {
    name: "maj7b5",
    description:
      "Major 7 flat 5 (1–3–♭5–7) menghadirkan warna major yang mengandung tritone internal. Efektif sebagai warna tegang terkontrol atau passing sonority pada jalur voice-leading tertentu.",
  },
  m9b5: {
    name: "m9b5",
    description:
      "Minor 9 flat 5 memperluas half-diminished color dengan tambahan 9. Cocok untuk konteks minor iiø dan nuansa dark-jazz, terutama saat ingin tension yang kaya namun tetap terarah.",
  },

  // suspended family extended
  "7sus4": {
    name: "7sus4",
    description:
      "Dominant sus4 (1–4–5–♭7) menggantikan third dengan fourth, sehingga ketegangan dominan tetap ada tapi warna lebih terbuka. Sangat umum untuk groove funk, gospel, dan turn-around modern.",
  },
  "7sus2": {
    name: "7sus2",
    description:
      "Dominant sus2 (1–2–5–♭7) memberi karakter dominan yang lebih ringan dibanding 7sus4. Cocok untuk pergerakan modal atau transisi yang ingin terasa less harsh namun tetap bergerak.",
  },
  "9sus4": {
    name: "9sus4",
    description:
      "9sus4 memperkaya dominant suspended dengan tambahan 9. Warna ini padat namun smooth, sering dipakai pada vamp, intro/outro, dan progresi dengan kebutuhan groove harmonik stabil.",
  },
  "13sus4": {
    name: "13sus4",
    description:
      "13sus4 menambah extension tinggi pada dominant suspended, menghasilkan warna luas dengan dorongan resolusi tetap kuat. Sangat efektif untuk nuansa modern-jazz dan gospel harmony.",
  },

  // altered dominants
  "7b5": {
    name: "7b5",
    description:
      "Dominant 7 flat 5 memperkuat disonansi tritone dan cocok untuk resolusi kromatik. Dipakai dalam reharmonisasi jazz/blues untuk memberi warna lebih tajam dari dominant biasa.",
  },
  "7#5": {
    name: "7#5",
    description:
      "Dominant 7 sharp 5 membawa warna augmented menuju target chord. Sangat efektif sebagai altered dominant karena memberi rasa dorongan kuat dan dramatik ke resolusi berikutnya.",
  },
  "7b9": {
    name: "7b9",
    description:
      "Dominant 7 flat 9 adalah tegangan klasik menuju minor/major tonic. Interval ♭9 dari root menghasilkan gesekan khas cadence, sangat umum pada jazz, flamenco, dan harmoni minor.",
  },
  "7#9": {
    name: "7#9",
    description:
      "Dominant 7 sharp 9 menambah warna bluesy dan gritty karena tumpang tindih rasa mayor-minor pada atas dominant. Populer di blues-rock, funk, dan jazz fusion.",
  },
  "9b5": {
    name: "9b5",
    description:
      "9b5 menambahkan 9 sekaligus menurunkan 5 pada dominant, menghasilkan kombinasi warna tajam namun tetap kaya extension. Efektif untuk dominant passing atau substitution movement.",
  },
  "9#5": {
    name: "9#5",
    description:
      "9#5 menggabungkan extension 9 dengan augmented fifth pada dominant, menimbulkan efek tegang dan berkilau. Sering dipakai untuk warna altered yang kuat sebelum resolusi.",
  },
  "9b9": {
    name: "9b9",
    description:
      "9b9 adalah dominant dengan tegangan ♭9 yang menonjol. Secara praktik ini memberi karakter sangat directional, ideal untuk cadence cepat atau progresi dengan tekanan ritmis tinggi.",
  },
  "9#9": {
    name: "9#9",
    description:
      "9#9 mempertahankan fungsi dominant sambil menambah ketajaman #9. Warna ini sering terdengar ekspresif, edgy, dan cocok untuk genre yang membutuhkan harmonic bite.",
  },
  "13b9": {
    name: "13b9",
    description:
      "13b9 memadukan extension tinggi (13) dengan tegangan tajam (♭9) pada dominant. Kombinasi ini memberi kesan sangat kaya dan efektif untuk resolusi sophisticated.",
  },
  "13#9": {
    name: "13#9",
    description:
      "13#9 memberi warna dominant modern dengan benturan ekspresif #9 sekaligus kelebaran 13. Cocok untuk jazz/fusion dan reharmonisasi progresi standar.",
  },
  "13b5": {
    name: "13b5",
    description:
      "13b5 adalah dominant extended dengan fifth diturunkan. Warna ini tegang namun tetap terstruktur, sering dimanfaatkan untuk voice-leading kromatik ke chord target.",
  },
  "13#5": {
    name: "13#5",
    description:
      "13#5 menempatkan augmented fifth dalam konteks dominant extended. Hasilnya terdengar terang-tegang dan sangat berguna untuk menciptakan resolusi yang kuat namun berwarna.",
  },
  "7alt": {
    name: "7alt",
    description:
      "Dominant altered lengkap: mempertahankan kerangka 1–3–♭7 lalu menambahkan alterasi utama (♭5/♯5 dan ♭9/♯9). Ini adalah paket tension maksimum sebelum resolusi, sangat umum pada jazz modern, turnaround, dan reharmonisasi berkarakter kuat.",
  },

  // convenience combos (buat output seperti contohmu)
  sus2add9: {
    name: "sus2add9",
    description:
      "Kombinasi sus2 dan add9 menghasilkan harmoni terbuka berlapis (1–2–5–9). Sangat cocok untuk pad/ambient progression karena memberi ruang frekuensi yang luas tanpa dominasi third.",
  },
  sus4add9: {
    name: "sus4add9",
    description:
      "Kombinasi sus4 dan add9 (1–4–5–9) menyeimbangkan ketegangan resolutif sus4 dengan kilau 9. Umum dipakai untuk intro atau progression modern yang ingin terdengar cinematic.",
  },
};

// ===================== SYMBOL RECIPES (DEGREES PASTI + TYPE LABELS) =====================
// Setiap symbol berisi: degrees akhir + daftar komponen (untuk field `type`).
const SYMBOLS: Record<string, { degrees: DegreeToken[]; types: TypeToken[] }> =
  {
    // triads & power
    "": { degrees: ["1", "3", "5"], types: ["maj"] },
    m: { degrees: ["1", "b3", "5"], types: ["m"] },
    dim: { degrees: ["1", "b3", "b5"], types: ["dim"] },
    aug: { degrees: ["1", "3", "#5"], types: ["aug"] },
    5: { degrees: ["1", "5"], types: ["5"] },

    // suspensions & adds
    sus2: { degrees: ["1", "2", "5"], types: ["sus2"] },
    sus4: { degrees: ["1", "4", "5"], types: ["sus4"] },
    add2: { degrees: ["1", "2", "3", "5"], types: ["maj", "add2"] },
    add4: { degrees: ["1", "3", "4", "5"], types: ["maj", "add4"] },
    add9: { degrees: ["1", "3", "5", "9"], types: ["maj", "add9"] },
    add11: { degrees: ["1", "3", "5", "11"], types: ["maj", "add11"] },
    add13: { degrees: ["1", "3", "5", "13"], types: ["maj", "add13"] },
    sus2add9: { degrees: ["1", "2", "5", "9"], types: ["sus2", "add9"] },
    sus4add9: { degrees: ["1", "4", "5", "9"], types: ["sus4", "add9"] },

    // sixth & sevenths
    6: { degrees: ["1", "3", "5", "6"], types: ["6"] },
    m6: { degrees: ["1", "b3", "5", "6"], types: ["m6"] },
    7: { degrees: ["1", "3", "5", "b7"], types: ["7"] },
    maj7: { degrees: ["1", "3", "5", "7"], types: ["maj7"] },
    m7: { degrees: ["1", "b3", "5", "b7"], types: ["m7"] },
    mMaj7: { degrees: ["1", "b3", "5", "7"], types: ["mMaj7"] },
    dim7: { degrees: ["1", "b3", "b5", "bb7"], types: ["dim7"] },
    m7b5: { degrees: ["1", "b3", "b5", "b7"], types: ["m7b5"] },

    // extended
    9: { degrees: ["1", "3", "5", "b7", "9"], types: ["7", "add9"] },
    m9: { degrees: ["1", "b3", "5", "b7", "9"], types: ["m7", "add9"] },
    maj9: { degrees: ["1", "3", "5", "7", "9"], types: ["maj7", "add9"] },
    11: { degrees: ["1", "3", "5", "b7", "9", "11"], types: ["9", "11"] },
    m11: { degrees: ["1", "b3", "5", "b7", "9", "11"], types: ["m9", "11"] },
    maj11: { degrees: ["1", "3", "5", "7", "9", "11"], types: ["maj9", "11"] },
    13: {
      degrees: ["1", "3", "5", "b7", "9", "11", "13"],
      types: ["11", "13"],
    },
    m13: {
      degrees: ["1", "b3", "5", "b7", "9", "11", "13"],
      types: ["m11", "13"],
    },
    maj13: { degrees: ["1", "3", "5", "7", "9", "13"], types: ["maj9", "13"] },

    // lydian & colors
    "maj7#11": { degrees: ["1", "3", "5", "7", "#11"], types: ["maj7", "#11"] },
    "7#11": { degrees: ["1", "3", "5", "b7", "#11"], types: ["7", "#11"] },
    "maj7#5": { degrees: ["1", "3", "#5", "7"], types: ["maj7", "#5"] },
    maj7b5: { degrees: ["1", "3", "b5", "7"], types: ["maj7", "b5"] },
    m9b5: { degrees: ["1", "b3", "b5", "b7", "9"], types: ["m7b5", "add9"] },

    // suspended family extended
    "7sus4": { degrees: ["1", "4", "5", "b7"], types: ["7sus4"] },
    "7sus2": { degrees: ["1", "2", "5", "b7"], types: ["7sus2"] },
    "9sus4": { degrees: ["1", "4", "5", "b7", "9"], types: ["9sus4"] },
    "13sus4": { degrees: ["1", "4", "5", "b7", "9", "13"], types: ["13sus4"] },

    // altered dominants
    "7b5": { degrees: ["1", "3", "b5", "b7"], types: ["7b5"] },
    "7#5": { degrees: ["1", "3", "#5", "b7"], types: ["7#5"] },
    "7b9": { degrees: ["1", "3", "5", "b7", "b9"], types: ["7b9"] },
    "7#9": { degrees: ["1", "3", "5", "b7", "#9"], types: ["7#9"] },
    "9b5": { degrees: ["1", "3", "b5", "b7", "9"], types: ["9b5"] },
    "9#5": { degrees: ["1", "3", "#5", "b7", "9"], types: ["9#5"] },
    "9b9": { degrees: ["1", "3", "5", "b7", "b9"], types: ["9b9"] },
    "9#9": { degrees: ["1", "3", "5", "b7", "#9"], types: ["9#9"] },
    "13b9": { degrees: ["1", "3", "5", "b7", "b9", "13"], types: ["13b9"] },
    "13#9": { degrees: ["1", "3", "5", "b7", "#9", "13"], types: ["13#9"] },
    "13b5": { degrees: ["1", "3", "b5", "b7", "9", "13"], types: ["13b5"] },
    "13#5": { degrees: ["1", "3", "#5", "b7", "9", "13"], types: ["13#5"] },
    "7alt": {
      degrees: ["1", "3", "b7", "b9", "#9", "b5", "#5"],
      types: ["7alt"],
    },
  };

// ===================== GENERATOR =====================
function humanizeTypeName(t: TypeToken): string {
  // ubah token menjadi judul singkat untuk nickname
  const map: Partial<Record<TypeToken, string>> & Record<string, string> = {
    maj: "Major",
    m: "Minor",
    dim: "Diminished",
    aug: "Augmented",
    5: "Power",
    sus2: "Suspended 2",
    sus4: "Suspended 4",
    add2: "Add 2",
    add4: "Add 4",
    add9: "Add 9",
    add11: "Add 11",
    add13: "Add 13",
    6: "6",
    m6: "Minor 6",
    7: "Dominant 7",
    maj7: "Major 7",
    m7: "Minor 7",
    mMaj7: "Minor Major 7",
    dim7: "Diminished 7",
    m7b5: "Half-diminished",
    9: "9",
    m9: "Minor 9",
    maj9: "Major 9",
    11: "11",
    m11: "Minor 11",
    maj11: "Major 11",
    13: "13",
    m13: "Minor 13",
    maj13: "Major 13",
    "#11": "Sharp 11",
    "#5": "Sharp 5",
    b5: "Flat 5",
    "maj7#11": "Major 7 Sharp 11",
    "7#11": "Dominant 7 Sharp 11",
    "maj7#5": "Major 7 Sharp 5",
    maj7b5: "Major 7 Flat 5",
    m9b5: "Minor 9 Flat 5",
    "7sus4": "7 Sus 4",
    "7sus2": "7 Sus 2",
    "9sus4": "9 Sus 4",
    "13sus4": "13 Sus 4",
    "7b5": "7 Flat 5",
    "7#5": "7 Sharp 5",
    "7b9": "7 Flat 9",
    "7#9": "7 Sharp 9",
    "9b5": "9 Flat 5",
    "9#5": "9 Sharp 5",
    "9b9": "9 Flat 9",
    "9#9": "9 Sharp 9",
    "13b9": "13 Flat 9",
    "13#9": "13 Sharp 9",
    "13b5": "13 Flat 5",
    "13#5": "13 Sharp 5",
    "7alt": "7 Altered",
    sus2add9: "Suspended 2 Add 9",
    sus4add9: "Suspended 4 Add 9",
  };
  return map[t] ?? t;
}

function makeNickname(root: string, types: TypeToken[]): string {
  const parts = types.map(humanizeTypeName);
  // jika types kosong (triad mayor, symbol ""), tampilkan "Major" default
  return `${root} ${parts.length ? parts.join(" ") : "Major"}`;
}

function toSemitone(degree: DegreeToken): number {
  return DEGREE_TO_SEMITONES[degree] % 12;
}

function detectQuality(
  symbol: string,
  degrees: DegreeToken[],
): HarmonicQuality {
  if (symbol === "5") return "power";
  if (symbol.includes("alt") || /[b#](5|9|13)/.test(symbol)) return "altered";
  if (symbol.includes("sus")) return "suspended";
  if (degrees.includes("b3") && degrees.includes("b5")) return "diminished";
  if (degrees.includes("#5")) return "augmented";
  if (degrees.includes("3") && degrees.includes("b7")) return "dominant";
  if (degrees.includes("b3")) return "minor";
  if (degrees.includes("3")) return "major";
  return "mixed";
}

function detectFamily(symbol: string, degrees: DegreeToken[]): ChordFamily {
  if (symbol === "5") return "power";
  if (symbol.includes("alt") || /[b#](5|9|13)/.test(symbol)) return "altered";
  if (symbol.includes("sus")) return "suspended";
  if (symbol.includes("add")) return "added-tone";
  if (
    degrees.includes("13") ||
    degrees.includes("b13") ||
    degrees.includes("#13")
  ) {
    return "extended";
  }
  if (degrees.includes("11") || degrees.includes("#11")) return "extended";
  if (
    degrees.includes("9") ||
    degrees.includes("b9") ||
    degrees.includes("#9")
  ) {
    return "extended";
  }
  if (
    degrees.includes("7") ||
    degrees.includes("b7") ||
    degrees.includes("bb7")
  ) {
    return "seventh";
  }
  if (degrees.includes("6")) return "sixth";
  return "triad";
}

function getTensions(degrees: DegreeToken[]): DegreeToken[] {
  return degrees.filter((d) =>
    ["9", "b9", "#9", "11", "#11", "13", "b13", "#13"].includes(d),
  );
}

function getAlterations(degrees: DegreeToken[]): DegreeToken[] {
  return degrees.filter((d) =>
    ["b5", "#5", "b9", "#9", "#11", "b13", "#13"].includes(d),
  );
}

function detectTritone(semitonePattern: number[]): boolean {
  const pcs = [...new Set(semitonePattern)];
  return pcs.some((a) => pcs.some((b) => Math.abs(a - b) % 12 === 6));
}

function suggestRomanNumeralHints(
  quality: HarmonicQuality,
  family: ChordFamily,
): string[] {
  if (quality === "altered") {
    return [
      "V7alt (fungsi dominan kuat menuju i/I)",
      "V/V7alt (secondary dominant altered)",
      "SubV7alt (tritone substitution context)",
    ];
  }
  if (quality === "dominant") {
    return [
      "V7 (cadential dominant utama)",
      "V/V atau V/ii (secondary dominant)",
      "♭VII7 (mixolydian/blues borrowing)",
    ];
  }
  if (quality === "major") {
    return [
      "I atau IV (major diatonic function)",
      "♭VImaj / ♭IIImaj (modal interchange)",
      "IIImaj7 (relative major color di minor context)",
    ];
  }
  if (quality === "minor") {
    return [
      "ii / iii / vi (dalam major key)",
      "i / iv / v (dalam minor key)",
      "ivm (modal interchange pada major key)",
    ];
  }
  if (quality === "diminished") {
    return [
      "vii° atau viiø (leading-tone function)",
      "ii° pada minor (predominant)",
      "#ivo°7 sebagai passing diminished",
    ];
  }
  if (quality === "augmented") {
    return [
      "I+ atau V+ (augmented color function)",
      "III+ pada harmonic minor context",
      "Chromatic mediant augmented usage",
    ];
  }
  if (family === "suspended") {
    return [
      "Vsus atau Isus (fungsi tergantung resolusi)",
      "V7sus4 sebelum V7 atau I",
      "Dominant preparation pada cadential groove",
    ];
  }
  if (quality === "power") {
    return [
      "I5 / V5 (rock tonal center)",
      "♭VII5 (modal rock cadence)",
      "Drone harmony dengan fungsi ambigu",
    ];
  }
  return ["Context-dependent roman numeral interpretation"];
}

function detectCadentialStrength(
  quality: HarmonicQuality,
  family: ChordFamily,
  containsTritone: boolean,
): CadentialStrength {
  if (quality === "altered") return "very-strong";
  if (quality === "dominant" && containsTritone) return "strong";
  if (quality === "diminished" && containsTritone) return "strong";
  if (family === "suspended" || family === "extended") return "medium";
  if (quality === "power") return "very-weak";
  if (quality === "major" || quality === "minor") return "weak";
  return "medium";
}

function buildRecommendedVoicings(
  quality: HarmonicQuality,
  tensions: DegreeToken[],
  alterations: DegreeToken[],
): RecommendedVoicings {
  const primaryColor = tensions[0] ?? (quality === "major" ? "9" : "11");
  const altColor = alterations[0];

  if (quality === "dominant" || quality === "altered") {
    return {
      piano: {
        low: [
          ["1", "7"],
          ["1", "3", "b7"],
        ],
        mid: [
          ["3", "b7", "9"],
          ["3", "b7", "13"],
          ["1", "3", "b7", primaryColor],
        ],
        high: [
          ["b7", "9", "13"],
          ["3", "13", "b9"],
          ["3", "b7", altColor ?? "#9"],
        ],
      },
      guitar: {
        low: [
          ["1", "b7"],
          ["1", "3", "b7"],
        ],
        mid: [
          ["3", "b7", "9"],
          ["3", "b7", "13"],
          ["1", "3", "b7", primaryColor],
        ],
        high: [
          ["b7", "9", "13"],
          ["3", "b7", altColor ?? "b9"],
        ],
      },
      bass: {
        low: [["1"], ["1", "5"]],
        mid: [
          ["1", "b7"],
          ["1", "3"],
        ],
        high: [
          ["1", "9"],
          ["1", "b7", primaryColor],
        ],
      },
    };
  }

  if (quality === "minor" || quality === "diminished") {
    return {
      piano: {
        low: [
          ["1", "5"],
          ["1", "b3", "5"],
        ],
        mid: [
          ["b3", "b7", "9"],
          ["1", "b3", "5", primaryColor],
        ],
        high: [
          ["b7", "9", "11"],
          ["b3", "11", "13"],
        ],
      },
      guitar: {
        low: [
          ["1", "5"],
          ["1", "b3"],
        ],
        mid: [
          ["1", "b3", "b7"],
          ["b3", "b7", "9"],
        ],
        high: [
          ["b7", "9", "11"],
          ["b3", "11", primaryColor],
        ],
      },
      bass: {
        low: [["1"], ["1", "5"]],
        mid: [
          ["1", "b3"],
          ["1", "b7"],
        ],
        high: [
          ["1", "9"],
          ["1", "11"],
        ],
      },
    };
  }

  if (quality === "power" || quality === "suspended") {
    return {
      piano: {
        low: [
          ["1", "5"],
          ["1", "4", "5"],
        ],
        mid: [
          ["1", "2", "5"],
          ["1", "4", "5", "9"],
        ],
        high: [
          ["5", "9", "11"],
          ["2", "5", "9"],
        ],
      },
      guitar: {
        low: [
          ["1", "5"],
          ["1", "4", "5"],
        ],
        mid: [
          ["1", "2", "5"],
          ["1", "4", "5", "9"],
        ],
        high: [
          ["5", "9", "11"],
          ["2", "5", "9"],
        ],
      },
      bass: {
        low: [["1"], ["1", "5"]],
        mid: [
          ["1", "4"],
          ["1", "2"],
        ],
        high: [
          ["1", "9"],
          ["1", "11"],
        ],
      },
    };
  }

  return {
    piano: {
      low: [
        ["1", "5"],
        ["1", "3", "5"],
      ],
      mid: [
        ["1", "3", "5", "9"],
        ["3", "7", "9"],
      ],
      high: [
        ["5", "7", "9"],
        ["3", "9", "13"],
      ],
    },
    guitar: {
      low: [
        ["1", "5"],
        ["1", "3"],
      ],
      mid: [
        ["1", "3", "5", "9"],
        ["3", "7", "9"],
      ],
      high: [
        ["5", "7", "9"],
        ["3", "9", "13"],
      ],
    },
    bass: {
      low: [["1"], ["1", "5"]],
      mid: [
        ["1", "3"],
        ["1", "7"],
      ],
      high: [
        ["1", "9"],
        ["1", "13"],
      ],
    },
  };
}

function suggestFunctionHints(
  quality: HarmonicQuality,
  family: ChordFamily,
): string[] {
  if (quality === "dominant" || quality === "altered") {
    return [
      "Dominant function: cenderung resolusi kuat ke chord target (tonik/tujuan cadence).",
      "Cocok untuk secondary dominant, turnaround, dan tension-release movement.",
    ];
  }
  if (quality === "major") {
    return [
      "Tonic-stable color: ideal sebagai pusat tonal atau titik istirahat progresi.",
      "Bisa juga berfungsi sebagai subdominant lembut tergantung bass movement.",
    ];
  }
  if (quality === "minor") {
    return [
      "Minor center atau predominant: sering mengarah ke dominant dalam progresi fungsional.",
      "Efektif untuk warna modal, soul, dan neo-jazz progression.",
    ];
  }
  if (quality === "diminished") {
    return [
      "Leading/passing function: sangat baik untuk koneksi kromatik antar chord.",
      "Gunakan sebagai tension bridge sebelum resolusi ke chord stabil.",
    ];
  }
  if (family === "suspended") {
    return [
      "Suspended color: menunda definisi mayor/minor sampai resolusi nada ke-3.",
      "Efektif untuk intro, vamp, dan groove yang butuh warna terbuka.",
    ];
  }
  return [
    "Color chord: gunakan berdasarkan konteks voice-leading dan karakter lagu.",
  ];
}

function suggestScales(
  quality: HarmonicQuality,
  family: ChordFamily,
): string[] {
  if (quality === "dominant" && family === "altered") {
    return ["Altered scale", "Half-whole diminished", "Super Locrian"];
  }
  if (quality === "dominant") {
    return ["Mixolydian", "Lydian dominant", "Blues dominant approach"];
  }
  if (quality === "major") {
    return ["Ionian", "Lydian", "Major pentatonic"];
  }
  if (quality === "minor") {
    return ["Dorian", "Aeolian", "Melodic minor (contextual)"];
  }
  if (quality === "diminished") {
    return ["Whole-half diminished", "Locrian (for m7b5 context)"];
  }
  if (quality === "augmented") {
    return ["Lydian augmented", "Whole tone"];
  }
  return ["Contextual scale selection based on melody and bass movement"];
}

function buildAliases(root: string, symbol: string): string[] {
  if (symbol === "") return [root, `${root}maj`, `${root}M`];
  if (symbol === "m") return [`${root}min`, `${root}-`];
  if (symbol === "maj7") return [`${root}M7`, `${root}Δ7`];
  if (symbol === "m7") return [`${root}min7`, `${root}-7`];
  if (symbol === "m7b5") return [`${root}ø7`];
  if (symbol === "dim7") return [`${root}°7`];
  return [`${root}${symbol}`];
}

/**
 * Generate a URL-friendly id from root + symbol.
 * e.g. ("C#", "m7b5") → "c-sharp-m7b5"
 */
export function chordNameToId(root: string, symbol: string): string {
  const rootSlug = root
    .replace(/^C#$/i, "c-sharp")
    .replace(/^Db$/i, "d-flat")
    .replace(/^D#$/i, "d-sharp")
    .replace(/^Eb$/i, "e-flat")
    .replace(/^F#$/i, "f-sharp")
    .replace(/^Gb$/i, "g-flat")
    .replace(/^G#$/i, "g-sharp")
    .replace(/^Ab$/i, "a-flat")
    .replace(/^A#$/i, "a-sharp")
    .replace(/^Bb$/i, "b-flat")
    .replace(/^Cb$/i, "c-flat")
    .toLowerCase();
  return symbol ? `${rootSlug}-${symbol.toLowerCase()}` : rootSlug;
}

/**
 * Sort weight for chord symbols — simpler chords first.
 * IMPORTANT: We use an explicit ordered array because Object.keys()
 * puts integer-like keys ("5","6","7","9","11","13") first, which
 * would incorrectly sort C5/C6/C7 before C major/C minor.
 */
const SYMBOL_SORT_ORDER: string[] = [
  // triads & power
  "", // Major (0)
  "m", // Minor (1)
  "dim", // Diminished (2)
  "aug", // Augmented (3)
  "5", // Power (4)
  // suspensions & adds
  "sus2",
  "sus4",
  "add2",
  "add4",
  "add9",
  "add11",
  "add13",
  "sus2add9",
  "sus4add9",
  // sixth & sevenths
  "6",
  "m6",
  "7",
  "maj7",
  "m7",
  "mMaj7",
  "dim7",
  "m7b5",
  // extended
  "9",
  "m9",
  "maj9",
  "11",
  "m11",
  "maj11",
  "13",
  "m13",
  "maj13",
  // lydian & colors
  "maj7#11",
  "7#11",
  "maj7#5",
  "maj7b5",
  "m9b5",
  // suspended extended
  "7sus4",
  "7sus2",
  "9sus4",
  "13sus4",
  // altered dominants
  "7b5",
  "7#5",
  "7b9",
  "7#9",
  "9b5",
  "9#5",
  "9b9",
  "9#9",
  "13b9",
  "13#9",
  "13b5",
  "13#5",
  "7alt",
];

const SYMBOL_SORT_WEIGHT: Record<string, number> = (() => {
  const w: Record<string, number> = {};
  SYMBOL_SORT_ORDER.forEach((s, i) => {
    w[s] = i;
  });
  return w;
})();

/** Get sort weight for a chord symbol. */
export function getChordSortWeight(symbol: string): number {
  return SYMBOL_SORT_WEIGHT[symbol] ?? 999;
}

/**
 * Chromatic root ordering starting from C.
 * C is first because it's the most commonly searched root for beginners.
 */
const ROOT_SORT_ORDER: Record<string, number> = {
  C: 0,
  "C#": 1,
  Db: 2,
  D: 3,
  "D#": 4,
  Eb: 5,
  E: 6,
  F: 7,
  "F#": 8,
  Gb: 9,
  G: 10,
  "G#": 11,
  Ab: 12,
  A: 13,
  "A#": 14,
  Bb: 15,
  B: 16,
  Cb: 17,
};

/** Get sort weight for a root note — C first, chromatic order. */
export function getRootSortWeight(root: string): number {
  return ROOT_SORT_ORDER[root] ?? 99;
}

/**
 * Generate ARRAY chord entries
 */
export function generateChordArray(
  opts: GenerateChordArrayOptions = {},
): ChordEntry[] {
  const {
    roots = [
      "C",
      "C#",
      "Db",
      "D",
      "D#",
      "Eb",
      "E",
      "F",
      "F#",
      "Gb",
      "G",
      "G#",
      "Ab",
      "A",
      "A#",
      "Bb",
      "B",
      "Cb",
    ],
    spell = "auto",
    includeBasicMaj = true,
  } = opts;

  const symbols = Object.keys(SYMBOLS);
  const out: ChordEntry[] = [];

  for (const root of roots) {
    for (const sym of symbols) {
      if (!includeBasicMaj && sym === "") continue;
      const { degrees, types } = SYMBOLS[sym];
      const notes = degreesToNotes(root, degrees, spell);
      const semitonePattern = degrees.map(toSemitone);
      const rpc = rootToPc(root);
      const quality = detectQuality(sym, degrees);
      const family = detectFamily(sym, degrees);
      const tensions = getTensions(degrees);
      const alterations = getAlterations(degrees);
      const containsTritone = detectTritone(semitonePattern);
      const id = chordNameToId(root, sym);
      out.push({
        id,
        name: root + sym,
        nickname: makeNickname(root, types),
        root,
        symbol: sym,
        type: types.map((t) => ({
          name: t,
          description: TYPE_MASTER[t]?.description ?? t,
        })),
        composed: degrees.map((d, i) => ({
          degree: d,
          note: notes[i],
          semitonesFromRoot: DEGREE_TO_SEMITONES[d],
          intervalClass: DEGREE_TO_SEMITONES[d] % 12,
          role: DEGREE_TO_SEMITONES[d] >= 12 ? "tension" : "chord-tone",
        })),
        quality,
        family,
        formula: [...degrees],
        semitonePattern,
        pitchClasses: semitonePattern.map((s) => (rpc + s) % 12),
        tensions,
        alterations,
        containsTritone,
        romanNumeralHints: suggestRomanNumeralHints(quality, family),
        cadentialStrength: detectCadentialStrength(
          quality,
          family,
          containsTritone,
        ),
        recommendedVoicings: buildRecommendedVoicings(
          quality,
          tensions,
          alterations,
        ),
        functionHints: suggestFunctionHints(quality, family),
        commonScales: suggestScales(quality, family),
        aliases: buildAliases(root, sym),
      });
    }
  }
  return out;
}

// ===================== STATIC EXPORTS FOR SSR =====================

/** All built-in chords, sorted by root (C first) then complexity. */
export const ALL_CHORDS: ChordEntry[] = generateChordArray().sort((a, b) => {
  const rootCmp = getRootSortWeight(a.root) - getRootSortWeight(b.root);
  if (rootCmp !== 0) return rootCmp;
  return getChordSortWeight(a.symbol) - getChordSortWeight(b.symbol);
});

/** Fast lookup map by chord id. */
export const CHORD_MAP = new Map<string, ChordEntry>(
  ALL_CHORDS.map((c) => [c.id, c]),
);

/** Fast lookup: chord display name → chord id. e.g. "Cdim" → "c-dim" */
export const CHORD_NAME_TO_ID = new Map<string, string>(
  ALL_CHORDS.map((c) => [c.name, c.id]),
);

/**
 * Resolve a chord display name to its URL-friendly id.
 * Falls back to a simple slug if the chord is not in the built-in map.
 */
export function resolveChordId(chordName: string): string {
  return (
    CHORD_NAME_TO_ID.get(chordName) ??
    chordNameToId(
      chordName.replace(/^([A-Ga-g][#b♯♭]?)(.*)$/, "$1"),
      chordName.replace(/^[A-Ga-g][#b♯♭]?/, ""),
    )
  );
}

/** All unique chord family values. */
export const CHORD_FAMILIES = Array.from(
  new Set(ALL_CHORDS.map((c) => c.family)),
) as ChordFamily[];

/** All unique chord quality values. */
export const CHORD_QUALITIES = Array.from(
  new Set(ALL_CHORDS.map((c) => c.quality)),
) as HarmonicQuality[];
