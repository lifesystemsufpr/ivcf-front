import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../../utils";
import { useTabsContext } from "./TabContext";

const tabVariants = cva(
  [
    "relative inline-flex items-center justify-center gap-2",
    "min-h-12 px-4 py-3",
    "font-medium text-sm",
    "transition-all duration-200",
    "cursor-pointer select-none",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
  ].join(" "),
  {
    variants: {
      orientation: {
        horizontal: "flex-row min-w-[90px]",
        vertical: "flex-col w-full justify-start text-left",
      },
      variant: {
        standard: "",
        scrollable: "flex-shrink-0",
        fullWidth: "flex-1",
      },
      active: {
        true: "text-primary",
        false: "text-muted-foreground hover:text-foreground",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
      variant: "standard",
      active: false,
    },
  },
);

export interface TabProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "value" | "onChange"
> {
  value: string | number;
  label?: string;
  icon?: React.ReactNode;
  iconPosition?: "start" | "end" | "top" | "bottom";
  disabled?: boolean;
}

export const Tab = React.forwardRef<HTMLButtonElement, TabProps>(
  (
    {
      value,
      label,
      icon,
      iconPosition = "start",
      disabled,
      className,
      children,
      onClick,
      ...props
    },
    ref,
  ) => {
    const {
      value: selectedValue,
      onChange,
      orientation,
      variant,
    } = useTabsContext();
    const isActive = selectedValue === value;

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (!disabled) {
        onChange(value);
        onClick?.(event);
      }
    };

    const content = children || label;
    const showIcon = icon !== undefined;
    const isIconTop = iconPosition === "top";
    const isIconBottom = iconPosition === "bottom";
    const isIconEnd = iconPosition === "end";

    return (
      <button
        ref={ref}
        role="tab"
        type="button"
        aria-selected={isActive}
        aria-controls={`tabpanel-${value}`}
        data-state={isActive ? "active" : "inactive"}
        data-value={value}
        disabled={disabled}
        tabIndex={isActive ? 0 : -1}
        className={cn(
          tabVariants({ orientation, variant, active: isActive }),
          (isIconTop || isIconBottom) && "flex-col",
          className,
        )}
        onClick={handleClick}
        {...props}
      >
        {showIcon && (isIconTop || (!isIconBottom && !isIconEnd)) && icon}
        {content && <span>{content}</span>}
        {showIcon && (isIconBottom || isIconEnd) && icon}
      </button>
    );
  },
);

Tab.displayName = "Tab";
