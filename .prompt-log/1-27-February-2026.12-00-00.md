
---
date: 2026-02-27 12:00:00
author: vanviolet
session-chat: PIANO KEYBOARD COMPONENT + INSTRUMENT SWITCHER
---

## Prompt
bisakah anda buat juga versi piano, buat tampilan seperti piano asli

## Point OF AI Response

### New Files Created
- **app/templates/components/custom/piano.tsx** — Full realistic piano keyboard component with:
  - Configurable octave range (`startOctave`, `octaveCount`)
  - White and black keys rendered with correct piano layout proportions
  - Per-pitch-class highlight colors (12 colors matching fretboard convention)
  - Active note (clicked) state with ring + deeper saturation
  - Live mic support (DOM-only class toggling, zero React reconciliation) with confidence-based preview/stable markers
  - `onKeyClick` callback with `PianoNote` data (note, octave, midi, pitchClass)
  - Memo'd `WhiteKey` / `BlackKey` sub-components for minimal re-renders
  - `React.memo` wrapper on the exported `Piano` component

### CSS Added (app/app.css)
- `.piano-keyboard` / `.piano-white-keys` / `.piano-black-keys` — layout structure
- `.piano-white-key` / `.piano-black-key` — realistic gradient, shadow, border-radius, :hover and :active (pressed) states with dark mode variants
- 12 × highlight classes per pitch class for both white and black keys (`piano-hl-*`, `piano-active-*`)
- `.piano-live-note` / `.piano-live-note-shake` / `.piano-live-note-unstable` — live mic animations
- `prefers-reduced-motion` entries for all piano animations

### Store Changes (learn-fretboard.store.ts)
- Added `instrument: "guitar" | "piano"` state + `setInstrument` action
- Added `activePianoNote: { midi: number } | null` state + `setActivePianoNote` action

### Panel Integration (learn-fretboard-panel.tsx)
- Lazy-loaded `PianoKeyboard` component with `PianoSkeleton` fallback
- Guitar ↔ Piano instrument switcher (toggle buttons with icons) in the audio controls row
- Handle bar icon dynamically shows Guitar or Piano icon based on active instrument
- Piano key click plays audio via existing `useGuitarAudio` hook
- Separate `handlePianoKeyClick` callback stores `activePianoNote` in the store

