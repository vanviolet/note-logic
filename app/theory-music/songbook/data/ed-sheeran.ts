// ════════════════════════════════════════════════════════
// Songbook Data – Ed Sheeran
// ════════════════════════════════════════════════════════

import type { SongEntry } from "../types";

export const ED_SHEERAN_SONGS: SongEntry[] = [
  {
    id: "perfect",
    title: "Perfect",
    artist: "Ed Sheeran",
    artistSlug: "ed-sheeran",
    album: "÷ (Divide)",
    year: 2017,
    genre: ["pop", "acoustic", "ballad"],
    difficulty: "intermediate",
    key: "G",
    originalKey: "Ab",
    capo: 1,
    tuning: "E A D G B E",
    bpm: 64,
    timeSignature: "6/8",
    chordsUsed: ["G", "Em", "C", "D", "D/F#", "G/B", "Dsus4"],
    strummingPattern: { pattern: "D DU DU", bpm: 64 },
    notes:
      "Capo 1st fret. Play in G shapes — original key is Ab. For chords in the original key, transpose +1 and use flats. Fingerpicking pattern during the verses recommended.",
    sections: [
      {
        type: "intro",
        label: "Intro",
        lines: ["[G]"],
      },
      {
        type: "verse",
        label: "Verse 1",
        lines: [
          "[G]I found a [Em]love for me",
          "[C]Darling, just dive right in, and [D]follow my lead",
          "[G]Well, I found a girl [Em]beautiful and sweet",
          "[C]I never knew you were the [D]someone waiting for me",
        ],
      },
      {
        type: "pre-chorus",
        label: "Pre-Chorus",
        lines: [
          "Cause [G]we were just kids when we fell in love",
          "Not [Em]knowing what it was, I will [C]not give you [G]up this [D]time",
          "[G]Darling just kiss me slow, your [Em]heart is all I own",
          "And in your [C]eyes you're holding [D]mine",
        ],
      },
      {
        type: "chorus",
        label: "Chorus",
        lines: [
          "Baby, [Em]I'm [C]dancing in the [G]dark, with [D]you between my [Em]arms",
          "[C]Barefoot on the [G]grass, [D]listening to our [Em]favourite song",
          "When you [C]said you looked a [G]mess, I whispered [D]underneath my [Em]breath",
          "But you [C]heard it, darling [G]you look [D]perfect to[G]night",
        ],
      },
      {
        type: "interlude",
        label: "Interlude",
        lines: ["[G] [D/F#] [Em] [D] | [C] [D]"],
      },
      {
        type: "verse",
        label: "Verse 2",
        lines: [
          "[G]Well, I found a woman, [Em]stronger than anyone I know",
          "[C]She shares my dreams, I hope that [D]someday I'll share her home",
          "[G]I found a love, [Em]to carry more than just my secrets",
          "[C]To carry love, to carry [D]children of our own",
        ],
      },
      {
        type: "pre-chorus",
        label: "Pre-Chorus",
        lines: [
          "[G]We are still kids, but we're [Em]so in love, fighting against all odds",
          "I [C]know we'll be [G]alright this [D]time",
          "[G]Darling just hold my hand, [Em]be my girl, I'll be your man",
          "I see my [C]future in your [D]eyes",
        ],
      },
      {
        type: "chorus",
        label: "Chorus",
        lines: [
          "Baby, [Em]I'm [C]dancing in the [G]dark, with [D]you between my [Em]arms",
          "[C]Barefoot on the [G]grass, [D]listening to our [Em]favourite song",
          "When I [C]saw you in that [G]dress, looking [D]so beautiful",
          "[Em]I don't [C]deserve this, darling [G]you look [D]perfect to[G]night",
        ],
      },
      {
        type: "interlude",
        label: "Interlude",
        lines: ["[G] | [G] | [Em] | [Em] |", "[C] | [C] | [D] | [D] |"],
      },
      {
        type: "chorus",
        label: "Chorus 3",
        lines: [
          "Baby, [Em]I'm [C]dancing in the [G]dark, with [D]you between my [Em]arms",
          "[C]Barefoot on the [G]grass, [D]listening to our [Em]favourite song",
          "I have [C]faith in what I [G]see, now I [D]know I have met an [Em]angel",
          "In [C]person, and she [G]looks [D]perfect",
        ],
      },
      {
        type: "outro",
        label: "Outro",
        lines: [
          "[G/B]I don't de[C]serve this, [Dsus4]you look [D]perfect to[G]night",
          "[G] [D/F#] [Em] [D] | [C] [D] | [G]",
        ],
      },
    ],
    tags: [
      "ed sheeran",
      "perfect",
      "pop",
      "ballad",
      "wedding",
      "love",
      "2017",
      "divide",
      "fingerpicking",
    ],
    sortOrder: 0,
  },
];
