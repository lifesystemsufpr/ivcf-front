import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils";
import { Tooltip, type TooltipSide } from "./Tooltip";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2",
    "whitespace-nowrap rounded-lg",
    "font-medium tracking-tight",
    "transition-all duration-150 ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "active:scale-[0.97]",
    "select-none cursor-pointer",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary-hover hover:shadow-md",
        secondary:
          "bg-accent text-accent-foreground shadow-sm hover:bg-accent-hover hover:shadow-md",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:opacity-90 hover:shadow-md",
        outline:
          "border border-border bg-transparent hover:bg-muted hover:border-border/70",
        ghost: "hover:bg-muted",
        link: "text-primary underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        xs: "h-7 px-2.5 text-xs gap-1.5",
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
        xl: "h-14 px-8 text-lg",
        icon: "h-10 w-10 p-0 shrink-0",
        "icon-sm": "h-8 w-8 p-0 shrink-0",
        "icon-lg": "h-12 w-12 p-0 shrink-0",
      },
      fullWidth: {
        true: "w-full",
      },
      loading: {
        true: "relative text-transparent transition-none",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

// ─── Spinner ─────────────────────────────────────────────────────────────────

const Spinner: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={cn("animate-spin", className)}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
    />
  </svg>
);

// ─── Button Props ─────────────────────────────────────────────────────────────

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  tooltip?: React.ReactNode | TooltipConfig;
}

interface TooltipConfig {
  content: React.ReactNode;
  side?: TooltipSide;
  delay?: number;
}

function isTooltipConfig(v: unknown): v is TooltipConfig {
  return typeof v === "object" && v !== null && "content" in v;
}

// ─── Button ──────────────────────────────────────────────────────────────────

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      loading = false,
      loadingText,
      leftIcon,
      rightIcon,
      fullWidth,
      children,
      disabled,
      tooltip,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    const button = (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-busy={loading}
        aria-label={loading && loadingText ? loadingText : props["aria-label"]}
        className={cn(
          buttonVariants({ variant, size, fullWidth, loading }),
          className,
        )}
        {...props}
      >
        {/* Loading overlay */}
        {loading && (
          <span
            className="absolute inset-0 flex items-center justify-center"
            aria-hidden="true"
          >
            <Spinner className="h-4 w-4 text-current opacity-100" />
          </span>
        )}

        {/* Content — hidden visually while loading, kept for layout stability */}
        <span
          className={cn(
            children && "inline-flex items-center gap-2",
            loading && "invisible",
          )}
        >
          {leftIcon && (
            <span
              className={`${children ? "inline-flex shrink-0 items-center" : ""}`}
              aria-hidden="true"
            >
              {leftIcon}
            </span>
          )}

          {/* Only render span when there are actual children to avoid icon-only padding issues */}
          {children !== undefined && children !== null && (
            <span>{children}</span>
          )}

          {rightIcon && (
            <span
              className="inline-flex shrink-0 items-center"
              aria-hidden="true"
            >
              {rightIcon}
            </span>
          )}
        </span>
      </button>
    );

    if (!tooltip) return button;

    const tooltipProps: TooltipConfig = isTooltipConfig(tooltip)
      ? tooltip
      : { content: tooltip };

    return (
      <Tooltip
        content={tooltipProps.content}
        side={tooltipProps.side}
        delay={tooltipProps.delay}
      >
        {button}
      </Tooltip>
    );
  },
);

Button.displayName = "Button";
