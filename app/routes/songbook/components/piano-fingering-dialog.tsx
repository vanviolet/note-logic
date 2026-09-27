// ════════════════════════════════════════════════════════
// PianoFingeringDialog – Dialog to visualize piano fingering & patterns
// ════════════════════════════════════════════════════════
//
// Shows:
// 1. RH & LH finger assignments on a keyboard visual
// 2. Common piano patterns (block, arpeggio, Alberti bass, etc.)
// 3. Animated pattern preview

import { memo, useState, useEffect, useRef, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "~/templates/components/ui/dialog";
import { NOTE_NAMES_SHARP } from "~/shared/constants/music";
import {
  type PianoFingerAssignment,
  type PianoHand,
  type PianoPattern,
  PIANO_FINGER_COLORS,
  PIANO_PATTERNS,
  getPianoRHFingering,
  getPianoLHFingering,
  resolvePianoPattern,
} from "../lib/piano-fingering";

// ── Constants ──────────────────────────────────────────

const WHITE_PCS = [0, 2, 4, 5, 7, 9, 11];
const BLACK_KEY_INFO: Array<{ pc: number; afterWhite: number }> = [
  { pc: 1, afterWhite: 0 },
  { pc: 3, afterWhite: 1 },
  { pc: 6, afterWhite: 3 },
  { pc: 8, afterWhite: 4 },
  { pc: 10, afterWhite: 5 },
];
const BLACK_PCS = new Set([1, 3, 6, 8, 10]);

// ── Types ──────────────────────────────────────────────

interface PianoFingeringDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chordName: string;
  pitchClasses: number[];
}

// ── Main Dialog ────────────────────────────────────────

