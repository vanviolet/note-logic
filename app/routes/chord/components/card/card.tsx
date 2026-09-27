import { memo } from "react";
import { Link } from "react-router";
import { Card, CardContent } from "~/templates/components/ui/card";
import type { ChordEntry } from "~/theory-music/chord";
import {
  QUALITY_LABELS,
  degreeLabel,
  qualityColor,
} from "../../lib/chord-utils";
import { ChordCardHeader } from "./header";
import { ChordCardFormula } from "./formula";
import { cn } from "~/templates/lib/utils";
import { degreeColor } from "~/theory-music/core";
import { ChordDiagram } from "~/routes/songbook/components/chord-diagram";
import { PianoChordDiagram } from "~/routes/songbook/components/piano-chord-diagram";

export const ChordCard = memo(function ChordCard({
  chord,
}: {
  chord: ChordEntry;
}) {
  return (
    <Link
      to={`/chord/${chord.id}`}
      className="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      prefetch="intent"
    >
      <Card className="h-full transition-all duration-200 group-hover:border-primary/40 group-hover:shadow-md group-hover:shadow-primary/5">
        <CardContent className="flex flex-col gap-1 ">
          {/* Header: name + badges */}
          <ChordCardHeader chord={chord} />

          {/* Nickname */}

          {/* Formula */}
          <ChordCardFormula chord={chord} />

          {/* Notes / Tones */}
          <div className="flex flex-wrap items-center gap-1">
            {chord.composed.slice(0, 6).map((tone) => (
              <span
                key={`${chord.id}-${tone.degree}`}
                className={cn(
                  "inline-block rounded-md border border-border/60 bg-muted px-1.5 py-0.5 text-[11px] font-medium",
                  degreeColor(tone.degree),
                )}
              >
                {tone.note}
                <span className="text-muted-foreground ml-0.5 text-[9px] font-normal">
                  {degreeLabel(tone.degree)}
                </span>
              </span>
            ))}
          </div>

          {/* Tags row: quality + root */}
          <div className="flex flex-wrap gap-1 pt-1">
            <span
              className={cn(
                "inline-block rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground capitalize",
                qualityColor(chord.quality),
              )}
            >
              {QUALITY_LABELS[chord.quality] ?? chord.quality}
            </span>
            {/* <span className="inline-block rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
              Root: {chord.root}
            </span> */}
            {chord.containsTritone && (
              <span className="inline-block rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] text-amber-600 dark:text-amber-400">
                Tritone
              </span>
            )}
          </div>
          <div className="flex ">
            <ChordDiagram
              guitarPosition="horizontal"
              hideChordName
              hideFingerPicking
              chord={chord.name}
              width={110}
              showPositions={false}
            />
            <PianoChordDiagram chord={chord.name} />
          </div>
          {/* Function hint */}
          {chord.functionHints[0] && (
            <p className="text-[11px] text-muted-foreground/70 italic line-clamp-2 pt-0.5">
              {chord.functionHints[0]}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
});
