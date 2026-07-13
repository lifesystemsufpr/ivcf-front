import { useQuery } from "@tanstack/react-query";
import { AssessmentService } from "@/features/assessment";

export interface AssessmentFilters {
  classification?: string;
  startDate?: string;
  endDate?: string;
}

export default function useFetchAssessments(
  participantId: string,
  filters?: AssessmentFilters,
) {
  return useQuery({
    queryKey: ["assessments", participantId, filters],
    queryFn: () => AssessmentService.getParticipantResponses(participantId, filters),
    enabled: !!participantId,
    staleTime: 5 * 60 * 1000,
  });
}
