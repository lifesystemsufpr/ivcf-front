import { Button } from "@/core/components/ui";
import type { MetaPagination } from "@/core/types";

type RiskDetailPaginationProps = {
  meta: MetaPagination;
  disabled?: boolean;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
};

export function RiskDetailPagination({
  meta,
  disabled = false,
  pageSizeOptions = [5, 8, 10, 20, 50],
  onPageChange,
  onPageSizeChange,
}: RiskDetailPaginationProps) {
  const { total, page, pageSize, lastPage } = meta;

  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  const canPrevious = page > 1;
  const canNext = page < lastPage;

  return (
    <div className="flex flex-col gap-3 border-t border-border/60 pt-3 text-sm">
      <div className="text-xs text-muted-foreground">
        Mostrando {start} - {end} de {total}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={disabled || !canPrevious}
            onClick={() => onPageChange(page - 1)}
          >
            Anterior
          </Button>
          <span className="text-xs text-muted-foreground">
            Página {page} de {lastPage || 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={disabled || !canNext}
            onClick={() => onPageChange(page + 1)}
          >
            Próxima
          </Button>
        </div>

        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          Itens/pg
          <select
            className="rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground focus:border-primary focus:outline-none disabled:opacity-50"
            value={pageSize}
            disabled={disabled}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
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
  );
}
