import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type {
  FragilityDashboardResponse,
  FragilityFilters,
  AggregationDimension,
} from "../types";
import { useFragilityData } from "../hooks/useFragilityData";

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
  refresh: () => void;
}

const DashboardContext = createContext<DashboardContextData | undefined>(
  undefined,
);

interface DashboardProviderProps {
  children: ReactNode;
}

export function DashboardProvider({ children }: DashboardProviderProps) {
  const [stratification, setStratification] =
    useState<AggregationDimension>("sex");

  const [trendBySex, setTrendBySex] = useState(true);

  const [filters, setFilters] = useState<FragilityFilters>({
    sex: "all",
  });

  const { data, isLoading, isFetching, error, refetch } = useFragilityData(
    filters,
    stratification,
  );

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
        data: data ?? null,
        loading: isLoading,
        isRefreshing: isFetching,
        error: error ? "Erro ao carregar dados." : null,
        filters,
        stratification,
        trendBySex,
        setFilter,
        setStratification,
        setTrendBySex,
        refresh: refetch,
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
