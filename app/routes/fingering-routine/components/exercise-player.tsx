// ════════════════════════════════════════════════════════
// Exercise Player – Playback, notation vis, tempo control
// ════════════════════════════════════════════════════════
//
// Shows a note sequence visually with finger indicators,
// animated playback cursor, tempo slider, play/stop/loop.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Lightbulb,
  Loader2,
  Pause,
  Play,
  Repeat,
  Volume2,
  VolumeOff,
} from "lucide-react";
import { Button } from "~/templates/components/ui/button";
import { Slider } from "~/templates/components/ui/slider";
import { Badge } from "~/templates/components/ui/badge";
import { cn } from "~/templates/lib/utils";
import { Fretboard } from "~/templates/components/custom/fretboard";
import { Piano } from "~/templates/components/custom/piano";
import type { Exercise } from "../types";
import { useExerciseAudio } from "../hooks/use-exercise-audio";

// ── Finger colours ─────────────────────────────────────

const GUITAR_FINGER_COLORS: Record<number, string> = {
  0: "bg-zinc-400/80", // open
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

interface ExercisePlayerProps {
  exercise: Exercise;
  /** If provided, mic-matched note index highlights green */
  micMatchIndex?: number;
}

export function ExercisePlayer({
  exercise,
  micMatchIndex,
}: ExercisePlayerProps) {
  const isGuitar = exercise.instrument === "guitar";
  const fingerColors = isGuitar ? GUITAR_FINGER_COLORS : PIANO_FINGER_COLORS;
  const fingerLabels = isGuitar ? GUITAR_FINGER_LABELS : PIANO_FINGER_LABELS;

  // ── State ────────────────────────────────────────────
  const [bpm, setBpm] = useState(exercise.defaultBpm);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [loop, setLoop] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [muted, setMuted] = useState(false);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);

  const audio = useExerciseAudio(exercise.instrument);

  // ── Derived visual data ──────────────────────────────

  const highlightedPitchClasses = useMemo(
    () => [...new Set(exercise.notes.map((n) => n.pitchClass))],
    [exercise.notes],
  );

  /** Fretboard active note (guitar) */
  const guitarActiveNote = useMemo(() => {
    if (!isGuitar || currentIndex < 0) return null;
    const note = exercise.notes[currentIndex];
    if (note?.stringIndex === undefined || note?.fret === undefined)
      return null;
    return { stringIndex: note.stringIndex, fret: note.fret };
  }, [isGuitar, currentIndex, exercise.notes]);

  /** Piano active note */
  const pianoActiveNote = useMemo(() => {
    if (isGuitar || currentIndex < 0) return null;
    const note = exercise.notes[currentIndex];
    if (!note) return null;
    return { midi: note.midi };
  }, [isGuitar, currentIndex, exercise.notes]);

  /** Max fret used (for guitar fret count) */
  const guitarFretCount = useMemo(() => {
    if (!isGuitar) return 12;
    const maxFret = Math.max(...exercise.notes.map((n) => n.fret ?? 0));
    return Math.max(maxFret + 3, 5);
  }, [isGuitar, exercise.notes]);

  /** Piano octave range */
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

  // ── Playback ─────────────────────────────────────────

  const stop = useCallback(() => {
    setIsPlaying(false);
    setCurrentIndex(-1);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  // Reset when exercise changes
  useEffect(() => {
    stop();
    setBpm(exercise.defaultBpm);
    setCurrentIndex(-1);
    setShowTips(false);
  }, [exercise.id, stop]);

  const playSequence = useCallback(async () => {
    const ok = await audio.ensureReady();
    if (!ok) return;

    setIsPlaying(true);
    const notes = exercise.notes;
    const beatDuration = 60 / bpm;

    let i = 0;

    const scheduleNext = () => {
      if (i >= notes.length) {
        if (loop) {
          i = 0;
        } else {
          stop();
          return;
        }
      }

      const note = notes[i];
      setCurrentIndex(i);

      if (!muted) {
        audio.playNote(note.note, {
          duration: note.duration * beatDuration * 0.9,
        });
      }

      const delay = note.duration * beatDuration * 1000;
      i++;
      timeoutRef.current = setTimeout(scheduleNext, delay);
    };

    scheduleNext();
  }, [audio, bpm, exercise.notes, loop, muted, stop]);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      stop();
    } else {
      playSequence();
    }
  }, [isPlaying, stop, playSequence]);

  // ── Clean up on unmount ──────────────────────────────
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // ── Note scroll container ────────────────────────────
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentIndex < 0 || !scrollRef.current) return;
    const el = scrollRef.current.children[currentIndex] as
      | HTMLElement
      | undefined;
    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [currentIndex]);

  // ── Render ───────────────────────────────────────────

  return (
    <div className="flex flex-col gap-4">
      {/* ── Header ─────────────────────────────────── */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold">{exercise.name}</h2>
          <p className="text-xs text-muted-foreground">
            {exercise.description}
          </p>
        </div>
        {exercise.tips && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowTips((p) => !p)}
            className={cn("gap-1 text-xs", showTips && "text-amber-500")}
          >
            <Lightbulb className="size-3.5" />
            Tips
          </Button>
        )}
      </div>

      {/* ── Tips ───────────────────────────────────── */}
      {showTips && exercise.tips && (
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-xs text-amber-600 dark:text-amber-400">
          {exercise.tips}
        </div>
      )}

      {/* ── Instrument Visual ──────────────────────── */}
      <div className="rounded-xl border border-border/50 bg-card/60 p-3 backdrop-blur-sm overflow-x-auto">
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

      {/* ── Note Sequence Strip (compact) ──────────── */}
      <div className="rounded-xl border border-border/50 bg-card/60 p-2 backdrop-blur-sm">
        <div
          ref={scrollRef}
          className="flex gap-1 overflow-x-auto pb-1 scrollbar-thin"
        >
          {exercise.notes.map((note, idx) => {
            const isCurrent = idx === currentIndex;
            const isMicMatch = idx === micMatchIndex;
            const color = fingerColors[note.finger] ?? "bg-muted";

            return (
              <div
                key={idx}
                className={cn(
                  "flex flex-col items-center gap-0.5 rounded-lg border px-2 py-1.5 transition-all duration-150 shrink-0 min-w-11",
                  isCurrent
                    ? "border-primary bg-primary/10 shadow-md shadow-primary/20 ring-2 ring-primary/40"
                    : isMicMatch
                      ? "border-emerald-500 bg-emerald-500/10"
                      : "border-border/30 bg-background/50",
                )}
              >
                <span
                  className={cn(
                    "text-xs font-bold tabular-nums",
                    isCurrent ? "text-primary" : "text-foreground",
                  )}
                >
                  {note.note}
                </span>
                <span
                  className={cn(
                    "flex size-4 items-center justify-center rounded-full text-[8px] font-bold text-white",
                    color,
                  )}
                  title={fingerLabels[note.finger]}
                >
                  {note.finger}
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

      {/* ── Controls ───────────────────────────────── */}
      <div className="flex flex-col gap-3 rounded-xl border border-border/50 bg-card/60 p-3 backdrop-blur-sm">
        {/* Transport */}
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={() => setMuted((m) => !m)}
          >
            {muted ? (
              <VolumeOff className="size-4 text-muted-foreground" />
            ) : (
              <Volume2 className="size-4" />
            )}
          </Button>

          <Button
            size="icon"
            className="size-10 rounded-full"
            onClick={togglePlay}
            disabled={audio.isLoading}
          >
            {audio.isLoading ? (
              <Loader2 className="size-5 animate-spin" />
            ) : isPlaying ? (
              <Pause className="size-5" />
            ) : (
              <Play className="size-5 ml-0.5" />
            )}
          </Button>

          <Button
            variant={loop ? "default" : "ghost"}
            size="icon"
            className={cn(
              "size-8",
              loop && "bg-primary/15 text-primary hover:bg-primary/20",
            )}
            onClick={() => setLoop((l) => !l)}
          >
            <Repeat className="size-4" />
          </Button>
        </div>

        {/* Tempo */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground whitespace-nowrap w-12">
            Tempo
          </span>
          <Slider
            min={30}
            max={200}
            step={5}
            value={[bpm]}
            onValueChange={([v]) => setBpm(v)}
            className="flex-1"
          />
          <Badge
            variant="outline"
            className="min-w-14 justify-center tabular-nums text-xs"
          >
            {bpm} BPM
          </Badge>
        </div>

        {/* Progress */}
        {isPlaying && (
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-300"
                style={{
                  width: `${((currentIndex + 1) / exercise.notes.length) * 100}%`,
                }}
              />
            </div>
            <span className="text-[10px] text-muted-foreground tabular-nums">
              {currentIndex + 1}/{exercise.notes.length}
            </span>
          </div>
        )}
      </div>

      {/* ── Loading error ──────────────────────────── */}
      {audio.error && <p className="text-xs text-destructive">{audio.error}</p>}
    </div>
  );
}
