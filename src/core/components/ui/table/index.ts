import { TableBody } from "./body/TableBody";
import { TableCell } from "./body/TableCell";
import { TableRow } from "./body/TableRow";
import { TableFooter } from "./footer/TableFooter";
import { TablePagination } from "./footer/TablePagination";
import { TableHeader } from "./header/TableHeader";
import { createColumn } from "./header/TableColumn";
import { useTableContext } from "./root/TableContext";
import { TableRoot } from "./root/TableRoot";
import { useTable } from "./root/useTable";

export const Table = {
  Root: TableRoot,
  Header: TableHeader,
  Body: TableBody,
  Row: TableRow,
  Cell: TableCell,
  Footer: TableFooter,
  Pagination: TablePagination,
};

export {
  TableRoot,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableFooter,
  TablePagination,
  createColumn,
  useTable,
  useTableContext,
};

export type {
  TableColumnDef,
  SortState,
  FilterState,
  PageState,
} from "./header/TableColumn";
export type { UseTableOptions } from "./root/useTable";
export type { SelectionState, TableContextValue } from "./root/TableContext";
