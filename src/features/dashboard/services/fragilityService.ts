import { getMockedData } from "../mocks/mockPage";
import type {
  FragilityDashboardResponse,
  FragilityFilters,
  AggregationDimension,
} from "../types";

export const fragilityService = {
  async getDashboardData(
    filters: FragilityFilters,
    stratification: AggregationDimension,
  ): Promise<FragilityDashboardResponse> {
    // Simula atraso de rede
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = getMockedData(filters, stratification);
        resolve(data);
      }, 300);
    });
  },

  async exportCsv(filters: FragilityFilters): Promise<void> {
    console.log("Exportando CSV com filtros:", filters);
    // Simulação de download
    return Promise.resolve();
  },
};
