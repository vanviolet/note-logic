// ════════════════════════════════════════════════════════
// Ukulele Fretboard — interactive 4-string (GCEA) fretboard
// ════════════════════════════════════════════════════════
//
// Modeled after the guitar Fretboard component but with 4 strings,
// default GCEA tuning, and appropriate sizing.

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

// Re-export for backward compat — same color map as guitar fretboard
export const UKE_NOTE_COLOR_CLASSES = NOTE_COLOR_CLASSES;

// ── Types ──────────────────────────────────────────────

export interface UkuleleFretboardNote {
  stringIndex: number;
  fret: number;
  note: string;
  octave: number;
  midi: number;
  pitchClass: number;
}

export interface UkuleleFretboardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Default: ["G4", "C4", "E4", "A4"] (standard ukulele GCEA) */
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
  onFretClick?: (note: UkuleleFretboardNote) => void;
}

// ── Helpers ────────────────────────────────────────────

function parseScientificNote(input: string) {
  const result = _parseScientificNote(input);
  const normalized = input.replace("♯", "#").replace("♭", "b");
  const match = normalized.match(/^([A-Ga-g])([#b]*)/);
  const rootName = match ? `${match[1].toUpperCase()}${match[2] ?? ""}` : "C";
  return { ...result, rootName };
}

function buildFretNote(
  openString: string,
  fret: number,
): Omit<UkuleleFretboardNote, "stringIndex" | "fret"> {
  const parsed = parseScientificNote(openString);
  const pitchClass = (parsed.pitchClass + fret) % 12;
  const midi = (parsed.octave + 1) * 12 + parsed.pitchClass + fret;
  const octave = Math.floor(midi / 12) - 1;
  const note = NOTES_SHARP[pitchClass];
  return { note, octave, midi, pitchClass };
}

// ── Pre-computed row data ──────────────────────────────

interface GridRowData {
  openString: string;
  stringIndex: number;
  openLabel: string;
  frets: UkuleleFretboardNote[];
}

// ── Fret dot markers ───────────────────────────────────

const UKE_SINGLE_DOT_FRETS = new Set([3, 5, 7, 9, 15]);
const UKE_DOUBLE_DOT_FRETS = new Set([12]);

// ── String thickness & color (ukulele: nylon + wound C) ──

const UKE_STRING_THICKNESS = [
  "h-[2px]", // G4 (4th string) — nylon
  "h-[2.5px]", // C4 (3rd string) — wound, thickest
  "h-[1.5px]", // E4 (2nd string) — nylon
  "h-[1px]", // A4 (1st string) — nylon, thinnest
];

const UKE_STRING_COLORS = [
  "bg-zinc-400/50 dark:bg-zinc-300/40", // G4 — plain nylon
  "bg-amber-600/55 dark:bg-amber-400/45", // C4 — wound
  "bg-zinc-400/45 dark:bg-zinc-300/35", // E4 — plain nylon
  "bg-zinc-400/40 dark:bg-zinc-300/30", // A4 — plain nylon
];

// ── FretButton ─────────────────────────────────────────

interface FretButtonProps {
  noteData: UkuleleFretboardNote;
  isHighlighted: boolean;
  toneLabel: string | undefined;
  isActive: boolean;
  onFretClick?: (note: UkuleleFretboardNote) => void;
}

const FretButton = React.memo(function FretButton({
  noteData,
  isHighlighted,
  toneLabel,
  isActive,
  onFretClick,
}: FretButtonProps) {
  const noteColor = UKE_NOTE_COLOR_CLASSES[noteData.pitchClass];

  const handleClick = React.useCallback(
    () => onFretClick?.(noteData),
    [onFretClick, noteData],
  );

  const isOpen = noteData.fret === 0;
  const displayIdx = noteData.stringIndex;
  const thickness = UKE_STRING_THICKNESS[displayIdx] ?? "h-[1.5px]";
  const stringColor = UKE_STRING_COLORS[displayIdx] ?? "bg-zinc-400/40";

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
        isOpen ? "bg-transparent" : "bg-amber-950/3 dark:bg-amber-100/2",
        // Right border = fret wire (except open string area)
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

      {/* ── Note dot indicator ──────────────────── */}
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
              <span className="text-[8px] opacity-75">{toneLabel}</span>
            ) : null}
          </span>
        </span>
      )}

      {/* ── Note name (unhighlighted) ───────────── */}
      {!isHighlighted && !isActive && (
        <span className="relative z-10 text-transparent group-hover:text-muted-foreground text-[10px] transition-colors">
          {noteData.note}
        </span>
      )}

      <span className="sr-only">{noteData.octave}</span>
    </button>
  );
});

// ── StringRow ──────────────────────────────────────────

interface StringRowProps {
  row: GridRowData;
  editableTuning: boolean;
  tuningOptions: string[];
  normalizedHighlights: Set<number>;
  highlightedToneLabels?: Partial<Record<number, string>>;
  activeFret: number | null;
  onFretClick?: (note: UkuleleFretboardNote) => void;
  onTuningSelect: (stringIndex: number, value: string) => void;
  showOpenLabel: boolean;
}

