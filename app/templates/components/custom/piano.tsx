import * as React from "react";
import { useLiveGuitarPitch, type LivePitchFrame } from "~/templates/hooks";
import { Button } from "~/templates/components/ui/button";
import { cn } from "~/templates/lib/utils";
import { NOTE_NAMES_SHARP } from "~/shared/constants/music";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PianoNote {
  /** Note name, e.g. "C", "C#", "D" */
  note: string;
  /** Octave number */
  octave: number;
  /** MIDI number (C4 = 60) */
  midi: number;
  /** 0–11 pitch class */
  pitchClass: number;
  /** Whether this is a black key */
  isBlack: boolean;
}

export interface PianoProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Starting octave (default: 2) */
  startOctave?: number;
  /** Number of octaves to show (default: 3) */
  octaveCount?: number;
  /** Pitch classes to highlight (0–11) */
  highlightedPitchClasses?: number[];
  /** Labels for highlighted tones, keyed by pitch class */
  highlightedToneLabels?: Partial<Record<number, string>>;
  /** Currently active (clicked) note */
  activeNote?: { midi: number } | null;
  /** Enable live microphone input */
  enableLiveMic?: boolean;
  /** Callback when a live pitch frame is detected */
  onLivePitchFrame?: (frame: LivePitchFrame | null) => void;
  /** Live mic tuning options */
  liveMicOptions?: {
    minFrequency?: number;
    maxFrequency?: number;
    rmsThreshold?: number;
    smoothingAlpha?: number;
    lockFrameCount?: number;
  };
  /** Frames needed before locking to a new MIDI note */
  liveMicSwitchLockCount?: number;
  /** Minimum confidence for active highlight (vs preview/unstable) */
  liveMicConfidenceThreshold?: number;
  /** Callback when a key is clicked */
  onKeyClick?: (note: PianoNote) => void;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** White key pitch classes: C D E F G A B */
const WHITE_KEY_NOTES = [0, 2, 4, 5, 7, 9, 11];

/**
 * Black key offsets within one octave, positioned relative to white keys.
 * Each entry: [pitchClass, leftOffsetPercent] — percent of one octave width.
 */
const BLACK_KEY_POSITIONS: Array<{ pc: number; offsetPct: number }> = [
  { pc: 1, offsetPct: (1 / 7) * 100 - 3.6 }, // C#
  { pc: 3, offsetPct: (2 / 7) * 100 - 3.6 }, // D#
  { pc: 6, offsetPct: (4 / 7) * 100 - 3.6 }, // F#
  { pc: 8, offsetPct: (5 / 7) * 100 - 3.6 }, // G#
  { pc: 10, offsetPct: (6 / 7) * 100 - 3.6 }, // A#
];

// Highlight color map (matches fretboard NOTE_COLOR_CLASSES concept)
const HIGHLIGHT_COLORS: Record<
  number,
  { white: string; black: string; whiteActive: string; blackActive: string }
