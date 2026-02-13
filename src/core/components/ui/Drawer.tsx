import type { ReactNode } from "react";
import { useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/core/utils";

type DrawerAnchor = "left" | "right" | "top" | "bottom";
type DrawerSize = "sm" | "md" | "lg";

export type DrawerProps = {
  open: boolean;
  onClose: () => void;
  anchor?: DrawerAnchor;
  size?: DrawerSize;
  title?: string;
  description?: string;
  footer?: ReactNode;
  hideCloseButton?: boolean;
  children: ReactNode;
  className?: string;
  overlayClassName?: string;
};

const sizeMap: Record<DrawerSize, string> = {
  sm: "w-72 max-w-full",
  md: "w-96 max-w-full",
  lg: "w-[30rem] max-w-full",
};

const verticalSizeMap: Record<DrawerSize, string> = {
  sm: "h-64 max-h-full",
  md: "h-96 max-h-full",
  lg: "h-[32rem] max-h-full",
};

export function Drawer({
  open,
  onClose,
  anchor = "right",
  size = "md",
  title,
  description,
  footer,
  hideCloseButton,
  children,
  className,
  overlayClassName,
}: DrawerProps) {
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const positionClasses = useMemo(() => {
    const base =
      "fixed bg-[hsl(var(--card))] shadow-2xl border border-[hsl(var(--border))]";

    const translateHidden = {
      left: "-translate-x-full",
      right: "translate-x-full",
      top: "-translate-y-full",
      bottom: "translate-y-full",
    } as const;

    const anchorClasses: Record<DrawerAnchor, string> = {
      left: cn(base, sizeMap[size], "top-0 left-0 h-full"),
      right: cn(base, sizeMap[size], "top-0 right-0 h-full"),
      top: cn(base, verticalSizeMap[size], "top-0 left-0 w-full"),
      bottom: cn(base, verticalSizeMap[size], "bottom-0 left-0 w-full"),
    };

    const openClass = "translate-x-0 translate-y-0";
    const closedClass = translateHidden[anchor];

    return {
      container: anchorClasses[anchor],
      openClass,
      closedClass,
    };
  }, [anchor, size]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-50",
        open ? "pointer-events-auto" : "pointer-events-none",
      )}
    >
      <div
        className={cn(
          "absolute inset-0 bg-black/50 transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0",
          overlayClassName,
        )}
        aria-hidden="true"
        onClick={onClose}
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          positionClasses.container,
          "flex flex-col gap-4 p-6 transition-transform duration-300 ease-out",
          open ? positionClasses.openClass : positionClasses.closedClass,
          className,
        )}
      >
        {(title || description || !hideCloseButton) && (
          <header className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              {title && (
                <h2 className="text-lg font-semibold text-[hsl(var(--foreground))]">
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                  {description}
                </p>
              )}
            </div>
            {!hideCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--foreground))] transition hover:bg-[hsl(var(--muted))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--card))]"
                aria-label="Fechar"
              >
                <span className="sr-only">Fechar</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  aria-hidden
                >
                  <path
                    d="M6.75 6.75l10.5 10.5m0-10.5L6.75 17.25"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            )}
          </header>
        )}

        <div className="flex-1 overflow-auto pr-1 text-[hsl(var(--foreground))]">
          {children}
        </div>

        {footer && (
          <footer className="pt-2 text-[hsl(var(--foreground))]">
            {footer}
          </footer>
        )}
      </section>
    </div>,
    document.body,
  );
}
