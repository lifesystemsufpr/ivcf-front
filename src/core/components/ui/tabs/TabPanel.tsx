import * as React from "react";
import { cn } from "../../../utils";
import { TabsContext } from "./TabContext";

export interface TabPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string | number;
  keepMounted?: boolean;
}

export function TabPanel({
  value,
  keepMounted = false,
  className,
  children,
  ...props
}: TabPanelProps) {
  const context = React.useContext(TabsContext);
  const isActive = context?.value === value;

  if (!isActive && !keepMounted) {
    return null;
  }

  return (
    <div
      role="tabpanel"
      id={`tabpanel-${value}`}
      aria-labelledby={`tab-${value}`}
      hidden={!isActive}
      className={cn("pt-4", !isActive && "hidden", className)}
      {...props}
    >
      {children}
    </div>
  );
}
