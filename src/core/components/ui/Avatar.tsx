import { useMemo, useState } from "react";
import { cn } from "@/core/utils";

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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="h-6 w-6"
            aria-hidden
          >
            <path
              d="M12 12c2.485 0 4.5-2.015 4.5-4.5S14.485 3 12 3 7.5 5.015 7.5 7.5 9.515 12 12 12Zm0 2.25c-3.263 0-5.985 1.963-6 4.5 0 .414.336.75.75.75h10.5a.75.75 0 0 0 .75-.75c-.015-2.537-2.737-4.5-6-4.5Z"
              fill="currentColor"
            />
          </svg>
        </span>
      )}
    </span>
  );
}
