import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "~/templates/lib/utils";

const pageHeaderVariants = cva("flex flex-col gap-4", {
  variants: {
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
    },
    size: {
      sm: "gap-3",
      md: "gap-4",
      lg: "gap-5",
    },
  },
  defaultVariants: {
    align: "start",
    size: "md",
  },
});

const pageHeaderTitleVariants = cva("font-medium tracking-tight", {
  variants: {
    size: {
      sm: "text-xl",
      md: "text-2xl",
      lg: "text-3xl",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const pageHeaderDescriptionVariants = cva("text-muted-foreground", {
  variants: {
    size: {
      sm: "text-sm",
      md: "text-sm",
      lg: "text-base",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export interface PageHeaderProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof pageHeaderVariants> {
  breadcrumb?: React.ReactNode;
  heading?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  titleClassName?: string;
  descriptionClassName?: string;
  actionsClassName?: string;
  breadcrumbClassName?: string;
}

export function PageHeader({
  breadcrumb,
  heading,
  description,
  actions,
  align,
  size,
  className,
  titleClassName,
  descriptionClassName,
  actionsClassName,
  breadcrumbClassName,
  children,
  ...props
}: PageHeaderProps) {
  const contentAlign =
    align === "center"
      ? "sm:items-center"
      : align === "end"
        ? "sm:items-end"
        : "sm:items-start";

  return (
    <div
      className={cn(pageHeaderVariants({ align, size, className }), "w-full")}
      {...props}
    >
      {breadcrumb ? (
        <div
          className={cn("text-sm text-muted-foreground", breadcrumbClassName)}
        >
          {breadcrumb}
        </div>
      ) : null}
      <div
        className={cn(
          "flex w-full flex-col gap-3 sm:flex-row sm:justify-between",
          contentAlign,
        )}
      >
        <div className="flex max-w-3xl flex-col gap-1">
          {heading ? (
            <h1
              className={cn(pageHeaderTitleVariants({ size }), titleClassName)}
            >
              {heading}
            </h1>
          ) : null}
          {description ? (
            <p
              className={cn(
                pageHeaderDescriptionVariants({ size }),
                descriptionClassName,
              )}
            >
              {description}
            </p>
          ) : null}
        </div>
        {actions ? (
          <div className={cn("flex items-center gap-2", actionsClassName)}>
            {actions}
          </div>
        ) : null}
      </div>
      {children}
    </div>
  );
}
