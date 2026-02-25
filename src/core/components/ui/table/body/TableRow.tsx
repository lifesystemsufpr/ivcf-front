import * as React from "react";
import { cn } from "../../../../utils";
import { useTableContext } from "../root/TableContext";
import { TableCell } from "./TableCell";

type TableRowProps<T> = {
  row: T;
  rowIndex: number;
  className?: string;
  renderActions?: (row: T) => React.ReactNode;
  onClick?: (row: T) => void;
};

export function TableRow<T>({
  row,
  rowIndex,
  className,
  renderActions,
  onClick,
}: TableRowProps<T>) {
  const { columns, selection, getRowId } = useTableContext<T>();

  const rowId = getRowId(row, rowIndex);
  const isSelected = selection.enabled && selection.isRowSelected(rowId);

  const handleCheckboxClick: React.ChangeEventHandler<HTMLInputElement> = (
    e,
  ) => {
    e.stopPropagation();
    selection.toggleRow(rowId);
  };

  const handleRowClick = () => {
    onClick?.(row);
  };

  return (
    <tr
      className={cn(
        "border-b border-border text-sm last:border-0",
        onClick && "cursor-pointer hover:bg-muted/50",
        isSelected && "bg-primary/5",
        className,
      )}
      onClick={handleRowClick}
    >
      {selection.enabled && (
        <td className="w-10 px-4 py-3">
          <input
            type="checkbox"
            aria-label="Selecionar linha"
            checked={isSelected}
            onChange={handleCheckboxClick}
            className="h-4 w-4 rounded border-border accent-primary"
          />
        </td>
      )}

      {columns.map((column, columnIndex) => (
        <TableCell
          key={String(column.id ?? columnIndex)}
          row={row}
          column={column}
        />
      ))}

      {renderActions && (
        <td className="px-4 py-3 text-right align-middle">
          {renderActions(row)}
        </td>
      )}
    </tr>
  );
}
