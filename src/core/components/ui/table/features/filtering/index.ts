import {
  getColumnValue,
  type FilterState,
  type TableColumnDef,
} from "../../header/TableColumn";

const normalizeTerm = (term: string) => term.trim().toLowerCase();

export function filterRows<T>(
  rows: T[],
  columns: TableColumnDef<T>[],
  filterState: FilterState,
) {
  const activeFilters = Object.entries(filterState).filter(
    ([, value]) => value,
  );
  if (!activeFilters.length) return rows;

  return rows.filter((row) => {
    return activeFilters.every(([field, term]) => {
      const column = columns.find(
        (col) => String(col.id ?? col.field) === field,
      );

      if (!column) return true;
      const value = getColumnValue(row, column);
      const normalizedTerm = normalizeTerm(term);

      if (column.filterFn) {
        return column.filterFn(value, row, term);
      }

      if (value == null) return false;

      return String(value).toLowerCase().includes(normalizedTerm);
    });
  });
}
