import { Card, CardContent, CardHeader } from "~/templates/components/ui/card";
import { Skeleton } from "~/templates/components/ui/skeleton";

export function TunerHeaderFallback() {
  return (
    <header className="border-border/40 bg-background/80 sticky top-0 z-20 border-b backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 md:px-6">
        <Skeleton className="h-7 w-40" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
    </header>
  );
}

export function TunerFooterFallback() {
  return (
    <footer className="border-border/40 border-t">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 md:px-6">
        <Skeleton className="h-4 w-56" />
        <Skeleton className="h-4 w-28" />
      </div>
    </footer>
  );
}

export function TunerMeterFallback() {
  return (
    <Card className="border-border/70 bg-card/80 backdrop-blur">
      <CardHeader>
        <Skeleton className="h-6 w-44" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-32 w-full" />
      </CardContent>
    </Card>
  );
}

export function TunerControlPanelFallback() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-12 w-64" />
      <div className="grid gap-2 sm:grid-cols-2">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
      <Skeleton className="h-10 w-48" />
      <div className="flex gap-2">
        <Skeleton className="h-10 w-28" />
        <Skeleton className="h-10 w-28" />
      </div>
    </div>
  );
}