const UkuleleStringRow = React.memo(function UkuleleStringRow({
  row,
  editableTuning,
  tuningOptions,
  normalizedHighlights,
  highlightedToneLabels,
  activeFret,
  onFretClick,
  onTuningSelect,
  showOpenLabel,
}: StringRowProps) {
  const handleTuningChange = React.useCallback(
    (value: string) => onTuningSelect(row.stringIndex, value),
    [onTuningSelect, row.stringIndex],
  );

  return (
    <>
      {editableTuning ? (
        <div className="flex h-10 items-center bg-muted/30 px-1 border-r-[3px] border-r-zinc-600 dark:border-r-zinc-300">
          <Select value={row.openString} onValueChange={handleTuningChange}>
            <SelectTrigger
              aria-label={`Select tuning for string ${row.stringIndex + 1}`}
              className="h-8 w-full px-2 text-xs"
            >
              <SelectValue placeholder="Select note" />
            </SelectTrigger>
            <SelectContent className="max-h-64">
              {tuningOptions.map((option) => (
                <SelectItem
                  key={`uke-tuning-option-${option}`}
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
        <div className="flex h-10 items-center justify-center bg-muted/60 text-xs font-semibold border-r-[3px] border-r-zinc-600 dark:border-r-zinc-300">
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

// ── Main component ─────────────────────────────────────

const UkuleleFretboardBase = React.forwardRef<
  HTMLDivElement,
  UkuleleFretboardProps
>(
  (
    {
      className,
      tuning = ["G4", "C4", "E4", "A4"],
      editableTuning = false,
      onTuningChange,
      enableLiveMic = true,
      onLivePitchFrame,
      liveMicOptions,
      liveMicSwitchLockCount = 4,
      liveMicConfidenceThreshold = 0.86,
      fretCount = 15,
      highlightedPitchClasses = [],
      highlightedToneLabels,
      activeNote = null,
      showOpenLabel = true,
      onFretClick,
      ...props
    },
    ref,
  ) => {
    // DOM refs for live mic
    const rootRef = React.useRef<HTMLDivElement | null>(null);
    const liveActiveElsRef = React.useRef<HTMLElement[]>([]);
    const livePreviewElsRef = React.useRef<HTMLElement[]>([]);
    const lastLiveMidiRef = React.useRef<number | null>(null);
    const switchCandidateMidiRef = React.useRef<number | null>(null);
    const switchCandidateCountRef = React.useRef(0);

    // ── Tuning state ──────────────────────────────────────────────────────
    const [localTuning, setLocalTuning] = React.useState<string[]>(tuning);
    React.useEffect(() => {
      if (!editableTuning) return;
      setLocalTuning(tuning);
    }, [tuning, editableTuning]);

    const internalTuning = editableTuning ? localTuning : tuning;

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
      for (let octave = 2; octave <= 6; octave += 1) {
        ALL_NOTE_OPTIONS.forEach((note) => options.push(`${note}${octave}`));
      }
      return options;
    }, []);

    // ── Live mic callbacks (DOM-only, no React state) ─────────────────────
    const clearLiveMarkers = React.useCallback(() => {
      if (
        liveActiveElsRef.current.length === 0 &&
        livePreviewElsRef.current.length === 0
      )
        return;
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

        if (switchCandidateCountRef.current < liveMicSwitchLockCount) return;

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
          "overflow-x-auto rounded-xl border border-border/70 bg-card/70 p-3",
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
                ? "Listening... pluck a ukulele string to see live effects"
                : "Mic off"}
            </span>
            {error ? (
              <span className="text-destructive text-xs">
                Mic error: {error}
              </span>
            ) : null}
          </div>
        ) : null}

        {/* Dynamic grid: 4 strings with guitar-style rendering */}
        <div
          className="gap-y-0 gap-x-0"
          style={{
            display: "grid",
            minWidth: `${100 + (fretCount + 1) * 44}px`,
            gridTemplateColumns: `100px repeat(${fretCount + 1}, minmax(44px, 1fr))`,
          }}
        >
          <div className="text-muted-foreground flex items-center justify-center text-xs font-medium">
            String
          </div>
          {Array.from({ length: fretCount + 1 }, (_, fret) => (
            <div
              key={`fret-head-${fret}`}
              className="text-muted-foreground relative flex h-8 flex-col items-center justify-center text-xs font-medium"
            >
              <span>{fret}</span>
              {/* Fret dot markers */}
              {UKE_SINGLE_DOT_FRETS.has(fret) && (
                <span className="absolute -bottom-0.5 h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
              )}
              {UKE_DOUBLE_DOT_FRETS.has(fret) && (
                <span className="absolute -bottom-0.5 flex gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
                </span>
              )}
            </div>
          ))}

          {gridData.map((row) => (
            <UkuleleStringRow
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

UkuleleFretboardBase.displayName = "UkuleleFretboard";

/**
 * UkuleleFretboard — 4-string interactive ukulele fretboard.
 *
 * Same performance model as guitar Fretboard:
 * - memo(UkuleleFretboard): skips parent re-renders with same props
 * - gridData (useMemo): note data computed once per tuning/fretCount change
 * - UkuleleStringRow (memo): only changed rows re-render
 * - FretButton (memo): only affected buttons re-render
 * - Live mic: pure DOM manipulation, zero React reconciliation
 */
export const UkuleleFretboard = React.memo(UkuleleFretboardBase);
