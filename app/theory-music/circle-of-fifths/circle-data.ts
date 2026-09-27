// ════════════════════════════════════════════════════════
// Circle of Fifths — Comprehensive Music Theory Engine & Data
// ════════════════════════════════════════════════════════

export interface KeyAccidental {
  note: string;
  type: "sharp" | "flat";
  pitchClass: number;
}

export interface DiatonicChord {
  degree: string; // "I", "ii", "iii", "IV", "V", "vi", "vii°"
  degreeIndex: number; // 0-6
  rootNote: string;
  name: string; // e.g. "C", "Dm", "G7"
  seventhName: string; // e.g. "Cmaj7", "Dm7", "G7"
  quality: "major" | "minor" | "diminished" | "dominant7" | "major7" | "minor7" | "half-diminished7";
  function: "Tonic" | "Subdominant" | "Dominant";
  notes: string[]; // e.g. ["C", "E", "G"]
  seventhNotes: string[]; // e.g. ["C", "E", "G", "B"]
  pianoIndices: number[]; // semitones relative to C (0-23)
  guitarVoicing: {
    frets: number[]; // 6 strings: [E, A, D, G, B, e], -1 = mute, 0 = open
    baseFret: number;
    fingers: number[];
  };
}

export interface SecondaryDominant {
  targetDegree: string;
  targetChord: string;
  symbol: string; // e.g. "V7/V", "V7/ii"
  chordName: string; // e.g. "D7", "A7"
  notes: string[];
  resolutionNotes: string[];
}

export interface BorrowedChord {
  symbol: string; // e.g. "iv", "bVI", "bVII", "bIII"
  chordName: string; // e.g. "Fm", "Ab", "Bb"
  sourceMode: string; // "Parallel Minor (Aeolian)", "Dorian", etc.
  character: string; // Emotional character e.g. "Nostalgic, sorrowful, cinematic"
  notes: string[];
}

export interface CircleKeyData {
  index: number; // 0 to 11 (0 = C, 1 = G, 2 = D, 3 = A, 4 = E, 5 = B, 6 = F#/Gb, 7 = Db, 8 = Ab, 9 = Eb, 10 = Bb, 11 = F)
  angle: number; // 0 to 330 deg (0 = 12 o'clock / C)
  majorKey: string; // "C", "G", "D", ...
  majorAlt?: string; // "Gb" for F#, "C#" for Db
  rootPc: number; // Pitch class 0-11
  relativeMinor: string; // "Am", "Em", "Bm", ...
  relativeMinorAlt?: string;
  parallelMinor: string; // "Cm", "Gm", ...
  diminishedChord: string; // "Bdim", "F#dim", ...
  accidentalsCount: number; // 0 to 7
  accidentalType: "none" | "sharp" | "flat" | "both";
  accidentalsList: string[]; // ["F#", "C#", "G#"]
  orderMnemonic: string; // "Father Charles Goes Down..."
  scaleNotes: string[]; // ["C", "D", "E", "F", "G", "A", "B"]
  minorScaleNotes: string[]; // ["A", "B", "C", "D", "E", "F", "G"]
  staffSharpsTreblePositions: number[]; // Staff line/space indices for key signature drawing
  staffFlatsTreblePositions: number[];
  diatonicChords: DiatonicChord[];
  secondaryDominants: SecondaryDominant[];
  tritoneSub: {
    key: string;
    chord: string;
    subV7: string;
    oppositeIndex: number;
  };
  borrowedChords: BorrowedChord[];
  modes: {
    name: string;
    root: string;
    description: string;
  }[];
  practicalTips: {
    guitarCapo: string;
    songwriting: string;
    mood: string;
  };
}

