import * as React from "react";
import { cn } from "../../utils";

export function Alert({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative w-full rounded-lg border border-border bg-muted p-4 text-sm",
        className,
      )}
      {...props}
    />
  );
}
