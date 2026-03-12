import { ParticipantsService } from "@/features/participants/services/participants.service";
import { useQuery } from "@tanstack/react-query";

export function useFetchIndicators(participantId: string) {
  return useQuery({
    queryKey: ["participant-indicators", participantId],
    queryFn: () => ParticipantsService.getParticipantIndicators(participantId),
  });
}
