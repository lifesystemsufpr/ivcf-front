import * as React from "react";
import { cn } from "../../../../utils";

type TableFooterProps = {
  children: React.ReactNode;
  className?: string;
};

export function TableFooter({ children, className }: TableFooterProps) {
  return <tfoot className={cn("bg-muted/40", className)}>{children}</tfoot>;
}
