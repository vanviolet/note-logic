// ════════════════════════════════════════════════════════
// ChordFingerpickingSection – Inline fingerpicking patterns
// ════════════════════════════════════════════════════════
//
// Embeddable section (not a dialog) showing fingerpicking patterns
// for Guitar, Ukulele, and Piano in a tabbed layout.
// Reuses pattern data & visualizations from the songbook module.
// ════════════════════════════════════════════════════════

import { memo, useMemo, useState, useEffect, useRef, useCallback } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/templates/components/ui/tabs";
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
} from "~/routes/songbook/lib/fingerpicking-patterns";
import {
  type PianoPattern,
  PIANO_FINGER_COLORS,
  PIANO_PATTERNS,
  getPianoRHFingering,
  resolvePianoPattern,
} from "~/routes/songbook/lib/piano-fingering";
import { getBestVoicing } from "~/routes/songbook/lib/chord-voicing-engine";
import { getBestUkuleleVoicing } from "~/routes/songbook/lib/ukulele-voicing-engine";

// ── Props ──────────────────────────────────────────────

interface ChordFingerpickingSectionProps {
  chordName: string;
  pitchClasses: number[];
}

// ── Main Component ─────────────────────────────────────

export const ChordFingerpickingSection = memo(
  function ChordFingerpickingSection({
    chordName,
    pitchClasses,
  }: ChordFingerpickingSectionProps) {
    const guitarVoicing = useMemo(() => getBestVoicing(chordName), [chordName]);
    const ukuleleVoicing = useMemo(
      () => getBestUkuleleVoicing(chordName),
      [chordName],
    );

    const guitarFrets = guitarVoicing?.frets ?? [0, 0, 0, 0, 0, 0];
    const ukuleleFrets = ukuleleVoicing?.frets ?? [0, 0, 0, 0];

    return (
      <section>
        <h2 className="mb-4 text-xl font-semibold">Fingerpicking Patterns</h2>
        <Tabs defaultValue="guitar" className="w-full">
          <TabsList className="mb-4 grid w-full grid-cols-3">
            <TabsTrigger value="guitar" className="gap-1.5 text-xs sm:text-sm">
              🎸 Guitar
            </TabsTrigger>
            <TabsTrigger value="ukulele" className="gap-1.5 text-xs sm:text-sm">
              🪕 Ukulele
            </TabsTrigger>
            <TabsTrigger value="piano" className="gap-1.5 text-xs sm:text-sm">
              🎹 Piano
            </TabsTrigger>
          </TabsList>

          <TabsContent value="guitar">
            <GuitarFingerpickingTab chordName={chordName} frets={guitarFrets} />
          </TabsContent>
          <TabsContent value="ukulele">
            <UkuleleFingerpickingTab
              chordName={chordName}
              frets={ukuleleFrets}
            />
          </TabsContent>
          <TabsContent value="piano">
            <PianoFingerpickingTab
              chordName={chordName}
              pitchClasses={pitchClasses}
            />
          </TabsContent>
        </Tabs>
      </section>
    );
  },
);

// ── Guitar Tab ─────────────────────────────────────────

function GuitarFingerpickingTab({
  frets,
}: {
  chordName: string;
  frets: number[];
}) {
  const assignments = getGuitarFingerAssignment(frets);
  const stringLabels = ["E", "A", "D", "G", "B", "e"];
  const [selectedId, setSelectedId] = useState(GUITAR_PATTERNS[0]?.id);
  const selected =
    GUITAR_PATTERNS.find((p) => p.id === selectedId) ?? GUITAR_PATTERNS[0];
  const resolved = selected ? resolvePatternForVoicing(selected, frets) : null;

  return (
    <div className="space-y-4">
      <FingerAssignmentRow
        assignments={assignments}
        frets={frets}
        stringLabels={stringLabels}
      />
      <PatternSelector
        patterns={GUITAR_PATTERNS}
        selectedId={selectedId ?? ""}
        onSelect={setSelectedId}
      />
      {resolved && (
        <StringPatternTimeline
          pattern={resolved}
          frets={frets}
          stringLabels={stringLabels}
          numStrings={6}
        />
      )}
      <FingerLegend fingers={["p", "i", "m", "a"]} />
    </div>
  );
}

