import * as React from "react";

export type SortDirection = "asc" | "desc";

export type SortState = {
  field: string | null;
  direction: SortDirection;
};

export type FilterState = Record<string, string>;

export type PageState = {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  start: number;
  end: number;
};

export type ColumnAlign = "left" | "center" | "right";

export type TableColumnDef<T> = {
  id?: string;
  field: keyof T | string;
  header: React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  width?: number | string;
  align?: ColumnAlign;
  className?: string;
  render?: (value: unknown, row: T) => React.ReactNode;
  renderHeader?: (
    column: TableColumnDef<T>,
    sortState: SortState,
  ) => React.ReactNode;
  filterFn?: (value: unknown, row: T, term: string) => boolean;
  accessor?: (row: T) => unknown;
};

const getPathValue = (row: unknown, path: string) => {
  return path.split(".").reduce<unknown>((current, key) => {
    if (current && typeof current === "object") {
      return (current as Record<string, unknown>)[key];
    }
    return undefined;
  }, row);
};

export function getColumnValue<T>(row: T, column: TableColumnDef<T>) {
  if (typeof column.accessor === "function") {
    return column.accessor(row);
  }

  const fieldPath = String(column.field);
  return getPathValue(row as unknown, fieldPath);
}

export function createColumn<T>(column: TableColumnDef<T>) {
  return column;
}
