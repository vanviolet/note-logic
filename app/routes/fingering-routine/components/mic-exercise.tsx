// ════════════════════════════════════════════════════════
// Mic Exercise – Live pitch detection with instrument visual
// ════════════════════════════════════════════════════════
//
// Uses useLiveGuitarPitch to detect played notes and
// compares them against the expected exercise sequence.
// Shows Fretboard (guitar) or Piano (piano) with the
// expected note highlighted. Wrong notes trigger a red
// flash + shake effect. Notes must be played in sequence.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, Mic, MicOff, RotateCcw, Trophy, X } from "lucide-react";
import { Button } from "~/templates/components/ui/button";
import { Progress } from "~/templates/components/ui/progress";
import { cn } from "~/templates/lib/utils";
import { Fretboard } from "~/templates/components/custom/fretboard";
import { Piano } from "~/templates/components/custom/piano";
import { useLiveGuitarPitch, type LivePitchFrame } from "~/templates/hooks";
import type { Exercise, ExerciseNote, MicMatchResult } from "../types";

// ── Constants ──────────────────────────────────────────

const CENTS_TOLERANCE = 50;
const MIN_CONFIDENCE = 0.3;
const HOLD_DURATION_MS = 250;
const WRONG_FLASH_MS = 500;

// ── Finger colours ─────────────────────────────────────

const GUITAR_FINGER_COLORS: Record<number, string> = {
  0: "bg-zinc-400/80",
  1: "bg-blue-500",
  2: "bg-emerald-500",
  3: "bg-amber-500",
  4: "bg-rose-500",
};

const PIANO_FINGER_COLORS: Record<number, string> = {
  1: "bg-blue-500",
  2: "bg-emerald-500",
  3: "bg-amber-500",
  4: "bg-rose-500",
  5: "bg-violet-500",
};

const GUITAR_FINGER_LABELS: Record<number, string> = {
  0: "Open",
  1: "Index",
  2: "Middle",
  3: "Ring",
  4: "Pinky",
};

const PIANO_FINGER_LABELS: Record<number, string> = {
  1: "Thumb",
  2: "Index",
  3: "Middle",
  4: "Ring",
  5: "Pinky",
};

// ── Props ──────────────────────────────────────────────

interface MicExerciseProps {
  exercise: Exercise;
  onMatchIndex?: (index: number) => void;
}

