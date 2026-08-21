import { useQuery } from "@tanstack/react-query";
import {
  fragilityService,
  type DetailChartParams,
} from "../services/fragilityService";

export function useDetailChart(params: DetailChartParams) {
  return useQuery({
    queryKey: ["detailChart", params],
    queryFn: async () => fragilityService.detailChart(params),
    staleTime: 60 * 1000,
    enabled: !!params.classification && !!params.page && !!params.pageSize,
  });
}
