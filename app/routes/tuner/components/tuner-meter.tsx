import { CheckCircle2, Mic, Play, Square } from "lucide-react";
import { Badge } from "~/templates/components/ui/badge";
import { Button } from "~/templates/components/ui/button";
import { cn } from "~/templates/lib/utils";
import { clamp, midiToLabel, GUITAR_STRING_TARGETS } from "../lib/tuner-utils";

interface TunerMeterProps {
  displayCents: number;
  rawCents: number;
  isListening: boolean;
  isInTune: boolean;
  isPerfectTune: boolean;
  targetLabel: string;
  targetMidi: number | null;
  detectedLabel: string;
  detectedMidi: number | null;
  frequencyHz: number | null;
  confidence: number;
  isStarting: boolean;
  onToggleTuner: () => void;
}

/**
 * Semicircle arc of note chips centred on the target pitch.
 * Notes spread across a 160° arc above the big note display.
 */
function NoteArc({
  carouselMidiList,
  safeTargetMidi,
  detectedMidi,
  isInTune,
  isPerfectTune,
}: {
  carouselMidiList: number[];
  safeTargetMidi: number;
  detectedMidi: number | null;
  isInTune: boolean;
  isPerfectTune: boolean;
}) {
  const count = carouselMidiList.length; // 13
  const centerIdx = Math.floor(count / 2);
  const arcDeg = 80; // half-spread → total 160°
  const radius = 190; // px

  return (
    <div
      className="relative mx-auto w-full"
      style={{ height: `${radius}px` }}
      aria-live="polite"
    >
      {carouselMidiList.map((midi, idx) => {
        const noteLabel = midiToLabel(midi);
        const isTarget = midi === safeTargetMidi;
        const isCenter = idx === centerIdx;
        const isDetected = detectedMidi === midi;

        const fraction = count > 1 ? idx / (count - 1) : 0.5;
        const angleDeg = -arcDeg + fraction * arcDeg * 2; // -80..+80
        const angleRad = (angleDeg * Math.PI) / 180;

        // Position chips along the arc; pivot is bottom-center of container
        const xPx = Math.sin(angleRad) * radius; // px offset from center
        const yPx = radius - Math.cos(angleRad) * radius; // px from top

        const distFromCenter = Math.abs(idx - centerIdx);
        const scale = 1 - distFromCenter * 0.04;
        const opacity = 1 - distFromCenter * 0.065;

        return (
          <div
            key={`arc-note-${midi}`}
            className={cn(
              "absolute flex h-9 w-11 items-center justify-center rounded-lg border text-[11px] font-bold transition-all duration-300",
              "border-border/30 bg-background/25 text-muted-foreground/70 backdrop-blur-sm",
              isCenter && "border-primary/60 bg-primary/10 text-primary",
              isDetected &&
                !isInTune &&
                "border-violet-400/80 bg-violet-500/20 text-violet-300 dark:text-violet-200",
              isInTune &&
                isTarget &&
                "border-emerald-400/90 bg-emerald-500/20 text-emerald-300 dark:text-emerald-200",
              isPerfectTune &&
                isTarget &&
                "tuner-note-perfect border-emerald-400 bg-emerald-500/25 text-emerald-200",
            )}
            style={{
              left: `calc(50% + ${xPx}px)`,
              top: `${yPx}px`,
              transform: `translateX(-50%) translateY(-50%) scale(${scale})`,
              opacity,
              zIndex: isCenter ? 10 : 1,
            }}
          >
            {noteLabel}
          </div>
        );
      })}
    </div>
  );
}

