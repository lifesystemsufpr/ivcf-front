import type { PageState } from "../../header/TableColumn";

export function paginateRows<T>(rows: T[], page: number, pageSize: number) {
  const safePageSize = pageSize > 0 ? pageSize : 10;
  const totalItems = rows.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / safePageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);

  const startIndex = (safePage - 1) * safePageSize;
  const endIndex = startIndex + safePageSize;

  const pageState: PageState = {
    page: safePage,
    pageSize: safePageSize,
    totalItems,
    totalPages,
    start: totalItems === 0 ? 0 : startIndex + 1,
    end: Math.min(endIndex, totalItems),
  };

  return {
    rows: rows.slice(startIndex, endIndex),
    pageState,
  };
}
