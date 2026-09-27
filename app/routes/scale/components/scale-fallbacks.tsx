import { Skeleton } from "~/templates/components/ui/skeleton";

export function ScaleCardSkeleton() {
  return (
    <div className="flex flex-col rounded-xl border border-border/50 p-5">
      <div className="flex items-start gap-3">
        <Skeleton className="h-11 w-11 shrink-0 rounded-lg" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-56" />
          <Skeleton className="h-4 w-full" />
          <div className="flex gap-2 pt-1">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>
    </div>
  );
}
