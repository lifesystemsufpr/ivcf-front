import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils";

const linkVariants = cva(
  [
    "inline-flex items-center gap-1",
    "rounded-sm",
    "transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  ].join(" "),
  {
    variants: {
      underline: {
        none: "no-underline",
        hover: "hover:underline underline-offset-4",
        always: "underline underline-offset-4",
      },
      color: {
        default: "text-foreground hover:text-foreground/80",
        primary: "text-primary hover:text-primary-hover",
        muted: "text-muted-foreground hover:text-foreground",
        inherit: "text-inherit",
      },
      disabled: {
        true: "pointer-events-none opacity-50",
      },
    },
    defaultVariants: {
      underline: "hover",
      color: "primary",
    },
  },
);

type LinkOwnProps = {
  as?: React.ElementType;
  disabled?: boolean;
  className?: string;
};

type LinkProps<T extends React.ElementType = "a"> = LinkOwnProps &
  VariantProps<typeof linkVariants> &
  Omit<React.ComponentPropsWithoutRef<T>, keyof LinkOwnProps>;

export const Link = React.forwardRef(
  <T extends React.ElementType = "a">(
    {
      as,
      className,
      underline,
      color,
      disabled,
      tabIndex,
      ...props
    }: LinkProps<T>,
    ref: React.Ref<Element>,
  ) => {
    const Component = as || "a";

    return (
      <Component
        ref={ref}
        className={cn(linkVariants({ underline, color, disabled }), className)}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : tabIndex}
        {...props}
      />
    );
  },
);

Link.displayName = "Link";
