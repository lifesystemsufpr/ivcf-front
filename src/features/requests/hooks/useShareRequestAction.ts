import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ShareRequestsService,
  type ShareRequestAction,
} from "../services/share-requests.service";

export interface ShareRequestActionVariables {
  id: string;
  action: ShareRequestAction;
}

/**
 * Aprova, rejeita ou cancela uma solicitação de compartilhamento.
 * Aprovar gera uma nova base para o solicitante, entao o histórico de bases
 * tambem e invalidado.
 */
export function useShareRequestAction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, action }: ShareRequestActionVariables) =>
      ShareRequestsService.runAction(action, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["share-requests"] });
      queryClient.invalidateQueries({ queryKey: ["historico-bases"] });
    },
  });
}
