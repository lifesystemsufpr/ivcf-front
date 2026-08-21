import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ShareRequestsService } from "../services/share-requests.service";
import type { CreateShareRequestDto } from "../types";

/**
 * Cria uma solicitação de compartilhamento das bases selecionadas de um
 * participante com o profissional logado.
 */
export function useMutationShareRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateShareRequestDto) =>
      ShareRequestsService.createShareRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["share-requests"] });
    },
  });
}
