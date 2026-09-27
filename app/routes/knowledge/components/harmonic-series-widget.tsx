// ════════════════════════════════════════════════════════
// Knowledge – Harmonic Series Widget
// ════════════════════════════════════════════════════════

import { useCallback, useRef, useState } from "react";
import { AudioWaveform, Play } from "lucide-react";
import { cn } from "~/templates/lib/utils";

interface HarmonicSeriesWidgetProps {
  fundamentalFrequency: number;
  harmonicCount: number;
}

const HARMONIC_LABELS: Record<number, string> = {
  1: "Fundamental",
  2: "Oktaf",
  3: "Perfect 5th (+ oktaf)",
  4: "2 Oktaf",
  5: "Major 3rd (+ 2 okt)",
  6: "Perfect 5th (+ 2 okt)",
  7: "Minor 7th* (+ 2 okt)",
  8: "3 Oktaf",
  9: "Major 2nd (+ 3 okt)",
  10: "Major 3rd (+ 3 okt)",
  11: "Tritone* (+ 3 okt)",
  12: "Perfect 5th (+ 3 okt)",
  13: "Minor 6th* (+ 3 okt)",
  14: "Minor 7th* (+ 3 okt)",
  15: "Major 7th (+ 3 okt)",
  16: "4 Oktaf",
};

export function HarmonicSeriesWidget({
  fundamentalFrequency,
  harmonicCount,
}: HarmonicSeriesWidgetProps) {
  const [playingPartial, setPlayingPartial] = useState<number | null>(null);
  const [baseFreq, setBaseFreq] = useState(fundamentalFrequency);
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);

  const harmonics = Array.from({ length: harmonicCount }, (_, i) => {
    const n = i + 1;
    return {
      partial: n,
      frequency: baseFreq * n,
      label: HARMONIC_LABELS[n] ?? `Harmonik ke-${n}`,
      relativeAmplitude: 1 / n,
    };
  });

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    return ctxRef.current;
  }, []);

  const playPartial = useCallback(
    (freq: number, partial: number, duration = 1) => {
      const ctx = getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      const amp = Math.min(0.3, 0.3 / partial);
      gain.gain.setValueAtTime(amp, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);

      setPlayingPartial(partial);
      setTimeout(() => setPlayingPartial(null), duration * 1000);
    },
    [getCtx],
  );

  const playAll = useCallback(() => {
    if (isPlayingAll) return;
    const ctx = getCtx();
    setIsPlayingAll(true);

    harmonics.forEach((h) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = h.frequency;
      const amp = Math.min(0.15, 0.15 / h.partial);
      gain.gain.setValueAtTime(amp, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 2);
    });

    setTimeout(() => setIsPlayingAll(false), 2000);
  }, [getCtx, harmonics, isPlayingAll]);

  // Max bar width proportional
  const maxFreq = harmonics[harmonics.length - 1]?.frequency ?? 1;

  return (
    <div className="space-y-4 rounded-xl border border-border/50 bg-card/50 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h4 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider">
          <AudioWaveform className="h-4 w-4 text-primary" />
          Deret Harmonik
        </h4>
        <button
          type="button"
          onClick={playAll}
          disabled={isPlayingAll}
          className={cn(
            "rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
            isPlayingAll
              ? "bg-primary text-primary-foreground animate-pulse"
              : "bg-primary/10 text-primary hover:bg-primary/20",
          )}
        >
          {isPlayingAll ? (
            <>
              <AudioWaveform className="mr-1 inline h-3 w-3 animate-pulse" />{" "}
              Playing...
            </>
          ) : (
            <>
              <Play className="mr-1 inline h-3 w-3" /> Main Semua Harmonik
            </>
          )}
        </button>
      </div>

      {/* Base frequency slider */}
      <div className="flex items-center gap-3">
        <label className="text-xs text-muted-foreground whitespace-nowrap">
          Fundamental:
        </label>
        <input
          type="range"
          min={55}
          max={440}
          step={1}
          value={baseFreq}
          onChange={(e) => setBaseFreq(Number(e.target.value))}
          className="h-1.5 flex-1 cursor-pointer accent-primary"
        />
        <span className="min-w-[4rem] text-right text-xs font-mono font-bold tabular-nums">
          {baseFreq} Hz
        </span>
      </div>

      {/* Harmonic bars */}
      <div className="space-y-1">
        {harmonics.map((h) => {
          const isPlaying = playingPartial === h.partial;
          const widthPct = (h.frequency / maxFreq) * 100;

          return (
            <button
              key={h.partial}
              type="button"
              onClick={() => playPartial(h.frequency, h.partial)}
              className={cn(
                "group flex w-full items-center gap-2 rounded-md px-2 py-1 text-left transition-all",
                isPlaying ? "bg-primary/15" : "hover:bg-muted/30",
              )}
            >
              {/* Partial number */}
              <span className="w-5 shrink-0 text-right text-[11px] font-bold tabular-nums text-muted-foreground">
                {h.partial}
              </span>

              {/* Bar */}
              <div className="relative flex-1 h-5 rounded bg-muted/20 overflow-hidden">
                <div
                  className={cn(
                    "absolute inset-y-0 left-0 rounded transition-all",
                    isPlaying
                      ? "bg-primary/60 animate-pulse"
                      : "bg-primary/25 group-hover:bg-primary/40",
                  )}
                  style={{ width: `${widthPct}%` }}
                />
                <span className="relative z-10 flex h-full items-center px-2 text-[11px]">
                  {h.label}
                </span>
              </div>

              {/* Frequency */}
              <span className="w-20 shrink-0 text-right text-[11px] font-mono tabular-nums text-muted-foreground">
                {h.frequency.toFixed(1)} Hz
              </span>

              {/* Amplitude */}
              <span className="w-10 shrink-0 text-right text-[10px] text-muted-foreground/50">
                {(h.relativeAmplitude * 100).toFixed(0)}%
              </span>
            </button>
          );
        })}
      </div>

      <p className="text-muted-foreground/60 text-[11px]">
        Klik tiap harmonik untuk mendengar nada. Geser slider fundamental untuk
        mengubah frekuensi dasar. Harmonik bertanda * memiliki intonasi berbeda
        dari temperamen sama rata (equal temperament).
      </p>
    </div>
  );
}
