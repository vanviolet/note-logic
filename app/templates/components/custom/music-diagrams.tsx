// ════════════════════════════════════════════════════════
// Global Music Components — Barrel Re-exports
// ════════════════════════════════════════════════════════
//
// These diagram components are used across multiple features
// (chord explorer, songbook, etc). This barrel provides a
// single import path so consumers don't depend on the
// songbook route directory directly.
// ════════════════════════════════════════════════════════

export {
  ChordDiagram,
  ChordDiagramMini,
} from "~/routes/songbook/components/chord-diagram";

export {
  UkuleleChordDiagram,
  UkuleleChordDiagramMini,
} from "~/routes/songbook/components/ukulele-chord-diagram";

export {
  PianoChordDiagram,
  PianoChordDiagramMini,
} from "~/routes/songbook/components/piano-chord-diagram";
