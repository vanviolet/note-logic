import * as React from "react";
import {
  ALL_NOTE_OPTIONS,
  NOTES_SHARP,
  NOTE_COLOR_CLASSES,
  parseScientificNote as _parseScientificNote,
} from "~/theory-music/core";
import { useLiveGuitarPitch, type LivePitchFrame } from "~/templates/hooks";
import { Button } from "~/templates/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/templates/components/ui/select";
import { cn } from "~/templates/lib/utils";

// Re-export for backward compatibility
export { NOTE_COLOR_CLASSES };

export interface FretboardNote {
  stringIndex: number;
  fret: number;
  note: string;
  octave: number;
  midi: number;
  pitchClass: number;
}

export interface FretboardProps extends React.HTMLAttributes<HTMLDivElement> {
  tuning?: string[];
  editableTuning?: boolean;
  onTuningChange?: (tuning: string[]) => void;
  enableLiveMic?: boolean;
  onLivePitchFrame?: (frame: LivePitchFrame | null) => void;
  liveMicOptions?: {
    minFrequency?: number;
    maxFrequency?: number;
    rmsThreshold?: number;
    smoothingAlpha?: number;
    lockFrameCount?: number;
  };
  liveMicSwitchLockCount?: number;
  liveMicConfidenceThreshold?: number;
  fretCount?: number;
  highlightedPitchClasses?: number[];
  highlightedToneLabels?: Partial<Record<number, string>>;
  activeNote?: { stringIndex: number; fret: number } | null;
  showOpenLabel?: boolean;
  onFretClick?: (note: FretboardNote) => void;
}

