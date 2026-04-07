import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ParticipantsService } from "../services/participants.service";
import type { LinkParticipantRequest } from "../types";

export function useLinkParticipantToProfessional() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ participantId }: LinkParticipantRequest) =>
      ParticipantsService.linkParticipantToProfessional({ participantId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["participants"] });
    },
  });
}
