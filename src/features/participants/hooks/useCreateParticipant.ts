import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ParticipantsService } from "../services/participants.service";
import type { ParticipantRequest } from "../types";

export function useCreateParticipant() {
  const queryClient = useQueryClient();
  const queryKey = ["participants"];

  return useMutation({
    mutationFn: (data: ParticipantRequest) =>
      ParticipantsService.createParticipant(data),

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