export const PianoFingeringDialog = memo(function PianoFingeringDialog({
  open,
  onOpenChange,
  chordName,
  pitchClasses,
}: PianoFingeringDialogProps) {
  const [activeHand, setActiveHand] = useState<PianoHand>("RH");
  const rhFingering = getPianoRHFingering(pitchClasses);
  const lhFingering = getPianoLHFingering(pitchClasses);
  const fingering = activeHand === "RH" ? rhFingering : lhFingering;

  const [selectedPatternId, setSelectedPatternId] = useState(
    PIANO_PATTERNS[0]?.id,
  );
  const selectedPattern =
    PIANO_PATTERNS.find((p) => p.id === selectedPatternId) ?? PIANO_PATTERNS[0];
  const resolvedPattern = selectedPattern
    ? resolvePianoPattern(selectedPattern, pitchClasses)
    : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-md overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-mono">
            <PianoIcon className="size-5 text-primary" />
            Piano Fingering – {chordName}
          </DialogTitle>
          <DialogDescription>
            Penempatan jari dan pola latihan piano untuk chord {chordName}
          </DialogDescription>
        </DialogHeader>

        {/* ── Hand Toggle ──────────────────────────── */}
        <div className="flex gap-1.5">
          {(["RH", "LH"] as PianoHand[]).map((hand) => (
            <button
              key={hand}
              onClick={() => setActiveHand(hand)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                activeHand === hand
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              {hand === "RH" ? "🤚 Tangan Kanan" : "🤚 Tangan Kiri"}
            </button>
          ))}
        </div>

        {/* ── Keyboard Visual ──────────────────────── */}
        <section>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Penempatan Jari ({activeHand === "RH" ? "Kanan" : "Kiri"})
          </h3>
          <KeyboardFingerVisual
            fingering={fingering}
            pitchClasses={pitchClasses}
          />
        </section>

        {/* ── Finger List ──────────────────────────── */}
        <section>
          <div className="flex flex-wrap gap-1.5">
            {fingering.map((f) => (
              <div
                key={`${f.hand}-${f.pitchClass}`}
                className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1.5"
              >
                <span
                  className="flex size-5 items-center justify-center rounded-full text-[10px] font-bold"
                  style={{
                    backgroundColor: PIANO_FINGER_COLORS[f.finger].bg,
                    color: PIANO_FINGER_COLORS[f.finger].text,
                  }}
                >
                  {f.finger}
                </span>
                <span className="font-mono text-xs font-bold text-foreground">
                  {f.noteName}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {PIANO_FINGER_COLORS[f.finger].label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Pattern Selector ─────────────────────── */}
        <section>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Pola Latihan
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {PIANO_PATTERNS.map((p) => (
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

        {/* ── Pattern Timeline ─────────────────────── */}
        {resolvedPattern && (
          <section>
            <PianoPatternTimeline
              pattern={resolvedPattern}
              pitchClasses={pitchClasses}
              fingering={fingering}
            />
          </section>
        )}

        {/* ── Legend ────────────────────────────────── */}
        <section className="flex flex-wrap gap-3 rounded-lg border border-border bg-muted/30 p-3">
          {[1, 2, 3, 4, 5].map((f) => (
            <div key={f} className="flex items-center gap-1.5">
              <span
                className="flex size-5 items-center justify-center rounded-full text-[10px] font-bold"
                style={{
                  backgroundColor: PIANO_FINGER_COLORS[f].bg,
                  color: PIANO_FINGER_COLORS[f].text,
                }}
              >
                {f}
              </span>
              <span className="text-[11px] text-muted-foreground">
                {PIANO_FINGER_COLORS[f].label}
              </span>
            </div>
          ))}
        </section>
      </DialogContent>
    </Dialog>
  );
});

// ── Keyboard Finger Visual ─────────────────────────────

function KeyboardFingerVisual({
  fingering,
  pitchClasses,
}: {
  fingering: PianoFingerAssignment[];
  pitchClasses: number[];
}) {
  const width = 320;
  const whiteKeyW = width / 7;
  const blackKeyW = whiteKeyW * 0.6;
  const whiteKeyH = 90;
  const blackKeyH = 55;
  const fingerAreaH = 30;
  const height = whiteKeyH + fingerAreaH + 4;

  const pcSet = new Set(pitchClasses);
  const fingerMap = new Map(fingering.map((f) => [f.pitchClass, f]));

  return (
    <svg
      width="100%"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="rounded-lg"
    >
      {/* White keys */}
      {WHITE_PCS.map((pc, i) => {
        const x = i * whiteKeyW;
        const isActive = pcSet.has(pc);
        const f = fingerMap.get(pc);

        return (
          <g key={`w-${pc}`}>
            <rect
              x={x + 0.5}
              y={0}
              width={whiteKeyW - 1}
              height={whiteKeyH}
              rx={2}
              fill={
                isActive && f
                  ? PIANO_FINGER_COLORS[f.finger].bg
                  : "var(--background, #fff)"
              }
              stroke="var(--muted-foreground-alpha, rgba(128,128,128,0.35))"
              strokeWidth={0.7}
              opacity={isActive ? 1 : 0.8}
            />
            {/* Note name */}
            <text
              x={x + whiteKeyW / 2}
              y={whiteKeyH - 8}
              textAnchor="middle"
              fill={isActive ? "#fff" : "var(--muted-foreground, #888)"}
              style={{
                fontSize: 10,
                fontWeight: isActive ? 700 : 400,
                fontFamily: "var(--font-mono, monospace)",
              }}
            >
              {NOTE_NAMES_SHARP[pc]}
            </text>
            {/* Finger number below key */}
            {f && (
              <g>
                <circle
                  cx={x + whiteKeyW / 2}
                  cy={whiteKeyH + fingerAreaH / 2}
                  r={11}
                  fill={PIANO_FINGER_COLORS[f.finger].bg}
                />
                <text
                  x={x + whiteKeyW / 2}
                  y={whiteKeyH + fingerAreaH / 2}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#fff"
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    fontFamily: "var(--font-mono, monospace)",
                  }}
                >
                  {f.finger}
                </text>
              </g>
            )}
          </g>
        );
      })}

      {/* Black keys */}
      {BLACK_KEY_INFO.map(({ pc, afterWhite }) => {
        const x = (afterWhite + 1) * whiteKeyW - blackKeyW / 2;
        const isActive = pcSet.has(pc);
        const f = fingerMap.get(pc);

        return (
          <g key={`b-${pc}`}>
            <rect
              x={x}
              y={0}
              width={blackKeyW}
              height={blackKeyH}
              rx={1.5}
              fill={
                isActive && f
                  ? PIANO_FINGER_COLORS[f.finger].bg
                  : "var(--foreground, #222)"
              }
              opacity={isActive ? 1 : 0.85}
            />
            {isActive && f && (
              <>
                <text
                  x={x + blackKeyW / 2}
                  y={blackKeyH - 8}
                  textAnchor="middle"
                  fill="#fff"
                  style={{
                    fontSize: 8,
                    fontWeight: 700,
                    fontFamily: "var(--font-mono, monospace)",
                  }}
                >
                  {NOTE_NAMES_SHARP[pc]}
                </text>
                <circle
                  cx={x + blackKeyW / 2}
                  cy={whiteKeyH + fingerAreaH / 2}
                  r={11}
                  fill={PIANO_FINGER_COLORS[f.finger].bg}
                  stroke="var(--background, #fff)"
                  strokeWidth={1.5}
                />
                <text
                  x={x + blackKeyW / 2}
                  y={whiteKeyH + fingerAreaH / 2}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#fff"
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    fontFamily: "var(--font-mono, monospace)",
                  }}
                >
                  {f.finger}
                </text>
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ── Piano Pattern Timeline ─────────────────────────────

function PianoPatternTimeline({
  pattern,
  pitchClasses,
  fingering,
}: {
  pattern: PianoPattern;
  pitchClasses: number[];
  fingering: PianoFingerAssignment[];
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
    const msPerStep = (60 / 90) * 500;
    timerRef.current = setInterval(() => {
      setActiveStep((prev) => {
        const next = prev + 1;
        return next >= pattern.steps.length ? 0 : next;
      });
    }, msPerStep);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, pattern.steps.length]);

  // Build note label lookup
  const pcNames = new Map(pitchClasses.map((pc) => [pc, NOTE_NAMES_SHARP[pc]]));

  return (
    <div className="space-y-3">
      {/* Play/Stop */}
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

      {/* Timeline grid */}
      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <table className="w-full text-center">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="px-2 py-1.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Not
              </th>
              {pattern.steps.map((step, si) => (
                <th
                  key={si}
                  className={`px-1.5 py-1.5 font-mono text-[10px] font-semibold transition-colors ${
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
            {/* One row per pitch class in the chord */}
            {[...pitchClasses].reverse().map((pc) => {
              const noteName = NOTE_NAMES_SHARP[pc];

              return (
                <tr
                  key={pc}
                  className="border-b border-border/50 last:border-b-0"
                >
                  <td className="px-2 py-1 text-left">
                    <span className="font-mono text-xs font-bold text-foreground">
                      {noteName}
                    </span>
                  </td>
                  {pattern.steps.map((step, si) => {
                    const noteIdx = step.pitchClasses.indexOf(pc);
                    const isPlayed = noteIdx >= 0;
                    const finger = isPlayed ? step.fingers[noteIdx] : null;
                    const isActive = activeStep === si;

                    return (
                      <td
                        key={si}
                        className={`px-1.5 py-1 transition-all duration-150 ${
                          isActive ? "bg-primary/10" : ""
                        }`}
                      >
                        {isPlayed && finger ? (
                          <span
                            className={`inline-flex size-5 items-center justify-center rounded-full text-[10px] font-bold transition-transform ${
                              isActive ? "scale-125 ring-2 ring-primary/50" : ""
                            }`}
                            style={{
                              backgroundColor:
                                PIANO_FINGER_COLORS[finger]?.bg ?? "#888",
                              color:
                                PIANO_FINGER_COLORS[finger]?.text ?? "#fff",
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

      {/* Step text */}
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
            {step.pitchClasses.length > 0
              ? step.pitchClasses.map((pc, pi) => (
                  <span key={pi}>
                    {pcNames.get(pc) ?? "?"}
                    <sup className="font-bold">{step.fingers[pi] ?? ""}</sup>
                  </span>
                ))
              : "—"}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Icons ──────────────────────────────────────────────

function PianoIcon({ className }: { className?: string }) {
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
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M6 4v12" />
      <path d="M10 4v12" />
      <path d="M14 4v12" />
      <path d="M18 4v12" />
      <path d="M6 16v4" />
      <path d="M10 16v4" />
      <path d="M14 16v4" />
      <path d="M18 16v4" />
    </svg>
  );
}

export function PianoFingerTriggerIcon({ className }: { className?: string }) {
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
      <rect x="3" y="6" width="18" height="12" rx="1" />
      <path d="M7 6v7" />
      <path d="M11 6v7" />
      <path d="M15 6v7" />
      <path d="M7 13v5" />
      <path d="M11 13v5" />
      <path d="M15 13v5" />
      <path d="M19 6v12" />
      <circle cx="12" cy="21" r="1" fill="currentColor" />
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
