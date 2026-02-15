import type { ReactNode } from "react";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/core/utils";

type DialogSize = "sm" | "md" | "lg";

export type DialogProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  footer?: ReactNode;
  children?: ReactNode;
  size?: DialogSize;
  hideCloseButton?: boolean;
  className?: string;
  overlayClassName?: string;
};

const sizeMap: Record<DialogSize, string> = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

export function Dialog({
  open,
  onClose,
  title,
  description,
  footer,
  children,
  size = "md",
  hideCloseButton,
  className,
  overlayClassName,
}: DialogProps) {
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4",
        open ? "pointer-events-auto" : "pointer-events-none",
      )}
    >
      <div
        className={cn(
          "absolute inset-0 bg-black/50 transition-opacity duration-200",
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
          "relative w-full overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--foreground))] shadow-2xl",
          "transition-all duration-200",
          open ? "opacity-100 scale-100" : "opacity-0 scale-95",
          sizeMap[size],
          className,
        )}
      >
        {(title || description || !hideCloseButton) && (
          <header className="flex items-start justify-between gap-4 border-b border-[hsl(var(--border))] p-6">
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

        <div className="max-h-[70vh] overflow-auto p-6">{children}</div>

        {footer && (
          <footer className="border-t border-[hsl(var(--border))] p-6">
            {footer}
          </footer>
        )}
      </section>
    </div>,
    document.body,
  );
}
