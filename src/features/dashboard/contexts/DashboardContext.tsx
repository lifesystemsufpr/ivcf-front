import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type {
  FragilityDashboardResponse,
  FragilityFilters,
  AggregationDimension,
} from "../types";
import { fragilityService } from "../services/fragilityService";

interface DashboardContextData {
  data: FragilityDashboardResponse | null;
  loading: boolean;
  isRefreshing: boolean;
  error: string | null;
  filters: FragilityFilters;
  stratification: AggregationDimension;
  trendBySex: boolean;
  setFilter: <K extends keyof FragilityFilters>(
    key: K,
    value: FragilityFilters[K],
  ) => void;
  setStratification: (value: AggregationDimension) => void;
  setTrendBySex: (value: boolean) => void;
  refresh: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextData | undefined>(
  undefined,
);

interface DashboardProviderProps {
  children: ReactNode;
}

export function DashboardProvider({ children }: DashboardProviderProps) {
  const [data, setData] = useState<FragilityDashboardResponse | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stratification, setStratification] =
    useState<AggregationDimension>("sex");
  const [trendBySex, setTrendBySex] = useState(true);
  const [filters, setFilters] = useState<FragilityFilters>({
    sex: "all",
  });

  const fetchDashboard = useCallback(async () => {
    setIsRefreshing(true);
    setError(null);

    try {
      const response = await fragilityService.getDashboardData(
        filters,
        stratification,
      );
      setData(response);
    } catch (err: unknown) {
      setError("Erro ao atualizar dados.");
    } finally {
      setIsInitialLoading(false);
      setIsRefreshing(false);
    }
  }, [filters, stratification]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // 🔥 Correção aqui
  const setFilter: DashboardContextData["setFilter"] = useCallback(
    (key, value) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    [],
  );

  return (
    <DashboardContext.Provider
      value={{
        data,
        loading: isInitialLoading,
        isRefreshing,
        error,
        filters,
        stratification,
        trendBySex,
        setFilter,
        setStratification,
        setTrendBySex,
        refresh: fetchDashboard,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard(): DashboardContextData {
  const context = useContext(DashboardContext);

  if (!context) {
    throw new Error(
      "useDashboard deve ser utilizado dentro de um DashboardProvider.",
    );
  }

  return context;
}
