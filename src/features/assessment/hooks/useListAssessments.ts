import { useInfiniteQuery } from "@tanstack/react-query";
import { AssessmentService } from "../services/assessment.service";

interface UseListAssessmentsOptions {
  pageSize?: number;
  startDate?: string;
  endDate?: string;
  participantName?: string;
}

export function useListAssessments({
  pageSize = 10,
  startDate,
  endDate,
  participantName,
}: UseListAssessmentsOptions = {}) {
  return useInfiniteQuery({
    queryKey: ["assessments", { pageSize, startDate, endDate, participantName }],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const data = await AssessmentService.listAllAssessments({
        page: pageParam,
        pageSize,
        startDate,
        endDate,
        participantName,
      });

      const totalItems = data.meta?.total ?? 0;
      const totalPages = Math.ceil(totalItems / pageSize);

      return {
        items: data.data,
        nextPage: pageParam < totalPages ? pageParam + 1 : undefined,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime: 1000 * 60 * 5,
  });
}
