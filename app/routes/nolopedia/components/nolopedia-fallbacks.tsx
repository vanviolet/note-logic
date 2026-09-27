import { Skeleton } from "~/templates/components/ui/skeleton";

/** Loading skeleton for the search bar area */
export function NolopediaSearchFallback() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <Skeleton className="h-10 w-full sm:max-w-sm" />
      <Skeleton className="h-10 w-40" />
    </div>
  );
}

/** Loading skeleton for the card grid */
export function NolopediaGridFallback({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="rounded-xl border border-border bg-card p-5 space-y-3"
        >
          <div className="flex items-start justify-between">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-5 w-14 rounded-full" />
          </div>
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <div className="flex gap-1.5 pt-1">
            <Skeleton className="h-4 w-12 rounded-full" />
            <Skeleton className="h-4 w-10 rounded-full" />
            <Skeleton className="h-4 w-14 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Loading skeleton for the detail page */
export function NolopediaDetailFallback() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex gap-2">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-28" />
      </div>

      {/* Title + badges */}
      <div className="space-y-3">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-4 w-40" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>

      {/* Definition */}
      <div className="space-y-2">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4" />
      </div>

      {/* Detailed */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}
