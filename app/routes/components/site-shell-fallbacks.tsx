import { Skeleton } from "~/templates/components/ui/skeleton";

export function SiteShellHeaderFallback() {
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

export function SiteShellFooterFallback() {
  return (
    <footer className="border-border/40 border-t">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 md:px-6">
        <Skeleton className="h-4 w-56" />
        <Skeleton className="h-4 w-28" />
      </div>
    </footer>
  );
}

export function SiteRouteContentFallback() {
  return (
    <section className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 md:px-6 md:py-10">
      <div className="space-y-3">
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-4 w-full max-w-2xl" />
      </div>

      <div className="grid gap-4">
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    </section>
  );
}

export function SiteRouteTransitionTopSlider() {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 h-1 overflow-hidden">
      <div className="from-primary/20 via-primary to-primary/20 bg-linear-to-r h-full w-full animate-pulse" />
    </div>
  );
}
