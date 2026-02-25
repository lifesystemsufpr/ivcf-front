import * as React from "react";
import { useTableContext } from "../root/TableContext";
import { TableRow } from "./TableRow";

type TableBodyProps<T> = {
  emptyMessage?: string;
  renderActions?: (row: T) => React.ReactNode;
  onRowClick?: (row: T) => void;
};

export function TableBody<T>({
  emptyMessage = "Nenhum registro encontrado",
  renderActions,
  onRowClick,
}: TableBodyProps<T>) {
  const { visibleData, columns, selection, getRowId } = useTableContext<T>();

  if (!visibleData.length) {
    const colSpan =
      columns.length + (selection.enabled ? 1 : 0) + (renderActions ? 1 : 0);

    return (
      <tbody>
        <tr>
          <td
            colSpan={colSpan}
            className="px-4 py-6 text-center text-sm text-muted-foreground"
          >
            {emptyMessage}
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody>
      {visibleData.map((row, index) => (
        <TableRow
          key={getRowId(row, index)}
          row={row}
          rowIndex={index}
          renderActions={renderActions}
          onClick={onRowClick}
        />
      ))}
    </tbody>
  );
}
