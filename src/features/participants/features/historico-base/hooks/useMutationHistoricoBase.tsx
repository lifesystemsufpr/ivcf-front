import { http } from "@/core/services/client.service";
import { apiRoutes } from "@/core/configs/api.routes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Base, CreateBaseRequest } from "../types";

/**
 * Hook para criar um novo histórico base para um participante, seja do zero
 * (FROM_SCRATCH) ou copiando bases já existentes (COPIED).
 * @param participantId - O ID do participante.
 * @returns O hook de mutação.
 */
export function useMutationHistoricoBase(participantId: string) {
  const queryClient = useQueryClient();
  const queryKey = ["historico-bases", participantId];

  return useMutation({
    mutationFn: (data: CreateBaseRequest) =>
      http.post<Base>(
        apiRoutes.HISTORICO_BASES.CREATE({ id: participantId }),
        data,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
