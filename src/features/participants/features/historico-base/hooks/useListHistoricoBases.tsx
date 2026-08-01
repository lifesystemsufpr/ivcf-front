import { useQuery } from "@tanstack/react-query";
import { http } from "@/core/services/client.service";
import type { GetBasesResponse } from "../types";

export function useListHistoricoBases(participantId: string) {
  return useQuery({
    queryKey: ["historico-bases", participantId],
    queryFn: async () => {
      const response = await http.get<GetBasesResponse>(
        `/participants/${participantId}/historico-bases`,
      );
      return response;
    },
  });
}
