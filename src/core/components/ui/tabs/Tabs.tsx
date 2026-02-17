import * as React from "react";
import { cn } from "../../../utils";
import { TabsContext } from "./TabContext";

export interface TabsProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange"
> {
  value: string | number;
  onChange: (value: string | number) => void;
  orientation?: "horizontal" | "vertical";
  variant?: "standard" | "scrollable" | "fullWidth";
  children: React.ReactNode;
}

export function Tabs({
  value,
  onChange,
  orientation = "horizontal",
  variant = "standard",
  children,
  className,
  ...props
}: TabsProps) {
  const contextValue = React.useMemo(
    () => ({
      value,
      onChange,
      orientation,
      variant,
    }),
    [value, onChange, orientation, variant],
  );

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={cn("w-full", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}
