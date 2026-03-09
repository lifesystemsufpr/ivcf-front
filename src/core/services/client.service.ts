import { API_URL_BASE } from "../configs/api.routes";

export const ACCESS_TOKEN_KEY = "ivcf.accessToken";
export const REFRESH_TOKEN_KEY = "ivcf.refreshToken";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type RequestOptions = {
  method?: HttpMethod;
  body?: unknown;
  query?: Record<string, string | number | boolean | null | undefined>;
  headers?: HeadersInit;
  auth?: boolean;
  signal?: AbortSignal;
};

export type ApiError = {
  status: number;
  message: string;
  data?: unknown;
};

const isAbsoluteUrl = (path: string) => path.startsWith("http");

const buildUrl = (path: string, query?: RequestOptions["query"]) => {
  const base = isAbsoluteUrl(path) ? path : `${API_URL_BASE}${path}`;
  const url = new URL(base);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      url.searchParams.set(key, String(value));
    });
  }

  return url.toString();
};

export const getStoredAccessToken = () =>
  localStorage.getItem(ACCESS_TOKEN_KEY);
export const getStoredRefreshToken = () =>
  localStorage.getItem(REFRESH_TOKEN_KEY);

export const setStoredTokens = (accessToken: string, refreshToken?: string) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
};

export const clearStoredTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

export async function client<T>(
  path: string,
  {
    method = "GET",
    body,
    query,
    headers,
    auth = true,
    signal,
  }: RequestOptions = {},
): Promise<T> {
  const url = buildUrl(path, query);
  const controller = new AbortController();
  const finalSignal = signal ?? controller.signal;

  const defaultHeaders: HeadersInit = {
    Accept: "application/json",
  };

  const accessToken = auth ? getStoredAccessToken() : null;
  if (auth && accessToken) {
    defaultHeaders.Authorization = `Bearer ${accessToken}`;
  }

  let resolvedBody: BodyInit | undefined;
  if (body instanceof FormData) {
    resolvedBody = body;
  } else if (body !== undefined) {
    defaultHeaders["Content-Type"] = "application/json";
    resolvedBody = JSON.stringify(body);
  }

  const response = await fetch(url, {
    method,
    headers: { ...defaultHeaders, ...headers },
    body: resolvedBody,
    signal: finalSignal,
    credentials: "include",
  });

  const rawText = await response.text();
  const parsed = rawText ? safeJson(rawText) : null;

  if (!response.ok) {
    const error: ApiError = {
      status: response.status,
      message: parsed?.message || response.statusText || "Erro inesperado",
      data: parsed ?? rawText,
    };
    throw error;
  }

  // Some endpoints may return empty bodies (204 or head requests).
  if (!rawText) return undefined as T;

  return parsed as T;
}

const safeJson = (text: string) => {
  try {
    return JSON.parse(text);
  } catch (error) {
    console.warn("Resposta nao estava em JSON valido", error);
    return null;
  }
};

export const http = {
  get: <T>(path: string, options?: Omit<RequestOptions, "method" | "body">) =>
    client<T>(path, { ...options, method: "GET" }),
  post: <T>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method">,
  ) => client<T>(path, { ...options, method: "POST", body }),
  put: <T>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method">,
  ) => client<T>(path, { ...options, method: "PUT", body }),
  patch: <T>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method">,
  ) => client<T>(path, { ...options, method: "PATCH", body }),
  delete: <T>(path: string, options?: Omit<RequestOptions, "method">) =>
    client<T>(path, { ...options, method: "DELETE" }),
};
