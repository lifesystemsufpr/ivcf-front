import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../../utils";
import { useTabsContext } from "./TabContext";

const tabListVariants = cva("relative inline-flex border-b border-border", {
  variants: {
    orientation: {
      horizontal: "flex-row w-full",
      vertical: "flex-col border-b-0 border-r",
    },
    variant: {
      standard: "",
      scrollable: "overflow-x-auto scrollbar-thin",
      fullWidth: "w-full",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
    variant: "standard",
  },
});

export interface TabListProps extends React.HTMLAttributes<HTMLDivElement> {
  ariaLabel?: string;
}

export function TabList({
  ariaLabel,
  className,
  children,
  ...props
}: TabListProps) {
  const { value, orientation, variant } = useTabsContext();
  const [indicatorStyle, setIndicatorStyle] =
    React.useState<React.CSSProperties>({});
  const tabsRef = React.useRef<HTMLDivElement>(null);
  const isHorizontal = orientation === "horizontal";

  React.useEffect(() => {
    if (tabsRef.current) {
      const activeTab = tabsRef.current.querySelector(
        '[data-state="active"]',
      ) as HTMLElement;

      if (activeTab) {
        const tabsRect = tabsRef.current.getBoundingClientRect();
        const tabRect = activeTab.getBoundingClientRect();

        if (isHorizontal) {
          setIndicatorStyle({
            left: tabRect.left - tabsRect.left,
            width: tabRect.width,
          });
        } else {
          setIndicatorStyle({
            top: tabRect.top - tabsRect.top,
            height: tabRect.height,
          });
        }
      }
    }
  }, [value, isHorizontal, children]);

  return (
    <div
      ref={tabsRef}
      role="tablist"
      aria-label={ariaLabel}
      aria-orientation={orientation}
      className={cn(tabListVariants({ orientation, variant }), className)}
      {...props}
    >
      {children}

      {/* Indicador animado */}
      <div
        className={cn(
          "absolute bg-primary transition-all duration-300 ease-in-out", // Cor primary aqui
          isHorizontal ? "bottom-0 h-0.5" : "right-0 w-0.5",
        )}
        style={indicatorStyle}
      />
    </div>
  );
}
