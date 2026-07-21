import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ParticipantsService } from "../services/participants.service";

export function useDeleteParticipant() {
  const queryClient = useQueryClient();
  const queryKey = ["participants"];

  return useMutation({
    mutationFn: (id: string) => ParticipantsService.deleteParticipant(id),

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
