import { Link } from "react-router";
import { Badge } from "~/templates/components/ui/badge";
import { Card, CardContent } from "~/templates/components/ui/card";
import type { DictionaryEntry } from "~/theory-music/dictionary/types";
import { CATEGORY_LABELS } from "../lib/nolopedia-utils";

export function NolopediaCard({ entry }: { entry: DictionaryEntry }) {
  return (
    <Link
      to={`/nolopedia/${entry.id}`}
      className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
      prefetch="intent"
    >
      <Card className="h-full transition-all duration-200 group-hover:border-primary/40 group-hover:shadow-md group-hover:shadow-primary/5">
        <CardContent className="flex flex-col gap-2.5 p-5">
          {/* Header: term + category badge */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-base leading-tight text-foreground group-hover:text-primary transition-colors">
              {entry.term}
            </h3>
            <Badge variant="outline" className="shrink-0 text-[10px] uppercase">
              {CATEGORY_LABELS[entry.category] ?? entry.category}
            </Badge>
          </div>

          {/* Indonesian translation */}
          {entry.termId && (
            <p className="text-xs text-muted-foreground -mt-1 italic">
              {entry.termId}
            </p>
          )}

          {/* Short definition */}
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {entry.shortDefinition}
          </p>

          {/* Tags row */}
          {entry.tags && entry.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {entry.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="inline-block rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
              {entry.tags.length > 4 && (
                <span className="text-[10px] text-muted-foreground/60">
                  +{entry.tags.length - 4}
                </span>
              )}
            </div>
          )}

          {/* Instrument context / guitar indicator */}
          {entry.instrumentContext === "guitar" && (
            <div className="flex items-center gap-1 pt-0.5 text-[10px] text-amber-500 dark:text-amber-400">
              <span>🎸</span>
              <span>Teknik gitar</span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