// ── Master Circle Array (Clockwise from top: C, G, D, A, E, B, F#/Gb, Db, Ab, Eb, Bb, F) ──
export const CIRCLE_KEYS: CircleKeyData[] = [
  {
    index: 0,
    angle: 0,
    majorKey: "C",
    rootPc: 0,
    relativeMinor: "Am",
    parallelMinor: "Cm",
    diminishedChord: "Bdim",
    accidentalsCount: 0,
    accidentalType: "none",
    accidentalsList: [],
    orderMnemonic: "Natural key (tanpa kres atau mol)",
    scaleNotes: ["C", "D", "E", "F", "G", "A", "B"],
    minorScaleNotes: ["A", "B", "C", "D", "E", "F", "G"],
    staffSharpsTreblePositions: [],
    staffFlatsTreblePositions: [],
    diatonicChords: [
      {
        degree: "I",
        degreeIndex: 0,
        rootNote: "C",
        name: "C",
        seventhName: "Cmaj7",
        quality: "major",
        function: "Tonic",
        notes: ["C", "E", "G"],
        seventhNotes: ["C", "E", "G", "B"],
        pianoIndices: [0, 4, 7, 11],
        guitarVoicing: { frets: [-1, 3, 2, 0, 1, 0], baseFret: 1, fingers: [0, 3, 2, 0, 1, 0] },
      },
      {
        degree: "ii",
        degreeIndex: 1,
        rootNote: "D",
        name: "Dm",
        seventhName: "Dm7",
        quality: "minor",
        function: "Subdominant",
        notes: ["D", "F", "A"],
        seventhNotes: ["D", "F", "A", "C"],
        pianoIndices: [2, 5, 9, 12],
        guitarVoicing: { frets: [-1, -1, 0, 2, 3, 1], baseFret: 1, fingers: [0, 0, 0, 2, 3, 1] },
      },
      {
        degree: "iii",
        degreeIndex: 2,
        rootNote: "E",
        name: "Em",
        seventhName: "Em7",
        quality: "minor",
        function: "Tonic",
        notes: ["E", "G", "B"],
        seventhNotes: ["E", "G", "B", "D"],
        pianoIndices: [4, 7, 11, 14],
        guitarVoicing: { frets: [0, 2, 2, 0, 0, 0], baseFret: 1, fingers: [0, 2, 3, 0, 0, 0] },
      },
      {
        degree: "IV",
        degreeIndex: 3,
        rootNote: "F",
        name: "F",
        seventhName: "Fmaj7",
        quality: "major",
        function: "Subdominant",
        notes: ["F", "A", "C"],
        seventhNotes: ["F", "A", "C", "E"],
        pianoIndices: [5, 9, 12, 16],
        guitarVoicing: { frets: [1, 3, 3, 2, 1, 1], baseFret: 1, fingers: [1, 3, 4, 2, 1, 1] },
      },
      {
        degree: "V",
        degreeIndex: 4,
        rootNote: "G",
        name: "G",
        seventhName: "G7",
        quality: "dominant7",
        function: "Dominant",
        notes: ["G", "B", "D"],
        seventhNotes: ["G", "B", "D", "F"],
        pianoIndices: [7, 11, 14, 17],
        guitarVoicing: { frets: [3, 2, 0, 0, 0, 3], baseFret: 1, fingers: [3, 2, 0, 0, 0, 4] },
      },
      {
        degree: "vi",
        degreeIndex: 5,
        rootNote: "A",
        name: "Am",
        seventhName: "Am7",
        quality: "minor",
        function: "Tonic",
        notes: ["A", "C", "E"],
        seventhNotes: ["A", "C", "E", "G"],
        pianoIndices: [9, 12, 16, 19],
        guitarVoicing: { frets: [-1, 0, 2, 2, 1, 0], baseFret: 1, fingers: [0, 0, 2, 3, 1, 0] },
      },
      {
        degree: "vii°",
        degreeIndex: 6,
        rootNote: "B",
        name: "Bdim",
        seventhName: "Bm7b5",
        quality: "half-diminished7",
        function: "Dominant",
        notes: ["B", "D", "F"],
        seventhNotes: ["B", "D", "F", "A"],
        pianoIndices: [11, 14, 17, 21],
        guitarVoicing: { frets: [-1, 2, 3, 2, 3, -1], baseFret: 1, fingers: [0, 1, 3, 2, 4, 0] },
      },
    ],
    secondaryDominants: [
      { targetDegree: "V", targetChord: "G", symbol: "V7/V", chordName: "D7", notes: ["D", "F#", "A", "C"], resolutionNotes: ["G", "B", "D"] },
      { targetDegree: "ii", targetChord: "Dm", symbol: "V7/ii", chordName: "A7", notes: ["A", "C#", "E", "G"], resolutionNotes: ["D", "F", "A"] },
      { targetDegree: "vi", targetChord: "Am", symbol: "V7/vi", chordName: "E7", notes: ["E", "G#", "B", "D"], resolutionNotes: ["A", "C", "E"] },
      { targetDegree: "IV", targetChord: "F", symbol: "V7/IV", chordName: "C7", notes: ["C", "E", "G", "Bb"], resolutionNotes: ["F", "A", "C"] },
      { targetDegree: "iii", targetChord: "Em", symbol: "V7/iii", chordName: "B7", notes: ["B", "D#", "F#", "A"], resolutionNotes: ["E", "G", "B"] },
    ],
    tritoneSub: { key: "F#/Gb", chord: "Gb7", subV7: "Db7 -> C", oppositeIndex: 6 },
    borrowedChords: [
      { symbol: "iv", chordName: "Fm", sourceMode: "Parallel Minor (C Aeolian)", character: "Nostalgia, haru, puitis (Beatles In My Life)", notes: ["F", "Ab", "C"] },
      { symbol: "bVI", chordName: "Ab", sourceMode: "Parallel Minor (C Aeolian)", character: "Epik, megah, cinematic lift (Hollywood chord)", notes: ["Ab", "C", "Eb"] },
      { symbol: "bVII", chordName: "Bb", sourceMode: "Mixolydian / Aeolian", character: "Rock anthem, heroics, upbeat power (Hey Jude)", notes: ["Bb", "D", "F"] },
      { symbol: "bIII", chordName: "Eb", sourceMode: "Parallel Minor (C Aeolian)", character: "Dark punch, bluesy grit", notes: ["Eb", "G", "Bb"] },
    ],
    modes: [
      { name: "Ionian (Mayor)", root: "C", description: "Pusat mayor, cerah, stabil dan natural" },
      { name: "Dorian", root: "D", description: "Minor dengan b6 natural, jazzy, funky (Miles Davis)" },
      { name: "Phrygian", root: "E", description: "Minor eksotis, Spanish/Flamenco feel dengan b2" },
      { name: "Lydian", root: "F", description: "Mayor dengan #4 mystical, dreamlike (Sci-Fi, Simpsons)" },
      { name: "Mixolydian", root: "G", description: "Mayor dengan b7 bluesy/rock (Sweet Child O Mine)" },
      { name: "Aeolian (Minor)", root: "A", description: "Natural minor, sedih, emosional, klasik" },
      { name: "Locrian", root: "B", description: "Diminished, tegang, misterius, jarang stabil" },
    ],
    practicalTips: {
      guitarCapo: "No Capo (Open position paling natural)",
      songwriting: "Kunci paling universal untuk memulai aransemen dan eksplorasi piano.",
      mood: "Cerah, murni, lugas, terbuka tanpa distorsi accidental.",
    },
  },
  {
    index: 1,
    angle: 30,
    majorKey: "G",
    rootPc: 7,
    relativeMinor: "Em",
    parallelMinor: "Gm",
    diminishedChord: "F#dim",
    accidentalsCount: 1,
    accidentalType: "sharp",
    accidentalsList: ["F#"],
    orderMnemonic: "Father (F#)",
    scaleNotes: ["G", "A", "B", "C", "D", "E", "F#"],
    minorScaleNotes: ["E", "F#", "G", "A", "B", "C", "D"],
    staffSharpsTreblePositions: [5], // top line F5
    staffFlatsTreblePositions: [],
    diatonicChords: [
      {
        degree: "I",
        degreeIndex: 0,
        rootNote: "G",
        name: "G",
        seventhName: "Gmaj7",
        quality: "major",
        function: "Tonic",
        notes: ["G", "B", "D"],
        seventhNotes: ["G", "B", "D", "F#"],
        pianoIndices: [7, 11, 14, 18],
        guitarVoicing: { frets: [3, 2, 0, 0, 0, 3], baseFret: 1, fingers: [3, 2, 0, 0, 0, 4] },
      },
      {
        degree: "ii",
        degreeIndex: 1,
        rootNote: "A",
        name: "Am",
        seventhName: "Am7",
        quality: "minor",
        function: "Subdominant",
        notes: ["A", "C", "E"],
        seventhNotes: ["A", "C", "E", "G"],
        pianoIndices: [9, 12, 16, 19],
        guitarVoicing: { frets: [-1, 0, 2, 2, 1, 0], baseFret: 1, fingers: [0, 0, 2, 3, 1, 0] },
      },
      {
        degree: "iii",
        degreeIndex: 2,
        rootNote: "B",
        name: "Bm",
        seventhName: "Bm7",
        quality: "minor",
        function: "Tonic",
        notes: ["B", "D", "F#"],
        seventhNotes: ["B", "D", "F#", "A"],
        pianoIndices: [11, 14, 18, 21],
        guitarVoicing: { frets: [-1, 2, 4, 4, 3, 2], baseFret: 2, fingers: [0, 1, 3, 4, 2, 1] },
      },
      {
        degree: "IV",
        degreeIndex: 3,
        rootNote: "C",
        name: "C",
        seventhName: "Cmaj7",
        quality: "major",
        function: "Subdominant",
        notes: ["C", "E", "G"],
        seventhNotes: ["C", "E", "G", "B"],
        pianoIndices: [12, 16, 19, 23],
        guitarVoicing: { frets: [-1, 3, 2, 0, 1, 0], baseFret: 1, fingers: [0, 3, 2, 0, 1, 0] },
      },
      {
        degree: "V",
        degreeIndex: 4,
        rootNote: "D",
        name: "D",
        seventhName: "D7",
        quality: "dominant7",
        function: "Dominant",
        notes: ["D", "F#", "A"],
        seventhNotes: ["D", "F#", "A", "C"],
        pianoIndices: [14, 18, 21, 24],
        guitarVoicing: { frets: [-1, -1, 0, 2, 3, 2], baseFret: 1, fingers: [0, 0, 0, 1, 3, 2] },
      },
      {
        degree: "vi",
        degreeIndex: 5,
        rootNote: "E",
        name: "Em",
        seventhName: "Em7",
        quality: "minor",
        function: "Tonic",
        notes: ["E", "G", "B"],
        seventhNotes: ["E", "G", "B", "D"],
        pianoIndices: [16, 19, 23, 26],
        guitarVoicing: { frets: [0, 2, 2, 0, 0, 0], baseFret: 1, fingers: [0, 2, 3, 0, 0, 0] },
      },
      {
        degree: "vii°",
        degreeIndex: 6,
        rootNote: "F#",
        name: "F#dim",
        seventhName: "F#m7b5",
        quality: "half-diminished7",
        function: "Dominant",
        notes: ["F#", "A", "C"],
        seventhNotes: ["F#", "A", "C", "E"],
        pianoIndices: [18, 21, 24, 28],
        guitarVoicing: { frets: [2, -1, 2, 2, 2, -1], baseFret: 2, fingers: [1, 0, 2, 3, 4, 0] },
      },
    ],
    secondaryDominants: [
      { targetDegree: "V", targetChord: "D", symbol: "V7/V", chordName: "A7", notes: ["A", "C#", "E", "G"], resolutionNotes: ["D", "F#", "A"] },
      { targetDegree: "ii", targetChord: "Am", symbol: "V7/ii", chordName: "E7", notes: ["E", "G#", "B", "D"], resolutionNotes: ["A", "C", "E"] },
      { targetDegree: "vi", targetChord: "Em", symbol: "V7/vi", chordName: "B7", notes: ["B", "D#", "F#", "A"], resolutionNotes: ["E", "G", "B"] },
      { targetDegree: "IV", targetChord: "C", symbol: "V7/IV", chordName: "G7", notes: ["G", "B", "D", "F"], resolutionNotes: ["C", "E", "G"] },
      { targetDegree: "iii", targetChord: "Bm", symbol: "V7/iii", chordName: "F#7", notes: ["F#", "A#", "C#", "E"], resolutionNotes: ["B", "D", "F#"] },
    ],
    tritoneSub: { key: "Db", chord: "Ab7", subV7: "Ab7 -> G", oppositeIndex: 7 },
    borrowedChords: [
      { symbol: "iv", chordName: "Cm", sourceMode: "Parallel Minor (G Aeolian)", character: "Melodramatis, manis-sedih", notes: ["C", "Eb", "G"] },
      { symbol: "bVI", chordName: "Eb", sourceMode: "Parallel Minor (G Aeolian)", character: "Heroic modulation lift", notes: ["Eb", "G", "Bb"] },
      { symbol: "bVII", chordName: "F", sourceMode: "Mixolydian / Aeolian", character: "Classic acoustic folk/rock cadence", notes: ["F", "A", "C"] },
    ],
    modes: [
      { name: "Ionian", root: "G", description: "Warm, pastoral, folk and acoustic favorite" },
      { name: "Dorian", root: "A", description: "Smooth modal jazz & funk" },
      { name: "Phrygian", root: "B", description: "Spanish guitar spice" },
      { name: "Lydian", root: "C", description: "Bright, sparkling float" },
      { name: "Mixolydian", root: "D", description: "Folk, rock and country standard" },
      { name: "Aeolian", root: "E", description: "The definitive guitar minor (Em)" },
      { name: "Locrian", root: "F#", description: "Sharp diminished tension" },
    ],
    practicalTips: {
      guitarCapo: "Capo 0 untuk sound gitar akustik yang paling resonan (open G & Em).",
      songwriting: "Sangat bersahabat untuk alat musik dawai, violin, dan gitar.",
      mood: "Hangat, santai, membumi, penuh kehangatan akustik.",
    },
  },
  {
    index: 2,
    angle: 60,
    majorKey: "D",
    rootPc: 2,
    relativeMinor: "Bm",
    parallelMinor: "Dm",
    diminishedChord: "C#dim",
    accidentalsCount: 2,
    accidentalType: "sharp",
    accidentalsList: ["F#", "C#"],
    orderMnemonic: "Father Charles (F#, C#)",
    scaleNotes: ["D", "E", "F#", "G", "A", "B", "C#"],
    minorScaleNotes: ["B", "C#", "D", "E", "F#", "G", "A"],
    staffSharpsTreblePositions: [5, 3], // F5, C5
    staffFlatsTreblePositions: [],
    diatonicChords: [
      { degree: "I", degreeIndex: 0, rootNote: "D", name: "D", seventhName: "Dmaj7", quality: "major", function: "Tonic", notes: ["D", "F#", "A"], seventhNotes: ["D", "F#", "A", "C#"], pianoIndices: [2, 6, 9, 13], guitarVoicing: { frets: [-1, -1, 0, 2, 3, 2], baseFret: 1, fingers: [0, 0, 0, 1, 3, 2] } },
      { degree: "ii", degreeIndex: 1, rootNote: "E", name: "Em", seventhName: "Em7", quality: "minor", function: "Subdominant", notes: ["E", "G", "B"], seventhNotes: ["E", "G", "B", "D"], pianoIndices: [4, 7, 11, 14], guitarVoicing: { frets: [0, 2, 2, 0, 0, 0], baseFret: 1, fingers: [0, 2, 3, 0, 0, 0] } },
      { degree: "iii", degreeIndex: 2, rootNote: "F#", name: "F#m", seventhName: "F#m7", quality: "minor", function: "Tonic", notes: ["F#", "A", "C#"], seventhNotes: ["F#", "A", "C#", "E"], pianoIndices: [6, 9, 13, 16], guitarVoicing: { frets: [2, 4, 4, 2, 2, 2], baseFret: 2, fingers: [1, 3, 4, 1, 1, 1] } },
      { degree: "IV", degreeIndex: 3, rootNote: "G", name: "G", seventhName: "Gmaj7", quality: "major", function: "Subdominant", notes: ["G", "B", "D"], seventhNotes: ["G", "B", "D", "F#"], pianoIndices: [7, 11, 14, 18], guitarVoicing: { frets: [3, 2, 0, 0, 0, 3], baseFret: 1, fingers: [3, 2, 0, 0, 0, 4] } },
      { degree: "V", degreeIndex: 4, rootNote: "A", name: "A", seventhName: "A7", quality: "dominant7", function: "Dominant", notes: ["A", "C#", "E"], seventhNotes: ["A", "C#", "E", "G"], pianoIndices: [9, 13, 16, 19], guitarVoicing: { frets: [-1, 0, 2, 2, 2, 0], baseFret: 1, fingers: [0, 0, 1, 2, 3, 0] } },
      { degree: "vi", degreeIndex: 5, rootNote: "B", name: "Bm", seventhName: "Bm7", quality: "minor", function: "Tonic", notes: ["B", "D", "F#"], seventhNotes: ["B", "D", "F#", "A"], pianoIndices: [11, 14, 18, 21], guitarVoicing: { frets: [-1, 2, 4, 4, 3, 2], baseFret: 2, fingers: [0, 1, 3, 4, 2, 1] } },
      { degree: "vii°", degreeIndex: 6, rootNote: "C#", name: "C#dim", seventhName: "C#m7b5", quality: "half-diminished7", function: "Dominant", notes: ["C#", "E", "G"], seventhNotes: ["C#", "E", "G", "B"], pianoIndices: [13, 16, 19, 23], guitarVoicing: { frets: [-1, 4, 5, 4, 5, -1], baseFret: 4, fingers: [0, 1, 3, 2, 4, 0] } },
    ],
    secondaryDominants: [
      { targetDegree: "V", targetChord: "A", symbol: "V7/V", chordName: "E7", notes: ["E", "G#", "B", "D"], resolutionNotes: ["A", "C#", "E"] },
      { targetDegree: "ii", targetChord: "Em", symbol: "V7/ii", chordName: "B7", notes: ["B", "D#", "F#", "A"], resolutionNotes: ["E", "G", "B"] },
      { targetDegree: "vi", targetChord: "Bm", symbol: "V7/vi", chordName: "F#7", notes: ["F#", "A#", "C#", "E"], resolutionNotes: ["B", "D", "F#"] },
    ],
    tritoneSub: { key: "Ab", chord: "Eb7", subV7: "Eb7 -> D", oppositeIndex: 8 },
    borrowedChords: [
      { symbol: "iv", chordName: "Gm", sourceMode: "Parallel Minor (D Aeolian)", character: "Intim, menyentuh, melankolis", notes: ["G", "Bb", "D"] },
      { symbol: "bVI", chordName: "Bb", sourceMode: "Parallel Minor (D Aeolian)", character: "Cinematic adventure lift", notes: ["Bb", "D", "F"] },
      { symbol: "bVII", chordName: "C", sourceMode: "Mixolydian", character: "Rock drive (Sweet Child O Mine intro key)", notes: ["C", "E", "G"] },
    ],
    modes: [
      { name: "Ionian", root: "D", description: "Glorious, triumphant, violin favorite" },
      { name: "Aeolian", root: "B", description: "Dark, melancholic, reflective" },
    ],
    practicalTips: {
      guitarCapo: "Capo 2 (bentuk C) atau Drop D tuning untuk bass menggelegar.",
      songwriting: "Kunci kemenangan, orkestrasi agung (Pachelbel Canon), dan pop ballad bertenaga.",
      mood: "Teguh, ceria, megah, optimis.",
    },
  },
  {
    index: 3,
    angle: 90,
    majorKey: "A",
    rootPc: 9,
    relativeMinor: "F#m",
    parallelMinor: "Am",
    diminishedChord: "G#dim",
    accidentalsCount: 3,
    accidentalType: "sharp",
    accidentalsList: ["F#", "C#", "G#"],
    orderMnemonic: "Father Charles Goes (F#, C#, G#)",
    scaleNotes: ["A", "B", "C#", "D", "E", "F#", "G#"],
    minorScaleNotes: ["F#", "G#", "A", "B", "C#", "D", "E"],
    staffSharpsTreblePositions: [5, 3, 6], // F5, C5, G5
    staffFlatsTreblePositions: [],
    diatonicChords: [
      { degree: "I", degreeIndex: 0, rootNote: "A", name: "A", seventhName: "Amaj7", quality: "major", function: "Tonic", notes: ["A", "C#", "E"], seventhNotes: ["A", "C#", "E", "G#"], pianoIndices: [9, 13, 16, 20], guitarVoicing: { frets: [-1, 0, 2, 2, 2, 0], baseFret: 1, fingers: [0, 0, 1, 2, 3, 0] } },
      { degree: "ii", degreeIndex: 1, rootNote: "B", name: "Bm", seventhName: "Bm7", quality: "minor", function: "Subdominant", notes: ["B", "D", "F#"], seventhNotes: ["B", "D", "F#", "A"], pianoIndices: [11, 14, 18, 21], guitarVoicing: { frets: [-1, 2, 4, 4, 3, 2], baseFret: 2, fingers: [0, 1, 3, 4, 2, 1] } },
      { degree: "iii", degreeIndex: 2, rootNote: "C#", name: "C#m", seventhName: "C#m7", quality: "minor", function: "Tonic", notes: ["C#", "E", "G#"], seventhNotes: ["C#", "E", "G#", "B"], pianoIndices: [13, 16, 20, 23], guitarVoicing: { frets: [-1, 4, 6, 6, 5, 4], baseFret: 4, fingers: [0, 1, 3, 4, 2, 1] } },
      { degree: "IV", degreeIndex: 3, rootNote: "D", name: "D", seventhName: "Dmaj7", quality: "major", function: "Subdominant", notes: ["D", "F#", "A"], seventhNotes: ["D", "F#", "A", "C#"], pianoIndices: [14, 18, 21, 25], guitarVoicing: { frets: [-1, -1, 0, 2, 3, 2], baseFret: 1, fingers: [0, 0, 0, 1, 3, 2] } },
      { degree: "V", degreeIndex: 4, rootNote: "E", name: "E", seventhName: "E7", quality: "dominant7", function: "Dominant", notes: ["E", "G#", "B"], seventhNotes: ["E", "G#", "B", "D"], pianoIndices: [16, 20, 23, 26], guitarVoicing: { frets: [0, 2, 0, 1, 0, 0], baseFret: 1, fingers: [0, 2, 0, 1, 0, 0] } },
      { degree: "vi", degreeIndex: 5, rootNote: "F#", name: "F#m", seventhName: "F#m7", quality: "minor", function: "Tonic", notes: ["F#", "A", "C#"], seventhNotes: ["F#", "A", "C#", "E"], pianoIndices: [18, 21, 25, 28], guitarVoicing: { frets: [2, 4, 4, 2, 2, 2], baseFret: 2, fingers: [1, 3, 4, 1, 1, 1] } },
      { degree: "vii°", degreeIndex: 6, rootNote: "G#", name: "G#dim", seventhName: "G#m7b5", quality: "half-diminished7", function: "Dominant", notes: ["G#", "B", "D"], seventhNotes: ["G#", "B", "D", "F#"], pianoIndices: [20, 23, 26, 30], guitarVoicing: { frets: [4, -1, 4, 4, 4, -1], baseFret: 4, fingers: [1, 0, 2, 3, 4, 0] } },
    ],
    secondaryDominants: [
      { targetDegree: "V", targetChord: "E", symbol: "V7/V", chordName: "B7", notes: ["B", "D#", "F#", "A"], resolutionNotes: ["E", "G#", "B"] },
      { targetDegree: "ii", targetChord: "Bm", symbol: "V7/ii", chordName: "F#7", notes: ["F#", "A#", "C#", "E"], resolutionNotes: ["B", "D", "F#"] },
      { targetDegree: "vi", targetChord: "F#m", symbol: "V7/vi", chordName: "C#7", notes: ["C#", "E#", "G#", "B"], resolutionNotes: ["F#", "A", "C#"] },
    ],
    tritoneSub: { key: "Eb", chord: "Bb7", subV7: "Bb7 -> A", oppositeIndex: 9 },
    borrowedChords: [
      { symbol: "iv", chordName: "Dm", sourceMode: "Parallel Minor (A Aeolian)", character: "Sweet sad emotional pull", notes: ["D", "F", "A"] },
      { symbol: "bVI", chordName: "F", sourceMode: "Parallel Minor (A Aeolian)", character: "Dramatic rock shift (Wonderwall chord)", notes: ["F", "A", "C"] },
      { symbol: "bVII", chordName: "G", sourceMode: "Mixolydian", character: "Classic stadium rock energy", notes: ["G", "B", "D"] },
    ],
    modes: [
      { name: "Ionian", root: "A", description: "Bright, confident, stadium rock and pop power" },
      { name: "Aeolian", root: "F#", description: "Emotional rock ballads and indie anthems" },
    ],
    practicalTips: {
      guitarCapo: "Bisa dimainkan open A, D, E tanpa capo, atau Capo 2 dari G shape.",
      songwriting: "Sangat populer di pop rock, indie, dan band gitar elektrik.",
      mood: "Percaya diri, bersinar, enerjik, tegas.",
    },
  },
  {
    index: 4,
    angle: 120,
    majorKey: "E",
    rootPc: 4,
    relativeMinor: "C#m",
    parallelMinor: "Em",
    diminishedChord: "D#dim",
    accidentalsCount: 4,
    accidentalType: "sharp",
    accidentalsList: ["F#", "C#", "G#", "D#"],
    orderMnemonic: "Father Charles Goes Down (F#, C#, G#, D#)",
    scaleNotes: ["E", "F#", "G#", "A", "B", "C#", "D#"],
    minorScaleNotes: ["C#", "D#", "E", "F#", "G#", "A", "B"],
    staffSharpsTreblePositions: [5, 3, 6, 4], // F5, C5, G5, D5
    staffFlatsTreblePositions: [],
    diatonicChords: [
      { degree: "I", degreeIndex: 0, rootNote: "E", name: "E", seventhName: "Emaj7", quality: "major", function: "Tonic", notes: ["E", "G#", "B"], seventhNotes: ["E", "G#", "B", "D#"], pianoIndices: [4, 8, 11, 15], guitarVoicing: { frets: [0, 2, 2, 1, 0, 0], baseFret: 1, fingers: [0, 2, 3, 1, 0, 0] } },
      { degree: "ii", degreeIndex: 1, rootNote: "F#", name: "F#m", seventhName: "F#m7", quality: "minor", function: "Subdominant", notes: ["F#", "A", "C#"], seventhNotes: ["F#", "A", "C#", "E"], pianoIndices: [6, 9, 13, 16], guitarVoicing: { frets: [2, 4, 4, 2, 2, 2], baseFret: 2, fingers: [1, 3, 4, 1, 1, 1] } },
      { degree: "iii", degreeIndex: 2, rootNote: "G#", name: "G#m", seventhName: "G#m7", quality: "minor", function: "Tonic", notes: ["G#", "B", "D#"], seventhNotes: ["G#", "B", "D#", "F#"], pianoIndices: [8, 11, 15, 18], guitarVoicing: { frets: [4, 6, 6, 4, 4, 4], baseFret: 4, fingers: [1, 3, 4, 1, 1, 1] } },
      { degree: "IV", degreeIndex: 3, rootNote: "A", name: "A", seventhName: "Amaj7", quality: "major", function: "Subdominant", notes: ["A", "C#", "E"], seventhNotes: ["A", "C#", "E", "G#"], pianoIndices: [9, 13, 16, 20], guitarVoicing: { frets: [-1, 0, 2, 2, 2, 0], baseFret: 1, fingers: [0, 0, 1, 2, 3, 0] } },
      { degree: "V", degreeIndex: 4, rootNote: "B", name: "B", seventhName: "B7", quality: "dominant7", function: "Dominant", notes: ["B", "D#", "F#"], seventhNotes: ["B", "D#", "F#", "A"], pianoIndices: [11, 15, 18, 21], guitarVoicing: { frets: [-1, 2, 1, 2, 0, 2], baseFret: 1, fingers: [0, 2, 1, 3, 0, 4] } },
      { degree: "vi", degreeIndex: 5, rootNote: "C#", name: "C#m", seventhName: "C#m7", quality: "minor", function: "Tonic", notes: ["C#", "E", "G#"], seventhNotes: ["C#", "E", "G#", "B"], pianoIndices: [13, 16, 20, 23], guitarVoicing: { frets: [-1, 4, 6, 6, 5, 4], baseFret: 4, fingers: [0, 1, 3, 4, 2, 1] } },
      { degree: "vii°", degreeIndex: 6, rootNote: "D#", name: "D#dim", seventhName: "D#m7b5", quality: "half-diminished7", function: "Dominant", notes: ["D#", "F#", "A"], seventhNotes: ["D#", "F#", "A", "C#"], pianoIndices: [15, 18, 21, 25], guitarVoicing: { frets: [-1, 6, 7, 6, 7, -1], baseFret: 6, fingers: [0, 1, 3, 2, 4, 0] } },
    ],
    secondaryDominants: [
      { targetDegree: "V", targetChord: "B", symbol: "V7/V", chordName: "F#7", notes: ["F#", "A#", "C#", "E"], resolutionNotes: ["B", "D#", "F#"] },
      { targetDegree: "ii", targetChord: "F#m", symbol: "V7/ii", chordName: "C#7", notes: ["C#", "E#", "G#", "B"], resolutionNotes: ["F#", "A", "C#"] },
      { targetDegree: "vi", targetChord: "C#m", symbol: "V7/vi", chordName: "G#7", notes: ["G#", "B#", "D#", "F#"], resolutionNotes: ["C#", "E", "G#"] },
    ],
    tritoneSub: { key: "Bb", chord: "F7", subV7: "F7 -> E", oppositeIndex: 10 },
    borrowedChords: [
      { symbol: "iv", chordName: "Am", sourceMode: "Parallel Minor (E Aeolian)", character: "Intense yearning, dark romanticism", notes: ["A", "C", "E"] },
      { symbol: "bVI", chordName: "C", sourceMode: "Parallel Minor (E Aeolian)", character: "Epic power lift (Space/Rock motif)", notes: ["C", "E", "G"] },
      { symbol: "bVII", chordName: "D", sourceMode: "Mixolydian", character: "Classic blues/rock open groove", notes: ["D", "F#", "A"] },
    ],
    modes: [
      { name: "Ionian", root: "E", description: "The king of electric guitar keys (Jimi Hendrix, Blues)" },
      { name: "Aeolian", root: "C#m", description: "Emotional modern pop & rock (Shape of You)" },
    ],
    practicalTips: {
      guitarCapo: "Raja gitar elektrik: Semua 6 string open string beresonansi sempurna.",
      songwriting: "Kunci terbaik untuk riff blues, rock, dan balada gitar akustik penuh.",
      mood: "Berenergi tinggi, berkilau, megah, elektrik.",
    },
  },
  {
    index: 5,
    angle: 150,
    majorKey: "B",
    majorAlt: "Cb",
    rootPc: 11,
    relativeMinor: "G#m",
    relativeMinorAlt: "Abm",
    parallelMinor: "Bm",
    diminishedChord: "A#dim",
    accidentalsCount: 5,
    accidentalType: "sharp",
    accidentalsList: ["F#", "C#", "G#", "D#", "A#"],
    orderMnemonic: "Father Charles Goes Down And (F#, C#, G#, D#, A#)",
    scaleNotes: ["B", "C#", "D#", "E", "F#", "G#", "A#"],
    minorScaleNotes: ["G#", "A#", "B", "C#", "D#", "E", "F#"],
    staffSharpsTreblePositions: [5, 3, 6, 4, 2], // F5, C5, G5, D5, A4
    staffFlatsTreblePositions: [],
    diatonicChords: [
      { degree: "I", degreeIndex: 0, rootNote: "B", name: "B", seventhName: "Bmaj7", quality: "major", function: "Tonic", notes: ["B", "D#", "F#"], seventhNotes: ["B", "D#", "F#", "A#"], pianoIndices: [11, 15, 18, 22], guitarVoicing: { frets: [-1, 2, 4, 4, 4, 2], baseFret: 2, fingers: [0, 1, 2, 3, 4, 1] } },
      { degree: "ii", degreeIndex: 1, rootNote: "C#", name: "C#m", seventhName: "C#m7", quality: "minor", function: "Subdominant", notes: ["C#", "E", "G#"], seventhNotes: ["C#", "E", "G#", "B"], pianoIndices: [13, 16, 20, 23], guitarVoicing: { frets: [-1, 4, 6, 6, 5, 4], baseFret: 4, fingers: [0, 1, 3, 4, 2, 1] } },
      { degree: "iii", degreeIndex: 2, rootNote: "D#", name: "D#m", seventhName: "D#m7", quality: "minor", function: "Tonic", notes: ["D#", "F#", "A#"], seventhNotes: ["D#", "F#", "A#", "C#"], pianoIndices: [15, 18, 22, 25], guitarVoicing: { frets: [-1, 6, 8, 8, 7, 6], baseFret: 6, fingers: [0, 1, 3, 4, 2, 1] } },
      { degree: "IV", degreeIndex: 3, rootNote: "E", name: "E", seventhName: "Emaj7", quality: "major", function: "Subdominant", notes: ["E", "G#", "B"], seventhNotes: ["E", "G#", "B", "D#"], pianoIndices: [16, 20, 23, 27], guitarVoicing: { frets: [0, 2, 2, 1, 0, 0], baseFret: 1, fingers: [0, 2, 3, 1, 0, 0] } },
      { degree: "V", degreeIndex: 4, rootNote: "F#", name: "F#", seventhName: "F#7", quality: "dominant7", function: "Dominant", notes: ["F#", "A#", "C#"], seventhNotes: ["F#", "A#", "C#", "E"], pianoIndices: [18, 22, 25, 28], guitarVoicing: { frets: [2, 4, 2, 3, 2, 2], baseFret: 2, fingers: [1, 3, 1, 2, 1, 1] } },
      { degree: "vi", degreeIndex: 5, rootNote: "G#", name: "G#m", seventhName: "G#m7", quality: "minor", function: "Tonic", notes: ["G#", "B", "D#"], seventhNotes: ["G#", "B", "D#", "F#"], pianoIndices: [20, 23, 27, 30], guitarVoicing: { frets: [4, 6, 6, 4, 4, 4], baseFret: 4, fingers: [1, 3, 4, 1, 1, 1] } },
      { degree: "vii°", degreeIndex: 6, rootNote: "A#", name: "A#dim", seventhName: "A#m7b5", quality: "half-diminished7", function: "Dominant", notes: ["A#", "C#", "E"], seventhNotes: ["A#", "C#", "E", "G#"], pianoIndices: [22, 25, 28, 32], guitarVoicing: { frets: [-1, 1, 2, 1, 2, -1], baseFret: 1, fingers: [0, 1, 3, 2, 4, 0] } },
    ],
    secondaryDominants: [
      { targetDegree: "V", targetChord: "F#", symbol: "V7/V", chordName: "C#7", notes: ["C#", "E#", "G#", "B"], resolutionNotes: ["F#", "A#", "C#"] },
      { targetDegree: "vi", targetChord: "G#m", symbol: "V7/vi", chordName: "D#7", notes: ["D#", "Fx", "A#", "C#"], resolutionNotes: ["G#", "B", "D#"] },
    ],
    tritoneSub: { key: "F", chord: "C7", subV7: "C7 -> B", oppositeIndex: 11 },
    borrowedChords: [
      { symbol: "iv", chordName: "Em", sourceMode: "Parallel Minor", character: "Dark, melancholic touch", notes: ["E", "G", "B"] },
      { symbol: "bVI", chordName: "G", sourceMode: "Parallel Minor", character: "Warm surprising major lift", notes: ["G", "B", "D"] },
      { symbol: "bVII", chordName: "A", sourceMode: "Mixolydian", character: "Bright energetic power", notes: ["A", "C#", "E"] },
    ],
    modes: [
      { name: "Ionian", root: "B", description: "Lush, brilliant, rich piano key" },
      { name: "Aeolian", root: "G#m", description: "Deeply emotional, Chopin's favorite" },
    ],
    practicalTips: {
      guitarCapo: "Capo 4 (G shape) atau Capo 2 (A shape) untuk kenyamanan jari.",
      songwriting: "Pilihan favorit untuk ballad piano romantis dan lagu pop vokal tinggi.",
      mood: "Mewah, hangat, penuh gairah, romantis.",
    },
  },
  {
    index: 6,
    angle: 180,
    majorKey: "F#",
    majorAlt: "Gb",
    rootPc: 6,
    relativeMinor: "D#m",
    relativeMinorAlt: "Ebm",
    parallelMinor: "F#m",
    diminishedChord: "E#dim",
    accidentalsCount: 6,
    accidentalType: "both",
    accidentalsList: ["F#", "C#", "G#", "D#", "A#", "E#"],
    orderMnemonic: "Father Charles Goes Down And Ends (6#) / BEADGC (6b)",
    scaleNotes: ["F#", "G#", "A#", "B", "C#", "D#", "E#"],
    minorScaleNotes: ["D#", "E#", "F#", "G#", "A#", "B", "C#"],
    staffSharpsTreblePositions: [5, 3, 6, 4, 2, 5],
    staffFlatsTreblePositions: [3, 5, 2, 4, 1, 3],
    diatonicChords: [
      { degree: "I", degreeIndex: 0, rootNote: "F#", name: "F#", seventhName: "F#maj7", quality: "major", function: "Tonic", notes: ["F#", "A#", "C#"], seventhNotes: ["F#", "A#", "C#", "E#"], pianoIndices: [6, 10, 13, 17], guitarVoicing: { frets: [2, 4, 4, 3, 2, 2], baseFret: 2, fingers: [1, 3, 4, 2, 1, 1] } },
      { degree: "ii", degreeIndex: 1, rootNote: "G#", name: "G#m", seventhName: "G#m7", quality: "minor", function: "Subdominant", notes: ["G#", "B", "D#"], seventhNotes: ["G#", "B", "D#", "F#"], pianoIndices: [8, 11, 15, 18], guitarVoicing: { frets: [4, 6, 6, 4, 4, 4], baseFret: 4, fingers: [1, 3, 4, 1, 1, 1] } },
      { degree: "iii", degreeIndex: 2, rootNote: "A#", name: "A#m", seventhName: "A#m7", quality: "minor", function: "Tonic", notes: ["A#", "C#", "E#"], seventhNotes: ["A#", "C#", "E#", "G#"], pianoIndices: [10, 13, 17, 20], guitarVoicing: { frets: [-1, 1, 3, 3, 2, 1], baseFret: 1, fingers: [0, 1, 3, 4, 2, 1] } },
      { degree: "IV", degreeIndex: 3, rootNote: "B", name: "B", seventhName: "Bmaj7", quality: "major", function: "Subdominant", notes: ["B", "D#", "F#"], seventhNotes: ["B", "D#", "F#", "A#"], pianoIndices: [11, 15, 18, 22], guitarVoicing: { frets: [-1, 2, 4, 4, 4, 2], baseFret: 2, fingers: [0, 1, 2, 3, 4, 1] } },
      { degree: "V", degreeIndex: 4, rootNote: "C#", name: "C#", seventhName: "C#7", quality: "dominant7", function: "Dominant", notes: ["C#", "E#", "G#"], seventhNotes: ["C#", "E#", "G#", "B"], pianoIndices: [13, 17, 20, 23], guitarVoicing: { frets: [-1, 4, 3, 4, 2, -1], baseFret: 2, fingers: [0, 3, 2, 4, 1, 0] } },
      { degree: "vi", degreeIndex: 5, rootNote: "D#", name: "D#m", seventhName: "D#m7", quality: "minor", function: "Tonic", notes: ["D#", "F#", "A#"], seventhNotes: ["D#", "F#", "A#", "C#"], pianoIndices: [15, 18, 22, 25], guitarVoicing: { frets: [-1, 6, 8, 8, 7, 6], baseFret: 6, fingers: [0, 1, 3, 4, 2, 1] } },
      { degree: "vii°", degreeIndex: 6, rootNote: "E#", name: "E#dim", seventhName: "E#m7b5", quality: "half-diminished7", function: "Dominant", notes: ["E#", "G#", "B"], seventhNotes: ["E#", "G#", "B", "D#"], pianoIndices: [17, 20, 23, 27], guitarVoicing: { frets: [1, -1, 1, 1, 1, -1], baseFret: 1, fingers: [1, 0, 2, 3, 4, 0] } },
    ],
    secondaryDominants: [
      { targetDegree: "V", targetChord: "C#", symbol: "V7/V", chordName: "G#7", notes: ["G#", "B#", "D#", "F#"], resolutionNotes: ["C#", "E#", "G#"] },
      { targetDegree: "vi", targetChord: "D#m", symbol: "V7/vi", chordName: "A#7", notes: ["A#", "Cx", "E#", "G#"], resolutionNotes: ["D#", "F#", "A#"] },
    ],
    tritoneSub: { key: "C", chord: "G7", subV7: "G7 -> F#", oppositeIndex: 0 },
    borrowedChords: [
      { symbol: "iv", chordName: "Bm / Bbm", sourceMode: "Parallel Minor", character: "Dreamy cinematic sadness", notes: ["B", "D", "F#"] },
      { symbol: "bVI", chordName: "D", sourceMode: "Parallel Minor", character: "Magical fantasy mod", notes: ["D", "F#", "A"] },
      { symbol: "bVII", chordName: "E", sourceMode: "Mixolydian", character: "Rock open chord drive", notes: ["E", "G#", "B"] },
    ],
    modes: [
      { name: "Ionian", root: "F#", description: "Enharmonic bridge point: 6 sharps or 6 flats" },
      { name: "Aeolian", root: "D#m", description: "Lush R&B and synth-pop territory" },
    ],
    practicalTips: {
      guitarCapo: "Capo 2 (E shape) atau Capo 4 (D shape) atau Capo 6 (C shape).",
      songwriting: "Titik temu enharmonic F# dan Gb; keyboardist sangat menyukai black keys.",
      mood: "Megah, misterius, transendental, sangat kaya tekstur.",
    },
  },
  {
    index: 7,
    angle: 210,
    majorKey: "Db",
    majorAlt: "C#",
    rootPc: 1,
    relativeMinor: "Bbm",
    relativeMinorAlt: "A#m",
    parallelMinor: "Dbm",
    diminishedChord: "Cdim",
    accidentalsCount: 5,
    accidentalType: "flat",
    accidentalsList: ["Bb", "Eb", "Ab", "Db", "Gb"],
    orderMnemonic: "Battle Ends And Down Goes (Bb, Eb, Ab, Db, Gb)",
    scaleNotes: ["Db", "Eb", "F", "Gb", "Ab", "Bb", "C"],
    minorScaleNotes: ["Bb", "C", "Db", "Eb", "F", "Gb", "Ab"],
    staffSharpsTreblePositions: [],
    staffFlatsTreblePositions: [3, 5, 2, 4, 1], // B4, E5, A4, D5, G4
    diatonicChords: [
      { degree: "I", degreeIndex: 0, rootNote: "Db", name: "Db", seventhName: "Dbmaj7", quality: "major", function: "Tonic", notes: ["Db", "F", "Ab"], seventhNotes: ["Db", "F", "Ab", "C"], pianoIndices: [1, 5, 8, 12], guitarVoicing: { frets: [-1, 4, 6, 6, 6, 4], baseFret: 4, fingers: [0, 1, 2, 3, 4, 1] } },
      { degree: "ii", degreeIndex: 1, rootNote: "Eb", name: "Ebm", seventhName: "Ebm7", quality: "minor", function: "Subdominant", notes: ["Eb", "Gb", "Bb"], seventhNotes: ["Eb", "Gb", "Bb", "Db"], pianoIndices: [3, 6, 10, 13], guitarVoicing: { frets: [-1, 6, 8, 8, 7, 6], baseFret: 6, fingers: [0, 1, 3, 4, 2, 1] } },
      { degree: "iii", degreeIndex: 2, rootNote: "F", name: "Fm", seventhName: "Fm7", quality: "minor", function: "Tonic", notes: ["F", "Ab", "C"], seventhNotes: ["F", "Ab", "C", "Eb"], pianoIndices: [5, 8, 12, 15], guitarVoicing: { frets: [1, 3, 3, 1, 1, 1], baseFret: 1, fingers: [1, 3, 4, 1, 1, 1] } },
      { degree: "IV", degreeIndex: 3, rootNote: "Gb", name: "Gb", seventhName: "Gbmaj7", quality: "major", function: "Subdominant", notes: ["Gb", "Bb", "Db"], seventhNotes: ["Gb", "Bb", "Db", "F"], pianoIndices: [6, 10, 13, 17], guitarVoicing: { frets: [2, 4, 4, 3, 2, 2], baseFret: 2, fingers: [1, 3, 4, 2, 1, 1] } },
      { degree: "V", degreeIndex: 4, rootNote: "Ab", name: "Ab", seventhName: "Ab7", quality: "dominant7", function: "Dominant", notes: ["Ab", "C", "Eb"], seventhNotes: ["Ab", "C", "Eb", "Gb"], pianoIndices: [8, 12, 15, 18], guitarVoicing: { frets: [4, 6, 4, 5, 4, 4], baseFret: 4, fingers: [1, 3, 1, 2, 1, 1] } },
      { degree: "vi", degreeIndex: 5, rootNote: "Bb", name: "Bbm", seventhName: "Bbm7", quality: "minor", function: "Tonic", notes: ["Bb", "Db", "F"], seventhNotes: ["Bb", "Db", "F", "Ab"], pianoIndices: [10, 13, 17, 20], guitarVoicing: { frets: [-1, 1, 3, 3, 2, 1], baseFret: 1, fingers: [0, 1, 3, 4, 2, 1] } },
      { degree: "vii°", degreeIndex: 6, rootNote: "C", name: "Cdim", seventhName: "Cm7b5", quality: "half-diminished7", function: "Dominant", notes: ["C", "Eb", "Gb"], seventhNotes: ["C", "Eb", "Gb", "Bb"], pianoIndices: [12, 15, 18, 22], guitarVoicing: { frets: [-1, 3, 4, 3, 4, -1], baseFret: 3, fingers: [0, 1, 3, 2, 4, 0] } },
    ],
    secondaryDominants: [
      { targetDegree: "V", targetChord: "Ab", symbol: "V7/V", chordName: "Eb7", notes: ["Eb", "G", "Bb", "Db"], resolutionNotes: ["Ab", "C", "Eb"] },
      { targetDegree: "vi", targetChord: "Bbm", symbol: "V7/vi", chordName: "F7", notes: ["F", "A", "C", "Eb"], resolutionNotes: ["Bb", "Db", "F"] },
    ],
    tritoneSub: { key: "G", chord: "D7", subV7: "D7 -> Db", oppositeIndex: 1 },
    borrowedChords: [
      { symbol: "iv", chordName: "Gbm", sourceMode: "Parallel Minor", character: "Ultra-luscious sadness", notes: ["Gb", "Bbb", "Db"] },
      { symbol: "bVI", chordName: "A", sourceMode: "Parallel Minor", character: "Bright surprising mod", notes: ["A", "C#", "E"] },
      { symbol: "bVII", chordName: "B", sourceMode: "Mixolydian", character: "Rock lift", notes: ["B", "D#", "F#"] },
    ],
    modes: [
      { name: "Ionian", root: "Db", description: "Lush, velvet, favorite of Debussy & modern R&B" },
      { name: "Aeolian", root: "Bbm", description: "Deep, poignant, expressive piano ballade" },
    ],
    practicalTips: {
      guitarCapo: "Capo 1 (C shape) atau Capo 4 (A shape) untuk open chord voicing.",
      songwriting: "Sangat lembut di piano dan vokal hangat bernada soulful / neo-soul.",
      mood: "Beludru, intim, mewah, tenang.",
    },
  },
  {
    index: 8,
    angle: 240,
    majorKey: "Ab",
    majorAlt: "G#",
    rootPc: 8,
    relativeMinor: "Fm",
    parallelMinor: "Abm",
    diminishedChord: "Gdim",
    accidentalsCount: 4,
    accidentalType: "flat",
    accidentalsList: ["Bb", "Eb", "Ab", "Db"],
    orderMnemonic: "Battle Ends And Down (Bb, Eb, Ab, Db)",
    scaleNotes: ["Ab", "Bb", "C", "Db", "Eb", "F", "G"],
    minorScaleNotes: ["F", "G", "Ab", "Bb", "C", "Db", "Eb"],
    staffSharpsTreblePositions: [],
    staffFlatsTreblePositions: [3, 5, 2, 4], // B4, E5, A4, D5
    diatonicChords: [
      { degree: "I", degreeIndex: 0, rootNote: "Ab", name: "Ab", seventhName: "Abmaj7", quality: "major", function: "Tonic", notes: ["Ab", "C", "Eb"], seventhNotes: ["Ab", "C", "Eb", "G"], pianoIndices: [8, 12, 15, 19], guitarVoicing: { frets: [4, 6, 6, 5, 4, 4], baseFret: 4, fingers: [1, 3, 4, 2, 1, 1] } },
      { degree: "ii", degreeIndex: 1, rootNote: "Bb", name: "Bbm", seventhName: "Bbm7", quality: "minor", function: "Subdominant", notes: ["Bb", "Db", "F"], seventhNotes: ["Bb", "Db", "F", "Ab"], pianoIndices: [10, 13, 17, 20], guitarVoicing: { frets: [-1, 1, 3, 3, 2, 1], baseFret: 1, fingers: [0, 1, 3, 4, 2, 1] } },
      { degree: "iii", degreeIndex: 2, rootNote: "C", name: "Cm", seventhName: "Cm7", quality: "minor", function: "Tonic", notes: ["C", "Eb", "G"], seventhNotes: ["C", "Eb", "G", "Bb"], pianoIndices: [12, 15, 19, 22], guitarVoicing: { frets: [-1, 3, 5, 5, 4, 3], baseFret: 3, fingers: [0, 1, 3, 4, 2, 1] } },
      { degree: "IV", degreeIndex: 3, rootNote: "Db", name: "Db", seventhName: "Dbmaj7", quality: "major", function: "Subdominant", notes: ["Db", "F", "Ab"], seventhNotes: ["Db", "F", "Ab", "C"], pianoIndices: [13, 17, 20, 24], guitarVoicing: { frets: [-1, 4, 6, 6, 6, 4], baseFret: 4, fingers: [0, 1, 2, 3, 4, 1] } },
      { degree: "V", degreeIndex: 4, rootNote: "Eb", name: "Eb", seventhName: "Eb7", quality: "dominant7", function: "Dominant", notes: ["Eb", "G", "Bb"], seventhNotes: ["Eb", "G", "Bb", "Db"], pianoIndices: [15, 19, 22, 25], guitarVoicing: { frets: [-1, 6, 5, 6, 4, -1], baseFret: 4, fingers: [0, 3, 2, 4, 1, 0] } },
      { degree: "vi", degreeIndex: 5, rootNote: "F", name: "Fm", seventhName: "Fm7", quality: "minor", function: "Tonic", notes: ["F", "Ab", "C"], seventhNotes: ["F", "Ab", "C", "Eb"], pianoIndices: [17, 20, 24, 27], guitarVoicing: { frets: [1, 3, 3, 1, 1, 1], baseFret: 1, fingers: [1, 3, 4, 1, 1, 1] } },
      { degree: "vii°", degreeIndex: 6, rootNote: "G", name: "Gdim", seventhName: "Gm7b5", quality: "half-diminished7", function: "Dominant", notes: ["G", "Bb", "Db"], seventhNotes: ["G", "Bb", "Db", "F"], pianoIndices: [19, 22, 25, 29], guitarVoicing: { frets: [3, -1, 3, 3, 2, -1], baseFret: 2, fingers: [2, 0, 3, 4, 1, 0] } },
    ],
    secondaryDominants: [
      { targetDegree: "V", targetChord: "Eb", symbol: "V7/V", chordName: "Bb7", notes: ["Bb", "D", "F", "Ab"], resolutionNotes: ["Eb", "G", "Bb"] },
      { targetDegree: "vi", targetChord: "Fm", symbol: "V7/vi", chordName: "C7", notes: ["C", "E", "G", "Bb"], resolutionNotes: ["F", "Ab", "C"] },
    ],
    tritoneSub: { key: "D", chord: "A7", subV7: "A7 -> Ab", oppositeIndex: 2 },
    borrowedChords: [
      { symbol: "iv", chordName: "Dbm", sourceMode: "Parallel Minor", character: "Bittersweet nostalgia", notes: ["Db", "Fb", "Ab"] },
      { symbol: "bVI", chordName: "E", sourceMode: "Parallel Minor", character: "Bright lift", notes: ["E", "G#", "B"] },
      { symbol: "bVII", chordName: "Gb", sourceMode: "Mixolydian", character: "Soulful gospel groove", notes: ["Gb", "Bb", "Db"] },
    ],
    modes: [
      { name: "Ionian", root: "Ab", description: "Rich, solemn, expansive brass & vocal favorite" },
      { name: "Aeolian", root: "Fm", description: "Dramatic, intense, classic minor theater" },
    ],
    practicalTips: {
      guitarCapo: "Capo 1 (G shape) atau Capo 4 (E shape) atau Capo 3 (F shape).",
      songwriting: "Sangat populer pada musik Motown, gospel, RnB, dan lagu piano romantis.",
      mood: "Mulia, syahdu, agung, penuh perasaan.",
    },
  },
  {
    index: 9,
    angle: 270,
    majorKey: "Eb",
    majorAlt: "D#",
    rootPc: 3,
    relativeMinor: "Cm",
    parallelMinor: "Ebm",
    diminishedChord: "Ddim",
    accidentalsCount: 3,
    accidentalType: "flat",
    accidentalsList: ["Bb", "Eb", "Ab"],
    orderMnemonic: "Battle Ends And (Bb, Eb, Ab)",
    scaleNotes: ["Eb", "F", "G", "Ab", "Bb", "C", "D"],
    minorScaleNotes: ["C", "D", "Eb", "F", "G", "Ab", "Bb"],
    staffSharpsTreblePositions: [],
    staffFlatsTreblePositions: [3, 5, 2], // B4, E5, A4
    diatonicChords: [
      { degree: "I", degreeIndex: 0, rootNote: "Eb", name: "Eb", seventhName: "Ebmaj7", quality: "major", function: "Tonic", notes: ["Eb", "G", "Bb"], seventhNotes: ["Eb", "G", "Bb", "D"], pianoIndices: [3, 7, 10, 14], guitarVoicing: { frets: [-1, 6, 8, 8, 8, 6], baseFret: 6, fingers: [0, 1, 2, 3, 4, 1] } },
      { degree: "ii", degreeIndex: 1, rootNote: "F", name: "Fm", seventhName: "Fm7", quality: "minor", function: "Subdominant", notes: ["F", "Ab", "C"], seventhNotes: ["F", "Ab", "C", "Eb"], pianoIndices: [5, 8, 12, 15], guitarVoicing: { frets: [1, 3, 3, 1, 1, 1], baseFret: 1, fingers: [1, 3, 4, 1, 1, 1] } },
      { degree: "iii", degreeIndex: 2, rootNote: "G", name: "Gm", seventhName: "Gm7", quality: "minor", function: "Tonic", notes: ["G", "Bb", "D"], seventhNotes: ["G", "Bb", "D", "F"], pianoIndices: [7, 10, 14, 17], guitarVoicing: { frets: [3, 5, 5, 3, 3, 3], baseFret: 3, fingers: [1, 3, 4, 1, 1, 1] } },
      { degree: "IV", degreeIndex: 3, rootNote: "Ab", name: "Ab", seventhName: "Abmaj7", quality: "major", function: "Subdominant", notes: ["Ab", "C", "Eb"], seventhNotes: ["Ab", "C", "Eb", "G"], pianoIndices: [8, 12, 15, 19], guitarVoicing: { frets: [4, 6, 6, 5, 4, 4], baseFret: 4, fingers: [1, 3, 4, 2, 1, 1] } },
      { degree: "V", degreeIndex: 4, rootNote: "Bb", name: "Bb", seventhName: "Bb7", quality: "dominant7", function: "Dominant", notes: ["Bb", "D", "F"], seventhNotes: ["Bb", "D", "F", "Ab"], pianoIndices: [10, 14, 17, 20], guitarVoicing: { frets: [-1, 1, 3, 1, 3, 1], baseFret: 1, fingers: [0, 1, 3, 1, 4, 1] } },
      { degree: "vi", degreeIndex: 5, rootNote: "C", name: "Cm", seventhName: "Cm7", quality: "minor", function: "Tonic", notes: ["C", "Eb", "G"], seventhNotes: ["C", "Eb", "G", "Bb"], pianoIndices: [12, 15, 19, 22], guitarVoicing: { frets: [-1, 3, 5, 5, 4, 3], baseFret: 3, fingers: [0, 1, 3, 4, 2, 1] } },
      { degree: "vii°", degreeIndex: 6, rootNote: "D", name: "Ddim", seventhName: "Dm7b5", quality: "half-diminished7", function: "Dominant", notes: ["D", "F", "Ab"], seventhNotes: ["D", "F", "Ab", "C"], pianoIndices: [14, 17, 20, 24], guitarVoicing: { frets: [-1, 5, 6, 5, 6, -1], baseFret: 5, fingers: [0, 1, 3, 2, 4, 0] } },
    ],
    secondaryDominants: [
      { targetDegree: "V", targetChord: "Bb", symbol: "V7/V", chordName: "F7", notes: ["F", "A", "C", "Eb"], resolutionNotes: ["Bb", "D", "F"] },
      { targetDegree: "vi", targetChord: "Cm", symbol: "V7/vi", chordName: "G7", notes: ["G", "B", "D", "F"], resolutionNotes: ["C", "Eb", "G"] },
    ],
    tritoneSub: { key: "A", chord: "E7", subV7: "E7 -> Eb", oppositeIndex: 3 },
    borrowedChords: [
      { symbol: "iv", chordName: "Abm", sourceMode: "Parallel Minor", character: "Pahit manis, nostalgia jazz", notes: ["Ab", "Cb", "Eb"] },
      { symbol: "bVI", chordName: "B", sourceMode: "Parallel Minor", character: "Epic romantic lift", notes: ["B", "D#", "F#"] },
      { symbol: "bVII", chordName: "Db", sourceMode: "Mixolydian", character: "Bluesy soul movement", notes: ["Db", "F", "Ab"] },
    ],
    modes: [
      { name: "Ionian", root: "Eb", description: "The heroic, brassy key of Beethoven's Eroica" },
      { name: "Aeolian", root: "Cm", description: "Beethoven's tragic key (Symphony No. 5)" },
    ],
    practicalTips: {
      guitarCapo: "Capo 1 (D shape) atau Capo 3 (C shape).",
      songwriting: "Kunci utama untuk instrumen tiup tiup kuningan (Trumpet, Saxophone Alto) dan ballad jazz.",
      mood: "Heroik, berani, hangat, penuh kepahlawanan.",
    },
  },
  {
    index: 10,
    angle: 300,
    majorKey: "Bb",
    majorAlt: "A#",
    rootPc: 10,
    relativeMinor: "Gm",
    parallelMinor: "Bbm",
    diminishedChord: "Adim",
    accidentalsCount: 2,
    accidentalType: "flat",
    accidentalsList: ["Bb", "Eb"],
    orderMnemonic: "Battle Ends (Bb, Eb)",
    scaleNotes: ["Bb", "C", "D", "Eb", "F", "G", "A"],
    minorScaleNotes: ["G", "A", "Bb", "C", "D", "Eb", "F"],
    staffSharpsTreblePositions: [],
    staffFlatsTreblePositions: [3, 5], // B4, E5
    diatonicChords: [
      { degree: "I", degreeIndex: 0, rootNote: "Bb", name: "Bb", seventhName: "Bbmaj7", quality: "major", function: "Tonic", notes: ["Bb", "D", "F"], seventhNotes: ["Bb", "D", "F", "A"], pianoIndices: [10, 14, 17, 21], guitarVoicing: { frets: [-1, 1, 3, 3, 3, 1], baseFret: 1, fingers: [0, 1, 2, 3, 4, 1] } },
      { degree: "ii", degreeIndex: 1, rootNote: "C", name: "Cm", seventhName: "Cm7", quality: "minor", function: "Subdominant", notes: ["C", "Eb", "G"], seventhNotes: ["C", "Eb", "G", "Bb"], pianoIndices: [12, 15, 19, 22], guitarVoicing: { frets: [-1, 3, 5, 5, 4, 3], baseFret: 3, fingers: [0, 1, 3, 4, 2, 1] } },
      { degree: "iii", degreeIndex: 2, rootNote: "D", name: "Dm", seventhName: "Dm7", quality: "minor", function: "Tonic", notes: ["D", "F", "A"], seventhNotes: ["D", "F", "A", "C"], pianoIndices: [14, 17, 21, 24], guitarVoicing: { frets: [-1, -1, 0, 2, 3, 1], baseFret: 1, fingers: [0, 0, 0, 2, 3, 1] } },
      { degree: "IV", degreeIndex: 3, rootNote: "Eb", name: "Eb", seventhName: "Ebmaj7", quality: "major", function: "Subdominant", notes: ["Eb", "G", "Bb"], seventhNotes: ["Eb", "G", "Bb", "D"], pianoIndices: [15, 19, 22, 26], guitarVoicing: { frets: [-1, 6, 8, 8, 8, 6], baseFret: 6, fingers: [0, 1, 2, 3, 4, 1] } },
      { degree: "V", degreeIndex: 4, rootNote: "F", name: "F", seventhName: "F7", quality: "dominant7", function: "Dominant", notes: ["F", "A", "C"], seventhNotes: ["F", "A", "C", "Eb"], pianoIndices: [17, 21, 24, 27], guitarVoicing: { frets: [1, 3, 1, 2, 1, 1], baseFret: 1, fingers: [1, 3, 1, 2, 1, 1] } },
      { degree: "vi", degreeIndex: 5, rootNote: "G", name: "Gm", seventhName: "Gm7", quality: "minor", function: "Tonic", notes: ["G", "Bb", "D"], seventhNotes: ["G", "Bb", "D", "F"], pianoIndices: [19, 22, 26, 29], guitarVoicing: { frets: [3, 5, 5, 3, 3, 3], baseFret: 3, fingers: [1, 3, 4, 1, 1, 1] } },
      { degree: "vii°", degreeIndex: 6, rootNote: "A", name: "Adim", seventhName: "Am7b5", quality: "half-diminished7", function: "Dominant", notes: ["A", "C", "Eb"], seventhNotes: ["A", "C", "Eb", "G"], pianoIndices: [21, 24, 27, 31], guitarVoicing: { frets: [-1, 0, 1, 2, 1, -1], baseFret: 1, fingers: [0, 0, 1, 3, 2, 0] } },
    ],
    secondaryDominants: [
      { targetDegree: "V", targetChord: "F", symbol: "V7/V", chordName: "C7", notes: ["C", "E", "G", "Bb"], resolutionNotes: ["F", "A", "C"] },
      { targetDegree: "vi", targetChord: "Gm", symbol: "V7/vi", chordName: "D7", notes: ["D", "F#", "A", "C"], resolutionNotes: ["G", "Bb", "D"] },
    ],
    tritoneSub: { key: "E", chord: "B7", subV7: "B7 -> Bb", oppositeIndex: 4 },
    borrowedChords: [
      { symbol: "iv", chordName: "Ebm", sourceMode: "Parallel Minor", character: "Melancholic, mellow sadness", notes: ["Eb", "Gb", "Bb"] },
      { symbol: "bVI", chordName: "Gb", sourceMode: "Parallel Minor", character: "Cinematic modulation", notes: ["Gb", "Bb", "Db"] },
      { symbol: "bVII", chordName: "Ab", sourceMode: "Mixolydian", character: "Soul and gospel lift", notes: ["Ab", "C", "Eb"] },
    ],
    modes: [
      { name: "Ionian", root: "Bb", description: "Standard key of jazz standards, horns and clarinets" },
      { name: "Aeolian", root: "Gm", description: "Moody, soulful, beloved in classical & jazz" },
    ],
    practicalTips: {
      guitarCapo: "Capo 3 (G shape) atau Capo 1 (A shape).",
      songwriting: "Kunci favorit musisi jazz, trumpet Bb, tenor sax, dan musik tiup.",
      mood: "Ramah, bersahabat, kaya harmoni, hangat dan elegan.",
    },
  },
  {
    index: 11,
    angle: 330,
    majorKey: "F",
    rootPc: 5,
    relativeMinor: "Dm",
    parallelMinor: "Fm",
    diminishedChord: "Edim",
    accidentalsCount: 1,
    accidentalType: "flat",
    accidentalsList: ["Bb"],
    orderMnemonic: "Battle (Bb)",
    scaleNotes: ["F", "G", "A", "Bb", "C", "D", "E"],
    minorScaleNotes: ["D", "E", "F", "G", "A", "Bb", "C"],
    staffSharpsTreblePositions: [],
    staffFlatsTreblePositions: [3], // B4
    diatonicChords: [
      { degree: "I", degreeIndex: 0, rootNote: "F", name: "F", seventhName: "Fmaj7", quality: "major", function: "Tonic", notes: ["F", "A", "C"], seventhNotes: ["F", "A", "C", "E"], pianoIndices: [5, 9, 12, 16], guitarVoicing: { frets: [1, 3, 3, 2, 1, 1], baseFret: 1, fingers: [1, 3, 4, 2, 1, 1] } },
      { degree: "ii", degreeIndex: 1, rootNote: "G", name: "Gm", seventhName: "Gm7", quality: "minor", function: "Subdominant", notes: ["G", "Bb", "D"], seventhNotes: ["G", "Bb", "D", "F"], pianoIndices: [7, 10, 14, 17], guitarVoicing: { frets: [3, 5, 5, 3, 3, 3], baseFret: 3, fingers: [1, 3, 4, 1, 1, 1] } },
      { degree: "iii", degreeIndex: 2, rootNote: "A", name: "Am", seventhName: "Am7", quality: "minor", function: "Tonic", notes: ["A", "C", "E"], seventhNotes: ["A", "C", "E", "G"], pianoIndices: [9, 12, 16, 19], guitarVoicing: { frets: [-1, 0, 2, 2, 1, 0], baseFret: 1, fingers: [0, 0, 2, 3, 1, 0] } },
      { degree: "IV", degreeIndex: 3, rootNote: "Bb", name: "Bb", seventhName: "Bbmaj7", quality: "major", function: "Subdominant", notes: ["Bb", "D", "F"], seventhNotes: ["Bb", "D", "F", "A"], pianoIndices: [10, 14, 17, 21], guitarVoicing: { frets: [-1, 1, 3, 3, 3, 1], baseFret: 1, fingers: [0, 1, 2, 3, 4, 1] } },
      { degree: "V", degreeIndex: 4, rootNote: "C", name: "C", seventhName: "C7", quality: "dominant7", function: "Dominant", notes: ["C", "E", "G"], seventhNotes: ["C", "E", "G", "Bb"], pianoIndices: [12, 16, 19, 22], guitarVoicing: { frets: [-1, 3, 2, 3, 1, 0], baseFret: 1, fingers: [0, 3, 2, 4, 1, 0] } },
      { degree: "vi", degreeIndex: 5, rootNote: "D", name: "Dm", seventhName: "Dm7", quality: "minor", function: "Tonic", notes: ["D", "F", "A"], seventhNotes: ["D", "F", "A", "C"], pianoIndices: [14, 17, 21, 24], guitarVoicing: { frets: [-1, -1, 0, 2, 3, 1], baseFret: 1, fingers: [0, 0, 0, 2, 3, 1] } },
      { degree: "vii°", degreeIndex: 6, rootNote: "E", name: "Edim", seventhName: "Em7b5", quality: "half-diminished7", function: "Dominant", notes: ["E", "G", "Bb"], seventhNotes: ["E", "G", "Bb", "D"], pianoIndices: [16, 19, 22, 26], guitarVoicing: { frets: [0, 1, 2, 0, -1, -1], baseFret: 1, fingers: [0, 1, 2, 0, 0, 0] } },
    ],
    secondaryDominants: [
      { targetDegree: "V", targetChord: "C", symbol: "V7/V", chordName: "G7", notes: ["G", "B", "D", "F"], resolutionNotes: ["C", "E", "G"] },
      { targetDegree: "vi", targetChord: "Dm", symbol: "V7/vi", chordName: "A7", notes: ["A", "C#", "E", "G"], resolutionNotes: ["D", "F", "A"] },
    ],
    tritoneSub: { key: "B", chord: "F#7", subV7: "F#7 -> F", oppositeIndex: 5 },
    borrowedChords: [
      { symbol: "iv", chordName: "Bbm", sourceMode: "Parallel Minor", character: "Classic bittersweet minor subdominant", notes: ["Bb", "Db", "F"] },
      { symbol: "bVI", chordName: "Db", sourceMode: "Parallel Minor", character: "Warm majestic transition", notes: ["Db", "F", "Ab"] },
      { symbol: "bVII", chordName: "Eb", sourceMode: "Mixolydian", character: "Rock and folk anthem drive", notes: ["Eb", "G", "Bb"] },
    ],
    modes: [
      { name: "Ionian", root: "F", description: "Pastoral, serene, nature-inspired (Beethoven Pastoral)" },
      { name: "Aeolian", root: "Dm", description: "The saddest key (Mozart Requiem, Bach Chaconne)" },
    ],
    practicalTips: {
      guitarCapo: "Capo 1 (E shape) atau Capo 3 (D shape) atau Capo 5 (C shape).",
      songwriting: "Sangat bersahabat untuk vokal pop akustik dan aransemen string.",
      mood: "Teduh, damai, pastoral, menenangkan.",
    },
  },
];

