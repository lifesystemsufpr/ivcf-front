import { useInfiniteQuery } from "@tanstack/react-query";
import { ParticipantsService } from "../services/participants.service";

interface UseListParticipantsOptions {
  pageSize?: number;
}

export function useListParticipants({
  pageSize = 10,
}: UseListParticipantsOptions) {
  return useInfiniteQuery({
    queryKey: ["participants"],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const resp = await ParticipantsService.getParticipants({
        page: pageParam,
        pageSize: pageSize,
      });
      return resp;
    },
    getNextPageParam: (lastPage, allPages) => {
      const totalPages =
        (lastPage.meta?.total || 1) / (lastPage.meta?.pageSize || 1);
      const nextPage = allPages.length + 1;
      return nextPage <= totalPages ? nextPage : undefined;
    },
    staleTime: 10 * 60 * 1000,
  });
}
