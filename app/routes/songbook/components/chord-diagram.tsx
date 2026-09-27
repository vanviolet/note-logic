// ════════════════════════════════════════════════════════
// ChordDiagram – Dynamic SVG guitar chord diagram
// ════════════════════════════════════════════════════════
//
// Features:
// - Generates voicings algorithmically for ANY chord
// - Multi-position navigator (prev/next through all positions)
// - x/o markers, nut line, fret position, finger dots, barre bars
// - Compact & mini variants for use inside popovers

import { memo, useState, useCallback } from "react";
import {
  getBestVoicing,
  getAllVoicingsWithOverride,
  type ChordVoicing,
} from "../lib/chord-voicing-engine";
import {
  FingerpickingDialog,
  FingerPickTriggerIcon,
} from "./fingerpicking-dialog";

// ── Constants ──────────────────────────────────────────

const NUM_STRINGS = 6;
const NUM_FRETS = 5;
const PADDING_TOP = 0.22;
const PADDING_BOTTOM = 0.08;
const PADDING_X = 0.14;
const FRET_POS_SPACE = 0.1;

// ── Public component ───────────────────────────────────

interface ChordDiagramProps {
  /** Chord name, e.g. "Am", "F#m7", "C/G" */
  chord: string;
  /** Width in px */
  width?: number;
  /** Diagram layout orientation */
  guitarPosition?: "vertical" | "horizontal";
  /** Show multi-position controls */
  showPositions?: boolean;
  /** Hide chord name on top of diagram */
  hideChordName?: boolean;
  /** Hide button/dialog for fingerpicking */
  hideFingerPicking?: boolean;
  /** Optional CSS class */
  className?: string;
}

