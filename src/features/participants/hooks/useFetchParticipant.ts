import { useQuery } from "@tanstack/react-query";
import { ParticipantsService } from "../services/participants.service";

interface UseFetchParticipantOptions {
  participantId: string;
}

export function useFetchParticipant({
  participantId,
}: UseFetchParticipantOptions) {
  return useQuery({
    queryKey: ["participant", participantId],
    queryFn: () => ParticipantsService.getParticipantById(participantId),
    staleTime: 10 * 60 * 1000,
    enabled: !!participantId,
  });
}
