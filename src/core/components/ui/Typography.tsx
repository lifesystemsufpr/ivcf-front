import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils";

export type TypographyColor = "primary" | "secondary" | "muted" | "accent";

const typographyVariants = cva("text-foreground", {
  variants: {
    variant: {
      h1: "text-4xl font-bold tracking-tight",
      h2: "text-3xl font-semibold tracking-tight",
      h3: "text-2xl font-semibold",
      h4: "text-xl font-medium",
      body: "text-base",
      small: "text-sm text-muted-foreground",
      caption: "text-xs text-muted-foreground",
    },
  },
  defaultVariants: {
    variant: "body",
  },
});

interface TypographyProps
  extends
    React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
  as?: React.ElementType;
  color?: TypographyColor;
}

export function Typography({
  as,
  variant,
  className,
  color = "primary",
  ...props
}: TypographyProps) {
  const Component = as || "p";

  return (
    <Component
      className={cn(
        typographyVariants({ variant }),
        color && `text-${color}`,
        className,
      )}
      {...props}
    />
  );
}
