import { client, http } from "@/core/services/client.service";
import type {
  FragilityDashboardResponse,
  FragilityFilters,
  AggregationDimension,
  Sex,
  DetailChartResponse,
} from "../types";
import { apiRoutes } from "@/core/configs/api.routes";
import type { SuccessResponse } from "@/core/types";

export interface DetailChartParams {
  classification: string;
  page: number;
  pageSize: number;
  orderBy: string;
  orderDirection: "asc" | "desc";
  sex: Sex | "all";
  ageMin?: number;
  ageMax?: number;
  start?: string;
  end?: string;
}

export const fragilityService = {
  async getDashboardData(
    filters: FragilityFilters,
    stratification: AggregationDimension,
  ): Promise<FragilityDashboardResponse> {
    const { ageRange, period, sex } = filters;
    try {
      const resp = client<FragilityDashboardResponse>(
        apiRoutes.ASSESSMENTS.DASHBOARD,
        {
          method: "GET",
          query: {
            ageMin: ageRange?.[0] || null,
            ageMax: ageRange?.[1] || null,
            start: period?.start || null,
            end: period?.end || null,
            sex: sex || "all",
            stratification,
          },
        },
      );
      return resp;
    } catch (error) {
      console.error(
        "Erro ao buscar dados do dashboard, retornando mock:",
        error,
      );
      throw error;
    }
  },

  async detailChart(params: DetailChartParams) {
    try {
      const resp = http.get<SuccessResponse<DetailChartResponse[]>>(
        apiRoutes.ASSESSMENTS.DETAIL_CHART,
        {
          query: {
            classification: params.classification,
            page: params.page,
            pageSize: params.pageSize,
            orderBy: params.orderBy,
            orderDirection: params.orderDirection,
            sex: params.sex,
            ageMin: params.ageMin,
            ageMax: params.ageMax,
            start: params.start,
            end: params.end,
          },
        },
      );
      return resp;
    } catch (error) {
      console.error(
        "Erro ao buscar dados do gráfico detalhado, retornando mock:",
        error,
      );
      throw error;
    }
  },

  async exportCsv(filters: FragilityFilters): Promise<void> {
    console.log("Exportando CSV com filtros:", filters);
    // Simulação de download
    return Promise.resolve();
  },
};
