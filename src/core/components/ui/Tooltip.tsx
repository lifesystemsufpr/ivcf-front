import { cn } from "@/core/utils";
import React, { useEffect, useId, useRef, useState } from "react";
import { Box } from "./Box";

export type TooltipSide = "top" | "bottom" | "left" | "right";

interface TooltipProps {
  content: React.ReactNode;
  side?: TooltipSide;
  delay?: number;
  children: React.ReactElement;
}

const TOOLTIP_SIDE_STYLES: Record<
  TooltipSide,
  { wrapper: string; arrow: string }
> = {
  top: {
    wrapper: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    arrow:
      "absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[--tooltip-bg]",
  },
  bottom: {
    wrapper: "top-full left-1/2 -translate-x-1/2 mt-2",
    arrow:
      "absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-[--tooltip-bg]",
  },
  left: {
    wrapper: "right-full top-1/2 -translate-y-1/2 mr-2",
    arrow:
      "absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-[--tooltip-bg]",
  },
  right: {
    wrapper: "left-full top-1/2 -translate-y-1/2 ml-2",
    arrow:
      "absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[--tooltip-bg]",
  },
};

const TOOLTIP_ANIMATION: Record<TooltipSide, string> = {
  top: "data-[visible=true]:animate-tooltip-up",
  bottom: "data-[visible=true]:animate-tooltip-down",
  left: "data-[visible=true]:animate-tooltip-left",
  right: "data-[visible=true]:animate-tooltip-right",
};

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  side = "top",
  delay = 300,
  children,
}) => {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const id = useId();

  const show = () => {
    timerRef.current = setTimeout(() => setVisible(true), delay);
  };

  const hide = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setVisible(false);
  };

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  const { wrapper, arrow } = TOOLTIP_SIDE_STYLES[side];

  return (
    <Box
      className="relative inline-flex"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {React.cloneElement(children, {
        "aria-describedby": visible ? id : undefined,
      } as React.HTMLAttributes<HTMLElement>)}

      <Box
        id={id}
        role="tooltip"
        data-visible={visible}
        className={cn(
          "pointer-events-none absolute z-50 whitespace-nowrap",
          "rounded-lg px-3 py-1.5",
          "bg-popover text-popover-foreground",
          "border border-border",
          "shadow-lg shadow-black/5 dark:shadow-black/20",
          "text-xs font-medium leading-none",
          "opacity-0 scale-95 translate-y-1",
          "transition-all duration-150 ease-out",
          "data-[visible=true]:opacity-100",
          "data-[visible=true]:scale-100",
          "data-[visible=true]:translate-y-0",
          TOOLTIP_ANIMATION[side],
          wrapper,
        )}
      >
        {content}
        <Box className={arrow} aria-hidden="true" />
      </Box>
    </Box>
  );
};
