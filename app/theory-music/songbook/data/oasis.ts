// ════════════════════════════════════════════════════════
// Songbook Data – Oasis
// ════════════════════════════════════════════════════════

import type { SongEntry } from "../types";

export const OASIS_SONGS: SongEntry[] = [
  {
    id: "wonderwall",
    title: "Wonderwall",
    artist: "Oasis",
    artistSlug: "oasis",
    album: "(What's the Story) Morning Glory?",
    year: 1995,
    genre: ["rock", "alternative", "pop"],
    difficulty: "beginner",
    key: "Em",
    originalKey: "F#m",
    capo: 2,
    tuning: "E A D G B E",
    bpm: 87,
    timeSignature: "4/4",
    chordsUsed: ["Em", "G", "D", "A7sus4", "C"],
    strummingPattern: { pattern: "D DU UDU", bpm: 87 },
    notes:
      "Simplified beginner version. Capo 2nd fret. The real chord is A7sus4 (x02033) — you can try Asus4 but avoid plain A as the major 3rd clashes.",
    sections: [
      {
        type: "intro",
        label: "Intro",
        lines: [
          "[Em]  [G]  [D]  [A7sus4]",
          "[Em]  [G]  [D]  [A7sus4]",
          "[Em]  [G]  [D]  [A7sus4]",
          "[Em]  [G]  [D]  [A7sus4]",
        ],
      },
      {
        type: "verse",
        label: "Verse 1",
        lines: [
          "[Em]Today is gonna be the [G]day",
          "That [D]they're gonna throw it back to [A7sus4]you",
          "[Em]By now you should've some[G]how",
          "Rea[D]lised what you gotta [A7sus4]do",
          "[Em]I don't believe that [G]anybody",
          "[D]Feels the way I [A7sus4]do about you [C]now [D] [A7sus4]",
        ],
      },
      {
        type: "verse",
        label: "Verse 2",
        lines: [
          "[Em]Backbeat, the word is on the [G]street",
          "That the [D]fire in your heart is [A7sus4]out",
          "[Em]I'm sure you've heard it all be[G]fore",
          "But you [D]never really had a [A7sus4]doubt",
          "[Em]I don't believe that [G]anybody [D]feels",
          "The way I [A7sus4]do about you [Em]now [G] [D] [A7sus4]",
        ],
      },
      {
        type: "pre-chorus",
        label: "Pre-Chorus",
        lines: [
          "And [C]all the roads we [D]have to walk are [Em]winding",
          "And [C]all the lights that [D]lead us there are [Em]blinding",
          "[C]There are many [D]things that I would",
          "[G]Like to [D]say to [Em]you",
          "But I [D]don't know [A7sus4]how",
        ],
      },
      {
        type: "chorus",
        label: "Chorus",
        lines: [
          "Because [C]maybe [Em] [G]",
          "You're [Em]gonna be the one that [C]saves me [Em] [G]",
          "And [Em]after [C]all [Em] [G]",
          "You're my [Em]wonder[C]wall [Em] [G] [Em]",
        ],
      },
      {
        type: "verse",
        label: "Verse 3",
        lines: [
          "[Em]Today was gonna be the [G]day",
          "But [D]they'll never throw it back to [A7sus4]you",
          "[Em]By now you should've some[G]how",
          "Rea[D]lised what you're not to [A7sus4]do",
          "[Em]I don't believe that [G]anybody",
          "[D]Feels the way I [A7sus4]do",
          "About you [Em]now [G] [D] [A7sus4]",
        ],
      },
      {
        type: "pre-chorus",
        label: "Pre-Chorus",
        lines: [
          "And [C]all the roads that [D]lead you there were [Em]winding",
          "And [C]all the lights that [D]light the way are [Em]blinding",
          "[C]There are many [D]things that I would [G]like to [D]say to [Em]you",
          "But I [D]don't know [A7sus4]how",
        ],
      },
      {
        type: "chorus",
        label: "Chorus",
        lines: [
          "I said [C]maybe [Em] [G]",
          "You're [Em]gonna be the one that [C]saves me [Em] [G]",
          "And [Em]after [C]all [Em] [G]",
          "You're my [Em]wonder[C]wall [Em] [G] [Em]",
          "I said [C]maybe (I said [Em]maybe) [G]",
          "You're [Em]gonna be the one that [C]saves me [Em] [G]",
          "And [Em]after [C]all [Em] [G]",
          "You're my [Em]wonder[C]wall [Em] [G] [Em]",
          "I said [C]maybe (I said [Em]maybe) [G]",
          "You're [Em]gonna be the one that [C]saves me (that [Em]saves me) [G]",
          "You're [Em]gonna be the one that [C]saves me (that [Em]saves me) [G]",
          "You're [Em]gonna be the one that [C]saves me (that [Em]saves me) [G] [Em]",
        ],
      },
    ],
    tags: [
      "oasis",
      "wonderwall",
      "britpop",
      "rock",
      "90s",
      "1995",
      "morning glory",
      "beginner",
      "classic",
    ],
    sortOrder: 0,
  },
];
