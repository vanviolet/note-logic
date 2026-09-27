import { useState } from "react";
import { Music, Volume2, Sparkles, BookOpen } from "lucide-react";
import type { GeneratedInterval } from "~/theory-music/interval";
import { Button } from "~/templates/components/ui/button";
import { Badge } from "~/templates/components/ui/badge";
import { circleAudio } from "~/theory-music/circle-of-fifths/circle-audio";
import { useLearnFretboardStore } from "~/shared/stores/learn-fretboard.store";

interface IntervalSongHookGuideProps {
  intervals: GeneratedInterval[];
  root: string;
}

export function IntervalSongHookGuide({
  intervals,
  root,
}: IntervalSongHookGuideProps) {
  const [playingShort, setPlayingShort] = useState<string | null>(null);
  const selectInterval = useLearnFretboardStore((s) => s.selectInterval);

  const handlePlayIntervalSong = (item: GeneratedInterval) => {
    setPlayingShort(item.short);
    selectInterval(item);
    circleAudio.playNoteSequence([item.root, item.note], 0.38);
    setTimeout(() => setPlayingShort(null), 900);
  };

  return (
    <div className="rounded-xl border border-border/80 bg-card/60 p-5 shadow-xs backdrop-blur space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/50 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Music className="size-4 text-amber-500" />
            <h2 className="text-lg font-semibold tracking-tight">
              Panduan Song Hooks & Ear Mnemonics ({root})
            </h2>
          </div>
          <p className="text-muted-foreground text-xs mt-0.5">
            Trik termudah melatih pendengaran interval adalah dengan mengingat frasa awal melodi lagu-lagu legendaris.
          </p>
        </div>
      </div>

      {/* Song Mnemonics Grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {intervals.map((item) => {
          const song = item.songExamples?.[0];
          const isPlayingThis = playingShort === item.short;

          return (
            <div
              key={`hook-${item.short}`}
              className={`flex flex-col justify-between rounded-xl border p-3.5 space-y-3 transition-all ${
                isPlayingThis
                  ? "border-amber-500 bg-amber-500/10 shadow-xs ring-1 ring-amber-500/50"
                  : "border-border/70 bg-background/80 hover:border-primary/40"
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-amber-600 dark:text-amber-400">
                      {item.short}
                    </span>
                    <span className="font-semibold text-xs text-foreground">
                      {item.name}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-[10px] font-mono">
                    {item.root} → {item.note}
                  </Badge>
                </div>

                {song ? (
                  <div className="rounded-lg bg-muted/40 p-2.5 border border-border/40 space-y-1">
                    <p className="font-bold text-xs text-foreground flex items-center justify-between">
                      <span>{song.title}</span>
                      <span className="text-[10px] text-muted-foreground font-normal">
                        {song.artist}
                      </span>
                    </p>
                    {song.note && (
                      <p className="text-[11px] text-muted-foreground leading-snug">
                        {song.note}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="rounded-lg bg-muted/20 p-2.5 text-xs text-muted-foreground italic">
                    {item.description.slice(0, 80)}...
                  </div>
                )}
              </div>

              <Button
                size="sm"
                variant="outline"
                className="w-full gap-2 text-xs"
                onClick={() => handlePlayIntervalSong(item)}
              >
                <Volume2 className={`size-3.5 ${isPlayingThis ? "animate-pulse text-amber-500" : ""}`} />
                Dengarkan Interval ({item.short})
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