export function MicExercise({ exercise, onMatchIndex }: MicExerciseProps) {
  const isGuitar = exercise.instrument === "guitar";
  const fingerColors = isGuitar ? GUITAR_FINGER_COLORS : PIANO_FINGER_COLORS;
  const fingerLabels = isGuitar ? GUITAR_FINGER_LABELS : PIANO_FINGER_LABELS;

  const [expectedIndex, setExpectedIndex] = useState(0);
  const [results, setResults] = useState<MicMatchResult[]>([]);
  const [currentFrame, setCurrentFrame] = useState<LivePitchFrame | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [wrongFlash, setWrongFlash] = useState(false);

  const holdStartRef = useRef<number | null>(null);
  const holdMidiRef = useRef<number | null>(null);
  const wrongCooldownRef = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const expectedNote = exercise.notes[expectedIndex] as
    | ExerciseNote
    | undefined;

  // ── Derived visual data ──────────────────────────────

  const highlightedPitchClasses = useMemo(
    () => [...new Set(exercise.notes.map((n) => n.pitchClass))],
    [exercise.notes],
  );

  const guitarActiveNote = useMemo(() => {
    if (!isGuitar || !expectedNote) return null;
    if (
      expectedNote.stringIndex === undefined ||
      expectedNote.fret === undefined
    )
      return null;
    return { stringIndex: expectedNote.stringIndex, fret: expectedNote.fret };
  }, [isGuitar, expectedNote]);

  const pianoActiveNote = useMemo(() => {
    if (isGuitar || !expectedNote) return null;
    return { midi: expectedNote.midi };
  }, [isGuitar, expectedNote]);

  const guitarFretCount = useMemo(() => {
    if (!isGuitar) return 12;
    const maxFret = Math.max(...exercise.notes.map((n) => n.fret ?? 0));
    return Math.max(maxFret + 3, 5);
  }, [isGuitar, exercise.notes]);

  const pianoRange = useMemo(() => {
    if (isGuitar) return { startOctave: 3, octaveCount: 2 };
    const midis = exercise.notes.map((n) => n.midi);
    const minMidi = Math.min(...midis);
    const maxMidi = Math.max(...midis);
    const startOctave = Math.max(0, Math.floor(minMidi / 12) - 2);
    const endOctave = Math.floor(maxMidi / 12) - 1 + 1;
    const octaveCount = Math.max(2, endOctave - startOctave + 1);
    return { startOctave, octaveCount: Math.min(octaveCount, 4) };
  }, [isGuitar, exercise.notes]);

  // ── Pitch matching callback ──────────────────────────

  const onPitchFrame = useCallback(
    (frame: LivePitchFrame | null) => {
      setCurrentFrame(frame);

      if (!expectedNote || isComplete) return;
      if (!frame || frame.confidence < MIN_CONFIDENCE) {
        holdStartRef.current = null;
        holdMidiRef.current = null;
        return;
      }

      const detectedMidi = Math.round(frame.midi);
      const expectedMidi = expectedNote.midi;
      const centsDiff = Math.abs(frame.cents);
      const isCorrectMidi =
        detectedMidi === expectedMidi && centsDiff <= CENTS_TOLERANCE;

      // Track hold duration for the same MIDI
      if (isCorrectMidi) {
        if (holdMidiRef.current === detectedMidi) {
          const holdDuration =
            frame.timestamp - (holdStartRef.current ?? frame.timestamp);
          if (holdDuration >= HOLD_DURATION_MS) {
            // Note confirmed!
            const result: MicMatchResult = {
              expected: expectedNote,
              detected: {
                note: frame.note + frame.octave,
                midi: detectedMidi,
                cents: frame.cents,
                confidence: frame.confidence,
              },
              isCorrect: true,
              timestamp: frame.timestamp,
            };

            setResults((prev) => [...prev, result]);
            onMatchIndex?.(expectedIndex);

            const nextIndex = expectedIndex + 1;
            if (nextIndex >= exercise.notes.length) {
              setIsComplete(true);
            } else {
              setExpectedIndex(nextIndex);
            }

            holdStartRef.current = null;
            holdMidiRef.current = null;
          }
        } else {
          holdStartRef.current = frame.timestamp;
          holdMidiRef.current = detectedMidi;
        }
      } else {
        // Wrong note — trigger visual flash on cooldown
        if (!wrongCooldownRef.current) {
          setWrongFlash(true);
          wrongCooldownRef.current = true;
          setTimeout(() => {
            setWrongFlash(false);
            wrongCooldownRef.current = false;
          }, WRONG_FLASH_MS);
        }
        holdStartRef.current = null;
        holdMidiRef.current = null;
      }
    },
    [
      expectedIndex,
      expectedNote,
      exercise.notes.length,
      isComplete,
      onMatchIndex,
    ],
  );

  // ── Pitch hook ───────────────────────────────────────

  const {
    isStarting,
    isListening,
    error: micError,
    start,
    stop,
  } = useLiveGuitarPitch({ onPitchFrame });

  // Reset when exercise changes
  useEffect(() => {
    setExpectedIndex(0);
    setResults([]);
    setIsComplete(false);
    setWrongFlash(false);
    holdStartRef.current = null;
    holdMidiRef.current = null;
  }, [exercise.id]);

  // Cleanup on unmount
  useEffect(() => () => stop(), [stop]);

  // Auto-scroll note strip
  useEffect(() => {
    if (!scrollRef.current) return;
    const el = scrollRef.current.children[expectedIndex] as
      | HTMLElement
      | undefined;
    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [expectedIndex]);

  const reset = useCallback(() => {
    setExpectedIndex(0);
    setResults([]);
    setIsComplete(false);
    setWrongFlash(false);
    holdStartRef.current = null;
    holdMidiRef.current = null;
  }, []);

  // ── Accuracy calc ────────────────────────────────────

  const correctCount = results.filter((r) => r.isCorrect).length;
  const progress = (correctCount / exercise.notes.length) * 100;

  const hasDetection =
    currentFrame !== null && currentFrame.confidence >= MIN_CONFIDENCE;
  const detectedIsCorrect =
    hasDetection &&
    expectedNote !== undefined &&
    Math.round(currentFrame!.midi) === expectedNote.midi;

  // ── Render ───────────────────────────────────────────

  return (
    <div className="flex flex-col gap-4">
      {/* ── Mic Toggle ─────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant={isListening ? "destructive" : "default"}
            size="sm"
            onClick={() => (isListening ? stop() : start())}
            disabled={isStarting}
            className="gap-1.5"
          >
            {isListening ? (
              <>
                <MicOff className="size-3.5" />
                Stop Mic
              </>
            ) : (
              <>
                <Mic className="size-3.5" />
                {isStarting ? "Starting…" : "Start Mic"}
              </>
            )}
          </Button>
          {isListening && !isComplete && (
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[10px] text-muted-foreground">
                Listening
              </span>
            </span>
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={reset}
          className="gap-1 text-xs"
        >
          <RotateCcw className="size-3" />
          Reset
        </Button>
      </div>

      {micError && <p className="text-xs text-destructive">{micError}</p>}

      {/* ── Instrument Visual ──────────────────────── */}
      {!isComplete && (
        <div
          className={cn(
            "rounded-xl border bg-card/60 p-3 backdrop-blur-sm overflow-x-auto transition-all duration-200",
            wrongFlash
              ? "border-red-500/70 shadow-lg shadow-red-500/20 animate-wrong-shake"
              : "border-border/50",
          )}
        >
          {/* Expected note indicator bar */}
          {isListening && expectedNote && (
            <div className="mb-2 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground uppercase tracking-wider text-[10px]">
                  Mainkan:
                </span>
                <span className="font-black text-primary tabular-nums text-sm">
                  {expectedNote.note}
                </span>
                <span className="text-muted-foreground text-[10px]">
                  (Jari {expectedNote.finger})
                </span>
              </div>
              {hasDetection && (
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground text-[10px]">
                    Terdeteksi:
                  </span>
                  <span
                    className={cn(
                      "font-bold tabular-nums text-sm",
                      detectedIsCorrect ? "text-emerald-500" : "text-red-500",
                    )}
                  >
                    {currentFrame!.note}
                    {currentFrame!.octave}
                  </span>
                  {wrongFlash && <X className="size-3.5 text-red-500" />}
                </div>
              )}
            </div>
          )}

          {isGuitar ? (
            <Fretboard
              fretCount={guitarFretCount}
              highlightedPitchClasses={highlightedPitchClasses}
              activeNote={guitarActiveNote}
              editableTuning={false}
              showOpenLabel
            />
          ) : (
            <Piano
              startOctave={pianoRange.startOctave}
              octaveCount={pianoRange.octaveCount}
              highlightedPitchClasses={highlightedPitchClasses}
              activeNote={pianoActiveNote}
            />
          )}
        </div>
      )}

      {/* ── Note Sequence Strip ─────────────────────── */}
      <div className="rounded-xl border border-border/50 bg-card/60 p-2 backdrop-blur-sm">
        <div
          ref={scrollRef}
          className="flex gap-1 overflow-x-auto pb-1 scrollbar-thin"
        >
          {exercise.notes.map((note, idx) => {
            const result = results[idx];
            const isCurrent = idx === expectedIndex && !isComplete;
            const color = fingerColors[note.finger] ?? "bg-muted";

            return (
              <div
                key={idx}
                className={cn(
                  "flex flex-col items-center gap-0.5 rounded-lg border px-2 py-1.5 transition-all duration-150 shrink-0 min-w-11",
                  result?.isCorrect
                    ? "border-emerald-500 bg-emerald-500/10"
                    : isCurrent
                      ? "border-primary bg-primary/10 shadow-md shadow-primary/20 ring-2 ring-primary/40"
                      : "border-border/30 bg-background/50",
                )}
              >
                {result?.isCorrect ? (
                  <CheckCircle2 className="size-3.5 text-emerald-500" />
                ) : (
                  <span
                    className={cn(
                      "text-xs font-bold tabular-nums",
                      isCurrent ? "text-primary" : "text-foreground/60",
                    )}
                  >
                    {note.note}
                  </span>
                )}
                <span
                  className={cn(
                    "flex size-4 items-center justify-center rounded-full text-[8px] font-bold text-white",
                    result?.isCorrect ? "bg-emerald-500" : color,
                  )}
                  title={fingerLabels[note.finger]}
                >
                  {result?.isCorrect ? "✓" : note.finger}
                </span>
              </div>
            );
          })}
        </div>

        {/* Finger Legend */}
        <div className="mt-1.5 flex flex-wrap gap-2 border-t border-border/30 pt-1.5">
          {Object.entries(fingerColors).map(([finger, color]) => (
            <div key={finger} className="flex items-center gap-1">
              <span
                className={cn(
                  "flex size-3 items-center justify-center rounded-full text-[7px] font-bold text-white",
                  color,
                )}
              >
                {finger}
              </span>
              <span className="text-[9px] text-muted-foreground">
                {fingerLabels[Number(finger)]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Progress Bar ───────────────────────────── */}
      <div className="flex items-center gap-3">
        <Progress value={progress} className="flex-1 h-2" />
        <span className="text-xs text-muted-foreground tabular-nums">
          {correctCount}/{exercise.notes.length}
        </span>
      </div>

      {/* ── Complete State ──────────────────────────── */}
      {isComplete && (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-6 text-center">
          <Trophy className="size-10 text-amber-500" />
          <div>
            <h3 className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
              Selesai! 🎉
            </h3>
            <p className="text-sm text-muted-foreground">
              Akurasi:{" "}
              {((correctCount / exercise.notes.length) * 100).toFixed(0)}%
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={reset} className="gap-1">
            <RotateCcw className="size-3.5" />
            Ulangi
          </Button>
        </div>
      )}
    </div>
  );
}
