import type { ButtonHTMLAttributes } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/core/utils";

type IconButtonVariant = "filled" | "outline" | "ghost" | "soft";
type IconButtonColor = "neutral" | "primary" | "accent" | "destructive";
type IconButtonSize = "sm" | "md" | "lg";
type IconButtonShape = "circular" | "rounded" | "square";

export type IconButtonProps = {
  icon: LucideIcon;
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

const variantColorClasses: Record<
  IconButtonVariant,
  Record<IconButtonColor, string>
> = {
  filled: {
    neutral:
      "bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted-foreground))/15]",
    primary:
      "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary-hover))]",
    accent:
      "bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] hover:bg-[hsl(var(--accent-hover))]",
    destructive:
      "bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))] hover:bg-[hsl(var(--destructive))/85]",
  },
  outline: {
    neutral:
      "border border-[hsl(var(--border))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]",
    primary:
      "border border-[hsl(var(--primary))] text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary-soft))]",
    accent:
      "border border-[hsl(var(--accent))] text-[hsl(var(--accent))] hover:bg-[hsl(var(--accent-soft))]",
    destructive:
      "border border-[hsl(var(--destructive))] text-[hsl(var(--destructive))] hover:bg-[hsl(var(--destructive))/10]",
  },
  ghost: {
    neutral: "text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]",
    primary: "text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary-soft))]",
    accent: "text-[hsl(var(--accent))] hover:bg-[hsl(var(--accent-soft))]",
    destructive:
      "text-[hsl(var(--destructive))] hover:bg-[hsl(var(--destructive))/10]",
  },
  soft: {
    neutral: "bg-[hsl(var(--muted))] text-[hsl(var(--foreground))]",
    primary: "bg-[hsl(var(--primary-soft))] text-[hsl(var(--primary))]",
    accent: "bg-[hsl(var(--accent-soft))] text-[hsl(var(--accent-foreground))]",
    destructive:
      "bg-[hsl(var(--destructive))/10] text-[hsl(var(--destructive))]",
  },
};

export function IconButton({
  icon: Icon,
  ariaLabel,
  size = "md",
  variant = "filled",
  color = "neutral",
  shape = "circular",
  iconSize,
  elevated,
  className,
  type = "button",
  disabled,
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={ariaLabel}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--card))] cursor-pointer",
        sizeMap[size],
        shapeMap[shape],
        variantColorClasses[variant][color],
        elevated && "shadow-lg shadow-black/10",
        disabled && "cursor-not-allowed opacity-60",
        className,
      )}
      {...props}
    >
      <Icon size={iconSize ?? iconSizeMap[size]} />
    </button>
  );
}
