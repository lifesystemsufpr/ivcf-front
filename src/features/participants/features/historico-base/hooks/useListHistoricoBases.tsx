import { useQuery } from "@tanstack/react-query";
import { http } from "@/core/services/client.service";
import { apiRoutes } from "@/core/configs/api.routes";
import type { GetBasesResponse } from "../types";

export function useListHistoricoBases(participantId: string) {
  return useQuery({
    queryKey: ["historico-bases", participantId],
    queryFn: () =>
      http.get<GetBasesResponse>(
        apiRoutes.HISTORICO_BASES.LIST({ id: participantId }),
      ),
    enabled: !!participantId,
  });
}
