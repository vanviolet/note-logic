// ════════════════════════════════════════════════════════
// Circle of Fifths — Key Modulation & Pivot Chord Finder
// ════════════════════════════════════════════════════════

import { useMemo, useState } from "react";
import {
  ArrowRight,
  Shuffle,
  Volume2,
  Play,
  Lightbulb,
  Compass,
  Sparkles,
  Layers,
} from "lucide-react";
import {
  CIRCLE_KEYS,
  calculateModulationPath,
  type CircleKeyData,
} from "~/theory-music/circle-of-fifths/circle-data";
import { circleAudio } from "~/theory-music/circle-of-fifths/circle-audio";
import { Button } from "~/templates/components/ui/button";
import { Badge } from "~/templates/components/ui/badge";
import { cn } from "~/templates/lib/utils";

interface ModulationFinderProps {
  currentKeyIndex: number;
  onSelectKey: (index: number) => void;
  className?: string;
}

export function CircleModulationFinder({
  currentKeyIndex,
  onSelectKey,
  className,
}: ModulationFinderProps) {
  const [targetKeyIndex, setTargetKeyIndex] = useState<number>(
    (currentKeyIndex + 1) % 12,
  );

  const fromKey = CIRCLE_KEYS[currentKeyIndex];
  const toKey = CIRCLE_KEYS[targetKeyIndex];

  const modulationInfo = useMemo(() => {
    return calculateModulationPath(currentKeyIndex, targetKeyIndex);
  }, [currentKeyIndex, targetKeyIndex]);

  // Play audio demonstration of pivot chord modulation
  const handlePlayModulationDemo = () => {
    // If there is a pivot chord, play:
    // I (fromKey) -> IV (fromKey) -> PivotChord -> V7 (toKey) -> I (toKey)
    const fromI = fromKey.diatonicChords[0].notes;
    const fromIV = fromKey.diatonicChords[3].notes;
    const toV = toKey.diatonicChords[4].notes;
    const toI = toKey.diatonicChords[0].notes;

    if (modulationInfo.pivotChords.length > 0) {
      const pivotChordName = modulationInfo.pivotChords[0].name;
      const pivotChord =
        fromKey.diatonicChords.find((c) => c.name === pivotChordName) ||
        toKey.diatonicChords.find((c) => c.name === pivotChordName);
      const pivotNotes = pivotChord ? pivotChord.notes : fromIV;

      circleAudio.playCadenceChords([fromI, fromIV, pivotNotes, toV, toI], 90);
    } else {
      // Secondary dominant approach: I(from) -> ii-V(target) -> I(target)
      const targetii = toKey.diatonicChords[1].notes;
      circleAudio.playCadenceChords([fromI, targetii, toV, toI], 90);
    }
  };

  return (
    <div className={cn("space-y-5 p-5 rounded-xl border border-border/80 bg-card/60 backdrop-blur", className)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Shuffle className="size-4 text-primary" />
            <h3 className="font-bold text-base text-foreground">
              Key Modulation & Pivot Chord Finder
            </h3>
          </div>
          <p className="text-xs text-muted-foreground">
            Temukan jembatan harmonis (pivot chord) dan rute terindah untuk berpindah key (modulasi) pada lagu.
          </p>
        </div>

        <Button
          size="sm"
          variant="default"
          onClick={handlePlayModulationDemo}
          className="h-8 gap-1.5 text-xs font-semibold"
        >
          <Play className="size-3.5 fill-current" />
          Dengar Modulasi ({fromKey.majorKey} → {toKey.majorKey})
        </Button>
      </div>

      {/* Dual Key Picker Selector Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* From Key */}
        <div className="p-3 rounded-lg border border-border/70 bg-background/50 space-y-1.5">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Key Asal (Origin Key):
          </span>
          <div className="flex items-center gap-2">
            <select
              value={currentKeyIndex}
              onChange={(e) => onSelectKey(Number(e.target.value))}
              className="flex-1 h-9 rounded-md border border-border bg-card px-3 text-sm font-bold text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
            >
              {CIRCLE_KEYS.map((k) => (
                <option key={k.majorKey} value={k.index}>
                  {k.majorKey} Major ({k.accidentalsCount} {k.accidentalType}) · rel: {k.relativeMinor}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* To Key */}
        <div className="p-3 rounded-lg border border-border/70 bg-background/50 space-y-1.5">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Key Target (Destination Key):
          </span>
          <div className="flex items-center gap-2">
            <select
              value={targetKeyIndex}
              onChange={(e) => setTargetKeyIndex(Number(e.target.value))}
              className="flex-1 h-9 rounded-md border border-border bg-card px-3 text-sm font-bold text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
            >
              {CIRCLE_KEYS.map((k) => (
                <option key={k.majorKey} value={k.index}>
                  {k.majorKey} Major ({k.accidentalsCount} {k.accidentalType}) · rel: {k.relativeMinor}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Modulation Distance & Theory Analysis Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3 rounded-xl border border-border/60 bg-background/40 space-y-1">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
            Jarak di Lingkaran Kuint
          </span>
          <div className="text-xl font-extrabold text-foreground flex items-center gap-1.5">
            <span>{modulationInfo.absSteps} Langkah</span>
            <span className="text-xs font-normal text-muted-foreground">
              ({modulationInfo.direction})
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            {modulationInfo.absSteps <= 1
              ? "Sangat dekat dan bersahabat (Diatonic Neighbor)"
              : modulationInfo.absSteps === 6
              ? "Jarak terjauh 180° (Tritone Polar Opposite)"
              : "Modulasi menengah/jauh (Chromatic Shift)"}
          </p>
        </div>

        <div className="p-3 rounded-xl border border-border/60 bg-background/40 space-y-1">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
            Hubungan Tonal
          </span>
          <div className="text-base font-bold text-primary">
            {modulationInfo.relationship}
          </div>
          <p className="text-[11px] text-muted-foreground">
            {fromKey.accidentalsCount} {fromKey.accidentalType} vs {toKey.accidentalsCount} {toKey.accidentalType}
          </p>
        </div>

        <div className="p-3 rounded-xl border border-border/60 bg-background/40 space-y-1">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
            Strategi Rekomendasi
          </span>
          <p className="text-xs text-foreground font-medium">
            {modulationInfo.technique}
          </p>
        </div>
      </div>

      {/* Shared Pivot Chords Matrix */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Sparkles className="size-3.5 text-amber-400" />
            Shared Pivot Chords ({modulationInfo.pivotChords.length} Ditemukan)
          </h4>
        </div>

        {modulationInfo.pivotChords.length === 0 ? (
          <div className="p-4 rounded-xl border border-dashed border-border/80 text-center text-xs text-muted-foreground space-y-1">
            <p>Kedua key tidak berbagi chord diatonic langsung (jarak cukup jauh).</p>
            <p className="text-foreground font-medium">
              Gunakan teknik <strong>Secondary Dominant (V7/{toKey.majorKey})</strong> atau <strong>ii–V Target ({toKey.diatonicChords[1].name} → {toKey.diatonicChords[4].name} → {toKey.majorKey})</strong> untuk berpindah secara mulus.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {modulationInfo.pivotChords.map((p) => (
              <div
                key={p.name}
                className="p-3 rounded-xl border border-primary/30 bg-primary/5 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-foreground">{p.name}</span>
                  <Badge variant="secondary" className="text-[10px] font-mono">
                    {p.fromDegree} = {p.toDegree}
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground leading-snug">
                  {p.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recommended Step-by-Step Modulation Recipe */}
      <div className="p-4 rounded-xl border border-border/70 bg-muted/20 space-y-2 text-xs">
        <div className="font-semibold text-foreground flex items-center gap-1.5">
          <Lightbulb className="size-3.5 text-amber-400" />
          <span>Resep Modulasi Praktis ({fromKey.majorKey} ke {toKey.majorKey}):</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs pt-1">
          <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-300 font-bold">
            {fromKey.majorKey} (Key 1)
          </span>
          <ArrowRight className="size-3 text-muted-foreground" />
          {modulationInfo.pivotChords.length > 0 ? (
            <span className="px-2 py-1 rounded bg-purple-500/20 text-purple-300 font-bold">
              {modulationInfo.pivotChords[0].name} (Pivot)
            </span>
          ) : (
            <span className="px-2 py-1 rounded bg-purple-500/20 text-purple-300 font-bold">
              {toKey.diatonicChords[1].name} (ii Target)
            </span>
          )}
          <ArrowRight className="size-3 text-muted-foreground" />
          <span className="px-2 py-1 rounded bg-amber-500/20 text-amber-300 font-bold">
            {toKey.diatonicChords[4].name} (V7 Target)
          </span>
          <ArrowRight className="size-3 text-muted-foreground" />
          <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 font-bold">
            {toKey.majorKey} (Key 2 Baru!)
          </span>
        </div>
      </div>
    </div>
  );
}
