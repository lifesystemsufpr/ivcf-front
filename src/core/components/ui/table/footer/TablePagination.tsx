import * as React from "react";
import { Button } from "../../Button";
import { useTableContext } from "../root/TableContext";

type TablePaginationProps = {
  colSpan?: number;
  pageSizeOptions?: number[];
  extraColumns?: number;
};

export function TablePagination({
  colSpan,
  pageSizeOptions = [1, 5, 10, 20, 50],
  extraColumns = 0,
}: TablePaginationProps) {
  const { pageState, actions, columns, selection } = useTableContext<any>();

  const computedColSpan =
    colSpan ?? columns.length + (selection.enabled ? 1 : 0) + extraColumns;

  const canPrevious = pageState.page > 1;
  const canNext = pageState.page < pageState.totalPages;

  const handlePageSizeChange: React.ChangeEventHandler<HTMLSelectElement> = (
    event,
  ) => {
    actions.setPageSize(Number(event.target.value));
  };

  return (
    <tr>
      <td colSpan={computedColSpan} className="px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
          <div className="text-muted-foreground">
            Mostrando {pageState.start} - {pageState.end} de{" "}
            {pageState.totalItems}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              disabled={!canPrevious}
              onClick={() => actions.setPage(pageState.page - 1)}
            >
              Anterior
            </Button>

            <span className="text-xs text-muted-foreground">
              Página {pageState.page} de {pageState.totalPages}
            </span>

            <Button
              variant="ghost"
              size="sm"
              disabled={!canNext}
              onClick={() => actions.setPage(pageState.page + 1)}
            >
              Próxima
            </Button>

            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              Itens/pg
              <select
                className="rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground focus:border-primary focus:outline-none"
                value={pageState.pageSize}
                onChange={handlePageSizeChange}
              >
                {pageSizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </td>
    </tr>
  );
}
