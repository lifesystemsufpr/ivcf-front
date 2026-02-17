import * as React from "react";

export interface TabsContextValue {
  value: string | number;
  onChange: (value: string | number) => void;
  orientation: "horizontal" | "vertical";
  variant: "standard" | "scrollable" | "fullWidth";
}

export const TabsContext = React.createContext<TabsContextValue | undefined>(
  undefined,
);

export const useTabsContext = () => {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error("Tab/TabPanel must be used within Tabs");
  }
  return context;
};
