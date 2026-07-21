import { client } from "@/core/services/client.service";
import type {
  FragilityDashboardResponse,
  FragilityFilters,
  AggregationDimension,
} from "../types";
import { apiRoutes } from "@/core/configs/api.routes";

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

  async exportCsv(filters: FragilityFilters): Promise<void> {
    console.log("Exportando CSV com filtros:", filters);
    // Simulação de download
    return Promise.resolve();
  },
};