// ── Progression Presets ──
export interface ProgressionPreset {
  id: string;
  name: string;
  description: string;
  genre: string;
  degrees: string[]; // ["I", "V", "vi", "IV"]
  suggestedBpm: number;
}

export const PROGRESSION_PRESETS: ProgressionPreset[] = [
  {
    id: "pop-4-chord",
    name: "Axis of Awesome (Pop 4-Chord)",
    description: "Progresi paling legendaris sepanjang masa di ratusan lagu pop dunia.",
    genre: "Pop / Modern Rock",
    degrees: ["I", "V", "vi", "IV"],
    suggestedBpm: 120,
  },
  {
    id: "classic-ii-v-i",
    name: "Jazz Standard ii–V–I",
    description: "Pondasi utama harmonisasi jazz, swing, bebop, dan neo-soul.",
    genre: "Jazz / Bossa / Soul",
    degrees: ["ii", "V", "I", "I"],
    suggestedBpm: 100,
  },
  {
    id: "50s-doo-wop",
    name: "50s Doo-Wop Cadence",
    description: "Nuansa vintage romantis era 1950-an (Stand By Me, Unchained Melody).",
    genre: "Vintage Pop / Oldies",
    degrees: ["I", "vi", "IV", "V"],
    suggestedBpm: 90,
  },
  {
    id: "andalusian-cadence",
    name: "Andalusian Flamenco Cadence",
    description: "Gerak turun langkah demi langkah yang intens, dramatis, dan eksotis.",
    genre: "Flamenco / Rock / Minor",
    degrees: ["vi", "V", "IV", "III_DOM"], // vi -> V -> IV -> V/vi
    suggestedBpm: 110,
  },
  {
    id: "circle-cycle",
    name: "Circle of 5ths Autumn Cycle",
    description: "Progresi melingkar penuh kuint (Autumn Leaves, Fly Me to the Moon).",
    genre: "Jazz / Classical / Bossa",
    degrees: ["ii", "V", "I", "IV", "vii°", "iii", "vi", "ii"],
    suggestedBpm: 115,
  },
  {
    id: "royal-road-oudo",
    name: "Royal Road (Oudou Shinkou)",
    description: "Progresi emas J-Pop, Anime, dan K-Pop yang penuh emosi dan harapan.",
    genre: "J-Pop / Anime / K-Pop",
    degrees: ["IV", "V", "iii", "vi"],
    suggestedBpm: 128,
  },
  {
    id: "pachelbel-canon",
    name: "Pachelbel Canon",
    description: "Arsitektur harmoni barok yang menjadi cetak biru musik modern.",
    genre: "Baroque / Pop Ballad",
    degrees: ["I", "V", "vi", "iii", "IV", "I", "IV", "V"],
    suggestedBpm: 84,
  },
  {
    id: "romantic-minor-borrow",
    name: "Romantic Borrowed iv Cadence",
    description: "Sensasi emosional saat IV mayor berubah menjadi iv minor sebelum kembali ke I.",
    genre: "Romantic / Ballad / Indie",
    degrees: ["I", "IV", "iv_BORROWED", "I"],
    suggestedBpm: 76,
  },
  {
    id: "blues-shuffle-cadence",
    name: "Classic Blues Turnaround",
    description: "Struktur blues otentik dengan dominant 7th roll.",
    genre: "Blues / Rock n Roll",
    degrees: ["I", "IV", "I", "V", "IV", "I"],
    suggestedBpm: 108,
  },
];

