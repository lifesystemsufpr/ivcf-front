import { useDashboard } from "../contexts/DashboardContext";

export function useFragilityData() {
  const { data, loading, error, ...actions } = useDashboard();
  return {
    loading,
    error,
    summary: data?.summary,
    charts: data?.charts,
    metadata: data?.metadata || { ageBounds: { min: 0, max: 100 } },
    ...actions,
  };
}
