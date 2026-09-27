// ════════════════════════════════════════════════════════
// FingerpickingDialog – Dialog to visualize fingerpicking patterns
// ════════════════════════════════════════════════════════
//
// Shows:
// 1. Right-hand finger-to-string assignment (p, i, m, a)
// 2. Common fingerpicking patterns with animated step highlight
// 3. Works for both guitar (6 strings) and ukulele (4 strings)

import { memo, useState, useEffect, useRef, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "~/templates/components/ui/dialog";
import {
  type FingerpickingPattern,
  type FingerAssignment,
  type RHFinger,
  FINGER_COLORS,
  GUITAR_PATTERNS,
  UKULELE_PATTERNS,
  getGuitarFingerAssignment,
  getUkuleleFingerAssignment,
  resolvePatternForVoicing,
} from "../lib/fingerpicking-patterns";

// ── Types ──────────────────────────────────────────────

interface FingerpickingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chordName: string;
  frets: number[];
  instrument: "guitar" | "ukulele";
}

// ── Main Dialog ────────────────────────────────────────

export const FingerpickingDialog = memo(function FingerpickingDialog({
  open,
  onOpenChange,
  chordName,
  frets,
  instrument,
}: FingerpickingDialogProps) {
  const isGuitar = instrument === "guitar";
  const assignments = isGuitar
    ? getGuitarFingerAssignment(frets)
    : getUkuleleFingerAssignment(frets);
  const patterns = isGuitar ? GUITAR_PATTERNS : UKULELE_PATTERNS;

  const [selectedPatternId, setSelectedPatternId] = useState(patterns[0]?.id);
  const selectedPattern =
    patterns.find((p) => p.id === selectedPatternId) ?? patterns[0];
  const resolvedPattern = selectedPattern
    ? resolvePatternForVoicing(selectedPattern, frets)
    : null;

  const stringLabels = isGuitar
    ? ["E", "A", "D", "G", "B", "e"]
    : ["G", "C", "E", "A"];
  const numStrings = stringLabels.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-md overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-mono">
            <FingerPickIcon className="size-5 text-primary" />
            Fingerpicking – {chordName}
          </DialogTitle>
          <DialogDescription>
            Pola petikan jari kanan untuk chord {chordName} (
            {isGuitar ? "Gitar" : "Ukulele"})
          </DialogDescription>
        </DialogHeader>

        {/* ── Finger Assignment Map ────────────────── */}
        <section>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Penempatan Jari Kanan
          </h3>
          <FingerAssignmentVisual
            assignments={assignments}
            frets={frets}
            stringLabels={stringLabels}
            numStrings={numStrings}
          />
        </section>

        {/* ── Pattern Selector ─────────────────────── */}
        <section>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Pola Petikan
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {patterns.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPatternId(p.id)}
                className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                  selectedPatternId === p.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
          {selectedPattern && (
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              {selectedPattern.description}
              <span className="ml-2 font-mono text-[10px] text-primary">
                {selectedPattern.timeSignature}
              </span>
            </p>
          )}
        </section>

        {/* ── Pattern Visualization ────────────────── */}
        {resolvedPattern && (
          <section>
            <PatternTimeline
              pattern={resolvedPattern}
              frets={frets}
              stringLabels={stringLabels}
              numStrings={numStrings}
            />
          </section>
        )}

        {/* ── Legend ────────────────────────────────── */}
        <section className="flex flex-wrap gap-3 rounded-lg border border-border bg-muted/30 p-3">
          {(["p", "i", "m", "a"] as RHFinger[]).map((f) => (
            <div key={f} className="flex items-center gap-1.5">
              <span
                className="flex size-5 items-center justify-center rounded-full text-[10px] font-bold"
                style={{
                  backgroundColor: FINGER_COLORS[f].bg,
                  color: FINGER_COLORS[f].text,
                }}
              >
                {f}
              </span>
              <span className="text-[11px] text-muted-foreground">
                {FINGER_COLORS[f].label}
              </span>
            </div>
          ))}
        </section>
      </DialogContent>
    </Dialog>
  );
});

// ── Finger Assignment Visual ───────────────────────────

