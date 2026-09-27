// ════════════════════════════════════════════════════════
// Songbook Data – Passenger
// ════════════════════════════════════════════════════════

import type { SongEntry } from "../types";

export const PASSENGER_SONGS: SongEntry[] = [
  {
    id: "let-her-go",
    title: "Let Her Go",
    artist: "Passenger",
    artistSlug: "passenger",
    album: "All the Little Lights",
    year: 2012,
    genre: ["folk", "acoustic", "pop"],
    difficulty: "beginner",
    key: "C",
    originalKey: "Em",
    capo: 7,
    tuning: "E A D G B E",
    bpm: 75,
    timeSignature: "4/4",
    chordsUsed: ["G", "Fmaj7", "G6", "Am", "F", "C", "Em"],
    strummingPattern: { pattern: "D DU UDU", bpm: 75 },
    notes:
      "Capo on 7th fret. Intro uses a fingerpicking pattern — the chords shown are the shapes played. Listen to the recording for the hammer-on/pull-off ornaments.",
    sections: [
      {
        type: "intro",
        label: "Intro",
        lines: ["[G]  [Fmaj7]  [G6]  [Am]  [G6]", "[Fmaj7]  [G6]  [Am]  [G6]"],
      },
      {
        type: "chorus",
        label: "Chorus",
        lines: [
          "Well, you only need the [F]light when it's burning [C]low",
          "Only miss the [G]sun when it starts to [Am]snow",
          "Only know you [F]love her when you let her [C]go [G]",
          "Only know you've been [F]high when you're feeling [C]low",
          "Only hate the [G]road when you're missin' [Am]home",
          "Only know you [F]love her when you let her [C]go",
          "[G]And you let her go",
        ],
      },
      {
        type: "instrumental",
        label: "Instrumental",
        lines: ["[Am] [F] [G] [Em]", "[Am] [F] [G]"],
      },
      {
        type: "verse",
        label: "Verse 1",
        lines: [
          "[Am]Staring at the bottom of your [F]glass",
          "Hoping [G]one day you'll make a dream [Em]last",
          "But [Am]dreams come slow and they [F]go so [G]fast",
          "[Am]You see her when you close your [F]eyes",
          "Maybe [G]one day you'll understand [Em]why",
          "Every[Am]thing you touch surely [F]dies [G]",
        ],
      },
      {
        type: "chorus",
        label: "Chorus",
        lines: [
          "But you only need the [F]light when it's burning [C]low",
          "Only miss the [G]sun when it starts to [Am]snow",
          "Only know you [F]love her when you let her [C]go [G]",
          "Only know you've been [F]high when you're feeling [C]low",
          "Only hate the [G]road when you're missin' [Am]home",
          "Only know you [F]love her when you let her [C]go [G]",
        ],
      },
      {
        type: "verse",
        label: "Verse 2",
        lines: [
          "[Am]Staring at the ceiling in the [F]dark",
          "Same old [G]empty feeling in your [Em]heart",
          "'Cause [Am]love comes slow and it [F]goes so [G]fast",
          "Well you [Am]see her when you fall a[F]sleep",
          "But never [G]to touch and never to [Em]keep",
          "'Cause you loved her too [Am]much",
          "And you dived too [F]deep [G]",
        ],
      },
      {
        type: "chorus",
        label: "Chorus",
        lines: [
          "Well, you only need the [F]light when it's burning [C]low",
          "Only miss the [G]sun when it starts to [Am]snow",
          "Only know you [F]love her when you let her [C]go [G]",
          "Only know you've been [F]high when you're feeling [C]low",
          "Only hate the [G]road when you're missin' [Am]home",
          "Only know you [F]love her when you let her [C]go [G]",
        ],
      },
      {
        type: "bridge",
        label: "Bridge",
        lines: [
          "And you let her [Am]go",
          "[F]Ooooo [G]ooooo oooooo",
          "And you let her [Am]go",
          "[F]Ooooooo [G]ooooo ooooo",
          "And you let her [Am]go [F] [G] [Em]",
        ],
      },
      {
        type: "interlude",
        label: "Interlude",
        lines: ["[Am] [F] [G]"],
      },
      {
        type: "chorus",
        label: "Chorus",
        lines: [
          "'Cause you only need the [F]light when it's burning [C]low",
          "Only miss the [G]sun when it starts to [Am]snow",
          "Only know you [F]love her when you let her [C]go [G]",
          "Only know you've been [F]high when you're feeling [C]low",
          "Only hate the [G]road when you're missin' [Am]home",
          "Only know you [F]love her when you let her [C]go [G]",
        ],
      },
      {
        type: "chorus",
        label: "Chorus (One Strum)",
        lines: [
          "'Cause you only need the [F]light when it's burning [C]low",
          "Only miss the [G]sun when it starts to [Am]snow",
          "Only know you [F]love her when you let her [C]go [G]",
          "Only know you've been high when you're feeling low",
          "",
          "Only hate the road when you're missin' home",
          "",
          "Only know you love her when you let her go",
          "",
          "And you let her go",
        ],
      },
    ],
    tags: [
      "passenger",
      "let her go",
      "folk",
      "acoustic",
      "2012",
      "all the little lights",
      "fingerpicking",
      "beginner",
    ],
    sortOrder: 0,
  },
];
