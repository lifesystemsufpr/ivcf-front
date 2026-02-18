import type { ReactNode } from "react";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/core/utils";

type ModalSize = "md" | "lg" | "xl";
type ModalAlign = "center" | "top";

export type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  header?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  size?: ModalSize;
  align?: ModalAlign;
  hideCloseButton?: boolean;
  className?: string;
  overlayClassName?: string;
};

const sizeMap: Record<ModalSize, string> = {
  md: "max-w-2xl",
  lg: "max-w-4xl",
  xl: "max-w-5xl",
};

export function Modal({
  open,
  onClose,
  title,
  description,
  header,
  footer,
  children,
  size = "lg",
  align = "center",
  hideCloseButton,
  className,
  overlayClassName,
}: ModalProps) {
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

  const showHeader = header || title || description || !hideCloseButton;

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-50 flex w-full justify-center p-4",
        align === "top" ? "items-start pt-16" : "items-center",
        open ? "pointer-events-auto" : "pointer-events-none",
      )}
    >
      <div
        className={cn(
          "absolute inset-0 bg-black/60 transition-opacity duration-200",
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
          "relative w-full overflow-hidden rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--foreground))] shadow-2xl",
          "transition-all duration-200",
          open ? "opacity-100 scale-100" : "opacity-0 scale-95",
          sizeMap[size],
          className,
        )}
      >
        {showHeader && (
          <header className="flex items-start justify-between gap-6 border-b border-[hsl(var(--border))] p-6">
            <div className="space-y-1">
              {header}
              {title && (
                <h2 className="text-xl font-semibold text-[hsl(var(--foreground))]">
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
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--foreground))] transition hover:bg-[hsl(var(--muted))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--card))]"
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

        <div
          className={`overflow-auto p-6 scrollbar-thin
          [&::-webkit-scrollbar]:w-2
          [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:bg-slate-300
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-thumb]:border-2
          [&::-webkit-scrollbar-thumb]:border-transparent
          [&::-webkit-scrollbar-thumb]:bg-clip-content
          hover:[&::-webkit-scrollbar-thumb]:bg-slate-400 
          ${showHeader ? "max-h-[75vh]" : "max-h-[90vh]"}`}
        >
          {children}
        </div>

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