> = {
  0: {
    white: "piano-hl-pink",
    black: "piano-hl-pink-black",
    whiteActive: "piano-active-pink",
    blackActive: "piano-active-pink-black",
  },
  1: {
    white: "piano-hl-rose",
    black: "piano-hl-rose-black",
    whiteActive: "piano-active-rose",
    blackActive: "piano-active-rose-black",
  },
  2: {
    white: "piano-hl-orange",
    black: "piano-hl-orange-black",
    whiteActive: "piano-active-orange",
    blackActive: "piano-active-orange-black",
  },
  3: {
    white: "piano-hl-amber",
    black: "piano-hl-amber-black",
    whiteActive: "piano-active-amber",
    blackActive: "piano-active-amber-black",
  },
  4: {
    white: "piano-hl-blue",
    black: "piano-hl-blue-black",
    whiteActive: "piano-active-blue",
    blackActive: "piano-active-blue-black",
  },
  5: {
    white: "piano-hl-cyan",
    black: "piano-hl-cyan-black",
    whiteActive: "piano-active-cyan",
    blackActive: "piano-active-cyan-black",
  },
  6: {
    white: "piano-hl-teal",
    black: "piano-hl-teal-black",
    whiteActive: "piano-active-teal",
    blackActive: "piano-active-teal-black",
  },
  7: {
    white: "piano-hl-emerald",
    black: "piano-hl-emerald-black",
    whiteActive: "piano-active-emerald",
    blackActive: "piano-active-emerald-black",
  },
  8: {
    white: "piano-hl-lime",
    black: "piano-hl-lime-black",
    whiteActive: "piano-active-lime",
    blackActive: "piano-active-lime-black",
  },
  9: {
    white: "piano-hl-violet",
    black: "piano-hl-violet-black",
    whiteActive: "piano-active-violet",
    blackActive: "piano-active-violet-black",
  },
  10: {
    white: "piano-hl-fuchsia",
    black: "piano-hl-fuchsia-black",
    whiteActive: "piano-active-fuchsia",
    blackActive: "piano-active-fuchsia-black",
  },
  11: {
    white: "piano-hl-sky",
    black: "piano-hl-sky-black",
    whiteActive: "piano-active-sky",
    blackActive: "piano-active-sky-black",
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function buildPianoKeys(
  startOctave: number,
  octaveCount: number,
): {
  whiteKeys: PianoNote[];
  blackKeys: (PianoNote & { offsetPct: number })[];
} {
  const whiteKeys: PianoNote[] = [];
  const blackKeys: (PianoNote & { offsetPct: number })[] = [];

  for (let o = 0; o < octaveCount; o++) {
    const octave = startOctave + o;

    // White keys
    for (const pc of WHITE_KEY_NOTES) {
      const midi = (octave + 1) * 12 + pc;
      whiteKeys.push({
        note: NOTE_NAMES_SHARP[pc],
        octave,
        midi,
        pitchClass: pc,
        isBlack: false,
      });
    }

    // Black keys
    for (const { pc, offsetPct } of BLACK_KEY_POSITIONS) {
      const midi = (octave + 1) * 12 + pc;
      blackKeys.push({
        note: NOTE_NAMES_SHARP[pc],
        octave,
        midi,
        pitchClass: pc,
        isBlack: true,
        offsetPct: offsetPct + o * 100,
      });
    }
  }

  return { whiteKeys, blackKeys };
}

// ---------------------------------------------------------------------------
// WhiteKey — memo'd
// ---------------------------------------------------------------------------
interface WhiteKeyProps {
  noteData: PianoNote;
  isHighlighted: boolean;
  isActive: boolean;
  toneLabel: string | undefined;
  onKeyClick?: (note: PianoNote) => void;
}

const WhiteKey = React.memo(function WhiteKey({
  noteData,
  isHighlighted,
  isActive,
  toneLabel,
  onKeyClick,
}: WhiteKeyProps) {
  const handleClick = React.useCallback(
    () => onKeyClick?.(noteData),
    [onKeyClick, noteData],
  );

  const hlColor = HIGHLIGHT_COLORS[noteData.pitchClass];

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`${noteData.note}${noteData.octave}`}
      data-midi={noteData.midi}
      data-note={noteData.note}
      data-pitch-class={noteData.pitchClass}
      className={cn(
        "piano-white-key",
        isHighlighted && !isActive && hlColor?.white,
        isActive && hlColor?.whiteActive,
      )}
    >
      <span className="piano-white-key-label">
        <span className="font-medium">{noteData.note}</span>
        <span className="text-[9px] opacity-60">{noteData.octave}</span>
        {isHighlighted && toneLabel ? (
          <span className="piano-tone-label">{toneLabel}</span>
        ) : null}
      </span>
    </button>
  );
});

// ---------------------------------------------------------------------------
// BlackKey — memo'd
// ---------------------------------------------------------------------------
interface BlackKeyProps {
  noteData: PianoNote & { offsetPct: number };
  isHighlighted: boolean;
  isActive: boolean;
  toneLabel: string | undefined;
  totalOctaves: number;
  onKeyClick?: (note: PianoNote) => void;
}

const BlackKey = React.memo(function BlackKey({
  noteData,
  isHighlighted,
  isActive,
  toneLabel,
  totalOctaves,
  onKeyClick,
}: BlackKeyProps) {
  const handleClick = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onKeyClick?.(noteData);
    },
    [onKeyClick, noteData],
  );

  const hlColor = HIGHLIGHT_COLORS[noteData.pitchClass];

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`${noteData.note}${noteData.octave}`}
      data-midi={noteData.midi}
      data-note={noteData.note}
      data-pitch-class={noteData.pitchClass}
      className={cn(
        "piano-black-key",
        isHighlighted && !isActive && hlColor?.black,
        isActive && hlColor?.blackActive,
      )}
      style={{
        left: `${noteData.offsetPct / totalOctaves}%`,
        width: `${7.2 / totalOctaves}%`,
      }}
    >
      <span className="piano-black-key-label">
        <span className="font-medium">{noteData.note}</span>
        {isHighlighted && toneLabel ? (
          <span className="piano-tone-label-black">{toneLabel}</span>
        ) : null}
      </span>
    </button>
  );
});

