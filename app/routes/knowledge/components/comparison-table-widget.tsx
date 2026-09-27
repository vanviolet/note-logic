// ════════════════════════════════════════════════════════
// Knowledge – Comparison Table Widget
// ════════════════════════════════════════════════════════

import { useState } from "react";
import { BarChart3 } from "lucide-react";
import { cn } from "~/templates/lib/utils";

interface ComparisonTableWidgetProps {
  headers: string[];
  rows: string[][];
}

export function ComparisonTableWidget({
  headers,
  rows,
}: ComparisonTableWidgetProps) {
  const [highlightedRow, setHighlightedRow] = useState<number | null>(null);
  const [sortCol, setSortCol] = useState<number | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  const handleSort = (col: number) => {
    if (sortCol === col) {
      setSortAsc((prev) => !prev);
    } else {
      setSortCol(col);
      setSortAsc(true);
    }
  };

  const sortedRows = [...rows];
  if (sortCol !== null) {
    sortedRows.sort((a, b) => {
      const va = a[sortCol] ?? "";
      const vb = b[sortCol] ?? "";
      // Try numeric compare
      const na = parseFloat(va);
      const nb = parseFloat(vb);
      if (!isNaN(na) && !isNaN(nb)) {
        return sortAsc ? na - nb : nb - na;
      }
      return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
    });
  }

  return (
    <div className="space-y-2 rounded-xl border border-border/50 bg-card/50 p-5">
      <h4 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider">
        <BarChart3 className="h-4 w-4 text-primary" />
        Tabel Perbandingan
      </h4>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              {headers.map((header, i) => (
                <th
                  key={header}
                  onClick={() => handleSort(i)}
                  className={cn(
                    "cursor-pointer px-3 py-2 text-left font-semibold text-muted-foreground transition-colors hover:text-foreground",
                    "border-b border-border/50",
                    sortCol === i && "text-primary",
                  )}
                >
                  <span className="inline-flex items-center gap-1">
                    {header}
                    {sortCol === i ? (
                      <span className="text-[10px]">{sortAsc ? "▲" : "▼"}</span>
                    ) : (
                      <span className="text-[10px] opacity-30">⇅</span>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((row, ri) => (
              <tr
                key={row.join("-")}
                onMouseEnter={() => setHighlightedRow(ri)}
                onMouseLeave={() => setHighlightedRow(null)}
                className={cn(
                  "transition-colors",
                  highlightedRow === ri && "bg-muted/30",
                  ri % 2 === 0 ? "bg-transparent" : "bg-muted/10",
                )}
              >
                {row.map((cell, ci) => (
                  <td
                    key={`${ri}-${ci}`}
                    className={cn(
                      "px-3 py-2 border-b border-border/20",
                      ci === 0 && "font-medium",
                    )}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-muted-foreground/60 text-[11px]">
        Klik header kolom untuk mengurutkan data.
      </p>
    </div>
  );
}
