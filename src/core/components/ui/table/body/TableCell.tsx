import * as React from "react";
import { cn } from "../../../../utils";
import { getColumnValue, type TableColumnDef } from "../header/TableColumn";

type TableCellProps<T> = {
  row: T;
  column: TableColumnDef<T>;
};

export function TableCell<T>({ row, column }: TableCellProps<T>) {
  const value = getColumnValue(row, column);
  const content = column.render ? column.render(value, row) : (value ?? "—");

  return (
    <td
      style={{ width: column.width }}
      className={cn(
        "px-4 py-3 align-middle text-foreground",
        column.align === "right" && "text-right",
        column.align === "center" && "text-center",
        column.className,
      )}
    >
      {content as React.ReactNode}
    </td>
  );
}
