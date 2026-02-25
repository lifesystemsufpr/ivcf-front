import * as React from "react";
import {
  type FilterState,
  type PageState,
  type SortState,
  type TableColumnDef,
} from "../header/TableColumn";

export type SelectionState = {
  enabled: boolean;
  selectedRowIds: Set<string>;
  isRowSelected: (id: string) => boolean;
  toggleRow: (id: string) => void;
  selectAll: (ids: string[]) => void;
  clearSelection: () => void;
};

export type TableContextValue<T> = {
  data: T[];
  columns: TableColumnDef<T>[];
  visibleData: T[];
  sortState: SortState;
  filterState: FilterState;
  pageState: PageState;
  actions: {
    setSort: (field: string | null) => void;
    setFilter: (field: string, value: string) => void;
    setPage: (page: number) => void;
    setPageSize: (size: number) => void;
  };
  selection: SelectionState;
  getRowId: (row: T, index: number) => string;
};

export const TableContext = React.createContext<TableContextValue<any> | null>(
  null,
);

export function useTableContext<T>() {
  const context = React.useContext(TableContext);

  if (!context) {
    throw new Error("Table components must be used inside <Table.Root>");
  }

  return context as TableContextValue<T>;
}
