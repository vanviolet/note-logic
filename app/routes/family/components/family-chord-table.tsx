import { Fragment, useCallback, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { FamilyChordEntry } from "~/theory-music/family";
import { Badge } from "~/templates/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/templates/components/ui/table";
import { cn } from "~/templates/lib/utils";
import { useLearnFretboardStore } from "~/shared/stores/learn-fretboard.store";
import { cadentialLabel, familyBadgeVariant } from "../lib/family-utils";

/** Map degree tokens → interval name for inline interval hints */
const DEGREE_INTERVAL_LABEL: Record<string, string> = {
  "1": "R",
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

interface FamilyChordTableProps {
  entries: FamilyChordEntry[];
}

export function FamilyChordTable({ entries }: FamilyChordTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const selectedId = useLearnFretboardStore((s) => s.selectedId);
  const selectFamily = useLearnFretboardStore((s) => s.selectFamily);

  const getRowId = (entry: FamilyChordEntry) =>
    `${entry.degree}-${entry.chord.name}`;

  const handleRowClick = useCallback(
    (entry: FamilyChordEntry) => {
      const id = getRowId(entry);
      setExpandedId((prev) => (prev === id ? null : id));
      selectFamily(entry);
    },
    [selectFamily],
  );

  return (
    <div className="overflow-hidden rounded-xl border border-border/40">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-8" />
            <TableHead>Degree</TableHead>
            <TableHead>Chord</TableHead>
            <TableHead>Family</TableHead>
            <TableHead>Cadential</TableHead>
            <TableHead className="hidden md:table-cell">Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => {
            const rowId = getRowId(entry);
            const isExpanded = expandedId === rowId;
            const isSelected = selectedId === rowId;

            return (
              <Fragment key={rowId}>
                <TableRow
                  className={cn(
                    "cursor-pointer transition-colors",
                    isSelected ? "bg-primary/5" : "hover:bg-muted/50",
                  )}
                  onClick={() => handleRowClick(entry)}
                  tabIndex={0}
                  aria-expanded={isExpanded}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleRowClick(entry);
                    }
                  }}
                >
                  <TableCell className="p-2 pl-3">
                    {isExpanded ? (
                      <ChevronDown className="size-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="size-4 text-muted-foreground" />
                    )}
                  </TableCell>

                  <TableCell className="font-medium">{entry.degree}</TableCell>

                  <TableCell>
                    <span className="font-medium">{entry.chord.name}</span>
                    <span className="text-muted-foreground/60 ml-1 text-xs">
                      ({entry.chord.relatedSeventh})
                    </span>
                    {isSelected ? (
                      <Badge
                        variant="secondary"
                        className="ml-2 h-5 rounded-full px-2 text-[10px]"
                      >
                        Viewing
                      </Badge>
                    ) : null}
                  </TableCell>

                  <TableCell>
                    <Badge variant={familyBadgeVariant(entry.family)}>
                      {entry.family}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    {cadentialLabel(entry.cadentialStrength)}
                  </TableCell>

                  <TableCell className="text-muted-foreground hidden text-sm md:table-cell">
                    {entry.chord.composed.map((t, i) => (
                      <span key={`note-${rowId}-${t.degree}`}>
                        {i > 0 && " · "}
                        {t.note}
                        <span className="text-primary/50 ml-0.5 text-[10px]">
                          {DEGREE_INTERVAL_LABEL[t.degree] ?? t.degree}
                        </span>
                      </span>
                    ))}
                  </TableCell>
                </TableRow>

                {isExpanded ? (
                  <TableRow className="bg-muted/20 hover:bg-muted/20">
                    <TableCell
                      colSpan={6}
                      className="px-6 py-5 whitespace-normal"
                    >
                      <div className="grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {/* Role & Description */}
                        <div className="min-w-0 space-y-2">
                          <p className="text-xs font-medium uppercase tracking-wider">
                            Role &amp; Description
                          </p>
                          <p className="text-sm font-medium">{entry.role}</p>
                          <p className="text-muted-foreground wrap-break-word text-sm">
                            {entry.description}
                          </p>
                        </div>

                        {/* Resolutions + Progressions */}
                        <div className="min-w-0 space-y-3">
                          <div className="space-y-1.5">
                            <p className="text-xs font-medium uppercase tracking-wider">
                              Common Resolutions
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {entry.commonResolutions.map((res) => (
                                <span
                                  key={`res-${rowId}-${res}`}
                                  className="text-muted-foreground rounded-md border border-border/50 px-2 py-0.5 text-xs"
                                >
                                  {res}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <p className="text-xs font-medium uppercase tracking-wider">
                              Progressions
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {entry.progressionUse.map((prog) => (
                                <span
                                  key={`prog-${rowId}-${prog}`}
                                  className="text-muted-foreground rounded-md border border-border/50 px-2 py-0.5 text-xs"
                                >
                                  {prog}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Function Hints */}
                        <div className="min-w-0 space-y-2">
                          <p className="text-xs font-medium uppercase tracking-wider">
                            Function Hints
                          </p>
                          <ul className="text-muted-foreground list-disc space-y-1 pl-4 text-sm">
                            {entry.functionHints.map((hint) => (
                              <li key={`hint-${rowId}-${hint}`}>{hint}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <p className="text-muted-foreground/50 mt-4 text-[11px]">
                        Chord tampil di fretboard panel. Klik baris lain untuk
                        beralih.
                      </p>
                    </TableCell>
                  </TableRow>
                ) : null}
              </Fragment>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
