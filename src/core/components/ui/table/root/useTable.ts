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
  } = options;

  const getRowId = React.useCallback(
    (row: T, index: number) => {
      const customId = getRowIdProp?.(row, index);
      if (customId != null) return String(customId);

      const dataIndex = data.indexOf(row);
      return String(dataIndex >= 0 ? dataIndex : index);
    },
    [getRowIdProp, data],
  );

  const [sortState, setSortState] = React.useState<SortState>(
    initialSort ?? defaultSort,
  );

  const [filterState, setFilterState] = React.useState<FilterState>(
    initialFilters ?? {},
  );

  const [page, setPage] = React.useState(initialPage);
  const [pageSizeState, setPageSizeState] = React.useState(pageSize);

  const [selectedRowIds, setSelectedRowIds] = React.useState<Set<string>>(
    () => new Set((initialSelectedRows ?? []).map(String)),
  );

  const filteredData = React.useMemo(
    () => filterRows(data, columns, filterState),
    [data, columns, filterState],
  );

  const sortedData = React.useMemo(
    () => sortRows(filteredData, columns, sortState),
    [filteredData, columns, sortState],
  );

  const { rows: visibleData, pageState } = React.useMemo(() => {
    return paginateRows(sortedData, page, pageSizeState);
  }, [sortedData, page, pageSizeState]);

  React.useEffect(() => {
    if (pageState.page !== page) {
      setPage(pageState.page);
    }
  }, [pageState.page, page]);

  const actions = React.useMemo(
    () => ({
      setSort: (field: string | null) => {
        setSortState((current) => nextSortState(current, field));
      },
      setFilter: (field: string, value: string) => {
        setFilterState((current) => ({
          ...current,
          [field]: value,
        }));
        setPage(1);
      },
      setPage: (nextPage: number) => setPage(nextPage),
      setPageSize: (size: number) => {
        const nextSize = size > 0 ? size : pageSizeState;
        setPageSizeState(nextSize);
        setPage(1);
      },
    }),
    [pageSizeState],
  );

  const selection: SelectionState = React.useMemo(() => {
    const enabled = enableSelection;

    const isRowSelected = (id: string) => selectedRowIds.has(id);

    const toggleRow = (id: string) =>
      setSelectedRowIds((current) => toggleSelection(current, id));

    const selectAll = (ids: string[]) =>
      setSelectedRowIds((current) => selectMany(current, ids));

    const clear = () => setSelectedRowIds(clearSelection());

    return {
      enabled,
      selectedRowIds,
      isRowSelected,
      toggleRow,
      selectAll,
      clearSelection: clear,
    };
  }, [enableSelection, selectedRowIds]);

  const tableState: TableContextValue<T> = {
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

  return tableState;
}