function FingerAssignmentVisual({
  assignments,
  frets,
  stringLabels,
  numStrings,
}: {
  assignments: FingerAssignment[];
  frets: number[];
  stringLabels: string[];
  numStrings: number;
}) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto py-2">
      {Array.from({ length: numStrings }, (_, i) => {
        const isMuted = frets[i] === -1;
        const assignment = assignments.find((a) => a.stringIndex === i);

        return (
          <div
            key={i}
            className={`flex flex-col items-center gap-1 rounded-lg border px-3 py-2 transition-colors ${
              isMuted
                ? "border-dashed border-muted-foreground/20 bg-muted/20 opacity-40"
                : "border-border bg-card"
            }`}
          >
            {/* String label */}
            <span className="font-mono text-xs font-bold text-foreground">
              {stringLabels[i]}
            </span>

            {/* String line */}
            <div
              className={`h-8 w-px ${isMuted ? "bg-muted-foreground/20" : "bg-muted-foreground/50"}`}
            />

            {/* Finger badge */}
            {assignment && !isMuted ? (
              <span
                className="flex size-6 items-center justify-center rounded-full text-xs font-bold"
                style={{
                  backgroundColor: FINGER_COLORS[assignment.finger].bg,
                  color: FINGER_COLORS[assignment.finger].text,
                }}
              >
                {assignment.finger}
              </span>
            ) : (
              <span className="flex size-6 items-center justify-center text-xs text-muted-foreground">
                {isMuted ? "×" : "–"}
              </span>
            )}

            {/* Fret label */}
            <span className="font-mono text-[10px] text-muted-foreground">
              {frets[i] === -1
                ? "mute"
                : frets[i] === 0
                  ? "open"
                  : `fret ${frets[i]}`}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ── Pattern Timeline ───────────────────────────────────

function PatternTimeline({
  pattern,
  frets,
  stringLabels,
  numStrings,
}: {
  pattern: FingerpickingPattern;
  frets: number[];
  stringLabels: string[];
  numStrings: number;
}) {
  const [activeStep, setActiveStep] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const play = useCallback(() => {
    setIsPlaying(true);
    setActiveStep(0);
  }, []);

  const stop = useCallback(() => {
    setIsPlaying(false);
    setActiveStep(-1);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    const bpm = 90; // moderate tempo
    const msPerBeat = (60 / bpm) * 1000;
    // Each step gets a sub-beat duration
    const msPerStep = msPerBeat / 2;

    timerRef.current = setInterval(() => {
      setActiveStep((prev) => {
        const next = prev + 1;
        if (next >= pattern.steps.length) return 0; // loop
        return next;
      });
    }, msPerStep);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, pattern.steps.length]);

  return (
    <div className="space-y-3">
      {/* Play/Stop button */}
      <div className="flex items-center gap-2">
        <button
          onClick={isPlaying ? stop : play}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
            isPlaying
              ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          }`}
        >
          {isPlaying ? (
            <>
              <StopIcon className="size-3" /> Stop
            </>
          ) : (
            <>
              <PlayIcon className="size-3" /> Preview Animasi
            </>
          )}
        </button>
        <span className="font-mono text-[10px] text-muted-foreground">
          {pattern.timeSignature} · {pattern.steps.length} langkah
        </span>
      </div>

      {/* Grid: strings × steps */}
      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <table className="w-full text-center">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="px-2 py-1.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                String
              </th>
              {pattern.steps.map((step, si) => (
                <th
                  key={si}
                  className={`px-1.5 py-1.5 text-[10px] font-mono font-semibold transition-colors ${
                    activeStep === si
                      ? "bg-primary/20 text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {step.beat}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Render each string row (from highest to lowest, like tab notation) */}
            {Array.from({ length: numStrings }, (_, rawIdx) => {
              const stringIdx = numStrings - 1 - rawIdx; // Reverse: highest string first
              const isMuted = frets[stringIdx] === -1;

              return (
                <tr
                  key={stringIdx}
                  className={`border-b border-border/50 last:border-b-0 ${
                    isMuted ? "opacity-30" : ""
                  }`}
                >
                  <td className="px-2 py-1 text-left">
                    <span className="font-mono text-xs font-bold text-foreground">
                      {stringLabels[stringIdx]}
                    </span>
                  </td>
                  {pattern.steps.map((step, si) => {
                    const pluckIdx = step.strings.indexOf(stringIdx);
                    const isPlucked = pluckIdx >= 0;
                    const finger = isPlucked ? step.fingers[pluckIdx] : null;
                    const isActive = activeStep === si;

                    return (
                      <td
                        key={si}
                        className={`px-1.5 py-1 transition-all duration-150 ${
                          isActive ? "bg-primary/10" : ""
                        }`}
                      >
                        {isPlucked && finger ? (
                          <span
                            className={`inline-flex size-5 items-center justify-center rounded-full text-[10px] font-bold transition-transform ${
                              isActive ? "scale-125 ring-2 ring-primary/50" : ""
                            }`}
                            style={{
                              backgroundColor: FINGER_COLORS[finger].bg,
                              color: FINGER_COLORS[finger].text,
                            }}
                          >
                            {finger}
                          </span>
                        ) : (
                          <span className="inline-block size-5 text-muted-foreground/30">
                            ·
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Step-by-step text */}
      <div className="flex flex-wrap gap-1">
        {pattern.steps.map((step, si) => (
          <span
            key={si}
            className={`inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 font-mono text-[10px] transition-colors ${
              activeStep === si
                ? "bg-primary text-primary-foreground"
                : "bg-muted/50 text-muted-foreground"
            }`}
          >
            <span className="font-semibold">{step.beat}:</span>
            {step.fingers.map((f, fi) => (
              <span
                key={fi}
                className="font-bold"
                style={{
                  color: activeStep === si ? undefined : FINGER_COLORS[f].bg,
                }}
              >
                {f}
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Icons ──────────────────────────────────────────────

function FingerPickIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Hand/pick icon */}
      <path d="M12 2C8 2 6 5 6 8c0 2 1 3 2 4l1 1v7a2 2 0 004 0v-4l2 2a2 2 0 002.83-2.83L14 11.34V8c0-3-2-6-2-6z" />
      <path d="M9 12v8" />
    </svg>
  );
}

export function FingerPickTriggerIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18 11V6a2 2 0 00-2-2 2 2 0 00-2 2" />
      <path d="M14 10V4a2 2 0 00-2-2 2 2 0 00-2 2v6" />
      <path d="M10 10.5V6a2 2 0 00-2-2 2 2 0 00-2 2v8" />
      <path d="M18 8a2 2 0 012 2v7.5a5.5 5.5 0 01-11 0V14" />
    </svg>
  );
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M8 5.14v14l11-7-11-7z" />
    </svg>
  );
}

function StopIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <rect x="6" y="6" width="12" height="12" rx="1" />
    </svg>
  );
}
