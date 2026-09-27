// ════════════════════════════════════════════════════════
// PianoChordDiagram – SVG piano keyboard chord diagram
// ════════════════════════════════════════════════════════
//
// Renders a compact piano keyboard showing which keys to press for a chord.
// Accepts a chord name (e.g. "Cmaj7") and resolves its pitch classes to
// highlight the matching keys.

import { memo, useState } from "react";
import {
  NOTES_SHARP as NOTE_NAMES_SHARP,
  NOTE_INDEX,
  NOTE_HEX_COLORS,
} from "~/theory-music/core";
import {
  PianoFingeringDialog,
  PianoFingerTriggerIcon,
} from "./piano-fingering-dialog";

// ── Constants ──────────────────────────────────────────

const OCTAVE_WHITE_COUNT = 7;
/** Pitch classes for white keys in one octave */
const WHITE_PCS = [0, 2, 4, 5, 7, 9, 11]; // C D E F G A B
/** Black key positions: [pitchClass, whiteKeyIndex it sits after (0-based)] */
const BLACK_KEY_INFO: Array<{ pc: number; afterWhite: number }> = [
  { pc: 1, afterWhite: 0 }, // C#
  { pc: 3, afterWhite: 1 }, // D#
  { pc: 6, afterWhite: 3 }, // F#
  { pc: 8, afterWhite: 4 }, // G#
  { pc: 10, afterWhite: 5 }, // A#
];

// Colors per pitch class — derived from core NOTE_HEX_COLORS
const PC_COLORS: Record<
  number,
  { whiteFill: string; blackFill: string; text: string }
> = Object.fromEntries(
  Object.entries(NOTE_HEX_COLORS).map(([pc, c]) => [
    Number(pc),
    { whiteFill: c.primary, blackFill: c.dark, text: c.text },
  ]),
);

// ── Chord → pitch class resolver ───────────────────────
// NOTE_INDEX is imported from ~/theory-music/core