function parseScientificNote(input: string) {
  const result = _parseScientificNote(input);
  // Extract rootName for fretboard display
  const normalized = input.replace("♯", "#").replace("♭", "b");
  const match = normalized.match(/^([A-Ga-g])([#b]*)/);
  const rootName = match ? `${match[1].toUpperCase()}${match[2] ?? ""}` : "C";
  return { ...result, rootName };
}

function buildFretNote(
  openString: string,
  fret: number,
): Omit<FretboardNote, "stringIndex" | "fret"> {
  const parsed = parseScientificNote(openString);
  const pitchClass = (parsed.pitchClass + fret) % 12;
  const midi = (parsed.octave + 1) * 12 + parsed.pitchClass + fret;
  const octave = Math.floor(midi / 12) - 1;
  const note = NOTES_SHARP[pitchClass];

  return { note, octave, midi, pitchClass };
}

// ---------------------------------------------------------------------------
// Pre-computed row data — stable across renders when tuning/fretCount unchanged
// ---------------------------------------------------------------------------
interface GridRowData {
  openString: string;
  stringIndex: number;
  /** Pre-computed open string label (e.g. "E2") so parseScientificNote is
   *  not called during render for the label cell. */
  openLabel: string;
  /** All fret note data for this string, computed once in useMemo. */
  frets: FretboardNote[];
}

// ---------------------------------------------------------------------------
// FretButton — memo'd: only re-renders when isActive / isHighlighted changes
// ---------------------------------------------------------------------------
interface FretButtonProps {
  noteData: FretboardNote;
  isHighlighted: boolean;
  toneLabel: string | undefined;
  isActive: boolean;
  onFretClick?: (note: FretboardNote) => void;
}

// Fret positions that have dot markers on a real guitar
const SINGLE_DOT_FRETS = new Set([3, 5, 7, 9, 15, 17, 19, 21]);
const DOUBLE_DOT_FRETS = new Set([12, 24]);

// String thickness classes (E2 thickest → E4 thinnest)
const STRING_THICKNESS = [
  "h-[3px]", // E2 (6th string) — thickest
  "h-[2.5px]", // A2
  "h-[2px]", // D3
  "h-[1.5px]", // G3
  "h-[1px]", // B3
  "h-[1px]", // E4 (1st string) — thinnest
];

const STRING_COLORS = [
  "bg-amber-600/60 dark:bg-amber-400/50", // wound strings
  "bg-amber-600/55 dark:bg-amber-400/45",
  "bg-amber-700/50 dark:bg-amber-400/40",
  "bg-zinc-400/60 dark:bg-zinc-300/50", // plain strings
  "bg-zinc-400/55 dark:bg-zinc-300/45",
  "bg-zinc-400/50 dark:bg-zinc-300/40",
];

const FretButton = React.memo(function FretButton({
  noteData,
  isHighlighted,
  toneLabel,
  isActive,
  onFretClick,
}: FretButtonProps) {
  const noteColor = NOTE_COLOR_CLASSES[noteData.pitchClass];

  const handleClick = React.useCallback(
    () => onFretClick?.(noteData),
    [onFretClick, noteData],
  );

  const isOpen = noteData.fret === 0;
  // stringIndex 0 = E2 (thickest bass), 5 = E4 (thinnest treble)
  const displayIdx = noteData.stringIndex;
  const thickness = STRING_THICKNESS[displayIdx] ?? "h-[1.5px]";
  const stringColor = STRING_COLORS[displayIdx] ?? "bg-zinc-400/50";

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`String ${noteData.stringIndex + 1}, fret ${noteData.fret}, note ${noteData.note}${noteData.octave}`}
      data-string-index={noteData.stringIndex}
      data-fret={noteData.fret}
      data-note={noteData.note}
      data-midi={noteData.midi}
      className={cn(
        "relative flex h-10 items-center justify-center text-xs transition-colors duration-75 cursor-pointer group",
        // Fret cell background — wood grain
        isOpen
          ? "bg-transparent" // open string area: no wood
          : "bg-amber-950/3 dark:bg-amber-100/2",
        // Right border as fret wire (except open)
        !isOpen && "border-r border-r-zinc-400/40 dark:border-r-zinc-500/30",
        // Left border = nut for fret 1
        noteData.fret === 1 &&
          "border-l-[3px] border-l-zinc-600 dark:border-l-zinc-300",
      )}
    >
      {/* ── String line ─────────────────────────── */}
      <div
        className={cn(
          "absolute inset-x-0 top-1/2 -translate-y-1/2 pointer-events-none",
          thickness,
          stringColor,
        )}
      />

      {/* ── Note indicator (dot on the string) ──── */}
      {(isHighlighted || isActive) && (
        <span
          className={cn(
            "relative z-10 flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold shadow-md transition-transform",
            isActive
              ? [
                  "scale-110",
                  noteColor.bg,
                  noteColor.border,
                  "border-2",
                  "text-foreground",
                  "shadow-lg",
                  "ring-2 ring-offset-1 ring-ring",
                ]
              : [
                  noteColor.bg,
                  noteColor.border,
                  "border",
                  noteColor.text,
                  "group-hover:scale-110",
                ],
          )}
        >
          <span className="flex flex-col items-center leading-none">
            <span>{noteData.note}</span>
            {toneLabel ? (
              <span className="text-[7px] opacity-80 leading-none">
                {toneLabel}
              </span>
            ) : null}
          </span>
        </span>
      )}

      {/* ── Hover ghost (show note on hover even when not highlighted) */}
      {!isHighlighted && !isActive && (
        <span className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full text-[9px] font-medium text-muted-foreground/0 group-hover:text-muted-foreground group-hover:bg-muted/80 group-hover:shadow-sm transition-all duration-150">
          {noteData.note}
        </span>
      )}

      <span className="sr-only">{noteData.octave}</span>
    </button>
  );
});

// ---------------------------------------------------------------------------
// FretboardStringRow — memo'd: only re-renders when activeFret / highlights
// change for *this specific string*, not for the whole fretboard.
// ---------------------------------------------------------------------------
interface FretboardStringRowProps {
  row: GridRowData;
  editableTuning: boolean;
  tuningOptions: string[];
  normalizedHighlights: Set<number>;
  highlightedToneLabels?: Partial<Record<number, string>>;
  /** The active fret index for THIS string only (null if none active here). */
  activeFret: number | null;
  onFretClick?: (note: FretboardNote) => void;
  onTuningSelect: (stringIndex: number, value: string) => void;
  showOpenLabel: boolean;
}

const FretboardStringRow = React.memo(function FretboardStringRow({
  row,
  editableTuning,
  tuningOptions,
  normalizedHighlights,
  highlightedToneLabels,
  activeFret,
  onFretClick,
  onTuningSelect,
  showOpenLabel,
}: FretboardStringRowProps) {
  const handleTuningChange = React.useCallback(
    (value: string) => onTuningSelect(row.stringIndex, value),
    [onTuningSelect, row.stringIndex],
  );

  return (
    <>
      {editableTuning ? (
        <div className="flex h-10 items-center bg-zinc-100/50 dark:bg-zinc-800/50 px-1 border-r-[3px] border-r-zinc-600 dark:border-r-zinc-300">
          <Select value={row.openString} onValueChange={handleTuningChange}>
            <SelectTrigger
              aria-label={`Select tuning for string ${row.stringIndex + 1}`}
              className="h-8 w-full px-2 text-xs bg-transparent border-0 shadow-none"
            >
              <SelectValue placeholder="Select note" />
            </SelectTrigger>
            <SelectContent className="max-h-64">
              {tuningOptions.map((option) => (
                <SelectItem
                  key={`fret-tuning-option-${option}`}
                  value={option}
                  className="text-xs"
                >
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : (
        <div className="flex h-10 items-center justify-center text-xs font-bold tracking-wide text-foreground/70 bg-zinc-100/60 dark:bg-zinc-800/40 border-r-[3px] border-r-zinc-600 dark:border-r-zinc-300">
          {showOpenLabel ? row.openLabel : `${row.stringIndex + 1}`}
        </div>
      )}

      {row.frets.map((noteData) => (
        <FretButton
          key={`${row.stringIndex}-${noteData.fret}`}
          noteData={noteData}
          isHighlighted={normalizedHighlights.has(noteData.pitchClass)}
          toneLabel={highlightedToneLabels?.[noteData.pitchClass]}
          isActive={activeFret === noteData.fret}
          onFretClick={onFretClick}
        />
      ))}
    </>
  );
});

// ---------------------------------------------------------------------------
// Fretboard — main component
// ---------------------------------------------------------------------------
const FretboardBase = React.forwardRef<HTMLDivElement, FretboardProps>(
  (
    {
      className,
      tuning = ["E2", "A2", "D3", "G3", "B3", "E4"],
      editableTuning = false,
      onTuningChange,
      enableLiveMic = true,
      onLivePitchFrame,
      liveMicOptions,
      liveMicSwitchLockCount = 4,
      liveMicConfidenceThreshold = 0.86,
      fretCount = 12,
      highlightedPitchClasses = [],
      highlightedToneLabels,
      activeNote = null,
      showOpenLabel = true,
      onFretClick,
      ...props
    },
    ref,
  ) => {
    // DOM refs for live mic — no React state, no reconciliation overhead
    const rootRef = React.useRef<HTMLDivElement | null>(null);
    const liveActiveElsRef = React.useRef<HTMLElement[]>([]);
    const livePreviewElsRef = React.useRef<HTMLElement[]>([]);
    const lastLiveMidiRef = React.useRef<number | null>(null);
    const switchCandidateMidiRef = React.useRef<number | null>(null);
    const switchCandidateCountRef = React.useRef(0);

    // ── Tuning state ──────────────────────────────────────────────────────
    // When editableTuning=false (most cases), bypass local state entirely and
    // use the prop directly — avoids a double-render on every tuning prop change.
    const [localTuning, setLocalTuning] = React.useState<string[]>(tuning);
    React.useEffect(() => {
      if (!editableTuning) return;
      setLocalTuning(tuning);
    }, [tuning, editableTuning]);

    const internalTuning = editableTuning ? localTuning : tuning;

    // Stable handler: uses functional setState so it doesn't depend on
    // internalTuning reference and won't change on every render.
    const handleTuningSelect = React.useCallback(
      (idx: number, value: string) => {
        setLocalTuning((prev) => {
          const next = [...prev];
          next[idx] = value;
          onTuningChange?.(next);
          return next;
        });
      },
      [onTuningChange],
    );

    // ── Pre-computed grid data ────────────────────────────────────────────
    // buildFretNote + parseScientificNote are NOT called during render.
    // They run once (or when tuning/fretCount changes) and produce stable
    // FretboardNote object references that FretButton.memo can rely on.
    const gridData = React.useMemo<GridRowData[]>(() => {
      return [...internalTuning].reverse().map((openString, reverseIdx) => {
        const stringIndex = internalTuning.length - 1 - reverseIdx;
        const parsed = parseScientificNote(openString);
        const openLabel = `${parsed.rootName}${parsed.octave}`;
        const frets = Array.from({ length: fretCount + 1 }, (_, fret) => ({
          ...buildFretNote(openString, fret),
          stringIndex,
          fret,
        }));
        return { openString, stringIndex, openLabel, frets };
      });
    }, [internalTuning, fretCount]);

    const normalizedHighlights = React.useMemo(
      () => new Set(highlightedPitchClasses.map((pc) => ((pc % 12) + 12) % 12)),
      [highlightedPitchClasses],
    );

    const tuningOptions = React.useMemo(() => {
      const options: string[] = [];
      for (let octave = 1; octave <= 5; octave += 1) {
        ALL_NOTE_OPTIONS.forEach((note) => options.push(`${note}${octave}`));
      }
      return options;
    }, []);

    // ── Live mic callbacks (DOM only, no React state) ─────────────────────
    const clearLiveMarkers = React.useCallback(() => {
      if (
        liveActiveElsRef.current.length === 0 &&
        livePreviewElsRef.current.length === 0
      ) {
        return;
      }
      liveActiveElsRef.current.forEach((el) => {
        el.classList.remove("fretboard-live-note", "fretboard-live-note-shake");
      });
      livePreviewElsRef.current.forEach((el) => {
        el.classList.remove("fretboard-live-note-unstable");
      });
      liveActiveElsRef.current = [];
      livePreviewElsRef.current = [];
      lastLiveMidiRef.current = null;
      switchCandidateMidiRef.current = null;
      switchCandidateCountRef.current = 0;
    }, []);

    const applyPreviewMarkers = React.useCallback((midi: number) => {
      if (!rootRef.current) return;
      livePreviewElsRef.current.forEach((el) => {
        el.classList.remove("fretboard-live-note-unstable");
      });
      const matched = rootRef.current.querySelectorAll<HTMLElement>(
        `button[data-midi="${midi}"]`,
      );
      if (!matched.length) {
        livePreviewElsRef.current = [];
        return;
      }
      matched.forEach((el) => el.classList.add("fretboard-live-note-unstable"));
      livePreviewElsRef.current = Array.from(matched);
    }, []);

    const applyLiveFrame = React.useCallback(
      (frame: LivePitchFrame | null) => {
        if (!rootRef.current || !frame) {
          onLivePitchFrame?.(null);
          clearLiveMarkers();
          return;
        }

        if ((frame.confidence ?? 0) < liveMicConfidenceThreshold) {
          onLivePitchFrame?.(frame);
          applyPreviewMarkers(frame.midi);
          return;
        }

        if (lastLiveMidiRef.current === frame.midi) {
          onLivePitchFrame?.(frame);
          livePreviewElsRef.current.forEach((el) => {
            el.classList.remove("fretboard-live-note-unstable");
          });
          livePreviewElsRef.current = [];
          liveActiveElsRef.current.forEach((el) => {
            el.style.setProperty(
              "--fret-live-tilt",
              `${Math.max(-10, Math.min(10, frame.cents * 0.2))}deg`,
            );
          });
          return;
        }

        if (switchCandidateMidiRef.current === frame.midi) {
          switchCandidateCountRef.current += 1;
        } else {
          switchCandidateMidiRef.current = frame.midi;
          switchCandidateCountRef.current = 1;
        }

        onLivePitchFrame?.(frame);
        applyPreviewMarkers(frame.midi);

        if (switchCandidateCountRef.current < liveMicSwitchLockCount) {
          return;
        }

        clearLiveMarkers();

        const matched = rootRef.current.querySelectorAll<HTMLElement>(
          `button[data-midi="${frame.midi}"]`,
        );
        if (!matched.length) return;

        const tilt = `${Math.max(-10, Math.min(10, frame.cents * 0.2))}deg`;
        matched.forEach((el) => {
          el.classList.add("fretboard-live-note", "fretboard-live-note-shake");
          el.style.setProperty("--fret-live-tilt", tilt);
        });

        onLivePitchFrame?.(frame);
        livePreviewElsRef.current.forEach((el) => {
          el.classList.remove("fretboard-live-note-unstable");
        });
        livePreviewElsRef.current = [];
        liveActiveElsRef.current = Array.from(matched);
        lastLiveMidiRef.current = frame.midi;
        switchCandidateMidiRef.current = null;
        switchCandidateCountRef.current = 0;
      },
      [
        applyPreviewMarkers,
        clearLiveMarkers,
        liveMicConfidenceThreshold,
        liveMicSwitchLockCount,
        onLivePitchFrame,
      ],
    );

    const { start, stop, isListening, isStarting, error } = useLiveGuitarPitch({
      onPitchFrame: applyLiveFrame,
      ...(liveMicOptions ?? {}),
    });

    React.useEffect(() => {
      if (!enableLiveMic && isListening) {
        stop();
        clearLiveMarkers();
      }
    }, [clearLiveMarkers, enableLiveMic, isListening, stop]);

    React.useEffect(() => clearLiveMarkers, [clearLiveMarkers]);

    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        rootRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref],
    );

    return (
      <div
        ref={setRefs}
        className={cn(
          "overflow-x-auto rounded-xl border border-border/60 bg-linear-to-b from-amber-50/40 via-orange-50/20 to-amber-50/30 dark:from-zinc-900/80 dark:via-zinc-900/60 dark:to-zinc-900/80 p-3 shadow-sm",
          className,
        )}
        {...props}
      >
        {enableLiveMic ? (
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant={isListening ? "secondary" : "outline"}
              size="sm"
              onClick={() => {
                if (isListening) {
                  stop();
                  clearLiveMarkers();
                } else {
                  void start();
                }
              }}
              disabled={isStarting}
            >
              {isListening
                ? "Stop Live Mic"
                : isStarting
                  ? "Starting Mic..."
                  : "Start Live Mic"}
            </Button>
            <span className="text-muted-foreground text-xs">
              {isListening
                ? "Listening... pluck a guitar string to see moving fret effects"
                : "Mic off"}
            </span>
            {error ? (
              <span className="text-destructive text-xs">
                Mic error: {error}
              </span>
            ) : null}
          </div>
        ) : null}

        {/* ── Fret number header + dot markers ──────── */}
        <div
          style={{
            display: "grid",
            minWidth: `${80 + (fretCount + 1) * 48}px`,
            gridTemplateColumns: `80px repeat(${fretCount + 1}, minmax(48px, 1fr))`,
          }}
        >
          <div className="flex items-center justify-center text-[10px] font-medium text-muted-foreground uppercase tracking-wider" />
          {Array.from({ length: fretCount + 1 }, (_, fret) => (
            <div
              key={`fret-head-${fret}`}
              className="flex flex-col items-center justify-center gap-0.5 h-7"
            >
              <span className="text-[10px] font-medium text-muted-foreground/70">
                {fret === 0 ? "" : fret}
              </span>
              {/* Fret dots */}
              {SINGLE_DOT_FRETS.has(fret) && (
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-400/50 dark:bg-zinc-500/40" />
              )}
              {DOUBLE_DOT_FRETS.has(fret) && (
                <span className="flex gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-zinc-400/50 dark:bg-zinc-500/40" />
                  <span className="h-1.5 w-1.5 rounded-full bg-zinc-400/50 dark:bg-zinc-500/40" />
                </span>
              )}
            </div>
          ))}
        </div>

        {/* ── Guitar neck grid ─────────────────────── */}
        <div
          className="rounded-lg overflow-hidden border border-zinc-300/40 dark:border-zinc-600/30"
          style={{
            display: "grid",
            minWidth: `${80 + (fretCount + 1) * 48}px`,
            gridTemplateColumns: `80px repeat(${fretCount + 1}, minmax(48px, 1fr))`,
            background:
              "repeating-linear-gradient(90deg, transparent 0px, transparent 47px, rgba(161,161,170,0.12) 47px, rgba(161,161,170,0.12) 48px)",
          }}
        >
          {/* Each string row is independently memo'd */}
          {gridData.map((row) => (
            <FretboardStringRow
              key={`${row.openString}-${row.stringIndex}`}
              row={row}
              editableTuning={editableTuning}
              tuningOptions={tuningOptions}
              normalizedHighlights={normalizedHighlights}
              highlightedToneLabels={highlightedToneLabels}
              activeFret={
                activeNote?.stringIndex === row.stringIndex
                  ? activeNote.fret
                  : null
              }
              onFretClick={onFretClick}
              onTuningSelect={handleTuningSelect}
              showOpenLabel={showOpenLabel}
            />
          ))}
        </div>
      </div>
    );
  },
);

FretboardBase.displayName = "Fretboard";

/**
 * Fretboard component, wrapped with React.memo.
 *
 * Performance model:
 * - memo(Fretboard): skips re-render when parent re-renders with same props
 * - gridData (useMemo): note data computed once per tuning/fretCount change
 * - FretboardStringRow (memo): only rows where activeFret changes re-render
 * - FretButton (memo): only the 1–2 buttons that change active state re-render
 * - Live mic updates: pure DOM class/style manipulation, zero React reconciliation
 *
 * For best results, pass a stable `onFretClick` (useCallback in consumers).
 */
export const Fretboard = React.memo(FretboardBase);
