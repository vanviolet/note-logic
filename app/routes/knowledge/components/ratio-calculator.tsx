// ════════════════════════════════════════════════════════
// Knowledge – Interactive Ratio Calculator Widget
// ════════════════════════════════════════════════════════

import { useCallback, useState } from "react";
import { Music, Play, AudioWaveform } from "lucide-react";
import { cn } from "~/templates/lib/utils";

interface RatioCalculatorProps {
  ratios: Array<{ label: string; ratio: number; cents: number }>;
}

export function RatioCalculator({ ratios }: RatioCalculatorProps) {
  const [baseFreq, setBaseFreq] = useState(220);
  const [playing, setPlaying] = useState<number | null>(null);

  const playTone = useCallback(
    (ratio: number, index: number) => {
      if (typeof window === "undefined") return;

      const ctx = new AudioContext();
      const freq = baseFreq * ratio;

      // Create oscillator for the tone
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 1.5);
      setPlaying(index);

      setTimeout(() => {
        setPlaying(null);
        ctx.close();
      }, 1500);
    },
    [baseFreq],
  );

  const playInterval = useCallback(
    (ratio: number, index: number) => {
      if (typeof window === "undefined") return;

      const ctx = new AudioContext();
      const freq1 = baseFreq;
      const freq2 = baseFreq * ratio;

      // Base tone
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(freq1, ctx.currentTime);
      gain1.gain.setValueAtTime(0.2, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);

      // Interval tone (starts 0.3s later)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(freq2, ctx.currentTime + 0.3);
      gain2.gain.setValueAtTime(0, ctx.currentTime);
      gain2.gain.setValueAtTime(0.2, ctx.currentTime + 0.3);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.3);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 2);
      osc2.stop(ctx.currentTime + 2.3);
      setPlaying(index);

      setTimeout(() => {
        setPlaying(null);
        ctx.close();
      }, 2300);
    },
    [baseFreq],
  );

  return (
    <div className="space-y-4 rounded-xl border border-border/50 bg-card/50 p-5">
      <div className="flex items-center justify-between">
        <h4 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider">
          <Music className="h-4 w-4 text-primary" />
          Ratio Calculator Interaktif
        </h4>
        <div className="flex items-center gap-2">
          <label htmlFor="base-freq" className="text-xs text-muted-foreground">
            Base:
          </label>
          <input
            id="base-freq"
            type="number"
            min={55}
            max={880}
            value={baseFreq}
            onChange={(e) => setBaseFreq(Number(e.target.value) || 220)}
            className="h-8 w-20 rounded-md border border-border bg-background px-2 text-center text-sm"
          />
          <span className="text-xs text-muted-foreground">Hz</span>
        </div>
      </div>

      <div className="grid gap-2">
        {ratios.map((r, i) => {
          const resultFreq = (baseFreq * r.ratio).toFixed(2);
          const isActive = playing === i;

          return (
            <div
              key={r.label}
              className={cn(
                "flex items-center gap-3 rounded-lg border border-border/40 px-4 py-2.5 transition-all",
                isActive && "border-primary/50 bg-primary/5",
              )}
            >
              <span className="min-w-[140px] text-sm font-medium">
                {r.label}
              </span>
              <span className="text-muted-foreground text-xs tabular-nums">
                {resultFreq} Hz
              </span>
              <span className="text-muted-foreground/60 text-xs tabular-nums">
                {r.cents}¢
              </span>
              <div className="ml-auto flex gap-1.5">
                <button
                  type="button"
                  onClick={() => playTone(r.ratio, i)}
                  disabled={playing !== null}
                  className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary transition hover:bg-primary/20 disabled:opacity-40"
                >
                  <Play className="mr-0.5 inline h-3 w-3" /> Nada
                </button>
                {r.ratio !== 1 && (
                  <button
                    type="button"
                    onClick={() => playInterval(r.ratio, i)}
                    disabled={playing !== null}
                    className="rounded-md bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 transition hover:bg-emerald-500/20 disabled:opacity-40 dark:text-emerald-400"
                  >
                    <AudioWaveform className="mr-0.5 inline h-3 w-3" /> Interval
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-muted-foreground/60 text-[11px]">
        Klik "Nada" untuk mendengar frekuensi tunggal, atau "Interval" untuk
        mendengar base → nada berurutan. Ubah base frequency di atas untuk
        eksperimen.
      </p>
    </div>
  );
}