export const ChordDiagram = memo(function ChordDiagram({
  chord,
  width = 100,
  guitarPosition = "vertical",
  showPositions = true,
  hideChordName = false,
  hideFingerPicking = false,
  className,
}: ChordDiagramProps) {
  const allVoicings = getAllVoicingsWithOverride(chord);
  const [posIdx, setPosIdx] = useState(0);
  const [fpOpen, setFpOpen] = useState(false);

  const safeIdx = posIdx >= allVoicings.length ? 0 : posIdx;
  const voicing = allVoicings[safeIdx];
  const total = allVoicings.length;

  const prev = useCallback(
    () => setPosIdx((i) => (((i - 1) % total) + total) % total),
    [total],
  );
  const next = useCallback(() => setPosIdx((i) => (i + 1) % total), [total]);

  const hasPositionControls = showPositions && total > 1;
  const hasControls = hasPositionControls || !hideFingerPicking;

  if (!voicing) {
    return (
      <div
        className={`flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card/50 ${className ?? ""}`}
        style={{ width, height: width * 1.4 }}
      >
        <span className="font-mono text-xs font-bold text-primary">
          {chord}
        </span>
        <span className="text-[8px] text-muted-foreground">no diagram</span>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center ${
        guitarPosition === "horizontal" ? "flex-row gap-2" : "flex-col"
      } ${className ?? ""}`}
    >
      <DiagramSVG
        voicing={voicing}
        width={width}
        chordName={chord}
        hideChordName={hideChordName}
      />

      {hasControls && (
        <div
          className={`flex items-center gap-1.5 ${
            guitarPosition === "horizontal" ? "" : "mt-1"
          }`}
        >
          {hasPositionControls && (
            <>
              <button
                onClick={prev}
                className="flex size-5 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Previous position"
              >
                <ChevronLeft />
              </button>
              <span className="min-w-10 text-center font-mono text-[11px] text-muted-foreground">
                {safeIdx + 1}/{total}
              </span>
              <button
                onClick={next}
                className="flex size-5 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Next position"
              >
                <ChevronRight />
              </button>
            </>
          )}

          {!hideFingerPicking && (
            <button
              onClick={() => setFpOpen(true)}
              className="flex size-5 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
              aria-label="Lihat fingerpicking"
              title="Fingerpicking"
            >
              <FingerPickTriggerIcon className="size-3.5" />
            </button>
          )}
        </div>
      )}

      {!hideFingerPicking && (
        <FingerpickingDialog
          open={fpOpen}
          onOpenChange={setFpOpen}
          chordName={chord}
          frets={[...voicing.frets]}
          instrument="guitar"
        />
      )}
    </div>
  );
});

// ── Mini variant (for popover) ─────────────────────────

interface ChordDiagramMiniProps {
  chord: string;
  className?: string;
}

export const ChordDiagramMini = memo(function ChordDiagramMini({
  chord,
  className,
}: ChordDiagramMiniProps) {
  const voicing = getBestVoicing(chord);
  if (!voicing) return null;
  return (
    <DiagramSVG
      voicing={voicing}
      width={90}
      chordName={chord}
      className={className}
    />
  );
});

// ── SVG Renderer ───────────────────────────────────────

function DiagramSVG({
  voicing,
  width,
  chordName,
  hideChordName = false,
  className,
}: {
  voicing: ChordVoicing;
  width: number;
  chordName: string;
  hideChordName?: boolean;
  className?: string;
}) {
  const aspectRatio = 1.4;
  const height = width * aspectRatio;

  const gridLeft = width * (PADDING_X + FRET_POS_SPACE);
  const gridRight = width * (1 - PADDING_X);
  const gridTop = height * PADDING_TOP;
  const gridBottom = height * (1 - PADDING_BOTTOM);
  const gridH = gridBottom - gridTop;
  const gridW = gridRight - gridLeft;

  const stringSpacing = gridW / (NUM_STRINGS - 1);
  const fretSpacing = gridH / NUM_FRETS;

  const playedFrets = voicing.frets.filter((f) => f > 0);
  const minFret = playedFrets.length > 0 ? Math.min(...playedFrets) : 1;
  const maxFret = playedFrets.length > 0 ? Math.max(...playedFrets) : 1;
  const isOpenPosition = minFret <= NUM_FRETS && maxFret <= NUM_FRETS;
  const startFret = isOpenPosition ? 1 : minFret;

  const dotRadius = Math.min(stringSpacing, fretSpacing) * 0.36;
  const stringX = (idx: number) => gridLeft + idx * stringSpacing;
  const fretY = (fret: number) => gridTop + fret * fretSpacing;
  const dotY = (fret: number) => {
    const rel = fret - startFret + 1;
    return fretY(rel) - fretSpacing / 2;
  };

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      role="img"
      aria-label={`${chordName} chord diagram`}
    >
      {/* Chord name */}
      {!hideChordName && (
        <text
          x={width / 2}
          y={gridTop * 0.35}
          textAnchor="middle"
          className="fill-foreground font-mono font-bold"
          style={{ fontSize: Math.max(11, width * 0.14) }}
        >
          {chordName}
        </text>
      )}

      {/* Nut or fret position label */}
      {isOpenPosition ? (
        <line
          x1={gridLeft - 1}
          y1={gridTop}
          x2={gridRight + 1}
          y2={gridTop}
          className="stroke-foreground"
          strokeWidth={Math.max(3, width * 0.04)}
          strokeLinecap="round"
        />
      ) : (
        <text
          x={gridLeft - dotRadius * 1.5}
          y={fretY(1) - fretSpacing / 2 + 1}
          textAnchor="end"
          dominantBaseline="central"
          className="fill-muted-foreground"
          style={{ fontSize: Math.max(9, width * 0.11) }}
        >
          {`${startFret}fr`}
        </text>
      )}

      {/* Fret lines */}
      {Array.from({ length: NUM_FRETS + 1 }).map((_, i) => (
        <line
          key={`f${i}`}
          x1={gridLeft}
          y1={fretY(i)}
          x2={gridRight}
          y2={fretY(i)}
          className="stroke-muted-foreground/60"
          strokeWidth={i === 0 && !isOpenPosition ? 2 : 1.2}
        />
      ))}

      {/* String lines */}
      {Array.from({ length: NUM_STRINGS }).map((_, i) => (
        <line
          key={`s${i}`}
          x1={stringX(i)}
          y1={gridTop}
          x2={stringX(i)}
          y2={gridBottom}
          className="stroke-muted-foreground/60"
          strokeWidth={1.2}
        />
      ))}

      {/* X / O markers */}
      {voicing.frets.map((fret, i) => {
        const cx = stringX(i);
        const cy = gridTop - dotRadius * 1.8;
        const ms = dotRadius * 0.85;

        if (fret === -1) {
          return (
            <g key={`m${i}`}>
              <line
                x1={cx - ms}
                y1={cy - ms}
                x2={cx + ms}
                y2={cy + ms}
                className="stroke-muted-foreground"
                strokeWidth={1.5}
                strokeLinecap="round"
              />
              <line
                x1={cx + ms}
                y1={cy - ms}
                x2={cx - ms}
                y2={cy + ms}
                className="stroke-muted-foreground"
                strokeWidth={1.5}
                strokeLinecap="round"
              />
            </g>
          );
        }

        if (fret === 0) {
          return (
            <circle
              key={`m${i}`}
              cx={cx}
              cy={cy}
              r={ms}
              className="fill-none stroke-foreground"
              strokeWidth={1.5}
            />
          );
        }

        return null;
      })}

      {/* Barre bars */}
      {voicing.barres?.map((barre, i) => {
        const rel = barre.fret - startFret + 1;
        if (rel < 1 || rel > NUM_FRETS) return null;

        const by = fretY(rel) - fretSpacing / 2;
        const fromIdx = NUM_STRINGS - barre.fromString;
        const toIdx = NUM_STRINGS - barre.toString;
        const x1 = stringX(Math.min(fromIdx, toIdx));
        const x2 = stringX(Math.max(fromIdx, toIdx));

        return (
          <rect
            key={`b${i}`}
            x={x1}
            y={by - dotRadius}
            width={x2 - x1}
            height={dotRadius * 2}
            rx={dotRadius}
            className="fill-foreground"
          />
        );
      })}

      {/* Finger dots */}
      {voicing.frets.map((fret, i) => {
        if (fret <= 0) return null;
        const rel = fret - startFret + 1;
        if (rel < 1 || rel > NUM_FRETS) return null;

        const cx = stringX(i);
        const cy = dotY(fret);
        const finger = voicing.fingers[i];

        // Skip if covered by barre with same finger
        const isBarre = voicing.barres?.some((b) => {
          const fromIdx = NUM_STRINGS - b.fromString;
          const toIdx = NUM_STRINGS - b.toString;
          return (
            b.fret === fret &&
            i >= Math.min(fromIdx, toIdx) &&
            i <= Math.max(fromIdx, toIdx) &&
            finger === 1
          );
        });
        if (isBarre) return null;

        return (
          <g key={`d${i}`}>
            <circle cx={cx} cy={cy} r={dotRadius} className="fill-foreground" />
            {finger > 0 && (
              <text
                x={cx}
                y={cy}
                textAnchor="middle"
                dominantBaseline="central"
                className="fill-background font-mono font-bold"
                style={{ fontSize: Math.max(8, dotRadius * 1.5) }}
              >
                {finger}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ── Tiny chevron icons ─────────────────────────────────

function ChevronLeft() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}
