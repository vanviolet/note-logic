// ════════════════════════════════════════════════════════
// Exercise Card – Compact card for exercise list
// ════════════════════════════════════════════════════════

import { Guitar, Piano, Play, Mic } from "lucide-react";
import { Badge } from "~/templates/components/ui/badge";
import { cn } from "~/templates/lib/utils";
import type { Exercise } from "../types";
import {
  DIFFICULTY_LABELS,
  DIFFICULTY_COLORS,
  CATEGORY_LABELS,
} from "../types";

interface ExerciseCardProps {
  exercise: Exercise;
  isActive: boolean;
  onSelect: (exercise: Exercise) => void;
}

export function ExerciseCard({
  exercise,
  isActive,
  onSelect,
}: ExerciseCardProps) {
  const Icon = exercise.instrument === "guitar" ? Guitar : Piano;

  return (
    <button
      type="button"
      onClick={() => onSelect(exercise)}
      className={cn(
        "group relative flex w-full flex-col gap-2 rounded-xl border p-4 text-left transition-all duration-200",
        "hover:border-primary/40 hover:shadow-md hover:shadow-primary/5",
        isActive
          ? "border-primary/60 bg-primary/5 shadow-md shadow-primary/10"
          : "border-border/50 bg-card/60 backdrop-blur-sm",
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex size-8 items-center justify-center rounded-lg",
              isActive
                ? "bg-primary/15 text-primary"
                : "bg-muted text-muted-foreground",
            )}
          >
            <Icon className="size-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold leading-tight">
              {exercise.name}
            </h3>
            <span className="text-[11px] text-muted-foreground">
              {exercise.key} · {exercise.timeSignature} · {exercise.defaultBpm}{" "}
              BPM
            </span>
          </div>
        </div>

        {/* Actions mini */}
        <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <span className="flex size-6 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Play className="size-3" />
          </span>
          <span className="flex size-6 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-500">
            <Mic className="size-3" />
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
        {exercise.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        <Badge
          variant="outline"
          className={cn(
            "text-[10px] px-1.5 py-0",
            DIFFICULTY_COLORS[exercise.difficulty],
          )}
        >
          {DIFFICULTY_LABELS[exercise.difficulty]}
        </Badge>
        <Badge
          variant="outline"
          className="text-[10px] px-1.5 py-0 text-muted-foreground border-border/50"
        >
          {CATEGORY_LABELS[exercise.category]}
        </Badge>
        <Badge
          variant="outline"
          className="text-[10px] px-1.5 py-0 text-muted-foreground border-border/50"
        >
          {exercise.notes.length} not
        </Badge>
      </div>
    </button>
  );
}
