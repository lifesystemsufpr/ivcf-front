import type { ButtonHTMLAttributes } from "react";
import { useEffect, useRef } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/core/utils";

type IconButtonBaseVariant = "filled" | "outline" | "ghost" | "soft";
type IconButtonAccentVariant =
  | "accent"
  | "accentSoft"
  | "accentOutline"
  | "accentGhost";
type IconButtonVariant = IconButtonBaseVariant | IconButtonAccentVariant;
type IconButtonColor = "neutral" | "primary" | "accent" | "destructive";
type IconButtonSize = "sm" | "md" | "lg";
type IconButtonShape = "circular" | "rounded" | "square";

export type IconButtonProps = {
  icon: LucideIcon | HTMLElement;
  ariaLabel: string;
  size?: IconButtonSize;
  variant?: IconButtonVariant;
  color?: IconButtonColor;
  shape?: IconButtonShape;
  iconSize?: number;
  elevated?: boolean;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-label">;

const sizeMap: Record<IconButtonSize, string> = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
};

const iconSizeMap: Record<IconButtonSize, number> = {
  sm: 16,
  md: 20,
  lg: 24,
};

const shapeMap: Record<IconButtonShape, string> = {
  circular: "rounded-full",
  rounded: "rounded-xl",
  square: "rounded-md",
};

const accentVariantMap: Record<IconButtonAccentVariant, IconButtonBaseVariant> =
  {
    accent: "filled",
    accentSoft: "soft",
    accentOutline: "outline",
    accentGhost: "ghost",
  };

const variantColorClasses: Record<
  IconButtonBaseVariant,
  Record<IconButtonColor, string>
> = {
  filled: {
    neutral: "bg-muted text-foreground hover:bg-muted/80",
    primary: "bg-primary text-primary-foreground hover:bg-primary-hover",
    accent: "bg-accent text-accent-foreground hover:bg-accent-hover",
    destructive: "bg-destructive text-destructive-foreground hover:opacity-90",
  },
  outline: {
    neutral: "border border-border text-foreground hover:bg-muted",
    primary: "border border-primary text-primary hover:bg-primary-soft",
    accent: "border border-accent text-accent hover:bg-accent-soft",
    destructive:
      "border border-destructive text-destructive hover:bg-destructive/10",
  },
  ghost: {
    neutral: "text-foreground hover:bg-muted",
    primary: "text-primary hover:bg-primary-soft",
    accent: "text-accent hover:bg-accent-soft",
    destructive: "text-destructive hover:bg-destructive/10",
  },
  soft: {
    neutral: "bg-muted text-foreground",
    primary: "bg-primary-soft text-primary",
    accent: "bg-accent-soft text-accent-foreground",
    destructive: "bg-destructive/10 text-destructive",
  },
};

export function IconButton({
  icon: Icon,
  ariaLabel,
  size = "md",
  variant = "filled",
  color = "primary",
  shape = "circular",
  iconSize,
  elevated,
  className,
  type = "button",
  disabled,
  ...props
}: IconButtonProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const isAccentVariant = variant in accentVariantMap;
  const resolvedVariant = isAccentVariant
    ? accentVariantMap[variant as IconButtonAccentVariant]
    : (variant as IconButtonBaseVariant);
  const resolvedColor = isAccentVariant ? "accent" : color;

  useEffect(() => {
    if (Icon instanceof HTMLElement && containerRef.current) {
      containerRef.current.innerHTML = "";
      containerRef.current.appendChild(Icon);
    }
  }, [Icon]);

  return (
    <button
      type={type}
      aria-label={ariaLabel}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
        sizeMap[size],
        shapeMap[shape],
        variantColorClasses[resolvedVariant][resolvedColor],
        elevated && "shadow-lg shadow-black/10",
        disabled && "cursor-not-allowed",
        className,
      )}
      {...props}
    >
      {Icon instanceof HTMLElement ? (
        <span ref={containerRef} className="flex items-center justify-center" />
      ) : (
        <Icon size={iconSize ?? iconSizeMap[size]} />
      )}
    </button>
  );
}
