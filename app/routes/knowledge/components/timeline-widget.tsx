// ════════════════════════════════════════════════════════
// Knowledge – Interactive Timeline Widget
// ════════════════════════════════════════════════════════

import { useState } from "react";
import { Calendar } from "lucide-react";
import { cn } from "~/templates/lib/utils";

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  era?: string;
}

interface TimelineWidgetProps {
  events: TimelineEvent[];
}

const ERA_COLORS: Record<string, string> = {
  Medieval: "bg-amber-500",
  Renaissance: "bg-orange-500",
  Baroque: "bg-red-500",
  Classical: "bg-blue-500",
  Romantic: "bg-purple-500",
  Modern: "bg-emerald-500",
  Contemporary: "bg-cyan-500",
};

export function TimelineWidget({ events }: TimelineWidgetProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3 rounded-xl border border-border/50 bg-card/50 p-5">
      <h4 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider">
        <Calendar className="h-4 w-4 text-primary" />
        Timeline Interaktif
      </h4>

      {/* Era legend */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(ERA_COLORS).map(([era, color]) => (
          <span
            key={era}
            className="inline-flex items-center gap-1 text-[11px] text-muted-foreground"
          >
            <span className={cn("h-2 w-2 rounded-full", color)} />
            {era}
          </span>
        ))}
      </div>

      {/* Timeline */}
      <div className="relative ml-4 border-l-2 border-border/50 pl-6">
        {events.map((event, i) => {
          const dotColor = event.era
            ? (ERA_COLORS[event.era] ?? "bg-muted-foreground")
            : "bg-muted-foreground";
          const isExpanded = expandedIndex === i;

          return (
            <button
              key={`${event.year}-${event.title}`}
              type="button"
              onClick={() => setExpandedIndex(isExpanded ? null : i)}
              className={cn(
                "relative mb-4 -ml-[31px] flex w-full flex-col rounded-lg border border-transparent px-4 py-2.5 text-left transition-all",
                isExpanded
                  ? "border-border/50 bg-muted/30"
                  : "hover:bg-muted/20",
              )}
            >
              {/* Dot on timeline */}
              <span
                className={cn(
                  "absolute -left-[7px] top-3.5 h-3 w-3 rounded-full border-2 border-background",
                  dotColor,
                )}
              />

              {/* Year + Title */}
              <div className="flex items-baseline gap-3">
                <span className="shrink-0 text-xs font-bold tabular-nums text-primary">
                  {event.year}
                </span>
                <span className="text-sm font-medium">{event.title}</span>
                {event.era && (
                  <span className="ml-auto text-[10px] text-muted-foreground/60">
                    {event.era}
                  </span>
                )}
              </div>

              {/* Description (expanded) */}
              {isExpanded && (
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                  {event.description}
                </p>
              )}
            </button>
          );
        })}
      </div>

      <p className="text-muted-foreground/60 text-[11px]">
        Klik event untuk membuka/menutup deskripsi.
      </p>
    </div>
  );
}
