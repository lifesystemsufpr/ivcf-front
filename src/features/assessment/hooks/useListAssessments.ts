import { useInfiniteQuery } from "@tanstack/react-query";
import { AssessmentService } from "../services/assessment.service";

export function useListAssessments() {
  return useInfiniteQuery({
    queryKey: ["assessments"],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const data = await AssessmentService.listAllAssessments({
        page: pageParam,
        pageSize: 10,
      });

      const totalItems = data.meta?.total ?? 0;
      const totalPages = Math.ceil(totalItems / 10);

      return {
        items: data.data,
        nextPage: pageParam < totalPages ? pageParam + 1 : undefined,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime: 1000 * 60 * 5,
  });
}
