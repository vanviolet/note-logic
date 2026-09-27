// ════════════════════════════════════════════════════════
// Songbook Data – Keane
// ════════════════════════════════════════════════════════

import type { SongEntry } from "../types";

export const KEANE_SONGS: SongEntry[] = [
  {
    id: "somewhere-only-we-know",
    title: "Somewhere Only We Know",
    artist: "Keane",
    artistSlug: "keane",
    album: "Hopes and Fears",
    year: 2004,
    genre: ["alternative", "rock", "pop"],
    difficulty: "intermediate",
    key: "C",
    originalKey: "A",
    capo: 0,
    tuning: "E A D G B E",
    bpm: 86,
    timeSignature: "4/4",
    chordsUsed: ["C", "C/B", "Dm", "Gsus4", "G", "Am", "Em", "F", "C/E"],
    strummingPattern: { pattern: "D DU UDU", bpm: 86 },
    notes:
      "For the original key transpose -3, or -5 with capo on the 2nd fret.",
    sections: [
      {
        type: "intro",
        label: "Intro",
        lines: ["[C]  [C/B]  [Dm]  [Gsus4]  [G]  x2"],
      },
      {
        type: "verse",
        label: "Verse 1",
        lines: [
          "[C]I walked across an [C/B]empty land",
          "[Dm]I knew the pathway like the [Gsus4]back of my [G]hand",
          "[C]I felt the earth [C/B]beneath my feet",
          "[Dm]Sat by the river, and it [Gsus4]made me com[G]plete",
        ],
      },
      {
        type: "pre-chorus",
        label: "Pre-Chorus",
        lines: [
          "[Am]Oh, simple thing, [Em]where have you gone?",
          "[F]I'm getting old and I need [G]something to rely on",
          "[Am]So tell me when [Em]you're gonna let me in",
          "[F]I'm getting tired and I need [G]somewhere to begin",
        ],
      },
      {
        type: "verse",
        label: "Verse 2",
        lines: [
          "[C]I came across a [C/B]fallen tree",
          "[Dm]I felt the branches of it [Gsus4]looking at [G]me",
          "[C]Is this the place we [C/B]used to love?",
          "[Dm]Is this the place that I've been [Gsus4]dreaming [G]of?",
        ],
      },
      {
        type: "pre-chorus",
        label: "Pre-Chorus",
        lines: [
          "[Am]Oh, simple thing, [Em]where have you gone?",
          "[F]I'm getting old and I need [G]something to rely on",
          "[Am]So tell me when [Em]you're gonna let me in",
          "[F]I'm getting tired and I need [G]somewhere to begin",
        ],
      },
      {
        type: "chorus",
        label: "Chorus",
        lines: [
          "[F]And if you have a [C/E]minute, why don't we [G]go",
          "[F]Talk about it [C/E]somewhere only we [G]know?",
          "[F]This could be the [C/E]end of every[G]thing",
          "[F]So why don't we go",
          "[G]Somewhere only we [F]know?",
          "[G]Somewhere only we [F]know? [G]",
        ],
      },
      {
        type: "pre-chorus",
        label: "Pre-Chorus",
        lines: [
          "[Am]Oh, simple thing, [Em]where have you gone?",
          "[F]I'm getting old and I need [G]something to rely on",
          "[Am]So tell me when [Em]you're gonna let me in",
          "[F]I'm getting tired and I need [G]somewhere to begin",
        ],
      },
      {
        type: "chorus",
        label: "Chorus 2",
        lines: [
          "[Dm]And if you have a [C/E]minute, why don't we [G]go",
          "[Dm]Talk about it [C/E]somewhere only we [G]know?",
          "[Dm]This could be the [C/E]end of every[G]thing",
          "[F]So why don't we go?",
          "[F]So why don't we [G]go?",
        ],
      },
      {
        type: "interlude",
        label: "Interlude",
        lines: ["[Dm]  [C/E]  [G]  [Dm]  [C/E]  [G]", "Ooh              Ahh"],
      },
      {
        type: "outro",
        label: "Outro",
        lines: [
          "[Dm]This could be the [C/E]end of every[G]thing",
          "[F]So why don't we go",
          "[G]Somewhere only we [C]know? [F]",
          "(Slowly)",
          "[G]Somewhere only we [F]know",
          "[G]Somewhere only we [F]know [C]",
        ],
      },
    ],
    tags: [
      "keane",
      "somewhere only we know",
      "alternative",
      "2004",
      "hopes and fears",
      "piano rock",
    ],
    sortOrder: 0,
  },
];
