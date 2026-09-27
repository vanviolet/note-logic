// ════════════════════════════════════════════════════════
// ScaleLearningCard — Knowledge-style Link card
// ════════════════════════════════════════════════════════

import { ArrowRight, Globe, Music } from "lucide-react";
import { memo } from "react";
import { Link } from "react-router";
import type { ScaleInstance } from "~/theory-music/scales";
import { Badge } from "~/templates/components/ui/badge";
import { cn } from "~/templates/lib/utils";
import {
  difficultyBadgeVariant,
  difficultyLabel,
  familyLabel,
} from "../lib/scale-utils";

interface ScaleLearningCardProps {
  scale: ScaleInstance;
}

function ScaleLearningCardComponent({ scale }: ScaleLearningCardProps) {
  return (
    <Link
      to={`/scale/${scale.type}`}
      prefetch="intent"
      className={cn(
        "group relative flex flex-col rounded-xl border border-border/50 p-5",
        "transition-all duration-200 hover:border-primary/30 hover:bg-muted/30",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
      )}
    >
      {/* Icon + Title */}
      <div className="mb-3 flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Music className="h-5 w-5 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold tracking-tight group-hover:text-primary transition-colors">
            {scale.scale}
          </h2>
          <p className="text-muted-foreground/70 text-sm">
            {scale.root} · {scale.notes.join(" – ")}
          </p>
        </div>
      </div>

      {/* Description */}
      <p className="text-muted-foreground mb-4 line-clamp-2 text-sm leading-relaxed">
        {scale.description}
      </p>

      {/* Badges */}
      <div className="mt-auto flex flex-wrap items-center gap-2">
        <Badge variant={difficultyBadgeVariant(scale.difficulty)}>
          {difficultyLabel(scale.difficulty)}
        </Badge>
        <span className="text-xs font-medium text-muted-foreground">
          {familyLabel(scale.family)}
        </span>
        {scale.region && (
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Globe className="h-3 w-3" />
            {scale.region}
          </span>
        )}
        {scale.genres.length > 0 && (
          <span className="ml-auto text-xs text-muted-foreground">
            {scale.genres.slice(0, 2).join(", ")}
          </span>
        )}
      </div>

      {/* Hover arrow */}
      <ArrowRight className="absolute bottom-5 right-5 h-4 w-4 text-primary opacity-0 transition-opacity group-hover:opacity-100" />
    </Link>
  );
}

export const ScaleLearningCard = memo(ScaleLearningCardComponent);
