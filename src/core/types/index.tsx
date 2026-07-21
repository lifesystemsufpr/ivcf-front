export type FrailtyClassification =
  | "Robusto"
  | "Pré-frágil"
  | "Em Risco de Fragilização"
  | "Frágil"
  | "Todos";

export const frailtyClassificationList: FrailtyClassification[] = [
  "Robusto",
  "Pré-frágil",
  "Em Risco de Fragilização",
  "Frágil",
  "Todos",
];

export type SystemRole = "HEALTH_PROFESSIONAL" | "PARTICIPANT";

export interface ErrorResponse {
  status: number;
  message: string;
  data?: unknown;
}

export interface MetaPagination {
  total: number;
  page: number;
  pageSize: number;
  lastPage: number;
}

export interface SuccessResponse<T> {
  meta?: MetaPagination;
  data: T;
}