// ── Modulation Calculations ──
export function calculateModulationPath(fromIndex: number, toIndex: number) {
  const fromKey = CIRCLE_KEYS[fromIndex];
  const toKey = CIRCLE_KEYS[toIndex];

  // Steps on circle (clockwise / counter-clockwise)
  const diffClockwise = (toIndex - fromIndex + 12) % 12;
  const diffCounter = (fromIndex - toIndex + 12) % 12;
  const shortestSteps = diffClockwise <= 6 ? diffClockwise : -diffCounter;
  const absSteps = Math.abs(shortestSteps);

  // Find shared diatonic chords (Pivot Chords)
  const fromChords = fromKey.diatonicChords.map((c) => ({
    name: c.name,
    fromDegree: c.degree,
    fromFunction: c.function,
  }));
  const toChords = toKey.diatonicChords.map((c) => ({
    name: c.name,
    toDegree: c.degree,
    toFunction: c.function,
  }));

  const pivotChords: {
    name: string;
    fromDegree: string;
    toDegree: string;
    description: string;
  }[] = [];

  for (const fc of fromChords) {
    const match = toChords.find((tc) => tc.name === fc.name);
    if (match) {
      pivotChords.push({
        name: fc.name,
        fromDegree: fc.fromDegree,
        toDegree: match.toDegree,
        description: `Chord ${fc.name} adalah derajat ${fc.fromDegree} di key ${fromKey.majorKey}, dan menjadi derajat ${match.toDegree} di key ${toKey.majorKey}.`,
      });
    }
  }

  // Determine relationship type
  let relationship = "";
  let technique = "";
  if (absSteps === 0) {
    relationship = "Key yang sama (Tonalitas Identik)";
    technique = "Tidak memerlukan modulasi.";
  } else if (absSteps === 1) {
    relationship = diffClockwise === 1 ? "Dominant Key (Naik 1 Kuint / +1 Sharp)" : "Subdominant Key (Turun 1 Kuint / +1 Flat)";
    technique = "Closest Key Modulation: Sangat mulus menggunakan Pivot Chord atau gerak V7 langsung.";
  } else if (absSteps === 2) {
    relationship = "Closely Related Key (Selisih 2 accidental)";
    technique = "Modulasi mulus melalui pivot chord perantara atau ii-V target key.";
  } else if (absSteps === 3 || absSteps === 4) {
    relationship = "Distant Key (Chromatic Modulasi)";
    technique = "Gunakan Secondary Dominant (V7 target), common tone modulation, atau borrowed chord.";
  } else if (absSteps === 6) {
    relationship = "Tritone Polar Opposite (Tegangan Maksimal / Jarak Terjauh 180°)";
    technique = "Tritone Substitution atau Direct Truck Driver Gear Shift (sangat dramatis di klimaks lagu).";
  } else {
    relationship = "Distant Key Modulation";
    technique = "Gunakan Pivot Chord berantai atau transisi dominant 7th.";
  }

  return {
    fromKey,
    toKey,
    shortestSteps,
    absSteps,
    direction: shortestSteps > 0 ? "Searah jarum jam (Tambah Sharps ♯)" : shortestSteps < 0 ? "Berlawanan jarum jam (Tambah Flats ♭)" : "Sama",
    relationship,
    technique,
    pivotChords,
  };
}
