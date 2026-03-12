import { useQuery } from "@tanstack/react-query";
import { AssessmentService } from "../services/assessment.service";

export function useAssessmentResponse(assessmentId: string | null) {
  return useQuery({
    queryKey: ["assessment-response", assessmentId],
    queryFn: async () => {
      if (!assessmentId) throw new Error("Assessment ID is required");
      return AssessmentService.getAssessmentResponse(assessmentId);
    },
    enabled: !!assessmentId,
    staleTime: 1000 * 60 * 5,
  });
}
