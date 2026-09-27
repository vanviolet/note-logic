import { useState } from "react";
import { Scale, Volume2, ArrowRightLeft, Sparkles } from "lucide-react";
import type { GeneratedInterval } from "~/theory-music/interval";
import { Button } from "~/templates/components/ui/button";
import { Badge } from "~/templates/components/ui/badge";
import { circleAudio } from "~/theory-music/circle-of-fifths/circle-audio";
import { useLearnFretboardStore } from "~/shared/stores/learn-fretboard.store";

interface IntervalComparatorProps {
  intervals: GeneratedInterval[];
  root: string;
}

export function IntervalComparator({
  intervals,
  root,
}: IntervalComparatorProps) {
  const [selectedShorts, setSelectedShorts] = useState<string[]>(["M3", "m3"]);
  const [playingShort, setPlayingShort] = useState<string | null>(null);

  const selectInterval = useLearnFretboardStore((s) => s.selectInterval);

  const toggleIntervalSelection = (short: string) => {
    if (selectedShorts.includes(short)) {
      if (selectedShorts.length > 1) {
        setSelectedShorts((prev) => prev.filter((s) => s !== short));
      }
    } else {
      if (selectedShorts.length < 3) {
        setSelectedShorts((prev) => [...prev, short]);
      } else {
        setSelectedShorts((prev) => [...prev.slice(1), short]);
      }
    }
  };

  const currentSelectedObjects = selectedShorts
    .map((s) => intervals.find((i) => i.short === s))
    .filter((i): i is GeneratedInterval => Boolean(i));

  const handlePlaySingle = (item: GeneratedInterval) => {
    setPlayingShort(item.short);
    selectInterval(item);
    circleAudio.playNoteSequence([item.root, item.note], 0.4);
    setTimeout(() => setPlayingShort(null), 900);
  };

  const handlePlayCompareSequentially = () => {
    if (currentSelectedObjects.length === 0) return;
    let idx = 0;

    const playNext = () => {
      if (idx >= currentSelectedObjects.length) {
        setPlayingShort(null);
        return;
      }
      const item = currentSelectedObjects[idx];
      if (item) {
        setPlayingShort(item.short);
        selectInterval(item);
        circleAudio.playNoteSequence([item.root, item.note], 0.35);
      }
      idx += 1;
      setTimeout(playNext, 1000);
    };

    playNext();
  };

  return (
    <div className="rounded-xl border border-border/80 bg-card/60 p-5 shadow-xs backdrop-blur space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/50 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Scale className="size-4 text-emerald-500" />
            <h2 className="text-lg font-semibold tracking-tight">
              Komparator Interval Side-by-Side ({root})
            </h2>
          </div>
          <p className="text-muted-foreground text-xs mt-0.5">
            Bandingkan 2 sampai 3 interval secara bersamaan untuk mendengarkan beda warna emosi, jarak semitone, dan rasio suaranya.
          </p>
        </div>

        <Button
          size="sm"
          className="gap-2 shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white"
          onClick={handlePlayCompareSequentially}
          disabled={currentSelectedObjects.length === 0}
        >
          <Volume2 className="size-4" />
          Bandingkan Suara
        </Button>
      </div>

      {/* Selector Pills */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-muted-foreground">
          Pilih Interval untuk Dibandingkan (Maks 3):
        </p>
        <div className="flex flex-wrap gap-1.5">
          {intervals.map((item) => {
            const isSelected = selectedShorts.includes(item.short);
            return (
              <button
                key={`comp-pick-${item.short}`}
                type="button"
                onClick={() => toggleIntervalSelection(item.short)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  isSelected
                    ? "bg-primary text-primary-foreground font-bold shadow-xs scale-105"
                    : "bg-background border border-border/70 hover:bg-muted text-foreground/80"
                }`}
              >
                {item.short} ({item.name})
              </button>
            );
          })}
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {currentSelectedObjects.map((item) => {
          const isPlayingThis = playingShort === item.short;
          return (
            <div
              key={`comp-col-${item.short}`}
              className={`rounded-xl border p-4 space-y-3 transition-all ${
                isPlayingThis
                  ? "border-emerald-500 bg-emerald-500/10 shadow-md ring-2 ring-emerald-500/50"
                  : "border-border/80 bg-background/80"
              }`}
            >
              <div className="flex items-center justify-between border-b border-border/50 pb-2">
                <div>
                  <h3 className="font-bold text-base text-foreground">
                    {item.name} ({item.short})
                  </h3>
                  <p className="text-xs font-mono text-primary">
                    {item.root} → {item.note}
                  </p>
                </div>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => handlePlaySingle(item)}
                  title="Dengarkan Interval Ini"
                >
                  <Volume2 className={`size-4 ${isPlayingThis ? "animate-pulse text-emerald-500" : ""}`} />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded bg-muted/40 p-2">
                  <span className="text-muted-foreground block text-[10px]">Jarak Semitone:</span>
                  <span className="font-bold font-mono text-sm">{item.semitone} st</span>
                </div>
                <div className="rounded bg-muted/40 p-2">
                  <span className="text-muted-foreground block text-[10px]">Cents / Ratio:</span>
                  <span className="font-bold font-mono text-sm">{item.ratioApprox}</span>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider">
                  Tingkat Konsonansi:
                </span>
                <Badge variant="outline" className="w-full justify-center capitalize">
                  {item.consonance.replace("-", " ")}
                </Badge>
              </div>

              <div className="space-y-1 text-xs">
                <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider">
                  Karakter & Deskripsi:
                </span>
                <p className="text-muted-foreground leading-relaxed text-[11px] line-clamp-3">
                  {item.description}
                </p>
              </div>

              {item.songExamples?.length ? (
                <div className="rounded bg-muted/30 p-2 text-xs space-y-0.5 border border-border/40">
                  <span className="text-[10px] text-muted-foreground font-semibold">
                    Song Hook Mnemonic:
                  </span>
                  <p className="font-semibold text-[11px]">
                    {item.songExamples[0].title}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {item.songExamples[0].artist}
                  </p>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
