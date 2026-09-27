import { BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import { memo, useCallback, useState } from "react";
import { Link } from "react-router";
import type { GeneratedInterval } from "~/theory-music/interval";
import { Badge } from "~/templates/components/ui/badge";
import { Progress } from "~/templates/components/ui/progress";
import { cn } from "~/templates/lib/utils";
import { useLearnFretboardStore } from "~/shared/stores/learn-fretboard.store";
import { consonancePillVariant } from "../lib/interval-utils";

/** Map interval short names → nolopedia dictionary entry IDs */
const INTERVAL_NOLOPEDIA_MAP: Record<string, { id: string; label: string }> = {
  P1: { id: "perfect-unison", label: "Perfect Unison" },
  m2: { id: "minor-second", label: "Minor Second" },
  M2: { id: "major-second", label: "Major Second" },
  m3: { id: "minor-third", label: "Minor Third" },
  M3: { id: "major-third", label: "Major Third" },
  P4: { id: "perfect-fourth", label: "Perfect Fourth" },
  TT: { id: "tritone", label: "Tritone" },
  P5: { id: "perfect-fifth", label: "Perfect Fifth" },
  m6: { id: "minor-sixth", label: "Minor Sixth" },
  M6: { id: "major-sixth", label: "Major Sixth" },
  m7: { id: "minor-seventh", label: "Minor Seventh" },
  M7: { id: "major-seventh", label: "Major Seventh" },
  P8: { id: "interval", label: "Octave / Interval" },
};

/** Cross-cutting glossary terms relevant to all intervals */
const COMMON_GLOSSARY = [
  { id: "consonance", label: "Consonance" },
  { id: "dissonance", label: "Dissonance" },
];

interface IntervalLearningCardProps {
  interval: GeneratedInterval;
}

function IntervalLearningCardComponent({
  interval,
}: IntervalLearningCardProps) {
  const [isExpanded, setIsExpanded] = useState(interval.short === "P1");

  const isSelected = useLearnFretboardStore(
    (s) => s.selectedId === interval.short,
  );
  const selectInterval = useLearnFretboardStore((s) => s.selectInterval);

  const handleToggle = useCallback(() => {
    setIsExpanded((prev) => !prev);
    selectInterval(interval);
  }, [interval, selectInterval]);

  return (
    <div
      className={cn(
        "rounded-xl border border-transparent px-5 py-5 transition-all duration-200",
        isSelected ? "border-primary/40 bg-primary/4" : "hover:bg-muted/40",
      )}
    >
      {/* ── Header (clickable toggle) ── */}
      <button
        type="button"
        onClick={handleToggle}
        className="flex w-full items-start justify-between gap-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
        aria-expanded={isExpanded}
        aria-label={`Toggle ${interval.name} details`}
      >
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h3 className="text-2xl font-semibold tracking-tight">
              {interval.name}
            </h3>
            <span className="text-muted-foreground text-sm font-medium">
              {interval.short}
            </span>
            <span className="text-muted-foreground/50 text-sm">·</span>
            <span className="text-muted-foreground/70 text-sm">
              {interval.root} → {interval.note}
            </span>
            <Badge variant={consonancePillVariant(interval.consonance)}>
              {interval.consonance}
            </Badge>
            {isSelected && (
              <Badge
                variant="secondary"
                className="ml-1 h-5 rounded-full px-2 text-[10px] font-medium"
              >
                Viewing
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {interval.description}
          </p>
        </div>

        <div className="text-muted-foreground shrink-0 pt-1">
          {isExpanded ? (
            <ChevronUp className="size-5" />
          ) : (
            <ChevronDown className="size-5" />
          )}
        </div>
      </button>

      {/* ── Expanded detail ── */}
      {isExpanded ? (
        <div className="mt-4 space-y-5">
          <div className="bg-border/50 h-px" />

          <div className="grid gap-6 md:grid-cols-2">
            {/* Left: Anatomy */}
            <div className="space-y-3">
              <p className="text-xs font-medium uppercase tracking-wider">
                Interval Anatomy
              </p>
              <div className="grid grid-cols-2 gap-1.5 text-sm">
                <span className="text-muted-foreground">Semitone</span>
                <span className="font-medium">{interval.semitone}</span>
                <span className="text-muted-foreground">Cents</span>
                <span className="font-medium">{interval.cents}</span>
                <span className="text-muted-foreground">Ratio Approx</span>
                <span className="font-medium">{interval.ratioApprox}</span>
                <span className="text-muted-foreground">Inversion</span>
                <span className="font-medium">
                  {interval.inversionName} ({interval.inversionShort})
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs">Distance</p>
                <Progress value={(interval.semitone / 12) * 100} />
              </div>
            </div>

            {/* Right: How to Use */}
            <div className="space-y-3">
              <p className="text-xs font-medium uppercase tracking-wider">
                How to Use
              </p>
              <ul className="text-muted-foreground list-disc space-y-1 pl-4 text-sm">
                {interval.functionHints.map((hint) => (
                  <li key={`hint-${interval.short}-${hint}`}>{hint}</li>
                ))}
              </ul>

              {interval.songExamples?.length ? (
                <div className="pt-1">
                  <p className="text-xs font-medium uppercase tracking-wider">
                    Song References
                  </p>
                  <ul className="mt-1.5 space-y-1 text-sm">
                    {interval.songExamples.map((song) => (
                      <li
                        key={`song-${interval.short}-${song.title}`}
                        className="text-muted-foreground"
                      >
                        <span className="text-foreground font-medium">
                          {song.title}
                        </span>{" "}
                        · {song.artist}
                        {song.note ? ` — ${song.note}` : ""}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>

          {/* ── Nolopedia glossary links ── */}
          <div className="space-y-1.5">
            <p className="text-xs font-medium uppercase tracking-wider">
              Pelajari di Nolopedia
            </p>
            <div className="flex flex-wrap gap-1.5">
              {INTERVAL_NOLOPEDIA_MAP[interval.short] && (
                <Link
                  key={`nolo-${interval.short}`}
                  to={`/nolopedia/${INTERVAL_NOLOPEDIA_MAP[interval.short].id}`}
                  prefetch="intent"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 rounded-md border border-emerald-500/20 px-2 py-0.5 text-xs font-medium transition-colors hover:bg-emerald-500/10 hover:border-emerald-500/40"
                >
                  <BookOpen className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                  {INTERVAL_NOLOPEDIA_MAP[interval.short].label}
                </Link>
              )}
              {COMMON_GLOSSARY.map((term) => (
                <Link
                  key={`nolo-common-${term.id}`}
                  to={`/nolopedia/${term.id}`}
                  prefetch="intent"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 rounded-md border border-emerald-500/20 px-2 py-0.5 text-xs font-medium transition-colors hover:bg-emerald-500/10 hover:border-emerald-500/40"
                >
                  <BookOpen className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                  {term.label}
                </Link>
              ))}
            </div>
          </div>

          <p className="text-muted-foreground/60 text-[11px]">
            {isSelected
              ? "Interval ini sedang tampil di fretboard panel."
              : "Klik header untuk pilih interval ini di fretboard panel."}
          </p>

          {/* Cross-navigation links */}
          <div
            className="flex gap-3 border-t border-border/30 pt-3"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <Link
              to={`/chord?root=${encodeURIComponent(interval.root)}`}
              prefetch="intent"
              className="text-muted-foreground hover:text-foreground text-xs underline underline-offset-4 transition-colors"
            >
              Chords →
            </Link>
            <Link
              to={`/family?root=${encodeURIComponent(interval.root)}`}
              prefetch="intent"
              className="text-muted-foreground hover:text-foreground text-xs underline underline-offset-4 transition-colors"
            >
              Family →
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export const IntervalLearningCard = memo(IntervalLearningCardComponent);
