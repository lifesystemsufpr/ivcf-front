import { Box, type BoxProps } from "./Box";
import { cn } from "@/core/utils";

type GridBreakpoint = number | "auto" | boolean;

interface GridProps extends BoxProps {
  container?: boolean;
  item?: boolean;
  spacing?: number | string;
  xs?: GridBreakpoint;
  sm?: GridBreakpoint;
  md?: GridBreakpoint;
  lg?: GridBreakpoint;
  xl?: GridBreakpoint;
}

const colSpanMap: Record<number, string> = {
  1: "col-span-1",
  2: "col-span-2",
  3: "col-span-3",
  4: "col-span-4",
  5: "col-span-5",
  6: "col-span-6",
  7: "col-span-7",
  8: "col-span-8",
  9: "col-span-9",
  10: "col-span-10",
  11: "col-span-11",
  12: "col-span-12",
};

const smColSpanMap: Record<number, string> = {
  1: "sm:col-span-1",
  2: "sm:col-span-2",
  3: "sm:col-span-3",
  4: "sm:col-span-4",
  5: "sm:col-span-5",
  6: "sm:col-span-6",
  7: "sm:col-span-7",
  8: "sm:col-span-8",
  9: "sm:col-span-9",
  10: "sm:col-span-10",
  11: "sm:col-span-11",
  12: "sm:col-span-12",
};

const mdColSpanMap: Record<number, string> = {
  1: "md:col-span-1",
  2: "md:col-span-2",
  3: "md:col-span-3",
  4: "md:col-span-4",
  5: "md:col-span-5",
  6: "md:col-span-6",
  7: "md:col-span-7",
  8: "md:col-span-8",
  9: "md:col-span-9",
  10: "md:col-span-10",
  11: "md:col-span-11",
  12: "md:col-span-12",
};

const lgColSpanMap: Record<number, string> = {
  1: "lg:col-span-1",
  2: "lg:col-span-2",
  3: "lg:col-span-3",
  4: "lg:col-span-4",
  5: "lg:col-span-5",
  6: "lg:col-span-6",
  7: "lg:col-span-7",
  8: "lg:col-span-8",
  9: "lg:col-span-9",
  10: "lg:col-span-10",
  11: "lg:col-span-11",
  12: "lg:col-span-12",
};

const xlColSpanMap: Record<number, string> = {
  1: "xl:col-span-1",
  2: "xl:col-span-2",
  3: "xl:col-span-3",
  4: "xl:col-span-4",
  5: "xl:col-span-5",
  6: "xl:col-span-6",
  7: "xl:col-span-7",
  8: "xl:col-span-8",
  9: "xl:col-span-9",
  10: "xl:col-span-10",
  11: "xl:col-span-11",
  12: "xl:col-span-12",
};

const toColClass = (
  val: GridBreakpoint | undefined,
  map: Record<number, string>,
  autoClass: string,
): string | false => {
  if (val === undefined) return false;
  if (typeof val === "number") return map[val] ?? false;
  if (val === true) return map[1];
  if (val === "auto") return autoClass;
  return false;
};

export const Grid = ({
  container,
  item,
  spacing,
  xs,
  sm,
  md,
  lg,
  xl,
  className,
  children,
  style,
  ...props
}: GridProps) => {
  if (container) {
    return (
      <Box
        display="grid"
        cols="repeat(12, 1fr)"
        gap={spacing}
        w="100%"
        className={cn("grid-container", className)}
        {...props}
      >
        {children}
      </Box>
    );
  }

  if (item) {
    const responsiveClasses = cn(
      toColClass(xs, colSpanMap, "col-auto"),
      toColClass(sm, smColSpanMap, "sm:col-auto"),
      toColClass(md, mdColSpanMap, "md:col-auto"),
      toColClass(lg, lgColSpanMap, "lg:col-auto"),
      toColClass(xl, xlColSpanMap, "xl:col-auto"),
    );

    return (
      <Box
        className={cn("grid-item", responsiveClasses, className)}
        style={style}
        {...props}
      >
        {children}
      </Box>
    );
  }

  return <Box {...props}>{children}</Box>;
};
