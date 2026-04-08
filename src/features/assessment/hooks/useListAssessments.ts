import { useQuery } from "@tanstack/react-query";
import { AssessmentService } from "../services/assessment.service";

interface UseListAssessmentsOptions {
  page?: number;
  pageSize?: number;
  startDate?: string;
  endDate?: string;
  participantName?: string;
}

export function useListAssessments({
  page = 1,
  pageSize = 10,
  startDate,
  endDate,
  participantName,
}: UseListAssessmentsOptions = {}) {
  return useQuery({
    queryKey: [
      "assessments",
      { page, pageSize, startDate, endDate, participantName },
    ],
    queryFn: async () => {
      const data = await AssessmentService.listAllAssessments({
        page,
        pageSize,
        startDate,
        endDate,
        participantName,
      });

      const totalItems = data.meta?.total ?? 0;
      const totalPages = Math.ceil(totalItems / pageSize);

      return {
        items: data.data,
        meta: {
          total: totalItems,
          totalPages,
          page,
          pageSize,
        },
      };
    },
    staleTime: 1000 * 60 * 5,
  });
}
