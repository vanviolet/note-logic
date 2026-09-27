import { Badge } from "~/templates/components/ui/badge";
import type { ChordEntry } from "~/theory-music/chord";
import { FAMILY_LABELS, familyColor } from "../../lib/chord-utils";
import { cn } from "~/templates/lib/utils";

export function ChordCardHeader({ chord }: { chord: ChordEntry }) {
  return (
    <div className="flex items-start justify-between gap-2">
      <h3 className="text-lg font-semibold leading-tight text-foreground group-hover:text-primary transition-colors">
        {chord.name}
      </h3>
      <Badge
        variant="outline"
        className={cn(
          "shrink-0 text-[10px] uppercase",
          familyColor(chord.family),
        )}
      >
        {FAMILY_LABELS[chord.family] ?? chord.family}
      </Badge>
    </div>
  );
}
