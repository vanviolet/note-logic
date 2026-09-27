import { Card, CardContent, CardHeader } from "~/templates/components/ui/card";
import { Skeleton } from "~/templates/components/ui/skeleton";

export function IntervalControlsFallback() {
  return (
    <Card className="border-border/70 bg-card/80 backdrop-blur">
      <CardHeader className="space-y-2">
        <Skeleton className="h-6 w-44" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 md:grid-cols-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
        <Skeleton className="h-12 w-full" />
      </CardContent>
    </Card>
  );
}

export function IntervalLearningCardFallback() {
  return (
    <Card className="border-border/70 bg-card/80 backdrop-blur">
      <CardContent className="space-y-4 pt-6">
        <div className="flex flex-wrap items-center gap-2">
          <Skeleton className="h-7 w-44" />
          <Skeleton className="h-6 w-14" />
          <Skeleton className="h-6 w-32" />
        </div>
        <Skeleton className="h-4 w-3/4" />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-36 w-full" />
          <Skeleton className="h-36 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}

export function IntervalItemTableFallback() {
  return (
    <Card className="border-border/70 bg-card/80 backdrop-blur">
      <CardContent className="space-y-3 pt-6">
        <div className="flex gap-3">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-5 w-10" />
          <Skeleton className="h-5 w-32" />
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={`interval-table-skeleton-${i}`} className="flex gap-3">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-10" />
            <Skeleton className="h-5 w-8" />
            <Skeleton className="h-5 w-28" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
