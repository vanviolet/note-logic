import { cva, type VariantProps } from "class-variance-authority";

const stackVariants = cva("", {
  variants: {
    orientation: {
      horizontal: "flex flex-row",
      vertical: "flex flex-col",
    },
    gap: {
      none: "gap-0",
      sm: "gap-2",
      md: "gap-4",
      lg: "gap-6",
    },
    wrap: {
      true: "flex-wrap",
      false: "flex-nowrap",
    },
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
    },
    justify: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
      around: "justify-around",
      evenly: "justify-evenly",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
    gap: "md",
    wrap: true,
    align: "center",
    justify: "start",
  },
});

export const Stack = ({
  className,
  orientation,
  gap,
  wrap,
  align,
  justify,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof stackVariants>) => {
  return (
    <div
      className={stackVariants({
        orientation,
        gap,
        wrap,
        align,
        justify,
        className,
      })}
      {...props}
    />
  );
};
