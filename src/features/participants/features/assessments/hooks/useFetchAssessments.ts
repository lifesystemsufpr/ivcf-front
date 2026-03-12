import { useQuery } from "@tanstack/react-query";
import { AssessmentService } from "@/features/assessment";

export default function useFetchAssessments(participantId: string) {
  return useQuery({
    queryKey: ["assessments", participantId],
    queryFn: () => AssessmentService.getParticipantResponses(participantId),
    enabled: !!participantId,
    staleTime: 5 * 60 * 1000,
  });
}
