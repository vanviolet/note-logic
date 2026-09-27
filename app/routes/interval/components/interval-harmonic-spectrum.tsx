import { useState } from "react";
import { Sparkles, Volume2, ArrowRight, Waves, Music } from "lucide-react";
import type { GeneratedInterval } from "~/theory-music/interval";
import { Badge } from "~/templates/components/ui/badge";
import { Button } from "~/templates/components/ui/button";
import { circleAudio } from "~/theory-music/circle-of-fifths/circle-audio";
import { useLearnFretboardStore } from "~/shared/stores/learn-fretboard.store";

interface IntervalHarmonicSpectrumProps {
  intervals: GeneratedInterval[];
  root: string;
}

export function IntervalHarmonicSpectrum({
  intervals,
  root,
}: IntervalHarmonicSpectrumProps) {
  const [activeInterval, setActiveInterval] = useState<GeneratedInterval>(
    intervals.find((i) => i.short === "P5") ?? intervals[0]!,
  );
  const [playMode, setPlayMode] = useState<"melodic" | "harmonic">("melodic");
  const [isPlaying, setIsPlaying] = useState(false);

  const selectInterval = useLearnFretboardStore((s) => s.selectInterval);

  const handlePlayInterval = (item: GeneratedInterval) => {
    setActiveInterval(item);
    selectInterval(item);
    setIsPlaying(true);

    if (playMode === "melodic") {
      circleAudio.playNoteSequence([item.root, item.note], 0.4);
    } else {
      circleAudio.playChord([item.root, item.note], { type: "block", duration: 1.5 });
    }

    setTimeout(() => setIsPlaying(false), 900);
  };

  const perfectConsonances = intervals.filter(
    (i) => i.consonance === "perfect-consonance",
  );
  const imperfectConsonances = intervals.filter(
    (i) => i.consonance === "imperfect-consonance",
  );
  const dissonances = intervals.filter((i) => i.consonance === "dissonance");

  return (
    <div className="rounded-xl border border-border/80 bg-card/60 p-5 shadow-xs backdrop-blur space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/50 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Waves className="size-4 text-cyan-500" />
            <h2 className="text-lg font-semibold tracking-tight">
              Spektrum Konsonansi Interval ({root})
            </h2>
          </div>
          <p className="text-muted-foreground text-xs mt-0.5">
            Pahami tingkat gesekan harmonik nada target relatif terhadap nada dasar {root}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Play Mode Selector */}
          <div className="flex rounded-lg border border-border/70 p-0.5 bg-muted/30 text-xs">
            <button
              type="button"
              onClick={() => setPlayMode("melodic")}
              className={`px-2.5 py-1 rounded-md transition-colors font-medium ${
                playMode === "melodic"
                  ? "bg-background text-foreground shadow-2xs font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Melodis (Berurutan)
            </button>
            <button
              type="button"
              onClick={() => setPlayMode("harmonic")}
              className={`px-2.5 py-1 rounded-md transition-colors font-medium ${
                playMode === "harmonic"
                  ? "bg-background text-foreground shadow-2xs font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Harmonis (Bersamaan)
            </button>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => handlePlayInterval(activeInterval)}
            className="gap-2 shrink-0"
          >
            <Volume2 className={`size-4 ${isPlaying ? "animate-pulse text-cyan-500" : ""}`} />
            Putar {activeInterval.short} ({activeInterval.root} → {activeInterval.note})
          </Button>
        </div>
      </div>

      {/* Visual Spectrum Gauge */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px] font-medium text-muted-foreground px-1">
          <span className="text-cyan-600 dark:text-cyan-400">P1 (0 Semitone)</span>
          <span className="text-emerald-600 dark:text-emerald-400">P5 / M3 (Konsonan Stabil)</span>
          <span className="text-amber-600 dark:text-amber-400">Tritone / M7 (Disonansi)</span>
          <span className="text-cyan-600 dark:text-cyan-400">P8 (12 Semitone)</span>
        </div>
        <div className="h-2.5 w-full rounded-full bg-gradient-to-r from-cyan-500 via-emerald-500 via-amber-500 to-cyan-500 opacity-80" />
      </div>

      {/* 3 Categories Spectrum Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Perfect Consonance */}
        <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/5 p-3 space-y-2">
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
            <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
              Perfect Consonance
            </span>
            <span className="text-[10px] text-muted-foreground">Murni & Sangat Stabil</span>
          </div>
          <div className="space-y-1.5">
            {perfectConsonances.map((item) => {
              const isActive = activeInterval.short === item.short;
              return (
                <button
                  key={`spec-${item.short}`}
                  type="button"
                  onClick={() => handlePlayInterval(item)}
                  className={`w-full flex items-center justify-between rounded-md p-2 text-left text-xs transition-all ${
                    isActive
                      ? "bg-cyan-500 text-white font-semibold shadow-xs"
                      : "bg-background/80 hover:bg-cyan-500/10 text-foreground border border-border/40"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold">{item.short}</span>
                    <span>{item.name}</span>
                  </div>
                  <span className="font-mono text-[11px] opacity-90">
                    {item.root} → {item.note} ({item.semitone}st)
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Imperfect Consonance */}
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3 space-y-2">
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Imperfect Consonance
            </span>
            <span className="text-[10px] text-muted-foreground">Merdu & Penuh Warna</span>
          </div>
          <div className="space-y-1.5">
            {imperfectConsonances.map((item) => {
              const isActive = activeInterval.short === item.short;
              return (
                <button
                  key={`spec-${item.short}`}
                  type="button"
                  onClick={() => handlePlayInterval(item)}
                  className={`w-full flex items-center justify-between rounded-md p-2 text-left text-xs transition-all ${
                    isActive
                      ? "bg-emerald-500 text-white font-semibold shadow-xs"
                      : "bg-background/80 hover:bg-emerald-500/10 text-foreground border border-border/40"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold">{item.short}</span>
                    <span>{item.name}</span>
                  </div>
                  <span className="font-mono text-[11px] opacity-90">
                    {item.root} → {item.note} ({item.semitone}st)
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dissonance */}
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 space-y-2">
          <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              Dissonance
            </span>
            <span className="text-[10px] text-muted-foreground">Tegang & Mendorong Resolusi</span>
          </div>
          <div className="space-y-1.5">
            {dissonances.map((item) => {
              const isActive = activeInterval.short === item.short;
              return (
                <button
                  key={`spec-${item.short}`}
                  type="button"
                  onClick={() => handlePlayInterval(item)}
                  className={`w-full flex items-center justify-between rounded-md p-2 text-left text-xs transition-all ${
                    isActive
                      ? "bg-amber-500 text-white font-semibold shadow-xs"
                      : "bg-background/80 hover:bg-amber-500/10 text-foreground border border-border/40"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold">{item.short}</span>
                    <span>{item.name}</span>
                  </div>
                  <span className="font-mono text-[11px] opacity-90">
                    {item.root} → {item.note} ({item.semitone}st)
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Interval Detail Card */}
      {activeInterval && (
        <div className="rounded-lg bg-muted/40 p-4 text-xs space-y-3 border border-border/60">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/40 pb-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-base text-foreground">
                {activeInterval.name} ({activeInterval.short})
              </span>
              <Badge variant="outline" className="font-mono">
                {activeInterval.root} → {activeInterval.note}
              </Badge>
              <Badge variant="secondary">
                {activeInterval.semitone} Semitones ({activeInterval.cents} cents)
              </Badge>
            </div>
            <span className="text-muted-foreground font-mono">
              Inversi: {activeInterval.inversionName} ({activeInterval.inversionShort})
            </span>
          </div>

          <p className="text-muted-foreground leading-relaxed">
            {activeInterval.description}
          </p>

          <div className="grid sm:grid-cols-2 gap-3 pt-1">
            <div className="space-y-1">
              <span className="font-bold text-[11px] uppercase tracking-wider text-muted-foreground">
                Aplikasi Harmonis:
              </span>
              <ul className="list-disc pl-4 space-y-0.5 text-muted-foreground">
                {activeInterval.functionHints.map((hint, idx) => (
                  <li key={`hint-active-${idx}`}>{hint}</li>
                ))}
              </ul>
            </div>

            {activeInterval.songExamples?.length ? (
              <div className="space-y-1">
                <span className="font-bold text-[11px] uppercase tracking-wider text-muted-foreground">
                  Contoh Lagu / Song Mnemonic:
                </span>
                <p className="text-foreground font-medium">
                  {activeInterval.songExamples[0]?.title} — {activeInterval.songExamples[0]?.artist}
                </p>
                <p className="text-muted-foreground text-[11px]">
                  {activeInterval.songExamples[0]?.note}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
