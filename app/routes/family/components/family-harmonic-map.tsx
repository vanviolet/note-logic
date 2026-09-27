import { useState } from "react";
import { Play, Volume2, Sparkles, ArrowRight, Music, HelpCircle } from "lucide-react";
import type { FamilyChordEntry } from "~/theory-music/family";
import { Badge } from "~/templates/components/ui/badge";
import { Button } from "~/templates/components/ui/button";
import { circleAudio } from "~/theory-music/circle-of-fifths/circle-audio";
import { useLearnFretboardStore } from "~/shared/stores/learn-fretboard.store";

interface FamilyHarmonicMapProps {
  entries: FamilyChordEntry[];
  root: string;
  scaleType: "major" | "minor";
}

export function FamilyHarmonicMap({ entries, root, scaleType }: FamilyHarmonicMapProps) {
  const [activeChord, setActiveChord] = useState<FamilyChordEntry | null>(entries[0] ?? null);
  const [isPlaying, setIsPlaying] = useState(false);
  const selectFamily = useLearnFretboardStore((s) => s.selectFamily);

  const tonicChords = entries.filter((e) => e.family === "Tonic");
  const subdominantChords = entries.filter((e) => e.family === "Subdominant");
  const dominantChords = entries.filter((e) => e.family === "Dominant");

  const handlePlayChord = (entry: FamilyChordEntry) => {
    setActiveChord(entry);
    selectFamily(entry);

    const notes = entry.chord.composed.map((t) => t.note);
    setIsPlaying(true);
    circleAudio.playChord(notes, { type: "strum", duration: 1.8 });
    setTimeout(() => setIsPlaying(false), 800);
  };

  return (
    <div className="rounded-xl border border-border/80 bg-card/60 p-5 shadow-xs backdrop-blur space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/50 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            <h2 className="text-lg font-semibold tracking-tight">
              Peta Harmoni {root} {scaleType === "major" ? "Mayor" : "Minor"}
            </h2>
          </div>
          <p className="text-muted-foreground text-xs mt-0.5">
            Setiap chord dalam tangga nada memiliki peran dan tingkat ketegangan harmonik tersendiri.
          </p>
        </div>

        {activeChord && (
          <Button
            size="sm"
            variant="outline"
            className="gap-2 shrink-0 self-start sm:self-auto"
            onClick={() => handlePlayChord(activeChord)}
          >
            <Volume2 className={`size-4 ${isPlaying ? "animate-pulse text-primary" : ""}`} />
            Dengarkan {activeChord.degree} ({activeChord.chord.name})
          </Button>
        )}
      </div>

      {/* Tension Flow Bar */}
      <div className="grid gap-2 text-center text-xs">
        <div className="flex items-center justify-between text-[11px] font-medium text-muted-foreground px-2">
          <span className="text-cyan-600 dark:text-cyan-400">TONIC (Rumah / Stabil)</span>
          <ArrowRight className="size-3 text-muted-foreground/50" />
          <span className="text-emerald-600 dark:text-emerald-400">SUBDOMINANT (Persiapan)</span>
          <ArrowRight className="size-3 text-muted-foreground/50" />
          <span className="text-amber-600 dark:text-amber-400">DOMINANT (Tegangan Tinggi)</span>
        </div>
        <div className="h-2 w-full rounded-full bg-gradient-to-r from-cyan-500 via-emerald-500 to-amber-500 opacity-80" />
      </div>

      {/* 3 Family Columns */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Tonic Column */}
        <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-3 space-y-2">
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
            <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
              Tonic Family
            </span>
            <span className="text-[10px] text-muted-foreground">Karakter: Rest & Home</span>
          </div>
          <div className="space-y-1.5">
            {tonicChords.map((entry) => {
              const isActive = activeChord?.degree === entry.degree;
              return (
                <button
                  key={`map-${entry.degree}`}
                  type="button"
                  onClick={() => handlePlayChord(entry)}
                  className={`w-full flex items-center justify-between rounded-md p-2 text-left text-xs transition-all ${
                    isActive
                      ? "bg-cyan-500 text-white font-semibold shadow-xs"
                      : "bg-background/80 hover:bg-cyan-500/10 text-foreground border border-border/40"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm">{entry.degree}</span>
                    <span>{entry.chord.name}</span>
                  </div>
                  <span className="text-[10px] opacity-80 font-normal">
                    {entry.role}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Subdominant Column */}
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3 space-y-2">
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Subdominant Family
            </span>
            <span className="text-[10px] text-muted-foreground">Karakter: Movement</span>
          </div>
          <div className="space-y-1.5">
            {subdominantChords.map((entry) => {
              const isActive = activeChord?.degree === entry.degree;
              return (
                <button
                  key={`map-${entry.degree}`}
                  type="button"
                  onClick={() => handlePlayChord(entry)}
                  className={`w-full flex items-center justify-between rounded-md p-2 text-left text-xs transition-all ${
                    isActive
                      ? "bg-emerald-500 text-white font-semibold shadow-xs"
                      : "bg-background/80 hover:bg-emerald-500/10 text-foreground border border-border/40"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm">{entry.degree}</span>
                    <span>{entry.chord.name}</span>
                  </div>
                  <span className="text-[10px] opacity-80 font-normal">
                    {entry.role}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dominant Column */}
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 space-y-2">
          <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              Dominant Family
            </span>
            <span className="text-[10px] text-muted-foreground">Karakter: Tension</span>
          </div>
          <div className="space-y-1.5">
            {dominantChords.map((entry) => {
              const isActive = activeChord?.degree === entry.degree;
              return (
                <button
                  key={`map-${entry.degree}`}
                  type="button"
                  onClick={() => handlePlayChord(entry)}
                  className={`w-full flex items-center justify-between rounded-md p-2 text-left text-xs transition-all ${
                    isActive
                      ? "bg-amber-500 text-white font-semibold shadow-xs"
                      : "bg-background/80 hover:bg-amber-500/10 text-foreground border border-border/40"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm">{entry.degree}</span>
                    <span>{entry.chord.name}</span>
                  </div>
                  <span className="text-[10px] opacity-80 font-normal">
                    {entry.role}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Chord Focus Info */}
      {activeChord && (
        <div className="rounded-lg bg-muted/40 p-3 text-xs space-y-2 border border-border/50">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-foreground">
                {activeChord.degree} · {activeChord.chord.name}
              </span>
              <Badge variant="outline">{activeChord.family} Role</Badge>
              <span className="text-muted-foreground text-[11px]">
                Nada: {activeChord.chord.composed.map((c) => c.note).join(" - ")}
              </span>
            </div>
            <span className="text-muted-foreground text-[11px]">
              Resolusi populer: {activeChord.commonResolutions.slice(0, 2).join(", ")}
            </span>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            {activeChord.description}
          </p>
        </div>
      )}
    </div>
  );
}
