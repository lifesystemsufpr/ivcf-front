import { useMemo, useState } from "react";
import { cn } from "@/core/utils";
import { User } from "lucide-react";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";
type AvatarVariant = "filled" | "outlined";
type AvatarShape = "circular" | "rounded" | "square";

export type AvatarProps = {
  src?: string;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  variant?: AvatarVariant;
  shape?: AvatarShape;
  color?: "neutral" | "primary" | "accent" | "destructive";
  elevated?: boolean;
  className?: string;
};

const sizeMap: Record<AvatarSize, string> = {
  xs: "h-8 w-8 text-xs",
  sm: "h-10 w-10 text-sm",
  md: "h-12 w-12 text-base",
  lg: "h-14 w-14 text-lg",
  xl: "h-16 w-16 text-xl",
};

const radiusMap: Record<AvatarShape, string> = {
  circular: "rounded-full",
  rounded: "rounded-xl",
  square: "rounded-md",
};

const colorMap = {
  neutral: {
    filled: "bg-[hsl(var(--muted))] text-[hsl(var(--foreground))]",
    outlined:
      "border border-[hsl(var(--border))] text-[hsl(var(--foreground))]",
  },
  primary: {
    filled: "bg-[hsl(var(--primary-soft))] text-[hsl(var(--primary))]",
    outlined: "border border-[hsl(var(--primary))] text-[hsl(var(--primary))]",
  },
  accent: {
    filled: "bg-[hsl(var(--accent-soft))] text-[hsl(var(--accent-foreground))]",
    outlined: "border border-[hsl(var(--accent))] text-[hsl(var(--accent))]",
  },
  destructive: {
    filled: "bg-[hsl(var(--destructive))]/10 text-[hsl(var(--destructive))]",
    outlined:
      "border border-[hsl(var(--destructive))] text-[hsl(var(--destructive))]",
  },
} as const;

function getInitials(name?: string) {
  if (!name) return "";
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase()).join("");
}

export function Avatar({
  src,
  alt,
  name,
  size = "md",
  variant = "filled",
  shape = "circular",
  color = "neutral",
  elevated,
  className,
}: AvatarProps) {
  const [errored, setErrored] = useState(false);
  const initials = useMemo(() => getInitials(name || alt), [name, alt]);
  const showFallback = !src || errored;

  return (
    <span
      className={cn(
        "relative inline-flex items-center justify-center font-semibold",
        sizeMap[size],
        radiusMap[shape],
        colorMap[color][variant],
        elevated && "shadow-lg shadow-black/10",
        className,
      )}
      aria-label={alt || name}
    >
      {!showFallback ? (
        <img
          src={src}
          alt={alt || name}
          className={cn("h-full w-full object-cover", radiusMap[shape])}
          onError={() => setErrored(true)}
        />
      ) : initials ? (
        <span aria-hidden>{initials}</span>
      ) : (
        <span
          aria-hidden
          className="flex h-full w-full items-center justify-center text-[hsl(var(--muted-foreground))]"
        >
          <User
            size={
              size === "xs"
                ? 12
                : size === "sm"
                  ? 16
                  : size === "md"
                    ? 20
                    : size === "lg"
                      ? 24
                      : 28
            }
          />
        </span>
      )}
    </span>
  );
}
