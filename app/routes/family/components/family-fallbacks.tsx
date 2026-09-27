import { Card, CardContent, CardHeader } from "~/templates/components/ui/card";
import { Skeleton } from "~/templates/components/ui/skeleton";

export function FamilyControlsFallback() {
  return (
    <Card className="border-border/70 bg-card/80 backdrop-blur">
      <CardHeader>
        <Skeleton className="h-6 w-44" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 md:grid-cols-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}

export function FamilyChordCardFallback() {
  return (
    <Card className="border-border/70 bg-card/80 backdrop-blur">
      <CardContent className="space-y-4 pt-6">
        <div className="flex flex-wrap items-center gap-2">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-24" />
        </div>
        <Skeleton className="h-4 w-3/4" />
        <div className="grid gap-3 md:grid-cols-2">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}

export function FamilyChordTableFallback() {
  return (
    <Card className="border-border/70 bg-card/80 backdrop-blur">
      <CardContent className="space-y-3 pt-6">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </CardContent>
    </Card>
  );
}
