import type { ReactNode } from "react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { cn } from "@/core/utils";
import { type LucideIcon } from "lucide-react";

type DropdownPlacement =
  | "bottom-start"
  | "bottom-end"
  | "top-start"
  | "top-end";

export type DropdownItem = {
  label: string;
  description?: string;
  Icon?: LucideIcon;
  onSelect?: () => void;
  disabled?: boolean;
  danger?: boolean;
};

export type DropdownProps = {
  trigger: (args: {
    open: boolean;
    toggle: () => void;
    close: () => void;
  }) => ReactNode;
  items: DropdownItem[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: DropdownPlacement;
  elevation?: "sm" | "md" | "lg";
  className?: string;
  menuClassName?: string;
};

export function Dropdown({
  trigger,
  items,
  open: controlledOpen,
  onOpenChange,
  placement = "bottom-start",
  elevation = "md",
  className,
  menuClassName,
}: DropdownProps) {
  const isControlled = controlledOpen !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const labelId = useId();

  const toggle = () => {
    const next = !open;
    if (!isControlled) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };

  const close = () => {
    if (!open) return;
    if (!isControlled) setUncontrolledOpen(false);
    onOpenChange?.(false);
  };

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (menuRef.current?.contains(target)) return;
      if (triggerRef.current?.contains(target)) return;
      close();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const placementClasses = useMemo(() => {
    const base =
      "absolute min-w-[12rem] origin-top rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--foreground))]";
    const shadowMap = {
      sm: "shadow-md",
      md: "shadow-xl",
      lg: "shadow-2xl",
    } as const;

    const positionMap: Record<DropdownPlacement, string> = {
      "bottom-start": "left-0 top-full mt-2",
      "bottom-end": "right-0 top-full mt-2",
      "top-start": "left-0 bottom-full mb-2 origin-bottom",
      "top-end": "right-0 bottom-full mb-2 origin-bottom",
    };

    return cn(base, shadowMap[elevation], positionMap[placement]);
  }, [placement, elevation]);

  return (
    <div ref={triggerRef} className={cn("relative inline-flex", className)}>
      {trigger({ open, toggle, close })}

      <div
        ref={menuRef}
        role="menu"
        aria-labelledby={labelId}
        className={cn(
          placementClasses,
          "overflow-hidden transition-all duration-150 ease-out",
          open
            ? "pointer-events-auto scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0",
          menuClassName,
        )}
      >
        <ul className="py-2" id={labelId}>
          {items.map((item, index) => (
            <li key={`${item.label}-${index}`} className="w-full">
              <button
                type="button"
                disabled={item.disabled}
                onClick={() => {
                  if (item.disabled) return;
                  item.onSelect?.();
                  close();
                }}
                className={cn(
                  "flex w-full items-start gap-3 px-3 py-2 text-left text-sm transition cursor-pointer",
                  item.disabled
                    ? "cursor-not-allowed text-[hsl(var(--muted-foreground))] opacity-60"
                    : "text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]",
                  item.danger && "text-[hsl(var(--destructive))]",
                )}
              >
                {item.Icon && <item.Icon size={16} />}
                <span className="flex flex-col">
                  <span className="font-medium">{item.label}</span>
                  {item.description && (
                    <span className="text-xs text-[hsl(var(--muted-foreground))]">
                      {item.description}
                    </span>
                  )}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
