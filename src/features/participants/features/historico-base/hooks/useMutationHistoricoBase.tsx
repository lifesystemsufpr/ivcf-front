import { http } from "@/core/services/client.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useMutationHistoricoBase(participantId: string) {
  const queryClient = useQueryClient();
  const queryKey = ["historico-bases", participantId];

  return useMutation({
    mutationFn: async (data) => {
      const response = await http.post(
        `/participants/${participantId}/historico-bases`,
        data,
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
