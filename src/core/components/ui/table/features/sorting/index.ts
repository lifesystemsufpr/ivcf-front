import {
  getColumnValue,
  type SortState,
  type TableColumnDef,
} from "../../header/TableColumn";

const normalize = (value: unknown) => {
  if (value instanceof Date) return value.getTime();
  if (typeof value === "string") return value.toLowerCase();
  return value as number | string | null | undefined;
};

export function nextSortState(
  current: SortState,
  field: string | null,
): SortState {
  if (!field) return { field: null, direction: "asc" };

  if (current.field !== field) {
    return { field, direction: "asc" };
  }

  if (current.direction === "asc") {
    return { field, direction: "desc" };
  }

  return { field: null, direction: "asc" };
}

export function sortRows<T>(
  rows: T[],
  columns: TableColumnDef<T>[],
  sortState: SortState,
) {
  if (!sortState.field) return rows;

  const column = columns.find(
    (col) => String(col.id ?? col.field) === sortState.field,
  );

  if (!column || !column.sortable) return rows;

  const sorted = [...rows].sort((a, b) => {
    const aValue = normalize(getColumnValue(a, column));
    const bValue = normalize(getColumnValue(b, column));

    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return -1;
    if (bValue == null) return 1;

    if (aValue > bValue) return 1;
    if (aValue < bValue) return -1;
    return 0;
  });

  return sortState.direction === "desc" ? sorted.reverse() : sorted;
}
