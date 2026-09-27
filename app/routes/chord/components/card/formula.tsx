import { cn } from "~/templates/lib/utils";
import type { ChordEntry } from "~/theory-music/chord";
import { degreeColorText } from "~/theory-music/core/colors";

export function ChordCardFormula({ chord }: { chord: ChordEntry }) {
  return (
    <div className="flex justify-between flex-wrap items-center">
      <p className="text-xs text-muted-foreground -mt-1 italic min-w-30">
        {chord.nickname}
      </p>
      <div className="flex items-center gap-2  justify-end">
        {/* <span className="text-muted-foreground text-[10px] uppercase tracking-wider">
          Formula
        </span> */}
        {chord.formula.map((degree, idx) => (
          <span
            key={`${chord.id}-formula-${idx}`}
            className={cn("text-sm font-medium", degreeColorText(degree))}
          >
            {degree}{" "}
            {idx < chord.formula.length - 1 && (
              <span className="text-muted-foreground">-</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