export function TunerMeter({
  displayCents,
  rawCents,
  isListening,
  isInTune,
  isPerfectTune,
  targetLabel: _targetLabel,
  targetMidi,
  detectedLabel,
  detectedMidi,
  frequencyHz,
  isStarting,
  onToggleTuner,
}: TunerMeterProps) {
  const limitedDisplay = clamp(displayCents, -50, 50);
  const limitedRaw = clamp(rawCents, -50, 50);
  const needleDeg = (limitedDisplay / 50) * 45;

  const safeTargetMidi = targetMidi ?? 40;
  const carouselMidiList = Array.from({ length: 13 }).map(
    (_, index) => safeTargetMidi - 6 + index,
  );

  return (
    <div className="flex flex-col items-center gap-6">
      {/* ── 6-String Guitar Indicator ── */}
      <div className="flex items-center justify-center gap-2 sm:gap-3">
        {GUITAR_STRING_TARGETS.map((target) => {
          const isActiveTarget = target.midi === safeTargetMidi;
          return (
            <div
              key={target.id}
              className={cn(
                "flex h-14 w-14 flex-col items-center justify-center rounded-xl border transition-all duration-300",
                isActiveTarget && isInTune
                  ? "border-emerald-400/80 bg-emerald-500/15 shadow-[0_0_16px_rgb(52_211_153/0.4)]"
                  : isActiveTarget
                    ? "border-primary/70 bg-primary/12 shadow-[0_0_14px_hsl(var(--primary)/0.35)]"
                    : "border-border/30 bg-background/20",
              )}
            >
              <span
                className={cn(
                  "text-lg font-black leading-none",
                  isActiveTarget && isInTune
                    ? "text-emerald-400"
                    : isActiveTarget
                      ? "text-primary"
                      : "text-muted-foreground/60",
                )}
              >
                {target.note}
              </span>
              <span
                className={cn(
                  "mt-0.5 text-[10px] font-medium leading-none",
                  isActiveTarget
                    ? "text-foreground/60"
                    : "text-muted-foreground/40",
                )}
              >
                {target.octave}
              </span>
            </div>
          );
        })}
      </div>

      {/* ── Note Arc + Big Note (stacked) ── */}
      <div className="relative w-full max-w-2xl">
        {/* Semicircle arc of notes */}
        <div
          className={cn(
            "w-full overflow-visible",
            !isInTune && isListening && "tuner-arc-drift",
          )}
        >
          <NoteArc
            carouselMidiList={carouselMidiList}
            safeTargetMidi={safeTargetMidi}
            detectedMidi={detectedMidi}
            isInTune={isInTune}
            isPerfectTune={isPerfectTune}
          />
        </div>

        {/* Status badges */}
        <div className="mb-2 flex items-center justify-center gap-2">
          <Badge
            variant="outline"
            className={cn(
              "gap-1",
              isListening && "border-primary/40 text-primary",
            )}
          >
            <Mic
              className={cn(
                "h-3 w-3",
                isListening && "animate-pulse text-primary",
              )}
            />
            {isListening ? "Live" : "Off"}
          </Badge>
          <Badge
            variant={isInTune ? "default" : "secondary"}
            className={cn(
              "gap-1",
              isPerfectTune &&
                "border-emerald-400 bg-emerald-500/90 text-white",
              isInTune &&
                !isPerfectTune &&
                "border-emerald-400/60 bg-emerald-500/70 text-white",
            )}
          >
            {isInTune && <CheckCircle2 className="h-3 w-3" />}
            {isInTune
              ? isPerfectTune
                ? "Perfect!"
                : "In Tune"
              : limitedRaw < 0
                ? "Tune Up ↑"
                : "Tune Down ↓"}
          </Badge>
        </div>

        {/* Big note */}
        <p
          className={cn(
            "text-center font-black leading-none tracking-tighter transition-all duration-300",
            "text-[5rem] md:text-[7rem]",
            isPerfectTune && "text-emerald-400",
            isInTune && !isPerfectTune && "text-emerald-500",
          )}
        >
          {detectedLabel}
        </p>

        {/* Hz + Start button */}
        <div className="mt-3 flex flex-col items-center gap-3">
          <p className="text-muted-foreground text-sm tabular-nums">
            {frequencyHz
              ? `${frequencyHz.toFixed(1)} Hz`
              : "Pluck a string to detect"}
          </p>

          <Button
            type="button"
            size="lg"
            variant={isListening ? "secondary" : "default"}
            onClick={onToggleTuner}
            disabled={isStarting}
            className={cn(
              "gap-2 px-8 transition-all duration-200",
              isListening &&
                "border-primary/40 bg-primary/10 text-primary hover:bg-primary/20",
            )}
          >
            {isListening ? (
              <>
                <Square className="h-4 w-4 fill-current" />
                Stop Tuner
              </>
            ) : isStarting ? (
              <>
                <Mic className="h-4 w-4 animate-pulse" />
                Starting…
              </>
            ) : (
              <>
                <Play className="h-4 w-4 fill-current" />
                Start Tuner
              </>
            )}
          </Button>
        </div>
      </div>

      {/* ── Analog Gauge ── */}
      <div
        className={cn(
          "bg-linear-to-b relative mx-auto h-48 w-full max-w-2xl overflow-hidden rounded-2xl border from-primary/10 via-background/30 to-background/30 backdrop-blur-sm transition-all duration-300",
          isPerfectTune
            ? "border-emerald-500/50 shadow-[0_0_48px_rgb(52_211_153/0.12)]"
            : isInTune
              ? "border-emerald-400/30"
              : "border-border/40",
        )}
      >
        {/* tick marks */}
        <div className="absolute inset-x-6 bottom-6 flex items-end justify-between">
          {Array.from({ length: 11 }).map((_, idx) => {
            const step = idx * 10 - 50;
            const isCenterTick = step === 0;
            return (
              <div
                key={`tick-${step}`}
                className="flex flex-col items-center gap-1"
              >
                <div
                  className={cn(
                    "rounded-full",
                    isCenterTick
                      ? "h-10 w-1 bg-primary"
                      : "h-5 w-px bg-border/50",
                  )}
                />
                <span className="text-muted-foreground text-[10px]">
                  {step}
                </span>
              </div>
            );
          })}
        </div>

        {/* center guide */}
        <div className="absolute inset-x-0 bottom-0 flex justify-center">
          <div className="bg-linear-to-t h-40 w-0.5 from-transparent via-border/40 to-transparent" />
        </div>

        {/* needle */}
        <div
          className={cn(
            "absolute bottom-4 left-1/2 h-28 w-[3px] -translate-x-1/2 origin-bottom rounded-full transition-transform duration-100 ease-out",
            isPerfectTune
              ? "bg-emerald-400 shadow-[0_0_20px_rgb(52_211_153/0.9),0_0_44px_rgb(52_211_153/0.45)]"
              : isInTune
                ? "bg-emerald-500 shadow-[0_0_16px_rgb(52_211_153/0.7)]"
                : "bg-primary shadow-[0_0_22px_hsl(var(--primary)/0.65)]",
          )}
          style={{ transform: `translateX(-50%) rotate(${needleDeg}deg)` }}
          aria-hidden
        />

        {/* pivot dot */}
        <div
          className={cn(
            "absolute bottom-2 left-1/2 h-5 w-5 -translate-x-1/2 rounded-full border-2 shadow-lg",
            isPerfectTune
              ? "border-emerald-400/80 bg-emerald-400/70"
              : "border-border/70 bg-primary/90",
          )}
        />

        {/* cents readout */}
        <div className="absolute inset-x-0 top-4 text-center">
          <p
            className={cn(
              "text-4xl font-black tabular-nums leading-none transition-colors",
              isPerfectTune && "text-emerald-400",
              isInTune && !isPerfectTune && "text-emerald-500",
            )}
          >
            {limitedRaw > 0 ? "+" : ""}
            {Math.round(limitedRaw)}
          </p>
          <p className="text-muted-foreground mt-1 text-xs">cents</p>
        </div>
      </div>
    </div>
  );
}