// ── Ukulele Tab ────────────────────────────────────────

function UkuleleFingerpickingTab({
  frets,
}: {
  chordName: string;
  frets: number[];
}) {
  const assignments = getUkuleleFingerAssignment(frets);
  const stringLabels = ["G", "C", "E", "A"];
  const [selectedId, setSelectedId] = useState(UKULELE_PATTERNS[0]?.id);
  const selected =
    UKULELE_PATTERNS.find((p) => p.id === selectedId) ?? UKULELE_PATTERNS[0];
  const resolved = selected ? resolvePatternForVoicing(selected, frets) : null;

  return (
    <div className="space-y-4">
      <FingerAssignmentRow
        assignments={assignments}
        frets={frets}
        stringLabels={stringLabels}
      />
      <PatternSelector
        patterns={UKULELE_PATTERNS}
        selectedId={selectedId ?? ""}
        onSelect={setSelectedId}
      />
      {resolved && (
        <StringPatternTimeline
          pattern={resolved}
          frets={frets}
          stringLabels={stringLabels}
          numStrings={4}
        />
      )}
      <FingerLegend fingers={["p", "i", "m", "a"]} />
    </div>
  );
}

// ── Piano Tab ──────────────────────────────────────────

function PianoFingerpickingTab({
  pitchClasses,
}: {
  chordName: string;
  pitchClasses: number[];
}) {
  const rhFingering = useMemo(
    () => getPianoRHFingering(pitchClasses),
    [pitchClasses],
  );
  const [selectedId, setSelectedId] = useState(PIANO_PATTERNS[0]?.id);
  const selected =
    PIANO_PATTERNS.find((p) => p.id === selectedId) ?? PIANO_PATTERNS[0];
  const resolved = selected
    ? resolvePianoPattern(selected, pitchClasses)
    : null;

  return (
    <div className="space-y-4">
      {/* RH finger assignment */}
      <div>
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Penempatan Jari Kanan
        </h4>
        <div className="flex flex-wrap gap-2">
          {rhFingering.map((a) => (
            <div
              key={a.pitchClass}
              className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5"
            >
              <span className="text-xs font-semibold">{a.noteName}</span>
              <span
                className="flex size-5 items-center justify-center rounded-full text-[10px] font-bold"
                style={{
                  backgroundColor: PIANO_FINGER_COLORS[a.finger]?.bg,
                  color: PIANO_FINGER_COLORS[a.finger]?.text,
                }}
              >
                {a.finger}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Pattern selector */}
      <div>
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Pola Permainan
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {PIANO_PATTERNS.map((p) => (
            <button
              type="button"
              key={p.id}
              onClick={() => setSelectedId(p.id)}
              className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                selectedId === p.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
        {selected && (
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            {selected.description}
            <span className="ml-2 font-mono text-[10px] text-primary">
              {selected.timeSignature}
            </span>
          </p>
        )}
      </div>

      {/* Pattern steps */}
      {resolved && (
        <PianoPatternTimeline pattern={resolved} pitchClasses={pitchClasses} />
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-3 rounded-lg border border-border bg-muted/30 p-3">
        {[1, 2, 3, 4, 5].map((f) => (
          <div key={f} className="flex items-center gap-1.5">
            <span
              className="flex size-5 items-center justify-center rounded-full text-[10px] font-bold"
              style={{
                backgroundColor: PIANO_FINGER_COLORS[f]?.bg,
                color: PIANO_FINGER_COLORS[f]?.text,
              }}
            >
              {f}
            </span>
            <span className="text-[11px] text-muted-foreground">
              {PIANO_FINGER_COLORS[f]?.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Shared Sub-Components ──────────────────────────────

function FingerAssignmentRow({
  assignments,
  frets,
  stringLabels,
}: {
  assignments: FingerAssignment[];
  frets: number[];
  stringLabels: string[];
}) {
  return (
    <div>
      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Penempatan Jari Kanan
      </h4>
      <div className="flex items-center gap-1 overflow-x-auto py-1">
        {stringLabels.map((label, i) => {
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
              <span className="font-mono text-xs font-bold">{label}</span>
              <div
                className={`h-6 w-px ${isMuted ? "bg-muted-foreground/20" : "bg-muted-foreground/50"}`}
              />
              {assignment && !isMuted ? (
                <span
                  className="flex size-5 items-center justify-center rounded-full text-[10px] font-bold"
                  style={{
                    backgroundColor: FINGER_COLORS[assignment.finger].bg,
                    color: FINGER_COLORS[assignment.finger].text,
                  }}
                >
                  {assignment.finger}
                </span>
              ) : (
                <span className="flex size-5 items-center justify-center text-xs text-muted-foreground">
                  {isMuted ? "×" : "–"}
                </span>
              )}
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
    </div>
  );
}

function PatternSelector({
  patterns,
  selectedId,
  onSelect,
}: {
  patterns: FingerpickingPattern[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const selected = patterns.find((p) => p.id === selectedId);
  return (
    <div>
      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Pola Petikan
      </h4>
      <div className="flex flex-wrap gap-1.5">
        {patterns.map((p) => (
          <button
            type="button"
            key={p.id}
            onClick={() => onSelect(p.id)}
            className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
              selectedId === p.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>
      {selected && (
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          {selected.description}
          <span className="ml-2 font-mono text-[10px] text-primary">
            {selected.timeSignature}
          </span>
        </p>
      )}
    </div>
  );
}

function StringPatternTimeline({
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
    const msPerStep = (60 / 90) * 500; // ~333ms per step
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

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={isPlaying ? stop : play}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
            isPlaying
              ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          }`}
        >
          {isPlaying ? "⏹ Stop" : "▶ Preview Animasi"}
        </button>
        <span className="font-mono text-[10px] text-muted-foreground">
          {pattern.timeSignature} · {pattern.steps.length} langkah
        </span>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
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
            {Array.from({ length: numStrings }, (_, rawIdx) => {
              const stringIdx = numStrings - 1 - rawIdx;
              const isMuted = frets[stringIdx] === -1;
              return (
                <tr
                  key={stringIdx}
                  className={`border-b border-border/50 last:border-b-0 ${isMuted ? "opacity-30" : ""}`}
                >
                  <td className="px-2 py-1 text-left">
                    <span className="font-mono text-xs font-bold">
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
                        className={`px-1.5 py-1 transition-all duration-150 ${isActive ? "bg-primary/10" : ""}`}
                      >
                        {isPlucked && finger ? (
                          <span
                            className={`inline-flex size-5 items-center justify-center rounded-full text-[10px] font-bold transition-transform ${isActive ? "scale-125 ring-2 ring-primary/50" : ""}`}
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
    </div>
  );
}

function PianoPatternTimeline({
  pattern,
}: {
  pattern: PianoPattern;
  pitchClasses: number[];
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

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={isPlaying ? stop : play}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
            isPlaying
              ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          }`}
        >
          {isPlaying ? "⏹ Stop" : "▶ Preview Animasi"}
        </button>
        <span className="font-mono text-[10px] text-muted-foreground">
          {pattern.timeSignature} · {pattern.steps.length} langkah
        </span>
      </div>

      <div className="flex flex-wrap gap-1">
        {pattern.steps.map((step, si) => (
          <span
            key={si}
            className={`inline-flex items-center gap-0.5 rounded px-2 py-1 font-mono text-[10px] transition-colors ${
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
                  color:
                    activeStep === si ? undefined : PIANO_FINGER_COLORS[f]?.bg,
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

function FingerLegend({ fingers }: { fingers: RHFinger[] }) {
  return (
    <div className="flex flex-wrap gap-3 rounded-lg border border-border bg-muted/30 p-3">
      {fingers.map((f) => (
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
    </div>
  );
}
