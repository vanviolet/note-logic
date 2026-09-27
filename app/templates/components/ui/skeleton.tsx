import { cn } from "~/templates/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "bg-border/80 dark:bg-border animate-pulse rounded-md",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
