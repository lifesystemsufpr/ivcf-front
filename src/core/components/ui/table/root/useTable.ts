import * as React from "react";
import {
  type FilterState,
  type SortState,
  type TableColumnDef,
} from "../header/TableColumn";
import { filterRows } from "../features/filtering";
import { paginateRows } from "../features/pagination";
import {
  clearSelection,
  selectMany,
  toggleSelection,
} from "../features/selection";
import { nextSortState, sortRows } from "../features/sorting";
import { type SelectionState, type TableContextValue } from "./TableContext";

// ─── Server-side config ───────────────────────────────────────────────────────

export type ServerSideOptions = {
  // ── Paginação ──────────────────────────────────────────────────────────────
  /** meta.total vindo da API */
  total: number;
  /** página atual controlada externamente (1-based) */
  page: number;
  /** tamanho de página controlado externamente */
  pageSize: number;
  /** chamado quando o usuário troca de página */
  onPageChange: (page: number) => void;
  /** chamado quando o usuário troca o tamanho de página */
  onPageSizeChange: (pageSize: number) => void;

  // ── Ordenação (opcional) ───────────────────────────────────────────────────
  /** estado atual de sort controlado externamente */
  sort?: SortState;
  /**
   * Chamado quando o usuário clica em um cabeçalho ordenável.
   * Recebe o PRÓXIMO estado de sort já calculado (field + direction).
   * Ao mudar o sort, volte `page` para 1 no seu handler.
   */
  onSortChange?: (sort: SortState) => void;

  // ── Filtros (opcional) ─────────────────────────────────────────────────────
  filters?: FilterState;
  onFilterChange?: (field: string, value: string) => void;
};

// ─── Options ──────────────────────────────────────────────────────────────────

export type UseTableOptions<T> = {
  data: T[];
  columns: TableColumnDef<T>[];
  initialSort?: SortState;
  initialFilters?: FilterState;
  initialPage?: number;
  pageSize?: number;
  enableSelection?: boolean;
  initialSelectedRows?: Array<string | number>;
  getRowId?: (row: T, index: number) => string | number;
  serverSide?: ServerSideOptions;
};

const defaultSort: SortState = { field: null, direction: "asc" };

export function useTable<T>(options: UseTableOptions<T>): TableContextValue<T> {
  const {
    data,
    columns,
    initialSort,
    initialFilters,
    initialPage = 1,
    pageSize = 10,
    enableSelection = false,
    initialSelectedRows,
    getRowId: getRowIdProp,
    serverSide,
  } = options;

  const isServerSide = serverSide != null;

  const getRowId = React.useCallback(
    (row: T, index: number) => {
      const customId = getRowIdProp?.(row, index);
      if (customId != null) return String(customId);
      const dataIndex = data.indexOf(row);
      return String(dataIndex >= 0 ? dataIndex : index);
    },
    [getRowIdProp, data],
  );

  // ── Estado interno (client-side only) ─────────────────────────────────────

  const [internalSort, setInternalSort] = React.useState<SortState>(
    initialSort ?? defaultSort,
  );
  const [internalFilters, setInternalFilters] = React.useState<FilterState>(
    initialFilters ?? {},
  );
  const [page, setPage] = React.useState(initialPage);
  const [pageSizeState, setPageSizeState] = React.useState(pageSize);

  // ── Estado exposto (server usa externo, client usa interno) ────────────────

  const sortState: SortState = isServerSide
    ? (serverSide.sort ?? defaultSort)
    : internalSort;

  const filterState: FilterState = isServerSide
    ? (serverSide.filters ?? {})
    : internalFilters;

  // ── Dados visíveis ─────────────────────────────────────────────────────────

  const { visibleData, pageState } = React.useMemo(() => {
    if (isServerSide) {
      const { total, page: serverPage, pageSize: serverPageSize } = serverSide;
      const totalPages = Math.max(1, Math.ceil(total / serverPageSize));
      const start = total === 0 ? 0 : (serverPage - 1) * serverPageSize + 1;
      const end = Math.min(serverPage * serverPageSize, total);

      return {
        visibleData: data,
        pageState: {
          page: serverPage,
          pageSize: serverPageSize,
          totalItems: total,
          totalPages,
          start,
          end,
        },
      };
    }

    const filtered = filterRows(data, columns, filterState);
    const sorted = sortRows(filtered, columns, sortState);
    const paginated = paginateRows(sorted, page, pageSizeState);

    return {
      visibleData: paginated.rows,
      pageState: paginated.pageState,
    };
  }, [
    isServerSide,
    serverSide,
    data,
    columns,
    filterState,
    sortState,
    page,
    pageSizeState,
  ]);

  React.useEffect(() => {
    if (!isServerSide && pageState.page !== page) {
      setPage(pageState.page);
    }
  }, [isServerSide, pageState.page, page]);

  // ── Actions ────────────────────────────────────────────────────────────────

  const actions = React.useMemo(
    () => ({
      setSort: (field: string | null) => {
        if (isServerSide) {
          const next = nextSortState(serverSide.sort ?? defaultSort, field);
          serverSide.onSortChange?.(next);
        } else {
          setInternalSort((current) => nextSortState(current, field));
        }
      },

      setFilter: (field: string, value: string) => {
        if (isServerSide) {
          serverSide.onFilterChange?.(field, value);
        } else {
          setInternalFilters((current) => ({ ...current, [field]: value }));
          setPage(1);
        }
      },

      setPage: (nextPage: number) => {
        if (isServerSide) {
          serverSide.onPageChange(nextPage);
        } else {
          setPage(nextPage);
        }
      },

      setPageSize: (size: number) => {
        if (isServerSide) {
          serverSide.onPageSizeChange(size);
        } else {
          const nextSize = size > 0 ? size : pageSizeState;
          setPageSizeState(nextSize);
          setPage(1);
        }
      },
    }),
    [isServerSide, serverSide, pageSizeState],
  );

  // ── Selection ──────────────────────────────────────────────────────────────

  const [selectedRowIds, setSelectedRowIds] = React.useState<Set<string>>(
    () => new Set((initialSelectedRows ?? []).map(String)),
  );

  const selection: SelectionState = React.useMemo(
    () => ({
      enabled: enableSelection,
      selectedRowIds,
      isRowSelected: (id: string) => selectedRowIds.has(id),
      toggleRow: (id: string) =>
        setSelectedRowIds((current) => toggleSelection(current, id)),
      selectAll: (ids: string[]) =>
        setSelectedRowIds((current) => selectMany(current, ids)),
      clearSelection: () => setSelectedRowIds(clearSelection()),
    }),
    [enableSelection, selectedRowIds],
  );

  return {
    data,
    columns,
    visibleData,
    sortState,
    filterState,
    pageState,
    actions,
    selection,
    getRowId,
  };
}
