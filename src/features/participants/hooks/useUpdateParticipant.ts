import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ParticipantsService } from "../services/participants.service";
import type { ParticipantRequest } from "../types";

interface UpdateParticipantPayload {
  id: string;
  data: ParticipantRequest;
}

export function useUpdateParticipant() {
  const queryClient = useQueryClient();
  const queryKey = ["participants"];

  return useMutation({
    mutationFn: ({ id, data }: UpdateParticipantPayload) =>
      ParticipantsService.updateParticipant(id, data),

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
