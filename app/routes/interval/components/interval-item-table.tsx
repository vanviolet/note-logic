import { Fragment, useCallback, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { GeneratedInterval } from "~/theory-music/interval";
import { Badge } from "~/templates/components/ui/badge";
import { Progress } from "~/templates/components/ui/progress";
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
import { consonancePillVariant } from "../lib/interval-utils";

interface IntervalItemTableProps {
  intervals: GeneratedInterval[];
}

export function IntervalItemTable({ intervals }: IntervalItemTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const selectedId = useLearnFretboardStore((s) => s.selectedId);
  const selectInterval = useLearnFretboardStore((s) => s.selectInterval);

  const handleRowClick = useCallback(
    (interval: GeneratedInterval) => {
      setExpandedId((prev) =>
        prev === interval.short ? null : interval.short,
      );
      selectInterval(interval);
    },
    [selectInterval],
  );

  return (
    <div className="overflow-hidden rounded-xl border border-border/40">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-8" />
            <TableHead>Name</TableHead>
            <TableHead>Symbol</TableHead>
            <TableHead>Semitones</TableHead>
            <TableHead>Consonance</TableHead>
            <TableHead className="hidden md:table-cell">Root → Note</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {intervals.map((interval) => {
            const isExpanded = expandedId === interval.short;
            const isSelected = selectedId === interval.short;

            return (
              <Fragment key={interval.short}>
                <TableRow
                  className={cn(
                    "cursor-pointer transition-colors",
                    isSelected ? "bg-primary/5" : "hover:bg-muted/50",
                  )}
                  onClick={() => handleRowClick(interval)}
                  tabIndex={0}
                  aria-expanded={isExpanded}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleRowClick(interval);
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

                  <TableCell className="font-medium">
                    <span>{interval.name}</span>
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
                    <span className="text-sm font-medium">
                      {interval.short}
                    </span>
                  </TableCell>

                  <TableCell>{interval.semitone}</TableCell>

                  <TableCell>
                    <Badge variant={consonancePillVariant(interval.consonance)}>
                      {interval.consonance}
                    </Badge>
                  </TableCell>

                  <TableCell className="hidden text-sm md:table-cell">
                    {interval.root} → {interval.note}
                  </TableCell>
                </TableRow>

                {isExpanded ? (
                  <TableRow className="bg-muted/20 hover:bg-muted/20">
                    <TableCell
                      colSpan={6}
                      className="px-6 py-5 whitespace-normal"
                    >
                      <div className="grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {/* Anatomy */}
                        <div className="min-w-0 space-y-2">
                          <p className="text-xs font-medium uppercase tracking-wider">
                            Interval Anatomy
                          </p>
                          <div className="grid grid-cols-2 gap-1.5 text-sm">
                            <span className="text-muted-foreground">Cents</span>
                            <span className="font-medium">
                              {interval.cents}
                            </span>
                            <span className="text-muted-foreground">Ratio</span>
                            <span className="font-medium">
                              {interval.ratioApprox}
                            </span>
                            <span className="text-muted-foreground">
                              Inversion
                            </span>
                            <span className="wrap-break-word font-medium">
                              {interval.inversionName} (
                              {interval.inversionShort})
                            </span>
                          </div>
                          <div className="mt-2 space-y-1">
                            <p className="text-muted-foreground text-xs">
                              Distance
                            </p>
                            <Progress value={(interval.semitone / 12) * 100} />
                          </div>
                        </div>

                        {/* How to Use */}
                        <div className="min-w-0 space-y-2">
                          <p className="text-xs font-medium uppercase tracking-wider">
                            How to Use
                          </p>
                          <ul className="text-muted-foreground list-disc space-y-1 pl-4 text-sm">
                            {interval.functionHints.map((hint) => (
                              <li
                                key={`hint-table-${interval.short}-${hint}`}
                                className="wrap-break-word"
                              >
                                {hint}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Description */}
                        <div className="min-w-0 space-y-2">
                          <p className="text-xs font-medium uppercase tracking-wider">
                            Description
                          </p>
                          <p className="text-muted-foreground wrap-break-word text-sm">
                            {interval.description}
                          </p>
                          {interval.aliases?.length ? (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {interval.aliases.map((alias) => (
                                <span
                                  key={`alias-table-${interval.short}-${alias}`}
                                  className="text-muted-foreground/70 rounded-md border border-border/50 px-2 py-0.5 text-xs"
                                >
                                  {alias}
                                </span>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      </div>

                      <p className="text-muted-foreground/50 mt-4 text-[11px]">
                        Interval tampil di fretboard panel. Klik baris lain
                        untuk beralih.
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
