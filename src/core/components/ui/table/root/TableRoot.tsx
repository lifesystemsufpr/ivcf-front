import * as React from "react";
import { cn } from "../../../../utils";
import { TableContext } from "./TableContext";
import { useTable, type UseTableOptions } from "./useTable";

export type TableRootProps<T> = UseTableOptions<T> & {
  children: React.ReactNode;
  className?: string;
  wrapperClassName?: string;
};

export function TableRoot<T>({
  children,
  className,
  wrapperClassName,
  ...options
}: TableRootProps<T>) {
  const table = useTable(options);

  return (
    <TableContext.Provider value={table}>
      <div
        className={cn(
          "w-full overflow-hidden rounded-lg border border-border bg-card",
          wrapperClassName,
        )}
      >
        <div className="overflow-x-auto">
          <table
            className={cn(
              "w-full border-collapse text-sm text-foreground",
              className,
            )}
          >
            {children}
          </table>
        </div>
      </div>
    </TableContext.Provider>
  );
}
