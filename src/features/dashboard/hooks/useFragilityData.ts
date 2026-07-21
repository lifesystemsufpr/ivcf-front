import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fragilityService } from "../services/fragilityService";
import type {
  AggregationDimension,
  FragilityDashboardResponse,
  FragilityFilters,
} from "../types";

type FragilityQueryKey = [
  "fragilityDashboard",
  FragilityFilters,
  AggregationDimension,
];

export function useFragilityData(
  filters: FragilityFilters,
  stratification: AggregationDimension,
) {
  return useQuery<
    FragilityDashboardResponse,
    Error,
    FragilityDashboardResponse,
    FragilityQueryKey
  >({
    queryKey: [
      "fragilityDashboard",
      filters,
      stratification,
    ] as FragilityQueryKey,
    queryFn: ({ queryKey }) => {
      const [, filters, stratification] = queryKey;
      return fragilityService.getDashboardData(filters, stratification);
    },
    placeholderData: keepPreviousData,
    enabled: true,
    staleTime: 60 * 1000,
  });
}