const CHORD_RE = /^([A-G][#b]?)(.*?)(?:\/([A-G][#b]?))?$/;

/** Common chord quality → semitone intervals from root */
const QUALITY_INTERVALS: Record<string, number[]> = {
  "": [0, 4, 7],
  maj: [0, 4, 7],
  major: [0, 4, 7],
  m: [0, 3, 7],
  min: [0, 3, 7],
  minor: [0, 3, 7],
  "7": [0, 4, 7, 10],
  dom7: [0, 4, 7, 10],
  m7: [0, 3, 7, 10],
  min7: [0, 3, 7, 10],
  maj7: [0, 4, 7, 11],
  major7: [0, 4, 7, 11],
  M7: [0, 4, 7, 11],
  dim: [0, 3, 6],
  "°": [0, 3, 6],
  o: [0, 3, 6],
  dim7: [0, 3, 6, 9],
  aug: [0, 4, 8],
  "+": [0, 4, 8],
  sus4: [0, 5, 7],
  sus: [0, 5, 7],
  sus2: [0, 2, 7],
  "6": [0, 4, 7, 9],
  m6: [0, 3, 7, 9],
  min6: [0, 3, 7, 9],
  "9": [0, 4, 7, 10, 14],
  m9: [0, 3, 7, 10, 14],
  maj9: [0, 4, 7, 11, 14],
  add9: [0, 4, 7, 14],
  add2: [0, 2, 4, 7],
  "7sus4": [0, 5, 7, 10],
  "7sus2": [0, 2, 7, 10],
  "5": [0, 7],
  "11": [0, 4, 7, 10, 14, 17],
  m11: [0, 3, 7, 10, 14, 17],
  "13": [0, 4, 7, 10, 14, 21],
  m13: [0, 3, 7, 10, 14, 21],
};

const pitchClassCache = new Map<string, number[]>();

function resolvePitchClasses(chordName: string): number[] {
  const cached = pitchClassCache.get(chordName);
  if (cached) return cached;

  const match = CHORD_RE.exec(chordName);
  if (!match) return [];

  const rootIdx = NOTE_INDEX[match[1]];
  if (rootIdx === undefined) return [];

  const quality = match[2] || "";
  const bass = match[3];

  // Find matching intervals
  const q = quality.toLowerCase().replace(/\s/g, "");
  let intervals = QUALITY_INTERVALS[q];

  if (!intervals) {
    // Fuzzy fallback
    if (q.includes("maj7")) intervals = QUALITY_INTERVALS["maj7"];
    else if (q.includes("m7") || (q.startsWith("m") && q.includes("7")))
      intervals = QUALITY_INTERVALS["m7"];
    else if (q.includes("dim")) intervals = QUALITY_INTERVALS["dim"];
    else if (q.includes("aug")) intervals = QUALITY_INTERVALS["aug"];
    else if (q.includes("sus4")) intervals = QUALITY_INTERVALS["sus4"];
    else if (q.includes("sus2")) intervals = QUALITY_INTERVALS["sus2"];
    else if (q.includes("7")) intervals = QUALITY_INTERVALS["7"];
    else if (q.includes("9")) intervals = QUALITY_INTERVALS["9"];
    else if (q.startsWith("m")) intervals = QUALITY_INTERVALS["m"];
    else intervals = QUALITY_INTERVALS[""];
  }

  const pcs = intervals.map((semi) => (rootIdx + semi) % 12);

  // Add bass note if present
  if (bass) {
    const bassIdx = NOTE_INDEX[bass];
    if (bassIdx !== undefined && !pcs.includes(bassIdx)) {
      pcs.unshift(bassIdx);
    }
  }

  const result = [...new Set(pcs)];
  pitchClassCache.set(chordName, result);
  return result;
}

// ── Public component ───────────────────────────────────

interface PianoChordDiagramProps {
  /** Chord name, e.g. "Am", "F#m7", "C/G" */
  chord: string;
  /** Width in px (default: 120) */
  width?: number;
  /** Number of octaves to show (default: 1) */
  octaves?: number;
  /** Hide fingering button & dialog */
  hideFingering?: boolean;
  /** Optional CSS class */
  className?: string;
}

export const PianoChordDiagram = memo(function PianoChordDiagram({
  chord,
  width = 120,
  octaves = 1,
  hideFingering = false,
  className,
}: PianoChordDiagramProps) {
  const pitchClasses = resolvePitchClasses(chord);
  const [fpOpen, setFpOpen] = useState(false);

  if (pitchClasses.length === 0) {
    return (
      <div
        className={`flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card/50 ${className ?? ""}`}
        style={{ width, height: width * 0.6 }}
      >
        <span className="font-mono text-xs font-bold text-primary">
          {chord}
        </span>
        <span className="text-[8px] text-muted-foreground">no diagram</span>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center ${className ?? ""}`}>
      <PianoDiagramSVG
        pitchClasses={pitchClasses}
        width={width}
        octaves={octaves}
        chordName={chord}
      />
      {!hideFingering && (
        <div className="mt-1 flex items-center justify-center">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setFpOpen(true);
            }}
            className="flex size-5 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
            aria-label="Lihat fingering piano"
            title="Piano Fingering"
          >
            <PianoFingerTriggerIcon className="size-3.5" />
          </button>
        </div>
      )}
      {!hideFingering && fpOpen && (
        <PianoFingeringDialog
          open={fpOpen}
          onOpenChange={setFpOpen}
          chordName={chord}
          pitchClasses={pitchClasses}
        />
      )}
    </div>
  );
});

// ── Mini variant ───────────────────────────────────────

interface PianoChordDiagramMiniProps {
  chord: string;
  className?: string;
}

export const PianoChordDiagramMini = memo(function PianoChordDiagramMini({
  chord,
  className,
}: PianoChordDiagramMiniProps) {
  const pitchClasses = resolvePitchClasses(chord);
  if (pitchClasses.length === 0) return null;
  return (
    <PianoDiagramSVG
      pitchClasses={pitchClasses}
      width={90}
      octaves={1}
      chordName={chord}
      className={className}
    />
  );
});

// ── SVG Renderer ───────────────────────────────────────

function PianoDiagramSVG({
  pitchClasses,
  width,
  octaves,
  chordName,
  className,
}: {
  pitchClasses: number[];
  width: number;
  octaves: number;
  chordName: string;
  className?: string;
}) {
  const pcSet = new Set(pitchClasses);

  const totalWhiteKeys = OCTAVE_WHITE_COUNT * octaves;
  const headerH = width * 0.18;
  const pianoH = width * 0.55;
  const height = headerH + pianoH + 4;
  const keyAreaW = width - 8; // 4px padding each side
  const whiteKeyW = keyAreaW / totalWhiteKeys;
  const blackKeyW = whiteKeyW * 0.62;
  const blackKeyH = pianoH * 0.62;
  const padX = 4;

  // Root note for label positioning
  const rootPc = pitchClasses[0] ?? 0;
  const rootName = NOTE_NAMES_SHARP[rootPc];

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      role="img"
      aria-label={`${chordName} piano chord diagram`}
    >
      {/* Chord name label */}
      <text
        x={width / 2}
        y={headerH * 0.6}
        textAnchor="middle"
        className="fill-foreground font-mono font-bold"
        style={{ fontSize: Math.max(11, width * 0.12) }}
      >
        {chordName}
      </text>

      {/* Piano body background */}
      <rect
        x={padX}
        y={headerH}
        width={keyAreaW}
        height={pianoH}
        rx={2}
        className="fill-muted/30 stroke-muted-foreground/30"
        strokeWidth={0.5}
      />

      {/* White keys */}
      {Array.from({ length: totalWhiteKeys }, (_, i) => {
        const octaveIdx = Math.floor(i / OCTAVE_WHITE_COUNT);
        const noteInOctave = i % OCTAVE_WHITE_COUNT;
        const pc = WHITE_PCS[noteInOctave];
        const isHighlighted = pcSet.has(pc);
        const color = PC_COLORS[pc];

        const x = padX + i * whiteKeyW;
        const noteName = NOTE_NAMES_SHARP[pc];
        const labelSize = Math.max(7, whiteKeyW * 0.46);

        return (
          <g key={`w-${i}`}>
            <rect
              x={x + 0.5}
              y={headerH}
              width={whiteKeyW - 1}
              height={pianoH - 1}
              rx={1.5}
              fill={isHighlighted ? color.whiteFill : "var(--background)"}
              stroke={
                isHighlighted
                  ? color.whiteFill
                  : "var(--muted-foreground-alpha, rgba(128,128,128,0.35))"
              }
              strokeWidth={0.7}
              opacity={isHighlighted ? 1 : 0.9}
            />
            {/* Note label at bottom of white key */}
            {isHighlighted ? (
              <text
                x={x + whiteKeyW / 2}
                y={headerH + pianoH - labelSize * 0.6}
                textAnchor="middle"
                fill={color.text}
                style={{
                  fontSize: labelSize,
                  fontWeight: 600,
                  fontFamily: "var(--font-mono, monospace)",
                }}
              >
                {noteName}
              </text>
            ) : null}
          </g>
        );
      })}

      {/* Black keys */}
      {Array.from({ length: octaves }, (_, octaveIdx) =>
        BLACK_KEY_INFO.map(({ pc, afterWhite }) => {
          const whiteIdx = octaveIdx * OCTAVE_WHITE_COUNT + afterWhite;
          const x = padX + (whiteIdx + 1) * whiteKeyW - blackKeyW / 2;
          const isHighlighted = pcSet.has(pc);
          const color = PC_COLORS[pc];
          const noteName = NOTE_NAMES_SHARP[pc];
          const labelSize = Math.max(6, blackKeyW * 0.44);

          return (
            <g key={`b-${octaveIdx}-${pc}`}>
              <rect
                x={x}
                y={headerH}
                width={blackKeyW}
                height={blackKeyH}
                rx={1.2}
                fill={
                  isHighlighted ? color.blackFill : "var(--foreground, #222)"
                }
                stroke="none"
                opacity={isHighlighted ? 1 : 0.85}
              />
              {isHighlighted ? (
                <text
                  x={x + blackKeyW / 2}
                  y={headerH + blackKeyH - labelSize * 0.7}
                  textAnchor="middle"
                  fill={color.text}
                  style={{
                    fontSize: labelSize,
                    fontWeight: 600,
                    fontFamily: "var(--font-mono, monospace)",
                  }}
                >
                  {noteName}
                </text>
              ) : null}
            </g>
          );
        }),
      )}
    </svg>
  );
}
