import * as React from "react";
import { cn } from "../../../../utils";
import { useTableContext } from "../root/TableContext";
import type { TableColumnDef } from "./TableColumn";

type TableHeaderProps = {
  className?: string;
  actionsLabel?: React.ReactNode;
  showActionsColumn?: boolean;
};

export function TableHeader({
  className,
  actionsLabel = "Ações",
  showActionsColumn,
}: TableHeaderProps) {
  const {
    columns,
    sortState,
    filterState,
    actions,
    selection,
    visibleData,
    getRowId,
  } = useTableContext<any>();

  const allSelected = React.useMemo(() => {
    if (!selection.enabled || visibleData.length === 0) return false;
    return visibleData.every((row, index) =>
      selection.isRowSelected(getRowId(row, index)),
    );
  }, [selection, visibleData, getRowId]);

  const toggleSelectAll = () => {
    if (!selection.enabled) return;

    if (allSelected) {
      selection.clearSelection();
      return;
    }

    const ids = visibleData.map((row, index) => getRowId(row, index));
    selection.selectAll(ids);
  };

  return (
    <thead className={cn("bg-muted/60", className)}>
      <tr>
        {selection.enabled && (
          <th className="w-10 px-4 py-3 text-left">
            <input
              type="checkbox"
              aria-label="Selecionar todos"
              checked={allSelected}
              onChange={toggleSelectAll}
              className="h-4 w-4 rounded border-border accent-primary"
            />
          </th>
        )}

        {columns.map((column: TableColumnDef<any>) => {
          const columnKey = String(column.id ?? column.field);
          const isSorted = sortState.field === columnKey;
          const direction = sortState.direction;

          const headerContent = column.renderHeader
            ? column.renderHeader(column, sortState)
            : column.header;

          return (
            <th
              key={columnKey}
              style={{ width: column.width }}
              className={cn(
                "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground",
                column.align === "right" && "text-right",
                column.align === "center" && "text-center",
              )}
            >
              <div className="flex items-center gap-1">
                {column.sortable ? (
                  <button
                    type="button"
                    onClick={() => actions.setSort(columnKey)}
                    className="flex items-center gap-1 text-foreground transition-colors hover:text-primary"
                  >
                    <span>{headerContent}</span>
                    <span className="text-muted-foreground">
                      {isSorted ? (direction === "asc" ? "▲" : "▼") : "↕"}
                    </span>
                  </button>
                ) : (
                  headerContent
                )}
              </div>

              {column.filterable && (
                <div className="mt-2">
                  <input
                    type="text"
                    value={filterState[columnKey] ?? ""}
                    onChange={(event) =>
                      actions.setFilter(columnKey, event.target.value)
                    }
                    placeholder="Filtrar"
                    className="w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              )}
            </th>
          );
        })}

        {showActionsColumn && (
          <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {actionsLabel}
          </th>
        )}
      </tr>
    </thead>
  );
}
