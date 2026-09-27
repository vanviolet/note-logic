import { ChevronDown, ChevronUp, BookOpen } from "lucide-react";
import { memo, useCallback, useState } from "react";
import { Link } from "react-router";
import type { FamilyChordEntry } from "~/theory-music/family";
import { Badge } from "~/templates/components/ui/badge";
import { cn } from "~/templates/lib/utils";
import { useLearnFretboardStore } from "~/shared/stores/learn-fretboard.store";
import { cadentialLabel, familyBadgeVariant } from "../lib/family-utils";

interface FamilyChordCardProps {
  entry: FamilyChordEntry;
}

/** Map degree tokens → interval name for inline interval hints */
const DEGREE_INTERVAL_LABEL: Record<string, string> = {
  "1": "Root",
  "♭2": "m2",
  "2": "M2",
  "♭3": "m3",
  "3": "M3",
  "4": "P4",
  "♯4": "TT",
  "♭5": "TT",
  "5": "P5",
  "♯5": "m6",
  "♭6": "m6",
  "6": "M6",
  "♭7": "m7",
  "7": "M7",
};

/** Relevant nolopedia terms per family type */
const FAMILY_GLOSSARY: Record<string, { id: string; label: string }[]> = {
  Tonic: [
    { id: "tonic", label: "Tonic" },
    { id: "functional-harmony", label: "Harmonic Function" },
  ],
  Subdominant: [
    { id: "subdominant", label: "Subdominant" },
    { id: "predominant", label: "Predominant" },
  ],
  Dominant: [
    { id: "dominant", label: "Dominant" },
    { id: "cadence", label: "Cadence" },
    { id: "resolution", label: "Resolution" },
  ],
};

function FamilyChordCardComponent({ entry }: FamilyChordCardProps) {
  const selectedId = `${entry.degree}-${entry.chord.name}`;
  const isSelected = useLearnFretboardStore((s) => s.selectedId === selectedId);
  const selectFamily = useLearnFretboardStore((s) => s.selectFamily);
  const [isExpanded, setIsExpanded] = useState(false);

  /** Root note of this chord (derived from composed tones) */
  const rootNote =
    entry.chord.composed.find((t) => t.degree === "1")?.note ?? "C";

  const handleToggle = useCallback(() => {
    setIsExpanded((prev) => !prev);
    selectFamily(entry);
  }, [entry, selectFamily]);

  const glossaryTerms = FAMILY_GLOSSARY[entry.family] ?? [];

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
        aria-label={`Toggle ${entry.degree} ${entry.chord.name} details`}
      >
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h3 className="text-2xl font-semibold tracking-tight">
              {entry.degree} · {entry.chord.name}
            </h3>
            <span className="text-muted-foreground/70 text-sm">
              {entry.chord.relatedSeventh}
            </span>
            <Badge variant={familyBadgeVariant(entry.family)}>
              {entry.family}
            </Badge>
            <span className="text-muted-foreground text-sm">
              Cadential: {cadentialLabel(entry.cadentialStrength)}
            </span>
            {isSelected && (
              <Badge
                variant="secondary"
                className="ml-auto h-5 rounded-full px-2 text-[10px] font-medium"
              >
                Viewing
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {entry.description}
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

          {/* ── Tones with interval labels ── */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-muted-foreground mr-1 text-xs uppercase tracking-wider">
              Tones
            </span>
            {entry.chord.composed.map((tone) => (
              <span
                key={`${entry.degree}-${tone.degree}-${tone.note}`}
                className="text-foreground/80 rounded-md border border-border/60 px-2 py-0.5 text-xs font-medium"
              >
                {tone.note}
                <span className="text-muted-foreground ml-0.5 font-normal">
                  ({tone.degree})
                </span>
                {DEGREE_INTERVAL_LABEL[tone.degree] && tone.degree !== "1" && (
                  <span className="text-primary/60 ml-0.5 text-[10px]">
                    {DEGREE_INTERVAL_LABEL[tone.degree]}
                  </span>
                )}
              </span>
            ))}
          </div>

          {/* ── Detail sections ── */}
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Function Hints */}
            <div className="space-y-1.5">
              <p className="text-xs font-medium uppercase tracking-wider">
                Function Hints
              </p>
              <ul className="text-muted-foreground list-disc space-y-0.5 pl-4 text-sm">
                {entry.functionHints.map((hint) => (
                  <li key={`${entry.degree}-hint-${hint}`}>{hint}</li>
                ))}
              </ul>
            </div>

            {/* Resolutions + Progressions */}
            <div className="space-y-3">
              <div className="space-y-1.5">
                <p className="text-xs font-medium uppercase tracking-wider">
                  Common Resolutions
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {entry.commonResolutions.map((move) => (
                    <span
                      key={`${entry.degree}-resolve-${move}`}
                      className="text-muted-foreground rounded-md border border-border/50 px-2 py-0.5 text-xs"
                    >
                      {move}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <p className="text-xs font-medium uppercase tracking-wider">
                  Progressions
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {entry.progressionUse.map((prog) => (
                    <span
                      key={`${entry.degree}-prog-${prog}`}
                      className="text-muted-foreground rounded-md border border-border/50 px-2 py-0.5 text-xs"
                    >
                      {prog}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <p className="text-xs font-medium uppercase tracking-wider">
                  Borrowed Alternatives
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {entry.borrowedAlternatives.map((alt) => (
                    <span
                      key={`${entry.degree}-alt-${alt}`}
                      className="text-muted-foreground rounded-md border border-border/50 px-2 py-0.5 text-xs"
                    >
                      {alt}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Nolopedia glossary links ── */}
          {glossaryTerms.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs font-medium uppercase tracking-wider">
                Pelajari di Nolopedia
              </p>
              <div className="flex flex-wrap gap-1.5">
                {glossaryTerms.map((term) => (
                  <Link
                    key={`glossary-${entry.degree}-${term.id}`}
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
          )}

          {/* ── Status ── */}
          <p className="text-muted-foreground/60 text-[11px]">
            {isSelected
              ? "Chord ini sedang tampil di fretboard panel."
              : "Klik header untuk pilih chord ini di fretboard panel."}
          </p>

          {/* ── Navigation links ── */}
          <div
            className="flex gap-3 border-t border-border/30 pt-3"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <Link
              to={`/chord?root=${encodeURIComponent(rootNote)}`}
              prefetch="intent"
              className="text-muted-foreground hover:text-foreground text-xs underline underline-offset-4 transition-colors"
            >
              Chords →
            </Link>
            <Link
              to={`/interval?root=${encodeURIComponent(rootNote)}`}
              prefetch="intent"
              className="text-muted-foreground hover:text-foreground text-xs underline underline-offset-4 transition-colors"
            >
              Intervals →
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export const FamilyChordCard = memo(FamilyChordCardComponent);