// ---------------------------------------------------------------------------
// Piano — main component
// ---------------------------------------------------------------------------

const PianoBase = React.forwardRef<HTMLDivElement, PianoProps>(
  (
    {
      className,
      startOctave = 2,
      octaveCount = 3,
      highlightedPitchClasses = [],
      highlightedToneLabels,
      activeNote = null,
      enableLiveMic = true,
      onLivePitchFrame,
      liveMicOptions,
      liveMicSwitchLockCount = 4,
      liveMicConfidenceThreshold = 0.86,
      onKeyClick,
      ...props
    },
    ref,
  ) => {
    // DOM refs for live mic — no React state
    const rootRef = React.useRef<HTMLDivElement | null>(null);
    const liveActiveElsRef = React.useRef<HTMLElement[]>([]);
    const livePreviewElsRef = React.useRef<HTMLElement[]>([]);
    const lastLiveMidiRef = React.useRef<number | null>(null);
    const switchCandidateMidiRef = React.useRef<number | null>(null);
    const switchCandidateCountRef = React.useRef(0);

    // ── Pre-computed key data ─────────────────────────────────────────────
    const { whiteKeys, blackKeys } = React.useMemo(
      () => buildPianoKeys(startOctave, octaveCount),
      [startOctave, octaveCount],
    );

    const normalizedHighlights = React.useMemo(
      () => new Set(highlightedPitchClasses.map((pc) => ((pc % 12) + 12) % 12)),
      [highlightedPitchClasses],
    );

    // ── Live mic callbacks (DOM only) ─────────────────────────────────────
    const clearLiveMarkers = React.useCallback(() => {
      if (
        liveActiveElsRef.current.length === 0 &&
        livePreviewElsRef.current.length === 0
      )
        return;
      liveActiveElsRef.current.forEach((el) => {
        el.classList.remove("piano-live-note", "piano-live-note-shake");
      });
      livePreviewElsRef.current.forEach((el) => {
        el.classList.remove("piano-live-note-unstable");
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
        el.classList.remove("piano-live-note-unstable");
      });
      const matched = rootRef.current.querySelectorAll<HTMLElement>(
        `button[data-midi="${midi}"]`,
      );
      if (!matched.length) {
        livePreviewElsRef.current = [];
        return;
      }
      matched.forEach((el) => el.classList.add("piano-live-note-unstable"));
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
            el.classList.remove("piano-live-note-unstable");
          });
          livePreviewElsRef.current = [];
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

        matched.forEach((el) => {
          el.classList.add("piano-live-note", "piano-live-note-shake");
        });

        onLivePitchFrame?.(frame);
        livePreviewElsRef.current.forEach((el) => {
          el.classList.remove("piano-live-note-unstable");
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
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
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
                ? "Listening... play a note to see it highlighted on the keyboard"
                : "Mic off"}
            </span>
            {error ? (
              <span className="text-destructive text-xs">
                Mic error: {error}
              </span>
            ) : null}
          </div>
        ) : null}

        {/* Piano keyboard container */}
        <div
          className="piano-keyboard"
          style={{ minWidth: `${octaveCount * 220}px` }}
        >
          {/* White keys layer */}
          <div className="piano-white-keys">
            {whiteKeys.map((key) => (
              <WhiteKey
                key={key.midi}
                noteData={key}
                isHighlighted={normalizedHighlights.has(key.pitchClass)}
                isActive={activeNote?.midi === key.midi}
                toneLabel={highlightedToneLabels?.[key.pitchClass]}
                onKeyClick={onKeyClick}
              />
            ))}
          </div>

          {/* Black keys layer (absolutely positioned) */}
          <div className="piano-black-keys">
            {blackKeys.map((key) => (
              <BlackKey
                key={key.midi}
                noteData={key}
                isHighlighted={normalizedHighlights.has(key.pitchClass)}
                isActive={activeNote?.midi === key.midi}
                toneLabel={highlightedToneLabels?.[key.pitchClass]}
                totalOctaves={octaveCount}
                onKeyClick={onKeyClick}
              />
            ))}
          </div>
        </div>
      </div>
    );
  },
);

PianoBase.displayName = "Piano";

/**
 * Piano keyboard component, wrapped with React.memo.
 *
 * Performance model:
 * - memo(Piano): skips re-render when parent re-renders with same props
 * - Key data computed once per octave range change (useMemo)
 * - WhiteKey / BlackKey (memo): only keys that change active/highlight re-render
 * - Live mic updates: pure DOM class manipulation, zero React reconciliation
 */
export const Piano = React.memo(PianoBase);
